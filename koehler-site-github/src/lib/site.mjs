// Business constants and navigation model — single source of truth.
export const SITE = {
  name: "Koehler Rescue Services",
  legal: "Koehler Rescue Services LLC",
  // The live domain 301s koehlerrescue.com -> www.koehlerrescue.com, so the
  // www host is the canonical one and matches the existing indexed sitemap.
  url: "https://www.koehlerrescue.com",
  phone: "989-286-0100",
  phoneRaw: "+19892860100",
  email: "brian@koehlerrescue.com",
  street: "1684 Colwood Road",
  city: "Caro",
  state: "MI",
  stateName: "Michigan",
  zip: "48723",
  region: "Michigan's Thumb Region",
  hours: "Open 24 hours a day, 7 days a week — including weekends and holidays",
  hoursShort: "24/7",
  founded: 2020,
  reviewCount: "250+",
  googleReviewUrl: "https://share.google/SbP9c9k0Ach01gHK0",
  googleMapsUrl: "https://www.google.com/maps/place/Koehler+Rescue+Services",
  paymentUrl: "https://securepayment.link/koehlerrescue",
  // Existing GA4 property carried over from the previous site so reporting
  // stays continuous across the relaunch.
  gaId: "G-S6FNMM5VF0",
  social: {
    facebook: "https://facebook.com/koehlerrescue",
    instagram: "https://instagram.com/koehlerrescue",
    yelp: "https://www.yelp.com/biz/koehler-rescue-services-caro-8",
    bbb: "https://www.bbb.org/us/mi/caro/profile/roadside-assistance/koehler-rescue-services-0372-90042756",
    trustpilot: "https://www.trustpilot.com/review/koehlerrescue.com?sort=relevance",
  },
};

export const tel = `tel:${SITE.phoneRaw}`;

export function abs(path = "/") {
  return SITE.url + path;
}

export const NAV = {
  services: [
    { href: "/services/auto-lockout-service", label: "Auto Lockout Service" },
    { href: "/services/fuel-delivery-service", label: "Emergency Fuel Delivery" },
    { href: "/services/jump-start-service", label: "Jump Start Service" },
    { href: "/services/tire-change-service", label: "Tire Change Service" },
    { href: "/services/tire-repair-service", label: "Tire Repair (Add-On)" },
    { href: "/services/winch-out-service", label: "Vehicle Winch Outs" },
  ],
  counties: [
    { href: "/coverage-area/tuscola-county", label: "Tuscola County", group: "Core" },
    { href: "/coverage-area/huron-county", label: "Huron County", group: "Core" },
    { href: "/coverage-area/sanilac-county", label: "Sanilac County", group: "Core" },
    { href: "/coverage-area/bay-county", label: "Bay County", group: "Extended" },
    { href: "/coverage-area/saginaw-county", label: "Saginaw County", group: "Extended" },
    { href: "/coverage-area/lapeer-county", label: "Lapeer County", group: "Extended" },
    { href: "/coverage-area/genesee-county", label: "Genesee County", group: "Extended" },
    { href: "/coverage-area/shiawassee-county", label: "Shiawassee County", group: "Extended" },
    { href: "/coverage-area/saint-clair-county", label: "St. Clair County", group: "Extended" },
    { href: "/coverage-area/midland-county", label: "Midland County", group: "Extended" },
  ],
  main: [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/services", label: "Services", children: "services" },
    { href: "/coverage-area", label: "Coverage Area", children: "counties" },
    { href: "/pricing", label: "Pricing" },
    { href: "/reviews", label: "Reviews" },
    { href: "/Faqs", label: "FAQs" },
    { href: "/contact", label: "Contact" },
  ],
};

export const STATS = [
  { value: "5,000+", label: "Lockouts resolved" },
  { value: "3,000+", label: "Jump starts provided" },
  { value: "3,500+", label: "Tire services completed" },
  { value: "1,200+", label: "Fuel deliveries made" },
];
