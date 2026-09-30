import { AnimatePresence } from 'motion/react'
import { useRef } from 'react'
import { apps } from '../../data/apps'
import { useElementSize } from '../../hooks/useElementSize'
import { useWindowManager } from '../../hooks/useWindowManager'
import { wallpaperStyle } from '../../lib/wallpaper'
import { MENU_BAR_HEIGHT } from './constants'
import Dock from './Dock'
import MenuBar from './MenuBar'
import Window from './Window'

export default function Desktop() {
  const { windows, activeId, open, close, minimize, toggleMaximize, focus, move } = useWindowManager(apps)
  const areaRef = useRef(null)
  const areaSize = useElementSize(areaRef)
  const activeApp = apps.find((app) => app.id === activeId)

  return (
    <div className="fixed inset-0 overflow-hidden bg-cover bg-center" style={wallpaperStyle}>
      <MenuBar appName={activeApp?.title ?? 'Finder'} />
      <div ref={areaRef} className="absolute inset-x-0 bottom-0" style={{ top: MENU_BAR_HEIGHT }}>
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
      <Dock apps={apps} windows={windows} onOpen={open} />
    </div>
  )
}
