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
