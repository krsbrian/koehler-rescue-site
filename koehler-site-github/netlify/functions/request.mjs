/**
 * Netlify Function — /api/request
 *
 * Delegates to the same handler the Cloudflare Worker uses, so validation,
 * the honeypot, the same-origin check, delivery and status codes are identical
 * on both hosts. The worker answers /api/* before it ever touches static
 * assets, so no ASSETS binding is needed here.
 */
import worker from "../../worker.js";

const ALLOWED_PATHS = new Set(["/api/request", "/.netlify/functions/request"]);

const ENV_KEYS = [
  "RESEND_API_KEY",
  "CONTACT_TO",
  "CONTACT_FROM",
  "CONTACT_CC",
  "FORM_WEBHOOK_URL",
  "EMAIL_API_BASE",
];

export default async function handler(request) {
  const url = new URL(request.url);

  if (!ALLOWED_PATHS.has(url.pathname)) {
    return new Response(JSON.stringify({ ok: false, error: "Not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  }

  const env = {};
  for (const key of ENV_KEYS) {
    if (process.env[key]) env[key] = process.env[key];
  }

  return worker.fetch(request, env, {});
}
