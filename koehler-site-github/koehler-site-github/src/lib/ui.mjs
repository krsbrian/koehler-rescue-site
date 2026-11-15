import { SITE, NAV, tel, abs } from "./site.mjs";
import { icon, brandMark } from "./art.mjs";

export const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const isActive = (href, path) =>
  href === "/" ? path === "/" : path === href || path.startsWith(href + "/");

/* ------------------------------------------------------------------ header */
function servicePanel() {
  return `<div class="nav__panel">
    <div class="nav__panel-title">Roadside services</div>
    ${NAV.services
      .map((s) => `<a href="${s.href}">${s.label}</a>`)
      .join("")}
    <div class="nav__panel-foot"><a href="/services">View all roadside services →</a></div>
  </div>`;
}

function coveragePanel() {
  const core = NAV.counties.filter((c) => c.group === "Core");
  const ext = NAV.counties.filter((c) => c.group === "Extended");
  const towns = [
    "akron", "caro", "cass-city", "fairgrove", "gagetown", "kingston",
    "mayville", "millington", "reese", "unionville", "vassar",
  ];
  return `<div class="nav__panel nav__panel--wide">
    <div class="nav__cols nav__cols--3">
      <div>
        <div class="nav__panel-title">Core coverage</div>
        ${core.map((c) => `<a href="${c.href}">${c.label}</a>`).join("")}
        <div class="nav__panel-title" style="margin-top:.4rem">Extended coverage</div>
        ${ext
          .slice(0, 3)
          .map((c) => `<a href="${c.href}">${c.label}</a>`)
          .join("")}
      </div>
      <div>
        <div class="nav__panel-title">More counties</div>
        ${ext
          .slice(3)
          .map((c) => `<a href="${c.href}">${c.label}</a>`)
          .join("")}
      </div>
      <div>
        <div class="nav__panel-title">Tuscola County communities</div>
        ${towns
          .map(
            (t) =>
              `<a href="/coverage-area/tuscola-county/${t}">${t
                .replace(/-/g, " ")
                .replace(/\b\w/g, (m) => m.toUpperCase())}</a>`
          )
          .join("")}
      </div>
    </div>
    <div class="nav__panel-foot"><a href="/coverage-area">See the full coverage map →</a></div>
  </div>`;
}

