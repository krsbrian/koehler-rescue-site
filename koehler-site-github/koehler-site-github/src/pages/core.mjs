import { SITE, tel, NAV, STATS } from "../lib/site.mjs";
import { icon, countyArt, brandMark } from "../lib/art.mjs";
import {
  layout, esc, ctaBand, faqBlock, serviceCard, requestForm, dispatchForm, contactForm,
  breadcrumbs, localBusinessSchema, faqSchema, breadcrumbSchema, serviceSchema,
} from "../lib/ui.mjs";
import { SERVICES, serviceBySlug } from "../data/services.mjs";
import { COUNTIES } from "../data/locations.mjs";
import { GENERAL_FAQS, SERVICE_AREA_FAQS } from "../data/faqs.mjs";

/* shared page hero ------------------------------------------------------- */
export function pageHero({ h1, lead, trail = [], pills = [], showActions = true, children = "" }) {
  return `<section class="page-hero">
  <div class="page-hero__glow"></div>
  <div class="page-hero__glow page-hero__glow--teal"></div>
  <div class="page-hero__grid"></div>
  <div class="container">
    ${trail.length ? breadcrumbs(trail) : ""}
    <h1>${h1}</h1>
    <p>${lead}</p>
    ${
      showActions
        ? `<div class="btn-row">
      <a class="btn btn--call btn--lg" href="${tel}">${icon("phone")} Call ${SITE.phone}</a>
      <a class="btn btn--ghost btn--lg" href="/request-roadside-assistance">Request Service</a>
    </div>`
        : ""
    }
    ${
      pills.length
        ? `<div class="page-hero__meta">${pills.map((p) => `<span class="pill">${icon(p.icon || "check")}${p.label}</span>`).join("")}</div>`
        : ""
    }
    ${children}
  </div>
</section>`;
}

const REVIEW_LINKS = [
  { name: "Google", href: SITE.googleReviewUrl, dot: "g", note: "Read or leave a review" },
  { name: "Better Business Bureau", href: SITE.social.bbb, dot: "bbb", note: "Accredited business profile" },
  { name: "Yelp", href: SITE.social.yelp, dot: "y", note: "Customer reviews" },
  { name: "Trustpilot", href: SITE.social.trustpilot, dot: "t", note: "Independent reviews" },
];

/* ---------------------------------------------------------------- ABOUT */
export function aboutPage() {
  const trail = [{ label: "Home", href: "/" }, { label: "About Us", href: "/about" }];
  const body = `
${pageHero({
  h1: "About Koehler Rescue Services",
  lead:
    "A locally and family-owned roadside assistance company, based in Caro, serving Michigan's Thumb Region around the clock since June 2020.",
  trail,
  pills: [
    { label: "Family-owned", icon: "home" },
    { label: "Based in Caro", icon: "mapPin" },
    { label: "24/7 since 2020", icon: "clock" },
  ],
})}

<section class="section">
  <div class="container split">
    <div class="split__body reveal">
      <span class="eyebrow">Our story</span>
      <h2>Started to be the number people could actually reach</h2>
      <p>Koehler Rescue Services began in June 2020 with a straightforward intention: help the community when they need it most. Not with a franchise playbook or a national dispatch desk, but with a local truck, local knowledge, and someone who answers the phone at any hour.</p>
      <p>Being stranded is a vulnerable feeling. It's worse in a rural county at night, in winter, or with a child in the vehicle. What people want in that moment isn't a marketing pitch — it's a real person who says "I know where that is, I'm on my way."</p>
      <p>That's still the whole job. We come to you, we bring the right equipment, we tell you the price before we start, and we're honest when a situation needs something we don't do.</p>
      <ul class="checklist">
        <li><strong>We're roadside assistance, not towing.</strong> We don't run a tow truck, and we don't pretend to.</li>
        <li><strong>We come to your location.</strong> Driveway, lot, shoulder, farmyard — we don't make you move a broken vehicle.</li>
        <li><strong>We quote before we roll.</strong> Published rates plus $1 per mile from Caro, stated up front.</li>
        <li><strong>We serve the whole Thumb.</strong> Ten counties, with honest arrival windows for each.</li>
      </ul>
    </div>
    <div class="split__media reveal">
      <div class="art-panel" style="aspect-ratio:1/1.05">
        ${countyArt(7)}
        <div class="stat-chip stat-chip--br">
          <div class="stat-chip__icon">${icon("award")}</div>
          <div><strong>7,500+</strong><span>Roadside calls handled</span></div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section section--navy">
  <div class="container">
    <div class="section-head reveal">
      <span class="eyebrow">The team</span>
      <h2>What you can expect from us</h2>
      <p class="section-lead">Three things decide whether a roadside call goes well: whether someone answers, how fast they arrive, and whether they treat your vehicle like it's theirs.</p>
    </div>
    <div class="grid grid--3">
      <div class="feature reveal">
        <div class="feature__icon">${icon("users")}</div>
        <h3>Experienced, equipped</h3>
        <p>Our technicians work with professional lockout tools, boost packs with surge protection, proper jacks and torque wrenches, and rated recovery gear — not improvised substitutes.</p>
      </div>
      <div class="feature reveal">
        <div class="feature__icon">${icon("clock")}</div>
        <h3>Here for you 24/7</h3>
        <p>Emergencies don't schedule themselves. Overnight, weekends, holidays — the phone is answered and the truck is available.</p>
      </div>
      <div class="feature reveal">
        <div class="feature__icon">${icon("handshake")}</div>
        <h3>Community focused</h3>
        <p>We live here. The roads we work are the roads we drive, and the people we help are our neighbors.</p>
      </div>
    </div>
    <div class="stats reveal" style="margin-top:2rem">
      <div class="stat"><strong>7,500<span>+</span></strong><span>Roadside calls since 2020</span></div>
      <div class="stat"><strong>45<span> min</span></strong><span>Typical response time</span></div>
      <div class="stat"><strong>95<span>%</span></strong><span>Resolved within 60 minutes</span></div>
      <div class="stat"><strong>24<span>/7</span></strong><span>Including holidays</span></div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head section-head--center reveal">
      <span class="eyebrow">What we do</span>
      <h2>Roadside services in the Thumb Region</h2>
      <p class="section-lead">Six services, available any hour, at your location.</p>
    </div>
    <div class="grid grid--3">
      ${SERVICES.map((s) => serviceCard(s)).join("")}
    </div>
  </div>
</section>

<section class="section section--paper">
  <div class="container with-aside">
    <div class="prose reveal">
      <h2>Why we're clear about what we don't do</h2>
      <p>Plenty of roadside companies advertise everything and deliver a tow truck. We'd rather be specific. Koehler Rescue Services provides mobile roadside assistance — lockouts, fuel delivery, jump starts, tire changes, tire repair as an add-on, and vehicle winch outs.</p>
      <p>We do not offer towing, vehicle transport, or impound services. If your vehicle can't be driven after we've helped, we'll tell you plainly and point you to a provider who can move it. We keep a referral list for exactly that reason, and we'd rather send you somewhere good than take a job we're not equipped for.</p>
      <h2>How we handle the awkward calls</h2>
      <p>Not every request ends with a service. Sometimes a tire has sidewall damage that can't be repaired, a vehicle has no spare, or a battery is beyond a boost. In those cases you'll get a straight answer and a recommendation, not a sales pitch.</p>
      <p>It's a short-term loss and a long-term business. Most of our work comes from people who called once and told a neighbor.</p>
      <h2>Where we work</h2>
      <p>Our core coverage is Tuscola, Huron, and Sanilac counties. Extended coverage includes Bay, Saginaw, Lapeer, Genesee, Shiawassee, St. Clair, and Midland counties. In every case, mileage is $1 per mile from Caro to your location, quoted before dispatch.</p>
      <p><a href="/coverage-area">See the full coverage area</a> or check your community's page for local detail.</p>
    </div>
    <aside class="aside-sticky">
      <div class="aside-card aside-card--navy">
        <h3>Need help now?</h3>
        <a class="aside-card__phone" href="${tel}">${SITE.phone}</a>
        <p style="font-size:.85rem;color:#b3c1de;margin-bottom:1rem">Answered 24 hours a day, 7 days a week.</p>
        <a class="btn btn--call" href="${tel}">${icon("phone")} Call now</a>
        <a class="btn btn--ghost" href="/request-roadside-assistance" style="margin-top:.6rem;width:100%">Request service</a>
      </div>
      <div class="aside-card">
        <h3>Popular services</h3>
        <ul class="aside-list">
          ${SERVICES.slice(0, 5).map((s) => `<li><a href="/services/${s.slug}">${s.name}${icon("arrow")}</a></li>`).join("")}
        </ul>
      </div>
    </aside>
  </div>
</section>

${faqBlock(GENERAL_FAQS.slice(0, 8), {
  title: "Frequently asked questions",
  intro: "The questions we answer most often on the phone.",
  eyebrow: "Answers",
})}

${ctaBand({})}
`;
  return layout({
    title: "About Koehler Rescue Services | Locally Owned Roadside Assistance in Caro, MI",
    description:
      "Koehler Rescue Services is a locally and family-owned 24/7 roadside assistance company in Caro, Michigan, serving the Thumb Region since 2020. Learn about our team, our services, and what we don't do.",
    path: "/about",
    body,
    jsonLd: [localBusinessSchema(), breadcrumbSchema(trail)],
  });
}

