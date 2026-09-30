import { AnimatePresence } from 'motion/react'
import { useRef } from 'react'
import { apps } from '../../data/apps'
import { profile } from '../../data/profile'
import { useElementSize } from '../../hooks/useElementSize'
import { useWindowManager } from '../../hooks/useWindowManager'
import { wallpaperStyle } from '../../lib/wallpaper'
import { DOCK_HEIGHT, MENU_BAR_HEIGHT } from './constants'
import DesktopIcons from './DesktopIcons'
import Dock from './Dock'
import MenuBar from './MenuBar'
import Window from './Window'

export default function Desktop() {
  const { windows, activeId, open, close, minimize, toggleMaximize, focus, move } = useWindowManager(apps)
  const areaRef = useRef(null)
  const areaSize = useElementSize(areaRef)
  const dragBoundsRef = useRef(null)
  const activeApp = apps.find((app) => app.id === activeId)
  const dockApps = apps.filter((app) => app.placement === 'dock')
  const desktopApps = apps.filter((app) => app.placement === 'desktop')

  return (
    <div className="fixed inset-0 overflow-hidden bg-cover bg-center" style={wallpaperStyle}>
      <MenuBar appName={activeApp?.title ?? profile.name} />
      <div ref={areaRef} className="absolute inset-x-0 bottom-0" style={{ top: MENU_BAR_HEIGHT }}>
        <div ref={dragBoundsRef} className="pointer-events-none absolute inset-x-0 top-0" style={{ bottom: DOCK_HEIGHT }} />
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
                constraintsRef={dragBoundsRef}
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
      <Dock apps={dockApps} windows={windows} onOpen={open} />
    </div>
  )
}
