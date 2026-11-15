/**
 * Koehler Rescue Services — Cloudflare Worker
 * Serves the static site, canonicalises URLs, applies legacy redirects,
 * and handles service-request / contact form submissions.
 */

const FILES = /*__FILES__*/ {};
const REDIRECTS = /*__REDIRECTS__*/ {};

const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Frame-Options": "SAMEORIGIN",
  "Permissions-Policy": "geolocation=(), camera=(), microphone=()",
};

function htmlResponse(body, status = 200, extraHeaders = {}) {
  return new Response(body, {
    status,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
      ...SECURITY_HEADERS,
      ...extraHeaders,
    },
  });
}

function escapeHtml(s = "") {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/* --------------------------------------------------------------- forms */

const FORM_LIMITS = { name: 120, phone: 40, email: 200, service: 80, location: 200, vehicle: 120, details: 4000 };

function clean(fields) {
  const out = {};
  for (const [key, max] of Object.entries(FORM_LIMITS)) {
    const value = fields[key];
    if (typeof value === "string") out[key] = value.trim().slice(0, max);
  }
  return out;
}

function validate(data) {
  const errors = [];
  if (!data.name) errors.push("name");
  const digits = (data.phone || "").replace(/\D/g, "");
  if (digits.length < 10) errors.push("phone");
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email)) errors.push("email");
  if (!data.details && !data.service) errors.push("details");
  return errors;
}

function isSameOrigin(request) {
  const origin = request.headers.get("Origin");
  if (!origin) return true; // non-browser / no-JS form post
  try {
    return new URL(origin).host === new URL(request.url).host;
  } catch {
    return false;
  }
}

function jsonResponse(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...SECURITY_HEADERS,
    },
  });
}

function thankYouPage(data) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>Request received | Koehler Rescue Services</title>
<meta name="robots" content="noindex"><link rel="stylesheet" href="/assets/site.css">
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
</head><body>
<main id="main"><section class="page-hero" style="min-height:70vh;display:grid;align-items:center">
<div class="page-hero__glow"></div><div class="container" style="position:relative">
<span class="hero__badge"><i></i> Request received</span>
<h1>We've got it${data.name ? `, ${escapeHtml(data.name.split(" ")[0])}` : ""}.</h1>
<p>Your request has been sent to our 24/7 team${data.service ? ` for <strong>${escapeHtml(data.service)}</strong>` : ""}. We'll call you back on the number you gave us.</p>
<p><strong>Calling is still faster.</strong> If you're near traffic or need help right now, call <a href="tel:+19892860100" style="color:#6BE1D0">989-286-0100</a>.</p>
<div class="btn-row" style="margin-top:1.5rem"><a class="btn btn--call btn--lg" href="tel:+19892860100">Call 989-286-0100</a><a class="btn btn--ghost btn--lg" href="/">Back to home</a></div>
</div></section></main></body></html>`;
}

async function handleForm(request, env) {
  if (!isSameOrigin(request)) {
    return jsonResponse({ ok: false, error: "Cross-origin requests are not accepted." }, 403);
  }

  let payload = {};
  const contentType = request.headers.get("Content-Type") || "";

  try {
    if (contentType.includes("application/json")) {
      payload = await request.json();
    } else {
      const form = await request.formData();
      payload = Object.fromEntries(form.entries());
    }
  } catch {
    return jsonResponse({ ok: false, error: "Could not read the submitted form." }, 400);
  }

  // honeypot
  if (payload.company) {
    return jsonResponse({ ok: true, skipped: true });
  }

  const data = clean(payload);
  const errors = validate(data);
  const wantsHtml = (request.headers.get("Accept") || "").includes("text/html");

  if (errors.length) {
    if (wantsHtml) {
      return htmlResponse(
        `<!doctype html><title>Check your details</title><meta name="robots" content="noindex"><body style="font-family:system-ui;padding:2rem;max-width:38rem;margin:auto"><h1>Please check your details</h1><p>We couldn't read: ${errors.join(", ")}. <a href="/request-roadside-assistance">Go back and try again</a>, or call <a href="tel:+19892860100">989-286-0100</a>.</p></body>`,
        400
      );
    }
    return jsonResponse({ ok: false, error: "Please check the highlighted fields.", fields: errors }, 400);
  }

  const apiKey = env.RESEND_API_KEY;
  const webhook = env.FORM_WEBHOOK_URL;
  const to = env.CONTACT_TO || "brian@koehlerrescue.com";
  // Default sender works with an unverified domain, but Resend will only deliver
  // it to the account owner's own address. After verifying koehlerrescue.com,
  // set CONTACT_FROM="Koehler Rescue Website <website@koehlerrescue.com>".
  const from = env.CONTACT_FROM || "Koehler Rescue Website <onboarding@resend.dev>";
  const apiBase = (env.EMAIL_API_BASE || "https://api.resend.com").replace(/\/+$/, "");

  const isRoadside =
    Boolean(data.location || data.vehicle) ||
    !/question|quote|billing|partner/i.test(data.service || "");
  const subject = `${isRoadside ? "Roadside request" : "Website message"}: ${
    data.service || "General"
  } — ${data.name} (${data.phone})`;
  const mail = buildEmail(data, subject, request);

  // 1. Preferred: transactional email API
  if (apiKey) {
    try {
      const res = await fetch(`${apiBase}/emails`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: [to],
          ...(env.CONTACT_CC
            ? { cc: String(env.CONTACT_CC).split(",").map((s) => s.trim()).filter(Boolean) }
            : {}),
          reply_to: data.email || undefined,
          subject,
          text: mail.text,
          html: mail.html,
        }),
      });
      if (!res.ok) {
        const detail = await res.text().catch(() => "");
        console.error("Email provider rejected the message", res.status, detail.slice(0, 500));
        if (res.status === 403 && /own email address/i.test(detail)) {
          console.error(
            "Hint: onboarding@resend.dev can only deliver to the Resend account owner's address. Verify koehlerrescue.com in Resend, then set CONTACT_FROM to an address on that domain."
          );
        }
        if (res.status === 401) {
          console.error("Hint: the API key was rejected. Check RESEND_API_KEY is current and has sending permission.");
        }
        return respond(wantsHtml, data, 502);
      }
      return respond(wantsHtml, data, 200);
    } catch (err) {
      console.error("Email send failed", err.message);
      return respond(wantsHtml, data, 502);
    }
  }

  // 2. Fallback: generic webhook (Zapier, Make, n8n, Google Apps Script, etc.)
  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        console.error("Webhook error", res.status);
        return respond(wantsHtml, data, 502);
      }
      return respond(wantsHtml, data, 200);
    } catch (err) {
      console.error("Webhook failed", err.message);
      return respond(wantsHtml, data, 502);
    }
  }

  // 3. Not configured — never fake a success.
  console.error("No delivery method configured (RESEND_API_KEY or FORM_WEBHOOK_URL). Request:", mail.text);
  return respond(wantsHtml, data, 503);
}

