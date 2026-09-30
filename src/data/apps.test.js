import { describe, expect, it } from 'vitest'
import { apps } from './apps'

describe('apps', () => {
  it('registers the four apps in dock order', () => {
    expect(apps.map((app) => [app.id, app.title])).toEqual([
      ['about', 'About Me'],
      ['resume', 'Resume'],
      ['contact', 'Contact'],
      ['music', 'Music Favorite'],
    ])
  })

  it('gives every app a component, a size and a starting position', () => {
    for (const app of apps) {
      expect(typeof app.Component).toBe('function')
      expect(app.size.width).toBeGreaterThan(0)
      expect(app.size.height).toBeGreaterThan(0)
      expect(app.initialPosition).toEqual({ x: expect.any(Number), y: expect.any(Number) })
    }
  })
})
