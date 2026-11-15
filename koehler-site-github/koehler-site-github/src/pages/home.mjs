import { SITE, tel, STATS, NAV } from "../lib/site.mjs";
import { icon, roadScene, countyArt } from "../lib/art.mjs";
import {
  layout, esc, ctaBand, faqBlock, serviceCard, requestForm,
  localBusinessSchema, webSiteSchema, faqSchema,
} from "../lib/ui.mjs";
import { SERVICES } from "../data/services.mjs";
import { COUNTIES } from "../data/locations.mjs";
import { GENERAL_FAQS } from "../data/faqs.mjs";

const HOME_FAQS = GENERAL_FAQS.filter((f) =>
  [
    "What services does Koehler Rescue Services provide?",
    "Are you a towing company?",
    "Where are you located and what areas do you serve?",
    "How much does roadside assistance cost?",
    "How fast can you get to me?",
    "Are you really available 24/7, including holidays?",
    "What should I do while I wait for help?",
    "Do you work with AAA, insurance companies, and motor clubs?",
  ].includes(f.q)
);

const REVIEW_PLATFORMS = [
  { name: "Google", href: SITE.googleReviewUrl, dot: "g", note: "Read & leave a review" },
  { name: "Better Business Bureau", href: SITE.social.bbb, dot: "bbb", note: "Accredited business profile" },
  { name: "Yelp", href: SITE.social.yelp, dot: "y", note: "Customer reviews" },
  { name: "Trustpilot", href: SITE.social.trustpilot, dot: "t", note: "Independent reviews" },
];

