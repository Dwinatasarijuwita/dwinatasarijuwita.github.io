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
