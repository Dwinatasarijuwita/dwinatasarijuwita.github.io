import { describe, expect, it } from 'vitest'
import { photos } from './photos'

describe('photos', () => {
  it('lists every photo in file-name order', () => {
    expect(photos).toHaveLength(11)
    expect(photos[0].id).toBe('01-self')
    expect(photos[10].id).toBe('11-self')
  })

  it('pairs each photo with its small thumbnail', () => {
    for (const photo of photos) {
      expect(photo.src).toContain(photo.id)
      expect(photo.thumb).toContain('thumbs')
    }
  })
})
