# Portofolio Bergaya macOS — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mengganti portofolio satu-halaman yang ada dengan desktop macOS (jendela, Dock, menu bar) di layar ≥ 768px dan home screen iPhone di layar < 768px, berisi 4 aplikasi: About Me, Resume, Contact, Music Favorite.

**Architecture:** `src/data/apps.js` adalah satu-satunya daftar aplikasi; desktop, Dock, dan home screen membacanya. State jendela dikelola oleh reducer murni (`windowReducer`) yang dibungkus hook `useWindowManager`. Komponen isi di `src/apps/` tidak tahu apakah tampil di `Window` (desktop) atau `AppSheet` (HP). Semua animasi dan fitur geser memakai Motion.

**Tech Stack:** React 19, Vite 8, JavaScript (`.js`/`.jsx`), Tailwind CSS v4, React Router 7, Motion 13 (`motion/react`), Vitest 5 + React Testing Library 16 + jsdom.

**Spec:** `docs/superpowers/specs/2026-09-30-macos-portfolio-design.md`

## Global Constraints

- Bahasa: JavaScript saja (`.js` / `.jsx`), tanpa TypeScript.
- Breakpoint HP: media query `(max-width: 767px)` → tampilan iPhone; selain itu tampilan desktop.
- Animasi dan drag hanya memakai paket `motion` (import dari `motion/react`). Jangan memasang `react-draggable` atau `framer-motion`.
- Tailwind v4: gradien memakai `bg-linear-to-*` (bukan `bg-gradient-to-*`). Tidak ada `tailwind.config.js`.
- Teks antarmuka berbahasa Indonesia, kecuali nama aplikasi: `About Me`, `Resume`, `Contact`, `Music Favorite`, dan `Finder`.
- Email: `tasyakstr@gmail.com`. Nama: `Dwi Natasari Juwita`. Inisial avatar: `DJ`.
- CV disajikan dari `public/resume.pdf`; nama file saat diunduh: `Dwi Natasari Juwita - CV.pdf`.
- Lagu: tanpa cover album asli dan tanpa komentar. Cover diganti kotak gradasi dengan ikon ♪.
- Jika `prefers-reduced-motion` aktif, animasi diganti fade singkat.
- Tidak termasuk: layar boot, lock screen, dark mode, resize jendela, menu dropdown, ikon di desktop, menyimpan posisi jendela.
- Syarat selesai: `npm test`, `npm run lint`, dan `npm run build` lolos.

## Review Focus

1. **Layar laptop kecil (mis. 1280×720 atau jendela browser yang diperkecil):** jendela Resume (720×560) tidak boleh melewati area desktop. Diuji di Task 8 lewat `maxWidth: 100%` dan `maxHeight: calc(100% - 88px)`.
2. **CV belum ada di `npm run dev`:** Vite dev server mengembalikan `index.html` dengan status 200 untuk file yang tidak ada, jadi pengecekan status saja tidak cukup. Harus cek `content-type` berisi `pdf`. Diuji di Task 6.
3. **Mengetuk ikon dua kali cepat di HP:** hanya boleh menambah satu entri history. Menekan "Kembali" dua kali cepat hanya boleh memanggil `history.back()` sekali, supaya pengunjung tidak terlempar keluar dari website. Diuji di Task 9.
4. **Jam melewati pergantian menit:** menu bar harus berganti dari `14.05` ke `14.06` tanpa refresh, dan timer dibersihkan saat komponen dilepas. Diuji di Task 7.
5. **Karakter khusus di judul atau artis (mis. `&`):** URL pencarian Spotify cadangan harus di-encode dengan benar. Diuji di Task 2.

---

## File Structure

| File | Tanggung jawab |
|---|---|
| `vite.config.js` | Plugin React + Tailwind, konfigurasi Vitest |
| `src/test/setup.js` | jest-dom, cleanup, matikan animasi Motion saat tes |
| `src/test/matchMedia.js` | Mock `window.matchMedia` + `setMobile()` untuk tes |
| `src/data/profile.js` | Nama, inisial, tagline, perkenalan, fakta, email, info CV |
| `src/data/songs.js` | Daftar lagu favorit |
| `src/data/apps.js` | Daftar aplikasi (id, judul, komponen, ukuran, posisi awal) |
| `src/lib/music.js` | `songHref()`, `gradientFor()` |
| `src/lib/resume.js` | `isPdfAvailable()` |
| `src/lib/clock.js` | `formatClock()`, `formatTime()`, `msUntilNextMinute()` |
| `src/lib/wallpaper.js` | `wallpaperStyle` (gambar atau gradasi cadangan) |
| `src/hooks/useWindowManager.js` | `createInitialState`, `windowReducer`, `useWindowManager` |
| `src/hooks/useIsMobile.js` | Deteksi breakpoint HP |
| `src/hooks/useNow.js` | Waktu sekarang, diperbarui tiap pergantian menit |
| `src/components/Avatar.jsx` | Avatar inisial bergradasi |
| `src/components/AppIcon.jsx` | Ikon aplikasi SVG |
| `src/apps/AboutApp.jsx` | Isi About Me |
| `src/apps/ResumeApp.jsx` | Isi Resume (iframe di desktop, tombol di HP) |
| `src/apps/ContactApp.jsx` | Isi Contact |
| `src/apps/MusicApp.jsx` | Isi Music Favorite |
| `src/components/desktop/constants.js` | `MENU_BAR_HEIGHT`, `DOCK_HEIGHT` |
| `src/components/desktop/MenuBar.jsx` | Menu bar atas |
| `src/components/desktop/Dock.jsx` | Dock dengan efek membesar |
| `src/components/desktop/Window.jsx` | Bingkai jendela, drag, tombol lampu lalu lintas |
| `src/components/desktop/Desktop.jsx` | Merangkai wallpaper, menu bar, jendela, Dock |
| `src/components/mobile/HomeScreen.jsx` | Home screen iPhone + status bar |
| `src/components/mobile/AppSheet.jsx` | Aplikasi layar penuh di HP |
| `src/pages/Home/index.jsx` | Memilih `Desktop` atau `HomeScreen` |
| `src/pages/NotFound/index.jsx` | Halaman 404 |
| `src/routes/index.jsx` | Rute `/` dan `*` |

Dihapus: `src/components/Navbar.jsx`, `src/layouts/MainLayout.jsx`, `src/sections/`.

Tes diletakkan di samping file yang diuji (`Nama.test.jsx`).

---

### Task 1: Baseline commit, dependensi, dan infrastruktur tes

**Files:**
- Rename: `public/Dwi Natasari Juwita - cv.pdf` → `public/resume.pdf`
- Modify: `vite.config.js`, `package.json`
- Create: `src/test/matchMedia.js`, `src/test/setup.js`
- Test: `src/test/matchMedia.test.js`

**Interfaces:**
- Consumes: —
- Produces: `setMobile(value: boolean): void` dari `src/test/matchMedia.js` (dipakai tes Task 3, 6, 10). Script `npm test` (= `vitest run`). Di semua tes, `MotionGlobalConfig.skipAnimations = true` dan `window.matchMedia('(max-width: 767px)')` bernilai `false` kecuali `setMobile(true)` dipanggil. Query lain (mis. reduced motion) selalu `false`.

- [ ] **Step 1: Rename CV dan commit hasil scaffold yang belum di-commit**

```bash
mv "public/Dwi Natasari Juwita - cv.pdf" public/resume.pdf
git add .gitignore .oxlintrc.json index.html package.json package-lock.json vite.config.js public src
git commit -m "chore: scaffold Vite React app with Tailwind and React Router

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

Expected: `git status --short` kosong.

- [ ] **Step 2: Pasang dependensi**

```bash
npm install motion@^13
npm install -D vitest@^5 jsdom @testing-library/react @testing-library/dom @testing-library/jest-dom
```

- [ ] **Step 3: Tambahkan script tes di `package.json`**

Ubah blok `scripts` menjadi:

```json
  "scripts": {
    "dev": "vite",
    "build": "vite build && cp dist/index.html dist/404.html",
    "lint": "oxlint",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest"
  },
```

- [ ] **Step 4: Tulis tes yang gagal**

`src/test/matchMedia.test.js`:

```js
import { describe, expect, it, vi } from 'vitest'
import { setMobile } from './matchMedia'

describe('matchMedia mock', () => {
  it('defaults to desktop and notifies listeners when switching to mobile', () => {
    const query = window.matchMedia('(max-width: 767px)')
    expect(query.matches).toBe(false)

    const listener = vi.fn()
    query.addEventListener('change', listener)
    setMobile(true)

    expect(query.matches).toBe(true)
    expect(listener).toHaveBeenCalledWith({ matches: true })
  })

  it('resets to desktop between tests', () => {
    expect(window.matchMedia('(max-width: 767px)').matches).toBe(false)
  })

  it('never reports reduced motion', () => {
    setMobile(true)
    expect(window.matchMedia('(prefers-reduced-motion: reduce)').matches).toBe(false)
  })
})
```

- [ ] **Step 5: Jalankan dan pastikan gagal**

Run: `npx vitest run src/test/matchMedia.test.js`
Expected: FAIL. Environment masih Node (`window is not defined`) atau `./matchMedia` tidak ditemukan.

- [ ] **Step 6: Implementasi**

`vite.config.js`:

```js
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
  },
})
```

`src/test/matchMedia.js`:

```js
let mobile = false
const listeners = new Set()

function matchMedia(query) {
  const isWidthQuery = query.includes('max-width')
  return {
    media: query,
    get matches() {
      return isWidthQuery ? mobile : false
    },
    onchange: null,
    addEventListener: (_type, listener) => {
      if (isWidthQuery) listeners.add(listener)
    },
    removeEventListener: (_type, listener) => listeners.delete(listener),
    addListener: (listener) => {
      if (isWidthQuery) listeners.add(listener)
    },
    removeListener: (listener) => listeners.delete(listener),
    dispatchEvent: () => false,
  }
}

export function installMatchMedia() {
  window.matchMedia = matchMedia
}

export function setMobile(value) {
  mobile = value
  listeners.forEach((listener) => listener({ matches: value }))
}

export function resetMatchMedia() {
  mobile = false
  listeners.clear()
}
```

`src/test/setup.js`:

```js
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { MotionGlobalConfig } from 'motion/react'
import { afterEach } from 'vitest'
import { installMatchMedia, resetMatchMedia } from './matchMedia'