/* ------------------------------------------------------------- SERVICES */
export function servicesPage() {
  const trail = [{ label: "Home", href: "/" }, { label: "Services", href: "/services" }];
  const body = `
${pageHero({
  h1: "Roadside Assistance Services in Michigan's Thumb",
  lead:
    "Six professional roadside services, delivered to your location at any hour. We're not a towing company — we bring the help to you, fix what can be fixed on-site, and get you moving again.",
  trail,
  pills: [
    { label: "24/7 availability", icon: "clock" },
    { label: "At your location", icon: "mapPin" },
    { label: "Upfront pricing", icon: "tag" },
  ],
})}

<section class="section">
  <div class="container">
    <div class="section-head reveal">
      <span class="eyebrow">Our services</span>
      <h2>What we can do for you</h2>
      <p class="section-lead">Every service below is mobile — we come to you. Pricing is published on our <a href="/pricing">pricing page</a>, and mileage is $1 per mile from Caro.</p>
    </div>
    <div class="grid grid--3">
      ${SERVICES.map((s) => serviceCard(s)).join("")}
    </div>
  </div>
</section>

<section class="section section--paper">
  <div class="container split">
    <div class="split__body reveal">
      <span class="eyebrow">Heavy-duty &amp; trailers</span>
      <h2>Light, medium, and heavy-duty assistance</h2>
      <p>We handle more than passenger cars. Certain roadside services are available for larger vehicles and trailers — but capabilities vary by service and by vehicle, and we won't pretend otherwise.</p>
      <div class="vehicle-grid" style="margin-bottom:1.4rem">
        ${["RVs", "Campers", "Travel trailers", "Boat trailers", "Utility trailers", "Horse trailers", "Large box trucks", "Other supported vehicles"]
          .map((v) => `<div class="vehicle-chip">${icon("truck")} ${v}</div>`)
          .join("")}
      </div>
      <div class="notice" style="margin-bottom:1rem">
        ${icon("info")}
        <div><strong>Semis and buses:</strong> available services are limited to <a href="/services/auto-lockout-service">lockouts</a> and <a href="/services/jump-start-service">jump starts</a> only.</div>
      </div>
      <p style="font-size:.9rem">Not sure whether we can help with your vehicle? Call ${SITE.phone} and describe it. If we can't do it, we'll tell you who can.</p>
    </div>
    <div class="split__media reveal">
      <div class="table-wrap">
        <table>
          <caption class="sr-only">Service availability by vehicle type</caption>
          <thead><tr><th>Service</th><th>Cars &amp; light trucks</th><th>Trailers &amp; RVs</th><th>Semis &amp; buses</th></tr></thead>
          <tbody>
            <tr><td>Auto lockout</td><td>Yes</td><td>Yes</td><td>Yes</td></tr>
            <tr><td>Jump start</td><td>Yes</td><td>Yes</td><td>Yes</td></tr>
            <tr><td>Fuel delivery</td><td>Yes</td><td>Yes</td><td>Ask us</td></tr>
            <tr><td>Tire change</td><td>Yes</td><td>Supported trailers</td><td>No</td></tr>
            <tr><td>Tire repair add-on</td><td>Yes</td><td>Supported trailers</td><td>No</td></tr>
            <tr><td>Vehicle winch out</td><td>Yes</td><td>Supported trailers</td><td>No</td></tr>
          </tbody>
        </table>
      </div>
      <p style="font-size:.78rem;color:var(--muted);margin-top:.75rem">Availability depends on the specific vehicle, equipment, and conditions. Confirm when you call.</p>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head section-head--center reveal">
      <span class="eyebrow">How it works</span>
      <h2>Three steps from stranded to moving</h2>
    </div>
    <div class="grid grid--3">
      <div class="feature reveal">
        <div class="feature__icon">${icon("phone")}</div>
        <h3>1. Call us</h3>
        <p>Tell us your location, your vehicle, and what's happening. We'll confirm the price and give you an arrival window.</p>
      </div>
      <div class="feature reveal">
        <div class="feature__icon">${icon("truck")}</div>
        <h3>2. We come to you</h3>
        <p>No moving the vehicle, no waiting for a shop to open. We bring the tools for your specific situation.</p>
      </div>
      <div class="feature reveal">
        <div class="feature__icon">${icon("check")}</div>
        <h3>3. You're back on the road</h3>
        <p>We finish the job, check our work, and tell you anything you should watch for afterward.</p>
      </div>
    </div>
  </div>
</section>

${faqBlock(
  [
    { q: "Do you charge for your services?", a: "Yes, and our prices are published. Lockout $85, fuel delivery $55 plus fuel, jump start $65, tire change $75, tire repair $20 as an add-on, and winch outs $100–$175. Mileage is $1 per mile from Caro." },
    { q: "How fast can you get to me?", a: "It depends on where you are and the roads. We dispatch from Caro and give you an honest arrival window when you call — usually within about 45 minutes in the core coverage area." },
    { q: "Do you tow vehicles?", a: "No. We provide roadside assistance only. If your vehicle needs transport, we'll refer you to a provider who can help." },
    { q: "Can you help at my home or workplace?", a: "Yes. Driveways, parking lots, job sites, and farmyards are all normal locations for us." },
    { q: "What areas do you cover?", a: "Tuscola, Huron, and Sanilac counties as core coverage, plus Bay, Saginaw, Lapeer, Genesee, Shiawassee, St. Clair, and Midland counties as extended coverage." },
  ],
  { title: "Questions about our services", intro: "What people ask before they book.", eyebrow: "Answers" }
)}

${ctaBand({})}
`;
  return layout({
    title: "Roadside Assistance Services | Lockouts, Fuel, Jumps, Tires & Winch Outs",
    description:
      "Explore Koehler Rescue Services' six roadside assistance services in Michigan's Thumb Region: auto lockouts, fuel delivery, jump starts, tire changes, tire repair add-ons, and vehicle winch outs. 24/7.",
    path: "/services",
    body,
    jsonLd: [localBusinessSchema(), breadcrumbSchema(trail)],
  });
}

