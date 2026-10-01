import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { experience } from './experience'
import { profile } from './profile'
import { projects } from './projects'
import { songs } from './songs'

describe('profile', () => {
  it('has the contact and resume details', () => {
    expect(profile.name).toBe('Dwi Natasari Juwita')
    expect(profile.initials).toBe('DJ')
    expect(profile.nickname).toBe('Tasya Kasturi')
    expect(profile.email).toBe('tasyakstr@gmail.com')
    expect(profile.phoneNumber).toBe('085718259166')
    expect(profile.github).toBe('https://github.com/Dwinatasarijuwita')
    expect(profile.linkedin).toBe('https://www.linkedin.com/in/dwi-natasari-juwita-970474218/')
    expect(profile.instagram).toBe('https://www.instagram.com/tasyakstr/')
    expect(profile.resume).toEqual({ url: '/resume.pdf', downloadName: 'Dwi Natasari Juwita - CV.pdf' })
  })
})

describe('experience', () => {
  it('lists the work experience from the CV, newest first', () => {
    expect(experience.map((job) => [job.role, job.company, job.period])).toEqual([
      ['Frontend Developer – Contract', 'PT Permata Indo Sejahtera (Permata Indonesia)', 'Apr 2023 – Now'],
      ['Banking Officer – Internship', 'PT Bank Mandiri (Persero) Tbk', 'Sep 2021 – Dec 2021'],
      ['Insurance Officer – Internship', 'PT Asuransi Jiwa Generali Indonesia', 'Feb 2020 – Oct 2020'],
    ])
    for (const job of experience) {
      expect(job.location).toBe('Jakarta, Indonesia')
      expect(job.highlights.length).toBeGreaterThan(0)
    }
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

describe('projects', () => {
  it('lists the Permata Indonesia projects with their live links', () => {
    expect(projects.map((project) => [project.id, project.name, project.url, project.initials])).toEqual([
      ['job-apply', 'Permata Job Apply', 'https://karir.permataindonesia.com/apply', 'PJ'],
      ['company-profile', 'Permata Indonesia Company Profile', 'https://permataindonesia.com/', 'PI'],
      ['business', 'Permata Indonesia Business', 'https://business.permataindonesia.com', 'PB'],
    ])
  })

  it('gives every project its copy, tech stack and screenshots', () => {
    for (const project of projects) {
      expect(project.subtitle).toBeTruthy()
      expect(project.description).toBeTruthy()
      expect(project.role.length).toBeGreaterThan(0)
      expect(project.tech).toEqual(['React', 'SCSS'])
      expect(project.screenshots.length).toBeGreaterThan(0)
      for (const shot of project.screenshots) {
        expect(shot.src).toBeTruthy()
        expect(shot.alt).toContain(project.name)
      }
    }
  })

  it('records the real pixel size of every screenshot so the gallery can reserve its space', () => {
    for (const shot of projects.flatMap((project) => project.screenshots)) {
      const file = readFileSync(`src/assets/projects/${shot.src.split('/').pop()}`)
      expect([shot.width, shot.height]).toEqual(jpegSize(file))
    }
  })
})

// Reads width and height from the JPEG start-of-frame segment.
function jpegSize(bytes) {
  let offset = 2
  while (offset < bytes.length) {
    const marker = bytes[offset + 1]
    const length = bytes.readUInt16BE(offset + 2)
    if (marker >= 0xc0 && marker <= 0xc3) return [bytes.readUInt16BE(offset + 7), bytes.readUInt16BE(offset + 5)]
    offset += 2 + length
  }
  throw new Error('No JPEG size found')
}
