import { useNow } from '../../hooks/useNow'
import { formatClock } from '../../lib/clock'
import { MENU_BAR_HEIGHT } from './constants'

export default function MenuBar({ appName }) {
  const now = useNow()
  return (
    <div
      className="absolute inset-x-0 top-0 z-[1000] flex select-none items-center justify-between bg-white/30 px-4 text-[13px] text-gray-900 backdrop-blur-xl"
      style={{ height: MENU_BAR_HEIGHT }}
    >
      <div className="flex items-center gap-4">
        <AppleLogo />
        <span aria-label="Aplikasi aktif" className="font-semibold">
          {appName}
        </span>
      </div>
      <time dateTime={now.toISOString()}>{formatClock(now)}</time>
    </div>
  )
}

function AppleLogo() {
  return (
    <svg role="img" aria-label="Logo" viewBox="0 0 24 24" className="size-4">
      <path
        fill="currentColor"
        d="M12 7c-1.5-1.2-5-1.5-6.5 1.5S5 16 7.5 19c1.2 1.4 2.5 1.5 3.3 1 .7-.4 1.7-.4 2.4 0 .8.5 2.1.4 3.3-1 2.5-3 3.5-7.5 2-10.5S13.5 5.8 12 7z"
      />
      <path d="M12 7c0-2 1-3.5 3-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}
