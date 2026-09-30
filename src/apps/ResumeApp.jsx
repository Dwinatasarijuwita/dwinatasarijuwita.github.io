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
    return <p className="p-6 text-sm text-gray-500">Memuat CV…</p>
  }

  if (status === 'missing') {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
        <p className="text-lg font-semibold text-gray-900">CV segera hadir</p>
        <p className="text-sm text-gray-500">Silakan cek lagi nanti.</p>
      </div>
    )
  }

  if (isMobile) {
    return (
      <div className="space-y-4 p-6">
        <h2 className="text-xl font-semibold text-gray-900">Resume {profile.name}</h2>
        <p className="text-sm text-gray-600">Lihat atau unduh CV lengkap dalam format PDF.</p>
        <div className="flex flex-col gap-3">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-gray-900 px-4 py-3 text-center font-medium text-white"
          >
            Buka PDF
          </a>
          <a
            href={url}
            download={downloadName}
            className="rounded-xl bg-gray-100 px-4 py-3 text-center font-medium text-gray-900"
          >
            Unduh CV
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-end border-b border-gray-200 bg-gray-50 px-3 py-2">
        <a
          href={url}
          download={downloadName}
          className="rounded-md bg-white px-3 py-1 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-gray-200 hover:bg-gray-100"
        >
          Unduh
        </a>
      </div>
      <iframe title={`Resume ${profile.name}`} src={url} className="min-h-0 flex-1 bg-white" />
    </div>
  )
}
