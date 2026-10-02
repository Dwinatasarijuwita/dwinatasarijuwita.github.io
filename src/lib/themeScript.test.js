import { readFileSync } from 'node:fs'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { setSystemDark } from '../test/matchMedia'
import { SYSTEM_DARK_QUERY, THEME_STORAGE_KEY } from './theme'

// The inline script in index.html runs before React; it must make the same call as theme.js.
const html = readFileSync('index.html', 'utf8')
const source = html.match(/<script>([\s\S]*?)<\/script>/)?.[1]
const run = () => new Function(source)()

beforeEach(() => {
  localStorage.clear()
  document.documentElement.classList.remove('dark')
  document.documentElement.style.colorScheme = ''
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('index.html theme script', () => {
  it('uses the same storage key and system query as theme.js', () => {
    expect(source).toContain(`localStorage.getItem('${THEME_STORAGE_KEY}')`)
    expect(source).toContain(SYSTEM_DARK_QUERY)
  })

  it.each([
    ['dark', false, true],
    ['light', true, false],
    ['auto', true, true],
    ['auto', false, false],
    ['purple', true, true],
    [null, true, true],
  ])('with %s stored and system dark %s, sets dark to %s', (stored, systemDark, expectDark) => {
    if (stored) localStorage.setItem('theme', stored)
    setSystemDark(systemDark)
    run()
    expect(document.documentElement.classList.contains('dark')).toBe(expectDark)
    expect(document.documentElement.style.colorScheme).toBe(expectDark ? 'dark' : 'light')
  })

  it('does not throw when storage is blocked', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    expect(run).not.toThrow()
  })
})
