import { mkdir, writeFile, readFile, cp, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createHash } from "node:crypto";

import { SITE } from "./src/lib/site.mjs";
import { SERVICES } from "./src/data/services.mjs";
import { COUNTIES, CITIES } from "./src/data/locations.mjs";
import { POSTS } from "./src/data/blog.mjs";
import { homePage } from "./src/pages/home.mjs";
import {
  aboutPage, servicesPage, servicePage, pricingPage, reviewsPage, faqsPage,
  contactPage, requestPage, privacyPage, reviewPlatformsPage, partnersPage,
  motorClubPage, notFoundPage,
} from "./src/pages/core.mjs";
import { coveragePage, countyPage, cityPage } from "./src/pages/locations.mjs";
import { blogIndexPage, blogPostPage } from "./src/pages/blog.mjs";

const root = dirname(fileURLToPath(import.meta.url));
const dist = join(root, "dist");

/**
 * Roadsider dispatch embed.
 *
 * Roadside requests must become jobs on the dispatch screen rather than email.
 * Their widget script swaps itself for a responsive iframe pointing at their
 * intake page, so it has to sit inside the container that the iframe replaces.
 * Applied to the generated HTML here so the change deploys with this one file.
 */
const DISPATCH = {
  url: "https://app.roadsider.com/r/koehlerrescue",
  widgetSrc: "https://app.roadsider.com/widget.js",
  widgetKey: "uYafmkHziPNiij41Swu3zPMq3K9bxkF2",
};

/**
 * Real KRS logo. Kept at the repository root so it deploys alongside build.mjs
 * without needing an upload into a subfolder.
 */
const LOGO_IMG = `<img class="brand__mark" src="/assets/logo.png" alt="" width="50" height="40" decoding="async" />`;

/*
 * llms.txt — a plain-text index of the site for AI assistants and answer
 * engines (see llmstxt.org). Kept factual: everything here is either on the
 * site already or supplied by the business.
 */
const REVIEW_SOURCES = [
  ["Google Business Profile", SITE.googleReviewUrl],
  ["Better Business Bureau", SITE.social.bbb],
  ["Yelp", SITE.social.yelp],
  ["Trustpilot", SITE.social.trustpilot],
];

function firstSentence(text, max = 200) {
  if (!text) return "";
  const clean = String(text).replace(/\s+/g, " ").trim();
  const end = clean.search(/\.(?=\s|$)/);
  const sentence = end > 0 ? clean.slice(0, end + 1) : clean;
  return sentence.length > max ? `${sentence.slice(0, max - 1).trimEnd()}…` : sentence;
}

