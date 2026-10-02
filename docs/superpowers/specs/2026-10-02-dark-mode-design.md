# Dark Mode and Settings App — Design

Date: 2026-10-02

## Goal

Let visitors switch the portfolio between light and dark appearance from a new "Settings" app, modelled on the Appearance pane of macOS System Settings. Three choices: Light, Dark and Auto (follow the visitor's device). Every part of the site (desktop shell, mobile home screen and all apps) has a dark look.

## Constraints

- No Apple artwork: the Settings icon is our own gear drawing in the style of System Settings.
- Site copy is in English.
- No new dependencies: Tailwind CSS v4 `dark:` variants, driven by a `dark` class on `<html>`.
- Default for a new visitor is Auto.
- Text contrast in dark mode is at least 4.5:1, so small grey text uses `neutral-400` or lighter, never `neutral-500`, on dark surfaces.
- Not themed: app icons, photos, project screenshots, and the Resume PDF (the browser's PDF viewer draws it; the site cannot darken it).

## Settings app

### Icon and placement

- Silver-grey gradient tile with a gear glyph, drawn by us.
- Desktop: in the Dock after Instagram, before the Trash divider.
- Mobile: in the home screen grid, before Trash.
- Registered in `src/data/apps.js` as `id: 'settings'`, title "Settings", placed before `trash`. Window about 560×360.

### Window content

```
┌────────────────────────────────────────────────┐
│ ● ● ●              Settings                    │
├────────────────────────────────────────────────┤
│  Appearance                                    │
│   ┌────────┐    ┌────────┐    ┌────────┐       │
│   │ light  │    │  dark  │    │ half/half │    │
│   └────────┘    └────────┘    └────────┘       │
│     Light          Dark          Auto          │
│  Auto switches between light and dark to       │
│  match your device.                            │
└────────────────────────────────────────────────┘
```

- Heading "Appearance".
- Three cards, each with a mini window preview drawn in CSS: light, dark, and half light / half dark for Auto. The label sits below each card.
- The selected card has a blue ring and a bold label.
- Choosing a card applies the theme at once; there is no Save button.
- Caption below: "Auto switches between light and dark to match your device."
- No sidebar: there is only one pane.
- On phones the three cards stay in one row and shrink.
- Accessibility: a radio group named "Appearance". Each card is a radio ("Light", "Dark", "Auto"), arrow keys move between them, and the checked radio is the current preference.

## Theme mechanics

### `src/lib/theme.js`

- `THEME_STORAGE_KEY = 'theme'`, `THEME_PREFERENCES = ['light', 'dark', 'auto']`.
- `readPreference()`: the stored value if it is one of the preferences, otherwise `'auto'`. It also returns `'auto'` when `localStorage` throws.
- `writePreference(preference)`: stores it and silently ignores storage errors.
- `resolveTheme(preference, systemDark)`: `'light'` or `'dark'`; `'auto'` follows `systemDark`.
- `applyTheme(theme)`: toggles the `dark` class on `document.documentElement` and sets its `style.colorScheme` to the theme.

### `ThemeProvider` and `useTheme()`

- Mounted once around the router in `src/main.jsx`, so the theme applies even if Settings is never opened.
- `useTheme()` returns `{ preference, setPreference }`. `setPreference` stores the choice and applies it.
- While the preference is Auto, the provider listens to `matchMedia('(prefers-color-scheme: dark)')` changes and re-applies the theme without a reload.

### No flash on load

- An inline script in `index.html`'s `<head>` reads `localStorage['theme']`, resolves it the same way (Auto or invalid → system), and sets the `dark` class and `color-scheme` before first paint. It is wrapped in try/catch.
- A test reads `index.html` and checks that the script uses the same storage key and preference values as `theme.js`.

### CSS (`src/index.css`)

- `@custom-variant dark (&:where(.dark, .dark *));`
- Scrollbar thumb in dark mode: `rgb(255 255 255 / 0.25)`, hover `0.4`; Firefox `scrollbar-color` likewise.

### Wallpaper

- The same wallpaper, with a `bg-black/35` overlay that only shows in dark mode, on the desktop (`Desktop.jsx`) and on the mobile home screen (`HomeScreen.jsx`).

### Failure handling

- `localStorage` blocked or holding junk: the site runs and uses Auto. A choice made in that state applies for the session but isn't saved.

## Dark palette

| Light | Dark | Used for |
|---|---|---|
| `bg-white` | `dark:bg-neutral-900` | window and app backgrounds |
| `bg-gray-50`, `bg-gray-100` | `dark:bg-neutral-800` | sidebars, toolbars, title bars |
| `bg-gray-200` | `dark:bg-neutral-700` | selected rows, badges, hover |
| `text-gray-900`, `text-gray-800` | `dark:text-neutral-100` | primary text |
| `text-gray-600`, `text-gray-700` | `dark:text-neutral-300` | body text |
| `text-gray-400`, `text-gray-500` | `dark:text-neutral-400` | secondary text |
| `border-gray-*`, `divide-gray-*` | `dark:border-white/10`, `dark:divide-white/10` | separators |
| `text-blue-600` | `dark:text-blue-400` | links, text buttons |
| glass `bg-white/25`–`bg-white/30` (menu bar, Dock, mobile dock and greeting) | `dark:bg-black/30`, white text | translucent chrome |
| amber badge `bg-amber-100 text-amber-800` | `dark:bg-amber-400/15 dark:text-amber-300` | Trash "Not yet" |

Hover shades follow the same mapping one step lighter (for example `hover:bg-gray-50` → `dark:hover:bg-neutral-800`). Coloured fills such as blue buttons stay as they are.

## Scope of restyling

1. Theme foundation: `theme.js`, `ThemeProvider`, the inline script, CSS.
2. Settings app and its icon.
3. Shell: `Window`, `Dock`, `MenuBar`, `DesktopIcons`, `AppSheet`, `HomeScreen`, `NotFound`, wallpaper overlay.
4. Apps: About, Contact, Music, Photos, Projects, Experience, Resume, Trash.

## Testing

- `theme.js`: preference read/write (valid, invalid and throwing storage), `resolveTheme` for all six combinations, and `applyTheme` toggling the class and `colorScheme`.
- `ThemeProvider`: applies the stored preference on mount, `setPreference` applies and stores it, and under Auto a system change re-applies the theme. Under Light or Dark it is ignored. The shared `src/test/matchMedia.js` helper gains a controllable `prefers-color-scheme` value.
- Settings app: radio group "Appearance" with three radios, the current preference checked, and choosing one updates the theme.
- `index.html` script matches `theme.js` (key and values).
- Guard test: scans `src/**/*.jsx` (not tests). Any `className` string literal or template containing a light background (`bg-white` without opacity, `bg-gray-50|100|200`) must also contain a `dark:bg-` class, and one containing a grey text class (`text-gray-*`) must also contain a `dark:text-` class. Failures are listed by file name.
- Manual: screenshots of every app in light and dark at 1440×900 and 390×844, each one viewed.
