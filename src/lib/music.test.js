import { describe, expect, it } from 'vitest'
import { gradientFor, songHref } from './music'

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
