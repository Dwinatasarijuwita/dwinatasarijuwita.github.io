import { motion, useReducedMotion } from 'motion/react'
import { useEdgeReveal } from '../../hooks/useEdgeReveal'
import { useNow } from '../../hooks/useNow'
import { formatClock } from '../../lib/clock'
import Avatar from '../Avatar'
import { MENU_BAR_HEIGHT } from './constants'

export default function MenuBar({ appName, autoHide = false }) {
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
        className="absolute inset-x-0 top-0 z-[1000] flex select-none items-center justify-between bg-white/30 px-4 text-[13px] text-gray-900 backdrop-blur-xl"
        style={{ height: MENU_BAR_HEIGHT }}
        animate={hidden ? { y: -MENU_BAR_HEIGHT, opacity: reduceMotion ? 0 : 1 } : { y: 0, opacity: 1 }}
        transition={{ duration: reduceMotion ? 0.1 : 0.25, ease: 'easeOut' }}
        {...barProps}
      >
        <div className="flex items-center gap-4">
          <Avatar size="xs" />
          <span aria-label="Aplikasi aktif" className="font-semibold">
            {appName}
          </span>
        </div>
        <time dateTime={now.toISOString()}>{formatClock(now)}</time>
      </motion.div>
    </>
  )
}