function buildEmail(data, subject, request) {
  const rows = [
    ["Name", data.name],
    ["Phone", data.phone],
    ["Email", data.email],
    ["Service", data.service],
    ["Vehicle", data.vehicle],
    ["Location", data.location],
  ].filter(([, v]) => v);

  const submitted = new Date().toISOString();
  const page = request.headers.get("Referer") || "direct";

  const text = [
    subject,
    "",
    ...rows.map(([k, v]) => `${k}: ${v}`),
    "",
    "Details:",
    data.details || "(none provided)",
    "",
    `Submitted: ${submitted}`,
    `Page: ${page}`,
    "",
    "Reply to this email to reach the customer directly, or call the number above.",
  ].join("\n");

  const h = (s) =>
    String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const telHref = "tel:" + String(data.phone || "").replace(/[^\d+]/g, "");

  const html = `<!doctype html><html><body style="margin:0;padding:24px;background:#f4f7fb;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#101a3d">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e3e8f0">
    <tr><td style="background:#0a1138;padding:20px 24px">
      <div style="color:#6be1d0;font-size:11px;letter-spacing:2px;text-transform:uppercase;font-weight:700">Koehler Rescue Services</div>
      <div style="color:#ffffff;font-size:20px;font-weight:700;margin-top:6px;line-height:1.3">${h(subject)}</div>
    </td></tr>
    <tr><td style="padding:6px 24px 0">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        ${rows
          .map(
            ([k, v]) =>
              `<tr><td style="padding:10px 0;border-bottom:1px solid #eef2f8;color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:.7px;width:104px;vertical-align:top">${h(k)}</td><td style="padding:10px 0;border-bottom:1px solid #eef2f8;font-size:15px;font-weight:600">${h(v)}</td></tr>`
          )
          .join("")}
      </table>
    </td></tr>
    <tr><td style="padding:18px 24px 0">
      <div style="color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:.7px;margin-bottom:6px">Details</div>
      <div style="font-size:15px;line-height:1.6;white-space:pre-wrap">${h(data.details || "(none provided)")}</div>
    </td></tr>
    <tr><td style="padding:22px 24px 26px">
      <a href="${h(telHref)}" style="display:inline-block;background:#03645a;color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;padding:13px 22px;border-radius:999px">Call ${h(data.phone)}</a>
      <div style="color:#94a3b8;font-size:11px;margin-top:16px;line-height:1.5">Submitted ${h(submitted)}<br>From ${h(page)}</div>
    </td></tr>
  </table>
</body></html>`;

  return { text, html };
}

