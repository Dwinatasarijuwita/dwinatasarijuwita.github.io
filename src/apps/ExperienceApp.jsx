import { experience } from '../data/experience'

export default function ExperienceApp() {
  return (
    <div className="min-h-full bg-white p-6 text-gray-900 dark:bg-neutral-900 dark:text-neutral-100">
      <h2 className="text-2xl font-bold tracking-tight">Work Experience</h2>
      <p className="mt-1 text-sm text-gray-600 dark:text-neutral-400">From internships in finance to building the web.</p>

      <ol aria-label="Work experience" className="mt-6 space-y-5">
        {experience.map((job, index) => {
          const current = job.period.endsWith('Now')
          return (
            <li key={`${job.company}-${job.period}`} className="relative pl-14">
              {/* Runs from this badge to the next one (space-y-5 = 1.25rem gap), so the last job has none. */}
              {index < experience.length - 1 && (
                <span aria-hidden="true" data-timeline-line className="absolute top-11 left-5 h-[calc(100%-1.5rem)] w-px bg-gray-200 dark:bg-neutral-700" />
              )}
              <span
                aria-hidden="true"
                className={`absolute top-0 left-0 flex size-10 items-center justify-center rounded-xl text-sm font-bold ${
                  current ? 'bg-blue-600 text-white dark:bg-blue-500' : 'bg-gray-100 text-gray-600 dark:bg-neutral-800 dark:text-neutral-300'
                }`}
              >
                {job.monogram}
              </span>
              <article className="rounded-xl bg-gray-50 p-4 ring-1 ring-black/5 dark:bg-neutral-800/60 dark:ring-white/10">
                <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
                  <h3 className="font-semibold leading-snug">{job.role}</h3>
                  <p
                    className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium tabular-nums ${
                      current ? 'bg-blue-100 text-blue-800 dark:bg-blue-400/15 dark:text-blue-300' : 'bg-gray-200/70 text-gray-600 dark:bg-neutral-700 dark:text-neutral-300'
                    }`}
                  >
                    {job.period}
                  </p>
                </div>
                <p className="mt-0.5 text-sm font-medium text-blue-700 dark:text-blue-400">{job.company}</p>
                <p className="text-xs text-gray-500 dark:text-neutral-400">{job.location}</p>
                <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-gray-700 dark:text-neutral-300">
                  {job.highlights.map((highlight) => (
                    <li key={highlight} className="flex gap-2">
                      <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-blue-500 dark:bg-blue-400" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