/* ------------------------------------------------------- SERVICE DETAIL */
export function servicePage(slug) {
  const s = serviceBySlug(slug);
  const trail = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: s.name, href: `/services/${s.slug}` },
  ];
  const related = SERVICES.filter((x) => x.slug !== s.slug).slice(0, 3);
  const body = `
${pageHero({
  h1: s.h1,
  lead: s.lead,
  trail,
  pills: s.highlights.map((h) => ({ label: h, icon: "check" })),
})}

<section class="section">
  <div class="container with-aside">
    <div>
      <div class="prose reveal">
        ${s.body
          .map(
            (block) => `
          <h2>${block.h2}</h2>
          ${block.p.map((p) => `<p>${p}</p>`).join("")}
          ${block.ul ? `<ul>${block.ul.map((li) => `<li>${li}</li>`).join("")}</ul>` : ""}
        `
          )
          .join("")}
      </div>

      <div class="reveal" style="margin-top:2.5rem">
        <h2 style="font-size:1.6rem">What's included</h2>
        <ul class="checklist">
          ${s.includes.map((i) => `<li>${i}</li>`).join("")}
        </ul>
      </div>

      <div class="grid grid--3 reveal" style="margin-top:2rem">
        ${s.steps
          .map(
            (step, i) => `<div class="feature">
          <div class="feature__icon" style="font-family:var(--font-display);font-weight:800;font-size:1.1rem">${i + 1}</div>
          <h3 style="font-size:1.1rem">${step.title}</h3>
          <p>${step.text}</p>
        </div>`
          )
          .join("")}
      </div>

      ${
        s.restrictions
          ? `<div class="notice" style="margin-top:2rem">
        ${icon("alert")}
        <div><strong>Please note:</strong><ul style="margin:.4rem 0 0;padding-left:1.1rem">${s.restrictions.map((r) => `<li>${r}</li>`).join("")}</ul></div>
      </div>`
          : ""
      }

      <div class="reveal" style="margin-top:2.5rem">
        <h2 style="font-size:1.6rem">Where we provide this service</h2>
        <p>${s.name} is available across our coverage area — Tuscola, Huron, and Sanilac counties as core coverage, plus Bay, Saginaw, Lapeer, Genesee, Shiawassee, St. Clair, and Midland counties.</p>
        <div class="tag-row" style="margin-top:1rem">
          ${COUNTIES.map((c) => `<a class="tag" href="/coverage-area/${c.slug}" style="text-decoration:none">${c.name}</a>`).join("")}
        </div>
        <p style="margin-top:1rem"><a class="link-arrow" href="/coverage-area">See all communities ${icon("arrow")}</a></p>
      </div>
    </div>

    <aside class="aside-sticky">
      <div class="aside-card" style="border-color:rgba(31,188,247,.4)">
        <div class="price-card__icon">${icon(s.icon)}</div>
        <h3 style="margin-bottom:.25rem">${s.name}</h3>
        <div class="price-card__amount" style="font-size:2.2rem">${s.price}</div>
        <p style="font-size:.82rem;color:var(--muted)">${s.priceNote}. Final pricing depends on mileage and your specific situation.</p>
        <a class="btn btn--call" href="${tel}">${icon("phone")} Call ${SITE.phone}</a>
        <a class="btn btn--outline" href="/request-roadside-assistance" style="margin-top:.6rem;width:100%">Request this service</a>
      </div>
      <div class="aside-card aside-card--navy">
        <h3>Dispatch is open</h3>
        <p style="font-size:.85rem;color:#b3c1de;margin-bottom:.8rem">24 hours a day, 7 days a week — including holidays.</p>
        <ul class="info-list" style="font-size:.85rem">
          <li><span style="color:var(--turq)">${icon("clock")}</span><span>Answered any hour</span></li>
          <li><span style="color:var(--turq)">${icon("mapPin")}</span><span>We come to your location</span></li>
          <li><span style="color:var(--turq)">${icon("tag")}</span><span>Price quoted before we start</span></li>
        </ul>
      </div>
      <div class="aside-card">
        <h3>Other services</h3>
        <ul class="aside-list">
          ${SERVICES.filter((x) => x.slug !== s.slug)
            .map((x) => `<li><a href="/services/${x.slug}">${x.name}${icon("arrow")}</a></li>`)
            .join("")}
        </ul>
        <a class="link-arrow" href="/pricing" style="margin-top:.75rem">See all pricing ${icon("arrow")}</a>
      </div>
    </aside>
  </div>
</section>

${faqBlock(
  [
    ...s.faqs,
    { q: "Do you serve my town?", a: "We cover Tuscola, Huron, and Sanilac counties as core coverage, plus seven extended counties. If you're not sure, call us — we'll tell you honestly whether we can reach you." },
  ],
  {
    title: `${s.name} questions`,
    intro: "What drivers ask before booking this service.",
    eyebrow: "Answers",
    sectionClass: "section--paper",
  }
)}

<section class="section">
  <div class="container">
    <div class="section-head reveal">
      <span class="eyebrow">Related services</span>
      <h2>You might also need</h2>
    </div>
    <div class="grid grid--3">
      ${related.map((r) => serviceCard(r)).join("")}
    </div>
  </div>
</section>

${ctaBand({
  title: `Need ${s.name.toLowerCase()} right now?`,
  text: `Call ${SITE.phone} and we'll confirm the price, give you an arrival window, and head your way. Available 24 hours a day, every day.`,
})}
`;
  return layout({
    title: s.metaTitle,
    description: s.metaDescription,
    path: `/services/${s.slug}`,
    body,
    jsonLd: [
      localBusinessSchema(),
      serviceSchema({
        name: s.name,
        description: s.metaDescription,
        slug: s.slug,
        price: (s.price.match(/\d+/) || ["85"])[0],
        priceNote: s.priceNote,
      }),
      faqSchema(s.faqs),
      breadcrumbSchema(trail),
    ],
  });
}

/* --------------------------------------------------------------- PRICING */
export function pricingPage() {
  const trail = [{ label: "Home", href: "/" }, { label: "Pricing", href: "/pricing" }];
  const cards = [
    { s: "auto-lockout-service", amount: "$85", note: "Service call, plus $1 per mile from Caro", items: ["Damage-free entry", "Cars, trucks, SUVs, semis", "24/7 including holidays"] },
    { s: "fuel-delivery-service", amount: "$55", note: "Plus fuel cost and $1 per mile from Caro", items: ["2 gal unleaded or 5 gal diesel", "Fuel priced per gallon at time of service", "Delivered to your location"] },
    { s: "jump-start-service", amount: "$65", note: "Flat service call, plus mileage", items: ["Surge-protected boost equipment", "Cars, trucks, vans, semis & buses", "Charging system check"] },
    { s: "tire-change-service", amount: "$75", note: "Plus $1 per mile from Caro", items: ["We install your spare", "Proper torque & pressure check", "Cars, trucks, SUVs, trailers"] },
    { s: "tire-repair-service", amount: "$20", note: "Add-on to a $75 tire change", items: ["Repairable tread punctures", "On-site assessment", "Not a standalone service"] },
    { s: "winch-out-service", amount: "$100–$175", note: "Depending on the situation, plus mileage", items: ["Mud, snow, sand, ditch", "Rated rigging & recovery points", "Cars, trucks, supported trailers"] },
  ];
  const body = `
${pageHero({
  h1: "Roadside Assistance Pricing",
  lead:
    "Clear, published rates — no mystery fees and no surprises at the end. Service prices are fixed; mileage is $1 per mile from Caro to your location, and we quote the total before we dispatch.",
  trail,
  pills: [
    { label: "Published rates", icon: "tag" },
    { label: "Mileage explained", icon: "road" },
    { label: "Quote before dispatch", icon: "check" },
  ],
})}

<section class="section">
  <div class="container">
    <div class="section-head section-head--center reveal">
      <span class="eyebrow">Service rates</span>
      <h2>What each service costs</h2>
      <p class="section-lead">These are the prices we charge. The only variable is $1 per mile from Caro to your location.</p>
    </div>
    <div class="price-grid">
      ${cards
        .map(
          (c) => {
            const s = serviceBySlug(c.s);
            return `<div class="price-card reveal">
          <div class="price-card__icon">${icon(s.icon)}</div>
          <h3>${s.name}</h3>
          <div class="price-card__amount">${c.amount}</div>
          <p class="price-card__note">${c.note}</p>
          <ul>${c.items.map((i) => `<li>${i}</li>`).join("")}</ul>
          <a class="btn btn--outline" href="/services/${s.slug}">Service details</a>
        </div>`;
          }
        )
        .join("")}
    </div>
    <p style="font-size:.84rem;color:var(--muted);text-align:center;margin-top:1.5rem">Final pricing may depend on mileage and the specific service requirements. Call ${SITE.phone} for an exact quote.</p>
  </div>
