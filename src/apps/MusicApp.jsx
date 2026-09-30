import { profile } from '../data/profile'
import { songs } from '../data/songs'
import { gradientFor, songHref } from '../lib/music'

export default function MusicApp() {
  return (
    <div className="p-5">
      <header className="flex items-end gap-4">
        <div
          aria-hidden="true"
          className="flex size-28 shrink-0 items-center justify-center rounded-lg text-5xl text-white shadow-lg"
          style={{ background: gradientFor('Lagu Favorit') }}
        >
          ♪
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Playlist</p>
          <h2 className="text-2xl font-bold text-gray-900">Lagu Favorit {profile.initials}</h2>
          <p className="text-sm text-gray-500">{songs.length} lagu</p>
        </div>
      </header>

      <ol className="mt-5 divide-y divide-gray-100">
        {songs.map((song, index) => (
          <li key={`${song.title}-${song.artist}`}>
            <a
              href={songHref(song)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-md px-2 py-2 hover:bg-gray-100"
            >
              <span className="w-5 text-right text-sm text-gray-400">{index + 1}</span>
              <span
                aria-hidden="true"
                className="flex size-10 shrink-0 items-center justify-center rounded text-white"
                style={{ background: gradientFor(song.title) }}
              >
                ♪
              </span>
              <span className="min-w-0">
                <span className="block truncate font-medium text-gray-900">{song.title}</span>
                <span className="block truncate text-sm text-gray-500">{song.artist}</span>
              </span>
            </a>
          </li>
        ))}
      </ol>
    </div>
  )
}