export function header(path) {
  return `<header class="header" id="site-header">
  <div class="topbar">
    <div class="container topbar__row">
      <div class="topbar__left"><span class="topbar__dot"></span> 24/7 emergency roadside assistance · Caro, Michigan</div>
      <div class="topbar__right">
        <a href="mailto:${SITE.email}">${icon("mail")}<span>${SITE.email}</span></a>
        <span class="topbar__sep"></span>
        <a href="${tel}">${icon("phone")}<span>${SITE.phone}</span></a>
      </div>
    </div>
  </div>
  <div class="container header__row">
    <a class="brand" href="/" aria-label="${SITE.name} home">
      ${brandMark("brand__mark")}
      <span class="brand__text">
        <span class="brand__name">Koehler Rescue</span>
        <span class="brand__sub">Roadside Services</span>
      </span>
    </a>
    <nav class="nav" aria-label="Main">
      ${NAV.main
        .map((item) => {
          const active = isActive(item.href, path);
          if (!item.children) {
            return `<div class="nav__item"><a class="nav__link" href="${item.href}"${
              active ? ' aria-current="page"' : ""
            }>${item.label}</a></div>`;
          }
          const panel = item.children === "services" ? servicePanel() : coveragePanel();
          return `<div class="nav__item">
            <a class="nav__link" href="${item.href}"${active ? ' aria-current="page"' : ""}>${item.label}${icon("chevron")}</a>
            ${panel}
          </div>`;
        })
        .join("")}
    </nav>
    <div class="header__cta">
      <a class="header__phone" href="${tel}">
        <span>Call 24/7</span>
        <strong>${SITE.phone}</strong>
      </a>
      <a class="btn btn--call" href="${tel}">${icon("phone")} CALL NOW</a>
      <button class="nav-toggle" id="nav-toggle" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-drawer"><span></span></button>
    </div>
  </div>
</header>
<div class="drawer" id="mobile-drawer" aria-label="Mobile menu" aria-hidden="true">
  <div class="drawer__top">
    <a class="btn btn--call" href="${tel}">${icon("phone")} Call Now</a>
    <a class="btn btn--outline" href="/request-roadside-assistance">Request Service</a>
  </div>
  <div class="drawer__group">
    <a class="drawer__link" href="/">Home</a>
    <a class="drawer__link" href="/about">About Us</a>
    <details>
      <summary>Services</summary>
      <div class="drawer__sub">
        <a href="/services">All Roadside Services</a>
        ${NAV.services.map((s) => `<a href="${s.href}">${s.label}</a>`).join("")}
      </div>
    </details>
    <details>
      <summary>Coverage Area</summary>
      <div class="drawer__sub">
        <a href="/coverage-area">Full Coverage Map</a>
        ${NAV.counties
          .filter((c) => c.group === "Core")
          .map((c) => `<a href="${c.href}">${c.label}</a>`)
          .join("")}
        <a href="/coverage-area/tuscola-county">Tuscola County Communities</a>
      </div>
    </details>
    <a class="drawer__link" href="/pricing">Pricing</a>
    <a class="drawer__link" href="/reviews">Customer Reviews</a>
    <a class="drawer__link" href="/faqs">FAQs</a>
    <a class="drawer__link" href="/contact">Contact Us</a>
    <a class="drawer__link" href="/request-roadside-assistance">Request Roadside Assistance</a>
  </div>
  <div class="drawer__meta">
    <a href="${tel}">${SITE.phone} — call anytime</a>
    <a href="mailto:${SITE.email}">${SITE.email}</a>
    <span>${SITE.street}, ${SITE.city}, ${SITE.state} ${SITE.zip}</span>
    <span>Open 24 hours · 7 days a week · holidays</span>
  </div>
</div>`;
}

/* ------------------------------------------------------------------ footer */
export function footer() {
  return `<footer class="footer">
  <div class="container">
    <div class="footer__grid">
      <div class="footer__brand">
        <a class="footer__logo" href="/">
          ${brandMark("brand__mark")}
          <span class="brand__text">
            <span class="brand__name">Koehler Rescue</span>
            <span class="brand__sub">Roadside Services</span>
          </span>
        </a>
        <p>Locally and family-owned roadside assistance serving Caro, Tuscola County, and Michigan's Thumb Region — 24 hours a day, every day.</p>
        <div class="footer__social">
          <a href="${SITE.social.facebook}" aria-label="Facebook" rel="noopener" target="_blank">${icon("facebook")}</a>
          <a href="${SITE.social.instagram}" aria-label="Instagram" rel="noopener" target="_blank">${icon("instagram")}</a>
          <a href="${SITE.googleMapsUrl}" aria-label="Google Business Profile" rel="noopener" target="_blank">${icon("google")}</a>
          <a href="${SITE.social.yelp}" aria-label="Yelp" rel="noopener" target="_blank">${icon("yelp")}</a>
        </div>
      </div>
      <div>
        <h4>Roadside Services</h4>
        <ul>
          ${NAV.services.map((s) => `<li><a href="${s.href}">${s.label}</a></li>`).join("")}
          <li><a href="/pricing">Pricing &amp; Rates</a></li>
        </ul>
      </div>
      <div>
        <h4>Coverage Area</h4>
        <ul>
          ${NAV.counties
            .slice(0, 6)
            .map((c) => `<li><a href="${c.href}">${c.label}</a></li>`)
            .join("")}
          <li><a href="/coverage-area">All counties &amp; communities</a></li>
        </ul>
      </div>
      <div>
        <h4>Get Help Now</h4>
        <div class="footer__contact">
          <a href="${tel}">${icon("phone")}<span>${SITE.phone}<small>Call or text — answered 24/7</small></span></a>
          <a href="mailto:${SITE.email}">${icon("mail")}<span>${SITE.email}</span></a>
          <a href="${SITE.googleMapsUrl}" rel="noopener" target="_blank">${icon("mapPin")}<span>${SITE.street}<small>${SITE.city}, ${SITE.state} ${SITE.zip}</small></span></a>
          <a href="/request-roadside-assistance">${icon("message")}<span>Request service online</span></a>
        </div>
      </div>
    </div>
    <div class="footer__bottom">
      <span>© ${new Date().getFullYear()} ${SITE.legal}. All rights reserved.</span>
      <nav aria-label="Legal">
        <a href="/privacy">Privacy &amp; Terms</a>
        <a href="/review-platforms">Review Platforms</a>
        <a href="/verified-partners-memberships">Partners &amp; Memberships</a>
        <a href="/motor-club-insurance-partners">Motor Club &amp; Insurance</a>
        <a href="/sitemap.xml">Sitemap</a>
      </nav>
    </div>
  </div>
</footer>
<div class="mobile-call">
  <a class="btn btn--call" href="${tel}">${icon("phone")} CALL ${SITE.phone}</a>
  <a class="btn btn--ghost" href="/request-roadside-assistance">Request</a>
</div>`;
}