</section>

<section class="section section--paper">
  <div class="container split">
    <div class="split__body reveal">
      <span class="eyebrow">Mileage</span>
      <h2>How the $1-per-mile charge works</h2>
      <p>We dispatch from Caro, so mileage is measured from Caro to your location at $1 per mile. That's the only variable on top of the service price, and it's the same whether you're in town or out on a county road.</p>
      <div class="table-wrap" style="margin-bottom:1.25rem">
        <table>
          <thead><tr><th>Service</th><th>Base price</th><th>Mileage</th></tr></thead>
          <tbody>
            <tr><td>Auto lockout</td><td>$85</td><td>$1 / mile from Caro</td></tr>
            <tr><td>Fuel delivery</td><td>$55 + fuel cost</td><td>$1 / mile from Caro</td></tr>
            <tr><td>Jump start</td><td>$65</td><td>$1 / mile from Caro</td></tr>
            <tr><td>Tire change</td><td>$75</td><td>$1 / mile from Caro</td></tr>
            <tr><td>Tire repair (add-on)</td><td>$20</td><td>Included with tire change</td></tr>
            <tr><td>Vehicle winch out</td><td>$100–$175</td><td>$1 / mile from Caro</td></tr>
          </tbody>
        </table>
      </div>
      <div class="notice notice--info">
        ${icon("info")}
        <div>Tell us your location when you call and we'll give you the full total — service plus mileage — before we send anyone. If the situation turns out to be different on arrival, we'll talk to you before doing additional work.</div>
      </div>
    </div>
    <div class="split__media reveal">
      <div class="art-panel art-panel--teal" style="aspect-ratio:4/4.4">
        <svg viewBox="0 0 440 480" aria-hidden="true" focusable="false" style="padding:2rem">
          <g fill="none" stroke="rgba(255,255,255,.45)" stroke-width="2">
            <circle cx="220" cy="240" r="120" stroke-dasharray="6 10"/>
            <circle cx="220" cy="240" r="70"/>
          </g>
          <circle cx="220" cy="240" r="10" fill="#fff"/>
          <g fill="#fff" font-family="Inter, sans-serif" font-size="15" font-weight="600">
            <text x="220" y="115" text-anchor="middle">Caro</text>
            <text x="220" y="385" text-anchor="middle">$1 / mile</text>
          </g>
          <path d="M220 132v92" stroke="#fff" stroke-width="2" stroke-dasharray="5 6"/>
        </svg>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head reveal">
      <span class="eyebrow">Before you book</span>
      <h2>What's included — and what isn't</h2>
    </div>
    <div class="grid grid--2">
      <div class="feature reveal">
        <div class="feature__icon">${icon("check")}</div>
        <h3>Included in the price</h3>
        <ul class="checklist" style="margin-bottom:0">
          <li>Travel to your location (with mileage shown separately)</li>
          <li>The labor and equipment for the service you booked</li>
          <li>A final check that the work is safe to drive on</li>
          <li>Night, weekend, and holiday availability at the same rate</li>
        </ul>
      </div>
      <div class="feature reveal">
        <div class="feature__icon" style="background:#fff1f1;color:#b42323">${icon("alert")}</div>
        <h3>Not included</h3>
        <ul class="checklist" style="margin-bottom:0">
          <li>Replacement parts, tires, or batteries — we don't sell them</li>
          <li>Towing, transport, or impound services — we don't offer them</li>
          <li>Repairs beyond roadside scope, which need a shop</li>
          <li>Additional fuel beyond the standard quantity</li>
        </ul>
      </div>
    </div>
    <div class="notice" style="margin-top:1.5rem">
      ${icon("card")}
      <div><strong>Payment:</strong> we accept cash and major credit cards. If you have an existing invoice, there's also an <a href="${SITE.paymentUrl}" rel="noopener" target="_blank">online payment option</a>.</div>
    </div>
  </div>
</section>

${faqBlock(
  [
    { q: "How much is an auto lockout?", a: "Auto lockout service is $85, plus $1 per mile from Caro to your location." },
    { q: "How much is fuel delivery?", a: "$55 plus the cost of the fuel and $1 per mile from Caro. We bring 2 gallons of unleaded or 5 gallons of diesel, priced per gallon at the time of service." },
    { q: "How much is a jump start?", a: "Jump start service is $65, plus mileage." },
    { q: "How much is a tire change?", a: "Tire change is $75, plus mileage. A repairable puncture can be fixed for $20 more as an add-on." },
    { q: "How much is a winch out?", a: "Vehicle winch outs run $100 to $175 depending on the situation, plus mileage. A simple drag in a yard is at the low end; a deep ditch at an awkward angle is at the high end." },
    { q: "Do you charge more at night or on holidays?", a: "No. Our published prices are the same regardless of the hour, including overnight, weekends, and holidays." },
    { q: "Can I get an exact quote before you come?", a: "Yes. Give us your location and the service you need when you call, and we'll give you the full total before we dispatch." },
  ],
  { title: "Pricing questions", intro: "The cost questions we answer most often.", eyebrow: "Answers", sectionClass: "section--paper" }
)}

${ctaBand({ title: "Want an exact quote?", text: `Call ${SITE.phone} with your location and what's happening. We'll give you the full price — service plus mileage — before anyone is dispatched.` })}
`;
  return layout({
    title: "Roadside Assistance Pricing | Lockouts $85, Jump Starts $65, Tire Changes $75",
    description:
      "Transparent roadside assistance pricing in Michigan's Thumb Region: lockout $85, fuel delivery $55 plus fuel, jump start $65, tire change $75, tire repair $20 add-on, winch outs $100–$175. Plus $1 per mile from Caro.",
    path: "/pricing",
    body,
    jsonLd: [
      localBusinessSchema(),
      breadcrumbSchema(trail),
      faqSchema([
        { q: "How much is an auto lockout?", a: "Auto lockout service is $85, plus $1 per mile from Caro to your location." },
        { q: "How much is fuel delivery?", a: "$55 plus the cost of the fuel and $1 per mile from Caro." },
        { q: "How much is a jump start?", a: "Jump start service is $65, plus mileage." },
        { q: "How much is a tire change?", a: "Tire change is $75, plus mileage." },
      ]),
    ],
  });
}

/* --------------------------------------------------------------- REVIEWS */
export function reviewsPage() {
  const trail = [{ label: "Home", href: "/" }, { label: "Reviews", href: "/reviews" }];
  const body = `
${pageHero({
  h1: "Customer Reviews",
  lead:
    "Roadside assistance is a business you can't fake. Either someone answers, shows up, and gets you moving — or they don't. More than 250 drivers across the Thumb Region have reviewed us.",
  trail,
  pills: [
    { label: "250+ reviews", icon: "star" },
    { label: "Google, BBB, Yelp, Trustpilot", icon: "shield" },
    { label: "Locally owned since 2020", icon: "home" },
  ],
})}

