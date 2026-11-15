import { SITE, tel, NAV } from "../lib/site.mjs";
import { icon, countyArt, roadScene } from "../lib/art.mjs";
import {
  layout, ctaBand, faqBlock, serviceCard,
  localBusinessSchema, faqSchema, breadcrumbSchema,
} from "../lib/ui.mjs";
import { pageHero } from "./core.mjs";
import { SERVICES } from "../data/services.mjs";
import { COUNTIES, CITIES, countyBySlug, cityBySlug } from "../data/locations.mjs";

const countyCrumb = (c) => ({ label: c.name, href: `/coverage-area/${c.slug}` });

/* ----------------------------------------------------------- COVERAGE HUB */
export function coveragePage() {
  const trail = [{ label: "Home", href: "/" }, { label: "Coverage Area", href: "/coverage-area" }];
  const core = COUNTIES.filter((c) => c.group === "core");
  const ext = COUNTIES.filter((c) => c.group === "extended");
  const body = `
${pageHero({
  h1: "Roadside Assistance Across Michigan's Thumb Region",
  lead:
    "We're based in Caro and dispatch across ten counties — core coverage in Tuscola, Huron, and Sanilac, plus seven extended counties around the Thumb. Mileage is $1 per mile from Caro, quoted before we roll.",
  trail,
  pills: [
    { label: "10 counties", icon: "mapPin" },
    { label: "11 Tuscola communities", icon: "road" },
    { label: "Mileage quoted up front", icon: "tag" },
  ],
})}

<section class="section">
  <div class="container">
    <div class="section-head reveal">
      <span class="eyebrow">Core coverage</span>
      <h2>Where we're closest</h2>
      <p class="section-lead">These three counties are the heart of our service area. From Caro, we can usually reach most of Tuscola County quickly, with Huron and Sanilac close behind.</p>
    </div>
    <div class="grid grid--3">
      ${core
        .map(
          (c) => `<a class="county-card reveal" href="/coverage-area/${c.slug}">
        <div class="county-card__top">
          <div class="county-card__badge">${c.short.slice(0, 3).toUpperCase()}</div>
          <span class="county-card__tag">Core coverage</span>
        </div>
        <h3>${c.name}</h3>
        <p>County seat: ${c.seat}. ${c.note.split(".")[0]}.</p>
        <div class="county-card__towns"><strong>Communities</strong>${c.towns.slice(0, 8).map((t) => t.name).join(" · ")}</div>
      </a>`
        )
        .join("")}
    </div>
  </div>
</section>

<section class="section section--paper">
  <div class="container">
    <div class="section-head reveal">
      <span class="eyebrow">Extended coverage</span>
      <h2>Where we still come out</h2>
      <p class="section-lead">Extended counties are a longer drive for us. Same services, same 24/7 answer — with mileage from Caro and an honest arrival window before you commit.</p>
    </div>
    <div class="grid grid--3">
      ${ext
        .map(
          (c) => `<a class="county-card reveal" href="/coverage-area/${c.slug}">
        <div class="county-card__top">
          <div class="county-card__badge">${c.short.slice(0, 3).toUpperCase()}</div>
          <span class="county-card__tag county-card__tag--x">Extended</span>
        </div>
        <h3>${c.name}</h3>
        <p>County seat: ${c.seat}. ${c.towns.slice(0, 4).map((t) => t.name).join(", ")} and more.</p>
        <div class="county-card__towns"><strong>Communities</strong>${c.towns.slice(0, 7).map((t) => t.name).join(" · ")}</div>
      </a>`
        )
        .join("")}
    </div>
  </div>
</section>

<section class="section">
  <div class="container split">
    <div class="split__body reveal">
      <span class="eyebrow">Tuscola County communities</span>
      <h2>Every community in our home county</h2>
      <p>Each of these has its own page with local roads, common roadside problems, and the services we run there most often.</p>
      <div class="town-grid" style="margin-top:1.25rem">
        ${CITIES.map((c) => `<a class="town-link" href="/coverage-area/tuscola-county/${c.slug}">${c.name}${icon("arrow")}</a>`).join("")}
      </div>
      <p style="font-size:.85rem;color:var(--muted);margin-top:1rem">Outside Tuscola County? Browse the county pages above, or call ${SITE.phone} and tell us where you are.</p>
    </div>
    <div class="split__media reveal">
      <div class="art-panel" style="aspect-ratio:4/3.4">
        ${countyArt(5)}
        <div class="stat-chip stat-chip--tl">
          <div class="stat-chip__icon">${icon("mapPin")}</div>
          <div><strong>Caro, MI</strong><span>Dispatch base</span></div>
        </div>
        <div class="stat-chip stat-chip--br">
          <div class="stat-chip__icon">${icon("road")}</div>
          <div><strong>$1 / mile</strong><span>From Caro</span></div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section section--navy">
  <div class="container">
    <div class="section-head reveal">
      <span class="eyebrow">Services available</span>
      <h2>Same six services, anywhere we go</h2>
      <p class="section-lead">Coverage changes how far we drive. It doesn't change what we bring.</p>
    </div>
    <div class="grid grid--3">
      ${SERVICES.map(
        (s) => `<a class="feature reveal" href="/services/${s.slug}" style="text-decoration:none;display:block">
        <div class="feature__icon">${icon(s.icon)}</div>
        <h3 style="font-size:1.12rem">${s.name}</h3>
        <p>${s.short}</p>
        <span class="link-arrow" style="margin-top:.75rem;color:var(--turq)">Details ${icon("arrow")}</span>
      </a>`
      ).join("")}
    </div>
  </div>
</section>

${faqBlock(
  [
    { q: "Do you really cover all ten counties?", a: "Yes. Tuscola, Huron, and Sanilac are core coverage; Bay, Saginaw, Lapeer, Genesee, Shiawassee, St. Clair, and Midland are extended coverage. We dispatch from Caro for all of them." },
    { q: "Does coverage cost more in extended counties?", a: "The service price is the same everywhere. What changes is mileage: $1 per mile from Caro to your location. We quote the total before dispatch." },
    { q: "Do you have offices in other counties?", a: "No. We're one local operation based in Caro. We don't claim offices, yards, or dispatch centers we don't have." },
    { q: "What if I'm outside these counties?", a: "Call us. If we can't reach you in a reasonable time, we'll say so and point you toward a provider who can." },
    { q: "Which communities have their own pages?", a: "Every community in Tuscola County — Caro, Cass City, Vassar, Millington, Reese, Mayville, Kingston, Akron, Fairgrove, Gagetown, and Unionville." },
  ],
  { title: "Coverage questions", intro: "How our service area actually works.", eyebrow: "Answers", sectionClass: "section--paper" }
)}

${ctaBand({})}
`;
  return layout({
    title: "Coverage Area | 24/7 Roadside Assistance in Michigan's Thumb Region",
    description:
      "Koehler Rescue Services covers 10 counties across Michigan's Thumb Region: Tuscola, Huron, Sanilac, Bay, Saginaw, Lapeer, Genesee, Shiawassee, St. Clair and Midland. 24/7, dispatched from Caro.",
    path: "/coverage-area",
    body,
    jsonLd: [localBusinessSchema(), breadcrumbSchema(trail), faqSchema([
      { q: "Do you really cover all ten counties?", a: "Yes. Tuscola, Huron, and Sanilac are core coverage; Bay, Saginaw, Lapeer, Genesee, Shiawassee, St. Clair, and Midland are extended coverage." },
      { q: "Does coverage cost more in extended counties?", a: "The service price is the same everywhere. Mileage is $1 per mile from Caro to your location." },
    ])],
  });
}

