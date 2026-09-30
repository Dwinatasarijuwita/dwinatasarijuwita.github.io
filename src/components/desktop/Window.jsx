import { motion, useDragControls, useMotionValue, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'
import { clampPosition } from '../../lib/windowBounds'
import { DOCK_HEIGHT } from './constants'

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
  const shown = isMaximized ? { x: 0, y: 0 } : clampPosition(position, size, areaSize, DOCK_HEIGHT)
  const x = useMotionValue(shown.x)
  const y = useMotionValue(shown.y)
  const [minimizeOrigin, setMinimizeOrigin] = useState('50% 100%')

  useEffect(() => {
    x.set(shown.x)
    y.set(shown.y)
  }, [shown.x, shown.y, x, y])

  const hidden = reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9 }
  const minimized = reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.1 }

  function startDrag(event) {
    onFocus(id)
    if (!isMaximized) dragControls.start(event)
  }

  return (
    <motion.section
      role="dialog"
      aria-label={title}
      aria-hidden={isMinimized || undefined}
      inert={isMinimized}
      className={`absolute left-0 top-0 flex flex-col overflow-hidden rounded-xl border border-black/10 bg-white ${
        isActive ? 'shadow-2xl' : 'shadow-lg'
      } ${isMinimized ? 'pointer-events-none' : ''}`}
      style={{
        x,
        y,
        zIndex,
        width: isMaximized ? '100%' : size.width,
        height: isMaximized ? `calc(100% - ${DOCK_HEIGHT}px)` : size.height,
        maxWidth: '100%',
        maxHeight: `calc(100% - ${DOCK_HEIGHT}px)`,
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
      dragConstraints={constraintsRef}
      onDragEnd={() => onMove(id, { x: x.get(), y: y.get() })}
      onPointerDown={() => onFocus(id)}
    >
      <div
        className={`flex h-10 shrink-0 select-none items-center border-b border-black/5 px-3 ${
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
          <TrafficLight className="bg-[#ff5f57]" label={`Tutup ${title}`} symbol="×" onClick={() => onClose(id)} />
          <TrafficLight
            className="bg-[#febc2e]"
            label={`Minimize ${title}`}
            symbol="−"
            onClick={() => {
              setMinimizeOrigin(minimizeTargetOrigin(id, constraintsRef.current, shown))
              onMinimize(id)
            }}
          />
          <TrafficLight
            className="bg-[#28c840]"
            label={`Maximize ${title}`}
            symbol="+"
            onClick={() => onToggleMaximize(id)}
          />
        </div>
        <h2 className="flex-1 truncate text-center text-sm font-medium text-gray-700">{title}</h2>
        <div className="w-[52px]" aria-hidden="true" />
      </div>
      <div className="min-h-0 flex-1 overflow-auto">
        <Component />
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

function TrafficLight({ className, label, symbol, onClick }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`flex size-3 items-center justify-center rounded-full text-[9px] font-bold leading-none text-black/60 ${className}`}
    >
      <span className="opacity-0 group-hover:opacity-100">{symbol}</span>
    </button>
  )
}
