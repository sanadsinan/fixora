// Six preset illustrations, drawn with SVG shapes.
// Each has a background colour and the shapes drawn on top of it.
const art = {
  plumbing: {
    bg: "#dbeafe",
    shapes: (
      <>
        <path d="M30 96H142V50H214" fill="none" stroke="#94a3b8" strokeWidth="16" strokeLinejoin="round" />
        <rect x="22" y="86" width="10" height="20" rx="3" fill="#64748b" />
        <rect x="208" y="42" width="10" height="16" rx="3" fill="#64748b" />
        <path d="M180 74c0 0-11 15-11 23a11 11 0 0 0 22 0c0-8-11-23-11-23z" fill="#3b82f6" />
        <g transform="translate(62 30) rotate(25)" fill="none" stroke="#fbbf24" strokeWidth="10" strokeLinecap="round">
          <path d="M-10.4 -6A12 12 0 1 1 -10.4 6" />
          <line x1="11" y1="0" x2="62" y2="0" />
        </g>
      </>
    ),
  },
  electrical: {
    bg: "#fef9c3",
    shapes: (
      <>
        <circle cx="110" cy="56" r="30" fill="#fde047" />
        <path d="M98 60l6-12 6 12 6-12" fill="none" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="96" y="84" width="28" height="12" rx="4" fill="#94a3b8" />
        <rect x="100" y="96" width="20" height="8" rx="4" fill="#64748b" />
        <g stroke="#f59e0b" strokeWidth="4" strokeLinecap="round">
          <line x1="110" y1="12" x2="110" y2="20" />
          <line x1="68" y1="30" x2="74" y2="36" />
          <line x1="152" y1="30" x2="146" y2="36" />
          <line x1="62" y1="56" x2="70" y2="56" />
          <line x1="158" y1="56" x2="150" y2="56" />
        </g>
        <polygon points="196,22 172,70 190,70 180,108 218,54 198,54 210,22" fill="#f59e0b" />
      </>
    ),
  },
  cleaning: {
    bg: "#dcfce7",
    shapes: (
      <>
        <path d="M84 64h72l-8 46h-56z" fill="#3b82f6" />
        <ellipse cx="120" cy="64" rx="36" ry="7" fill="#60a5fa" />
        <circle cx="104" cy="42" r="9" fill="#ffffff" stroke="#93c5fd" strokeWidth="2" />
        <circle cx="128" cy="30" r="12" fill="#ffffff" stroke="#93c5fd" strokeWidth="2" />
        <circle cx="146" cy="50" r="7" fill="#ffffff" stroke="#93c5fd" strokeWidth="2" />
        <path d="M190 26L194 36L204 40L194 44L190 54L186 44L176 40L186 36Z" fill="#16a34a" />
        <path d="M50 50L52.5 57.5L60 60L52.5 62.5L50 70L47.5 62.5L40 60L47.5 57.5Z" fill="#22c55e" />
        <path d="M214 88L216 94L222 96L216 98L214 104L212 98L206 96L212 94Z" fill="#22c55e" />
      </>
    ),
  },
  carpentry: {
    bg: "#ffedd5",
    shapes: (
      <>
        <rect x="30" y="92" width="200" height="24" rx="4" fill="#d97706" />
        <path d="M44 100h60M120 108h80M60 110h30" stroke="#b45309" strokeWidth="2" strokeLinecap="round" />
        <rect x="190" y="68" width="4" height="26" fill="#94a3b8" />
        <rect x="183" y="63" width="18" height="6" rx="2" fill="#64748b" />
        <g transform="translate(100 56) rotate(-30)">
          <rect x="-6" y="0" width="12" height="62" rx="5" fill="#92400e" />
          <rect x="-28" y="-16" width="56" height="20" rx="4" fill="#64748b" />
          <rect x="-28" y="-16" width="14" height="20" rx="4" fill="#475569" />
        </g>
      </>
    ),
  },
  "ac-repair": {
    bg: "#e0f2fe",
    shapes: (
      <>
        <rect x="40" y="24" width="180" height="54" rx="12" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
        <rect x="56" y="36" width="46" height="8" rx="4" fill="#cbd5e1" />
        <circle cx="196" cy="40" r="4" fill="#22c55e" />
        <rect x="56" y="58" width="148" height="6" rx="3" fill="#e2e8f0" />
        <g fill="none" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round">
          <path d="M70 92c8 8-8 16 0 24" />
          <path d="M110 92c8 8-8 16 0 24" />
          <path d="M150 92c8 8-8 16 0 24" />
          <path d="M190 92c8 8-8 16 0 24" />
        </g>
      </>
    ),
  },
  painting: {
    bg: "#fce7f3",
    shapes: (
      <>
        <rect x="24" y="98" width="212" height="22" rx="11" fill="#f472b6" />
        <rect x="52" y="26" width="116" height="30" rx="10" fill="#ec4899" />
        <path d="M168 41h24v30h-46" fill="none" stroke="#475569" strokeWidth="5" strokeLinejoin="round" />
        <rect x="136" y="66" width="18" height="38" rx="6" fill="#92400e" />
        <path d="M100 64c0 0-6 9-6 13a6 6 0 0 0 12 0c0-4-6-13-6-13z" fill="#f472b6" />
        <circle cx="70" cy="76" r="5" fill="#ec4899" />
        <rect x="206" y="58" width="34" height="32" rx="5" fill="#ffffff" stroke="#f9a8d4" strokeWidth="2" />
        <rect x="206" y="58" width="34" height="9" rx="4" fill="#ec4899" />
      </>
    ),
  },
};

// The list the provider chooses from
export const illustrationOptions = [
  { id: "plumbing", label: "Plumbing" },
  { id: "electrical", label: "Electrical" },
  { id: "cleaning", label: "Cleaning" },
  { id: "carpentry", label: "Carpentry" },
  { id: "ac-repair", label: "AC repair" },
  { id: "painting", label: "Painting" },
];

// If a provider has not chosen one, use the one matching their category
const defaultFor = {
  Plumbing: "plumbing",
  Electrical: "electrical",
  Cleaning: "cleaning",
  Carpentry: "carpentry",
  "AC Repair": "ac-repair",
  Painting: "painting",
};

export const defaultIllustrationId = (service) =>
  defaultFor[service] || "plumbing";

// Normal use: a card picture.
// With the "banner" prop: a wide banner that holds whatever you put inside it.
function ServiceIllustration({
  id,
  service,
  height = 130,
  banner = false,
  children,
}) {
  const key = art[id] ? id : defaultIllustrationId(service);
  const { bg, shapes } = art[key];

  if (banner) {
    return (
      <div className="art-banner" style={{ background: bg }}>
        <svg
          className="art-banner-svg"
          viewBox="0 0 260 130"
          preserveAspectRatio="xMaxYMid meet"
          aria-hidden="true"
        >
          {shapes}
        </svg>
        <div className="art-banner-content">{children}</div>
      </div>
    );
  }

  return (
    <svg
      className="service-art"
      viewBox="0 0 260 130"
      preserveAspectRatio="xMidYMid slice"
      style={{ height }}
      role="img"
      aria-label={`${service || "Service"} illustration`}
    >
      <rect width="260" height="130" fill={bg} />
      {shapes}
    </svg>
  );
}

export default ServiceIllustration;