import { useEffect, useState } from 'react'
import Avatar from '../components/Avatar'
import { profile } from '../data/profile'

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

  return (
    <div className="flex flex-col items-center gap-4 p-6 text-center">
      <Avatar size="lg" />
      <h2 className="text-xl font-semibold text-gray-900">{profile.name}</h2>
      <div className="w-full rounded-xl bg-gray-50 p-4 text-left">
        <p className="text-xs font-medium text-gray-500">email</p>
        <a href={`mailto:${profile.email}`} className="break-all text-blue-600 hover:underline">
          {profile.email}
        </a>
      </div>
      {canCopy && (
        <button
          type="button"
          onClick={copyEmail}
          className="rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
        >
          {copied ? 'Tersalin ✓' : 'Salin email'}
        </button>
      )}
    </div>
  )
}