/* ------------------------------------------------------------------ crumbs */
export function breadcrumbs(trail) {
  if (!trail.length) return "";
  return `<nav class="crumbs" aria-label="Breadcrumb"><ol>
    ${trail
      .map((c, i) =>
        i === trail.length - 1
          ? `<li><span aria-current="page">${c.label}</span></li>`
          : `<li><a href="${c.href}">${c.label}</a></li>`
      )
      .join("")}
  </ol></nav>`;
}

/* ------------------------------------------------------------------ shared blocks */
export function ctaBand({
  title = "Stranded right now? We're already on the way.",
  text = "One call reaches a local team that answers 24 hours a day, 7 days a week — including weekends and holidays. Tell us where you are and we'll bring the help to you.",
  primaryLabel = "Call 989-286-0100",
  secondaryLabel = "Request Roadside Assistance",
  secondaryHref = "/request-roadside-assistance",
} = {}) {
  return `<section class="section section--tight">
  <div class="container">
    <div class="cta-band reveal">
      <div class="cta-band__inner">
        <div>
          <h2>${title}</h2>
          <p>${text}</p>
        </div>
        <div class="cta-band__actions">
          <a class="btn btn--light btn--lg" href="${tel}">${icon("phone")} ${primaryLabel}</a>
          <a class="cta-band__phone" href="${tel}">${SITE.phone}</a>
          <a class="btn btn--ghost" href="${secondaryHref}">${secondaryLabel}</a>
        </div>
      </div>
    </div>
  </div>
</section>`;
}

export function faqBlock(items, { title = "Frequently asked questions", intro = "", eyebrow = "Answers", center = false, sectionClass = "section--paper" } = {}) {
  return `<section class="section ${sectionClass}" id="faq">
  <div class="container">
    <div class="section-head ${center ? "section-head--center" : ""} reveal">
      <span class="eyebrow">${eyebrow}</span>
      <h2>${title}</h2>
      ${intro ? `<p>${intro}</p>` : ""}
    </div>
    <div class="faq reveal">
      ${items
        .map(
          (f) => `<details>
        <summary>${f.q}</summary>
        <div><p>${f.a}</p></div>
      </details>`
        )
        .join("")}
    </div>
  </div>
</section>`;
}

/**
 * Roadsider dispatch embed. Their widget script swaps itself for a responsive
 * iframe pointed at their intake page, so a request becomes a job on the
 * dispatch screen instead of an email. The script tag must stay inside the
 * frame container — the widget inserts the iframe immediately after it.
 */