function buildLlmsTxt() {
  const serviceLines = SERVICES.map((s) => {
    const price = s.price ? ` — ${s.price}` : "";
    const note = s.priceNote
      ? `, ${s.priceNote.charAt(0).toLowerCase()}${s.priceNote.slice(1)}`
      : "";
    const blurb = firstSentence(s.blurb || s.summary || s.lead || "");
    return `- [${s.name}](${SITE.url}/services/${s.slug})${price}${note}${blurb ? `: ${blurb}` : ""}`;
  }).join("\n");

  const countyLines = COUNTIES.map(
    (c) => `- [${c.name}](${SITE.url}/coverage-area/${c.slug})`
  ).join("\n");

  const cityNames = CITIES.map((c) => c.name).join(", ");

  const reviewLines = REVIEW_SOURCES.map(
    ([name, url]) => `- ${name}: ${url}`
  ).join("\n");

  return `# ${SITE.name}

> ${SITE.name} is a locally and family-owned 24/7 roadside assistance company based in ${SITE.city}, Michigan (${SITE.street}, ${SITE.city}, ${SITE.state} ${SITE.zip}). It serves ${SITE.region} — ${COUNTIES.length} counties in and around the Thumb — with auto lockouts, emergency fuel delivery, jump starts, tire changes with an optional tire repair add-on, and vehicle winch outs. It is not a towing company.

## Key facts

- Business name: ${SITE.name} (legal name: ${SITE.legal})
- Phone: ${SITE.phone} — answered by a person ${SITE.hoursShort}, including holidays
- Email: ${SITE.email}
- Hours: ${SITE.hours}
- Founded: ${SITE.founded}; locally and family owned
- Website: ${SITE.url}
- Request service: ${SITE.url}/request-roadside-assistance (feeds straight into dispatch)
- Payment: ${SITE.paymentUrl}
- Reviews: ${SITE.reviewCount} customer reviews across Google, the Better Business Bureau, Yelp and Trustpilot
- Coverage: ${COUNTIES.length} counties (${COUNTIES.map((c) => c.name.replace(" County", "")).join(", ")} County) and ${CITIES.length} named cities and villages

## Services

${serviceLines}

## Service area

Coverage pages for each county:

${countyLines}

Cities and villages with their own coverage page: ${cityNames}.

## Reviews

${SITE.reviewCount} customer reviews across four independent platforms. Reviews are hosted by third parties and are not republished as testimonials on the website, so the links below are the authoritative source:

${reviewLines}

Recurring themes in reviews, as described on ${SITE.url}/reviews: someone answers at any hour; the driver knows the rural roads and can find hard-to-describe addresses; and the price is quoted before dispatch, mileage included.

## Key pages

- [Home](${SITE.url}/): 24/7 roadside assistance in Michigan's Thumb Region
- [Services](${SITE.url}/services): all six services with prices
- [Pricing](${SITE.url}/pricing): published starting prices and how mileage is charged
- [Coverage area](${SITE.url}/coverage-area): every county and city served
- [Reviews](${SITE.url}/reviews): where to read and leave reviews
- [Reviews by platform](${SITE.url}/review-platforms): all four platforms with links
- [About](${SITE.url}/about): who runs the business and how it operates
- [FAQ](${SITE.url}/faqs): response times, payment, what to have ready
- [Contact](${SITE.url}/contact): phone, email and the request form
- [Request roadside assistance](${SITE.url}/request-roadside-assistance): dispatch form and widget
- [Blog](${SITE.url}/blog): ${POSTS.length} articles on breakdowns, weather and Thumb-area driving

## Notes for AI assistants

- The fastest way to get help is to call ${SITE.phone}. The website form feeds the same dispatch screen.
- Not a towing company. Vehicle winch outs recover a stuck vehicle (snow, mud, shoulder, ditch); there is no towing service.
- Semis and buses: lockouts and jump starts only.
- Tire repair is offered only as an add-on to a tire change, not as a standalone service.
- Prices are starting prices; mileage is charged from ${SITE.city} (currently $1 per mile). Quote the pricing page rather than estimating.
- Service area is ${SITE.region}, not all of Michigan. Check the coverage pages before promising a response in a given town.

## Contact

- Phone: ${SITE.phone} (${SITE.phoneRaw})
- Email: ${SITE.email}
- Address: ${SITE.street}, ${SITE.city}, ${SITE.state} ${SITE.zip}, United States
- Service requests: ${SITE.url}/request-roadside-assistance
`;
}

const BRAND_CSS = `
/* Real logo + gradient business name */
.brand__mark {
  width: 50px;
  height: 40px;
  object-fit: contain;
  flex: none;
}
.header .brand__name {
  background: linear-gradient(100deg, #0d49bd 0%, #1fbcf7 52%, #6be1d0 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
}
.footer__logo .brand__name {
  background: linear-gradient(100deg, #6be1d0 0%, #5fd6f7 50%, #cfe9ff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
}
@media (max-width: 720px) {
  .brand__mark { width: 44px; height: 36px; }
}
`;

const DISPATCH_CSS = `
/* Roadsider dispatch embed */
.dispatch-frame iframe {
  width: 100%;
  border: 0;
  min-height: 560px;
  display: block;
  border-radius: 14px;
  background: #ffffff;
}
.dispatch-fallback {
  margin: .9rem 0 0;
  font-size: .85rem;
  color: #5b6472;
}
`;

