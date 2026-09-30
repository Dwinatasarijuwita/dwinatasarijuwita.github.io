import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react'
import { useRef } from 'react'
import AppIcon from '../AppIcon'
import { DOCK_HEIGHT } from './constants'

const BASE_SIZE = 48
const HOVER_SIZE = 76

export default function Dock({ apps, windows, onOpen }) {
  const mouseX = useMotionValue(Infinity)
  return (
    <nav aria-label="Dock" className="absolute inset-x-0 bottom-2 z-[1000] flex select-none justify-center">
      <div
        onMouseMove={(event) => mouseX.set(event.clientX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="flex items-end gap-3 rounded-2xl border border-white/30 bg-white/25 px-3 pb-1 pt-2 backdrop-blur-xl"
        style={{ height: DOCK_HEIGHT - 16 }}
      >
        {apps.map((app) => (
          <DockItem key={app.id} app={app} isOpen={windows[app.id].isOpen} mouseX={mouseX} onOpen={onOpen} />
        ))}
      </div>
    </nav>
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
      <span className="pointer-events-none absolute -top-9 whitespace-nowrap rounded-md bg-gray-800/90 px-2 py-1 text-xs text-white opacity-0 transition group-hover:opacity-100 group-focus-within:opacity-100">
        {app.title}
      </span>
      <motion.button
        ref={ref}
        type="button"
        aria-label={app.title}
        data-open={isOpen}
        onClick={() => onOpen(app.id)}
        style={{ width: size, height: size }}
        className="rounded-[22%] focus-visible:outline-2 focus-visible:outline-white"
      >
        <AppIcon id={app.id} className="size-full" />
      </motion.button>
      <span
        aria-hidden="true"
        className={`mt-1 size-1 rounded-full bg-gray-900/80 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  )
}
