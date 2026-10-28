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
    <div ref={scrollerRef} className="@container h-full overflow-y-auto bg-stone-50 text-gray-900 dark:bg-neutral-900 dark:text-neutral-100">
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
      <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
      <p className="mt-1 max-w-prose text-sm text-gray-600 dark:text-neutral-400">
        Team projects I&apos;ve worked on at Permata Indonesia. Pick one to see what I built.
      </p>
      <ul aria-label="Projects" className="mt-6 grid gap-5 @min-[620px]:grid-cols-2">
        {projects.map((project) => (
          <li key={project.id} className="group flex flex-col">
            {/* The Open link is a sibling, not a child, of this button so clicking it only opens the site. */}
            <button
              type="button"
              data-project-id={project.id}
              onClick={() => onSelect(project.id)}
              className="rounded-xl text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500"
            >
              <BrowserFrame url={project.url} className="transition-[transform,box-shadow] duration-300 ease-out group-hover:shadow-[0_18px_36px_-14px_rgb(0_0_0/0.35)] motion-safe:group-hover:-translate-y-1">
                <img
                  src={project.screenshots[0].src}
                  alt=""
                  width={project.screenshots[0].width}
                  height={project.screenshots[0].height}
                  loading="lazy"
                  className="aspect-[16/10] w-full object-cover object-top"
                />
              </BrowserFrame>
              <span className="mt-3 block font-semibold leading-snug">{project.name}</span>
              <span className="mt-0.5 block text-sm text-gray-600 dark:text-neutral-400">{project.subtitle}</span>
            </button>
            <div className="mt-3 flex items-center justify-between gap-3">
              <TechList tech={project.tech} />
              <OpenButton project={project} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

function ProjectDetail({ project, onBack }) {
  const [shotIndex, setShotIndex] = useState(0)
  const shot = project.screenshots[shotIndex]

  return (
    <article aria-label={project.name} className="p-6">
      <button
        type="button"
        data-back
        onClick={onBack}
        className="rounded text-sm font-medium text-blue-600 hover:underline focus-visible:outline-2 focus-visible:outline-blue-500 dark:text-blue-400"
      >
        ‹ Projects
      </button>

      <header className="mt-4 flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <div className="min-w-0">
          <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-400/15 dark:text-blue-300">Team project</span>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-balance">{project.name}</h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-neutral-400">{project.subtitle}</p>
        </div>
        <OpenButton project={project} prominent />
      </header>

      {/* The picked screenshot, large, in a browser window showing the live address. */}
      <BrowserFrame url={project.url} className="mt-5">
        <div className="flex aspect-[16/10] items-start justify-center bg-gray-100 dark:bg-neutral-800">
          <img key={shot.src} src={shot.src} alt={shot.alt} className="h-full w-auto max-w-full object-contain object-top motion-safe:animate-[fade-in_300ms_ease-out]" />
        </div>
      </BrowserFrame>

      <ul aria-label="Screenshots" className="-mx-6 mt-3 flex scroll-px-6 gap-2 pointer-coarse:snap-x overflow-x-auto px-6 pt-1 pb-2">
        {project.screenshots.map((item, index) => (
          <li key={item.src} className="shrink-0 pointer-coarse:snap-start">
            <button
              type="button"
              aria-pressed={index === shotIndex}
              onClick={() => setShotIndex(index)}
              className="block overflow-hidden rounded-lg opacity-60 ring-2 ring-transparent transition hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 aria-pressed:opacity-100 aria-pressed:ring-blue-500"
            >
              <img src={item.src} alt={item.alt} width={item.width} height={item.height} loading="lazy" className="h-14 w-auto" />
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-4 grid gap-x-8 gap-y-6 @min-[620px]:grid-cols-[1fr_1.3fr]">
        <Section title="Description">
          <p>{project.description}</p>
          <h3 className="mt-5 mb-2 text-sm font-semibold text-gray-900 dark:text-neutral-100">Tech Stack</h3>
          <TechList tech={project.tech} />
        </Section>
        <Section title="My Role">
          <p className="mb-3">Built together with the team at Permata Indonesia. My part:</p>
          <ul className="space-y-3">
            {project.role.map((item) => (
              <li key={item} className="flex gap-3">
                <CheckIcon />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Section>
      </div>
    </article>
  )
}

function Section({ title, children }) {
  return (
    <section aria-label={title} className="text-sm leading-relaxed text-gray-700 dark:text-neutral-300">
      <h3 className="mb-2 text-base font-semibold text-gray-900 dark:text-neutral-100">{title}</h3>
      {children}
    </section>
  )
}

// A plain browser window around a screenshot, with the site's address in the bar.
function BrowserFrame({ url, className = '', children }) {
  return (
    <div className={`overflow-hidden rounded-xl bg-white shadow-[0_10px_28px_-14px_rgb(0_0_0/0.3)] ring-1 ring-black/10 dark:bg-neutral-800 dark:ring-white/10 ${className}`}>
      <div aria-hidden="true" className="flex items-center gap-3 border-b border-black/5 bg-gray-100 px-3 py-2 dark:border-white/10 dark:bg-neutral-800">
        <span className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-[#febc2e]" />
          <span className="size-2.5 rounded-full bg-[#28c840]" />
        </span>
        <span className="min-w-0 flex-1 truncate rounded-md bg-white px-2 py-0.5 text-center text-[11px] text-gray-500 dark:bg-neutral-900 dark:text-neutral-400">
          {url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
        </span>
      </div>
      {children}
    </div>
  )
}

function TechList({ tech }) {
  return (
    <ul aria-label="Tech stack" className="flex flex-wrap gap-1.5">
      {tech.map((item) => (
        <li key={item} className="rounded-full bg-gray-200/70 px-2.5 py-0.5 text-xs font-medium text-gray-700 dark:bg-neutral-800 dark:text-neutral-300">
          {item}
        </li>
      ))}
    </ul>
  )
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="mt-0.5 size-4 shrink-0 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  )
}

function ExternalIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
    </svg>
  )
}

function OpenButton({ project, prominent = false }) {
  return (
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open ${project.name}`}
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 ${
        prominent
          ? 'bg-blue-600 px-4 py-1.5 text-sm text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500'
          : 'bg-white px-3 py-1 text-xs text-blue-600 ring-1 ring-black/10 hover:bg-gray-50 dark:bg-neutral-800 dark:text-blue-400 dark:ring-white/10 dark:hover:bg-neutral-700'
      }`}
    >
      {prominent ? 'Visit site' : 'Open'}
      <ExternalIcon />
    </a>
  )
}
