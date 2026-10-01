# Projects App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an App Store–style "Projects" app that lists three Permata Indonesia team projects, each with a detail page and an "Open" button to the live site, on desktop and mobile.

**Architecture:** Project records live in `src/data/projects.js` (with screenshot imports from `src/assets/projects/`). `src/apps/ProjectsApp.jsx` is a self-contained component that switches between a list view and a detail view with local `selectedId` state, and owns its own scroll container. It is registered in `src/data/apps.js` as a Dock app, so the existing Desktop (Window) and mobile (HomeScreen/AppSheet) shells render it with no changes to those shells.

**Tech Stack:** React 19, Tailwind CSS v4, Vite 8, Vitest 4 + Testing Library (jsdom). Screenshots captured with `puppeteer-core` driving the installed Google Chrome, run from the scratchpad (not a project dependency).

**Spec:** `docs/superpowers/specs/2026-10-01-projects-app-design.md`

## Global Constraints

- Site copy is in English; copy must match the spec's Content section verbatim.
- App title is "Projects". No Apple names or logos; no official Permata Indonesia logos as project icons (initials icons PJ / PI / PB only).
- Team size and years are not shown anywhere.
- Screenshots only of public, logged-out pages. The Business simulation page is not captured.
- Every external link uses `target="_blank" rel="noopener noreferrer"`.
- No new runtime or dev dependencies in `package.json`.
- Commits end with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

1. A row's "Open" link is a sibling of the row's detail button, never nested inside it — clicking Open must only open the site, not also switch to the detail view (test in Task 3).
2. Reopening the app (closing and launching again) starts on the list, not on the last detail page (test in Task 3).
3. Moving between list and detail starts the new view at the top, even after scrolling far down a long detail page (scrollTop reset tested in Task 3, checked manually in Task 5).
4. Long project names on a 360px-wide phone truncate instead of pushing the Open button off-screen (manual check in Task 5).
5. Every screenshot listed in the data resolves to a real file with alt text naming its project (data test in Task 2; a missing file also fails the import).

---

### Task 1: Capture project screenshots

**Files:**
- Create: `src/assets/projects/job-apply-1.jpg`, `job-apply-2.jpg`
- Create: `src/assets/projects/company-profile-1.jpg` … `company-profile-4.jpg`
- Create: `src/assets/projects/business-1.jpg` … `business-3.jpg`
- Scratch (not committed): `$SCRATCH/shots/capture.mjs`

`$SCRATCH` = the session scratchpad directory.

**Interfaces:**
- Produces: the nine JPG files above, at exactly these names (Task 2 imports them).

- [ ] **Step 1: Install puppeteer-core in the scratchpad**

```bash
mkdir -p "$SCRATCH/shots" && cd "$SCRATCH/shots" && npm init -y >/dev/null && npm i puppeteer-core@24 >/dev/null
```

- [ ] **Step 2: Write the capture script**

`$SCRATCH/shots/capture.mjs`:

```js
import puppeteer from 'puppeteer-core'

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const DESKTOP = { width: 1280, height: 800, deviceScaleFactor: 1 }
const MOBILE = { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true }
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// Each target is captured once at the top, then once after each wheel scroll of one viewport.
const targets = [
  { prefix: 'raw-job-apply-desktop', url: 'https://karir.permataindonesia.com/apply', viewport: DESKTOP, scrolls: 0 },
  { prefix: 'raw-job-apply-mobile', url: 'https://karir.permataindonesia.com/apply', viewport: MOBILE, scrolls: 0 },
  { prefix: 'raw-company-profile', url: 'https://permataindonesia.com/', viewport: DESKTOP, scrolls: 8 },
  { prefix: 'raw-business', url: 'https://business.permataindonesia.com', viewport: DESKTOP, scrolls: 5 },
]

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true })
for (const target of targets) {
  const page = await browser.newPage()
  await page.setViewport(target.viewport)
  await page.goto(target.url, { waitUntil: 'networkidle2', timeout: 60000 })
  await sleep(6000) // let hero videos, sliders and entrance animations settle
  for (let step = 0; step <= target.scrolls; step++) {
    if (step > 0) {
      await page.mouse.move(target.viewport.width / 2, target.viewport.height / 2)
      await page.mouse.wheel({ deltaY: target.viewport.height })
      await sleep(2500)
    }
    await page.screenshot({ path: `${target.prefix}-${step}.jpg`, type: 'jpeg', quality: 80 })
  }
  await page.close()
}
await browser.close()
```

