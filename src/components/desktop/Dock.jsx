import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react'
import { Fragment, useRef } from 'react'
import { useEdgeReveal } from '../../hooks/useEdgeReveal'
import AppIcon from '../AppIcon'
import { DOCK_HEIGHT } from './constants'

const BASE_SIZE = 48
const HOVER_SIZE = 76

export default function Dock({ apps, windows, onOpen, autoHide = false }) {
  const mouseX = useMotionValue(Infinity)
  const reduceMotion = useReducedMotion()
  const { hidden, barRef, zoneProps, barProps } = useEdgeReveal(autoHide)

  return (
    <>
      {autoHide && (
        <div
          aria-hidden="true"
          data-testid="dock-reveal-zone"
          className="absolute inset-x-0 bottom-0 z-[1001] h-2"
          {...zoneProps}
        />
      )}
      <motion.nav
        ref={barRef}
        aria-label="Dock"
        data-hidden={hidden}
        className="pointer-events-none absolute inset-x-0 bottom-2 z-[1000] flex select-none justify-center"
        animate={hidden ? { y: DOCK_HEIGHT + 8, opacity: reduceMotion ? 0 : 1 } : { y: 0, opacity: 1 }}
        transition={{ duration: reduceMotion ? 0.1 : 0.25, ease: 'easeOut' }}
        {...barProps}
      >
        <div
          onMouseMove={(event) => mouseX.set(event.clientX)}
          onMouseLeave={() => mouseX.set(Infinity)}
          className="pointer-events-auto flex items-end gap-3 rounded-2xl border border-white/30 bg-white/25 px-3 pb-1 pt-2 shadow-lg ring-1 ring-black/10 backdrop-blur-xl"
          style={{ height: DOCK_HEIGHT - 16 }}
        >
          {apps.map((app, index) => (
            <Fragment key={app.id}>
              {index > 0 && app.dockGroup === 'end' && apps[index - 1].dockGroup !== 'end' && (
                <span role="separator" aria-orientation="vertical" className="mb-2 h-10 w-px self-center bg-gray-900/20" />
              )}
              <DockItem app={app} isOpen={windows[app.id]?.isOpen ?? false} mouseX={mouseX} onOpen={onOpen} />
            </Fragment>
          ))}
        </div>
      </motion.nav>
    </>
  )
}

function DockItem({ app, isOpen, mouseX, onOpen }) {
  const ref = useRef(null)
  const reduceMotion = useReducedMotion()
  const distance = useTransform(mouseX, (x) => {
    const box = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 }
    return x - box.x - box.width / 2
  })
  const target = useTransform(distance, [-140, 0, 140], [BASE_SIZE, reduceMotion ? BASE_SIZE : HOVER_SIZE, BASE_SIZE])
  const size = useSpring(target, { mass: 0.1, stiffness: 170, damping: 14 })

  return (
    <div className="group relative flex flex-col items-center">
      <span className="pointer-events-none absolute -top-9 whitespace-nowrap rounded-md bg-gray-800/90 px-2 py-1 text-xs text-white opacity-0 transition group-hover:opacity-100 group-has-[:focus-visible]:opacity-100">
        {app.title}
      </span>
      {app.kind === 'link' ? (
        <motion.a
          ref={ref}
          href={app.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={app.title}
          style={{ width: size, height: size }}
          className="rounded-[22%] focus-visible:outline-2 focus-visible:outline-white"
        >
          <AppIcon id={app.id} className="size-full" />
        </motion.a>
      ) : (
        <motion.button
          ref={ref}
          type="button"
          aria-label={app.title}
          data-open={isOpen}
          data-minimize-target={app.id}
          onClick={() => onOpen(app.id)}
          style={{ width: size, height: size }}
          className="rounded-[22%] focus-visible:outline-2 focus-visible:outline-white"
        >
          <AppIcon id={app.id} className="size-full" />
        </motion.button>
      )}
      <span
        aria-hidden="true"
        className={`mt-1 size-1 rounded-full bg-gray-900/80 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  )
}
