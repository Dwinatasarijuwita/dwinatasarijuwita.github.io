import { describe, expect, it } from 'vitest'

// Files still waiting for their dark look. Shrinks to empty as each part of the site is done.
const PENDING = [
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
function classes(literal) {
  return literal.split(/\s+/).map((token) => token.split(':'))
}

function hasLight(literal, pattern) {
  return classes(literal).some((segments) => !segments.includes('dark') && pattern.test(segments.at(-1)))
}

// Any `dark:` class for the same property counts, including ones like `dark:hover:bg-neutral-800`.
function hasDark(literal, property) {
  return classes(literal).some((segments) => segments.includes('dark') && segments.at(-1).startsWith(property))
}

function violations(source) {
  // Comments and JSX text can hold apostrophes, so quoted strings must not run across lines.
  const code = source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')
  const found = []
  for (const match of code.matchAll(/(['"])((?:\\.|(?!\1)[^\\\n])*)\1|`((?:\\.|[^\\`])*)`/g)) {
    const literal = match[2] ?? match[3]
    if (hasLight(literal, LIGHT_BACKGROUND) && !hasDark(literal, 'bg-')) found.push(literal)
    else if (hasLight(literal, GREY_TEXT) && !hasDark(literal, 'text-')) found.push(literal)
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

  it('accepts a dark counterpart with its own state prefix', () => {
    expect(violations(`<a className="hover:bg-gray-100 dark:hover:bg-neutral-800" />`)).toEqual([])
  })

  it('still reads classes after an apostrophe in a comment or text', () => {
    const source = `// Chrome's quirk\n<p className="text-gray-500" />\n{/* it doesn't scroll */}`
    expect(violations(source)).toEqual(['text-gray-500'])
  })
})
