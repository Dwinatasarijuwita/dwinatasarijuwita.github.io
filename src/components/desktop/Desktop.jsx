import { AnimatePresence } from 'motion/react'
import { useRef } from 'react'
import { apps } from '../../data/apps'
import { profile } from '../../data/profile'
import { useElementSize } from '../../hooks/useElementSize'
import { useWindowManager } from '../../hooks/useWindowManager'
import { wallpaperStyle } from '../../lib/wallpaper'
import { MENU_BAR_HEIGHT } from './constants'
import DesktopIcons from './DesktopIcons'
import Dock from './Dock'
import MenuBar from './MenuBar'
import Window from './Window'

export default function Desktop() {
  const { windows, activeId, open, close, minimize, toggleMaximize, focus, move } = useWindowManager(apps)
  const areaRef = useRef(null)
  const areaSize = useElementSize(areaRef)
  const activeApp = apps.find((app) => app.id === activeId)
  const isFullScreen = Boolean(activeId && windows[activeId].isMaximized)
  const dockApps = apps.filter((app) => app.placement === 'dock')
  const desktopApps = apps.filter((app) => app.placement === 'desktop')

  return (
    <div className="fixed inset-0 isolate overflow-hidden bg-cover bg-center" style={wallpaperStyle}>
      {/* Dark mode dims the wallpaper rather than swapping it. */}
      <div aria-hidden="true" data-testid="wallpaper-dim" className="pointer-events-none absolute inset-0 -z-10 hidden bg-black/35 dark:block" />
      <MenuBar appName={activeApp?.title ?? profile.name} autoHide={isFullScreen} />
      <div ref={areaRef} className="absolute inset-x-0 bottom-0 isolate" style={{ top: MENU_BAR_HEIGHT }}>
        <DesktopIcons apps={desktopApps} onOpen={open} />
        <AnimatePresence>
          {apps
            .filter((app) => windows[app.id].isOpen)
            .map((app) => (
              <Window
                key={app.id}
                app={app}
                state={windows[app.id]}
                isActive={activeId === app.id}
                constraintsRef={areaRef}
                areaSize={areaSize}
                onFocus={focus}
                onClose={close}
                onMinimize={minimize}
                onToggleMaximize={toggleMaximize}
                onMove={move}
              />
            ))}
        </AnimatePresence>
      </div>
      <Dock apps={dockApps} windows={windows} onOpen={open} autoHide={isFullScreen} />
    </div>
  )
}
