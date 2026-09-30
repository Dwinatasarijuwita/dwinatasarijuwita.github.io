import { motion, useDragControls, useMotionValue, useReducedMotion } from 'motion/react'
import { useEffect } from 'react'
import { DOCK_HEIGHT } from './constants'

export default function Window({
  app,
  state,
  isActive,
  constraintsRef,
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
  const x = useMotionValue(position.x)
  const y = useMotionValue(position.y)

  useEffect(() => {
    x.set(isMaximized ? 0 : position.x)
    y.set(isMaximized ? 0 : position.y)
  }, [isMaximized, position.x, position.y, x, y])

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
        transformOrigin: isMinimized ? dockOrigin(constraintsRef.current, position) : '50% 50%',
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
            onClick={() => onMinimize(id)}
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

function dockOrigin(area, position) {
  if (!area) return '50% 100%'
  return `${area.clientWidth / 2 - position.x}px ${area.clientHeight - position.y}px`
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
