import { motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { useWindowActive } from '../hooks/useWindowActive'
import { photos } from '../lib/photos'

const SWIPE_DISTANCE = 50

export default function PhotosApp() {
  const [index, setIndex] = useState(0)
  const isActive = useWindowActive()
  const activeThumbRef = useRef(null)
  const stripRef = useRef(null)
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
    const strip = stripRef.current
    const target = keepThumbnailVisible(strip, activeThumbRef.current)
    // Chrome's smooth scroll can settle a few pixels short of the target; snap once it has finished.
    const settle =
      target === null
        ? null
        : setTimeout(() => {
            if (Math.abs(strip.scrollLeft - target) > 1) strip.scrollTo?.({ left: target })
          }, 500)
    for (const neighbour of [photos[index - 1], photos[index + 1]]) {
      if (neighbour) new Image().src = neighbour.src
    }
    return () => clearTimeout(settle)
  }, [index])

  if (!photo) {
    return <p className="p-6 text-sm text-gray-500 dark:text-neutral-400">No photos yet.</p>
  }

  return (
    <div className="flex h-full flex-col bg-[#f5f5f5] dark:bg-neutral-950">
      <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden p-3">
        <motion.img
          key={photo.id}
          src={photo.src}
          alt={`Photo ${index + 1} of ${photos.length}`}
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
      {/* w-max + mx-auto centres the strip when it fits and still scrolls from the left when it doesn't. */}
      <div ref={stripRef} className="shrink-0 overflow-x-auto border-t border-black/5 bg-white dark:border-white/10 dark:bg-neutral-900">
        <ul aria-label="All photos" className="mx-auto flex w-max gap-1 p-1">
          {photos.map((item, itemIndex) => {
            const isCurrent = itemIndex === index
            return (
              <li key={item.id} className="shrink-0">
                <button
                  ref={isCurrent ? activeThumbRef : null}
                  type="button"
                  aria-label={`Show photo ${itemIndex + 1}`}
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
    </div>
  )
}

// Scrolls the strip so the active thumbnail is fully visible and returns the target scroll position,
// or null when no scrolling is needed.
function keepThumbnailVisible(strip, thumb) {
  if (!strip || !thumb) return null
  const stripBox = strip.getBoundingClientRect()
  const thumbBox = thumb.getBoundingClientRect()
  const margin = 4
  let delta = 0
  if (thumbBox.left < stripBox.left + margin) delta = thumbBox.left - stripBox.left - margin
  else if (thumbBox.right > stripBox.right - margin) delta = thumbBox.right - stripBox.right + margin
  if (!delta) return null
  const maxScroll = strip.scrollWidth - strip.clientWidth
  const target = Math.min(Math.max(strip.scrollLeft + delta, 0), maxScroll)
  strip.scrollTo?.({ left: target, behavior: 'smooth' })
  return target
}
