import { describe, expect, it } from 'vitest'
import { formatPhone, whatsappUrl } from './contact'

describe('whatsappUrl', () => {
  it('turns a local Indonesian number into a wa.me chat link', () => {
    expect(whatsappUrl('085718259166')).toBe('https://wa.me/6285718259166')
  })

  it('accepts numbers already written with +62, spaces or dashes', () => {
    expect(whatsappUrl('+62 857-1825-9166')).toBe('https://wa.me/6285718259166')
  })
})

describe('formatPhone', () => {
  it('groups the digits so the number is easy to read', () => {
    expect(formatPhone('085718259166')).toBe('0857-1825-9166')
  })
})
