import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { experience } from '../data/experience'
import ExperienceApp from './ExperienceApp'

describe('ExperienceApp', () => {
  it('shows every job with its company, period, location and highlights', () => {
    render(<ExperienceApp />)
    const items = within(screen.getByRole('list', { name: 'Work experience' })).getAllByRole('article')
    expect(items).toHaveLength(experience.length)
    experience.forEach((job, index) => {
      const item = within(items[index])
      expect(item.getByRole('heading', { name: job.role })).toBeInTheDocument()
      expect(item.getByText(job.company)).toBeInTheDocument()
      expect(item.getByText(job.period)).toBeInTheDocument()
      expect(item.getByText(job.location)).toBeInTheDocument()
      for (const highlight of job.highlights) expect(item.getByText(highlight)).toBeInTheDocument()
    })
  })

  it('leaves out projects, which get their own section later', () => {
    render(<ExperienceApp />)
    expect(screen.queryByText(/Kerja365/)).not.toBeInTheDocument()
  })
})