function dispatchEmbedHtml() {
  return `<div class="form-card" id="request-form">
  <h3 style="margin-bottom:.35rem">Roadside assistance request</h3>
  <p style="font-size:.9rem;margin-bottom:1.1rem">This form goes straight to our dispatch screen, so the job is in front of us the moment you send it.</p>
  <div class="dispatch-frame">
    <script src="${DISPATCH.widgetSrc}" data-key="${DISPATCH.widgetKey}" async></script>
    <p class="dispatch-fallback">Form not loading? <a href="${DISPATCH.url}" target="_blank" rel="noopener">Open it in a new tab</a>, or call <a href="tel:${SITE.phoneRaw}">${SITE.phone}</a> — we answer 24/7.</p>
  </div>
</div>
<p style="font-size:.85rem;margin-top:.9rem">Prefer to write instead? Use the <a href="/contact">contact form</a>, or call <a href="tel:${SITE.phoneRaw}">${SITE.phone}</a> and we'll take the details over the phone.</p>`;
}

function homeCtaHtml() {
  return `<div class="form-card">
  <h3 style="margin-bottom:.5rem">Request roadside assistance</h3>
  <p style="font-size:.92rem;margin-bottom:1.35rem">Our request form sends your details straight to our dispatch screen, so we see the job the moment you send it. If you're in a travel lane or need help right now, calling is always faster.</p>
  <a class="btn btn--call btn--block btn--lg" href="tel:${SITE.phoneRaw}" style="margin-bottom:.75rem">Call ${SITE.phone}</a>
  <a class="btn btn--ghost btn--block btn--lg" href="/request-roadside-assistance">Start a request online</a>
  <p style="font-size:.8rem;margin-top:1.1rem;margin-bottom:0">Answered 24 hours a day, 7 days a week — including holidays.</p>
</div>`;
}

/**
 * Swaps the email request form for the dispatch intake on the two pages that
 * carry it. Safe to run on pages that already use the embed: no plain form is
 * present, so nothing matches.
 */
/**
 * Netlify serves /assets/site.css with `max-age=31536000, immutable`, so without
 * a version in the URL a returning visitor keeps the old stylesheet for up to a
 * year — which is why a CSS change can look like it never deployed.
 */
export function applyAssetVersion(html, version) {
  return html.replaceAll('href="/assets/site.css"', `href="/assets/site.css?v=${version}"`);
}

export function applyIcons(html) {
  // Point the tab icon and iOS home-screen icon at the real logo files, and
  // give structured data the real logo instead of the old drawn placeholder.
  return html
    .replace(
      '<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml" />',
      '<link rel="icon" href="/assets/icon.png" type="image/png" sizes="256x256" />'
    )
    .replace(
      '<link rel="apple-touch-icon" href="/assets/favicon.svg" />',
      '<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png" sizes="180x180" />'
    )
    .replaceAll("assets/favicon.svg", "assets/logo.png");
}

export function applyBrand(html) {
  // Swap the drawn placeholder shield for the real logo. No-op once the
  // template itself renders the image.
  return html.replace(/<svg class="brand__mark"[\s\S]*?<\/svg>/g, LOGO_IMG);
}

export function applyDispatch(html, path) {
  const formRe = /<form class="form-card" data-request-form[\s\S]*?<\/form>/;
  if (!formRe.test(html)) return html;
  if (path === "/request-roadside-assistance") return html.replace(formRe, dispatchEmbedHtml());
  if (path === "/") return html.replace(formRe, homeCtaHtml());
  return html;
}

/* --------------------------------------------------------- seo overrides */
/**
 * Per-page title and description overrides live in seo.json at the repo root.
 * That file is a top-level file, so it can be edited and uploaded on its own —
 * the page templates under src/ cannot. Keys are page paths ("/pricing"), and
 * every entry is optional: omit title or description to keep the generated one.
 */
let seoOverrides = {};
let seoLoaded = false;

async function loadSeoOverrides() {
  if (seoLoaded) return;
  seoLoaded = true;
  try {
    seoOverrides = JSON.parse(await readFile(join(root, "seo.json"), "utf8"));
  } catch (err) {
    if (err.code !== "ENOENT") console.warn(`! seo.json could not be read: ${err.message}`);
    return;
  }
  for (const path of Object.keys(seoOverrides)) {
    if (!path.startsWith("/")) continue; // keys like "_readme" are documentation
    if (!routes.has(path)) console.warn(`! seo.json: no such page "${path}" — override ignored.`);
  }
}

