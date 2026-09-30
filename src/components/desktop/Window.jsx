import { motion, useDragControls, useMotionValue, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'
import { WindowActiveContext } from '../../hooks/useWindowActive'
import { clampPosition } from '../../lib/windowBounds'
import { DOCK_HEIGHT, MENU_BAR_HEIGHT } from './constants'

export default function Window({
  app,
  state,
  isActive,
  constraintsRef,
  areaSize,
  onFocus,
  onClose,
  onMinimize,
  onToggleMaximize,
  onMove,
}) {
  const { id, title, Component, size } = app
  const { isMinimized, isMaximized, position, zIndex } = state
  const dragControls = useDragControls()
  const reduceMotion = useReducedMotion()
  const visibleSize = areaSize
    ? { width: size.width, height: Math.min(size.height, areaSize.height - DOCK_HEIGHT) }
    : size
  const shown = isMaximized ? { x: 0, y: -MENU_BAR_HEIGHT } : clampPosition(position, visibleSize, areaSize, 0)
  const farthest = clampPosition({ x: Infinity, y: Infinity }, visibleSize, areaSize, 0)
  const dragBounds = areaSize ? { left: 0, top: 0, right: farthest.x, bottom: farthest.y } : constraintsRef
  const x = useMotionValue(shown.x)
  const y = useMotionValue(shown.y)
  const [minimizeOrigin, setMinimizeOrigin] = useState('50% 100%')
  const [isHeld, setIsHeld] = useState(false)

  useEffect(() => {
    x.set(shown.x)
    y.set(shown.y)
  }, [shown.x, shown.y, x, y])

  const hidden = reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9 }
  const minimized = reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.1 }

  function startDrag(event) {
    onFocus(id)
    // Embedded content such as the PDF iframe would swallow pointer events mid-drag.
    setIsHeld(true)
    window.addEventListener('pointerup', () => setIsHeld(false), { once: true })
    if (!isMaximized) dragControls.start(event)
  }

  return (
    <motion.section
      role="dialog"
      aria-label={title}
      aria-hidden={isMinimized || undefined}
      inert={isMinimized}
      className={`absolute left-0 top-0 flex flex-col overflow-hidden bg-white ${
        isMaximized ? 'rounded-none' : 'rounded-xl border border-black/10'
      } ${
        isActive ? 'shadow-2xl' : 'shadow-lg'
      } ${isMinimized ? 'pointer-events-none' : ''}`}
      style={{
        x,
        y,
        zIndex,
        width: isMaximized ? '100%' : size.width,
        height: isMaximized ? `calc(100% + ${MENU_BAR_HEIGHT}px)` : size.height,
        maxWidth: '100%',
        maxHeight: isMaximized ? `calc(100% + ${MENU_BAR_HEIGHT}px)` : `calc(100% - ${DOCK_HEIGHT}px)`,
        transformOrigin: isMinimized ? minimizeOrigin : '50% 50%',
      }}
      initial={hidden}
      animate={isMinimized ? minimized : { opacity: 1, scale: 1 }}
      exit={hidden}
      transition={{ duration: reduceMotion ? 0.1 : 0.25, ease: 'easeOut' }}
      drag={!isMaximized && !isMinimized}
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      dragElastic={0}
      dragConstraints={dragBounds}
      onDragEnd={() => {
        // Whole pixels keep the traffic light symbols crisp and centred on Retina screens.
        const next = { x: Math.round(x.get()), y: Math.round(y.get()) }
        x.set(next.x)
        y.set(next.y)
        onMove(id, next)
      }}
      onPointerDown={() => onFocus(id)}
    >
      <div
        className={`flex h-10 shrink-0 select-none items-center px-3 shadow-[inset_0_-1px_0_rgb(0_0_0/0.05)] ${
          isActive ? 'bg-gray-100' : 'bg-gray-50 opacity-70'
        }`}
        style={{ touchAction: 'none' }}
        onPointerDown={startDrag}
        onDoubleClick={() => onToggleMaximize(id)}
      >
        <div
          className="group flex gap-2"
          onPointerDown={(event) => event.stopPropagation()}
          onDoubleClick={(event) => event.stopPropagation()}
        >
          <TrafficLight className="bg-[#ff5f57]" label={`Close ${title}`} symbol="close" onClick={() => onClose(id)} />
          <TrafficLight
            className="bg-[#febc2e]"
            label={`Minimize ${title}`}
            symbol="minimize"
            onClick={() => {
              setMinimizeOrigin(minimizeTargetOrigin(id, constraintsRef.current, shown))
              onMinimize(id)
            }}
          />
          <TrafficLight
            className="bg-[#28c840]"
            label={`Maximize ${title}`}
            symbol="maximize"
            onClick={() => onToggleMaximize(id)}
          />
        </div>
        <h2 className="flex-1 truncate text-center text-sm font-medium text-gray-700">{title}</h2>
        <div className="w-[52px]" aria-hidden="true" />
      </div>
      <div className={`min-h-0 flex-1 overflow-auto ${isHeld ? 'pointer-events-none' : ''}`}>
        <WindowActiveContext.Provider value={isActive && !isMinimized}>
          <Component />
        </WindowActiveContext.Provider>
      </div>
    </motion.section>
  )
}

function minimizeTargetOrigin(id, area, position) {
  if (!area) return '50% 100%'
  const areaBox = area.getBoundingClientRect()
  const target = document.querySelector(`[data-minimize-target="${id}"]`)?.getBoundingClientRect()
  if (!target) return `${area.clientWidth / 2 - position.x}px ${area.clientHeight - position.y}px`
  const x = target.left + target.width / 2 - areaBox.left - position.x
  const y = target.top + target.height / 2 - areaBox.top - position.y
  return `${x}px ${y}px`
}

const SYMBOLS = {
  close: <path d="M4 4l4 4M8 4l-4 4" />,
  minimize: <path d="M3.5 6h5" />,
  maximize: <path d="M6 3.5v5M3.5 6h5" />,
}

function TrafficLight({ className, label, symbol, onClick }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`flex size-3 items-center justify-center rounded-full ${className}`}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 12 12"
        className="size-3 opacity-0 group-hover:opacity-100 group-has-[:focus-visible]:opacity-100"
        fill="none"
        stroke="rgb(0 0 0 / 0.6)"
        strokeWidth="1.4"
        strokeLinecap="round"
      >
        {SYMBOLS[symbol]}
      </svg>
    </button>
  )
}
