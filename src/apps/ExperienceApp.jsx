import { experience } from '../data/experience'

export default function ExperienceApp() {
  return (
    <div className="p-6">
      <ol aria-label="Work experience" className="space-y-6 border-l border-gray-200 pl-6">
        {experience.map((job) => (
          <li key={`${job.company}-${job.period}`} className="relative">
            <span
              aria-hidden="true"
              className="absolute -left-[30.5px] top-1.5 size-3 rounded-full border-2 border-white bg-blue-500 shadow-[0_0_0_1px_rgb(191_219_254)]"
            />
            <article>
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <h3 className="font-semibold text-gray-900">{job.role}</h3>
                <p className="text-xs text-gray-500">{job.period}</p>
              </div>
              <p className="text-sm font-medium text-blue-700">{job.company}</p>
              <p className="text-xs text-gray-500">{job.location}</p>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-sm leading-relaxed text-gray-700">
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
