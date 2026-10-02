import { useEffect, useState } from 'react'
import { profile } from '../data/profile'
import { useIsMobile } from '../hooks/useIsMobile'
import { isPdfAvailable } from '../lib/resume'

export default function ResumeApp() {
  const isMobile = useIsMobile()
  const [status, setStatus] = useState('checking')
  const { url, downloadName } = profile.resume

  useEffect(() => {
    let cancelled = false
    isPdfAvailable(url).then((available) => {
      if (!cancelled) setStatus(available ? 'ready' : 'missing')
    })
    return () => {
      cancelled = true
    }
  }, [url])

  if (status === 'checking') {
    return <p className="p-6 text-sm text-gray-500 dark:text-neutral-400">Loading CV…</p>
  }

  if (status === 'missing') {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
        <p className="text-lg font-semibold text-gray-900 dark:text-neutral-100">CV coming soon</p>
        <p className="text-sm text-gray-500 dark:text-neutral-400">Please check back later.</p>
      </div>
    )
  }

  if (isMobile) {
    return (
      <div className="space-y-4 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-neutral-100">Resume {profile.name}</h2>
        <p className="text-sm text-gray-600 dark:text-neutral-300">View or download the full CV as a PDF.</p>
        <div className="flex flex-col gap-3">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-gray-900 px-4 py-3 text-center font-medium text-white"
          >
            Open PDF
          </a>
          <a
            href={url}
            download={downloadName}
            className="rounded-xl bg-gray-100 px-4 py-3 text-center font-medium text-gray-900 dark:bg-neutral-800 dark:text-neutral-100"
          >
            Download CV
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-end border-b border-gray-200 bg-gray-50 px-3 py-2 dark:border-white/10 dark:bg-neutral-800">
        <a
          href={url}
          download={downloadName}
          className="rounded-md bg-white px-3 py-1 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-gray-200 hover:bg-gray-100 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
        >
          Download
        </a>
      </div>
      <iframe title={`Resume ${profile.name}`} src={url} className="min-h-0 flex-1 bg-white dark:bg-neutral-900" />
    </div>
  )
}
