import { describe, expect, it, vi } from 'vitest'
import { setMobile, setSystemDark } from './matchMedia'

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

  it('reports and announces the system dark setting', () => {
    const query = window.matchMedia('(prefers-color-scheme: dark)')
    expect(query.matches).toBe(false)
    const listener = vi.fn()
    query.addEventListener('change', listener)
    setSystemDark(true)
    expect(query.matches).toBe(true)
    expect(listener).toHaveBeenCalledWith({ matches: true })
    expect(window.matchMedia('(max-width: 767px)').matches).toBe(false)
  })
})
