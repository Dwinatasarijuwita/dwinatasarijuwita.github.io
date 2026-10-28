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
  it('sorts each photo into an album from its file name', () => {
    const byId = Object.fromEntries(photos.map((photo) => [photo.id, photo.album]))
    expect(byId['01-self']).toBe('Me')
    expect(byId['10.friends']).toBe('Friends')
    expect(byId['12-graduation']).toBe('Moments')
    expect(photos.filter((photo) => photo.album === 'Moments').map((photo) => photo.id)).toEqual([
      '03-work',
      '08-social',
      '12-graduation',
      '13-hacktiv8',
    ])
  })
})
