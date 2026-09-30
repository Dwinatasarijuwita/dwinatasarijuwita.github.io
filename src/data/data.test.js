import { describe, expect, it } from 'vitest'
import { profile } from './profile'
import { songs } from './songs'

describe('profile', () => {
  it('has the contact and resume details', () => {
    expect(profile.name).toBe('Dwi Natasari Juwita')
    expect(profile.initials).toBe('DJ')
    expect(profile.nickname).toBe('Tasya Kasturi')
    expect(profile.email).toBe('tasyakstr@gmail.com')
    expect(profile.phoneNumber).toBe('085718259166')
    expect(profile.github).toBe('https://github.com/Dwinatasarijuwita')
    expect(profile.resume).toEqual({ url: '/resume.pdf', downloadName: 'Dwi Natasari Juwita - CV.pdf' })
  })
})

describe('songs', () => {
  it('lists the favourite songs', () => {
    expect(songs.map((song) => song.title)).toEqual([
      'Baby Now That I Found You',
      'Lost Stars',
      'Dan Sore Itu',
      'Love Never Felt So Good',
      'Menikmati Sedih',
    ])
  })

  it('uses clean Spotify track links without tracking parameters', () => {
    for (const song of songs) {
      expect(song.url).toMatch(/^https:\/\/open\.spotify\.com\/track\/[A-Za-z0-9]+$/)
    }
  })
})
