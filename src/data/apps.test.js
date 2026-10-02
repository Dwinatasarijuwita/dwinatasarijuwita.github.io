import { describe, expect, it } from 'vitest'
import { apps } from './apps'
import { profile } from './profile'

describe('apps', () => {
  it('registers the apps in dock order', () => {
    expect(apps.map((app) => [app.id, app.title])).toEqual([
      ['about', 'About Me'],
      ['resume', 'Resume'],
      ['contact', 'Contact'],
      ['music', 'Music Favorite'],
      ['photos', 'Photos'],
      ['projects', 'Projects'],
      ['experience', 'Experience'],
      ['github', 'GitHub'],
      ['linkedin', 'LinkedIn'],
      ['instagram', 'Instagram'],
      ['trash', 'Trash'],
    ])
  })

  it('gives every window app a component, a size and a starting position', () => {
    for (const app of apps.filter((item) => item.kind !== 'link')) {
      expect(typeof app.Component).toBe('function')
      expect(app.size.width).toBeGreaterThan(0)
      expect(app.size.height).toBeGreaterThan(0)
      expect(app.initialPosition).toEqual({ x: expect.any(Number), y: expect.any(Number) })
    }
  })

  it('places Resume and Work Experience on the desktop and the rest in the Dock', () => {
    expect(apps.map((app) => [app.id, app.placement])).toEqual([
      ['about', 'dock'],
      ['resume', 'desktop'],
      ['contact', 'dock'],
      ['music', 'dock'],
      ['photos', 'dock'],
      ['projects', 'dock'],
      ['experience', 'desktop'],
      ['github', 'dock'],
      ['linkedin', 'dock'],
      ['instagram', 'dock'],
      ['trash', 'dock'],
    ])
    const resume = apps.find((app) => app.id === 'resume')
    expect(resume.desktopLabel).toBe('Dwi Natasari Juwita - CV.pdf')
    expect(resume.kind).toBe('file')
    expect(resume.fileType).toBe('pdf')
  })

  it('places Work Experience on the desktop as a document file', () => {
    const experience = apps.find((app) => app.id === 'experience')
    expect(experience.placement).toBe('desktop')
    expect(experience.kind).toBe('file')
    expect(experience.fileType).toBe('doc')
    expect(experience.desktopLabel).toBe('Work Experience')
  })

  it.each(['github', 'linkedin', 'instagram'])('makes %s a link to the profile instead of a window', (id) => {
    const app = apps.find((item) => item.id === id)
    expect(app.kind).toBe('link')
    expect(app.url).toBe(profile[id])
    expect(app.Component).toBeUndefined()
  })

  it('puts Trash last, in its own Dock group', () => {
    const trash = apps.at(-1)
    expect(trash.id).toBe('trash')
    expect(trash.dockGroup).toBe('end')
    expect(apps.filter((app) => app.dockGroup === 'end')).toEqual([trash])
  })
})
