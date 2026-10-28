import { useId } from 'react'
import { useTheme } from '../hooks/useTheme'

const CHOICES = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'auto', label: 'Auto' },
]

export default function SettingsApp() {
  const { preference, setPreference } = useTheme()
  const headingId = useId()

  return (
    <div className="min-h-full bg-gray-100 p-6 text-gray-900 dark:bg-neutral-900 dark:text-neutral-100">
      <div className="flex items-center gap-3">
        <span aria-hidden="true" className="flex size-9 items-center justify-center rounded-lg bg-linear-to-b from-gray-700 to-gray-900 text-white shadow-sm dark:from-neutral-500 dark:to-neutral-700">
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="12" r="8" />
            <path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor" />
          </svg>
        </span>
        <h2 id={headingId} className="text-lg font-semibold">
          Appearance
        </h2>
      </div>

      {/* A grouped panel, like a section of System Settings. */}
      <div className="mt-4 rounded-xl bg-white p-4 ring-1 ring-black/5 dark:bg-neutral-800 dark:ring-white/10">
        <div role="radiogroup" aria-labelledby={headingId} className="grid grid-cols-3 gap-3 sm:gap-5">
          {CHOICES.map((choice) => (
            <label key={choice.value} className="flex cursor-pointer flex-col items-center gap-2">
              <input
                type="radio"
                name="appearance"
                value={choice.value}
                checked={preference === choice.value}
                onChange={() => setPreference(choice.value)}
                className="peer sr-only"
              />
              <Preview
                kind={choice.value}
                className="ring-1 ring-black/10 transition-shadow peer-checked:ring-3 peer-checked:ring-blue-500 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-blue-500 dark:ring-white/10 dark:peer-checked:ring-blue-500"
              />
              <span className="rounded-full px-2.5 py-0.5 text-sm text-gray-700 peer-checked:bg-blue-500 peer-checked:font-medium peer-checked:text-white dark:text-neutral-300 dark:peer-checked:bg-blue-500 dark:peer-checked:text-white">
                {choice.label}
              </span>
            </label>
          ))}
        </div>
        <p className="mt-4 border-t border-black/5 pt-3 text-sm text-gray-600 dark:border-white/10 dark:text-neutral-400">
          Auto switches between light and dark to match your device.
        </p>
      </div>
    </div>
  )
}

// The previews show a theme rather than follow it, so their colours are fixed.
function Preview({ kind, className }) {
  return (
    <span aria-hidden="true" className={`relative block aspect-[4/3] w-full overflow-hidden rounded-lg ${className}`}>
      {kind === 'auto' ? (
        <>
          <span className="absolute inset-y-0 left-0 w-1/2 overflow-hidden">
            <Scene dark={false} className="w-[200%]" />
          </span>
          <span className="absolute inset-y-0 right-0 w-1/2 overflow-hidden">
            <Scene dark className="right-0 w-[200%]" />
          </span>
        </>
      ) : (
        <Scene dark={kind === 'dark'} className="w-full" />
      )}
    </span>
  )
}

function Scene({ dark, className }) {
  return (
    <span className={`absolute inset-y-0 block ${dark ? 'bg-[#4a3434]' : 'bg-[#f4cfcf]'} ${className}`}>
      <span
        className={`absolute inset-x-[16%] bottom-[14%] top-[18%] block rounded-md shadow-md ${dark ? 'bg-[#262626]' : 'bg-[#ffffff]'}`}
      >
        <span className="flex gap-0.5 p-1">
          <span className="size-1 rounded-full bg-[#ff5f57]" />
          <span className="size-1 rounded-full bg-[#febc2e]" />
          <span className="size-1 rounded-full bg-[#28c840]" />
        </span>
        <span className={`mx-1.5 mt-0.5 block h-1 rounded-full ${dark ? 'bg-[#525252]' : 'bg-[#e5e7eb]'}`} />
        <span className={`mx-1.5 mt-1 block h-1 w-1/2 rounded-full ${dark ? 'bg-[#525252]' : 'bg-[#e5e7eb]'}`} />
      </span>
    </span>
  )
}
