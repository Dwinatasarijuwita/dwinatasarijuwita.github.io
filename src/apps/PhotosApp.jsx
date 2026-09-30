import { motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { useWindowActive } from '../hooks/useWindowActive'
import { photos } from '../lib/photos'

const SWIPE_DISTANCE = 50

export default function PhotosApp() {
  const [index, setIndex] = useState(0)
  const isActive = useWindowActive()
  const activeThumbRef = useRef(null)
  const photo = photos[index]

  const show = (next) => setIndex(Math.min(Math.max(next, 0), photos.length - 1))

  useEffect(() => {
    if (!isActive) return
    const onKeyDown = (event) => {
      if (event.key === 'ArrowRight') setIndex((current) => Math.min(current + 1, photos.length - 1))
      if (event.key === 'ArrowLeft') setIndex((current) => Math.max(current - 1, 0))
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isActive])

  useEffect(() => {
    activeThumbRef.current?.scrollIntoView?.({ block: 'nearest', inline: 'nearest', behavior: 'smooth' })
    for (const neighbour of [photos[index - 1], photos[index + 1]]) {
      if (neighbour) new Image().src = neighbour.src
    }
  }, [index])

  if (!photo) {
    return <p className="p-6 text-sm text-gray-500">Belum ada foto.</p>
  }

  return (
    <div className="flex h-full flex-col bg-[#f5f5f5]">
      <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden p-3">
        <motion.img
          key={photo.id}
          src={photo.src}
          alt={`Foto ${index + 1} dari ${photos.length}`}
          draggable={false}
          className="max-h-full max-w-full touch-pan-y select-none object-contain"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.4}
          onDragEnd={(_event, info) => {
            if (info.offset.x < -SWIPE_DISTANCE) show(index + 1)
            if (info.offset.x > SWIPE_DISTANCE) show(index - 1)
          }}
        />
      </div>
      <ul aria-label="Semua foto" className="flex shrink-0 gap-1 overflow-x-auto border-t border-black/5 bg-white p-1">
        {photos.map((item, itemIndex) => {
          const isCurrent = itemIndex === index
          return (
            <li key={item.id} className="shrink-0">
              <button
                ref={isCurrent ? activeThumbRef : null}
                type="button"
                aria-label={`Tampilkan foto ${itemIndex + 1}`}
                aria-current={isCurrent || undefined}
                onClick={() => show(itemIndex)}
                className={`block h-16 w-24 overflow-hidden sm:h-20 sm:w-28 ${
                  isCurrent ? 'outline-3 -outline-offset-3 outline-blue-500' : 'opacity-90 hover:opacity-100'
                }`}
              >
                <img src={item.thumb} alt="" loading="lazy" className="size-full object-cover" />
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
