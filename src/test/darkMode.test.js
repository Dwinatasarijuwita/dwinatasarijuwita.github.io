import { describe, expect, it } from 'vitest'

// Files still waiting for their dark look. Shrinks to empty as each part of the site is done.
const PENDING = [
  'src/apps/AboutApp.jsx',
  'src/apps/ContactApp.jsx',
  'src/apps/ExperienceApp.jsx',
  'src/apps/MusicApp.jsx',
  'src/apps/PhotosApp.jsx',
  'src/apps/ProjectsApp.jsx',
  'src/apps/ResumeApp.jsx',
  'src/apps/TrashApp.jsx',
]

const sources = Object.entries(import.meta.glob('../**/*.jsx', { query: '?raw', import: 'default', eager: true }))
  .filter(([path]) => !path.endsWith('.test.jsx'))
  .map(([path, source]) => [path.replace(/^\.\.\//, 'src/'), source])

const LIGHT_BACKGROUND = /^bg-(white|gray-(50|100|200))$/
const GREY_TEXT = /^text-gray-\d+$/

// A class such as `hover:bg-gray-100` counts by its last segment, unless it is already a `dark:` class.
function hasLight(literal, pattern) {
  return literal.split(/\s+/).some((token) => {
    const segments = token.split(':')
    return !segments.includes('dark') && pattern.test(segments.at(-1))
  })
}

function violations(source) {
  const found = []
  for (const [, , literal] of source.matchAll(/(['"`])((?:\\.|(?!\1)[\s\S])*?)\1/g)) {
    if (hasLight(literal, LIGHT_BACKGROUND) && !literal.includes('dark:bg-')) found.push(literal)
    else if (hasLight(literal, GREY_TEXT) && !literal.includes('dark:text-')) found.push(literal)
  }
  return found
}

const failing = Object.fromEntries(
  sources.map(([path, source]) => [path, violations(source)]).filter(([, found]) => found.length > 0),
)

describe('dark mode', () => {
  it('gives every light colour a dark counterpart', () => {
    const unexpected = Object.entries(failing).filter(([path]) => !PENDING.includes(path))
    expect(unexpected).toEqual([])
  })

  it('lists only files that still need work', () => {
    expect(PENDING.filter((path) => !failing[path])).toEqual([])
  })
})
