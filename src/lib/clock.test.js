import { describe, expect, it } from 'vitest'
import { formatClock, formatTime, msUntilNextMinute } from './clock'

const wednesday = new Date(2026, 8, 30, 14, 5, 45, 500)

describe('clock', () => {
  it('formats the menu bar clock like an English macOS menu bar', () => {
    expect(formatClock(wednesday)).toBe('Wed Sep 30 2:05 PM')
  })

  it('formats the time only, like the iPhone status bar', () => {
    expect(formatTime(wednesday)).toBe('2:05')
  })

  it('computes the delay until the next minute', () => {
    expect(msUntilNextMinute(wednesday)).toBe(14_500)
  })
})
