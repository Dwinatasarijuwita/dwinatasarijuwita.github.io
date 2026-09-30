import { useEffect, useState } from 'react'
import Avatar from '../components/Avatar'
import { profile } from '../data/profile'
import { formatPhone, whatsappUrl } from '../lib/contact'

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
      <dl className="w-full divide-y divide-gray-200 rounded-xl bg-gray-50 text-left">
        <div className="px-4 py-3">
          <dt className="text-xs font-medium text-gray-500">email</dt>
          <dd>
            {canCopy ? (
              <button
                type="button"
                onClick={copyEmail}
                title="Click to copy"
                className="break-all text-left text-blue-600 hover:underline"
              >
                {profile.email}
              </button>
            ) : (
              <a href={`mailto:${profile.email}`} className="break-all text-blue-600 hover:underline">
                {profile.email}
              </a>
            )}
            {/* Empty until copied, so it takes no space until the notice appears. */}
            <p role="status" className="text-xs font-medium text-green-600">
              {copied && '✓ Email copied'}
            </p>
          </dd>
        </div>
        {profile.phoneNumber && (
          <div className="px-4 py-3">
            <dt className="text-xs font-medium text-gray-500">WhatsApp</dt>
            <dd>
              <a
                href={whatsappUrl(profile.phoneNumber)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {formatPhone(profile.phoneNumber)}
              </a>
            </dd>
          </div>
        )}
      </dl>
    </div>
  )
}