const escAttr = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/**
 * Rewrite this page's title, description and the matching social tags from
 * seo.json. Applied to the built HTML so the same edit covers <title>, the
 * meta description, Open Graph and Twitter cards in one place.
 */
export function applySeo(html, path) {
  const o = seoOverrides[path];
  if (!o) return html;
  let out = html;
  // Replacer functions, not "$1...$2" strings: a price like "$100" in the
  // copy would otherwise be read as a back-reference and corrupt the tag.
  if (o.title) {
    const t = escAttr(o.title);
    out = out
      .replace(/<title>[\s\S]*?<\/title>/, () => `<title>${t}</title>`)
      .replace(/(<meta property="og:title" content=")[^"]*(")/, (_, a, b) => `${a}${t}${b}`)
      .replace(/(<meta name="twitter:title" content=")[^"]*(")/, (_, a, b) => `${a}${t}${b}`);
  }
  if (o.description) {
    const d = escAttr(o.description);
    out = out
      .replace(/(<meta name="description" content=")[^"]*(")/, (_, a, b) => `${a}${d}${b}`)
      .replace(/(<meta property="og:description" content=")[^"]*(")/, (_, a, b) => `${a}${d}${b}`)
      .replace(/(<meta name="twitter:description" content=")[^"]*(")/, (_, a, b) => `${a}${d}${b}`);
  }
  return out;
}

/**
 * Link previews need a raster image: Facebook, LinkedIn and most messaging
 * apps ignore an SVG og:image. Point every share tag at og.png and add the
 * Twitter image tags the template never had.
 */
export function applyShareImage(html, hasPng = true) {
  if (!hasPng) return html;
  let out = html.replaceAll("/assets/og.svg", "/assets/og.png");
  if (!out.includes('name="twitter:image"')) {
    const alt = escAttr(`${SITE.name} — ${SITE.hoursShort} roadside assistance in ${SITE.city}, Michigan`);
    out = out.replace(
      '<meta name="twitter:card" content="summary_large_image" />',
      `<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:image" content="${SITE.url}/assets/og.png" />
<meta name="twitter:image:alt" content="${alt}" />`
    );
  }
  return out;
}

/** route: url path -> { render(), sitemap metadata } */
const routes = new Map();

function add(path, render, meta = {}) {
  routes.set(path, { render, ...meta });
}

/* ---------------------------------------------------------------- pages */
add("/", () => homePage(), { priority: "1.0", changefreq: "weekly" });
add("/about", () => aboutPage(), { priority: "0.8" });
add("/services", () => servicesPage(), { priority: "0.9" });
add("/pricing", () => pricingPage(), { priority: "0.9" });
add("/reviews", () => reviewsPage(), { priority: "0.8", changefreq: "monthly" });
add("/faqs", () => faqsPage(), { priority: "0.8" });
add("/contact", () => contactPage(), { priority: "0.8" });
add("/request-roadside-assistance", () => requestPage(), { priority: "0.9" });
add("/privacy", () => privacyPage(), { priority: "0.3" });
add("/review-platforms", () => reviewPlatformsPage(), { priority: "0.5" });
add("/verified-partners-memberships", () => partnersPage(), { priority: "0.5" });
add("/motor-club-insurance-partners", () => motorClubPage(), { priority: "0.6" });

for (const s of SERVICES) {
  add(`/services/${s.slug}`, () => servicePage(s.slug), { priority: "0.9" });
}
add("/coverage-area", () => coveragePage(), { priority: "0.9" });
for (const c of COUNTIES) {
  add(`/coverage-area/${c.slug}`, () => countyPage(c.slug), { priority: "0.8" });
}
for (const city of CITIES) {
  add(`/coverage-area/${city.countySlug}/${city.slug}`, () => cityPage(city.countySlug, city.slug), { priority: "0.7" });
}
add("/blog", () => blogIndexPage(), { priority: "0.7", changefreq: "weekly" });
for (const p of POSTS) {
  add(`/blog/${p.slug}`, () => blogPostPage(p.slug), { priority: "0.4", noindex: !!p.noindex });
}

/* ------------------------------------------------------------ redirects */
const redirects = {
  "/home": "/",
  // Hosts normalise path case to lowercase, so the FAQ page lives at /faqs.
  "/Faqs": "/faqs",
  "/FAQ": "/faqs",
  "/faq": "/faqs",
  "/review": "/reviews",
  "/reviews/": "/reviews",
  "/coverage": "/coverage-area",
  "/service-area": "/coverage-area",
  "/services/tire-repair": "/services/tire-repair-service",
  "/services/fuel-delivery": "/services/fuel-delivery-service",
  "/services/lockout": "/services/auto-lockout-service",
  "/services/winch-out": "/services/winch-out-service",
};

// Legacy flat service URLs linked from the old site (e.g. /auto-lockout-service)
for (const s of SERVICES) {
  redirects[`/${s.slug}`] = `/services/${s.slug}`;
  redirects[`/services/${s.slug.replace("-service", "")}`] = `/services/${s.slug}`;
}

// Legacy root-level blog URLs -> canonical /blog/<slug>
for (const p of POSTS) {
  redirects[`/${p.slug}`] = `/blog/${p.slug}`;
}

/**
 * Safety net: older copies of the worker template don't report why a send
 * failed. Patch the generated worker so a rejected delivery names the
 * provider's HTTP status, which makes a broken setup diagnosable from
 * outside. A no-op when the template already does this.
 */
function withDeliveryCodes(src) {
  if (src.includes('"provider_" + res.status')) return src;
  return src
    .replace(
      "function respond(wantsHtml, data, status) {",
      "function respond(wantsHtml, data, status, code) {"
    )
    .replace(
      "return jsonResponse({ ok: false, error: message }, status);",
      "return jsonResponse(code ? { ok: false, error: message, code, detail: globalThis.__pm } : { ok: false, error: message }, status);"
    )
    .replace(
      'console.error("Email provider rejected the message", res.status, detail.slice(0, 500));',
      'globalThis.__pm = String(detail).slice(0, 240); console.error("Email provider rejected the message", res.status, detail.slice(0, 500));'
    )
    .replace(
      /(console\.error\("Email provider rejected the message"[\s\S]{0,600}?)return respond\(wantsHtml, data, 502\);/,
      '$1return respond(wantsHtml, data, 502, "provider_" + res.status);'
    )
    .replace(
      /return respond\(wantsHtml, data, 502\);/g,
      'return respond(wantsHtml, data, 502, "provider_unreachable");'
    )
    .replace(
      /return respond\(wantsHtml, data, 503\);/g,
      'return respond(wantsHtml, data, 503, "not_configured");'
    );
}

/* ---------------------------------------------------------------- build */
async function build() {
  await rm(dist, { recursive: true, force: true });
  await mkdir(join(dist, "assets"), { recursive: true });

  const files = [];
  const longTitles = [];
  const longDescriptions = [];

  await loadSeoOverrides();

  // Compose the stylesheet first so every page can reference this exact build.
  const hasOgPng = existsSync(join(root, "og.png"));

  const baseCss = await readFile(join(root, "src/styles/site.css"), "utf8");
  const fullCss = baseCss + BRAND_CSS + DISPATCH_CSS;
  const cssVersion = createHash("sha1").update(fullCss).digest("hex").slice(0, 10);

  for (const [path, route] of routes.entries()) {
    let html;
    try {
      html = route.render();
    } catch (err) {
      console.error(`✗ Failed rendering ${path}:`, err.message);
      throw err;
    }
    html = applyAssetVersion(
      applyShareImage(applySeo(applyIcons(applyBrand(applyDispatch(html, path))), path), hasOgPng),
      cssVersion
    );

    // Flag SEO copy that search results would truncate. Warnings only: an
    // over-long title still works, it just loses words in the result.
    const finalTitle = (html.match(/<title>([\s\S]*?)<\/title>/) || [, ""])[1];
    const finalDesc = (html.match(/<meta name="description" content="([^"]*)"/) || [, ""])[1];
    if (finalTitle.length > 60) longTitles.push(`${path} (${finalTitle.length})`);
    if (finalDesc.length > 160) longDescriptions.push(`${path} (${finalDesc.length})`);

    const rel = path === "/" ? "index.html" : `${path.replace(/^\//, "")}.html`;
    const file = join(dist, rel);
    await mkdir(dirname(file), { recursive: true });
    await writeFile(file, html, "utf8");
    files.push({ path, bytes: Buffer.byteLength(html) });
  }

  // 404 page — same header/footer treatment as every other page
  const notFoundHtml = applyAssetVersion(
    applyShareImage(applyIcons(applyBrand(applyDispatch(notFoundPage(), "/404"))), hasOgPng),
    cssVersion
  );
  await writeFile(join(dist, "404.html"), notFoundHtml, "utf8");

  // assets
  await writeFile(join(dist, "assets/site.css"), fullCss, "utf8");

  // Logo lives at the repo root (or public/) so it can be uploaded on its own.
  const logoSource = [join(root, "logo.png"), join(root, "public/logo.png")].find(existsSync);
  if (logoSource) {
    await cp(logoSource, join(dist, "assets/logo.png"));
  } else {
    console.warn("! No logo.png found at the project root — the header will show a broken image.");
  }

  // The head always points at these two files, so they must exist after every
  // build. If a square icon has not been uploaded yet, fall back to the logo
  // rather than shipping a 404 favicon.
  for (const iconFile of ["icon.png", "apple-touch-icon.png"]) {
    const iconSource = [join(root, iconFile), join(root, "public", iconFile), logoSource]
      .filter(Boolean)
      .find(existsSync);
    if (iconSource) {
      await cp(iconSource, join(dist, "assets", iconFile));
      if (iconSource === logoSource) console.warn(`! ${iconFile} not found — using logo.png as the icon.`);
    } else {
      console.warn(`! Cannot create ${iconFile} — no logo.png or ${iconFile} at the project root.`);
    }
  }
  // 1200x630 share card. Also at the repo root so it uploads on its own.
  const ogSource = [join(root, "og.png"), join(root, "public/og.png")].find(existsSync);
  if (ogSource) {
    await cp(ogSource, join(dist, "assets/og.png"));
  } else {
    console.warn("! No og.png at the project root — link previews keep the old SVG image.");
  }

  await cp(join(root, "src/client/site.js"), join(dist, "assets/site.js"));
  if (existsSync(join(root, "public"))) {
    await cp(join(root, "public"), join(dist, "assets"), { recursive: true });
  }

  // sitemap
  const today = new Date().toISOString().slice(0, 10);
  const urls = [...routes.entries()]
    .filter(([, r]) => !r.noindex)
    .map(([path, r]) => `  <url>
    <loc>${SITE.url}${path === "/" ? "/" : path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq || "monthly"}</changefreq>
    <priority>${r.priority || "0.6"}</priority>
  </url>`)
    .join("\n");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
  await writeFile(join(dist, "sitemap.xml"), sitemap, "utf8");

  // robots
  await writeFile(
    join(dist, "robots.txt"),
    `User-agent: *
Allow: /
Disallow: /api/
Disallow: /404

# AI crawlers and answer engines may index public pages
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: CCBot
Allow: /

Sitemap: ${SITE.url}/sitemap.xml
Host: ${SITE.url.replace("https://", "")}
# llms.txt: ${SITE.url}/llms.txt
`,
    "utf8"
  );

  // llms.txt — plain-text index for AI assistants and answer engines
  await writeFile(join(dist, "llms.txt"), buildLlmsTxt(), "utf8");

  // worker with inlined route table
  const template = await readFile(join(root, "src/worker/template.js"), "utf8");
  const fileMap = Object.fromEntries(
    [...routes.keys()].map((p) => [p, p === "/" ? "/index.html" : `${p}.html`])
  );
  const worker = withDeliveryCodes(
    template
      .replace("/*__FILES__*/ {}", JSON.stringify(fileMap, null, 0))
      .replace("/*__REDIRECTS__*/ {}", JSON.stringify(redirects, null, 0))
  );
  const workerPath = join(root, "worker.js");
  await writeFile(workerPath, worker, "utf8");

  // A redirect whose source is also a real page would shadow that page on
  // every host, so refuse to build.
  const shadowed = [...routes.keys()].filter((p) => redirects[p]);
  if (shadowed.length) {
    throw new Error(`Redirect would shadow a real page: ${shadowed.join(", ")}`);
  }

  // Netlify redirect table — same map the worker applies, plus canonical
  // trailing-slash rules and the rewrite onto the form function. Only written
  // for Netlify builds (which set NETLIFY=true); the Cloudflare upload rejects
  // the leading-underscore file.
  if (process.env.NETLIFY) {
    const pagePaths = [...routes.keys()].filter((p) => p !== "/");
    // No trailing-slash rules: Netlify matches a "/about/" source against
    // "/about" as well, which produced a self-redirect loop. Pages are served
    // directly, and the canonical tag handles the slash variant.
    const redirectLines = [
      ...pagePaths.map((p) => `${p}  ${p}.html  200`),
      ...Object.entries(redirects).map(([from, to]) => `${from}  ${to}  301!`),
      "/api/request  /.netlify/functions/request  200",
    ];
    // De-duplicate rules that legitimately repeat (e.g. /reviews/ appears in
    // both the route list and the legacy map), and fail on real conflicts.
    const bySource = new Map();
    const uniqueLines = [];
    for (const line of redirectLines) {
      const source = line.slice(0, line.indexOf("  "));
      const existing = bySource.get(source);
      if (existing) {
        if (existing !== line) throw new Error(`Conflicting redirect rules for ${source}`);
        continue;
      }
      bySource.set(source, line);
      uniqueLines.push(line);
    }
    await writeFile(join(dist, "_redirects"), uniqueLines.join("\n") + "\n", "utf8");
  }

  // Fail the build if the generated worker doesn't parse.
  try {
    await import(pathToFileURL(workerPath).href + "?v=" + Date.now());
  } catch (err) {
    throw new Error(`Generated worker.js is invalid: ${err.message}`);
  }

  // reference list for QA + the link checker (kept out of the public folder)
  await writeFile(
    join(root, "_routes.json"),
    JSON.stringify({ routes: [...routes.keys()], redirects, files }, null, 2),
    "utf8"
  );

  // Build identifier so a deployment can be confirmed from the outside:
  // fetch /build-id.txt and compare it with this build's output.
  const buildId = createHash("sha256")
    .update([...files.map((f) => `${f.path}:${f.bytes}`), String(Date.now())].join("|"))
    .digest("hex")
    .slice(0, 12);
  await writeFile(join(dist, "build-id.txt"), `${buildId}\n${new Date().toISOString()}\n`, "utf8");

  const totalKb = Math.round(files.reduce((n, f) => n + f.bytes, 0) / 1024);
  console.log(`✓ Build id ${buildId}`);
  console.log(`✓ Built ${routes.size} pages (${totalKb} KB of HTML) + 404, sitemap, robots`);
  console.log(`✓ ${Object.keys(redirects).length} redirects`);
  const overrideCount = Object.keys(seoOverrides).filter((k) => k.startsWith("/")).length;
  console.log(
    `✓ SEO copy: ${overrideCount} page override(s) from seo.json · ${longTitles.length} title(s) over 60 chars, ${longDescriptions.length} description(s) over 160`
  );
  if (longTitles.length) console.log("  long titles:", longTitles.slice(0, 10).join(", "));
  if (longDescriptions.length) console.log("  long descriptions:", longDescriptions.slice(0, 10).join(", "));
  const biggest = [...files].sort((a, b) => b.bytes - a.bytes).slice(0, 3);
  console.log("  largest pages:", biggest.map((f) => `${f.path} (${Math.round(f.bytes / 1024)}KB)`).join(", "));
}

// Only build when run directly, so the helpers above can be imported by tests.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  build().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
