// Icon set + decorative artwork. All inline SVG so there are no image requests.

const P = {
  phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
  arrow: '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>',
  chevron: '<polyline points="6 9 12 15 18 9"/>',
  check: '<polyline points="20 6 9 17 4 12"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/>',
  clock: '<circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15.5 14"/>',
  star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  key: '<circle cx="7.5" cy="15.5" r="4.5"/><path d="M10.7 12.3 21 2"/><path d="M17 6l3 3"/><path d="M14 9l2.5 2.5"/>',
  fuel: '<path d="M4 20V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v14"/><path d="M3 20h12"/><path d="M14 9h3a2 2 0 0 1 2 2v5a2 2 0 0 0 2 2"/><path d="M6 8h6v4H6z"/>',
  battery: '<rect x="2" y="8" width="16" height="9" rx="2"/><path d="M18 11h3v3h-3"/><path d="M5 11v3"/><path d="M8 11v3"/><path d="M11 11v3"/>',
  tire: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.4"/><path d="M12 3v4"/><path d="M12 17v4"/><path d="M3 12h4"/><path d="M17 12h4"/>',
  wrenchTire: '<circle cx="10" cy="14" r="7"/><circle cx="10" cy="14" r="2.4"/><path d="M15.5 8.5 20 4"/><path d="M18 3l3 3-2 2-3-3z"/>',
  winch: '<path d="M3 17h8"/><path d="M7 17V9a4 4 0 0 1 8 0v3"/><circle cx="19" cy="14" r="3"/><path d="M16 14H8"/>',
  truck: '<path d="M2 17h1"/><path d="M2 17V7h11v10"/><path d="M13 10h4l4 4v3h-2"/><circle cx="7" cy="18" r="2"/><circle cx="17.5" cy="18" r="2"/><path d="M9 18h6.5"/>',
  mapPin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2 7 12 13 22 7"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  zap: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
  snow: '<path d="M12 2v20"/><path d="M4.5 6.5 19.5 17.5"/><path d="M19.5 6.5 4.5 17.5"/><path d="M9 4l3 3 3-3"/><path d="M9 20l3-3 3 3"/>',
  road: '<path d="M4 21 9 3"/><path d="M20 21 15 3"/><path d="M12 4v3"/><path d="M12 11v3"/><path d="M12 18v3"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18"/><path d="M8 3v4"/><path d="M16 3v4"/>',
  card: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>',
  message: '<path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  alert: '<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  info: '<circle cx="12" cy="12" r="9"/><line x1="12" y1="11" x2="12" y2="16"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
  lock: '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  tools: '<path d="M14.7 6.3a4 4 0 0 0 5 5L21 21H9l-5-5 8.7-8.7z"/>',
  rv: '<path d="M2 16V8a2 2 0 0 1 2-2h12l4 4v6"/><path d="M2 16h1"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/><path d="M9 18h6"/>',
  trailer: '<path d="M3 15h13"/><path d="M16 11v4"/><circle cx="7" cy="18" r="3"/><path d="M16 12h4l2-4"/><path d="M3 15V9h6"/>',
  semi: '<path d="M2 16V6h12v10"/><path d="M14 10h4l4 4v2h-2"/><circle cx="6" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
  bus: '<rect x="4" y="4" width="16" height="13" rx="2"/><path d="M4 11h16"/><circle cx="8" cy="19" r="1.6"/><circle cx="16" cy="19" r="1.6"/>',
  facebook: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
  instagram: '<rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>',
  google: '<path d="M12 11v2.4h5.6a4.8 4.8 0 0 1-2.1 3.1v2.3h3.3c1.9-1.8 3-4.4 3-7.5 0-.7 0-1.4-.2-2H12z"/><path d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.7-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22z"/><path d="M6.4 14c-.2-.6-.3-1.2-.3-1.9s.1-1.3.3-1.9V7.6H3.1A10 10 0 0 0 2 12.1c0 1.6.4 3.1 1.1 4.5L6.4 14z"/><path d="M12 5.8c1.5 0 2.8.5 3.8 1.5l2.8-2.8A10 10 0 0 0 3.1 7.6l3.3 2.6C7.2 7.9 9.4 5.8 12 5.8z"/>',
  yelp: '<path d="M11 13.4 7.5 15c-.7.3-1.5 0-1.8-.7L4 10.3c-.3-.8.2-1.6 1-1.7l4-.6c.7-.1 1.4.4 1.5 1.1l.6 2.8c.1.7-.3 1.3-1 1.5z" fill="currentColor" stroke="none"/><path d="M12.6 14.5l2.6 3.2c.5.6.3 1.5-.4 1.8l-3 1.4c-.7.3-1.5-.2-1.6-1l-.3-2.8c-.1-.6.3-1.2.9-1.3l1.8-.4z" fill="currentColor" stroke="none"/><path d="M13.6 11.6 18 9.8c.8-.3 1.6.2 1.7 1l.2 3.6c0 .8-.7 1.4-1.5 1.3l-4.6-.6c-.6-.1-1-.7-.9-1.3l.2-1.6c0-.4.2-.5.5-.6z" fill="currentColor" stroke="none"/><path d="M13 9.4 14.6 4c.2-.7 1.1-1.1 1.8-.6l2.4 1.9c.6.5.6 1.5 0 2l-3.6 2.9c-.5.4-1.3.3-1.7-.2l-.5-.6z" fill="currentColor" stroke="none"/>',
  flame: '<path d="M12 22c4 0 7-2.8 7-6.5 0-4.5-4.5-6.8-5-11.5-2 1-4 3.5-4 6 0 1.2.4 2 .4 2.8 0 1-.8 1.7-1.7 1.7-1 0-1.6-.8-1.6-1.7-1.4 1.3-2.1 3-2.1 4.7C5 19.2 8 22 12 22z"/>',
  home: '<path d="M3 10 12 3l9 7v10a1 1 0 0 1-1 1h-5v-6H10v6H4a1 1 0 0 1-1-1z"/>',
  tag: '<path d="M20.6 13.4 12 22 2 12V2h10l8.6 8.6a2 2 0 0 1 0 2.8z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
  camera: '<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>',
  handshake: '<path d="M11 17 8 14a2 2 0 0 1 0-3l3-3 3 3"/><path d="M2 12l4-4 4 4"/><path d="M22 12l-4-4-3 3"/><path d="M14 16l-3 3"/>',
  award: '<circle cx="12" cy="9" r="6"/><path d="M8.5 14 7 22l5-3 5 3-1.5-8"/>',
};