/* ---------------------------------------------------------- COUNTY PAGE */
export function countyPage(slug) {
  const c = countyBySlug(slug);
  const trail = [
    { label: "Home", href: "/" },
    { label: "Coverage Area", href: "/coverage-area" },
    { label: c.name, href: `/coverage-area/${c.slug}` },
  ];
  const hasCityPages = CITIES.some((x) => x.countySlug === c.slug);
  const neighbors = COUNTIES.filter((x) => x.slug !== c.slug).slice(0, 5);

  const body = `
${pageHero({
  h1: c.h1,
  lead: c.lead,
  trail,
  pills: [
    { label: "24/7 availability", icon: "clock" },
    { label: `County seat: ${c.seat}`, icon: "mapPin" },
    { label: c.group === "core" ? "Core coverage" : "Extended coverage", icon: "road" },
  ],
})}

<section class="section">
  <div class="container with-aside">
    <div>
      <div class="prose reveal">
        ${c.intro.map((p) => `<p>${p}</p>`).join("")}
        <h2>Roadside services in ${c.name}</h2>
        <p>We bring the service to you — no need to move a vehicle that won't start, and no waiting for a shop to open. These are the six services available across ${c.name}:</p>
      </div>

      <div class="grid grid--3 reveal" style="margin-top:1.5rem">
        ${SERVICES.map(
          (s) => `<a class="service-card" href="/services/${s.slug}" style="padding:1.2rem">
          <div class="service-card__icon" style="width:42px;height:42px;margin-bottom:.85rem">${icon(s.icon)}</div>
          <h3 style="font-size:1.08rem">${s.name}</h3>
          <p style="font-size:.85rem;margin-bottom:.75rem">${s.short}</p>
          <div class="service-card__meta" style="padding-top:.6rem">
            <span class="service-card__price" style="font-size:1rem">${s.price}</span>
            <span class="link-arrow" style="font-size:.78rem">Details ${icon("arrow")}</span>
          </div>
        </a>`
        ).join("")}
      </div>

      <div class="reveal" style="margin-top:2.5rem">
        <h2 style="font-size:1.65rem">${hasCityPages ? `Communities we serve in ${c.name}` : `Communities in and around ${c.name}`}</h2>
        <p>${hasCityPages ? "Each community has its own page with local roads and the calls we handle there most often." : `We reach these communities from our base in Caro. Distance varies, so call and we'll confirm the arrival window and total price.`}</p>
        ${
          hasCityPages
            ? `<div class="town-grid" style="margin-top:1.25rem">
          ${CITIES.filter((x) => x.countySlug === c.slug)
            .map((x) => `<a class="town-link" href="/coverage-area/${c.slug}/${x.slug}">${x.name}${icon("arrow")}</a>`)
            .join("")}
        </div>`
            : `<div class="vehicle-grid" style="margin-top:1.25rem">
          ${c.towns.map((t) => `<div class="vehicle-chip">${icon("mapPin")} ${t.name}</div>`).join("")}
        </div>
        <p style="font-size:.85rem;color:var(--muted);margin-top:.9rem">Don't see your community? Call ${SITE.phone} — if we can reach you, we'll come.</p>`
        }
        <div class="tag-row" style="margin-top:1.5rem">
          <span class="tag">Major routes</span>
          ${c.highways.map((h) => `<span class="tag" style="background:var(--turq-soft);color:var(--teal)">${h}</span>`).join("")}
        </div>
      </div>

      <div class="reveal" style="margin-top:2.5rem">
        <h2 style="font-size:1.65rem">Local note: what we see in ${c.name}</h2>
        <p>${c.note}</p>
        <div class="notice notice--info">
          ${icon("info")}
          <div><strong>Mileage:</strong> $1 per mile from Caro to your location, on top of the service price. We quote the total before dispatch — no surprises at the end.</div>
        </div>
      </div>

      <div class="reveal" style="margin-top:2.5rem">
        <h2 style="font-size:1.65rem">Nearby counties</h2>
        <div class="town-grid" style="margin-top:1rem">
          ${neighbors.map((n) => `<a class="town-link" href="/coverage-area/${n.slug}">${n.name}${icon("arrow")}</a>`).join("")}
        </div>
      </div>
    </div>

    <aside class="aside-sticky">
      <div class="aside-card aside-card--navy">
        <h3>Stranded in ${c.name}?</h3>
        <a class="aside-card__phone" href="${tel}">${SITE.phone}</a>
        <p style="font-size:.85rem;color:#b3c1de;margin-bottom:1rem">Answered 24 hours a day, 7 days a week.</p>
        <a class="btn btn--call" href="${tel}">${icon("phone")} Call now</a>
        <a class="btn btn--ghost" href="/request-roadside-assistance" style="margin-top:.6rem;width:100%">Request service</a>
      </div>
      <div class="aside-card">
        <h3>Services in ${c.short} County</h3>
        <ul class="aside-list">
          ${SERVICES.map((s) => `<li><a href="/services/${s.slug}">${s.name}${icon("arrow")}</a></li>`).join("")}
        </ul>
      </div>
      <div class="aside-card">
        <h3>Pricing at a glance</h3>
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

${faqBlock(
  [
    ...c.faqs,
    { q: "Are you a towing company?", a: "No. We provide roadside assistance only — lockouts, fuel delivery, jump starts, tire changes, tire repair add-ons, and vehicle winch outs. We don't tow or transport vehicles." },
  ],
  {
    title: `${c.name} roadside assistance FAQs`,
    intro: `Local questions about service in ${c.name}.`,
    eyebrow: "Answers",
    sectionClass: "section--paper",
  }
)}

${ctaBand({
  title: `Need help in ${c.name}?`,
  text: `Call ${SITE.phone} and we'll confirm your location, the price including mileage, and an arrival window. Available 24 hours a day, every day.`,
})}
`;
  return layout({
    title: c.metaTitle,
    description: c.metaDescription,
    path: `/coverage-area/${c.slug}`,
    body,
    jsonLd: [
      localBusinessSchema(),
      faqSchema(c.faqs),
      breadcrumbSchema(trail),
      {
        "@context": "https://schema.org",
        "@type": "Service",
        name: `24/7 Roadside Assistance in ${c.name}, Michigan`,
        serviceType: "Roadside assistance",
        provider: { "@id": `${SITE.url}/#business` },
        areaServed: { "@type": "AdministrativeArea", name: `${c.name}, MI` },
        url: `${SITE.url}/coverage-area/${c.slug}`,
      },
    ],
  });
}

