import { useEffect, useRef, useState } from 'react'
import { profile } from '../data/profile'
import { songs } from '../data/songs'
import { coverUrl, gradientFor, songHref, trackId } from '../lib/music'
import { loadSpotifyApi } from '../lib/spotifyEmbed'

// Always dark, like a listening room, whatever the Settings theme.
export default function MusicApp() {
  const [index, setIndex] = useState(0)
  const [query, setQuery] = useState('')
  // Nothing plays when the window opens; once a song is picked, the player starts it straight away.
  const [picked, setPicked] = useState(false)
  // Follows Spotify's player, so the bars and the record only move while music is actually playing.
  const [playing, setPlaying] = useState(false)
  const needle = query.trim().toLowerCase()
  const matches = songs
    .map((item, i) => ({ item, i }))
    .filter(({ item }) => !needle || `${item.title} ${item.artist}`.toLowerCase().includes(needle))
  const song = songs[index]
  const id = trackId(song)
  const cover = coverUrl(song, 640)

  return (
    <div className="@container relative isolate h-full overflow-hidden bg-[#0d0b10] text-neutral-100 selection:bg-rose-500 selection:text-white">
      {/* The current album's art, blown up and blurred into the room's light. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        {cover ? (
          <img key={cover} src={cover} alt="" className="size-full scale-125 object-cover opacity-60 blur-3xl saturate-150 motion-safe:animate-[fade-in_600ms_ease-out]" />
        ) : (
          <div className="size-full opacity-40 blur-3xl" style={{ background: gradientFor(song.title) }} />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-[#0d0b10]/55 to-[#0d0b10]/95" />
      </div>

      <div className="dark-scroll flex h-full flex-col gap-6 overflow-y-auto px-6 pt-6 pb-10 @min-[600px]:flex-row @min-[600px]:gap-8">
        <section aria-label="Now playing" className="flex shrink-0 flex-col items-center @min-[600px]:sticky @min-[600px]:top-0 @min-[600px]:w-[300px] @min-[600px]:self-start">
          <Record song={song} playing={playing} />
          <div className="mt-5 w-full text-center">
            <h3 className="text-xl font-bold leading-tight text-balance">{song.title}</h3>
            <p className="mt-1 text-sm text-white/70">{song.artist}</p>
          </div>
          {id ? (
            <SpotifyPlayer id={id} title={song.title} autoplay={picked} onPlayingChange={setPlaying} />
          ) : (
            <a
              href={songHref(song)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-neutral-900 hover:bg-white/90 dark:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Find on Spotify
            </a>
          )}
          <p className="mt-4 text-center text-xs text-white/45">Album art and previews from Spotify.</p>
        </section>

        <section aria-labelledby="music-title" className="min-w-0 flex-1">
          <h2 id="music-title" className="text-2xl font-bold tracking-tight">
            {profile.nickname.split(' ')[0]}&apos;s Favorite Songs
          </h2>
          <p className="mt-1 text-sm text-white/60">{songs.length} songs on repeat</p>

          <label className="mt-4 flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 ring-white/30 focus-within:ring-2">
            <SearchIcon />
            <span className="sr-only">Search songs</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search a song or artist"
              className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/45"
            />
          </label>

          {matches.length === 0 && <p className="mt-6 text-sm text-white/60">No song matches “{query.trim()}”.</p>}
          <ol className="mt-3 space-y-1">
            {matches.map(({ item, i }) => {
              const current = i === index
              return (
                <li key={`${item.title}-${item.artist}`} className="group flex items-center gap-1">
                  <button
                    type="button"
                    aria-current={current ? 'true' : undefined}
                    onClick={() => {
                      setIndex(i)
                      setPicked(true)
                    }}
                    className="flex min-w-0 flex-1 items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white aria-[current=true]:bg-white/15"
                  >
                    <span className="w-5 shrink-0 text-right text-sm text-white/50 tabular-nums">
                      {current ? <Bars playing={playing} /> : i + 1}
                    </span>
                    <Cover song={item} className="size-11 rounded-md" />
                    <span className="min-w-0">
                      <span className={`block truncate font-medium ${current ? 'text-rose-300' : ''}`}>{item.title}</span>
                      <span className="block text-sm leading-snug text-white/60">{item.artist}</span>
                    </span>
                  </button>
                  <a
                    href={songHref(item)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open ${item.title} by ${item.artist} in Spotify`}
                    className="shrink-0 rounded-full p-2 text-white/50 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-white"
                  >
                    <ExternalIcon />
                  </a>
                </li>
              )
            })}
          </ol>
        </section>
      </div>
    </div>
  )
}

// Spotify's own player. With the iFrame API it is created once and switched between tracks, so a
// picked song can start playing; without it, a plain embed still lets the visitor press play.
function SpotifyPlayer({ id, title, autoplay, onPlayingChange }) {
  const hostRef = useRef(null)
  const controllerRef = useRef(null)
  const playWhenReadyRef = useRef(false)
  const [api, setApi] = useState(undefined)
  const uri = `spotify:track:${id}`

  useEffect(() => {
    let live = true
    loadSpotifyApi().then((loaded) => live && setApi(loaded))
    return () => {
      live = false
    }
  }, [])

  useEffect(() => {
    if (!api || !hostRef.current) return
    const host = document.createElement('div')
    hostRef.current.append(host)
    api.createController(host, { uri, width: '100%', height: 80, theme: 'dark' }, (controller) => {
      controllerRef.current = controller
      // play() only takes once the new track has loaded, which Spotify signals with "ready".
      controller.addListener('playback_update', (event) => onPlayingChange(!event.data.isPaused))
      controller.addListener('ready', () => {
        if (!playWhenReadyRef.current) return
        playWhenReadyRef.current = false
        controller.play()
      })
    })
    return () => {
      controllerRef.current?.destroy()
      controllerRef.current = null
    }
    // The controller is made once; track changes go through loadUri below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api])

  useEffect(() => {
    const controller = controllerRef.current
    if (!controller) return
    playWhenReadyRef.current = autoplay
    onPlayingChange(false)
    controller.loadUri(uri)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uri, autoplay])

  if (api === null) {
    return (
      <iframe
        key={id}
        title={`Play ${title} on Spotify`}
        src={`https://open.spotify.com/embed/track/${id}?theme=0`}
        loading="lazy"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        className="mt-5 h-20 w-full rounded-xl"
      />
    )
  }
  return <div ref={hostRef} title={`Play ${title} on Spotify`} className="mt-5 h-20 w-full overflow-hidden rounded-xl [&_iframe]:rounded-xl" />
}

// A vinyl record with the album art as its label; it turns while a song plays, unless motion is reduced.
function Record({ song, playing }) {
  return (
    <div className="relative aspect-square w-56 @min-[600px]:w-64">
      <div className={`absolute inset-[6%] translate-x-[14%] rounded-full bg-[repeating-radial-gradient(circle,#161616_0_2px,#0b0b0b_2px_4px)] shadow-[0_18px_40px_-12px_rgb(0_0_0/0.8)] ring-1 ring-white/10 motion-safe:animate-[spin_9s_linear_infinite] ${playing ? '' : '[animation-play-state:paused]'}`}>
        <div className="absolute inset-[32%] overflow-hidden rounded-full ring-4 ring-black/60">
          <Cover song={song} size={640} className="size-full" />
        </div>
        <div className="absolute inset-[48.5%] rounded-full bg-[#0d0b10]" />
        {/* A soft sheen across the grooves. */}
        <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_30deg,transparent_0deg,rgb(255_255_255/0.08)_40deg,transparent_90deg,transparent_180deg,rgb(255_255_255/0.06)_220deg,transparent_270deg)]" />
      </div>
      <div className="absolute inset-[6%] -translate-x-[6%] overflow-hidden rounded-lg shadow-[0_20px_40px_-12px_rgb(0_0_0/0.85)] ring-1 ring-white/10">
        <Cover song={song} size={640} className="size-full" />
      </div>
    </div>
  )
}

