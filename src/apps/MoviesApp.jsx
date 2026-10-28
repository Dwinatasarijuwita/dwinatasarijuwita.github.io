import '@fontsource-variable/big-shoulders-display'
import { useEffect, useId, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import Avatar from '../components/Avatar'
import { featured, genreRows, movies, posterUrl } from '../data/movies'
import { profile } from '../data/profile'

const ALL = 'All'
const firstName = profile.nickname.split(' ')[0]
const DISPLAY = { fontFamily: "'Big Shoulders Display Variable', sans-serif" }

// Always dark, like a streaming app, whatever the Settings theme.
export default function MoviesApp() {
  const [openId, setOpenId] = useState(null)
  const openerRef = useRef(null)
  const scrollRef = useRef(null)
  const [filter, setFilter] = useState(ALL)
  const rows = genreRows()
  const allTitles = [featured, ...movies]
  const open = allTitles.find((title) => title.id === openId)

  function show(id, event) {
    openerRef.current = event.currentTarget
    setOpenId(id)
  }

  function close() {
    // The opener is inert while the details are up, so it can only take focus once they are gone.
    flushSync(() => setOpenId(null))
    openerRef.current?.focus()
  }

  function pickFilter(genre) {
    setFilter(genre)
    // Bring the filter bar back to the top so the results start right under it.
    const scroller = scrollRef.current
    const bar = scroller.querySelector('[role="group"]')
    if (scroller.scrollTop > bar.offsetTop) scroller.scrollTop = bar.offsetTop
  }

  return (
    <div data-testid="movies" className="@container relative h-full bg-[#0b0b0c] text-neutral-100 selection:bg-red-600 selection:text-white">
      <div ref={scrollRef} inert={Boolean(open)} className="dark-scroll h-full overflow-y-auto">
        <section aria-labelledby="movies-featured" className="relative isolate overflow-hidden">
          {/* The featured poster's colour, bled out into the window behind it. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10"
            style={{ background: `radial-gradient(120% 90% at 18% 0%, ${featured.tone[0]} 0%, transparent 70%)` }}
          />
          {/* Like a streaming profile: whose list this is, before anything else. */}
          <header className="flex items-center gap-3 px-6 pt-5">
            <Avatar size="sm" />
            <div className="min-w-0">
              <h1 className="text-base font-semibold leading-tight">{firstName}&apos;s Favorites</h1>
              <p className="text-xs text-neutral-400">
                Comfort shows I'd defend with my whole chest
              </p>
            </div>
          </header>
          <div className="flex flex-col gap-6 px-6 pt-5 pb-8 @min-[560px]:flex-row @min-[560px]:items-end">
            <Poster title={featured} onClick={(event) => show(featured.id, event)} className="w-36 shrink-0 @min-[560px]:w-44" large />
            <div className="min-w-0 max-w-md">
              <p className="flex items-center gap-2 text-xs text-neutral-300">
                <span className="rounded-sm bg-red-600 px-1.5 py-0.5 text-[11px] font-bold tracking-wide text-white">TOP 1</span>
                {featured.year} · {featured.genres.join(' · ')}
              </p>
              <h2 id="movies-featured" style={DISPLAY} className="mt-2 text-5xl font-extrabold uppercase leading-[0.9] text-balance">
                {featured.title}
              </h2>
              <blockquote className="mt-4 text-[15px] leading-relaxed text-neutral-300">
                {featured.why}
              </blockquote>
            </div>
          </div>
        </section>

        <div role="group" aria-label="Filter by genre" className="dark-scroll sticky top-0 z-[1] flex gap-1.5 overflow-x-auto border-y border-white/10 bg-[#0b0b0c]/90 px-5 py-3 backdrop-blur-md">
          {[{ genre: ALL, titles: allTitles }, ...rows].map((row) => (
            <button
              key={row.genre}
              type="button"
              aria-pressed={filter === row.genre}
              onClick={() => pickFilter(row.genre)}
              className="shrink-0 rounded-full px-3 py-1 text-sm whitespace-nowrap text-neutral-300 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-white aria-pressed:bg-white aria-pressed:text-neutral-900 dark:aria-pressed:bg-white"
            >
              {row.genre} <span className="tabular-nums opacity-60">{row.titles.length}</span>
            </button>
          ))}
        </div>

        {filter === ALL ? (
          rows.map((row) => (
            <section key={row.genre} aria-label={row.genre} className="pt-6">
              <h3 className="px-6 text-base font-semibold tracking-tight">
                {row.genre} <span className="ml-1 text-sm font-normal text-neutral-500 tabular-nums">{row.titles.length}</span>
              </h3>
              <ul className="dark-scroll mt-3 flex snap-x gap-3 overflow-x-auto scroll-px-6 px-6 pb-3">
                {row.titles.map((title) => (
                  <li key={title.id} className="shrink-0 snap-start">
                    <Poster title={title} onClick={(event) => show(title.id, event)} className="w-32" />
                  </li>
                ))}
              </ul>
            </section>
          ))
        ) : (
          <section aria-label={filter} className="px-6 pt-6">
            <ul className="grid grid-cols-[repeat(auto-fill,minmax(8rem,1fr))] gap-3">
              {rows
                .find((row) => row.genre === filter)
                .titles.map((title) => (
                  <li key={title.id}>
                    <Poster title={title} onClick={(event) => show(title.id, event)} className="w-full" />
                  </li>
                ))}
            </ul>
          </section>
        )}

        <p className="sticky bottom-0 z-[1] mt-8 border-t border-white/10 bg-[#0b0b0c]/90 px-6 py-2 text-center text-xs text-neutral-400 backdrop-blur-md">
          Covers from{' '}
          <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-neutral-300 focus-visible:outline-2 focus-visible:outline-white">
            TMDB
          </a>
          , shown for reference only.
        </p>
      </div>

      {open && <TitleDetails title={open} onClose={close} />}
    </div>
  )
}

// A type-only poster in the title's own colours, so no studio artwork is needed.
function Poster({ title, onClick, className = '', large = false }) {
  const [background, ink] = title.tone
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${title.title}, ${title.year}`}
      style={{ background, color: ink }}
      className={`relative flex aspect-[2/3] flex-col justify-between overflow-hidden rounded-md p-3 text-left shadow-[0_8px_20px_-6px_rgb(0_0_0/0.7)] ring-1 ring-white/10 transition-[transform,box-shadow] duration-300 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-safe:hover:-translate-y-1 hover:shadow-[0_16px_32px_-8px_rgb(0_0_0/0.8)] ${className}`}
    >
      <span aria-hidden="true" className="text-[10px] font-semibold uppercase tracking-[0.14em] opacity-70">{title.genres[0]}</span>
      <span aria-hidden="true">
        <span style={DISPLAY} className={`block font-extrabold uppercase leading-[0.88] text-balance break-words ${large ? 'text-[2.6rem]' : 'text-[1.6rem]'}`}>
          {title.title}
        </span>
        <span className="mt-2 block text-[11px] font-medium tabular-nums opacity-70">{title.year}</span>
      </span>
      {/* A soft light falloff so the flat colour reads as printed paper, not a swatch. */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(160deg,rgb(255_255_255/0.12),transparent_45%,rgb(0_0_0/0.25))]" />
      <CoverImage title={title} width={large ? 500 : 342} />
    </button>
  )
}

// The real cover fades in over the type-only poster, which stays as the fallback if the image fails.
function CoverImage({ title, width }) {
  const [loaded, setLoaded] = useState(false)
  return (
    <img
      src={posterUrl(title, width)}
      alt=""
      loading="lazy"
      decoding="async"
      onLoad={() => setLoaded(true)}
      data-loaded={loaded}
      className="absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-500 data-[loaded=true]:opacity-100"
    />
  )
}

function TitleDetails({ title, onClose }) {
  const id = useId()
  const closeRef = useRef(null)
  const [background, ink] = title.tone

  useEffect(() => {
    closeRef.current.focus()
  }, [])

  function onKeyDown(event) {
    if (event.key === 'Escape') onClose()
    // Close is the only control, so Tab has nowhere else to go.
    if (event.key === 'Tab') event.preventDefault()
  }

  return (
    <div onClick={onClose} className="absolute inset-0 z-10 flex items-center justify-center bg-black/75 p-4 backdrop-blur-[2px]">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${id}-title`}
        onClick={(event) => event.stopPropagation()}
        onKeyDown={onKeyDown}
        className="flex w-full max-w-lg overflow-hidden rounded-xl bg-neutral-900 shadow-[0_24px_60px_-12px_rgb(0_0_0/0.9)] ring-1 ring-white/10"
      >
        <div aria-hidden="true" style={{ background, color: ink }} className="relative hidden aspect-[2/3] w-48 shrink-0 items-end self-start overflow-hidden p-3 @min-[480px]:flex">
          <span style={DISPLAY} className="text-2xl font-extrabold uppercase leading-[0.88] text-balance break-words">{title.title}</span>
          <CoverImage title={title} width={342} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col p-4 pl-5">
          <h2 id={`${id}-title`} style={DISPLAY} className="text-3xl font-extrabold uppercase leading-none text-balance">{title.title}</h2>
          <p className="mt-2 text-sm text-neutral-400 tabular-nums">{title.year}</p>
          <ul aria-label="Genres" className="mt-3 flex flex-wrap gap-1.5">
            {title.genres.map((genre) => (
              <li key={genre} className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-neutral-200">{genre}</li>
            ))}
          </ul>
          {title.why && <p className="mt-3 text-sm leading-relaxed text-neutral-300">{title.why}</p>}
          {/* Pinned to the bottom, so Close sits in the same place whether the text is shorter or longer than the cover. */}
          <div className="mt-auto flex justify-end pt-4">
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="rounded-md bg-white px-4 py-1.5 text-sm font-semibold text-neutral-900 hover:bg-neutral-200 dark:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
