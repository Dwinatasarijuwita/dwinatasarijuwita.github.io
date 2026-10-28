import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { applyTheme, readPreference, resolveTheme, writePreference } from './theme'

beforeEach(() => {
  localStorage.clear()
  document.documentElement.classList.remove('dark')
  document.documentElement.style.colorScheme = ''
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('theme', () => {
  it.each(['light', 'dark', 'auto'])('reads a stored %s preference', (preference) => {
    localStorage.setItem('theme', preference)
    expect(readPreference()).toBe(preference)
  })

  it('falls back to auto when nothing or junk is stored', () => {
    expect(readPreference()).toBe('auto')
    localStorage.setItem('theme', 'purple')
    expect(readPreference()).toBe('auto')
  })

  it('falls back to auto and keeps going when storage throws', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    expect(readPreference()).toBe('auto')
    expect(() => writePreference('dark')).not.toThrow()
  })

  it('stores the preference', () => {
    writePreference('dark')
    expect(localStorage.getItem('theme')).toBe('dark')
  })

  it.each([
    ['light', false, 'light'],
    ['light', true, 'light'],
    ['dark', false, 'dark'],
    ['dark', true, 'dark'],
    ['auto', false, 'light'],
    ['auto', true, 'dark'],
  ])('resolves %s with system dark %s to %s', (preference, systemDark, theme) => {
    expect(resolveTheme(preference, systemDark)).toBe(theme)
  })

  it('applies the theme to the html element', () => {
    applyTheme('dark')
    expect(document.documentElement).toHaveClass('dark')
    expect(document.documentElement.style.colorScheme).toBe('dark')
    applyTheme('light')
    expect(document.documentElement).not.toHaveClass('dark')
    expect(document.documentElement.style.colorScheme).toBe('light')
  })
})
