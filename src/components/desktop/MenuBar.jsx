import { useNow } from '../../hooks/useNow'
import { formatClock } from '../../lib/clock'
import Avatar from '../Avatar'
import { MENU_BAR_HEIGHT } from './constants'

export default function MenuBar({ appName }) {
  const now = useNow()
  return (
    <div
      className="absolute inset-x-0 top-0 z-[1000] flex select-none items-center justify-between bg-white/30 px-4 text-[13px] text-gray-900 backdrop-blur-xl"
      style={{ height: MENU_BAR_HEIGHT }}
    >
      <div className="flex items-center gap-4">
        <Avatar size="xs" />
        <span aria-label="Aplikasi aktif" className="font-semibold">
          {appName}
        </span>
      </div>
      <time dateTime={now.toISOString()}>{formatClock(now)}</time>
    </div>
  )
}