installMatchMedia()
MotionGlobalConfig.skipAnimations = true

afterEach(() => {
  cleanup()
  resetMatchMedia()
})
```

- [ ] **Step 7: Jalankan dan pastikan lolos**

Run: `npm test`
Expected: PASS, 3 tes.

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json vite.config.js src/test
git commit -m "chore: add Motion and Vitest test setup

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Data profil, lagu, dan helper musik

**Files:**
- Create: `src/data/profile.js`, `src/data/songs.js`, `src/lib/music.js`
- Test: `src/lib/music.test.js`, `src/data/data.test.js`

**Interfaces:**
- Consumes: —
- Produces:
  - `profile: { name, initials, tagline, intro: string[], facts: {label, value}[], email, resume: { url, downloadName } }`
  - `songs: { title: string, artist: string, url: string }[]` (url boleh `''`)
  - `songHref(song) → string`
  - `gradientFor(text: string) → string` (CSS `linear-gradient(...)`)

- [ ] **Step 1: Tulis tes yang gagal**

`src/lib/music.test.js`:

```js
import { describe, expect, it } from 'vitest'
import { gradientFor, songHref } from './music'

describe('songHref', () => {
  it('uses the song url when present', () => {
    const song = { title: 'Teh Hijau', artist: 'Tulus', url: 'https://open.spotify.com/track/4R9G7azXaZe93KTX65P9fU' }
    expect(songHref(song)).toBe('https://open.spotify.com/track/4R9G7azXaZe93KTX65P9fU')
  })

  it('falls back to an encoded Spotify search, including special characters', () => {
    const song = { title: 'Love Never Felt So Good', artist: 'Michael Jackson & Justin Timberlake', url: '' }
    expect(songHref(song)).toBe(
      'https://open.spotify.com/search/Love%20Never%20Felt%20So%20Good%20Michael%20Jackson%20%26%20Justin%20Timberlake',
    )
  })
})

