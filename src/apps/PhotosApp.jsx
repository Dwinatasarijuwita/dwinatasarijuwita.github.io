import { motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { useWindowActive } from '../hooks/useWindowActive'
import { albums, photos } from '../lib/photos'

const SWIPE_DISTANCE = 50
const ALL = 'All'

export default function PhotosApp() {
  const [album, setAlbum] = useState(ALL)
  // The open photo's position in the current album, or null while browsing the grid.
  const [openIndex, setOpenIndex] = useState(null)
  const gridRef = useRef(null)
  const shown = album === ALL ? photos : photos.filter((photo) => photo.album === album)

  if (photos.length === 0) {
    return <p className="p-6 text-sm text-gray-500 dark:text-neutral-400">No photos yet.</p>
  }

  function close(lastIndex) {
    // The grid is inert while the viewer is up, so it can only take focus once the viewer is gone.
    flushSync(() => setOpenIndex(null))
    gridRef.current?.querySelector(`[data-photo-index="${lastIndex}"]`)?.focus()
  }

  return (
    <div className="@container relative h-full bg-white text-gray-900 dark:bg-neutral-900 dark:text-neutral-100">
      <div inert={openIndex !== null} className="flex h-full flex-col">
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-black/5 px-5 py-3 dark:border-white/10">
          <div>
            <h2 className="text-lg font-bold leading-tight">{album === ALL ? 'Library' : album}</h2>
            <p className="text-xs text-gray-500 dark:text-neutral-400 tabular-nums">{shown.length} photos</p>
          </div>
          <div role="group" aria-label="Albums" className="flex rounded-lg bg-gray-100 p-0.5 dark:bg-neutral-800">
            {[ALL, ...albums].map((name) => (
              <button
                key={name}
                type="button"
                aria-pressed={album === name}
                onClick={() => setAlbum(name)}
                className="rounded-md px-3 py-1 text-sm text-gray-600 transition-colors hover:text-gray-900 focus-visible:outline-2 focus-visible:outline-blue-500 aria-pressed:bg-white aria-pressed:font-medium aria-pressed:text-gray-900 aria-pressed:shadow-sm dark:text-neutral-400 dark:hover:text-neutral-100 dark:aria-pressed:bg-neutral-600 dark:aria-pressed:text-white"
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        <div ref={gridRef} className="min-h-0 flex-1 overflow-y-auto p-3">
          {/* Columns keep each photo at its own shape, like a contact sheet, instead of cropping to squares. */}
          <ul aria-label={`${album === ALL ? 'Library' : album} photos`} className="columns-2 gap-2 @min-[520px]:columns-3 @min-[760px]:columns-4">
            {shown.map((photo, index) => (
              <li key={photo.id} className="mb-2 break-inside-avoid">
                <button
                  type="button"
                  data-photo-index={index}
                  aria-label={`Open photo ${index + 1}`}
                  onClick={() => setOpenIndex(index)}
                  className="group block w-full overflow-hidden rounded-lg bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:bg-neutral-800"
                >
                  <img
                    src={photo.thumb}
                    alt=""
                    loading="lazy"
                    className="w-full transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.04]"
                  />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {openIndex !== null && <Viewer photos={shown} startIndex={openIndex} onClose={close} />}
    </div>
  )
}

// The full-size photo over a dark backdrop, with arrows, swipe, keys and a strip to move through the album.
function Viewer({ photos: items, startIndex, onClose }) {
  const [index, setIndex] = useState(startIndex)
  const isActive = useWindowActive()
  const closeRef = useRef(null)
  const activeThumbRef = useRef(null)
  const stripRef = useRef(null)
  const photo = items[index]
  const last = items.length - 1

  const show = (next) => setIndex(Math.min(Math.max(next, 0), last))

  useEffect(() => {
    closeRef.current.focus()
  }, [])

  useEffect(() => {
    if (!isActive) return
    const onKeyDown = (event) => {
      if (event.key === 'ArrowRight') setIndex((current) => Math.min(current + 1, last))
      if (event.key === 'ArrowLeft') setIndex((current) => Math.max(current - 1, 0))
      if (event.key === 'Escape') onClose(index)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isActive, last, onClose, index])

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
    for (const neighbour of [items[index - 1], items[index + 1]]) {
      if (neighbour) new Image().src = neighbour.src
    }
    return () => clearTimeout(settle)
  }, [index, items])

  return (
    <div role="dialog" aria-modal="true" aria-label="Photo viewer" className="absolute inset-0 z-10 flex flex-col bg-neutral-950 text-white">
      <div className="flex shrink-0 items-center justify-between px-4 py-2.5">
        <p className="text-sm text-white/70 tabular-nums">
          {index + 1} of {items.length}
        </p>
        <button
          ref={closeRef}
          type="button"
          onClick={() => onClose(index)}
          className="rounded-full bg-white/10 px-3 py-1 text-sm font-medium hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-white"
        >
          Done
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden px-14 pb-3">
        <motion.img
          key={photo.id}
          src={photo.src}
          alt={`Photo ${index + 1} of ${items.length}`}
          draggable={false}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="max-h-full max-w-full touch-pan-y select-none rounded-md object-contain"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.4}
          onDragEnd={(_event, info) => {
            if (info.offset.x < -SWIPE_DISTANCE) show(index + 1)
            if (info.offset.x > SWIPE_DISTANCE) show(index - 1)
          }}
        />
        <ArrowButton direction="previous" disabled={index === 0} onClick={() => show(index - 1)} />
        <ArrowButton direction="next" disabled={index === last} onClick={() => show(index + 1)} />
      </div>

      {/* w-max + mx-auto centres the strip when it fits and still scrolls from the left when it doesn't. */}
      <div ref={stripRef} className="dark-scroll shrink-0 overflow-x-auto bg-black/40">
        <ul aria-label="All photos" className="mx-auto flex w-max gap-1 p-1.5">
          {items.map((item, itemIndex) => {
            const isCurrent = itemIndex === index
            return (
              <li key={item.id} className="shrink-0">
                <button
                  ref={isCurrent ? activeThumbRef : null}
                  type="button"
                  aria-label={`Show photo ${itemIndex + 1}`}
                  aria-current={isCurrent || undefined}
                  onClick={() => show(itemIndex)}
                  className={`block h-14 w-10 overflow-hidden rounded transition-opacity focus-visible:outline-2 focus-visible:outline-white ${
                    isCurrent ? 'opacity-100 outline-2 outline-white' : 'opacity-50 hover:opacity-90'
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

function ArrowButton({ direction, disabled, onClick }) {
  const previous = direction === 'previous'
  return (
    <button
      type="button"
      aria-label={previous ? 'Previous photo' : 'Next photo'}
      disabled={disabled}
      onClick={onClick}
      className={`absolute top-1/2 ${previous ? 'left-3' : 'right-3'} flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-white disabled:pointer-events-none disabled:opacity-0`}
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d={previous ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} />
      </svg>
    </button>
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