<section class="section">
  <div class="container">
    <div class="review-layout">
      <div class="rating-block reveal">
        <div class="rating-block__score">${SITE.reviewCount}</div>
        <div class="rating-block__stars">${icon("star")}${icon("star")}${icon("star")}${icon("star")}${icon("star")}</div>
        <p>Customer reviews across four independent platforms.</p>
        <a class="btn btn--primary" href="${SITE.googleReviewUrl}" target="_blank" rel="noopener">${icon("google")} Read reviews on Google</a>
      </div>
      <div class="reveal">
        <span class="eyebrow">Where to find them</span>
        <h2>Verifiable reviews, on platforms you already use</h2>
        <p style="margin-bottom:1.5rem">We don't publish testimonials we can't point you to. Every review below lives on a third-party platform where you can read the full history and leave your own.</p>
        <div class="platform-list">
          ${REVIEW_LINKS.map(
            (p) => `<a class="platform" href="${p.href}" target="_blank" rel="noopener">
            <span class="platform__name"><span class="platform__dot platform__dot--${p.dot}"></span>${p.name}</span>
            <span class="platform__cta">${p.note} ${icon("arrow")}</span>
          </a>`
          ).join("")}
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section section--paper">
  <div class="container">
    <div class="section-head section-head--center reveal">
      <span class="eyebrow">Why people recommend us</span>
      <h2>What our reviews tend to mention</h2>
      <p class="section-lead">These are the things customers tell us directly, at the roadside and afterward.</p>
    </div>
    <div class="grid grid--3">
      <div class="feature reveal">
        <div class="feature__icon">${icon("clock")}</div>
        <h3>Someone answers — any hour</h3>
        <p>Not a voicemail, not a callback queue. Overnight calls are routine for us, and that's usually the first thing people mention.</p>
      </div>
      <div class="feature reveal">
        <div class="feature__icon">${icon("mapPin")}</div>
        <h3>Local enough to actually find you</h3>
        <p>Rural addresses can be hard to locate. Knowing the roads and asking for the right landmarks makes a real difference.</p>
      </div>
      <div class="feature reveal">
        <div class="feature__icon">${icon("tag")}</div>
        <h3>No surprise on the price</h3>
        <p>The total is quoted before dispatch, including mileage. That's a small thing that comes up again and again.</p>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="split">
      <div class="split__body reveal">
        <span class="eyebrow">Leave a review</span>
        <h2>Had us out? Tell people what happened.</h2>
        <p>Reviews are how a local business like ours gets found by the next person stranded on M-81 at eleven at night. If we did right by you, a couple of sentences helps more than you'd think.</p>
        <p>And if something went wrong, we'd rather hear it directly. Call ${SITE.phone} or email <a href="mailto:${SITE.email}">${SITE.email}</a> — we'll make it right if we can.</p>
        <div class="btn-row" style="margin-top:1.25rem">
          <a class="btn btn--primary" href="${SITE.googleReviewUrl}" target="_blank" rel="noopener">${icon("star")} Leave a Google review</a>
          <a class="btn btn--outline" href="/review-platforms">All review platforms</a>
        </div>
      </div>
      <div class="split__media reveal">
        <div class="art-panel" style="aspect-ratio:4/3">
          <svg viewBox="0 0 440 330" aria-hidden="true" focusable="false" style="padding:2rem">
            <g fill="rgba(255,255,255,.14)" stroke="rgba(107,225,208,.5)" stroke-width="1.5">
              <rect x="40" y="60" width="360" height="80" rx="12"/>
              <rect x="40" y="160" width="360" height="80" rx="12"/>
            </g>
            <g fill="#6BE1D0">
              <circle cx="80" cy="100" r="14"/><circle cx="80" cy="200" r="14"/>
            </g>
            <g stroke="rgba(255,255,255,.5)" stroke-width="6" stroke-linecap="round">
              <path d="M115 92h220M115 112h140"/><path d="M115 192h240M115 212h160"/>
            </g>
          </svg>
        </div>
      </div>
    </div>
  </div>
</section>

${ctaBand({})}
`;
  return layout({
    title: "Customer Reviews | Koehler Rescue Services — 250+ Reviews",
    description:
      "Read 250+ customer reviews for Koehler Rescue Services across Google, the Better Business Bureau, Yelp and Trustpilot. Locally owned 24/7 roadside assistance in Michigan's Thumb Region.",
    path: "/reviews",
    body,
    jsonLd: [localBusinessSchema(), breadcrumbSchema(trail)],
  });
}

/* ------------------------------------------------------------------ FAQS */
export function faqsPage() {
  const trail = [{ label: "Home", href: "/" }, { label: "FAQs", href: "/faqs" }];
  const all = [...GENERAL_FAQS, ...SERVICE_AREA_FAQS];
  const body = `
${pageHero({
  h1: "Frequently Asked Questions",
  lead:
    "Straight answers about our services, pricing, coverage, and what to do while you wait. If your question isn't here, call us — we'd rather answer it than have you guess.",
  trail,
  pills: [
    { label: "Pricing", icon: "tag" },
    { label: "Coverage", icon: "mapPin" },
    { label: "Service restrictions", icon: "info" },
  ],
  showActions: false,
})}

<section class="section">
  <div class="container with-aside">
    <div>
      <div class="faq reveal">
        ${all
          .map(
            (f) => `<details>
          <summary>${f.q}</summary>
          <div><p>${f.a}</p></div>
        </details>`
          )
          .join("")}
      </div>

      <div class="reveal" style="margin-top:2.5rem">
        <h2 style="font-size:1.6rem">Service-specific answers</h2>
        <p>Each service page has its own questions and answers, including what's included and what isn't.</p>
        <div class="town-grid" style="margin-top:1rem">
          ${SERVICES.map((s) => `<a class="town-link" href="/services/${s.slug}">${s.name}${icon("arrow")}</a>`).join("")}
        </div>
      </div>
    </div>
    <aside class="aside-sticky">
      <div class="aside-card aside-card--navy">
        <h3>Still need an answer?</h3>
        <a class="aside-card__phone" href="${tel}">${SITE.phone}</a>
        <p style="font-size:.85rem;color:#b3c1de;margin-bottom:1rem">Call any time — day, night, weekend, holiday.</p>
        <a class="btn btn--call" href="${tel}">${icon("phone")} Call now</a>
        <a class="btn btn--ghost" href="/contact" style="margin-top:.6rem;width:100%">Send a message</a>
      </div>
      <div class="aside-card">
        <h3>Quick links</h3>
        <ul class="aside-list">
          <li><a href="/pricing">Pricing &amp; rates${icon("arrow")}</a></li>
          <li><a href="/coverage-area">Coverage area${icon("arrow")}</a></li>
          <li><a href="/services">All services${icon("arrow")}</a></li>
          <li><a href="/request-roadside-assistance">Request service${icon("arrow")}</a></li>
        </ul>
      </div>
    </aside>
  </div>
</section>

${ctaBand({})}
`;
  return layout({
    title: "FAQs | Roadside Assistance Questions Answered | Koehler Rescue Services",
    description:
      "Answers to common questions about Koehler Rescue Services: what we do, pricing, 24/7 availability, coverage across Michigan's Thumb Region, vehicle types, and what to do while you wait.",
    path: "/faqs",
    body,
    jsonLd: [localBusinessSchema(), faqSchema(all), breadcrumbSchema(trail)],
  });
}

/* --------------------------------------------------------------- CONTACT */
export function contactPage() {
  const trail = [{ label: "Home", href: "/" }, { label: "Contact Us", href: "/contact" }];
  const body = `
${pageHero({
  h1: "Contact Koehler Rescue Services",
  lead:
    "Calling is always the fastest way to reach us — the phone is answered 24 hours a day. If you'd rather write, use the form or email, and we'll get back to you.",
  trail,
  pills: [
    { label: "Phone answered 24/7", icon: "phone" },
    { label: "Based in Caro, MI", icon: "mapPin" },
    { label: "Email for quotes & billing", icon: "mail" },
  ],
})}

<section class="section">
  <div class="container split">
    <div class="split__body reveal">
      <span class="eyebrow">Get in touch</span>
      <h2>Three ways to reach us</h2>
      <p style="margin-bottom:1.5rem">For a breakdown right now, call. For quotes, billing, partnerships, or anything that isn't urgent, email or the form works fine.</p>
      <div class="grid grid--2" style="gap:.85rem">
        <a class="feature" href="${tel}" style="text-decoration:none">
          <div class="feature__icon">${icon("phone")}</div>
          <h3 style="font-size:1.05rem">Call or text</h3>
          <p style="font-weight:650;color:var(--navy)">${SITE.phone}</p>
          <p style="font-size:.82rem">Answered 24/7, including holidays</p>
        </a>
        <a class="feature" href="mailto:${SITE.email}" style="text-decoration:none">
          <div class="feature__icon">${icon("mail")}</div>
          <h3 style="font-size:1.05rem">Email</h3>
          <p style="font-weight:650;color:var(--navy);word-break:break-word">${SITE.email}</p>
          <p style="font-size:.82rem">Quotes, billing, partnerships</p>
        </a>
      </div>
      <div class="feature" style="margin-top:.85rem">
        <div class="feature__icon">${icon("mapPin")}</div>
        <h3 style="font-size:1.05rem">Our base</h3>
        <p style="font-weight:650;color:var(--navy)">${SITE.street}, ${SITE.city}, ${SITE.state} ${SITE.zip}</p>
        <p style="font-size:.85rem;margin-bottom:.75rem">We dispatch from Caro and come to you. This isn't a drop-off shop — it's where our trucks live.</p>
        <a class="link-arrow" href="${SITE.googleMapsUrl}" target="_blank" rel="noopener">Open in Google Maps ${icon("arrow")}</a>
      </div>
      <div class="notice notice--info" style="margin-top:1.25rem">
        ${icon("clock")}
        <div><strong>Hours:</strong> ${SITE.hours}. There is no after-hours surcharge.</div>
      </div>
    </div>
    ${contactForm({
      heading: "Send us a message",
      intro: "We read every message. For anything urgent, please call instead.",
    })}
  </div>