describe('gradientFor', () => {
  it('returns the same gradient for the same text', () => {
    expect(gradientFor('Lost Stars')).toBe(gradientFor('Lost Stars'))
  })

  it('returns a CSS linear gradient', () => {
    expect(gradientFor('Dan Sore Itu')).toMatch(/^linear-gradient\(135deg, #[0-9a-f]{6}, #[0-9a-f]{6}\)$/)
  })
})
```

`src/data/data.test.js`:

```js
import { describe, expect, it } from 'vitest'
import { profile } from './profile'
import { songs } from './songs'

describe('profile', () => {
  it('has the contact and resume details', () => {
    expect(profile.name).toBe('Dwi Natasari Juwita')
    expect(profile.initials).toBe('DJ')
    expect(profile.email).toBe('tasyakstr@gmail.com')
    expect(profile.resume).toEqual({ url: '/resume.pdf', downloadName: 'Dwi Natasari Juwita - CV.pdf' })
  })
})

describe('songs', () => {
  it('lists the five favourite songs', () => {
    expect(songs.map((song) => song.title)).toEqual([
      'Baby Now That I Found You',
      'Lost Stars',
      'Dan Sore Itu',
      'Teh Hijau',
      'Love Never Felt So Good',
    ])
  })

  it('uses clean Spotify track links without tracking parameters', () => {
    for (const song of songs) {
      expect(song.url).toMatch(/^https:\/\/open\.spotify\.com\/track\/[A-Za-z0-9]+$/)
    }
  })
})
```

- [ ] **Step 2: Jalankan dan pastikan gagal**

Run: `npx vitest run src/lib/music.test.js src/data/data.test.js`
Expected: FAIL, modul `./music`, `./profile`, dan `./songs` tidak ditemukan.

- [ ] **Step 3: Implementasi**

`src/data/profile.js`:

```js
export const profile = {
  name: 'Dwi Natasari Juwita',
  initials: 'DJ',
  tagline: 'Tulis tagline-mu di sini',
  intro: ['Tulis perkenalanmu di sini.'],
  facts: [
    { label: 'Sedang belajar', value: '...' },
    { label: 'Hobi', value: '...' },
    { label: 'Lokasi', value: '...' },
  ],
  email: 'tasyakstr@gmail.com',
  resume: {
    url: `${import.meta.env.BASE_URL}resume.pdf`,
    downloadName: 'Dwi Natasari Juwita - CV.pdf',
  },
}
```

`src/data/songs.js`:

```js
export const songs = [
  {
    title: 'Baby Now That I Found You',
    artist: 'Ella Bright',
    url: 'https://open.spotify.com/track/3pnVh7sYDBQ9D2tkKAWnhs',
  },
  {
    title: 'Lost Stars',
    artist: 'Adam Levine',
    url: 'https://open.spotify.com/track/1Duym1lVQurgKHHSqpOWhY',
  },
  {
    title: 'Dan Sore Itu',
    artist: 'Monica Christiana',
    url: 'https://open.spotify.com/track/1yt2oBcSF7xveB4Gic5qQk',
  },
  {
    title: 'Teh Hijau',
    artist: 'Tulus',
    url: 'https://open.spotify.com/track/4R9G7azXaZe93KTX65P9fU',
  },
  {
    title: 'Love Never Felt So Good',
    artist: 'Michael Jackson & Justin Timberlake',
    url: 'https://open.spotify.com/track/48td6xvpokdYwvbl3JIiXP',
  },
]
```

`src/lib/music.js`:

```js
const GRADIENTS = [
  ['#fb7185', '#e11d48'],
  ['#fbbf24', '#ea580c'],
  ['#34d399', '#0d9488'],
  ['#60a5fa', '#4f46e5'],
  ['#c084fc', '#9333ea'],
  ['#f472b6', '#db2777'],
]

export function songHref(song) {
  if (song.url) return song.url
  const query = encodeURIComponent(`${song.title} ${song.artist}`)
  return `https://open.spotify.com/search/${query}`
}

export function gradientFor(text) {
  let hash = 0
  for (const char of text) hash = (hash * 31 + char.codePointAt(0)) >>> 0
  const [from, to] = GRADIENTS[hash % GRADIENTS.length]
  return `linear-gradient(135deg, ${from}, ${to})`
}
```

- [ ] **Step 4: Jalankan dan pastikan lolos**

Run: `npx vitest run src/lib/music.test.js src/data/data.test.js`
Expected: PASS, 7 tes.

- [ ] **Step 5: Commit**

```bash
git add src/data src/lib
git commit -m "feat: add profile, songs data and music helpers

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: Hook `useWindowManager` dan `useIsMobile`

**Files:**
- Create: `src/hooks/useWindowManager.js`, `src/hooks/useIsMobile.js`
- Test: `src/hooks/useWindowManager.test.js`, `src/hooks/useIsMobile.test.js`

**Interfaces:**
- Consumes: `setMobile` (Task 1, khusus tes)
- Produces:
  - `createInitialState(apps: {id, initialPosition: {x, y}}[]) → State`
  - `windowReducer(state, action) → State`, dengan action `{type: 'open'|'close'|'minimize'|'toggleMaximize'|'focus', id}` atau `{type: 'move', id, position: {x, y}}`
  - `State = { windows: Record<id, WindowState>, activeId: string|null, topZ: number, initialPositions: Record<id, {x, y}> }`
  - `WindowState = { isOpen, isMinimized, isMaximized, position: {x, y}, zIndex }`
  - `useWindowManager(apps) → { windows, activeId, open(id), close(id), minimize(id), toggleMaximize(id), focus(id), move(id, position) }`
  - `useIsMobile() → boolean`

- [ ] **Step 1: Tulis tes yang gagal**

`src/hooks/useWindowManager.test.js`:

```js
import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createInitialState, useWindowManager, windowReducer } from './useWindowManager'

const apps = [
  { id: 'a', initialPosition: { x: 10, y: 20 } },
  { id: 'b', initialPosition: { x: 50, y: 60 } },
]

const run = (...actions) => actions.reduce(windowReducer, createInitialState(apps))
const open = (id) => ({ type: 'open', id })

describe('windowReducer', () => {
  it('starts with every window closed and nothing active', () => {
    const state = run()
    expect(state.activeId).toBeNull()
    expect(state.windows.a).toEqual({
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      position: { x: 10, y: 20 },
      zIndex: 0,
    })
  })

  it('opens a window and makes it active', () => {
    const state = run(open('a'))
    expect(state.windows.a.isOpen).toBe(true)
    expect(state.activeId).toBe('a')
  })

  it('stacks the most recently opened or focused window on top', () => {
    let state = run(open('a'), open('b'))
    expect(state.windows.b.zIndex).toBeGreaterThan(state.windows.a.zIndex)
    expect(state.activeId).toBe('b')

    state = windowReducer(state, { type: 'focus', id: 'a' })
    expect(state.windows.a.zIndex).toBeGreaterThan(state.windows.b.zIndex)
    expect(state.activeId).toBe('a')
  })

  it('only focuses a window that is already open', () => {
    const state = run(open('a'), open('b'), open('a'))
    expect(state.windows.a.isOpen).toBe(true)
    expect(state.windows.b.isOpen).toBe(true)
    expect(state.activeId).toBe('a')
  })

  it('closing resets the position and hands focus to the next window', () => {
    const state = run(open('a'), { type: 'move', id: 'a', position: { x: 300, y: 400 } }, open('b'), {
      type: 'close',
      id: 'a',
    })
    expect(state.windows.a.isOpen).toBe(false)
    expect(state.windows.a.position).toEqual({ x: 10, y: 20 })
    expect(state.activeId).toBe('b')
  })

  it('closing the last window leaves nothing active', () => {
    expect(run(open('a'), { type: 'close', id: 'a' }).activeId).toBeNull()
  })

  it('minimizing keeps the window open and moves focus to the next visible window', () => {
    const state = run(open('a'), open('b'), { type: 'minimize', id: 'b' })
    expect(state.windows.b.isOpen).toBe(true)
    expect(state.windows.b.isMinimized).toBe(true)
    expect(state.activeId).toBe('a')
  })

  it('reopening a minimized window restores it at its last position', () => {
    const state = run(
      open('a'),
      { type: 'move', id: 'a', position: { x: 300, y: 400 } },
      { type: 'minimize', id: 'a' },
      open('a'),
    )
    expect(state.windows.a.isMinimized).toBe(false)
    expect(state.windows.a.position).toEqual({ x: 300, y: 400 })
    expect(state.activeId).toBe('a')
  })

  it('ignores focus on a minimized window', () => {
    const before = run(open('a'), open('b'), { type: 'minimize', id: 'a' })
    expect(windowReducer(before, { type: 'focus', id: 'a' })).toBe(before)
  })

  it('toggles maximize without losing the position', () => {
    let state = run(open('a'), { type: 'toggleMaximize', id: 'a' })
    expect(state.windows.a.isMaximized).toBe(true)
    state = windowReducer(state, { type: 'toggleMaximize', id: 'a' })
    expect(state.windows.a.isMaximized).toBe(false)
    expect(state.windows.a.position).toEqual({ x: 10, y: 20 })
  })

  it('ignores unknown window ids', () => {
    const before = run()
    expect(windowReducer(before, open('missing'))).toBe(before)
  })
})

describe('useWindowManager', () => {
  it('exposes the state and actions', () => {
    const { result } = renderHook(() => useWindowManager(apps))
    act(() => result.current.open('b'))
    expect(result.current.windows.b.isOpen).toBe(true)
    expect(result.current.activeId).toBe('b')
  })
})
```

`src/hooks/useIsMobile.test.js`:

```js
import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { setMobile } from '../test/matchMedia'
import { useIsMobile } from './useIsMobile'

describe('useIsMobile', () => {
  it('is false on desktop widths', () => {
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(false)
  })

  it('follows the viewport when it changes', () => {
    const { result } = renderHook(() => useIsMobile())
    act(() => setMobile(true))
    expect(result.current).toBe(true)
    act(() => setMobile(false))
    expect(result.current).toBe(false)
  })
})
```

- [ ] **Step 2: Jalankan dan pastikan gagal**

Run: `npx vitest run src/hooks`
Expected: FAIL, modul `./useWindowManager` dan `./useIsMobile` tidak ditemukan.

- [ ] **Step 3: Implementasi**

`src/hooks/useWindowManager.js`:

```js
import { useMemo, useReducer } from 'react'

export function createInitialState(apps) {
  const windows = {}
  const initialPositions = {}
  for (const app of apps) {
    initialPositions[app.id] = app.initialPosition
    windows[app.id] = {
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      position: app.initialPosition,
      zIndex: 0,
    }
  }
  return { windows, activeId: null, topZ: 0, initialPositions }
}

function topmostVisible(windows) {
  let best = null
  for (const [id, win] of Object.entries(windows)) {
    if (!win.isOpen || win.isMinimized) continue
    if (best === null || win.zIndex > windows[best].zIndex) best = id
  }
  return best
}

function update(state, id, changes) {
  return { ...state, windows: { ...state.windows, [id]: { ...state.windows[id], ...changes } } }
}

function bringToFront(state, id, changes = {}) {
  const topZ = state.topZ + 1
  return { ...update(state, id, { ...changes, zIndex: topZ }), topZ, activeId: id }
}

export function windowReducer(state, action) {
  const { id } = action
  const win = state.windows[id]
  if (!win) return state

  switch (action.type) {
    case 'open':
      return bringToFront(state, id, { isOpen: true, isMinimized: false })
    case 'focus':
      if (!win.isOpen || win.isMinimized || state.activeId === id) return state
      return bringToFront(state, id)
    case 'close': {
      const next = update(state, id, {
        isOpen: false,
        isMinimized: false,
        isMaximized: false,
        position: state.initialPositions[id],
        zIndex: 0,
      })
      return { ...next, activeId: topmostVisible(next.windows) }
    }
    case 'minimize': {
      const next = update(state, id, { isMinimized: true })
      return { ...next, activeId: topmostVisible(next.windows) }
    }
    case 'toggleMaximize':
      return bringToFront(state, id, { isMaximized: !win.isMaximized })
    case 'move':
      return update(state, id, { position: action.position })
    default:
      return state
  }
}

export function useWindowManager(apps) {
  const [state, dispatch] = useReducer(windowReducer, apps, createInitialState)

  const actions = useMemo(
    () => ({
      open: (id) => dispatch({ type: 'open', id }),
      close: (id) => dispatch({ type: 'close', id }),
      minimize: (id) => dispatch({ type: 'minimize', id }),
      toggleMaximize: (id) => dispatch({ type: 'toggleMaximize', id }),
      focus: (id) => dispatch({ type: 'focus', id }),
      move: (id, position) => dispatch({ type: 'move', id, position }),
    }),
    [],
  )

  return { windows: state.windows, activeId: state.activeId, ...actions }
}
```

`src/hooks/useIsMobile.js`:

```js
import { useEffect, useState } from 'react'

const MOBILE_QUERY = '(max-width: 767px)'

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.matchMedia(MOBILE_QUERY).matches)

  useEffect(() => {
    const query = window.matchMedia(MOBILE_QUERY)
    const onChange = (event) => setIsMobile(event.matches)
    query.addEventListener('change', onChange)
    setIsMobile(query.matches)
    return () => query.removeEventListener('change', onChange)
  }, [])

  return isMobile
}
```

- [ ] **Step 4: Jalankan dan pastikan lolos**

Run: `npx vitest run src/hooks`
Expected: PASS, 14 tes.

- [ ] **Step 5: Commit**

```bash
git add src/hooks
git commit -m "feat: add window manager reducer and mobile breakpoint hook

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Komponen `Avatar` dan `AppIcon`

**Files:**
- Create: `src/components/Avatar.jsx`, `src/components/AppIcon.jsx`
- Test: `src/components/Avatar.test.jsx`, `src/components/AppIcon.test.jsx`

**Interfaces:**
- Consumes: `profile` (Task 2)
- Produces:
  - `<Avatar size="sm"|"md"|"lg" />` (default `md`), `role="img"` dengan label `Avatar Dwi Natasari Juwita`
  - `<AppIcon id="about"|"resume"|"contact"|"music" className? />`, dekoratif (`aria-hidden`), mengisi ukuran dari `className`

- [ ] **Step 1: Tulis tes yang gagal**

`src/components/Avatar.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Avatar from './Avatar'

describe('Avatar', () => {
  it('shows the initials with an accessible label', () => {
    render(<Avatar />)
    const avatar = screen.getByRole('img', { name: 'Avatar Dwi Natasari Juwita' })
    expect(avatar).toHaveTextContent('DJ')
  })

  it('applies the requested size', () => {
    render(<Avatar size="lg" />)
    expect(screen.getByRole('img')).toHaveClass('size-24')
  })
})
```

`src/components/AppIcon.test.jsx`:

```jsx
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import AppIcon from './AppIcon'

describe('AppIcon', () => {
  it.each(['about', 'resume', 'contact', 'music'])('renders a decorative icon for %s', (id) => {
    const { container } = render(<AppIcon id={id} className="size-12" />)
    const icon = container.firstChild
    expect(icon).toHaveAttribute('aria-hidden', 'true')
    expect(icon).toHaveClass('size-12')
    expect(icon.style.background).toContain('linear-gradient')
    expect(icon.querySelector('svg')).not.toBeNull()
  })
})
```

- [ ] **Step 2: Jalankan dan pastikan gagal**

Run: `npx vitest run src/components/Avatar.test.jsx src/components/AppIcon.test.jsx`
Expected: FAIL, modul tidak ditemukan.

- [ ] **Step 3: Implementasi**

`src/components/Avatar.jsx`:

```jsx
import { profile } from '../data/profile'

const SIZES = {
  sm: 'size-10 text-sm',
  md: 'size-16 text-xl',
  lg: 'size-24 text-3xl',
}

export default function Avatar({ size = 'md' }) {
  return (
    <div
      role="img"
      aria-label={`Avatar ${profile.name}`}
      className={`${SIZES[size]} flex shrink-0 items-center justify-center rounded-full bg-linear-to-br from-pink-400 via-fuchsia-500 to-indigo-500 font-semibold text-white shadow-inner`}
    >
      {profile.initials}
    </div>
  )
}
```

`src/components/AppIcon.jsx`:

```jsx
const ICONS = {
  about: {
    background: 'linear-gradient(180deg, #a5b4fc, #6366f1)',
    glyph: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-6 8-6s8 2 8 6" />
      </>
    ),
  },
  resume: {
    background: 'linear-gradient(180deg, #fde68a, #f59e0b)',
    glyph: (
      <>
        <path d="M7 3h7l5 5v13H7z" />
        <path d="M14 3v5h5M10 13h6M10 17h6" />
      </>
    ),
  },
  contact: {
    background: 'linear-gradient(180deg, #7dd3fc, #0284c7)',
    glyph: (
      <>
        <rect x="3" y="6" width="18" height="12" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),
  },
  music: {
    background: 'linear-gradient(180deg, #fb7185, #e11d48)',
    glyph: (
      <>
        <path d="M9 18V6l10-2v12" />
        <circle cx="6.5" cy="18" r="2.5" />
        <circle cx="16.5" cy="16" r="2.5" />
      </>
    ),
  },
}

export default function AppIcon({ id, className = '' }) {
  const icon = ICONS[id]
  return (
    <span
      aria-hidden="true"
      className={`flex aspect-square items-center justify-center rounded-[22%] shadow-md ${className}`}
      style={{ background: icon.background }}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-3/5 w-3/5"
        fill="none"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {icon.glyph}
      </svg>
    </span>
  )
}
```

- [ ] **Step 4: Jalankan dan pastikan lolos**

Run: `npx vitest run src/components/Avatar.test.jsx src/components/AppIcon.test.jsx`
Expected: PASS, 6 tes.

- [ ] **Step 5: Commit**

```bash
git add src/components/Avatar.jsx src/components/Avatar.test.jsx src/components/AppIcon.jsx src/components/AppIcon.test.jsx
git commit -m "feat: add initials avatar and app icons

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: Aplikasi About Me dan Music Favorite

**Files:**
- Create: `src/apps/AboutApp.jsx`, `src/apps/MusicApp.jsx`
- Test: `src/apps/AboutApp.test.jsx`, `src/apps/MusicApp.test.jsx`

**Interfaces:**
- Consumes: `profile`, `songs`, `songHref`, `gradientFor` (Task 2); `Avatar` (Task 4)
- Produces: `<AboutApp />`, `<MusicApp />`, tanpa props

- [ ] **Step 1: Tulis tes yang gagal**

`src/apps/AboutApp.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import AboutApp from './AboutApp'

describe('AboutApp', () => {
  it('introduces the owner', () => {
    render(<AboutApp />)
    expect(screen.getByRole('heading', { name: 'Dwi Natasari Juwita' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Avatar Dwi Natasari Juwita' })).toBeInTheDocument()
    expect(screen.getByText('Tulis tagline-mu di sini')).toBeInTheDocument()
    expect(screen.getByText('Tulis perkenalanmu di sini.')).toBeInTheDocument()
  })

  it('lists the quick facts', () => {
    render(<AboutApp />)
    expect(screen.getByText('Sedang belajar')).toBeInTheDocument()
    expect(screen.getByText('Hobi')).toBeInTheDocument()
    expect(screen.getByText('Lokasi')).toBeInTheDocument()
  })
})
```

`src/apps/MusicApp.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import MusicApp from './MusicApp'

vi.mock('../data/songs', () => ({
  songs: [
    { title: 'Lost Stars', artist: 'Adam Levine', url: 'https://open.spotify.com/track/1Duym1lVQurgKHHSqpOWhY' },
    { title: 'Tanpa Link', artist: 'Artis & Kawan', url: '' },
  ],
}))

describe('MusicApp', () => {
  it('shows the playlist header', () => {
    render(<MusicApp />)
    expect(screen.getByRole('heading', { name: 'Lagu Favorit DJ' })).toBeInTheDocument()
    expect(screen.getByText('2 lagu')).toBeInTheDocument()
  })

  it('links each song to Spotify in a new tab', () => {
    render(<MusicApp />)
    const link = screen.getByRole('link', { name: /Lost Stars/ })
    expect(link).toHaveAttribute('href', 'https://open.spotify.com/track/1Duym1lVQurgKHHSqpOWhY')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    expect(link).toHaveTextContent('Adam Levine')
  })

  it('falls back to a Spotify search when a song has no link', () => {
    render(<MusicApp />)
    expect(screen.getByRole('link', { name: /Tanpa Link/ })).toHaveAttribute(
      'href',
      'https://open.spotify.com/search/Tanpa%20Link%20Artis%20%26%20Kawan',
    )
  })
})
```

- [ ] **Step 2: Jalankan dan pastikan gagal**

Run: `npx vitest run src/apps`
Expected: FAIL, modul `./AboutApp` dan `./MusicApp` tidak ditemukan.

- [ ] **Step 3: Implementasi**

`src/apps/AboutApp.jsx`:

```jsx
import { Fragment } from 'react'
import Avatar from '../components/Avatar'
import { profile } from '../data/profile'

export default function AboutApp() {
  return (
    <div className="flex flex-col items-center gap-5 p-6 text-center sm:flex-row sm:items-start sm:text-left">
      <Avatar size="lg" />
      <div className="min-w-0 space-y-3">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">{profile.name}</h2>
          <p className="text-sm text-gray-500">{profile.tagline}</p>
        </div>
        {profile.intro.map((paragraph) => (
          <p key={paragraph} className="text-sm leading-relaxed text-gray-700">
            {paragraph}
          </p>
        ))}
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-left text-sm">
          {profile.facts.map((fact) => (
            <Fragment key={fact.label}>
              <dt className="font-medium text-gray-900">{fact.label}</dt>
              <dd className="text-gray-600">{fact.value}</dd>
            </Fragment>
          ))}
        </dl>
      </div>
    </div>
  )
}
```

`src/apps/MusicApp.jsx`:

```jsx
import { profile } from '../data/profile'
import { songs } from '../data/songs'
import { gradientFor, songHref } from '../lib/music'

export default function MusicApp() {
  return (
    <div className="p-5">
      <header className="flex items-end gap-4">
        <div
          aria-hidden="true"
          className="flex size-28 shrink-0 items-center justify-center rounded-lg text-5xl text-white shadow-lg"
          style={{ background: gradientFor('Lagu Favorit') }}
        >
          ♪
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Playlist</p>
          <h2 className="text-2xl font-bold text-gray-900">Lagu Favorit {profile.initials}</h2>
          <p className="text-sm text-gray-500">{songs.length} lagu</p>
        </div>
      </header>

      <ol className="mt-5 divide-y divide-gray-100">
        {songs.map((song, index) => (
          <li key={`${song.title}-${song.artist}`}>
            <a
              href={songHref(song)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-md px-2 py-2 hover:bg-gray-100"
            >
              <span className="w-5 text-right text-sm text-gray-400">{index + 1}</span>
              <span
                aria-hidden="true"
                className="flex size-10 shrink-0 items-center justify-center rounded text-white"
                style={{ background: gradientFor(song.title) }}
              >
                ♪
              </span>
              <span className="min-w-0">
                <span className="block truncate font-medium text-gray-900">{song.title}</span>
                <span className="block truncate text-sm text-gray-500">{song.artist}</span>
              </span>
            </a>
          </li>
        ))}
      </ol>
    </div>
  )
}
```

- [ ] **Step 4: Jalankan dan pastikan lolos**

Run: `npx vitest run src/apps`
Expected: PASS, 5 tes.

- [ ] **Step 5: Commit**

```bash
git add src/apps
git commit -m "feat: add About Me and Music Favorite apps

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6: Aplikasi Contact dan Resume

**Files:**
- Create: `src/apps/ContactApp.jsx`, `src/apps/ResumeApp.jsx`, `src/lib/resume.js`
- Test: `src/apps/ContactApp.test.jsx`, `src/apps/ResumeApp.test.jsx`

**Interfaces:**
- Consumes: `profile` (Task 2); `Avatar` (Task 4); `useIsMobile` (Task 3); `setMobile` (Task 1, khusus tes)
- Produces: `<ContactApp />`, `<ResumeApp />`, tanpa props; `isPdfAvailable(url) → Promise<boolean>`

- [ ] **Step 1: Tulis tes yang gagal**

`src/apps/ContactApp.test.jsx`:

```jsx
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import ContactApp from './ContactApp'

function mockClipboard() {
  const writeText = vi.fn().mockResolvedValue(undefined)
  Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })
  return writeText
}

