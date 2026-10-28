import Avatar from '../components/Avatar'
import { profile } from '../data/profile'

const FACT_ICONS = {
  'Currently learning': (
    <path d="M4 6.5C6.5 5 9.5 5 12 6.5 14.5 5 17.5 5 20 6.5V19c-2.5-1.5-5.5-1.5-8 0-2.5-1.5-5.5-1.5-8 0zM12 6.5V19" />
  ),
  Hobbies: (
    <>
      <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
    </>
  ),
  Location: (
    <>
      <path d="M12 21s-6.5-5.8-6.5-11a6.5 6.5 0 0 1 13 0c0 5.2-6.5 11-6.5 11z" />
      <circle cx="12" cy="10" r="2.3" />
    </>
  ),
}

export default function AboutApp() {
  return (
    <div className="@container min-h-full bg-white text-gray-900 dark:bg-neutral-900 dark:text-neutral-100">
      {/* A band in the wallpaper's blush, so the window feels like part of the desktop. */}
      <div aria-hidden="true" className="h-24 bg-linear-to-br from-[#f6d5d0] via-[#e9b8b4] to-[#c98f93] dark:from-[#5a3a3c] dark:via-[#4a3034] dark:to-[#2e2022]" />

      <div className="px-6 pb-6">
        <div className="-mt-12 flex flex-col gap-3">
          <span className="w-fit rounded-full ring-4 ring-white dark:ring-neutral-900">
            <Avatar size="lg" />
          </span>
          <div className="min-w-0">
            <h2 className="text-2xl font-bold tracking-tight">{profile.name}</h2>
            <p className="text-sm text-gray-600 dark:text-neutral-400">{profile.tagline}</p>
          </div>
        </div>

        <div className="mt-5 max-w-prose space-y-3 text-[15px] leading-relaxed text-gray-700 dark:text-neutral-300">
          {profile.intro.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <dl className="mt-6 grid gap-2 @min-[480px]:grid-cols-3">
          {profile.facts.map((fact) => (
            <div key={fact.label} className="rounded-xl bg-gray-50 p-3 ring-1 ring-black/5 dark:bg-neutral-800 dark:ring-white/10">
              <dt className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-neutral-400">
                <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 text-rose-500 dark:text-rose-400" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  {FACT_ICONS[fact.label]}
                </svg>
                {fact.label}
              </dt>
              <dd className="mt-1 text-sm font-medium text-gray-900 dark:text-neutral-100">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}
