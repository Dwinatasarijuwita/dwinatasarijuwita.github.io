import AppIcon from '../AppIcon'

export default function DesktopIcons({ apps, onOpen }) {
  return (
    <ul aria-label="Desktop" className="absolute right-4 top-4 flex flex-col items-center gap-4">
      {apps.map((app) => (
        <li key={app.id}>
          <button
            type="button"
            aria-label={app.desktopLabel}
            data-minimize-target={app.id}
            onClick={() => onOpen(app.id)}
            className="flex w-28 select-none flex-col items-center gap-1.5 rounded-md p-1.5 hover:bg-white/15 focus-visible:bg-white/25 focus-visible:outline-none"
          >
            {app.kind === 'file' ? <FileIcon /> : <AppIcon id={app.id} className="size-14" />}
            <span className="line-clamp-2 break-words text-center text-xs font-semibold leading-tight text-white [text-shadow:0_1px_3px_rgb(0_0_0/0.8)]">
              {app.desktopLabel}
            </span>
          </button>
        </li>
      ))}
    </ul>
  )
}

function FileIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 48 60" className="h-16 w-14 drop-shadow-md">
      <path d="M4 2h28l12 12v42a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" fill="#fff" />
      <path d="M32 2v10a2 2 0 0 0 2 2h10z" fill="#d1d5db" />
      <path d="M10 22h24M10 28h28M10 34h20" stroke="#d1d5db" strokeWidth="2" strokeLinecap="round" />
      <rect x="2" y="40" width="44" height="13" fill="#e11d48" />
      <text x="24" y="50" textAnchor="middle" fontSize="9" fontWeight="700" fill="#fff" fontFamily="system-ui, sans-serif">
        PDF
      </text>
    </svg>
  )
}
