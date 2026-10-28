# Projects App — Design

Date: 2026-10-01

## Goal

Add a "Projects" app to the macOS-style portfolio that lists the team projects Dwi Natasari Juwita worked on at Permata Indonesia, presented like the Mac App Store: a list of projects, each with a detail page and an "Open" button that opens the live website. It appears on desktop (Dock) and on mobile (home screen grid).

## Constraints

- Only public pages are shown. Screenshots are taken of public, logged-out pages only.
- The projects are team work; copy describes only the owner's own contribution. Team size and years are not shown.
- No Apple branding: the app is titled "Projects" with its own icon; only the layout is App Store–inspired.
- No official company logos for project icons; each project uses a generated initials icon.
- Site copy is in English.

## Layout

### List view

- Large title "Projects" and the caption "Team projects I've worked on at Permata Indonesia."
- One row per project: rounded-square icon, name (bold), one-line grey subtitle, and a pill "Open" button on the right (light grey background, blue text).
- The Open button opens the project URL in a new tab. Clicking anywhere else on the row opens the detail view.

### Detail view

- "‹ Projects" link at the top returns to the list.
- Header: large icon, name, subtitle, blue "Open" button with a small ↗ glyph.
- Screenshot gallery: horizontally scrollable strip, rounded corners. No zoom/lightbox.
- Sections: "Description" (paragraph), "My Role" (bullets), "Tech Stack" (small tags).
- Switching between list and detail scrolls the content back to the top.

### Desktop

- Dock app, window about 760×560.

### Mobile

- Appears in the home screen grid (the mobile dock keeps its current four apps).
- Same content in a single column inside the existing AppSheet. The sheet's "‹ Back" closes the app; the in-content "‹ Projects" link returns from detail to list.

## Content

| id | Name | Subtitle | URL | Icon |
|---|---|---|---|---|
| `job-apply` | Permata Job Apply | Apply for jobs straight from social media links | https://karir.permataindonesia.com/apply | PJ |
| `company-profile` | Permata Indonesia Company Profile | Who Permata Indonesia is and what it offers | https://permataindonesia.com/ | PI |
| `business` | Permata Indonesia Business | HR services portal for business clients | https://business.permataindonesia.com | PB |

All three: Tech Stack `React`, `SCSS`. Icons are blue gradients with white initials.

**Permata Job Apply**
- Description: The job application page Permata Indonesia shares on social media, where job seekers fill in their details and apply for an open position.
- My Role: Sliced the application page from design into React components styled with SCSS. / Wired the form to the backend API so applications are submitted.

**Permata Indonesia Company Profile**
- Description: The public company profile of Permata Indonesia, introducing the company, its values and its HR services.
- My Role: Sliced several sections of the site from design into React and SCSS: Home, Our Values, About Us and Our Service.

**Permata Indonesia Business**
- Description: A site for Permata Indonesia's business clients, with a client dashboard and an outsourcing service simulation.
- My Role: Sliced the landing page from design into React components styled with SCSS. / Wired the page to the backend API.

## Screenshots

Captured with headless Google Chrome, JPG, about 1280px wide, stored in `src/assets/projects/`:

- Job Apply: desktop form view, plus one mobile-width capture.
- Company Profile: the Home, Our Values, About Us and Our Service sections (wait for the hero media to load).
- Business: top of the landing page plus one or two sections below it. The simulation page is not captured.

## Code structure

New:
- `src/data/projects.js` — project records: `id`, `name`, `subtitle`, `url`, `description`, `role[]`, `tech[]`, `initials`, `screenshots[]` (`{ src, alt }`).
- `src/apps/ProjectsApp.jsx` — holds `selectedId` state; `null` renders the list, an id renders the detail. Internal components: `ProjectRow`, `ProjectDetail`, `ProjectIcon`, `OpenButton`.
- `src/apps/ProjectsApp.test.jsx`
- `src/assets/projects/*.jpg`

Changed:
- `src/data/apps.js` — add the `projects` dock entry.
- `src/components/AppIcon.jsx` — "Projects" icon: blue gradient with a stacked-cards glyph.
- Registry and data tests (`apps.test.js`, `data.test.js`, `HomeScreen.test.jsx`) updated for the new app.

Details:
- Open links use `target="_blank" rel="noopener noreferrer"`.
- Screenshots use `loading="lazy"` and alt text such as "Permata Job Apply screenshot 1".

## Testing

- List view renders three projects, each with an Open link to the correct URL that opens in a new tab.
- Clicking a row opens its detail view; "‹ Projects" returns to the list.
- Detail view shows the description, role bullets and tech tags.
- Project data is valid: required fields present, URLs use https, every project has at least one screenshot.
- Manual check in the browser at desktop and mobile widths.
