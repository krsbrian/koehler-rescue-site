/**
 * QA: crawl the built site and verify every internal link resolves,
 * every page has a unique title/description/canonical, and no page
 * is missing an H1. Exit code 1 on any problem.
 */
import { readFile, readdir, stat } from "node:fs/promises";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "dist");

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else if (entry.name.endsWith(".html")) out.push(full);
  }
  return out;
}

const files = await walk(root);
const problems = [];
const titles = new Map();
const descs = new Map();
const canons = new Map();
const urls = new Set();

for (const file of files) {
  const html = await readFile(file, "utf8");
  const rel = "/" + relative(root, file).replace(/index\.html$/, "").replace(/\.html$/, "");
  const url = rel === "/404" ? null : rel;
  if (url) urls.add(url.replace(/\/$/, "") || "/");

  const title = html.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.trim();
  const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1];
  const canon = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);

  if (!title) problems.push(`${rel}: missing <title>`);
  if (!desc) problems.push(`${rel}: missing meta description`);
  if (!canon) problems.push(`${rel}: missing canonical`);
  if (!h1) problems.push(`${rel}: missing <h1>`);
  if (html.includes("undefined") && !/undefined/.test(desc || "")) {
    // catches template mistakes like `${x}` where x was undefined
    if (/>(undefined)<|\bundefined\b/.test(html.replace(/<script[\s\S]*?<\/script>/g, ""))) {
      problems.push(`${rel}: contains the literal text "undefined"`);
    }
  }

  if (title) {
    if (titles.has(title)) problems.push(`${rel}: duplicate title with ${titles.get(title)}`);
    else titles.set(title, rel);
  }
  if (desc) {
    if (descs.has(desc)) problems.push(`${rel}: duplicate meta description with ${descs.get(desc)}`);
    else descs.set(desc, rel);
  }
  if (canon) {
    if (canons.has(canon)) problems.push(`${rel}: duplicate canonical with ${canons.get(canon)}`);
    else canons.set(canon, rel);
  }

  // internal links
  const hrefs = [...html.matchAll(/href="(\/[^"#?]*)/g)].map((m) => m[1]);
  for (const href of new Set(hrefs)) {
    if (href.startsWith("/assets/")) continue;
    if (href === "/api/request") continue;
    if (/\.(xml|txt|svg|png|jpg|webp|js|css)$/.test(href)) continue;
    const target = join(root, href === "/" ? "index.html" : `${href}.html`);
    try {
      const s = await stat(target);
      if (!s.isFile()) throw new Error();
    } catch {
      // allow redirects declared in the worker
      const routes = JSON.parse(await readFile(join(root, "..", "_routes.json"), "utf8"));
      if (routes.redirects[href]) continue;
      problems.push(`${rel}: broken internal link -> ${href}`);
    }
  }

  // phone links
  for (const tel of new Set([...html.matchAll(/href="(tel:[^"]+)"/g)].map((m) => m[1]))) {
    if (tel !== "tel:+19892860100") problems.push(`${rel}: unexpected phone link ${tel}`);
  }
}

const routes = JSON.parse(await readFile(join(root, "..", "_routes.json"), "utf8"));
for (const route of routes.routes) {
  if (!urls.has(route)) problems.push(`route ${route} has no generated page`);
}

console.log(`Checked ${files.length} HTML files, ${urls.size} URLs.`);
if (problems.length) {
  console.error(`\n✗ ${problems.length} problem(s):`);
  for (const p of problems) console.error("  - " + p);
  process.exit(1);
}
console.log("✓ All internal links resolve; titles, descriptions and canonicals are unique.");