function Cover({ song, size = 300, className = '' }) {
  const src = coverUrl(song, size)
  return src ? (
    <img src={src} alt="" loading="lazy" className={`shrink-0 bg-white/10 object-cover ${className}`} />
  ) : (
    <span aria-hidden="true" className={`flex shrink-0 items-center justify-center ${className}`} style={{ background: gradientFor(song.title) }}>
      <NoteIcon />
    </span>
  )
}

// Three bars on the current song: they bounce while it plays and rest, uneven, while it is paused.
function Bars({ playing }) {
  return (
    <span aria-hidden="true" className="inline-flex h-3.5 items-end gap-[2px] text-rose-300">
      {[
        [0, 0.5],
        [150, 0.9],
        [300, 0.35],
      ].map(([delay, rest]) => (
        <span
          key={delay}
          className={`h-full w-[3px] origin-bottom rounded-full bg-current ${playing ? 'motion-safe:animate-[eq_900ms_ease-in-out_infinite]' : ''}`}
          style={playing ? { animationDelay: `${delay}ms` } : { transform: `scaleY(${rest})` }}
        />
      ))}
    </span>
  )
}

function SearchIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 shrink-0 text-white/60" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  )
}

function ExternalIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
    </svg>
  )
}

function NoteIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-1/2 text-white" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18V6l10-2v12" />
      <circle cx="6.5" cy="18" r="2.5" />
      <circle cx="16.5" cy="16" r="2.5" />
    </svg>
  )
}
