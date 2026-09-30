import { AnimatePresence } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { apps } from '../../data/apps'
import { profile } from '../../data/profile'
import { useNow } from '../../hooks/useNow'
import { formatTime } from '../../lib/clock'
import { wallpaperStyle } from '../../lib/wallpaper'
import AppIcon from '../AppIcon'
import Avatar from '../Avatar'
import AppSheet from './AppSheet'

const DOCK_SIZE = 4

export default function HomeScreen() {
  const [openApp, setOpenApp] = useState(null)
  const closingRef = useRef(false)

  useEffect(() => {
    const onPopState = () => {
      closingRef.current = false
      setOpenApp(null)
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  function launch(id, event) {
    if (openApp) return
    const box = event.currentTarget.getBoundingClientRect()
    window.history.pushState({ ...window.history.state, app: id }, '')
    setOpenApp({ id, origin: `${box.x + box.width / 2}px ${box.y + box.height / 2}px` })
  }

  function closeApp() {
    if (closingRef.current) return
    closingRef.current = true
    window.history.back()
  }

  const app = apps.find((item) => item.id === openApp?.id)
  const dockApps = apps.slice(0, DOCK_SIZE)
  const gridApps = apps.slice(DOCK_SIZE)

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-cover bg-center text-white" style={wallpaperStyle}>
      <StatusBar />
      <main className="flex-1 overflow-y-auto px-5 pt-4">
        <section aria-label="Sapaan" className="flex items-center gap-4 rounded-3xl bg-white/20 p-4 backdrop-blur-xl">
          <Avatar size="md" />
          <div className="min-w-0">
            <p className="text-lg font-semibold">{profile.name}</p>
            <p className="truncate text-sm text-white/80">{profile.tagline}</p>
          </div>
        </section>
        {gridApps.length > 0 && (
          <ul aria-label="Aplikasi" className="mt-6 grid grid-cols-4 gap-y-6">
            {gridApps.map((item) => (
              <li key={item.id}>
                <LaunchButton app={item} onLaunch={launch} showLabel />
              </li>
            ))}
          </ul>
        )}
      </main>
      <nav aria-label="Dock" className="mx-3 mb-3 flex justify-around rounded-[2rem] bg-white/25 p-3 backdrop-blur-xl">
        {dockApps.map((item) => (
          <LaunchButton key={item.id} app={item} onLaunch={launch} />
        ))}
      </nav>
      <AnimatePresence>
        {app && <AppSheet key={app.id} app={app} origin={openApp.origin} onClose={closeApp} />}
      </AnimatePresence>
    </div>
  )
}

function LaunchButton({ app, onLaunch, showLabel = false }) {
  return (
    <button
      type="button"
      aria-label={app.title}
      onClick={(event) => onLaunch(app.id, event)}
      className="flex w-full flex-col items-center gap-1"
    >
      <AppIcon id={app.id} className="size-14" />
      {showLabel && <span className="text-xs">{app.title}</span>}
    </button>
  )
}

function StatusBar() {
  const now = useNow()
  return (
    <div className="flex shrink-0 items-center justify-between px-6 pt-3 text-sm font-semibold">
      <time dateTime={now.toISOString()}>{formatTime(now)}</time>
      <div aria-hidden="true" className="flex items-center gap-1.5">
        <svg viewBox="0 0 18 12" className="h-3 w-[18px]" fill="currentColor">
          <rect x="0" y="8" width="3" height="4" rx="1" />
          <rect x="5" y="5" width="3" height="7" rx="1" />
          <rect x="10" y="2.5" width="3" height="9.5" rx="1" />
          <rect x="15" y="0" width="3" height="12" rx="1" />
        </svg>
        <svg viewBox="0 0 16 12" className="h-3 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M1.5 4.5a9.5 9.5 0 0 1 13 0" />
          <path d="M4 7.3a6 6 0 0 1 8 0" />
          <circle cx="8" cy="10.3" r="0.9" fill="currentColor" />
        </svg>
        <svg viewBox="0 0 26 12" className="h-3 w-[26px]">
          <rect x="0.5" y="0.5" width="22" height="11" rx="3" fill="none" stroke="currentColor" opacity="0.5" />
          <rect x="2" y="2" width="17" height="8" rx="1.5" fill="currentColor" />
          <rect x="23.5" y="4" width="2" height="4" rx="1" fill="currentColor" opacity="0.5" />
        </svg>
      </div>
    </div>
  )
}