export function icon(name, cls = "") {
  const body = P[name] || P.info;
  return `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${body}</svg>`;
}

export const SERVICE_ICONS = {
  "auto-lockout-service": "key",
  "fuel-delivery-service": "fuel",
  "jump-start-service": "battery",
  "tire-change-service": "tire",
  "tire-repair-service": "wrenchTire",
  "winch-out-service": "winch",
};

export function brandMark(cls = "") {
  return `<svg class="${cls}" viewBox="0 0 44 48" fill="none" aria-hidden="true" focusable="false">
  <defs>
    <linearGradient id="bm-g" x1="0" y1="0" x2="44" y2="48" gradientUnits="userSpaceOnUse">
      <stop stop-color="#1FBCF7"/><stop offset="0.55" stop-color="#0D49BD"/><stop offset="1" stop-color="#03645A"/>
    </linearGradient>
  </defs>
  <path d="M22 1.5 42 8.2v16.1C42 36.4 33.2 43.9 22 46.5 10.8 43.9 2 36.4 2 24.3V8.2L22 1.5Z" fill="url(#bm-g)"/>
  <path d="M22 1.5 42 8.2v16.1C42 36.4 33.2 43.9 22 46.5 10.8 43.9 2 36.4 2 24.3V8.2L22 1.5Z" stroke="#6BE1D0" stroke-opacity=".55" stroke-width="1.2"/>
  <path d="M13 34.5 18.6 14h7.2l5.2 20.5h-4.6l-.9-4.2h-7l-.9 4.2H13Z" fill="#fff"/>
  <path d="M18.4 26.4h6.6l-1-4.6h-4.6l-1 4.6Z" fill="#0A1138" fill-opacity=".55"/>
  <path d="M11 38h22" stroke="#6BE1D0" stroke-width="2" stroke-linecap="round"/>
</svg>`;
}