export function dispatchForm({
  heading = "Request roadside assistance",
  intro = "Your details go straight to our dispatch screen.",
} = {}) {
  if (!SITE.dispatch) return requestForm({ heading, intro });
  return `<div class="form-card" id="request-form">
  ${heading ? `<h3 style="margin-bottom:.35rem">${heading}</h3>` : ""}
  ${intro ? `<p style="font-size:.9rem;margin-bottom:1.1rem">${intro}</p>` : ""}
  <div class="dispatch-frame">
    <script src="${SITE.dispatch.widgetSrc}" data-key="${SITE.dispatch.widgetKey}" async></script>
    <p class="dispatch-fallback">Form not loading? <a href="${SITE.dispatch.url}" target="_blank" rel="noopener">Open it in a new tab</a>, or call <a href="${tel}">${SITE.phone}</a> — we answer 24/7.</p>
  </div>
</div>`;
}

export function requestForm({ compact = false, heading = "Request roadside assistance", intro = "", preselected = "" } = {}) {
  const opts = [
    ["", "Select the service you need"],
    ["Lockout", "Auto lockout — locked keys in vehicle"],
    ["Fuel delivery", "Fuel delivery — gas or diesel"],
    ["Jump start", "Jump start — dead battery"],
    ["Tire change", "Tire change — install my spare"],
    ["Tire repair", "Tire repair — add-on to a tire change"],
    ["Winch out", "Vehicle winch out — stuck in mud, snow or ditch"],
    ["Heavy-duty", "Heavy-duty / RV / trailer assistance"],
    ["Not sure", "Not sure — I need help figuring it out"],
  ];
  return `<form class="form-card" data-request-form novalidate>
  ${heading ? `<h3 style="margin-bottom:.35rem">${heading}</h3>` : ""}
  ${intro ? `<p style="font-size:.9rem;margin-bottom:1.25rem">${intro}</p>` : ""}
  <div class="form-grid">
    <div class="field field--full">
      <label for="rf-service">What do you need? <span class="req">*</span></label>
      <select id="rf-service" name="service" required>
        ${opts
          .map(
            ([v, l]) =>
              `<option value="${v}"${v === preselected ? " selected" : ""}>${l}</option>`
          )
          .join("")}
      </select>
    </div>
    <div class="field">
      <label for="rf-name">Full name <span class="req">*</span></label>
      <input id="rf-name" name="name" type="text" autocomplete="name" placeholder="First and last name" required />
    </div>
    <div class="field">
      <label for="rf-phone">Phone number <span class="req">*</span></label>
      <input id="rf-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" placeholder="(989) 000-0000" required />
    </div>
    <div class="field">
      <label for="rf-vehicle">Vehicle year, make &amp; model</label>
      <input id="rf-vehicle" name="vehicle" type="text" placeholder="e.g. 2016 Ford F-150" />
    </div>
    <div class="field">
      <label for="rf-location">Where are you? <span class="req">*</span></label>
      <input id="rf-location" name="location" type="text" placeholder="Road, town, or nearest landmark" required />
      <span class="field__help">A road name, exit, or cross street helps us find you faster.</span>
    </div>
    <div class="field field--full">
      <label for="rf-details">What's happening?</label>
      <textarea id="rf-details" name="details" placeholder="Flat rear tire on the passenger side, vehicle is on the shoulder heading east…"></textarea>
    </div>
    <div class="field field--hp" aria-hidden="true">
      <label for="rf-company">Company</label>
      <input id="rf-company" name="company" type="text" tabindex="-1" autocomplete="off" />
    </div>
  </div>
  <button class="btn btn--call btn--block btn--lg" type="submit" style="margin-top:1.15rem">${icon("message")} Send my request</button>
  <p class="form-note"><strong>Calling is the fastest way to get help.</strong> If this is an emergency or you're in a travel lane, call <a href="${tel}">${SITE.phone}</a> now. Online requests are monitored 24/7 but a phone call is always quicker.</p>
  <div class="form-status" role="status" aria-live="polite"></div>
</form>`;
}

