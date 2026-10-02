import { parseAstAsync } from 'vite'
import { describe, expect, it } from 'vitest'

const sources = Object.entries(import.meta.glob('../**/*.jsx', { query: '?raw', import: 'default', eager: true }))
  .filter(([path]) => !path.endsWith('.test.jsx'))
  .map(([path, source]) => [path.replace(/^\.\.\//, 'src/'), source])

// Light colours that need a dark counterpart.
const LIGHT = [/^bg-(white|gray-(50|100|200)(\/\d+)?)$/, /^(text|ring|border|divide)-gray-\d+(\/\d+)?$/]
// What a counterpart sets after its property: a colour, not e.g. a text size.
const COLOUR = /^(white|black|transparent|current|[a-z]+-\d{2,3})(\/\d+)?$|^\[#[0-9a-f]+\]$/i

function parseClass(token) {
  const parts = token.split(':')
  return { token, variants: parts.slice(0, -1), utility: parts.at(-1) }
}

// `hover:bg-gray-100` needs `dark:hover:bg-<colour>`: the same state, in dark mode.
function lightWithoutDark(classList) {
  const classes = classList.split(/\s+/).filter(Boolean).map(parseClass)
  return classes
    .filter(({ variants, utility }) => !variants.includes('dark') && LIGHT.some((pattern) => pattern.test(utility)))
    .filter(({ variants, utility }) => {
      const property = utility.slice(0, utility.indexOf('-'))
      return !classes.some(
        (other) =>
          other.variants[0] === 'dark' &&
          other.variants.slice(1).join(':') === variants.join(':') &&
          other.utility.startsWith(`${property}-`) &&
          COLOUR.test(other.utility.slice(property.length + 1)),
      )
    })
    .map(({ token }) => token)
}

// Every string literal is a possible class list; a template literal counts as one list,
// while strings inside its `${}` parts are checked on their own. Comments and JSX text
// are not strings, so their apostrophes can't confuse anything.
function collect(node, found) {
  if (!node || typeof node !== 'object') return
  if (Array.isArray(node)) return node.forEach((child) => collect(child, found))
  if (node.type === 'Literal' && typeof node.value === 'string') found.push(...lightWithoutDark(node.value))
  if (node.type === 'TemplateLiteral') found.push(...lightWithoutDark(node.quasis.map((quasi) => quasi.value.cooked).join(' ')))
  for (const [key, value] of Object.entries(node)) if (key !== 'quasis') collect(value, found)
}

async function violations(source) {
  const found = []
  collect(await parseAstAsync(source, { lang: 'jsx' }), found)
  return found
}

const failing = Object.fromEntries(
  (await Promise.all(sources.map(async ([path, source]) => [path, await violations(source)]))).filter(
    ([, found]) => found.length > 0,
  ),
)

describe('dark mode', () => {
  it('gives every light colour a dark counterpart', () => {
    expect(failing).toEqual({})
  })

  it('accepts a dark counterpart with its own state prefix', async () => {
    expect(await violations(`<a className="hover:bg-gray-100 dark:hover:bg-neutral-800" />`)).toEqual([])
  })

  it('rejects a dark counterpart for a different state', async () => {
    expect(await violations(`<a className="hover:bg-gray-100 dark:bg-neutral-900" />`)).toEqual(['hover:bg-gray-100'])
  })

  it('does not take a text size for a text colour', async () => {
    expect(await violations(`<p className="text-gray-500 dark:text-sm" />`)).toEqual(['text-gray-500'])
  })

  it('still reads classes after an apostrophe in a comment or text', async () => {
    const source = `const a = (\n  // Chrome's quirk\n  <p>Don't<span className="text-gray-500">it's</span></p> // it's\n)`
    expect(await violations(source)).toEqual(['text-gray-500'])
  })

  it('checks grey rings, borders and dividers too', async () => {
    expect(await violations(`<div className="ring-1 ring-gray-200 border-gray-200 divide-gray-100" />`)).toEqual([
      'ring-gray-200',
      'border-gray-200',
      'divide-gray-100',
    ])
  })
})
