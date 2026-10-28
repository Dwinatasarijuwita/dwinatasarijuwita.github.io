import { useEffect, useState } from 'react'
import Avatar from '../components/Avatar'
import { profile } from '../data/profile'
import { formatPhone, whatsappUrl } from '../lib/contact'

const ROW = 'flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-100 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue-500 dark:hover:bg-white/5'

export default function ContactApp() {
  const [copied, setCopied] = useState(false)
  const canCopy = Boolean(navigator.clipboard?.writeText)

  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(timer)
  }, [copied])

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  const emailBody = (
    <>
      <RowIcon tone="bg-sky-500">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3.5 6.5l8.5 6.5 8.5-6.5" />
      </RowIcon>
      <span className="min-w-0 flex-1">
        <span className="block text-xs text-gray-500 dark:text-neutral-400">Email</span>
        <span className="block break-all font-medium">{profile.email}</span>
      </span>
      <span aria-hidden="true" className="shrink-0 text-xs text-gray-400 dark:text-neutral-500">
        {canCopy ? 'Copy' : 'Write'}
      </span>
    </>
  )

  return (
    <div className="min-h-full bg-gray-50 p-6 text-gray-900 dark:bg-neutral-900 dark:text-neutral-100">
      <div className="flex flex-col items-center text-center">
        <Avatar size="lg" />
        <h2 className="mt-3 text-xl font-bold tracking-tight">{profile.name}</h2>
        <p className="text-sm text-gray-600 dark:text-neutral-400">{profile.tagline}</p>
      </div>

      <ul className="mt-5 divide-y divide-gray-200 overflow-hidden rounded-xl bg-white ring-1 ring-black/5 dark:divide-white/10 dark:bg-neutral-800 dark:ring-white/10">
        <li>
          {canCopy ? (
            <button type="button" onClick={copyEmail} title="Click to copy" className={ROW}>
              {emailBody}
            </button>
          ) : (
            <a href={`mailto:${profile.email}`} className={ROW}>
              {emailBody}
            </a>
          )}
        </li>
        {profile.phoneNumber && (
          <li>
            <a href={whatsappUrl(profile.phoneNumber)} target="_blank" rel="noopener noreferrer" className={ROW}>
              <RowIcon tone="bg-green-500">
                <path d="M4.5 19.5l1.2-3.6A7.8 7.8 0 1 1 8.4 18.6z" />
                <path d="M9.3 8.8c.2 2.6 3.3 5.6 5.9 5.9l1-1.3-1.9-1-1 .7c-.8-.4-1.9-1.5-2.3-2.3l.7-1-1-1.9z" />
              </RowIcon>
              <span className="min-w-0 flex-1">
                <span className="block text-xs text-gray-500 dark:text-neutral-400">WhatsApp</span>
                <span className="block font-medium tabular-nums">{formatPhone(profile.phoneNumber)}</span>
              </span>
              <Chevron />
            </a>
          </li>
        )}
      </ul>
      {/* Empty until copied, so it takes no space until the notice appears. */}
      <p role="status" className="mt-2 text-center text-xs font-medium text-green-700 dark:text-green-400">
        {copied && '✓ Email copied'}
      </p>
    </div>
  )
}

function RowIcon({ tone, children }) {
  return (
    <span aria-hidden="true" className={`flex size-9 shrink-0 items-center justify-center rounded-lg text-white ${tone}`}>
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {children}
      </svg>
    </span>
  )
}

function Chevron() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 shrink-0 text-gray-400 dark:text-neutral-500" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 5l7 7-7 7" />
    </svg>
  )
}
