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
import ForceQuitDialog, { FORCE_QUIT_ID } from './ForceQuitDialog'
import MenuBar from './MenuBar'
import Window from './Window'

// Force Quit is not an app, but it stacks and takes focus like the app windows.
const managedWindows = [...apps, { id: FORCE_QUIT_ID, initialPosition: { x: 0, y: 0 } }]

export default function Desktop() {
  const { windows, activeId, open, close, closeAll, minimize, toggleMaximize, focus, move } =
    useWindowManager(managedWindows)
  const areaRef = useRef(null)
  const profileButtonRef = useRef(null)
  const areaSize = useElementSize(areaRef)
  const activeApp = apps.find((app) => app.id === activeId)
  const isFullScreen = Boolean(activeId && windows[activeId].isMaximized)
  const dockApps = apps.filter((app) => app.placement === 'dock')
  const desktopApps = apps.filter((app) => app.placement === 'desktop')
  const openApps = apps.filter((app) => windows[app.id].isOpen)

  function closeForceQuit() {
    close(FORCE_QUIT_ID)
    // A window left in front takes focus itself; otherwise focus goes back to where Force Quit was opened.
    if (!openApps.some((app) => !windows[app.id].isMinimized)) profileButtonRef.current?.focus()
  }

  return (
    <div className="fixed inset-0 isolate overflow-hidden bg-cover bg-center" style={wallpaperStyle}>
      {/* Dark mode dims the wallpaper rather than swapping it. */}
      <div aria-hidden="true" data-testid="wallpaper-dim" className="pointer-events-none absolute inset-0 -z-10 hidden bg-black/35 dark:block" />
      <MenuBar
        appName={activeApp?.title ?? profile.name}
        autoHide={isFullScreen}
        canForceQuit={openApps.length > 0}
        onForceQuit={() => open(FORCE_QUIT_ID)}
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
        {windows[FORCE_QUIT_ID].isOpen && (
          <ForceQuitDialog
            apps={openApps}
            isActive={activeId === FORCE_QUIT_ID}
            zIndex={windows[FORCE_QUIT_ID].zIndex}
            constraintsRef={areaRef}
            onFocus={focus}
            onQuit={close}
            onQuitAll={() => closeAll(openApps.map((app) => app.id))}
            onClose={closeForceQuit}
          />
        )}
      </div>
      <Dock apps={dockApps} windows={windows} onOpen={open} autoHide={isFullScreen} />
    </div>
  )
}
