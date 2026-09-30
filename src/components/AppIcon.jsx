const ICONS = {
  about: {
    background: 'linear-gradient(180deg, #a5b4fc, #6366f1)',
    glyph: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-6 8-6s8 2 8 6" />
      </>
    ),
  },
  resume: {
    background: 'linear-gradient(180deg, #fde68a, #f59e0b)',
    glyph: (
      <>
        <path d="M7 3h7l5 5v13H7z" />
        <path d="M14 3v5h5M10 13h6M10 17h6" />
      </>
    ),
  },
  contact: {
    background: 'linear-gradient(180deg, #d6d3d1, #78716c)',
    glyph: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <circle cx="9" cy="11" r="2" />
        <path d="M5.5 16c.6-1.5 1.9-2.3 3.5-2.3s2.9.8 3.5 2.3M14.5 10h3.5M14.5 13.5h3.5" />
      </>
    ),
  },
  music: {
    background: 'linear-gradient(180deg, #fb7185, #e11d48)',
    glyph: (
      <>
        <path d="M9 18V6l10-2v12" />
        <circle cx="6.5" cy="18" r="2.5" />
        <circle cx="16.5" cy="16" r="2.5" />
      </>
    ),
  },
}

export default function AppIcon({ id, className = '' }) {
  const icon = ICONS[id]
  return (
    <span
      aria-hidden="true"
      className={`flex aspect-square items-center justify-center rounded-[22%] shadow-md ${className}`}
      style={{ background: icon.background }}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-3/5 w-3/5"
        fill="none"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {icon.glyph}
      </svg>
    </span>
  )
}
