import { experience } from '../data/experience'

export default function ExperienceApp() {
  return (
    <div className="p-6">
      <ol aria-label="Work experience" className="space-y-6 pl-6">
        {experience.map((job, index) => (
          <li key={`${job.company}-${job.period}`} className="relative">
            {/* Runs from this dot to the next one (space-y-6 = 1.5rem gap), so the last job has none. */}
            {index < experience.length - 1 && (
              <span
                aria-hidden="true"
                data-timeline-line
                className="absolute -left-6 top-3 h-[calc(100%+1.5rem)] w-px bg-gray-200 dark:bg-neutral-700"
              />
            )}
            <span
              aria-hidden="true"
              className="absolute -left-[29.5px] top-1.5 size-3 rounded-full border-2 border-white bg-blue-500 dark:border-neutral-900 shadow-[0_0_0_1px_rgb(191_219_254)]"
            />
            <article>
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <h3 className="font-semibold text-gray-900 dark:text-neutral-100">{job.role}</h3>
                <p className="text-xs text-gray-500 dark:text-neutral-400">{job.period}</p>
              </div>
              <p className="text-sm font-medium text-blue-700 dark:text-blue-400">{job.company}</p>
              <p className="text-xs text-gray-500 dark:text-neutral-400">{job.location}</p>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-sm leading-relaxed text-gray-700 dark:text-neutral-300">
                {job.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </article>
          </li>
        ))}
      </ol>
    </div>
  )
}
