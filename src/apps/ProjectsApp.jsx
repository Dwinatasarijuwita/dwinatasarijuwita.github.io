import { useEffect, useRef, useState } from 'react'
import { projects } from '../data/projects'

export default function ProjectsApp() {
  const [selectedId, setSelectedId] = useState(null)
  const scrollerRef = useRef(null)
  const previousIdRef = useRef(null)
  const selected = projects.find((project) => project.id === selectedId)

  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return
    scroller.scrollTop = 0
    // The button that switched views has unmounted, so move focus to its counterpart in the new view.
    const previousId = previousIdRef.current
    previousIdRef.current = selectedId
    if (selectedId) scroller.querySelector('[data-back]')?.focus()
    else if (previousId) scroller.querySelector(`[data-project-id="${previousId}"]`)?.focus()
  }, [selectedId])

  return (
    <div ref={scrollerRef} className="h-full overflow-y-auto bg-white text-gray-900">
      {selected ? (
        <ProjectDetail project={selected} onBack={() => setSelectedId(null)} />
      ) : (
        <ProjectList onSelect={setSelectedId} />
      )}
    </div>
  )
}

function ProjectList({ onSelect }) {
  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold">Projects</h2>
      <p className="mt-1 text-sm text-gray-500">Team projects I've worked on at Permata Indonesia.</p>
      <ul aria-label="Projects" className="mt-5 divide-y divide-gray-200 border-y border-gray-200">
        {projects.map((project) => (
          <li key={project.id} className="flex items-center gap-3 py-3">
            {/* The Open link is a sibling, not a child, of this button so clicking it only opens the site. */}
            <button
              type="button"
              data-project-id={project.id}
              onClick={() => onSelect(project.id)}
              className="flex min-w-0 flex-1 items-center gap-3 rounded-lg text-left focus-visible:outline-2 focus-visible:outline-blue-500"
            >
              <ProjectIcon initials={project.initials} className="size-14 text-lg" />
              <span className="min-w-0">
                <span className="line-clamp-2 font-semibold leading-snug">{project.name}</span>
                <span className="block truncate text-sm text-gray-500">{project.subtitle}</span>
              </span>
            </button>
            <OpenButton project={project} />
          </li>
        ))}
      </ul>
    </div>
  )
}

function ProjectDetail({ project, onBack }) {
  return (
    <article aria-label={project.name} className="p-6">
      <button type="button" data-back onClick={onBack} className="text-sm text-blue-600 hover:underline">
        ‹ Projects
      </button>
      <header className="mt-4 flex items-center gap-4">
        <ProjectIcon initials={project.initials} className="size-20 text-2xl sm:size-24 sm:text-3xl" />
        <div className="min-w-0">
          <h2 className="text-xl font-bold sm:text-2xl">{project.name}</h2>
          <p className="text-sm text-gray-500">{project.subtitle}</p>
          <div className="mt-3">
            <OpenButton project={project} prominent />
          </div>
        </div>
      </header>
      <ul aria-label="Screenshots" className="-mx-6 mt-6 flex snap-x scroll-px-6 gap-3 overflow-x-auto px-6 pb-2">
        {project.screenshots.map((shot) => (
          <li key={shot.src} className="shrink-0 snap-start">
            <img
              src={shot.src}
              alt={shot.alt}
              width={shot.width}
              height={shot.height}
              loading="lazy"
              className="h-48 w-auto rounded-xl border border-gray-200 sm:h-64"
            />
          </li>
        ))}
      </ul>
      <Section title="Description">
        <p>{project.description}</p>
      </Section>
      <Section title="My Role">
        <ul className="list-disc space-y-1 pl-4">
          {project.role.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Section>
      <Section title="Tech Stack">
        <ul aria-label="Tech stack" className="flex flex-wrap gap-2">
          {project.tech.map((item) => (
            <li key={item} className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
              {item}
            </li>
          ))}
        </ul>
      </Section>
    </article>
  )
}

function Section({ title, children }) {
  return (
    <section aria-label={title} className="mt-6 border-t border-gray-200 pt-4 text-sm leading-relaxed text-gray-700">
      <h3 className="mb-2 text-base font-semibold text-gray-900">{title}</h3>
      {children}
    </section>
  )
}

function ProjectIcon({ initials, className }) {
  return (
    <span
      aria-hidden="true"
      className={`flex aspect-square shrink-0 items-center justify-center rounded-[22%] bg-linear-to-b from-sky-400 to-blue-700 font-bold text-white shadow-md ${className}`}
    >
      {initials}
    </span>
  )
}

function OpenButton({ project, prominent = false }) {
  return (
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open ${project.name}`}
      className={`inline-block shrink-0 rounded-full px-4 py-1 text-sm font-semibold ${
        prominent ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-100 text-blue-600 hover:bg-gray-200'
      }`}
    >
      Open
      {prominent && <span aria-hidden="true"> ↗</span>}
    </a>
  )
}