export function contactForm({ heading = "Send us a message", intro = "" } = {}) {
  return `<form class="form-card" data-request-form novalidate>
  <h3 style="margin-bottom:.35rem">${heading}</h3>
  ${intro ? `<p style="font-size:.9rem;margin-bottom:1.25rem">${intro}</p>` : ""}
  <div class="form-grid">
    <div class="field">
      <label for="cf-name">Full name <span class="req">*</span></label>
      <input id="cf-name" name="name" type="text" autocomplete="name" placeholder="Your name" required />
    </div>
    <div class="field">
      <label for="cf-phone">Phone <span class="req">*</span></label>
      <input id="cf-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" placeholder="(989) 000-0000" required />
    </div>
    <div class="field field--full">
      <label for="cf-email">Email</label>
      <input id="cf-email" name="email" type="email" autocomplete="email" placeholder="you@example.com" />
    </div>
    <div class="field field--full">
      <label for="cf-topic">Topic</label>
      <select id="cf-topic" name="service">
        <option value="General question">General question</option>
        <option value="Quote request">Pricing or quote request</option>
        <option value="Lockout">Auto lockout</option>
        <option value="Fuel delivery">Fuel delivery</option>
        <option value="Jump start">Jump start</option>
        <option value="Tire change">Tire change</option>
        <option value="Tire repair">Tire repair</option>
        <option value="Winch out">Vehicle winch out</option>
        <option value="Heavy-duty">Heavy-duty / RV / trailer</option>
        <option value="Motor club or insurance">Motor club or insurance partner</option>
        <option value="Billing">Billing or payment</option>
      </select>
    </div>
    <div class="field field--full">
      <label for="cf-message">Message <span class="req">*</span></label>
      <textarea id="cf-message" name="details" placeholder="How can we help?" required></textarea>
    </div>
    <div class="field field--hp" aria-hidden="true">
      <label for="cf-company">Company</label>
      <input id="cf-company" name="company" type="text" tabindex="-1" autocomplete="off" />
    </div>
  </div>
  <button class="btn btn--primary btn--block" type="submit" style="margin-top:1.15rem">${icon("mail")} Send message</button>
  <p class="form-note">Need help right now? Call <a href="${tel}">${SITE.phone}</a> — we answer 24/7.</p>
  <div class="form-status" role="status" aria-live="polite"></div>
</form>`;
}

export function serviceCard(s, { showPrice = true } = {}) {
  return `<a class="service-card reveal" href="/services/${s.slug}">
    <div class="service-card__icon">${icon(s.icon)}</div>
    <h3>${s.name}</h3>
    <p>${s.short}</p>
    <div class="service-card__meta">
      ${
        showPrice && s.price
          ? `<div class="service-card__price">${s.price}<small>${s.priceNote || "Service call"}</small></div>`
          : `<div class="service-card__price">${s.priceLabel || ""}</div>`
      }
      <span class="link-arrow">Details ${icon("arrow")}</span>
    </div>
  </a>`;
}

