/**
 * Exercises the form handler in worker.js with a stubbed email provider.
 * Proves validation, origin checks, spam blocking, payload shape and
 * success/failure responses — without using a real API key.
 *
 * Run: node tools/test-form.mjs   (after npm run build)
 */
import worker from "../worker.js";

let passed = 0;
let failed = 0;

function check(name, condition, detail = "") {
  if (condition) {
    passed++;
    console.log(`  ✓ ${name}`);
  } else {
    failed++;
    console.error(`  ✗ ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

const ASSETS = {
  fetch: async () => new Response("<html>asset</html>", { status: 200, headers: { "content-type": "text/html" } }),
};

const originalFetch = globalThis.fetch;
let captured = null;

function stubProvider({ status = 200, body = '{"id":"test"}' } = {}) {
  captured = null;
  globalThis.fetch = async (url, init) => {
    captured = { url: String(url), init };
    return new Response(body, { status, headers: { "content-type": "application/json" } });
  };
}

function post(payload, headers = {}) {
  return new Request("https://koehlerrescue.com/api/request", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(payload),
  });
}

const valid = {
  name: "Brian Koehler",
  phone: "989-286-0100",
  service: "Lockout",
  vehicle: "2016 Ford F-150",
  location: "M-81 near Caro",
  details: "Keys locked inside, engine off.",
};

/* ---------------------------------------------------------------- tests */
console.log("\nForm handler");

stubProvider();
let res = await worker.fetch(post(valid), { RESEND_API_KEY: "re_test", ASSETS }, {});
let json = await res.json();
check("valid submission returns 200 + ok", res.status === 200 && json.ok === true, `got ${res.status}`);
check("provider endpoint is Resend /emails", captured?.url === "https://api.resend.com/emails", captured?.url);

const payload = JSON.parse(captured?.init?.body || "{}");
check("sends to the business inbox", Array.isArray(payload.to) && payload.to[0] === "brian@koehlerrescue.com", JSON.stringify(payload.to));
check("sends from the default test sender", String(payload.from).includes("onboarding@resend.dev"), payload.from);
check("subject includes service, name and phone",
  /Lockout/.test(payload.subject) && /Brian Koehler/.test(payload.subject) && /989-286-0100/.test(payload.subject),
  payload.subject);
check("body carries every field", ["Brian Koehler", "989-286-0100", "2016 Ford F-150", "M-81 near Caro", "Keys locked inside"].every((v) => payload.text.includes(v)), payload.text);
check("includes an HTML version", typeof payload.html === "string" && payload.html.includes("<table"));
check("authorization header uses the key", captured?.init?.headers?.Authorization === "Bearer re_test");

stubProvider();
res = await worker.fetch(post(valid), { ASSETS, FORM_WEBHOOK_URL: "https://hooks.example.com/x" }, {});
json = await res.json();
check("webhook fallback works", res.status === 200 && json.ok === true, `got ${res.status}`);
check("webhook receives JSON fields", JSON.parse(captured.init.body).location === "M-81 near Caro");

stubProvider();
res = await worker.fetch(post(valid), { ASSETS }, {});
check("unconfigured returns 503 (never a fake success)", res.status === 503, `got ${res.status}`);

stubProvider();
res = await worker.fetch(post({ ...valid, phone: "555" }), { RESEND_API_KEY: "re_test", ASSETS }, {});
json = await res.json();
check("short phone rejected with 400", res.status === 400 && json.fields.includes("phone"), `got ${res.status}`);

stubProvider();
res = await worker.fetch(post({ ...valid, name: "" }), { RESEND_API_KEY: "re_test", ASSETS }, {});
check("missing name rejected", res.status === 400);

stubProvider();
res = await worker.fetch(post({ ...valid, company: "spam bot" }), { RESEND_API_KEY: "re_test", ASSETS }, {});
json = await res.json();
check("honeypot silently discarded", res.status === 200 && json.skipped === true && captured === null);

stubProvider();
res = await worker.fetch(post(valid, { Origin: "https://evil.example" }), { RESEND_API_KEY: "re_test", ASSETS }, {});
check("cross-origin POST refused (403)", res.status === 403, `got ${res.status}`);

stubProvider({ status: 403, body: '{"message":"You can only send testing emails to your own email address"}' });
res = await worker.fetch(post(valid), { RESEND_API_KEY: "re_test", ASSETS }, {});
check("provider rejection surfaces as 502", res.status === 502, `got ${res.status}`);

stubProvider();
res = await worker.fetch(
  new Request("https://koehlerrescue.com/api/request", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "text/html" },
    body: new URLSearchParams(valid).toString(),
  }),
  { RESEND_API_KEY: "re_test", ASSETS },
  {}
);
const html = await res.text();
check("no-JS form post renders a confirmation page", res.status === 200 && html.includes("We're") || html.includes("We&#39;ve") || html.includes("We've"), `got ${res.status}`);

stubProvider();
res = await worker.fetch(
  new Request("https://koehlerrescue.com/api/request", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "text/html" },
    body: new URLSearchParams({ ...valid, phone: "1" }).toString(),
  }),
  { RESEND_API_KEY: "re_test", ASSETS },
  {}
);
check("no-JS invalid post explains what to fix", res.status === 400);

/* ------------------------------------------------------ routing checks */
console.log("\nRouting");
stubProvider();
res = await worker.fetch(new Request("https://koehlerrescue.com/", { headers: { Accept: "text/html" } }), { ASSETS }, {});
check("homepage is served", res.status === 200);

res = await worker.fetch(new Request("https://koehlerrescue.com/about/"), { ASSETS }, {});
check("trailing slash redirects (301)", res.status === 301 && res.headers.get("location").endsWith("/about"), `${res.status} ${res.headers.get("location")}`);

res = await worker.fetch(new Request("https://koehlerrescue.com/auto-lockout-service"), { ASSETS }, {});
check("legacy service URL redirects", res.status === 301 && res.headers.get("location").endsWith("/services/auto-lockout-service"), res.headers.get("location"));

res = await worker.fetch(new Request("https://koehlerrescue.com/faqs"), { ASSETS }, {});
check("lowercase /faqs redirects to /Faqs", res.status === 301 && res.headers.get("location").endsWith("/Faqs"), res.headers.get("location"));

res = await worker.fetch(new Request("https://koehlerrescue.com/Faqs"), { ASSETS }, {});
check("/Faqs is served, never self-redirected", res.status === 200, `got ${res.status} -> ${res.headers.get("location")}`);

res = await worker.fetch(new Request("https://koehlerrescue.com/Faqs/"), { ASSETS }, {});
check("/Faqs/ normalises once to /Faqs",
  res.status === 301 && res.headers.get("location").endsWith("/Faqs") && !res.headers.get("location").endsWith("/Faqs/"),
  res.headers.get("location"));

res = await worker.fetch(new Request("https://koehlerrescue.com/api/request"), { ASSETS }, {});
check("GET on the form endpoint returns 405", res.status === 405);

globalThis.fetch = originalFetch;

console.log(`\n${passed} passed, ${failed} failed`);
if (failed) process.exit(1);