export function homePage() {
  const path = "/";
  const body = `
<section class="hero">
  <div class="hero__bg">
    <div class="hero__glow"></div>
    <div class="hero__glow hero__glow--teal"></div>
    <div class="hero__grid"></div>
    ${roadScene()}
  </div>
  <div class="container hero__inner">
    <div>
      <span class="hero__badge"><i></i> Available now · 24/7/365</span>
      <h1>24/7 Roadside Assistance in Michigan's <em>Thumb Region</em></h1>
      <p class="hero__sub">When you're stranded, we're here to help. Professional roadside assistance available 24 hours a day, 7 days a week — including holidays. Locally owned in Caro, and on the way the moment you call.</p>
      <div class="btn-row hero__actions">
        <a class="btn btn--call btn--lg" href="${tel}">${icon("phone")} CALL NOW — ${SITE.phone}</a>
        <a class="btn btn--ghost btn--lg" href="/request-roadside-assistance">Request Service</a>
      </div>
      <div class="hero__note">${icon("shield")} No towing. Just fast, professional roadside help — lockouts, fuel, jumps, tires and winch outs.</div>
    </div>
    <aside class="rescue-card" aria-label="Service snapshot">
      <div class="rescue-card__head">
        <strong>Right now</strong>
        <span class="rescue-card__live"><i></i> Dispatch open</span>
      </div>
      <div class="rescue-card__rows">
        <div class="rescue-row">
          <div class="rescue-row__icon">${icon("clock")}</div>
          <div><div class="rescue-row__label">Availability</div><div class="rescue-row__value">24 hours · 7 days · holidays</div></div>
        </div>
        <div class="rescue-row">
          <div class="rescue-row__icon">${icon("mapPin")}</div>
          <div><div class="rescue-row__label">Home base</div><div class="rescue-row__value">Caro, Tuscola County</div></div>
        </div>
        <div class="rescue-row">
          <div class="rescue-row__icon">${icon("road")}</div>
          <div><div class="rescue-row__label">Coverage</div><div class="rescue-row__value">10 counties across the Thumb</div></div>
        </div>
        <div class="rescue-row">
          <div class="rescue-row__icon">${icon("users")}</div>
          <div><div class="rescue-row__label">Reviews</div><div class="rescue-row__value">250+ customer reviews</div></div>
        </div>
      </div>
      <div class="rescue-card__foot">
        <div class="rescue-card__stars">${icon("star")}${icon("star")}${icon("star")}${icon("star")}${icon("star")}<span>Trusted across the Thumb</span></div>
        <a class="btn btn--call" href="${tel}">${icon("phone")} Call ${SITE.phone}</a>
      </div>
    </aside>
  </div>
</section>

<section class="trustbar" aria-label="At a glance">
  <div class="container trustbar__grid">
    <div class="trustbar__item">${icon("clock")}<div><strong>24/7</strong><span>Open every hour, every day</span></div></div>
    <div class="trustbar__item">${icon("users")}<div><strong>250+</strong><span>Customer reviews</span></div></div>
    <div class="trustbar__item">${icon("shield")}<div><strong>Since 2020</strong><span>Locally &amp; family-owned</span></div></div>
    <div class="trustbar__item">${icon("mapPin")}<div><strong>10 counties</strong><span>Across Michigan's Thumb</span></div></div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head section-head--center reveal">
      <span class="eyebrow">What we do</span>
      <h2>Six roadside services, one phone call</h2>
      <p class="section-lead">We come to you — driveway, parking lot, shoulder of a county road. No tow truck required, and no waiting until morning.</p>
    </div>
    <div class="grid grid--3">
      ${SERVICES.map((s) => serviceCard(s)).join("")}
    </div>
    <div class="btn-row btn-row--center" style="margin-top:2rem">
      <a class="btn btn--outline" href="/services">Explore all services ${icon("arrow")}</a>
      <a class="btn btn--call" href="${tel}">${icon("phone")} Call ${SITE.phone}</a>
    </div>
  </div>
</section>

<section class="section section--paper">
  <div class="container split">
    <div class="split__media reveal">
      <div class="art-panel">
        ${countyArt(3)}
        <div class="stat-chip stat-chip--tl">
          <div class="stat-chip__icon">${icon("clock")}</div>
          <div><strong>24/7</strong><span>Real people answer</span></div>
        </div>
        <div class="stat-chip stat-chip--br">
          <div class="stat-chip__icon">${icon("home")}</div>
          <div><strong>Family-owned</strong><span>Caro, Michigan</span></div>
        </div>
      </div>
    </div>
    <div class="split__body reveal">
      <span class="eyebrow">Why drivers call us</span>
      <h2>A local number that answers — not a call center that routes</h2>
      <p>Koehler Rescue Services started in June 2020 with one goal: be reachable when someone in this community is stuck. We're based in Caro, we know these roads, and the person who answers the phone is the person sending help.</p>
      <ul class="checklist">
        <li>Locally and family-owned — not a franchise or a national dispatch desk</li>
        <li>24 hours a day, 7 days a week, including weekends and holidays</li>
        <li>We come to your location instead of asking you to move the vehicle</li>
        <li>Straight pricing quoted before we start, with mileage explained up front</li>
        <li>Roadside assistance only — we don't tow, and we won't pretend otherwise</li>
        <li>Honest answers when a situation needs something we don't provide</li>
      </ul>
      <div class="btn-row">
        <a class="btn btn--call" href="${tel}">${icon("phone")} Call now</a>
        <a class="link-arrow" href="/about">Our story ${icon("arrow")}</a>
      </div>
    </div>
  </div>
</section>

<section class="section section--navy">
  <div class="container">
    <div class="section-head section-head--center reveal">
      <span class="eyebrow">Experience you can count on</span>
      <h2>Thousands of roadside calls across the Thumb</h2>
      <p class="section-lead">Every number below is a driver who got moving again — most of them within an hour of calling.</p>
    </div>
    <div class="stats reveal">
      ${STATS.map((s) => `<div class="stat"><strong>${s.value}</strong><span>${s.label}</span></div>`).join("")}
    </div>
    <div class="grid grid--4" style="margin-top:1.5rem">
      <div class="feature reveal">
        <div class="feature__icon">${icon("zap")}</div>
        <h3>Fast response</h3>
        <p>Dispatched from Caro, so most of Tuscola County is close. We give you a real arrival window.</p>
      </div>
      <div class="feature reveal">
        <div class="feature__icon">${icon("shield")}</div>
        <h3>Professional &amp; safe</h3>
        <p>Proper tools, proper rigging, and careful handling — no improvised shortcuts on your vehicle.</p>
      </div>
      <div class="feature reveal">
        <div class="feature__icon">${icon("handshake")}</div>
        <h3>Straight pricing</h3>
        <p>Published rates, $1 per mile from Caro, and a total quoted before we roll.</p>
      </div>
      <div class="feature reveal">
        <div class="feature__icon">${icon("users")}</div>
        <h3>Neighbors, not a call center</h3>
        <p>A local, family-owned business — the same people who live and drive here.</p>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container split split--reverse">
    <div class="split__media reveal">
      <div class="art-panel art-panel--teal">
        <svg viewBox="0 0 440 350" aria-hidden="true" focusable="false" style="padding:2rem">
          <g fill="none" stroke="rgba(255,255,255,.5)" stroke-width="2">
            <rect x="30" y="210" width="380" height="90" rx="14" fill="rgba(255,255,255,.08)"/>
            <path d="M60 210v-40a20 20 0 0 1 20-20h90a20 20 0 0 1 20 20v40"/>
            <circle cx="110" cy="300" r="18"/><circle cx="330" cy="300" r="18"/>
            <path d="M150 270h160"/>
          </g>
          <g fill="rgba(255,255,255,.85)">
            <circle cx="380" cy="60" r="26"/>
          </g>
          <g stroke="rgba(255,255,255,.35)" stroke-width="1.5"><path d="M40 60h250M40 90h180M40 120h210"/></g>
        </svg>
      </div>
    </div>
    <div class="split__body reveal">
      <span class="eyebrow">Larger vehicles</span>
      <h2>Heavy-duty and trailer-friendly roadside help</h2>
      <p>We handle more than passenger cars. Certain services are available for RVs, campers, trailers, and larger trucks — and we'll always tell you honestly what we can and can't do for your specific vehicle.</p>
      <div class="vehicle-grid" style="margin-bottom:1.4rem">
        ${["RVs", "Campers", "Travel trailers", "Boat trailers", "Utility trailers", "Horse trailers", "Box trucks", "Large vehicles"]
          .map((v) => `<div class="vehicle-chip">${icon("truck")} ${v}</div>`)
          .join("")}
      </div>
      <div class="notice">
        ${icon("info")}
        <div><strong>Semis and buses:</strong> our available services are limited to lockouts and jump starts. For everything else, we'll refer you to a provider who can help.</div>
      </div>
    </div>
  </div>
</section>

<section class="section section--paper3">
  <div class="container">
    <div class="section-head reveal">
      <span class="eyebrow">Coverage</span>
      <h2>Where we work</h2>
      <p class="section-lead">Core coverage in Tuscola, Huron, and Sanilac counties. Extended coverage across seven more — all dispatched from Caro, with mileage quoted up front.</p>
    </div>
    <div class="grid grid--3">
      ${COUNTIES.slice(0, 3)
        .map(
          (c) => `<a class="county-card reveal" href="/coverage-area/${c.slug}">
        <div class="county-card__top">
          <div class="county-card__badge">${c.short.slice(0, 3).toUpperCase()}</div>
          <span class="county-card__tag">Core coverage</span>
        </div>
        <h3>${c.name}</h3>
        <p>${c.seat} and every community around it, covered 24 hours a day.</p>
        <div class="county-card__towns"><strong>Communities</strong>${c.towns.slice(0, 6).map((t) => t.name).join(" · ")}${c.towns.length > 6 ? " and more" : ""}</div>
      </a>`
        )
        .join("")}
    </div>
    <div class="grid grid--2" style="margin-top:1rem">
      ${COUNTIES.slice(3)
        .map(
          (c) => `<a class="county-card reveal" href="/coverage-area/${c.slug}">
        <div class="county-card__top">
          <div class="county-card__badge">${c.short.slice(0, 3).toUpperCase()}</div>
          <span class="county-card__tag county-card__tag--x">Extended coverage</span>
        </div>
        <h3>${c.name}</h3>
        <p>${c.seat} and surrounding communities — 24/7, with mileage from Caro.</p>
      </a>`
        )
        .join("")}
    </div>
    <div class="btn-row btn-row--center" style="margin-top:2rem">
      <a class="btn btn--outline" href="/coverage-area">See the full coverage map ${icon("arrow")}</a>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="review-layout">
      <div class="rating-block reveal">
        <div class="rating-block__score">${SITE.reviewCount}</div>
        <div class="rating-block__stars">${icon("star")}${icon("star")}${icon("star")}${icon("star")}${icon("star")}</div>
        <p>Customer reviews across Google, the Better Business Bureau, Yelp and Trustpilot.</p>
        <a class="btn btn--primary" href="${SITE.googleReviewUrl}" target="_blank" rel="noopener">${icon("google")} Leave a Google review</a>
      </div>
      <div class="reveal">
        <span class="eyebrow">Reviews &amp; trust</span>
        <h2>Trust matters most when you're on the shoulder</h2>
        <p style="margin-bottom:1.5rem">Roadside assistance is a business built entirely on whether people show up. Ours is built on more than 250 reviews from drivers across the Thumb Region — read them yourself, on the platforms you already use.</p>
        <div class="platform-list">
          ${REVIEW_PLATFORMS.map(
            (p) => `<a class="platform" href="${p.href}" target="_blank" rel="noopener">
            <span class="platform__name"><span class="platform__dot platform__dot--${p.dot}"></span>${p.name}</span>
            <span class="platform__cta">${p.note} ${icon("arrow")}</span>
          </a>`
          ).join("")}
        </div>
        <a class="link-arrow" href="/reviews" style="margin-top:1.25rem">More about our reviews ${icon("arrow")}</a>
      </div>
    </div>
  </div>
</section>

${faqBlock(HOME_FAQS, {
  title: "Questions drivers ask us most",
  intro: "Straight answers about what we do, what it costs, and how fast we can be there.",
  eyebrow: "Good to know",
})}

<section class="section" id="request">
  <div class="container split">
    <div class="split__body reveal">
      <span class="eyebrow">Request service</span>
      <h2>Tell us where you are — we'll come to you</h2>
      <p>Send a request any time, day or night. It goes straight to our team. If you're in a travel lane or need help immediately, <strong>call ${SITE.phone}</strong> instead — it's always faster.</p>
      <ul class="info-list" style="margin-top:1.5rem">
        <li>${icon("phone")}<span><strong>${SITE.phone}</strong><br />Answered 24 hours a day, every day</span></li>
        <li>${icon("mail")}<span><strong>${SITE.email}</strong><br />For quotes, billing, and partner questions</span></li>
        <li>${icon("mapPin")}<span><strong>${SITE.street}, ${SITE.city}, ${SITE.state} ${SITE.zip}</strong><br />Our base in Tuscola County</span></li>
        <li>${icon("clock")}<span><strong>${SITE.hours}</strong></span></li>
      </ul>
    </div>
    <div class="form-card">
      <h3 style="margin-bottom:.5rem">Request roadside assistance</h3>
      <p style="font-size:.92rem;margin-bottom:1.35rem">Our request form sends your details straight to our dispatch screen, so we see the job the moment you send it. If you're in a travel lane or need help right now, calling is always faster.</p>
      <a class="btn btn--call btn--block btn--lg" href="tel:${SITE.phoneRaw}" style="margin-bottom:.75rem">Call ${SITE.phone}</a>
      <a class="btn btn--ghost btn--block btn--lg" href="/request-roadside-assistance">Start a request online</a>
      <p style="font-size:.8rem;margin-top:1.1rem;margin-bottom:0">Answered 24 hours a day, 7 days a week — including holidays.</p>
    </div>
  </div>
</section>

${ctaBand({ title: "Stranded right now? We're already on the way.", text: "One call reaches a local team that answers 24 hours a day, 7 days a week — including weekends and holidays." })}
`;

  return layout({
    title: "24/7 Roadside Assistance in Michigan's Thumb Region | Koehler Rescue Services",
    description:
      "Koehler Rescue Services provides 24/7 roadside assistance in Caro, Tuscola County, and Michigan's Thumb Region. Lockouts, fuel delivery, jump starts, tire changes, tire repair and winch outs. Call 989-286-0100.",
    path,
    body,
    jsonLd: [
      localBusinessSchema(),
      webSiteSchema(),
      faqSchema(HOME_FAQS),
    ],
    preload: `<link rel="preload" as="style" href="/assets/site.css" />`,
  });
}