afterEach(() => {
  delete navigator.clipboard
})

describe('ContactApp', () => {
  it('links the email address with mailto', () => {
    render(<ContactApp />)
    expect(screen.getByRole('link', { name: 'tasyakstr@gmail.com' })).toHaveAttribute(
      'href',
      'mailto:tasyakstr@gmail.com',
    )
  })

  it('copies the email and confirms, then resets after 2 seconds', async () => {
    const writeText = mockClipboard()
    render(<ContactApp />)

    fireEvent.click(screen.getByRole('button', { name: 'Salin email' }))

    expect(await screen.findByRole('button', { name: 'Tersalin ✓' })).toBeInTheDocument()
    expect(writeText).toHaveBeenCalledWith('tasyakstr@gmail.com')
    await waitFor(() => expect(screen.getByRole('button', { name: 'Salin email' })).toBeInTheDocument(), {
      timeout: 3000,
    })
  })

  it('hides the copy button when the clipboard is unavailable', () => {
    render(<ContactApp />)
    expect(screen.queryByRole('button', { name: 'Salin email' })).not.toBeInTheDocument()
  })
})
```

`src/apps/ResumeApp.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { setMobile } from '../test/matchMedia'
import ResumeApp from './ResumeApp'

function stubFetch(response) {
  const fetch = vi.fn().mockResolvedValue({
    ok: response.ok,
    headers: { get: () => response.contentType },
  })
  vi.stubGlobal('fetch', fetch)
  return fetch
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('ResumeApp', () => {
  it('shows the PDF with a download button on desktop', async () => {
    const fetch = stubFetch({ ok: true, contentType: 'application/pdf' })
    render(<ResumeApp />)

    expect(await screen.findByTitle('Resume Dwi Natasari Juwita')).toHaveAttribute('src', '/resume.pdf')
    const download = screen.getByRole('link', { name: 'Unduh' })
    expect(download).toHaveAttribute('href', '/resume.pdf')
    expect(download).toHaveAttribute('download', 'Dwi Natasari Juwita - CV.pdf')
    expect(fetch).toHaveBeenCalledWith('/resume.pdf', { method: 'HEAD' })
  })

  it('shows open and download buttons instead of the PDF on mobile', async () => {
    stubFetch({ ok: true, contentType: 'application/pdf' })
    setMobile(true)
    render(<ResumeApp />)

    expect(await screen.findByRole('link', { name: 'Buka PDF' })).toHaveAttribute('target', '_blank')
    expect(screen.getByRole('link', { name: 'Unduh CV' })).toHaveAttribute('download', 'Dwi Natasari Juwita - CV.pdf')
    expect(screen.queryByTitle('Resume Dwi Natasari Juwita')).not.toBeInTheDocument()
  })

  it('says the CV is coming soon when the file is missing', async () => {
    stubFetch({ ok: false, contentType: 'text/html' })
    render(<ResumeApp />)
    expect(await screen.findByText('CV segera hadir')).toBeInTheDocument()
  })

  it('treats an HTML page served with 200 (Vite dev fallback) as missing', async () => {
    stubFetch({ ok: true, contentType: 'text/html' })
    render(<ResumeApp />)
    expect(await screen.findByText('CV segera hadir')).toBeInTheDocument()
  })

  it('treats a network error as missing', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))
    render(<ResumeApp />)
    expect(await screen.findByText('CV segera hadir')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Jalankan dan pastikan gagal**

Run: `npx vitest run src/apps/ContactApp.test.jsx src/apps/ResumeApp.test.jsx`
Expected: FAIL, modul `./ContactApp` dan `./ResumeApp` tidak ditemukan.

- [ ] **Step 3: Implementasi**

`src/lib/resume.js`:

```js
export async function isPdfAvailable(url) {
  try {
    const response = await fetch(url, { method: 'HEAD' })
    return response.ok && (response.headers.get('content-type') ?? '').includes('pdf')
  } catch {
    return false
  }
}
```

`src/apps/ContactApp.jsx`:

```jsx
import { useEffect, useState } from 'react'
import Avatar from '../components/Avatar'
import { profile } from '../data/profile'

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
      <div className="w-full rounded-xl bg-gray-50 p-4 text-left">
        <p className="text-xs font-medium text-gray-500">email</p>
        <a href={`mailto:${profile.email}`} className="break-all text-blue-600 hover:underline">
          {profile.email}
        </a>
      </div>
      {canCopy && (
        <button
          type="button"
          onClick={copyEmail}
          className="rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
        >
          {copied ? 'Tersalin ✓' : 'Salin email'}
        </button>
      )}
    </div>
  )
}
```

`src/apps/ResumeApp.jsx`:

```jsx
import { useEffect, useState } from 'react'
import { profile } from '../data/profile'
import { useIsMobile } from '../hooks/useIsMobile'
import { isPdfAvailable } from '../lib/resume'

export default function ResumeApp() {
  const isMobile = useIsMobile()
  const [status, setStatus] = useState('checking')
  const { url, downloadName } = profile.resume

  useEffect(() => {
    let cancelled = false
    isPdfAvailable(url).then((available) => {
      if (!cancelled) setStatus(available ? 'ready' : 'missing')
    })
    return () => {
      cancelled = true
    }
  }, [url])

  if (status === 'checking') {
    return <p className="p-6 text-sm text-gray-500">Memuat CV…</p>
  }

  if (status === 'missing') {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
        <p className="text-lg font-semibold text-gray-900">CV segera hadir</p>
        <p className="text-sm text-gray-500">Silakan cek lagi nanti.</p>
      </div>
    )
  }

  if (isMobile) {
    return (
      <div className="space-y-4 p-6">
        <h2 className="text-xl font-semibold text-gray-900">Resume {profile.name}</h2>
        <p className="text-sm text-gray-600">Lihat atau unduh CV lengkap dalam format PDF.</p>
        <div className="flex flex-col gap-3">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-gray-900 px-4 py-3 text-center font-medium text-white"
          >
            Buka PDF
          </a>
          <a
            href={url}
            download={downloadName}
            className="rounded-xl bg-gray-100 px-4 py-3 text-center font-medium text-gray-900"
          >
            Unduh CV
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-end border-b border-gray-200 bg-gray-50 px-3 py-2">
        <a
          href={url}
          download={downloadName}
          className="rounded-md bg-white px-3 py-1 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-gray-200 hover:bg-gray-100"
        >
          Unduh
        </a>
      </div>
      <iframe title={`Resume ${profile.name}`} src={url} className="min-h-0 flex-1 bg-white" />
    </div>
  )
}
```

- [ ] **Step 4: Jalankan dan pastikan lolos**

Run: `npx vitest run src/apps/ContactApp.test.jsx src/apps/ResumeApp.test.jsx`
Expected: PASS, 8 tes. Tes salin email butuh sekitar 2 detik karena menunggu timer asli.

- [ ] **Step 5: Commit**

```bash
git add src/apps/ContactApp.jsx src/apps/ContactApp.test.jsx src/apps/ResumeApp.jsx src/apps/ResumeApp.test.jsx src/lib/resume.js
git commit -m "feat: add Contact and Resume apps

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 7: Daftar aplikasi, wallpaper, jam, menu bar, dan Dock

**Files:**
- Create: `src/data/apps.js`, `src/lib/wallpaper.js`, `src/lib/clock.js`, `src/hooks/useNow.js`, `src/components/desktop/constants.js`, `src/components/desktop/MenuBar.jsx`, `src/components/desktop/Dock.jsx`
- Test: `src/data/apps.test.js`, `src/lib/wallpaper.test.js`, `src/lib/clock.test.js`, `src/components/desktop/MenuBar.test.jsx`, `src/components/desktop/Dock.test.jsx`

**Interfaces:**
- Consumes: 4 komponen aplikasi (Task 5, 6); `AppIcon` (Task 4)
- Produces:
  - `apps: { id, title, Component, size: {width, height}, initialPosition: {x, y} }[]`, urut: `about`, `resume`, `contact`, `music`
  - `wallpaperStyle: { backgroundImage: string }`
  - `formatClock(date) → 'Rab 30 Sep 14.05'`, `formatTime(date) → '14.05'`, `msUntilNextMinute(date) → number`
  - `useNow() → Date` (diperbarui tiap pergantian menit)
  - `MENU_BAR_HEIGHT = 28`, `DOCK_HEIGHT = 88`
  - `<MenuBar appName: string />`, dengan nama aplikasi berlabel `Aplikasi aktif`
  - `<Dock apps windows onOpen(id) />`: `<nav aria-label="Dock">` berisi tombol bernama judul aplikasi, dengan atribut `data-open="true|false"`

- [ ] **Step 1: Tulis tes yang gagal**

`src/data/apps.test.js`:

```js
import { describe, expect, it } from 'vitest'
import { apps } from './apps'

describe('apps', () => {
  it('registers the four apps in dock order', () => {
    expect(apps.map((app) => [app.id, app.title])).toEqual([
      ['about', 'About Me'],
      ['resume', 'Resume'],
      ['contact', 'Contact'],
      ['music', 'Music Favorite'],
    ])
  })

  it('gives every app a component, a size and a starting position', () => {
    for (const app of apps) {
      expect(typeof app.Component).toBe('function')
      expect(app.size.width).toBeGreaterThan(0)
      expect(app.size.height).toBeGreaterThan(0)
      expect(app.initialPosition).toEqual({ x: expect.any(Number), y: expect.any(Number) })
    }
  })
})
```

`src/lib/wallpaper.test.js`:

```js
import { describe, expect, it } from 'vitest'
import { wallpaperStyle } from './wallpaper'

describe('wallpaperStyle', () => {
  it('uses the wallpaper image from src/assets', () => {
    expect(wallpaperStyle.backgroundImage).toMatch(/^url\(".*wallpaper.*"\)$/)
  })
})
```

`src/lib/clock.test.js`:

```js
import { describe, expect, it } from 'vitest'
import { formatClock, formatTime, msUntilNextMinute } from './clock'

const wednesday = new Date(2026, 8, 30, 14, 5, 45, 500)

describe('clock', () => {
  it('formats the menu bar clock in Indonesian', () => {
    expect(formatClock(wednesday)).toBe('Rab 30 Sep 14.05')
  })

  it('formats the time only', () => {
    expect(formatTime(wednesday)).toBe('14.05')
  })

  it('computes the delay until the next minute', () => {
    expect(msUntilNextMinute(wednesday)).toBe(14_500)
  })
})
```

`src/components/desktop/MenuBar.test.jsx`:

```jsx
import { act, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import MenuBar from './MenuBar'

afterEach(() => {
  vi.useRealTimers()
})

describe('MenuBar', () => {
  it('shows the active app name and the logo', () => {
    render(<MenuBar appName="Music Favorite" />)
    expect(screen.getByLabelText('Aplikasi aktif')).toHaveTextContent('Music Favorite')
    expect(screen.getByRole('img', { name: 'Logo' })).toBeInTheDocument()
  })

  it('updates the clock when the minute changes and cleans up its timer', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 8, 30, 14, 5, 50))
    const { unmount } = render(<MenuBar appName="Finder" />)
    expect(screen.getByText('Rab 30 Sep 14.05')).toBeInTheDocument()

    act(() => vi.advanceTimersByTime(10_000))
    expect(screen.getByText('Rab 30 Sep 14.06')).toBeInTheDocument()

    unmount()
    expect(vi.getTimerCount()).toBe(0)
  })
})
```

`src/components/desktop/Dock.test.jsx`:

```jsx
import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { apps } from '../../data/apps'
import { createInitialState } from '../../hooks/useWindowManager'
import Dock from './Dock'

function windowsWith(openIds) {
  const { windows } = createInitialState(apps)
  for (const id of openIds) windows[id] = { ...windows[id], isOpen: true }
  return windows
}

describe('Dock', () => {
  it('shows a button for every app', () => {
    render(<Dock apps={apps} windows={windowsWith([])} onOpen={() => {}} />)
    const dock = screen.getByRole('navigation', { name: 'Dock' })
    for (const title of ['About Me', 'Resume', 'Contact', 'Music Favorite']) {
      expect(within(dock).getByRole('button', { name: title })).toBeInTheDocument()
    }
  })

  it('opens the clicked app', () => {
    const onOpen = vi.fn()
    render(<Dock apps={apps} windows={windowsWith([])} onOpen={onOpen} />)
    fireEvent.click(screen.getByRole('button', { name: 'Music Favorite' }))
    expect(onOpen).toHaveBeenCalledWith('music')
  })

  it('marks open apps', () => {
    render(<Dock apps={apps} windows={windowsWith(['contact'])} onOpen={() => {}} />)
    expect(screen.getByRole('button', { name: 'Contact' })).toHaveAttribute('data-open', 'true')
    expect(screen.getByRole('button', { name: 'About Me' })).toHaveAttribute('data-open', 'false')
  })
})
```

- [ ] **Step 2: Jalankan dan pastikan gagal**

Run: `npx vitest run src/data/apps.test.js src/lib/wallpaper.test.js src/lib/clock.test.js src/components/desktop`
Expected: FAIL, modul-modul tersebut tidak ditemukan.

- [ ] **Step 3: Implementasi**

`src/data/apps.js`:

```js
import AboutApp from '../apps/AboutApp'
import ContactApp from '../apps/ContactApp'
import MusicApp from '../apps/MusicApp'
import ResumeApp from '../apps/ResumeApp'

export const apps = [
  {
    id: 'about',
    title: 'About Me',
    Component: AboutApp,
    size: { width: 540, height: 420 },
    initialPosition: { x: 120, y: 48 },
  },
  {
    id: 'resume',
    title: 'Resume',
    Component: ResumeApp,
    size: { width: 720, height: 560 },
    initialPosition: { x: 220, y: 32 },
  },
  {
    id: 'contact',
    title: 'Contact',
    Component: ContactApp,
    size: { width: 400, height: 420 },
    initialPosition: { x: 320, y: 96 },
  },
  {
    id: 'music',
    title: 'Music Favorite',
    Component: MusicApp,
    size: { width: 460, height: 520 },
    initialPosition: { x: 420, y: 64 },
  },
]
```

`src/lib/wallpaper.js`:

```js
const files = import.meta.glob('../assets/wallpaper.{jpg,jpeg,png,webp}', { eager: true, import: 'default' })
const url = Object.values(files)[0]

export const wallpaperStyle = url
  ? { backgroundImage: `url("${url}")` }
  : { backgroundImage: 'linear-gradient(160deg, #1e3a8a 0%, #6d28d9 45%, #db2777 100%)' }
```

`src/lib/clock.js`:

```js
const dateFormat = new Intl.DateTimeFormat('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })
const timeFormat = new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit' })

export function formatTime(date) {
  return timeFormat.format(date)
}

export function formatClock(date) {
  const parts = Object.fromEntries(dateFormat.formatToParts(date).map((part) => [part.type, part.value]))
  return `${parts.weekday} ${parts.day} ${parts.month} ${formatTime(date)}`
}

export function msUntilNextMinute(date) {
  return 60_000 - (date.getSeconds() * 1000 + date.getMilliseconds())
}
```

`src/hooks/useNow.js`:

```js
import { useEffect, useState } from 'react'
import { msUntilNextMinute } from '../lib/clock'

export function useNow() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    let timer
    const schedule = () => {
      timer = setTimeout(() => {
        setNow(new Date())
        schedule()
      }, msUntilNextMinute(new Date()))
    }
    schedule()
    return () => clearTimeout(timer)
  }, [])

  return now
}
```

`src/components/desktop/constants.js`:

```js
export const MENU_BAR_HEIGHT = 28
export const DOCK_HEIGHT = 88
```

`src/components/desktop/MenuBar.jsx`:

```jsx
import { useNow } from '../../hooks/useNow'
import { formatClock } from '../../lib/clock'
import { MENU_BAR_HEIGHT } from './constants'