function respond(wantsHtml, data, status) {
  if (status === 200) {
    if (wantsHtml) return htmlResponse(thankYouPage(data), 200);
    return jsonResponse({ ok: true });
  }
  const message =
    status === 503
      ? "Online requests aren't connected yet. Please call 989-286-0100 — we answer 24/7."
      : "We couldn't send that automatically. Please call 989-286-0100 — we answer 24/7.";
  if (wantsHtml) {
    return htmlResponse(
      `<!doctype html><title>Please call us</title><meta name="robots" content="noindex"><body style="font-family:system-ui;padding:2rem;max-width:38rem;margin:auto"><h1>Please call us</h1><p>${message}</p><p><a href="tel:+19892860100" style="font-size:1.4rem;font-weight:700">989-286-0100</a></p><p>brian@koehlerrescue.com</p></body>`,
      status
    );
  }
  return jsonResponse({ ok: false, error: message }, status);
}

function fetchAsset(env, target, request) {
  return env.ASSETS.fetch(
    new Request(target, { method: "GET", headers: request.headers })
  );
}

/* --------------------------------------------------------------- fetch */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    let path = url.pathname;

    if (path.startsWith("/api/")) {
      if (path !== "/api/request") {
        return jsonResponse({ ok: false, error: "Not found" }, 404);
      }
      if (request.method !== "POST") {
        return jsonResponse({ ok: false, error: "Method not allowed" }, 405);
      }
      return handleForm(request, env);
    }

    if (!env.ASSETS) {
      return new Response("Static assets binding unavailable", { status: 500 });
    }

    // Normalise trailing slashes and duplicate slashes to the canonical form.
    const cleaned = path.replace(/\/{2,}/g, "/");
    if (cleaned !== path || (path.length > 1 && path.endsWith("/"))) {
      const target = (cleaned.length > 1 ? cleaned.replace(/\/+$/, "") : "/") + url.search;
      return Response.redirect(url.origin + target, 301);
    }

    // Case corrections (e.g. /faqs -> /Faqs). Guard against redirecting a
    // canonical path onto itself, which would loop forever.
    const lower = path.toLowerCase();
    if (lower !== path) {
      const canonical = REDIRECTS[lower];
      if (canonical && canonical !== path) {
        return Response.redirect(url.origin + canonical, 301);
      }
    }

    if (REDIRECTS[path]) {
      return Response.redirect(url.origin + REDIRECTS[path], 301);
    }

    const file = FILES[path];
    if (file) {
      let res = await fetchAsset(env, url.origin + file, request);
      // Some asset configurations answer a .html path with a redirect to the
      // clean URL. Follow it once so the page is actually returned.
      if (res.status >= 300 && res.status < 400) {
        const location = res.headers.get("Location");
        if (location) {
          res = await fetchAsset(env, new URL(location, url.origin).toString(), request);
        }
      }
      if (res.ok) {
        const headers = new Headers(res.headers);
        for (const [k, v] of Object.entries(SECURITY_HEADERS)) headers.set(k, v);
        headers.set("Cache-Control", "public, max-age=0, must-revalidate");
        return new Response(res.body, { status: 200, headers });
      }
    }

    // Static asset (CSS/JS/images/sitemap/robots)
    const res = await env.ASSETS.fetch(request);
    if (res.status === 404) {
      const nf = await env.ASSETS.fetch(
        new Request(url.origin + "/404.html", { method: "GET", headers: request.headers })
      );
      if (nf.ok) {
        const headers = new Headers(nf.headers);
        for (const [k, v] of Object.entries(SECURITY_HEADERS)) headers.set(k, v);
        return new Response(nf.body, { status: 404, headers });
      }
    }
    const headers = new Headers(res.headers);
    for (const [k, v] of Object.entries(SECURITY_HEADERS)) headers.set(k, v);
    return new Response(res.body, { status: res.status, headers });
  },
};
