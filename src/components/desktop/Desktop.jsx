import { AnimatePresence } from 'motion/react'
import { useRef, useState } from 'react'
import { apps } from '../../data/apps'
import { profile } from '../../data/profile'
import { useElementSize } from '../../hooks/useElementSize'
import { useWindowManager } from '../../hooks/useWindowManager'
import { wallpaperStyle } from '../../lib/wallpaper'
import { MENU_BAR_HEIGHT } from './constants'
import DesktopIcons from './DesktopIcons'
import Dock from './Dock'
import ForceQuitDialog from './ForceQuitDialog'
import MenuBar from './MenuBar'
import Window from './Window'

export default function Desktop() {
  const { windows, activeId, open, close, closeAll, minimize, toggleMaximize, focus, move } = useWindowManager(apps)
  const [isForceQuitOpen, setIsForceQuitOpen] = useState(false)
  const areaRef = useRef(null)
  const profileButtonRef = useRef(null)
  const areaSize = useElementSize(areaRef)
  const activeApp = apps.find((app) => app.id === activeId)
  const isFullScreen = Boolean(activeId && windows[activeId].isMaximized)
  const dockApps = apps.filter((app) => app.placement === 'dock')
  const desktopApps = apps.filter((app) => app.placement === 'desktop')
  const openApps = apps.filter((app) => windows[app.id].isOpen)

  function closeForceQuit() {
    setIsForceQuitOpen(false)
    profileButtonRef.current?.focus()
  }

  return (
    <div className="fixed inset-0 isolate overflow-hidden bg-cover bg-center" style={wallpaperStyle}>
      {/* Dark mode dims the wallpaper rather than swapping it. */}
      <div aria-hidden="true" data-testid="wallpaper-dim" className="pointer-events-none absolute inset-0 -z-10 hidden bg-black/35 dark:block" />
      <MenuBar
        appName={activeApp?.title ?? profile.name}
        autoHide={isFullScreen}
        canForceQuit={openApps.length > 0}
        onForceQuit={() => setIsForceQuitOpen(true)}
        menuButtonRef={profileButtonRef}
      />
      <div ref={areaRef} className="absolute inset-x-0 bottom-0 isolate" style={{ top: MENU_BAR_HEIGHT }}>
        <DesktopIcons apps={desktopApps} onOpen={open} />
        <AnimatePresence>
          {openApps.map((app) => (
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
      {/* Rendered after the windows so it can take focus back from one that just became active. */}
      {isForceQuitOpen && (
        <ForceQuitDialog
          apps={openApps}
          onQuit={close}
          onQuitAll={closeAll}
          onClose={closeForceQuit}
        />
      )}
      <Dock apps={dockApps} windows={windows} onOpen={open} autoHide={isFullScreen} />
    </div>
  )
}
