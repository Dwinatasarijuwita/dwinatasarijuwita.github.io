import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { useEdgeReveal } from '../../hooks/useEdgeReveal'
import { useNow } from '../../hooks/useNow'
import { formatClock } from '../../lib/clock'
import Avatar from '../Avatar'
import { MENU_BAR_HEIGHT } from './constants'

export default function MenuBar({ appName, autoHide = false, canForceQuit = false, onForceQuit, menuButtonRef }) {
  const now = useNow()
  const reduceMotion = useReducedMotion()
  const { hidden, barRef, zoneProps, barProps } = useEdgeReveal(autoHide)

  return (
    <>
      {autoHide && (
        <div
          aria-hidden="true"
          data-testid="menu-bar-reveal-zone"
          className="absolute inset-x-0 top-0 z-[1001] h-1"
          {...zoneProps}
        />
      )}
      <motion.div
        ref={barRef}
        data-testid="menu-bar"
        data-hidden={hidden}
        className="absolute inset-x-0 top-0 z-[1000] flex select-none items-center justify-between bg-white/30 px-4 text-[13px] text-gray-900 backdrop-blur-xl dark:bg-black/30 dark:text-neutral-100"
        style={{ height: MENU_BAR_HEIGHT }}
        animate={hidden ? { y: -MENU_BAR_HEIGHT, opacity: reduceMotion ? 0 : 1 } : { y: 0, opacity: 1 }}
        transition={{ duration: reduceMotion ? 0.1 : 0.25, ease: 'easeOut' }}
        {...barProps}
      >
        <div className="flex items-center gap-4">
          <ProfileMenu hidden={hidden} canForceQuit={canForceQuit} onForceQuit={onForceQuit} buttonRef={menuButtonRef} />
          <span aria-label="Active app" className="font-semibold">
            {appName}
          </span>
        </div>
        <time dateTime={now.toISOString()}>{formatClock(now)}</time>
      </motion.div>
    </>
  )
}

// The avatar stands in for the Apple logo, so it opens the same kind of menu.
function ProfileMenu({ hidden, canForceQuit, onForceQuit, buttonRef }) {
  const [isOpen, setIsOpen] = useState(false)
  const ownButtonRef = useRef(null)
  const button = buttonRef ?? ownButtonRef
  const wrapperRef = useRef(null)
  const firstItemRef = useRef(null)

  // A bar sliding away for full screen takes its menu with it.
  if (hidden && isOpen) setIsOpen(false)

  useEffect(() => {
    if (!isOpen) return
    firstItemRef.current?.focus()
    function closeOnOutsidePress(event) {
      if (!wrapperRef.current?.contains(event.target)) setIsOpen(false)
    }
    document.addEventListener('pointerdown', closeOnOutsidePress)
    return () => document.removeEventListener('pointerdown', closeOnOutsidePress)
  }, [isOpen])

  function onMenuKeyDown(event) {
    if (event.key === 'Escape') {
      setIsOpen(false)
      button.current?.focus()
    } else if (event.key === 'Tab') {
      setIsOpen(false)
    }
  }

  return (
    <div ref={wrapperRef} className="relative flex">
      <button
        ref={button}
        type="button"
        aria-label="Profile menu"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className={`-mx-1.5 rounded px-1.5 py-0.5 ${isOpen ? 'bg-black/10 dark:bg-white/20' : ''}`}
      >
        <Avatar size="xs" />
      </button>
      {isOpen && (
        <div
          role="menu"
          aria-label="Profile"
          onKeyDown={onMenuKeyDown}
          className="absolute left-[-6px] top-full mt-1 min-w-52 rounded-lg border border-black/10 bg-white/95 p-1 shadow-xl dark:border-white/15 dark:bg-neutral-800/95"
        >
          <button
            ref={firstItemRef}
            type="button"
            role="menuitem"
            aria-disabled={!canForceQuit}
            onClick={() => {
              if (!canForceQuit) return
              setIsOpen(false)
              onForceQuit()
            }}
            className="block w-full rounded px-2.5 py-0.5 text-left outline-none aria-disabled:text-gray-400 aria-[disabled=false]:hover:bg-blue-500 aria-[disabled=false]:hover:text-white aria-[disabled=false]:focus-visible:bg-blue-500 aria-[disabled=false]:focus-visible:text-white dark:aria-disabled:text-neutral-500"
          >
            Force Quit…
          </button>
        </div>
      )}
    </div>
  )
}
