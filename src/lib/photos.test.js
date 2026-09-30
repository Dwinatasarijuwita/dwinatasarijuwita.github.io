import { describe, expect, it } from 'vitest'
import { photos } from './photos'

describe('photos', () => {
  it('lists every photo in file-name order', () => {
    expect(photos).toHaveLength(13)
    expect(photos[0].id).toBe('01-self')
    expect(photos[12].id).toBe('13-hacktiv8')
  })

  it('pairs each photo with its small thumbnail', () => {
    for (const photo of photos) {
      expect(photo.src).toContain(photo.id)
      expect(photo.thumb).toContain('thumbs')
    }
  })
})