/* ------------------------------------------------------------ CITY PAGE */
export function cityPage(countySlug, citySlug) {
  const c = countyBySlug(countySlug);
  const city = cityBySlug(citySlug);
  const trail = [
    { label: "Home", href: "/" },
    { label: "Coverage Area", href: "/coverage-area" },
    countyCrumb(c),
    { label: city.name, href: `/coverage-area/${c.slug}/${city.slug}` },
  ];
  const others = CITIES.filter((x) => x.slug !== city.slug);

  const body = `
${pageHero({
  h1: city.h1,
  lead: city.lead,
  trail,
  pills: [
    { label: "24/7 availability", icon: "clock" },
    { label: city.countyName, icon: "mapPin" },
    { label: "We come to you", icon: "truck" },
  ],
})}

<section class="section">
  <div class="container with-aside">
    <div>
      <div class="prose reveal">
        ${city.intro.map((p) => `<p>${p}</p>`).join("")}
        <h2>Roadside services in ${city.name}</h2>
        <p>All six of our services are available in ${city.name}, at your location, any hour of the day or night.</p>
      </div>

      <div class="grid grid--3 reveal" style="margin-top:1.5rem">
        ${SERVICES.map(
          (s) => `<a class="service-card" href="/services/${s.slug}" style="padding:1.2rem">
          <div class="service-card__icon" style="width:42px;height:42px;margin-bottom:.85rem">${icon(s.icon)}</div>
          <h3 style="font-size:1.08rem">${s.name}</h3>
          <div class="service-card__meta" style="padding-top:.6rem;border-top:0">
            <span class="service-card__price" style="font-size:1rem">${s.price}</span>
            <span class="link-arrow" style="font-size:.78rem">Details ${icon("arrow")}</span>
          </div>
        </a>`
        ).join("")}
      </div>

      <div class="reveal" style="margin-top:2.5rem">
        <h2 style="font-size:1.65rem">Local note: what we see in ${city.name}</h2>
        <p>${city.local}</p>
        <div class="tag-row" style="margin-top:1.25rem">
          <span class="tag">Roads nearby</span>
          ${city.roads.map((r) => `<span class="tag" style="background:var(--turq-soft);color:var(--teal)">${r}</span>`).join("")}
        </div>
      </div>

      <div class="reveal" style="margin-top:2.5rem">
        <div class="notice notice--info">
          ${icon("mapPin")}
          <div><strong>${city.name} is in ${city.countyName}.</strong> We dispatch from Caro, and mileage is $1 per mile from Caro to your location. <a href="/coverage-area/${c.slug}">See the ${city.countyName} page</a> for county-wide coverage.</div>
        </div>
      </div>

      <div class="reveal" style="margin-top:2.5rem">
        <h2 style="font-size:1.65rem">Other communities we serve</h2>
        <div class="town-grid" style="margin-top:1rem">
          ${others.slice(0, 9).map((x) => `<a class="town-link" href="/coverage-area/${x.countySlug}/${x.slug}">${x.name}${icon("arrow")}</a>`).join("")}
        </div>
      </div>
    </div>

    <aside class="aside-sticky">
      <div class="aside-card aside-card--navy">
        <h3>Need help in ${city.name}?</h3>
        <a class="aside-card__phone" href="${tel}">${SITE.phone}</a>
        <p style="font-size:.85rem;color:#b3c1de;margin-bottom:1rem">24 hours a day, 7 days a week — including holidays.</p>
        <a class="btn btn--call" href="${tel}">${icon("phone")} Call now</a>
        <a class="btn btn--ghost" href="/request-roadside-assistance" style="margin-top:.6rem;width:100%">Request service</a>
      </div>
      <div class="aside-card">
        <h3>${city.countyName}</h3>
        <ul class="aside-list">
          <li><a href="/coverage-area/${c.slug}">${c.name} coverage${icon("arrow")}</a></li>
          ${CITIES.filter((x) => x.countySlug === c.slug && x.slug !== city.slug)
            .slice(0, 7)
            .map((x) => `<li><a href="/coverage-area/${c.slug}/${x.slug}">${x.name}${icon("arrow")}</a></li>`)
            .join("")}
        </ul>
      </div>
      <div class="aside-card">
        <h3>Services</h3>
        <ul class="aside-list">
          ${SERVICES.map((s) => `<li><a href="/services/${s.slug}">${s.name}${icon("arrow")}</a></li>`).join("")}
        </ul>
      </div>
    </aside>
  </div>
</section>

${faqBlock(
  [
    ...city.faqs,
    { q: "Do you charge extra for mileage in " + city.name + "?", a: `Mileage is $1 per mile from Caro to your location, in addition to the service price. We quote the total before dispatch.` },
  ],
  {
    title: `${city.name} roadside assistance FAQs`,
    intro: `Questions drivers in ${city.name} ask us.`,
    eyebrow: "Answers",
    sectionClass: "section--paper",
  }
)}

${ctaBand({
  title: `Stranded in ${city.name}?`,
  text: `Call ${SITE.phone} — a local team answers 24 hours a day. We'll confirm the price and an arrival window before we head out.`,
})}
`;
  return layout({
    title: city.metaTitle,
    description: city.metaDescription,
    path: `/coverage-area/${c.slug}/${city.slug}`,
    body,
    jsonLd: [
      localBusinessSchema(),
      faqSchema(city.faqs),
      breadcrumbSchema(trail),
      {
        "@context": "https://schema.org",
        "@type": "Service",
        name: `Roadside Assistance in ${city.name}, MI`,
        serviceType: "Roadside assistance",
        provider: { "@id": `${SITE.url}/#business` },
        areaServed: { "@type": "City", name: `${city.name}, MI` },
        url: `${SITE.url}/coverage-area/${c.slug}/${city.slug}`,
      },
    ],
  });
}
