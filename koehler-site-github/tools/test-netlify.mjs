/**
 * Exercises the Netlify function wrapper with a stubbed email provider.
 * Proves the Netlify host behaves exactly like the Cloudflare Worker:
 * same validation, same origin check, same delivery, same status codes.
 *
 * Run: node tools/test-netlify.mjs   (after npm run build)
 */
import handler from "../netlify/functions/request.mjs";

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

const originalFetch = globalThis.fetch;
const originalEnv = { ...process.env };
let captured = null;

function stubProvider({ status = 200, body = '{"id":"test"}' } = {}) {
  captured = null;
  globalThis.fetch = async (url, init) => {
    captured = { url: String(url), init };
    return new Response(body, { status, headers: { "content-type": "application/json" } });
  };
}

function configure(env) {
  for (const key of ["RESEND_API_KEY", "CONTACT_TO", "CONTACT_FROM", "CONTACT_CC", "FORM_WEBHOOK_URL", "EMAIL_API_BASE"]) {
    delete process.env[key];
  }
  Object.assign(process.env, env);
}

function post(payload, headers = {}, path = "/api/request") {
  return new Request(`https://www.koehlerrescue.com${path}`, {
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

console.log("\nNetlify function");

configure({ RESEND_API_KEY: "re_test" });
stubProvider();
let res = await handler(post(valid));
let json = await res.json();
check("valid submission returns 200 + ok", res.status === 200 && json.ok === true, `got ${res.status}`);
check("provider endpoint is Resend /emails", captured?.url === "https://api.resend.com/emails", captured?.url);
let payload = JSON.parse(captured?.init?.body || "{}");
check("sends to the business inbox", payload.to?.[0] === "brian@koehlerrescue.com", JSON.stringify(payload.to));
check("body carries every field", ["Brian Koehler", "989-286-0100", "2016 Ford F-150"].every((v) => payload.text.includes(v)));

configure({ RESEND_API_KEY: "re_test", CONTACT_FROM: "Koehler Rescue Website <website@koehlerrescue.com>" });
stubProvider();
await handler(post(valid));
payload = JSON.parse(captured?.init?.body || "{}");
check("branded sender is used when configured", payload.from === "Koehler Rescue Website <website@koehlerrescue.com>", payload.from);

configure({});
stubProvider();
res = await handler(post(valid));
check("unconfigured returns 503 (never a fake success)", res.status === 503, `got ${res.status}`);
check("nothing was sent when unconfigured", captured === null);

configure({ RESEND_API_KEY: "re_test" });
stubProvider();
res = await handler(post({ ...valid, phone: "555" }));
json = await res.json();
check("short phone rejected with 400", res.status === 400 && json.fields?.includes("phone"), `got ${res.status}`);

stubProvider();
res = await handler(post({ ...valid, company: "spam bot" }));
json = await res.json();
check("honeypot silently discarded", res.status === 200 && json.skipped === true && captured === null);

stubProvider();
res = await handler(post(valid, { Origin: "https://evil.example" }));
check("cross-origin POST refused (403)", res.status === 403, `got ${res.status}`);

stubProvider({ status: 401, body: '{"message":"invalid api key"}' });
res = await handler(post(valid));
check("provider rejection surfaces as 502", res.status === 502, `got ${res.status}`);

stubProvider();
res = await handler(post(valid, {}, "/somewhere-else"));
check("unknown function path returns 404", res.status === 404, `got ${res.status}`);

stubProvider();
res = await handler(
  new Request("https://www.koehlerrescue.com/api/request", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "text/html" },
    body: new URLSearchParams(valid).toString(),
  })
);
const html = await res.text();
check("no-JS post renders a confirmation page", res.status === 200 && /We('|&#39;|’)ve got it/.test(html), `got ${res.status}`);

globalThis.fetch = originalFetch;
for (const key of Object.keys(process.env)) if (!(key in originalEnv)) delete process.env[key];
Object.assign(process.env, originalEnv);

console.log(`\n${passed} passed, ${failed} failed`);
if (failed) process.exit(1);