export default function MenuBar({ appName }) {
  const now = useNow()
  return (
    <div
      className="absolute inset-x-0 top-0 z-[1000] flex select-none items-center justify-between bg-white/30 px-4 text-[13px] text-gray-900 backdrop-blur-xl"
      style={{ height: MENU_BAR_HEIGHT }}
    >
      <div className="flex items-center gap-4">
        <AppleLogo />
        <span aria-label="Aplikasi aktif" className="font-semibold">
          {appName}
        </span>
      </div>
      <time dateTime={now.toISOString()}>{formatClock(now)}</time>
    </div>
  )
}

function AppleLogo() {
  return (
    <svg role="img" aria-label="Logo" viewBox="0 0 24 24" className="size-4">
      <path
        fill="currentColor"
        d="M12 7c-1.5-1.2-5-1.5-6.5 1.5S5 16 7.5 19c1.2 1.4 2.5 1.5 3.3 1 .7-.4 1.7-.4 2.4 0 .8.5 2.1.4 3.3-1 2.5-3 3.5-7.5 2-10.5S13.5 5.8 12 7z"
      />
      <path d="M12 7c0-2 1-3.5 3-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}
```

`src/components/desktop/Dock.jsx`:

```jsx
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react'
import { useRef } from 'react'
import AppIcon from '../AppIcon'
import { DOCK_HEIGHT } from './constants'

const BASE_SIZE = 48
const HOVER_SIZE = 76

export default function Dock({ apps, windows, onOpen }) {
  const mouseX = useMotionValue(Infinity)
  return (
    <nav aria-label="Dock" className="absolute inset-x-0 bottom-2 z-[1000] flex select-none justify-center">
      <div
        onMouseMove={(event) => mouseX.set(event.clientX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="flex items-end gap-3 rounded-2xl border border-white/30 bg-white/25 px-3 pb-1 pt-2 backdrop-blur-xl"
        style={{ height: DOCK_HEIGHT - 16 }}
      >
        {apps.map((app) => (
          <DockItem key={app.id} app={app} isOpen={windows[app.id].isOpen} mouseX={mouseX} onOpen={onOpen} />
        ))}
      </div>
    </nav>
  )
}

function DockItem({ app, isOpen, mouseX, onOpen }) {
  const ref = useRef(null)
  const reduceMotion = useReducedMotion()
  const distance = useTransform(mouseX, (x) => {
    const box = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 }
    return x - box.x - box.width / 2
  })
  const target = useTransform(distance, [-140, 0, 140], [BASE_SIZE, reduceMotion ? BASE_SIZE : HOVER_SIZE, BASE_SIZE])
  const size = useSpring(target, { mass: 0.1, stiffness: 170, damping: 14 })

  return (
    <div className="group relative flex flex-col items-center">
      <span className="pointer-events-none absolute -top-9 whitespace-nowrap rounded-md bg-gray-800/90 px-2 py-1 text-xs text-white opacity-0 transition group-hover:opacity-100 group-focus-within:opacity-100">
        {app.title}
      </span>
      <motion.button
        ref={ref}
        type="button"
        aria-label={app.title}
        data-open={isOpen}
        onClick={() => onOpen(app.id)}
        style={{ width: size, height: size }}
        className="rounded-[22%] focus-visible:outline-2 focus-visible:outline-white"
      >
        <AppIcon id={app.id} className="size-full" />
      </motion.button>
      <span
        aria-hidden="true"
        className={`mt-1 size-1 rounded-full bg-gray-900/80 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  )
}
```

- [ ] **Step 4: Jalankan dan pastikan lolos**

Run: `npx vitest run src/data/apps.test.js src/lib/wallpaper.test.js src/lib/clock.test.js src/components/desktop`
Expected: PASS, 11 tes.

- [ ] **Step 5: Commit**

```bash
git add src/data/apps.js src/data/apps.test.js src/lib/wallpaper.js src/lib/wallpaper.test.js src/lib/clock.js src/lib/clock.test.js src/hooks/useNow.js src/components/desktop
git commit -m "feat: add app registry, menu bar clock and magnifying dock

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 8: Jendela dan desktop

**Files:**
- Create: `src/components/desktop/Window.jsx`, `src/components/desktop/Desktop.jsx`
- Test: `src/components/desktop/Desktop.test.jsx`

**Interfaces:**
- Consumes: `apps`, `wallpaperStyle`, `MENU_BAR_HEIGHT`, `DOCK_HEIGHT`, `MenuBar`, `Dock` (Task 7); `useWindowManager` (Task 3)
- Produces:
  - `<Window app state isActive constraintsRef onFocus onClose onMinimize onToggleMaximize onMove />`: `<section role="dialog" aria-label={title}>` dengan tombol `Tutup <title>`, `Minimize <title>`, `Maximize <title>`
  - `<Desktop />`, tanpa props

- [ ] **Step 1: Tulis tes yang gagal**

`src/components/desktop/Desktop.test.jsx`:

```jsx
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Desktop from './Desktop'

const dockButton = (name) => within(screen.getByRole('navigation', { name: 'Dock' })).getByRole('button', { name })
const openFromDock = (name) => fireEvent.click(dockButton(name))
const activeApp = () => screen.getByLabelText('Aplikasi aktif')

describe('Desktop', () => {
  it('starts with no windows and Finder active', () => {
    render(<Desktop />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(activeApp()).toHaveTextContent('Finder')
  })

  it('opens a window from the Dock and marks it active', () => {
    render(<Desktop />)
    openFromDock('About Me')
    const win = screen.getByRole('dialog', { name: 'About Me' })
    expect(within(win).getByRole('heading', { name: 'Dwi Natasari Juwita' })).toBeInTheDocument()
    expect(activeApp()).toHaveTextContent('About Me')
    expect(dockButton('About Me')).toHaveAttribute('data-open', 'true')
  })

  it('closes a window with the red button', async () => {
    render(<Desktop />)
    openFromDock('Contact')
    fireEvent.click(screen.getByRole('button', { name: 'Tutup Contact' }))
    await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Contact' })).not.toBeInTheDocument())
    expect(activeApp()).toHaveTextContent('Finder')
    expect(dockButton('Contact')).toHaveAttribute('data-open', 'false')
  })

  it('minimizes to the Dock and restores from it', () => {
    render(<Desktop />)
    openFromDock('Music Favorite')
    fireEvent.click(screen.getByRole('button', { name: 'Minimize Music Favorite' }))

    expect(screen.queryByRole('dialog', { name: 'Music Favorite' })).not.toBeInTheDocument()
    expect(dockButton('Music Favorite')).toHaveAttribute('data-open', 'true')
    expect(activeApp()).toHaveTextContent('Finder')

    openFromDock('Music Favorite')
    expect(screen.getByRole('dialog', { name: 'Music Favorite' })).toBeInTheDocument()
    expect(activeApp()).toHaveTextContent('Music Favorite')
  })

  it('brings a clicked window to the front', () => {
    render(<Desktop />)
    openFromDock('About Me')
    openFromDock('Music Favorite')
    const about = screen.getByRole('dialog', { name: 'About Me' })
    const music = screen.getByRole('dialog', { name: 'Music Favorite' })

    fireEvent.pointerDown(about)

    expect(Number(about.style.zIndex)).toBeGreaterThan(Number(music.style.zIndex))
    expect(activeApp()).toHaveTextContent('About Me')
  })

  it('maximizes with the green button and restores with a title bar double-click', () => {
    render(<Desktop />)
    openFromDock('About Me')
    const win = screen.getByRole('dialog', { name: 'About Me' })
    expect(win.style.width).toBe('540px')

    fireEvent.click(screen.getByRole('button', { name: 'Maximize About Me' }))
    expect(win.style.width).toBe('100%')

    fireEvent.doubleClick(within(win).getByRole('heading', { name: 'About Me' }))
    expect(win.style.width).toBe('540px')
  })

  it('never lets a window grow past the desktop area on small screens', () => {
    render(<Desktop />)
    openFromDock('About Me')
    const win = screen.getByRole('dialog', { name: 'About Me' })
    expect(win.style.maxWidth).toBe('100%')
    expect(win.style.maxHeight).toBe('calc(100% - 88px)')
  })
})
```

- [ ] **Step 2: Jalankan dan pastikan gagal**

Run: `npx vitest run src/components/desktop/Desktop.test.jsx`
Expected: FAIL, modul `./Desktop` tidak ditemukan.

- [ ] **Step 3: Implementasi**

`src/components/desktop/Window.jsx`:

```jsx
import { motion, useDragControls, useMotionValue, useReducedMotion } from 'motion/react'
import { useEffect } from 'react'
import { DOCK_HEIGHT } from './constants'

export default function Window({
  app,
  state,
  isActive,
  constraintsRef,
  onFocus,
  onClose,
  onMinimize,
  onToggleMaximize,
  onMove,
}) {
  const { id, title, Component, size } = app
  const { isMinimized, isMaximized, position, zIndex } = state
  const dragControls = useDragControls()
  const reduceMotion = useReducedMotion()
  const x = useMotionValue(position.x)
  const y = useMotionValue(position.y)

  useEffect(() => {
    x.set(isMaximized ? 0 : position.x)
    y.set(isMaximized ? 0 : position.y)
  }, [isMaximized, position.x, position.y, x, y])

  const hidden = reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9 }
  const minimized = reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.1 }

  function startDrag(event) {
    onFocus(id)
    if (!isMaximized) dragControls.start(event)
  }

  return (
    <motion.section
      role="dialog"
      aria-label={title}
      aria-hidden={isMinimized || undefined}
      inert={isMinimized}
      className={`absolute left-0 top-0 flex flex-col overflow-hidden rounded-xl border border-black/10 bg-white ${
        isActive ? 'shadow-2xl' : 'shadow-lg'
      } ${isMinimized ? 'pointer-events-none' : ''}`}
      style={{
        x,
        y,
        zIndex,
        width: isMaximized ? '100%' : size.width,
        height: isMaximized ? `calc(100% - ${DOCK_HEIGHT}px)` : size.height,
        maxWidth: '100%',
        maxHeight: `calc(100% - ${DOCK_HEIGHT}px)`,
        transformOrigin: isMinimized ? dockOrigin(constraintsRef.current, position) : '50% 50%',
      }}
      initial={hidden}
      animate={isMinimized ? minimized : { opacity: 1, scale: 1 }}
      exit={hidden}
      transition={{ duration: reduceMotion ? 0.1 : 0.25, ease: 'easeOut' }}
      drag={!isMaximized && !isMinimized}
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      dragElastic={0}
      dragConstraints={constraintsRef}
      onDragEnd={() => onMove(id, { x: x.get(), y: y.get() })}
      onPointerDown={() => onFocus(id)}
    >
      <div
        className={`flex h-10 shrink-0 select-none items-center border-b border-black/5 px-3 ${
          isActive ? 'bg-gray-100' : 'bg-gray-50 opacity-70'
        }`}
        style={{ touchAction: 'none' }}
        onPointerDown={startDrag}
        onDoubleClick={() => onToggleMaximize(id)}
      >
        <div
          className="group flex gap-2"
          onPointerDown={(event) => event.stopPropagation()}
          onDoubleClick={(event) => event.stopPropagation()}
        >
          <TrafficLight className="bg-[#ff5f57]" label={`Tutup ${title}`} symbol="×" onClick={() => onClose(id)} />
          <TrafficLight
            className="bg-[#febc2e]"
            label={`Minimize ${title}`}
            symbol="−"
            onClick={() => onMinimize(id)}
          />
          <TrafficLight
            className="bg-[#28c840]"
            label={`Maximize ${title}`}
            symbol="+"
            onClick={() => onToggleMaximize(id)}
          />
        </div>
        <h2 className="flex-1 truncate text-center text-sm font-medium text-gray-700">{title}</h2>
        <div className="w-[52px]" aria-hidden="true" />
      </div>
      <div className="min-h-0 flex-1 overflow-auto">
        <Component />
      </div>
    </motion.section>
  )
}

function dockOrigin(area, position) {
  if (!area) return '50% 100%'
  return `${area.clientWidth / 2 - position.x}px ${area.clientHeight - position.y}px`
}

function TrafficLight({ className, label, symbol, onClick }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`flex size-3 items-center justify-center rounded-full text-[9px] font-bold leading-none text-black/60 ${className}`}
    >
      <span className="opacity-0 group-hover:opacity-100">{symbol}</span>
    </button>
  )
}
```

`src/components/desktop/Desktop.jsx`:

```jsx
import { AnimatePresence } from 'motion/react'
import { useRef } from 'react'
import { apps } from '../../data/apps'
import { useWindowManager } from '../../hooks/useWindowManager'
import { wallpaperStyle } from '../../lib/wallpaper'
import { MENU_BAR_HEIGHT } from './constants'
import Dock from './Dock'
import MenuBar from './MenuBar'
import Window from './Window'

export default function Desktop() {
  const { windows, activeId, open, close, minimize, toggleMaximize, focus, move } = useWindowManager(apps)
  const areaRef = useRef(null)
  const activeApp = apps.find((app) => app.id === activeId)

  return (
    <div className="fixed inset-0 overflow-hidden bg-cover bg-center" style={wallpaperStyle}>
      <MenuBar appName={activeApp?.title ?? 'Finder'} />
      <div ref={areaRef} className="absolute inset-x-0 bottom-0" style={{ top: MENU_BAR_HEIGHT }}>
        <AnimatePresence>
          {apps
            .filter((app) => windows[app.id].isOpen)
            .map((app) => (
              <Window
                key={app.id}
                app={app}
                state={windows[app.id]}
                isActive={activeId === app.id}
                constraintsRef={areaRef}
                onFocus={focus}
                onClose={close}
                onMinimize={minimize}
                onToggleMaximize={toggleMaximize}
                onMove={move}
              />
            ))}
        </AnimatePresence>
      </div>
      <Dock apps={apps} windows={windows} onOpen={open} />
    </div>
  )
}
```

- [ ] **Step 4: Jalankan dan pastikan lolos**

Run: `npx vitest run src/components/desktop/Desktop.test.jsx`
Expected: PASS, 7 tes.

- [ ] **Step 5: Commit**

```bash
git add src/components/desktop/Window.jsx src/components/desktop/Desktop.jsx src/components/desktop/Desktop.test.jsx
git commit -m "feat: add draggable macOS windows and desktop

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 9: Home screen iPhone dan AppSheet

**Files:**
- Create: `src/components/mobile/HomeScreen.jsx`, `src/components/mobile/AppSheet.jsx`
- Test: `src/components/mobile/HomeScreen.test.jsx`

**Interfaces:**
- Consumes: `apps`, `wallpaperStyle`, `formatTime`, `useNow` (Task 7); `profile` (Task 2); `AppIcon`, `Avatar` (Task 4)
- Produces:
  - `<HomeScreen />`, tanpa props. Berisi `<section aria-label="Sapaan">` dan `<nav aria-label="Dock">` dengan tombol bernama judul aplikasi.
  - `<AppSheet app origin onClose />`: `role="dialog"` dengan tombol `‹ Kembali` dan `Tutup aplikasi`

- [ ] **Step 1: Tulis tes yang gagal**

`src/components/mobile/HomeScreen.test.jsx`:

```jsx
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import HomeScreen from './HomeScreen'

const tap = (name) => fireEvent.click(within(screen.getByRole('navigation', { name: 'Dock' })).getByRole('button', { name }))

afterEach(() => {
  vi.restoreAllMocks()
})

describe('HomeScreen', () => {
  it('shows the greeting widget and the four apps in the dock', () => {
    render(<HomeScreen />)
    expect(within(screen.getByRole('region', { name: 'Sapaan' })).getByText('Dwi Natasari Juwita')).toBeInTheDocument()
    const dock = screen.getByRole('navigation', { name: 'Dock' })
    expect(within(dock).getAllByRole('button')).toHaveLength(4)
  })

  it('opens an app full screen and adds a history entry', () => {
    render(<HomeScreen />)
    const before = window.history.length
    tap('Music Favorite')
    expect(screen.getByRole('dialog', { name: 'Music Favorite' })).toBeInTheDocument()
    expect(window.history.length).toBe(before + 1)
    expect(window.history.state.app).toBe('music')
  })

  it('closes the app with the back button', async () => {
    render(<HomeScreen />)
    tap('About Me')
    fireEvent.click(screen.getByRole('button', { name: /Kembali/ }))
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })

  it('closes the app when the browser goes back', async () => {
    render(<HomeScreen />)
    tap('Contact')
    act(() => window.history.back())
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })

  it('adds only one history entry when an icon is tapped twice quickly', () => {
    render(<HomeScreen />)
    const before = window.history.length
    tap('About Me')
    tap('About Me')
    expect(window.history.length).toBe(before + 1)
  })

  it('goes back only once when close is pressed twice quickly', () => {
    const back = vi.spyOn(window.history, 'back').mockImplementation(() => {})
    render(<HomeScreen />)
    tap('About Me')
    const closeButton = screen.getByRole('button', { name: /Kembali/ })
    fireEvent.click(closeButton)
    fireEvent.click(closeButton)
    expect(back).toHaveBeenCalledTimes(1)
  })
})
```

- [ ] **Step 2: Jalankan dan pastikan gagal**

Run: `npx vitest run src/components/mobile`
Expected: FAIL, modul `./HomeScreen` tidak ditemukan.

- [ ] **Step 3: Implementasi**

`src/components/mobile/AppSheet.jsx`:

```jsx
import { motion, useReducedMotion } from 'motion/react'

export default function AppSheet({ app, origin, onClose }) {
  const reduceMotion = useReducedMotion()
  const { title, Component } = app
  const hidden = reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.2 }

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex flex-col bg-white text-gray-900"
      style={{ transformOrigin: origin }}
      initial={hidden}
      animate={{ opacity: 1, scale: 1 }}
      exit={hidden}
      transition={{ duration: reduceMotion ? 0.1 : 0.3, ease: 'easeOut' }}
    >
      <header className="flex shrink-0 items-center border-b border-gray-200 px-2 pb-2 pt-4">
        <button type="button" onClick={onClose} className="px-2 py-1 text-blue-600">
          ‹ Kembali
        </button>
        <h2 className="flex-1 text-center font-semibold">{title}</h2>
        <span className="w-[76px]" aria-hidden="true" />
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <Component />
      </div>
      <div className="flex shrink-0 justify-center pb-2 pt-3">
        <motion.button
          type="button"
          aria-label="Tutup aplikasi"
          onClick={onClose}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.3}
          dragSnapToOrigin
          onDragEnd={(_event, info) => {
            if (info.offset.y < -40) onClose()
          }}
          className="h-5 w-36 touch-none"
        >
          <span className="block h-1.5 w-full rounded-full bg-gray-900" />
        </motion.button>
      </div>
    </motion.div>
  )
}
```

`src/components/mobile/HomeScreen.jsx`:

```jsx
import { AnimatePresence } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { apps } from '../../data/apps'
import { profile } from '../../data/profile'
import { useNow } from '../../hooks/useNow'
import { formatTime } from '../../lib/clock'
import { wallpaperStyle } from '../../lib/wallpaper'
import AppIcon from '../AppIcon'
import Avatar from '../Avatar'
import AppSheet from './AppSheet'

const DOCK_SIZE = 4

export default function HomeScreen() {
  const [openApp, setOpenApp] = useState(null)
  const closingRef = useRef(false)

  useEffect(() => {
    const onPopState = () => {
      closingRef.current = false
      setOpenApp(null)
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  function launch(id, event) {
    if (openApp) return
    const box = event.currentTarget.getBoundingClientRect()
    window.history.pushState({ ...window.history.state, app: id }, '')
    setOpenApp({ id, origin: `${box.x + box.width / 2}px ${box.y + box.height / 2}px` })
  }

  function closeApp() {
    if (closingRef.current) return
    closingRef.current = true
    window.history.back()
  }

  const app = apps.find((item) => item.id === openApp?.id)
  const dockApps = apps.slice(0, DOCK_SIZE)
  const gridApps = apps.slice(DOCK_SIZE)

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-cover bg-center text-white" style={wallpaperStyle}>
      <StatusBar />
      <main className="flex-1 overflow-y-auto px-5 pt-4">
        <section aria-label="Sapaan" className="flex items-center gap-4 rounded-3xl bg-white/20 p-4 backdrop-blur-xl">
          <Avatar size="md" />
          <div className="min-w-0">
            <p className="text-lg font-semibold">{profile.name}</p>
            <p className="truncate text-sm text-white/80">{profile.tagline}</p>
          </div>
        </section>
        {gridApps.length > 0 && (
          <ul className="mt-6 grid grid-cols-4 gap-y-6">
            {gridApps.map((item) => (
              <li key={item.id}>
                <LaunchButton app={item} onLaunch={launch} showLabel />
              </li>
            ))}
          </ul>
        )}
      </main>
      <nav aria-label="Dock" className="mx-3 mb-3 flex justify-around rounded-[2rem] bg-white/25 p-3 backdrop-blur-xl">
        {dockApps.map((item) => (
          <LaunchButton key={item.id} app={item} onLaunch={launch} />
        ))}
      </nav>
      <AnimatePresence>
        {app && <AppSheet key={app.id} app={app} origin={openApp.origin} onClose={closeApp} />}
      </AnimatePresence>
    </div>
  )
}

function LaunchButton({ app, onLaunch, showLabel = false }) {
  return (
    <button
      type="button"
      aria-label={app.title}
      onClick={(event) => onLaunch(app.id, event)}
      className="flex w-full flex-col items-center gap-1"
    >
      <AppIcon id={app.id} className="size-14" />
      {showLabel && <span className="text-xs">{app.title}</span>}
    </button>
  )
}

function StatusBar() {
  const now = useNow()
  return (
    <div className="flex shrink-0 items-center justify-between px-6 pt-3 text-sm font-semibold">
      <time dateTime={now.toISOString()}>{formatTime(now)}</time>
      <div aria-hidden="true" className="flex items-center gap-1.5">
        <svg viewBox="0 0 18 12" className="h-3 w-[18px]" fill="currentColor">
          <rect x="0" y="8" width="3" height="4" rx="1" />
          <rect x="5" y="5" width="3" height="7" rx="1" />
          <rect x="10" y="2.5" width="3" height="9.5" rx="1" />
          <rect x="15" y="0" width="3" height="12" rx="1" />
        </svg>
        <svg viewBox="0 0 16 12" className="h-3 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M1.5 4.5a9.5 9.5 0 0 1 13 0" />
          <path d="M4 7.3a6 6 0 0 1 8 0" />
          <circle cx="8" cy="10.3" r="0.9" fill="currentColor" />
        </svg>
        <svg viewBox="0 0 26 12" className="h-3 w-[26px]">
          <rect x="0.5" y="0.5" width="22" height="11" rx="3" fill="none" stroke="currentColor" opacity="0.5" />
          <rect x="2" y="2" width="17" height="8" rx="1.5" fill="currentColor" />
          <rect x="23.5" y="4" width="2" height="4" rx="1" fill="currentColor" opacity="0.5" />
        </svg>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Jalankan dan pastikan lolos**

Run: `npx vitest run src/components/mobile`
Expected: PASS, 6 tes.

- [ ] **Step 5: Commit**

```bash
git add src/components/mobile
git commit -m "feat: add iPhone-style home screen for mobile

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 10: Pilih tampilan di halaman Home, bersihkan struktur lama, dan verifikasi akhir

**Files:**
- Modify: `src/pages/Home/index.jsx`, `src/pages/NotFound/index.jsx`, `src/routes/index.jsx`, `index.html`
- Delete: `src/components/Navbar.jsx`, `src/layouts/MainLayout.jsx`, `src/sections/`
- Test: `src/pages/Home/Home.test.jsx`

**Interfaces:**
- Consumes: `Desktop` (Task 8), `HomeScreen` (Task 9), `useIsMobile` (Task 3), `setMobile` (Task 1, khusus tes)
- Produces: `<Home />` untuk rute `/`

- [ ] **Step 1: Tulis tes yang gagal**

`src/pages/Home/Home.test.jsx`:

```jsx
import { act, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { setMobile } from '../../test/matchMedia'
import Home from '.'

describe('Home', () => {
  it('shows the macOS desktop on wide screens', () => {
    render(<Home />)
    expect(screen.getByLabelText('Aplikasi aktif')).toHaveTextContent('Finder')
    expect(screen.queryByRole('region', { name: 'Sapaan' })).not.toBeInTheDocument()
  })

  it('shows the iPhone home screen on small screens', () => {
    setMobile(true)
    render(<Home />)
    expect(screen.getByRole('region', { name: 'Sapaan' })).toBeInTheDocument()
    expect(screen.queryByLabelText('Aplikasi aktif')).not.toBeInTheDocument()
  })

  it('switches layout when the viewport crosses the breakpoint', () => {
    render(<Home />)
    act(() => setMobile(true))
    expect(screen.getByRole('region', { name: 'Sapaan' })).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Jalankan dan pastikan gagal**

Run: `npx vitest run src/pages/Home/Home.test.jsx`
Expected: FAIL. `Home` masih merender section lama, jadi label `Aplikasi aktif` dan region `Sapaan` tidak ditemukan.

- [ ] **Step 3: Implementasi**

`src/pages/Home/index.jsx`:

```jsx
import Desktop from '../../components/desktop/Desktop'
import HomeScreen from '../../components/mobile/HomeScreen'
import { useIsMobile } from '../../hooks/useIsMobile'

export default function Home() {
  return useIsMobile() ? <HomeScreen /> : <Desktop />
}
```

`src/pages/NotFound/index.jsx`:

```jsx
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-gray-50 p-6 text-center">
      <h1 className="text-5xl font-bold text-gray-900">404</h1>
      <p className="text-gray-600">Halaman tidak ditemukan.</p>
      <Link to="/" className="rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white">
        Kembali ke desktop
      </Link>
    </main>
  )
}
```

`src/routes/index.jsx`:

```jsx
import { createBrowserRouter } from 'react-router-dom'
import Home from '../pages/Home'
import NotFound from '../pages/NotFound'

// Tambahkan halaman baru di sini
const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '*', element: <NotFound /> },
])

