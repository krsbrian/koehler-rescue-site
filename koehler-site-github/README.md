# Koehler Rescue Services — Website

Static site for koehlerrescue.com. No framework, no database, no build dependencies — plain Node generates HTML from the files in `src/`.

## Commands

```bash
npm run build       # generates the site into dist/
npm run serve       # builds, then serves a local preview on port 3000
npm run check:links # crawls the build: broken links, duplicate titles/descriptions
```

Deploy target: any static host. The included `worker.js` (generated at build time) adds canonical-URL handling, legacy redirects, and the form endpoint on Cloudflare Workers.

## Where to edit content

| What | File |
| --- | --- |
| Phone, email, address, hours, review count, social links | `src/lib/site.mjs` |
| Navigation and coverage lists | `src/lib/site.mjs` |
| Services (copy, prices, FAQs) | `src/data/services.mjs` |
| Counties and communities | `src/data/locations.mjs` |
| Blog posts | `src/data/blog.mjs` |
| General FAQs | `src/data/faqs.mjs` |
| Page layouts | `src/pages/*.mjs` |
| Colours, type, spacing | `src/styles/site.css` (top of file) |

After any edit, run `npm run build` and `npm run check:links`.

## Form delivery

Both forms POST to `/api/request`. Two ways to receive them — only one is needed.

### Option A — Resend (about 3 minutes, no DNS)

1. Create a free account at resend.com using **brian@koehlerrescue.com**. Free tier: 3,000 emails/month, 100/day.
2. Dashboard → **API Keys** → **Create API Key** → copy the value starting with `re_`.
3. Add it to the host as a secret named **`RESEND_API_KEY`**.
4. Optional: set **`CONTACT_TO`** if submissions should go somewhere other than `brian@koehlerrescue.com`.

Until `koehlerrescue.com` is verified in Resend (Domains → Add Domain → the DNS records they give you), email sends from `onboarding@resend.dev`, which Resend only delivers to the account owner's own address. That is exactly the inbox you want, so it works immediately. Once the domain is verified, set:

```
CONTACT_FROM=Koehler Rescue Website <website@koehlerrescue.com>
```

for better deliverability and a branded sender.

### Option B — Webhook

Set **`FORM_WEBHOOK_URL`** to any endpoint that accepts a JSON POST (Zapier, Make, n8n, or a Google Apps Script web app). The payload is `{ name, phone, email, service, vehicle, location, details, company }`.

### Behaviour

If neither variable is set, the endpoint returns `503` and the page tells the customer to call — it never reports a false success. Provider failures return `502` with the same message. Submissions are validated (required fields, 10-digit phone, email format), a honeypot field blocks bots, and cross-origin POSTs are rejected.

Test the whole path without a key: `npm run test:forms`. Test locally with a key by copying `.env.example` to `.env` and running `npm run serve`.

## URLs

All 72 URLs from the previous sitemap are preserved exactly. Legacy flat URLs (`/auto-lockout-service`, root-level blog posts) 301 to their canonical paths. Redirects live in `build.mjs` and are compiled into `worker.js`.