</section>

${faqBlock(
  [
    { q: "What's the fastest way to get help?", a: "Calling. The phone is answered 24/7 by someone who can dispatch immediately. Online requests are monitored, but a call is always quicker." },
    { q: "Can I text instead of calling?", a: "Texting the same number works for many situations, especially for sharing a location or a photo. For a genuine emergency, call." },
    { q: "Do you give quotes over the phone?", a: "Yes. Tell us your location and what's happening, and we'll give you the full total including mileage before dispatch." },
    { q: "Where are you located?", a: `We're based at ${SITE.street} in Caro, Michigan. We come to you — you don't need to bring the vehicle to us.` },
    { q: "How do I pay?", a: "Cash or major credit card. Existing invoices can be paid through our online payment link." },
  ],
  { title: "Contact questions", intro: "Before you reach out.", eyebrow: "Answers", sectionClass: "section--paper" }
)}

${ctaBand({})}
`;
  return layout({
    title: "Contact Koehler Rescue Services | 24/7 Roadside Assistance in Caro, MI",
    description:
      "Contact Koehler Rescue Services at 989-286-0100 — answered 24 hours a day. Based in Caro, Michigan and serving the Thumb Region. Email brian@koehlerrescue.com for quotes and billing.",
    path: "/contact",
    body,
    jsonLd: [localBusinessSchema(), breadcrumbSchema(trail)],
  });
}

/* --------------------------------------------------------------- REQUEST */
export function requestPage() {
  const trail = [{ label: "Home", href: "/" }, { label: "Request Roadside Assistance", href: "/request-roadside-assistance" }];
  const body = `
${pageHero({
  h1: "Request Roadside Assistance",
  lead:
    "Send us your location and what's happening, and our team will pick it up. If you're in a travel lane or need help immediately, call instead — a phone call is always faster.",
  trail,
  showActions: false,
})}

<section class="section" style="padding-top:clamp(2rem,4vw,3rem)">
  <div class="container split">
    <div>
      <div class="notice" style="margin-bottom:1.5rem">
        ${icon("phone")}
        <div><strong>In an emergency, call ${SITE.phone}.</strong> If you are stopped in a travel lane, near moving traffic, or someone is injured, call 911 first. Online requests are monitored 24/7 but can't replace a phone call in an urgent situation.</div>
      </div>
      ${dispatchForm({
        heading: "Roadside assistance request",
        intro: "This form goes straight to our dispatch screen, so the job is in front of us the moment you send it.",
      })}
      <p style="font-size:.85rem;margin-top:.9rem">Prefer to write instead? Use the <a href="/contact">contact form</a>, or call <a href="${tel}">${SITE.phone}</a> and we'll take the details over the phone.</p>
    </div>
    <aside class="aside-sticky">
      <div class="aside-card aside-card--navy">
        <h3>Call instead — it's faster</h3>
        <a class="aside-card__phone" href="${tel}">${SITE.phone}</a>
        <p style="font-size:.85rem;color:#b3c1de;margin-bottom:1rem">Answered 24 hours a day, 7 days a week, including holidays.</p>
        <a class="btn btn--call" href="${tel}">${icon("phone")} Call now</a>
      </div>
      <div class="aside-card">
        <h3>What to have ready</h3>
        <ul class="info-list">
          <li>${icon("mapPin")}<span>Your location — road name, nearest cross street, exit, or landmark</span></li>
          <li>${icon("truck")}<span>Vehicle year, make, and model</span></li>
          <li>${icon("info")}<span>What's happening — flat, no start, locked out, stuck, out of fuel</span></li>
          <li>${icon("phone")}<span>A phone number we can reach you on</span></li>
        </ul>
      </div>
      <div class="aside-card">
        <h3>Before we arrive</h3>
        <ul class="info-list">
          <li>${icon("alert")}<span>Get as far off the travel lane as you safely can</span></li>
          <li>${icon("zap")}<span>Turn on your hazard lights</span></li>
          <li>${icon("shield")}<span>Stay buckled in if traffic is close, doors locked</span></li>
          <li>${icon("flame")}<span>Set out a warning triangle if you have one</span></li>
        </ul>
      </div>
    </aside>
  </div>
</section>

<section class="section section--paper">
  <div class="container">
    <div class="section-head section-head--center reveal">
      <span class="eyebrow">What happens next</span>
      <h2>From request to back on the road</h2>
    </div>
    <div class="grid grid--4">
      <div class="feature reveal">
        <div class="feature__icon">${icon("message")}</div>
        <h3 style="font-size:1.05rem">We receive it</h3>
        <p>Your request comes to our team with the details you entered.</p>
      </div>
      <div class="feature reveal">
        <div class="feature__icon">${icon("phone")}</div>
        <h3 style="font-size:1.05rem">We call you</h3>
        <p>We confirm the location, the service, and the price — including mileage.</p>
      </div>
      <div class="feature reveal">
        <div class="feature__icon">${icon("truck")}</div>
        <h3 style="font-size:1.05rem">We dispatch</h3>
        <p>You get an arrival window. If anything changes, we call you.</p>
      </div>
      <div class="feature reveal">
        <div class="feature__icon">${icon("check")}</div>
        <h3 style="font-size:1.05rem">We finish the job</h3>
        <p>We complete the service, check our work, and get you moving.</p>
      </div>
    </div>
  </div>
</section>

${faqBlock(
  [
    { q: "How long until someone contacts me?", a: "Requests are monitored 24/7. Response time depends on call volume — if you need help immediately, call 989-286-0100 instead." },
    { q: "Can I schedule service in advance?", a: "Yes, for non-emergency requests like a planned tire change. Tell us your preferred time in the details field and we'll confirm." },
    { q: "Do I have to be with the vehicle?", a: "Yes — we need access to the vehicle to perform the service, and we'll want to confirm details with you on arrival." },
    { q: "What if my location has no address?", a: "Describe it: road name, direction of travel, nearest cross street, business, or landmark. Photos by text help too." },
  ],
  { title: "Request questions", intro: "How the request process works.", eyebrow: "Answers", sectionClass: "section--paper" }
)}
`;
  return layout({
    title: "Request Roadside Assistance | 24/7 Service in Michigan's Thumb",
    description:
      "Request roadside assistance from Koehler Rescue Services. Send your location, vehicle, and issue online, or call 989-286-0100 for immediate 24/7 help across Michigan's Thumb Region.",
    path: "/request-roadside-assistance",
    body,
    jsonLd: [localBusinessSchema(), breadcrumbSchema(trail)],
  });
}

/* --------------------------------------------------------------- PRIVACY */
export function privacyPage() {
  const trail = [{ label: "Home", href: "/" }, { label: "Privacy & Terms", href: "/privacy" }];
  const body = `