The company profile site uses full-page section snapping (dot navigation on the right), so wheel scrolling — not `window.scrollTo` — is what moves between sections.

- [ ] **Step 3: Run it**

```bash
cd "$SCRATCH/shots" && node capture.mjs && ls raw-*.jpg
```

Expected: `raw-job-apply-desktop-0.jpg`, `raw-job-apply-mobile-0.jpg`, `raw-company-profile-0..8.jpg`, `raw-business-0..5.jpg`.

- [ ] **Step 4: Look at every raw image and pick**

Open each `raw-*.jpg` with the Read tool. Choose:
- `job-apply-1.jpg` ← desktop form; `job-apply-2.jpg` ← mobile form.
- `company-profile-1..4.jpg` ← the shots showing Home (hero media loaded, not grey), Our Values, About Us, Our Service, in that order. If the hero is still grey, raise the 6000 ms wait to 12000 and rerun that target. If a section is skipped, change `scrolls`/`deltaY` and rerun.
- `business-1..3.jpg` ← the landing hero plus the two most representative sections below it. Reject any shot that shows a login form, personal data, or the simulation page.

Reject shots with cookie banners covering content or half-finished animations; rerun if needed.

- [ ] **Step 5: Copy the picks into the project and check size**

```bash
mkdir -p src/assets/projects
cp "$SCRATCH/shots/raw-job-apply-desktop-0.jpg" src/assets/projects/job-apply-1.jpg
cp "$SCRATCH/shots/raw-job-apply-mobile-0.jpg" src/assets/projects/job-apply-2.jpg
# …one cp per pick from Step 4, using the raw file numbers chosen there
ls -la src/assets/projects && du -ch src/assets/projects/*.jpg | tail -1
```

Expected: nine files, each under ~400 KB. If one is larger, recompress with `sips -s formatOptions 70 <file>`.

- [ ] **Step 6: Commit**