/* ------------------------------------------------------------------ layout */
export function layout({
  title,
  description,
  path,
  body,
  jsonLd = [],
  noindex = false,
  ogType = "website",
  preload = "",
}) {
  const canonical = abs(path);
  const graph = jsonLd.filter(Boolean);
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}" />
<link rel="canonical" href="${canonical}" />
<meta name="robots" content="${noindex ? "noindex, follow" : "index, follow, max-image-preview:large"}" />
<meta name="theme-color" content="#0A1138" />
<meta name="author" content="${SITE.legal}" />
<meta name="geo.region" content="US-MI" />
<meta name="geo.placename" content="Caro, Michigan" />
<meta property="og:type" content="${ogType}" />
<meta property="og:site_name" content="${SITE.name}" />
<meta property="og:title" content="${esc(title)}" />
<meta property="og:description" content="${esc(description)}" />
<meta property="og:url" content="${canonical}" />
<meta property="og:locale" content="en_US" />
<meta property="og:image" content="${abs("/assets/og.svg")}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${esc(title)}" />
<meta name="twitter:description" content="${esc(description)}" />
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml" />
<link rel="apple-touch-icon" href="/assets/favicon.svg" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="/assets/site.css" />
${preload}
${SITE.gaId ? `<script async src="https://www.googletagmanager.com/gtag/js?id=${SITE.gaId}"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${SITE.gaId}',{anonymize_ip:true});</script>` : ""}
${graph.length ? `<script type="application/ld+json">${JSON.stringify(graph.length === 1 ? graph[0] : { "@context": "https://schema.org", "@graph": graph })}</script>` : ""}
</head>
<body>
<a class="skip-link" href="#main">Skip to main content</a>
${header(path)}
<main id="main">
${body}
</main>
${footer()}
<script src="/assets/site.js" defer></script>
</body>
</html>`;
}

/* ------------------------------------------------------------------ schema */
export const localBusinessSchema = () => ({
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "AutomotiveBusiness"],
  "@id": abs("/#business"),
  name: SITE.name,
  legalName: SITE.legal,
  url: SITE.url,
  telephone: SITE.phoneRaw,
  email: SITE.email,
  image: abs("/assets/og.svg"),
  logo: abs("/assets/favicon.svg"),
  description:
    "Locally and family-owned 24/7 roadside assistance in Caro, Michigan, serving Tuscola County and Michigan's Thumb Region with lockouts, fuel delivery, jump starts, tire changes, tire repair, and vehicle winch outs.",
  priceRange: "$$",
  currenciesAccepted: "USD",
  paymentAccepted: "Cash, Credit Card",
  address: {
    "@type": "PostalAddress",
    streetAddress: SITE.street,
    addressLocality: SITE.city,
    addressRegion: SITE.state,
    postalCode: SITE.zip,
    addressCountry: "US",
  },
  geo: { "@type": "GeoCoordinates", latitude: 43.4903, longitude: -83.3969 },
  areaServed: [
    "Tuscola County, MI", "Huron County, MI", "Sanilac County, MI", "Bay County, MI",
    "Saginaw County, MI", "Lapeer County, MI", "Genesee County, MI", "Shiawassee County, MI",
    "St. Clair County, MI", "Midland County, MI",
  ].map((name) => ({ "@type": "AdministrativeArea", name })),
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    opens: "00:00",
    closes: "23:59",
  },
  sameAs: [SITE.social.facebook, SITE.social.instagram, SITE.social.yelp],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Roadside Assistance Services",
    itemListElement: [
      ["Auto Lockout Service", 85],
      ["Emergency Fuel Delivery", 55],
      ["Jump Start Service", 65],
      ["Tire Change Service", 75],
      ["Tire Repair Add-On", 20],
      ["Vehicle Winch Out", 100],
    ].map(([name, price]) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name },
      priceSpecification: {
        "@type": "PriceSpecification",
        price,
        priceCurrency: "USD",
        valueAddedTaxIncluded: false,
      },
    })),
  },
});

export const serviceSchema = ({ name, description, slug, price, priceNote }) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name,
  serviceType: name,
  description,
  url: abs(`/services/${slug}`),
  provider: { "@id": abs("/#business") },
  areaServed: [
    { "@type": "AdministrativeArea", name: "Tuscola County, MI" },
    { "@type": "AdministrativeArea", name: "Huron County, MI" },
    { "@type": "AdministrativeArea", name: "Sanilac County, MI" },
    { "@type": "City", name: "Caro, MI" },
  ],
  offers: {
    "@type": "Offer",
    price,
    priceCurrency: "USD",
    description: priceNote,
    availability: "https://schema.org/InStock",
    areaServed: "Michigan's Thumb Region",
  },
});

export const faqSchema = (items) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map((f) => ({
    "@type": "Question",
    name: f.q.replace(/<[^>]+>/g, ""),
    acceptedAnswer: { "@type": "Answer", text: f.a.replace(/<[^>]+>/g, "") },
  })),
});

export const breadcrumbSchema = (trail) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: trail.map((c, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: c.label,
    item: abs(c.href),
  })),
});

export const webSiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": abs("/#website"),
  url: SITE.url,
  name: SITE.name,
  publisher: { "@id": abs("/#business") },
  inLanguage: "en-US",
});
