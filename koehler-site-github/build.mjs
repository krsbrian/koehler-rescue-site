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

/* ---------------------------------------------------------------- build */
async function build() {
  await rm(dist, { recursive: true, force: true });
  await mkdir(join(dist, "assets"), { recursive: true });

  const files = [];

  for (const [path, route] of routes.entries()) {
    let html;
    try {
      html = route.render();
    } catch (err) {
      console.error(`✗ Failed rendering ${path}:`, err.message);
      throw err;
    }
    const rel = path === "/" ? "index.html" : `${path.replace(/^\//, "")}.html`;
    const file = join(dist, rel);
    await mkdir(dirname(file), { recursive: true });
    await writeFile(file, html, "utf8");
    files.push({ path, bytes: Buffer.byteLength(html) });
  }

  // 404 page
  const notFoundHtml = notFoundPage();
  await writeFile(join(dist, "404.html"), notFoundHtml, "utf8");

  // assets
  await cp(join(root, "src/styles/site.css"), join(dist, "assets/site.css"));
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

# AI crawlers may index public pages
User-agent: GPTBot
Allow: /

Sitemap: ${SITE.url}/sitemap.xml
Host: ${SITE.url.replace("https://", "")}
`,
    "utf8"
  );

  // worker with inlined route table
  const template = await readFile(join(root, "src/worker/template.js"), "utf8");
  const fileMap = Object.fromEntries(
    [...routes.keys()].map((p) => [p, p === "/" ? "/index.html" : `${p}.html`])
  );
  const worker = template
    .replace("/*__FILES__*/ {}", JSON.stringify(fileMap, null, 0))
    .replace("/*__REDIRECTS__*/ {}", JSON.stringify(redirects, null, 0));
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
  const biggest = [...files].sort((a, b) => b.bytes - a.bytes).slice(0, 3);
  console.log("  largest pages:", biggest.map((f) => `${f.path} (${Math.round(f.bytes / 1024)}KB)`).join(", "));
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