/** Night-road hero backdrop: perspective lanes + horizon glow. */
export function roadScene() {
  return `<svg class="hero__road" viewBox="0 0 1440 320" preserveAspectRatio="none" aria-hidden="true" focusable="false">
  <defs>
    <linearGradient id="rd-fade" x1="0" y1="0" x2="0" y2="1">
      <stop stop-color="#1FBCF7" stop-opacity="0.22"/><stop offset="1" stop-color="#6BE1D0" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="rd-line" x1="0" y1="1" x2="0" y2="0">
      <stop stop-color="#6BE1D0" stop-opacity="0.9"/><stop offset="1" stop-color="#6BE1D0" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <path d="M0 320 560 120h320l560 200H0Z" fill="url(#rd-fade)"/>
  <g stroke="url(#rd-line)" stroke-width="3" stroke-linecap="round">
    <path d="M720 132v22"/><path d="M720 178v26"/><path d="M720 232v32"/><path d="M720 292v26"/>
  </g>
  <g stroke="#6BE1D0" stroke-opacity="0.35" stroke-width="1.5">
    <path d="M560 120 240 320"/><path d="M880 120l320 200"/>
  </g>
</svg>`;
}

/** Abstract county map used on location pages. */
export function countyArt(seed = 0) {
  const rows = 7;
  let shape = "";
  for (let i = 0; i < rows; i++) {
    const w = 300 - Math.abs(i - 3) * 34;
    const x = 220 - w / 2 + ((seed * 13 + i * 7) % 18) - 9;
    const y = 60 + i * 34;
    shape += `<rect x="${x.toFixed(1)}" y="${y}" width="${w}" height="30" rx="6" fill="rgba(255,255,255,${(0.05 + i * 0.012).toFixed(3)})" stroke="rgba(107,225,208,.22)" stroke-width="1"/>`;
  }
  return `<svg viewBox="0 0 440 340" aria-hidden="true" focusable="false">
    <defs><radialGradient id="ca-g${seed}" cx="50%" cy="40%"><stop stop-color="#1FBCF7" stop-opacity=".4"/><stop offset="1" stop-color="#1FBCF7" stop-opacity="0"/></radialGradient></defs>
    <rect width="440" height="340" fill="none"/>
    <circle cx="220" cy="150" r="170" fill="url(#ca-g${seed})"/>
    ${shape}
    <circle cx="220" cy="150" r="7" fill="#6BE1D0"/>
    <circle cx="220" cy="150" r="16" fill="none" stroke="#6BE1D0" stroke-opacity=".45"/>
    <circle cx="220" cy="150" r="27" fill="none" stroke="#6BE1D0" stroke-opacity=".2"/>
  </svg>`;
}

/** Decorative art for blog cards (three variants). */
export function blogArt(i = 0) {
  const variant = i % 3;
  if (variant === 0) {
    return `<svg viewBox="0 0 320 152" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <g stroke="rgba(107,225,208,.22)" stroke-width="1"><path d="M0 30h320M0 60h320M0 90h320M0 120h320"/></g>
      <circle cx="255" cy="42" r="52" fill="#1FBCF7" fill-opacity=".18"/>
      <path d="M-10 152 130 60h60l140 92" fill="#6BE1D0" fill-opacity=".12"/>
      <path d="M160 70v14M160 96v16M160 124v14" stroke="#6BE1D0" stroke-width="4" stroke-linecap="round"/>
    </svg>`;
  }
  if (variant === 1) {
    return `<svg viewBox="0 0 320 152" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <circle cx="60" cy="150" r="96" fill="#6BE1D0" fill-opacity=".18"/>
      <circle cx="290" cy="20" r="80" fill="#1FBCF7" fill-opacity=".22"/>
      <g stroke="rgba(255,255,255,.16)" stroke-width="1.5"><path d="M0 118h320M0 84h320"/></g>
      <rect x="118" y="62" width="86" height="52" rx="10" fill="none" stroke="#6BE1D0" stroke-opacity=".55" stroke-width="2"/>
      <path d="M126 62v-8h70v8" stroke="#6BE1D0" stroke-opacity=".35" stroke-width="2"/>
    </svg>`;
  }
  return `<svg viewBox="0 0 320 152" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
    <g stroke="rgba(107,225,208,.16)" stroke-width="1.5">
      <path d="M40 0v152M90 0v152M140 0v152M190 0v152M240 0v152M290 0v152"/>
    </g>
    <path d="M0 152 110 44h100l110 108" fill="#1FBCF7" fill-opacity=".14"/>
    <path d="M160 44v108" stroke="#6BE1D0" stroke-opacity=".5" stroke-width="3" stroke-dasharray="14 12"/>
  </svg>`;
}
