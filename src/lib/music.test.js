import { describe, expect, it } from 'vitest'
import { coverUrl, gradientFor, songHref, trackId } from './music'

describe('songHref', () => {
  it('uses the song url when present', () => {
    const song = { title: 'Teh Hijau', artist: 'Tulus', url: 'https://open.spotify.com/track/4R9G7azXaZe93KTX65P9fU' }
    expect(songHref(song)).toBe('https://open.spotify.com/track/4R9G7azXaZe93KTX65P9fU')
  })

  it('falls back to an encoded Spotify search, including special characters', () => {
    const song = { title: 'Love Never Felt So Good', artist: 'Michael Jackson & Justin Timberlake', url: '' }
    expect(songHref(song)).toBe(
      'https://open.spotify.com/search/Love%20Never%20Felt%20So%20Good%20Michael%20Jackson%20%26%20Justin%20Timberlake',
    )
  })
})

describe('gradientFor', () => {
  it('returns the same gradient for the same text', () => {
    expect(gradientFor('Lost Stars')).toBe(gradientFor('Lost Stars'))
  })

  it('returns a CSS linear gradient', () => {
    expect(gradientFor('Dan Sore Itu')).toMatch(/^linear-gradient\(135deg, #[0-9a-f]{6}, #[0-9a-f]{6}\)$/)
  })
})

describe('coverUrl', () => {
  it('builds Spotify album-art urls at 300px and 640px', () => {
    const song = { cover: '37677af5b4f23fe9dc8a3c04' }
    expect(coverUrl(song)).toBe('https://i.scdn.co/image/ab67616d00001e0237677af5b4f23fe9dc8a3c04')
    expect(coverUrl(song, 640)).toBe('https://i.scdn.co/image/ab67616d0000b27337677af5b4f23fe9dc8a3c04')
  })

  it('returns null without a cover', () => {
    expect(coverUrl({})).toBeNull()
  })
})

describe('trackId', () => {
  it('reads the id from a track link, or null without one', () => {
    expect(trackId({ url: 'https://open.spotify.com/track/1Duym1lVQurgKHHSqpOWhY' })).toBe('1Duym1lVQurgKHHSqpOWhY')
    expect(trackId({ url: '' })).toBeNull()
  })
})