export default router
```

Di `index.html`, ubah `<html lang="id" class="scroll-smooth">` menjadi `<html lang="id">`.

Hapus struktur lama:

```bash
git rm -r src/components/Navbar.jsx src/layouts src/sections
```

- [ ] **Step 4: Jalankan tes halaman dan pastikan lolos**

Run: `npx vitest run src/pages/Home/Home.test.jsx`
Expected: PASS, 3 tes.

- [ ] **Step 5: Pastikan tidak ada impor ke file yang dihapus**

Run: `grep -rnE "Navbar|MainLayout|sections/" src`
Expected: tidak ada output.

- [ ] **Step 6: Jalankan seluruh verifikasi**

Run: `npm test && npm run lint && npm run build`
Expected: semua tes PASS (70 tes), lint tanpa error, build sukses, dan `dist/404.html` terbentuk.

- [ ] **Step 7: Cek manual di browser**

Run: `npm run dev`, lalu buka URL yang dicetak.

Di lebar 1440px, pastikan:
- Wallpaper tampil, menu bar menunjukkan "Finder" dan jam yang benar.
- Ikon Dock membesar seperti gelombang saat kursor lewat, dan label muncul di atas ikon.
- Keempat jendela bisa dibuka, digeser lewat title bar, dan tidak bisa keluar dari layar atau naik menutupi menu bar.
- Teks di dalam jendela bisa diseleksi.
- Klik jendela di belakang membawanya ke depan, dan nama di menu bar ikut berubah.
- 🔴 menutup jendela, 🟡 menyusutkan jendela ke arah Dock, 🟢 atau klik dua kali title bar memaksimalkan lalu mengembalikan.
- Jendela Resume menampilkan PDF, dan tombol Unduh menyimpan file bernama "Dwi Natasari Juwita - CV.pdf".
- Contact: klik email membuka aplikasi email, dan "Salin email" berubah jadi "Tersalin ✓".
- Music: klik lagu membuka Spotify di tab baru.
- Di lebar 1024×640, jendela Resume tidak melewati layar.

Di mode perangkat 390px (DevTools):
- Tampil home screen iPhone dengan status bar, widget sapaan, dan Dock.
- Ketuk ikon membuka aplikasi layar penuh dengan animasi dari ikon.
- "‹ Kembali", garis home (ketuk atau usap ke atas), dan tombol Back browser semuanya menutup aplikasi tanpa keluar dari website.
- Resume menampilkan tombol "Buka PDF" dan "Unduh CV".

Dengan "Emulate CSS prefers-reduced-motion: reduce" di DevTools, animasi hanya berupa fade singkat dan Dock tidak membesar.

Buka `/halaman-tidak-ada`: tampil halaman 404 dengan tombol kembali.

- [ ] **Step 8: Commit**

```bash
git add -A src index.html
git commit -m "feat: switch between macOS desktop and iPhone home screen

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```
