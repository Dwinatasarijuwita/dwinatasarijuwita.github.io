import { motion, useReducedMotion } from 'motion/react'

export default function AppSheet({ app, origin, onClose }) {
  const reduceMotion = useReducedMotion()
  const { title, Component } = app
  const hidden = reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.2 }

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex flex-col bg-white text-gray-900"
      style={{ transformOrigin: origin }}
      initial={hidden}
      animate={{ opacity: 1, scale: 1 }}
      exit={hidden}
      transition={{ duration: reduceMotion ? 0.1 : 0.3, ease: 'easeOut' }}
    >
      <header className="flex shrink-0 items-center border-b border-gray-200 px-2 pb-2 pt-4">
        <button type="button" onClick={onClose} className="px-2 py-1 text-blue-600">
          ‹ Back
        </button>
        <h2 className="flex-1 text-center font-semibold">{title}</h2>
        <span className="w-[76px]" aria-hidden="true" />
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <Component />
      </div>
      <div className="flex shrink-0 justify-center pb-2 pt-3">
        <motion.button
          type="button"
          aria-label="Close app"
          onClick={onClose}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.3}
          dragSnapToOrigin
          onDragEnd={(_event, info) => {
            if (info.offset.y < -40) onClose()
          }}
          className="h-5 w-36 touch-none"
        >
          <span className="block h-1.5 w-full rounded-full bg-gray-900" />
        </motion.button>
      </div>
    </motion.div>
  )
}