```bash
git add src/assets/projects
git commit -m "feat: add screenshots of the Permata Indonesia projects

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Project data

**Files:**
- Create: `src/data/projects.js`
- Test: `src/data/data.test.js` (add a `projects` block)

**Interfaces:**
- Consumes: the nine JPGs from Task 1.
- Produces: `export const projects: Array<{ id: string, name: string, subtitle: string, url: string, initials: string, description: string, role: string[], tech: string[], screenshots: Array<{ src: string, alt: string }> }>` in this order: `job-apply`, `company-profile`, `business`.

- [ ] **Step 1: Write the failing test**

Add to the imports of `src/data/data.test.js`:

```js
import { projects } from './projects'
```

Append at the end of the file:

```js
describe('projects', () => {
  it('lists the Permata Indonesia projects with their live links', () => {
    expect(projects.map((project) => [project.id, project.name, project.url, project.initials])).toEqual([
      ['job-apply', 'Permata Job Apply', 'https://karir.permataindonesia.com/apply', 'PJ'],
      ['company-profile', 'Permata Indonesia Company Profile', 'https://permataindonesia.com/', 'PI'],
      ['business', 'Permata Indonesia Business', 'https://business.permataindonesia.com', 'PB'],
    ])
  })

  it('gives every project its copy, tech stack and screenshots', () => {
    for (const project of projects) {
      expect(project.subtitle).toBeTruthy()
      expect(project.description).toBeTruthy()
      expect(project.role.length).toBeGreaterThan(0)
      expect(project.tech).toEqual(['React', 'SCSS'])
      expect(project.screenshots.length).toBeGreaterThan(0)
      for (const shot of project.screenshots) {
        expect(shot.src).toBeTruthy()
        expect(shot.alt).toContain(project.name)
      }
    }
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run src/data/data.test.js`
Expected: FAIL — cannot resolve `./projects`.

- [ ] **Step 3: Write the data**

`src/data/projects.js`:

```js
import business1 from '../assets/projects/business-1.jpg'
import business2 from '../assets/projects/business-2.jpg'
import business3 from '../assets/projects/business-3.jpg'
import companyProfile1 from '../assets/projects/company-profile-1.jpg'
import companyProfile2 from '../assets/projects/company-profile-2.jpg'
import companyProfile3 from '../assets/projects/company-profile-3.jpg'
import companyProfile4 from '../assets/projects/company-profile-4.jpg'
import jobApply1 from '../assets/projects/job-apply-1.jpg'
import jobApply2 from '../assets/projects/job-apply-2.jpg'

export const projects = [
  {
    id: 'job-apply',
    name: 'Permata Job Apply',
    subtitle: 'Apply for jobs straight from social media links',
    url: 'https://karir.permataindonesia.com/apply',
    initials: 'PJ',
    description:
      'The job application page Permata Indonesia shares on social media, where job seekers fill in their details and apply for an open position.',
    role: [
      'Sliced the application page from design into React components styled with SCSS.',
      'Wired the form to the backend API so applications are submitted.',
    ],
    tech: ['React', 'SCSS'],
    screenshots: [
      { src: jobApply1, alt: 'Permata Job Apply – application form on desktop' },
      { src: jobApply2, alt: 'Permata Job Apply – application form on mobile' },
    ],
  },
  {
    id: 'company-profile',
    name: 'Permata Indonesia Company Profile',
    subtitle: 'Who Permata Indonesia is and what it offers',
    url: 'https://permataindonesia.com/',
    initials: 'PI',
    description:
      'The public company profile of Permata Indonesia, introducing the company, its values and its HR services.',
    role: [
      'Sliced several sections of the site from design into React and SCSS: Home, Our Values, About Us and Our Service.',
    ],
    tech: ['React', 'SCSS'],
    screenshots: [
      { src: companyProfile1, alt: 'Permata Indonesia Company Profile – Home section' },
      { src: companyProfile2, alt: 'Permata Indonesia Company Profile – Our Values section' },
      { src: companyProfile3, alt: 'Permata Indonesia Company Profile – About Us section' },
      { src: companyProfile4, alt: 'Permata Indonesia Company Profile – Our Service section' },
    ],
  },
  {
    id: 'business',
    name: 'Permata Indonesia Business',
    subtitle: 'HR services portal for business clients',
    url: 'https://business.permataindonesia.com',
    initials: 'PB',
    description:
      "A site for Permata Indonesia's business clients, with a client dashboard and an outsourcing service simulation.",
    role: [
      'Sliced the landing page from design into React components styled with SCSS.',
      'Wired the page to the backend API.',
    ],
    tech: ['React', 'SCSS'],
    screenshots: [
      { src: business1, alt: 'Permata Indonesia Business – landing page' },
      { src: business2, alt: 'Permata Indonesia Business – landing page section 2' },
      { src: business3, alt: 'Permata Indonesia Business – landing page section 3' },
    ],
  },
]
```

If Task 1 picked named sections for Business, replace "section 2"/"section 3" in the alts with the section names visible in those shots.

- [ ] **Step 4: Run it to verify it passes**

Run: `npx vitest run src/data/data.test.js`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/data/projects.js src/data/data.test.js
git commit -m "feat: add Permata Indonesia project data

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: ProjectsApp component

**Files:**
- Create: `src/apps/ProjectsApp.jsx`
- Test: `src/apps/ProjectsApp.test.jsx`

**Interfaces:**
- Consumes: `projects` from `src/data/projects.js` (Task 2).
- Produces: `export default function ProjectsApp()` — no props, like the other apps.

- [ ] **Step 1: Write the failing tests**

`src/apps/ProjectsApp.test.jsx`:

```jsx
import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { projects } from '../data/projects'
import ProjectsApp from './ProjectsApp'

const list = () => screen.getByRole('list', { name: 'Projects' })
const openDetail = (name) => fireEvent.click(within(list()).getByRole('button', { name: new RegExp(name) }))

describe('ProjectsApp', () => {
  it('lists every project with its subtitle and an Open link to the live site', () => {
    render(<ProjectsApp />)
    expect(screen.getByRole('heading', { name: 'Projects' })).toBeInTheDocument()
    const rows = within(list()).getAllByRole('listitem')
    expect(rows).toHaveLength(projects.length)
    projects.forEach((project, index) => {
      const row = within(rows[index])
      expect(row.getByText(project.name)).toBeInTheDocument()
      expect(row.getByText(project.subtitle)).toBeInTheDocument()
      const link = row.getByRole('link', { name: `Open ${project.name}` })
      expect(link).toHaveAttribute('href', project.url)
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    })
  })

  it('keeps the Open link outside the row button so it never opens the detail view', () => {
    render(<ProjectsApp />)
    const link = screen.getByRole('link', { name: 'Open Permata Job Apply' })
    expect(link.closest('button')).toBeNull()
    fireEvent.click(link)
    expect(list()).toBeInTheDocument()
  })

  it('opens a project detail with its description, role, tech stack and screenshots', () => {
    render(<ProjectsApp />)
    openDetail('Permata Indonesia Company Profile')
    const project = projects.find((item) => item.id === 'company-profile')
    const detail = screen.getByRole('article', { name: project.name })
    expect(within(detail).getByRole('heading', { name: project.name })).toBeInTheDocument()
    expect(within(detail).getByRole('link', { name: `Open ${project.name}` })).toHaveAttribute('href', project.url)
    expect(within(detail).getByText(project.description)).toBeInTheDocument()
    const role = within(within(detail).getByRole('region', { name: 'My Role' })).getAllByRole('listitem')
    expect(role.map((item) => item.textContent)).toEqual(project.role)
    const tech = within(within(detail).getByRole('list', { name: 'Tech stack' })).getAllByRole('listitem')
    expect(tech.map((item) => item.textContent)).toEqual(['React', 'SCSS'])
    const shots = within(within(detail).getByRole('list', { name: 'Screenshots' })).getAllByRole('img')
    expect(shots.map((img) => img.getAttribute('alt'))).toEqual(project.screenshots.map((shot) => shot.alt))
    for (const img of shots) expect(img).toHaveAttribute('loading', 'lazy')
  })

  it('goes back to the list from the detail view', () => {
    render(<ProjectsApp />)
    openDetail('Permata Job Apply')
    fireEvent.click(screen.getByRole('button', { name: '‹ Projects' }))
    expect(within(list()).getAllByRole('listitem')).toHaveLength(projects.length)
    expect(screen.queryByRole('article')).not.toBeInTheDocument()
  })

  it('scrolls back to the top when switching views', () => {
    const { container } = render(<ProjectsApp />)
    const scroller = container.firstChild
    scroller.scrollTop = 300
    openDetail('Permata Indonesia Business')
    expect(scroller.scrollTop).toBe(0)
    scroller.scrollTop = 300
    fireEvent.click(screen.getByRole('button', { name: '‹ Projects' }))
    expect(scroller.scrollTop).toBe(0)
  })

  it('starts on the list again when reopened', () => {
    const { unmount } = render(<ProjectsApp />)
    openDetail('Permata Job Apply')
    unmount()
    render(<ProjectsApp />)
    expect(list()).toBeInTheDocument()
    expect(screen.queryByRole('article')).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run them to verify they fail**

Run: `npx vitest run src/apps/ProjectsApp.test.jsx`
Expected: FAIL — cannot resolve `./ProjectsApp`.

- [ ] **Step 3: Write the component**

`src/apps/ProjectsApp.jsx`:

```jsx
import { useEffect, useRef, useState } from 'react'
import { projects } from '../data/projects'

export default function ProjectsApp() {
  const [selectedId, setSelectedId] = useState(null)
  const scrollerRef = useRef(null)
  const selected = projects.find((project) => project.id === selectedId)

  useEffect(() => {
    if (scrollerRef.current) scrollerRef.current.scrollTop = 0
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
              onClick={() => onSelect(project.id)}
              className="flex min-w-0 flex-1 items-center gap-3 rounded-lg text-left focus-visible:outline-2 focus-visible:outline-blue-500"
            >
              <ProjectIcon initials={project.initials} className="size-14 text-lg" />
              <span className="min-w-0">
                <span className="block truncate font-semibold">{project.name}</span>
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
      <button type="button" onClick={onBack} className="text-sm text-blue-600 hover:underline">
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
      <ul aria-label="Screenshots" className="-mx-6 mt-6 flex snap-x gap-3 overflow-x-auto px-6 pb-2">
        {project.screenshots.map((shot) => (
          <li key={shot.src} className="shrink-0 snap-start">
            <img
              src={shot.src}
              alt={shot.alt}
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
```

- [ ] **Step 4: Run them to verify they pass**

Run: `npx vitest run src/apps/ProjectsApp.test.jsx`
Expected: PASS (6 tests). If the scrollTop test fails because jsdom ignores the setter, keep the effect and replace that test's assertions with a spy: `const spy = vi.spyOn(scroller, 'scrollTop', 'set')` before each switch and `expect(spy).toHaveBeenCalledWith(0)` after it (import `vi` from vitest).

- [ ] **Step 5: Lint**

Run: `npx oxlint src/apps/ProjectsApp.jsx src/apps/ProjectsApp.test.jsx`
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add src/apps/ProjectsApp.jsx src/apps/ProjectsApp.test.jsx
git commit -m "feat: add App Store–style Projects app with list and detail views

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Register the app on desktop and mobile

**Files:**
- Modify: `src/data/apps.js` (insert after the `photos` entry)
- Modify: `src/components/AppIcon.jsx` (add `projects` to `ICONS`, after `photos`)
- Test: `src/data/apps.test.js`, `src/components/AppIcon.test.jsx`, `src/components/mobile/HomeScreen.test.jsx`, `src/components/desktop/Desktop.test.jsx`

**Interfaces:**
- Consumes: `ProjectsApp` default export (Task 3).
- Produces: app id `projects`, title `Projects`, placement `dock`. Mobile grid order becomes Photos, Projects, Experience, GitHub, LinkedIn, Instagram.

- [ ] **Step 1: Update the tests first**

`src/data/apps.test.js` — in "registers the apps in dock order", insert `['projects', 'Projects'],` after `['photos', 'Photos'],`. In "places Resume and Work Experience on the desktop…", insert `['projects', 'dock'],` after `['photos', 'dock'],`.

`src/components/AppIcon.test.jsx` — change the `it.each` list to:

```js
['about', 'resume', 'contact', 'music', 'photos', 'projects', 'experience', 'github', 'linkedin', 'instagram']
```

`src/components/mobile/HomeScreen.test.jsx` — replace the test "shows Experience, GitHub, LinkedIn and Instagram after Photos, …" with:

```jsx
  it('shows Projects, Experience, GitHub, LinkedIn and Instagram after Photos, with GitHub as a link that opens a new tab without adding history', () => {
    const pushState = vi.spyOn(window.history, 'pushState')
    render(<HomeScreen />)
    const items = within(screen.getByRole('list', { name: 'Apps' })).getAllByRole('listitem')
    expect(items.map((item) => item.textContent)).toEqual(['Photos', 'Projects', 'Experience', 'GitHub', 'LinkedIn', 'Instagram'])
    const link = within(items[3]).getByRole('link', { name: 'GitHub' })
    expect(link).toHaveAttribute('href', 'https://github.com/Dwinatasarijuwita')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    fireEvent.click(link)
    expect(pushState).not.toHaveBeenCalled()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('opens Projects from the home screen grid', () => {
    render(<HomeScreen />)
    fireEvent.click(within(screen.getByRole('list', { name: 'Apps' })).getByRole('button', { name: 'Projects' }))
    const sheet = screen.getByRole('dialog', { name: 'Projects' })
    expect(within(sheet).getByRole('list', { name: 'Projects' })).toBeInTheDocument()
  })
```

`src/components/desktop/Desktop.test.jsx` — after "opens Photos from the Dock", add:

```jsx
  it('opens Projects from the Dock', () => {
    render(<Desktop />)
    openFromDock('Projects')
    const win = screen.getByRole('dialog', { name: 'Projects' })
    expect(within(win).getByRole('list', { name: 'Projects' })).toBeInTheDocument()
  })
```

- [ ] **Step 2: Run them to verify they fail**

Run: `npx vitest run src/data/apps.test.js src/components/AppIcon.test.jsx src/components/mobile/HomeScreen.test.jsx src/components/desktop/Desktop.test.jsx`
Expected: FAIL — `projects` missing from the registry; AppIcon throws reading `background` of undefined.

- [ ] **Step 3: Add the icon**

In `src/components/AppIcon.jsx`, add after the `photos` entry:

```jsx
  projects: {
    background: 'linear-gradient(180deg, #38bdf8, #1d4ed8)',
    glyph: (
      <>
        <rect x="4" y="9" width="16" height="11" rx="2" />
        <path d="M6 6h12M8 3h8" />
      </>
    ),
  },
```

(A stack of cards: one full card with two shorter cards peeking behind it. Not Apple's App Store "A" mark.)

- [ ] **Step 4: Register the app**

In `src/data/apps.js`, add `import ProjectsApp from '../apps/ProjectsApp'` (alphabetical, after `PhotosApp`), and insert after the `photos` entry:

```js
  {
    id: 'projects',
    placement: 'dock',
    title: 'Projects',
    Component: ProjectsApp,
    size: { width: 760, height: 560 },
    initialPosition: { x: 200, y: 44 },
  },
```

- [ ] **Step 5: Run the full suite and lint**

Run: `npm test && npm run lint`
Expected: all tests pass (126 before this plan, plus the new ones); lint clean.

- [ ] **Step 6: Commit**

```bash
git add src/data/apps.js src/components/AppIcon.jsx src/data/apps.test.js src/components/AppIcon.test.jsx src/components/mobile/HomeScreen.test.jsx src/components/desktop/Desktop.test.jsx
git commit -m "feat: add Projects app to the Dock and the mobile home screen

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: Check it in the real app

**Files:** none unless a defect is found (fix it in the file that owns it, add a test where one can catch it, commit as `fix: …`).

- [ ] **Step 1: Build and serve**

Run: `npm run build && npx vite preview --port 4173` (in the background).
Expected: build succeeds; preview serves on http://localhost:4173.

- [ ] **Step 2: Capture desktop and mobile views**

Reuse the scratchpad puppeteer-core install from Task 1. Script `$SCRATCH/shots/check.mjs` that, at 1440×900 then at 360×780 (`isMobile: true, hasTouch: true`), opens http://localhost:4173, launches Projects (desktop: click the Dock button with `aria-label="Projects"`; mobile: tap the grid button named Projects), screenshots the list, clicks the first row button, screenshots the detail, scrolls the detail container to the bottom and screenshots, clicks "‹ Projects", screenshots.

- [ ] **Step 3: Review each screenshot with the Read tool**

Check, and fix anything that fails:
- List rows: icon, name, subtitle, Open pill aligned; at 360px wide, the longest name ("Permata Indonesia Company Profile") truncates with an ellipsis and the Open pill stays fully visible.
- Detail: header, screenshot strip scrolls horizontally, sections readable; no horizontal page scroll at 360px.
- After "‹ Projects", the list shows from the top.
- The mobile sheet's "‹ Back" still closes the app.

- [ ] **Step 4: Stop the preview server and report**

Stop the background preview process. Report results with the screenshots' observations; commit only if Step 3 required fixes.
