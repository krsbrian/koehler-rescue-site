import { SITE, tel } from "../lib/site.mjs";
import { icon, blogArt } from "../lib/art.mjs";
import {
  layout, ctaBand, breadcrumbs, localBusinessSchema, breadcrumbSchema,
} from "../lib/ui.mjs";
import { pageHero } from "./core.mjs";
import { POSTS, sortedPosts, postBySlug } from "../data/blog.mjs";
import { SERVICES, serviceBySlug } from "../data/services.mjs";

const fmtDate = (iso) =>
  new Date(iso + "T12:00:00Z").toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric", timeZone: "UTC",
  });

export function blogIndexPage() {
  const trail = [{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }];
  const posts = sortedPosts().filter((p) => !p.noindex);
  const body = `
${pageHero({
  h1: "Roadside Advice From the Thumb Region",
  lead:
    "Practical guidance for Michigan drivers — what to do when a tire fails, how to jump a modern vehicle safely, and why running out of fuel on a rural road is more dangerous than it feels.",
  trail,
  pills: [
    { label: "Local advice", icon: "mapPin" },
    { label: "Safety first", icon: "shield" },
    { label: "Written by our team", icon: "users" },
  ],
  showActions: false,
})}

<section class="section">
  <div class="container">
    <div class="grid grid--3">
      ${posts
        .map(
          (p, i) => `<a class="post-card reveal" href="/blog/${p.slug}">
        <div class="post-card__art${i % 3 === 1 ? " post-card__art--teal" : ""}">${blogArt(i)}</div>
        <div class="post-card__body">
          <div class="post-card__meta">${fmtDate(p.date)} · ${Math.max(2, Math.round((p.body.join(" ").split(/\s+/).length) / 200))} min read</div>
          <h3>${p.title}</h3>
          <p>${p.excerpt}</p>
          <span class="link-arrow">Read article ${icon("arrow")}</span>
        </div>
      </a>`
        )
        .join("")}
    </div>
  </div>
</section>

${ctaBand({})}
`;
  return layout({
    title: "Roadside Assistance Blog | Koehler Rescue Services",
    description:
      "Practical roadside assistance advice for Michigan's Thumb Region — flat tires, dead batteries, lockouts, fuel delivery, and winter driving safety from Koehler Rescue Services.",
    path: "/blog",
    body,
    jsonLd: [localBusinessSchema(), breadcrumbSchema(trail)],
  });
}

export function blogPostPage(slug) {
  const p = postBySlug(slug);
  const trail = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: p.title, href: `/blog/${p.slug}` },
  ];
  const svc = p.service ? serviceBySlug(p.service) : null;
  const related = sortedPosts().filter((x) => x.slug !== p.slug && !x.noindex).slice(0, 3);
  const words = p.body.join(" ").split(/\s+/).length;

  const body = `
<section class="article-head">
  <div class="container container--narrow">
    ${breadcrumbs(trail)}
    <h1 style="margin-top:1.25rem">${p.title}</h1>
    <div class="article-meta">
      <span class="article-meta__avatar">KRS</span>
      <span>By Koehler Rescue Services</span>
      <span>·</span>
      <span>${fmtDate(p.date)}</span>
      <span>·</span>
      <span>${Math.max(2, Math.round(words / 200))} min read</span>
    </div>
  </div>
</section>

<section class="section" style="padding-top:0">
  <div class="container with-aside">
    <article class="article-body prose">
      <p style="font-size:1.15rem;color:var(--ink)">${p.excerpt}</p>
      ${p.body.map((para) => `<p>${para}</p>`).join("")}

      <div class="notice notice--info" style="margin-top:2rem">
        ${icon("phone")}
        <div><strong>Need help right now?</strong> Koehler Rescue Services answers 24 hours a day at <a href="${tel}">${SITE.phone}</a>. We're based in Caro and serve Tuscola, Huron, Sanilac, and seven extended counties across Michigan's Thumb Region.</div>
      </div>

      ${svc ? `<p style="margin-top:2rem">Related service: <a href="/services/${svc.slug}">${svc.name}</a> — ${svc.price}, ${svc.priceNote.toLowerCase()}.</p>` : ""}

      <div class="reveal" style="margin-top:2.5rem">
        <h2 style="font-size:1.4rem">Services mentioned in this article</h2>
        <div class="town-grid" style="margin-top:1rem">
          ${SERVICES.map((s) => `<a class="town-link" href="/services/${s.slug}">${s.name}${icon("arrow")}</a>`).join("")}
        </div>
      </div>
    </article>

    <aside class="aside-sticky">
      <div class="aside-card aside-card--navy">
        <h3>Stranded now?</h3>
        <a class="aside-card__phone" href="${tel}">${SITE.phone}</a>
        <p style="font-size:.85rem;color:#b3c1de;margin-bottom:1rem">Answered 24/7 — including weekends and holidays.</p>
        <a class="btn btn--call" href="${tel}">${icon("phone")} Call now</a>
        <a class="btn btn--ghost" href="/request-roadside-assistance" style="margin-top:.6rem;width:100%">Request service</a>
      </div>
      <div class="aside-card">
        <h3>Pricing</h3>
        <ul class="info-list" style="font-size:.85rem">
          <li>${icon("key")}<span>Lockout <strong>$85</strong></span></li>
          <li>${icon("battery")}<span>Jump start <strong>$65</strong></span></li>
          <li>${icon("tire")}<span>Tire change <strong>$75</strong></span></li>
          <li>${icon("fuel")}<span>Fuel delivery <strong>$55</strong> + fuel</span></li>
          <li>${icon("winch")}<span>Winch out <strong>$100–$175</strong></span></li>
        </ul>
        <a class="link-arrow" href="/pricing" style="margin-top:.9rem">Full pricing ${icon("arrow")}</a>
      </div>
    </aside>
  </div>
</section>

<section class="section section--paper">
  <div class="container">
    <div class="section-head reveal">
      <span class="eyebrow">Keep reading</span>
      <h2>More roadside advice</h2>
    </div>
    <div class="grid grid--3">
      ${related
        .map(
          (r, i) => `<a class="post-card reveal" href="/blog/${r.slug}">
        <div class="post-card__art${i % 3 === 1 ? " post-card__art--teal" : ""}">${blogArt(i + 1)}</div>
        <div class="post-card__body">
          <div class="post-card__meta">${fmtDate(r.date)}</div>
          <h3>${r.title}</h3>
          <p>${r.excerpt}</p>
          <span class="link-arrow">Read article ${icon("arrow")}</span>
        </div>
      </a>`
        )
        .join("")}
    </div>
  </div>
</section>

${ctaBand({})}
`;
  return layout({
    title: `${p.title} | Koehler Rescue Services`,
    description: p.excerpt,
    path: `/blog/${p.slug}`,
    body,
    noindex: !!p.noindex,
    ogType: "article",
    jsonLd: [
      localBusinessSchema(),
      breadcrumbSchema(trail),
      {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: p.title,
        description: p.excerpt,
        datePublished: p.date,
        dateModified: p.date,
        author: { "@type": "Organization", name: SITE.name, url: SITE.url },
        publisher: { "@id": `${SITE.url}/#business` },
        mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE.url}/blog/${p.slug}` },
        articleSection: "Roadside Assistance",
      },
    ],
  });
}