${pageHero({
  h1: "Privacy &amp; Terms",
  lead: "How Koehler Rescue Services handles the information you send us, and the terms that apply to our services.",
  trail,
  showActions: false,
})}
<section class="section">
  <div class="container container--narrow prose">
    <h2>Information we collect</h2>
    <p>When you call, email, or submit a form on this website, we collect the information you provide: your name, phone number, email address if you give it, vehicle details, your location, and a description of the problem. If you submit a request form, we also record the time it was sent.</p>
    <h2>How we use it</h2>
    <ul>
      <li>To contact you about your request and dispatch service</li>
      <li>To answer questions, provide quotes, and handle billing</li>
      <li>To keep a record of work performed for warranty and accounting purposes</li>
      <li>To follow up on a service call or a complaint</li>
    </ul>
    <p>We do not sell your information. We don't share it with advertisers. We share it only with the service providers needed to operate the business — for example, our email delivery provider — or where required by law.</p>
    <h2>Form submissions</h2>
    <p>Requests submitted through this website are delivered by email to our business inbox. They are not stored in a public database. Please don't include payment card numbers or sensitive personal information in a form message.</p>
    <h2>Cookies and analytics</h2>
    <p>This website uses Google Analytics 4 to understand which pages are useful to visitors and how people find us. It sets cookies and collects usage data such as pages viewed, approximate location (city level), device type, and the site you arrived from. IP addresses are anonymized, and we do not run advertising or remarketing cookies.</p>
    <p>You can block analytics cookies through your browser settings, or install Google's opt-out browser add-on. Blocking them does not affect your ability to use this site or request service.</p>
    <h2>Your choices</h2>
    <p>You can ask us to correct or delete the contact information we hold about you by emailing <a href="mailto:${SITE.email}">${SITE.email}</a>. We may need to keep records of completed work for legal and accounting reasons.</p>
    <h2>Service terms</h2>
    <p>Pricing published on this site is a starting rate for the listed service. Mileage is $1 per mile from Caro to your location. The total is quoted before dispatch. Additional work is discussed with you before it's performed.</p>
    <p>Roadside assistance is performed at the customer's location and depends on conditions. We may decline or stop work where it can't be done safely, where the vehicle can't be accessed, or where the requested service isn't one we offer. We do not provide towing, vehicle transport, or impound services.</p>
    <p>Tire repair is available only as an add-on to a tire change service and only where the damage can be repaired safely. A usable spare tire must be available for a tire change. We do not supply tires, batteries, or other replacement parts.</p>
    <h2>Contact</h2>
    <p>${SITE.legal}<br />${SITE.street}, ${SITE.city}, ${SITE.state} ${SITE.zip}<br />Phone: <a href="${tel}">${SITE.phone}</a><br />Email: <a href="mailto:${SITE.email}">${SITE.email}</a></p>
    <p style="font-size:.85rem;color:var(--muted)">Last updated: November 2026.</p>
  </div>
</section>
${ctaBand({})}
`;
  return layout({
    title: "Privacy & Terms | Koehler Rescue Services",
    description:
      "How Koehler Rescue Services collects and uses information submitted through this website, plus the terms that apply to our roadside assistance services.",
    path: "/privacy",
    body,
    jsonLd: [breadcrumbSchema(trail)],
  });
}

/* ------------------------------------------------------ REVIEW PLATFORMS */
export function reviewPlatformsPage() {
  const trail = [{ label: "Home", href: "/" }, { label: "Review Platforms", href: "/review-platforms" }];
  const body = `
${pageHero({
  h1: "Leave Us a Review",
  lead:
    "Your feedback helps other drivers decide who to call, and it helps us get better. If you've used our service, we'd be grateful for a review on whichever platform you prefer.",
  trail,
  showActions: false,
})}
<section class="section">
  <div class="container">
    <div class="grid grid--2">
      <div class="reveal">
        <div class="platform-list">
          ${[
            { name: "Google", href: SITE.googleReviewUrl, dot: "g", note: "Most helpful for local search" },
            { name: "Better Business Bureau", href: SITE.social.bbb + "/customer-reviews", dot: "bbb", note: "Accredited business reviews" },
            { name: "Yelp", href: SITE.social.yelp, dot: "y", note: "Customer reviews" },
            { name: "Trustpilot", href: SITE.social.trustpilot, dot: "t", note: "Independent reviews" },
          ]
            .map(
              (p) => `<a class="platform" href="${p.href}" target="_blank" rel="noopener">
            <span class="platform__name"><span class="platform__dot platform__dot--${p.dot}"></span>${p.name}</span>
            <span class="platform__cta">${p.note} ${icon("arrow")}</span>
          </a>`
            )
            .join("")}
        </div>
        <p style="margin-top:1.5rem">Reviews are hosted on those platforms, not on this website — so what you read there is what customers actually wrote.</p>
        <a class="btn btn--outline" href="/reviews" style="margin-top:1rem">Read about our reviews</a>
      </div>
      <div class="reveal">
        <div class="form-card">
          <h3>Had a problem with a call?</h3>
          <p style="font-size:.92rem">Tell us directly first. We'd rather fix it than have you carry it around.</p>
          <ul class="info-list" style="margin-top:1rem">
            <li>${icon("phone")}<span><a href="${tel}"><strong>${SITE.phone}</strong></a><br />Call any time</span></li>
            <li>${icon("mail")}<span><a href="mailto:${SITE.email}">${SITE.email}</a><br />Email the owner directly</span></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</section>
${ctaBand({})}
`;
  return layout({
    title: "Review Platforms | Leave a Review for Koehler Rescue Services",
    description:
      "Leave a review for Koehler Rescue Services on Google, the Better Business Bureau, Yelp, or Trustpilot. Your feedback helps other drivers across Michigan's Thumb Region.",
    path: "/review-platforms",
    body,
    jsonLd: [localBusinessSchema(), breadcrumbSchema(trail)],
  });
}

/* --------------------------------------------------- VERIFIED PARTNERS */
export function partnersPage() {
  const trail = [{ label: "Home", href: "/" }, { label: "Verified Partners & Memberships", href: "/verified-partners-memberships" }];
  const partners = [
    { name: "Better Business Bureau", href: "https://www.bbb.org/us/mi/caro/profile/roadside-assistance/koehler-rescue-services-0372-90042756/", desc: "Accredited and verified, reflecting a commitment to ethical business practices and customer satisfaction." },
    { name: "Chamber of Commerce", href: "https://www.chamberofcommerce.com/business-directory/michigan/mayville/towing-service/2012860863-koehler-rescue-services?source=memberwebsite", desc: "Community membership that connects us with local businesses and initiatives across the Thumb." },
    { name: "EZlocal", href: "https://ezlocal.com/mi/caro/roadside-assistance/0917144151", desc: "A verified local listing that keeps our business information accurate and easy to find." },
    { name: "ShowMeLocal", href: "https://www.showmelocal.com/profile.aspx?bid=23646150", desc: "Verified directory listing that reinforces credibility with local drivers." },
    { name: "Trustpilot", href: SITE.social.trustpilot, desc: "Independent review platform where customers share honest feedback about their service." },
    { name: "4 Road Service", href: "https://www.4roadservice.com/caro-michigan/provider/koehler-rescue-services-llc", desc: "A platform connecting drivers and fleets with dependable roadside providers." },
    { name: "Locally Owned & Operated", href: "https://locallyownedandoperated.org/", desc: "Certification recognizing trusted, community-based service providers rooted in the areas they serve." },
  ];
  const body = `
${pageHero({
  h1: "Verified Partners &amp; Memberships",
  lead:
    "Trust matters when you're on the shoulder of the road. These are the organizations and directories that verify who we are and how we operate.",
  trail,
  showActions: false,
})}
<section class="section">
  <div class="container">
    <div class="section-head reveal">
      <span class="eyebrow">Verified listings</span>
      <h2>Where we're recognized</h2>
      <p class="section-lead">Each link goes to the third-party profile — you can check us yourself.</p>
    </div>
    <div class="grid grid--3">
      ${partners
        .map(
          (p) => `<a class="county-card reveal" href="${p.href}" target="_blank" rel="noopener">
        <div class="county-card__top"><div class="county-card__badge">${icon("shield")}</div><span class="county-card__tag">Verified</span></div>
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <div class="county-card__towns"><strong>Status</strong>Active listing · click to verify</div>
      </a>`
        )
        .join("")}
    </div>
  </div>
</section>
<section class="section section--paper">
  <div class="container split">
    <div class="split__body reveal">
      <span class="eyebrow">Why it matters</span>
      <h2>Verification is a proxy for how a company behaves</h2>
      <p>Accreditation and verified listings don't make a business good. But they do mean the business is willing to be identified, reviewed, and held to a standard — which is more than you can say for a number on a search results page with no address behind it.</p>
      <p>We're a single local operation based in Caro. There's no call center, no franchise, and no dispatch network. What you see is what shows up.</p>
      <div class="btn-row" style="margin-top:1.25rem">
        <a class="btn btn--outline" href="/about">About our team</a>
        <a class="btn btn--call" href="${tel}">${icon("phone")} Call ${SITE.phone}</a>
      </div>
    </div>
    <div class="split__media reveal">
      <div class="art-panel" style="aspect-ratio:4/3">
        ${countyArt(11)}
      </div>
    </div>
  </div>
</section>
${ctaBand({})}
`;
  return layout({
    title: "Verified Partners & Memberships | Koehler Rescue Services",
    description:
      "Koehler Rescue Services is verified and listed with the Better Business Bureau, Chamber of Commerce, EZlocal, ShowMeLocal, Trustpilot, 4 Road Service, and Locally Owned & Operated.",
    path: "/verified-partners-memberships",
    body,
    jsonLd: [localBusinessSchema(), breadcrumbSchema(trail)],
  });
}

/* --------------------------------------------- MOTOR CLUB & INSURANCE */
export function motorClubPage() {
  const trail = [{ label: "Home", href: "/" }, { label: "Motor Club & Insurance Partners", href: "/motor-club-insurance-partners" }];
  const clubs = [
    { name: "AAA", note: "Roadside assistance for members" },
    { name: "Agero", note: "Nationwide roadside and dispatch support" },
    { name: "Allstate", note: "Roadside coverage for policyholders" },
    { name: "State Farm", note: "Roadside assistance for policyholders" },
    { name: "Michigan Farm Bureau", note: "Localized roadside support for members" },
    { name: "Auto-Owners Insurance", note: "Roadside assistance for policyholders" },
    { name: "Pinnacle Motor Club", note: "Roadside help for members" },
    { name: "Allied Dispatch Solutions", note: "Coordinated roadside dispatch" },
    { name: "Curbside SOS", note: "Roadside services for supported vehicles" },
  ];
  const body = `
${pageHero({
  h1: "Motor Club &amp; Insurance Partners",
  lead:
    "We work with motor clubs and insurance providers to deliver roadside assistance to their members and policyholders across Michigan's Thumb Region.",
  trail,
  showActions: false,
})}
<section class="section">
  <div class="container">
    <div class="section-head reveal">
      <span class="eyebrow">Our partners</span>
      <h2>Providers we work with</h2>
      <p class="section-lead">If your coverage includes roadside assistance, there's a good chance we can perform the service. Call us and we'll explain how your coverage applies.</p>
    </div>
    <div class="grid grid--3">
      ${clubs
        .map(
          (c) => `<div class="feature reveal">
        <div class="feature__icon">${icon("handshake")}</div>
        <h3 style="font-size:1.1rem">${c.name}</h3>
        <p>${c.note}</p>
      </div>`
        )
        .join("")}
    </div>
    <div class="notice notice--info" style="margin-top:1.75rem">
      ${icon("info")}
      <div>Coverage, authorization, and billing are determined by your motor club or insurer. We can confirm what we're able to perform; your provider confirms what's covered. We recommend calling your provider first if you're unsure.</div>
    </div>
  </div>
</section>
<section class="section section--paper">
  <div class="container split">
    <div class="split__body reveal">
      <span class="eyebrow">What this means for you</span>
      <h2>Priority service from a team that knows these roads</h2>
      <p>When your coverage routes a call to us, you get the same service we provide to our own customers: a technician dispatched from Caro, the right equipment for the job, and a straight answer about what we can and can't do.</p>
      <ul class="checklist">
        <li>Auto lockouts, jump starts, fuel delivery, tire changes, tire repair add-ons, and winch outs</li>
        <li>Available 24 hours a day, 7 days a week</li>
        <li>Service coordinated with your provider's requirements</li>
        <li>Honest communication if a request isn't something we can perform</li>
      </ul>
      <div class="notice">
        ${icon("alert")}
        <div><strong>We are not a towing company.</strong> We provide roadside assistance only — no towing, vehicle transport, or impound services.</div>
      </div>
    </div>
    <div class="split__media reveal">
      <div class="art-panel art-panel--teal" style="aspect-ratio:4/3">
        <svg viewBox="0 0 440 330" aria-hidden="true" focusable="false" style="padding:2rem">
          <g fill="none" stroke="rgba(255,255,255,.55)" stroke-width="2">
            <path d="M60 240V110a30 30 0 0 1 30-30h100a30 30 0 0 1 30 30v130"/>
            <path d="M220 150h70a30 30 0 0 1 30 30v60"/>
            <circle cx="110" cy="262" r="20"/><circle cx="330" cy="262" r="20"/>
            <path d="M130 240h180"/>
          </g>
          <circle cx="350" cy="80" r="34" fill="rgba(255,255,255,.16)"/>
          <path d="M336 80l10 11 20-22" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </div>
  </div>
</section>
${faqBlock(
  [
    { q: "Do you bill my insurance directly?", a: "That depends on your provider and the arrangement. Call us with your coverage details and we'll explain what's possible." },
    { q: "Do you accept AAA?", a: "We work with AAA and other motor clubs. Call us and we'll confirm how your membership applies to the service you need." },
    { q: "What if my provider sends you a request?", a: "We'll perform the service if it's within our capabilities and coverage. If it isn't something we do, we'll tell your provider so they can reroute." },
  ],
  { title: "Motor club & insurance questions", eyebrow: "Answers", sectionClass: "section--paper" }
)}
${ctaBand({})}
`;
  return layout({
    title: "Motor Club & Insurance Partners | Koehler Rescue Services",
    description:
      "Koehler Rescue Services works with AAA, Agero, Allstate, State Farm, Michigan Farm Bureau, Auto-Owners, Pinnacle Motor Club, Allied Dispatch and Curbside SOS across Michigan's Thumb Region.",
    path: "/motor-club-insurance-partners",
    body,
    jsonLd: [localBusinessSchema(), breadcrumbSchema(trail)],
  });
}

/* ------------------------------------------------------------------- 404 */
export function notFoundPage() {
  const body = `
<section class="page-hero" style="padding-block:clamp(3rem,7vw,5rem)">
  <div class="page-hero__glow"></div>
  <div class="page-hero__grid"></div>
  <div class="container">
    <h1>Page not found</h1>
    <p>That page doesn't exist — but our phone line does, and it's answered 24/7.</p>
    <div class="btn-row">
      <a class="btn btn--call btn--lg" href="${tel}">${icon("phone")} Call ${SITE.phone}</a>
      <a class="btn btn--ghost btn--lg" href="/">Back to home</a>
    </div>
  </div>
</section>
<section class="section">
  <div class="container">
    <div class="section-head reveal"><h2>Popular pages</h2></div>
    <div class="town-grid">
      ${[...NAV.services, ...NAV.counties.slice(0, 5)]
        .map((l) => `<a class="town-link" href="${l.href}">${l.label}${icon("arrow")}</a>`)
        .join("")}
      <a class="town-link" href="/pricing">Pricing${icon("arrow")}</a>
      <a class="town-link" href="/faqs">FAQs${icon("arrow")}</a>
      <a class="town-link" href="/contact">Contact${icon("arrow")}</a>
    </div>
  </div>
</section>
`;
  return layout({
    title: "Page Not Found | Koehler Rescue Services",
    description: "The page you were looking for could not be found. Call Koehler Rescue Services at 989-286-0100 for 24/7 roadside assistance in Michigan's Thumb Region.",
    path: "/404",
    body,
    noindex: true,
  });
}
