import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import AboutApp from './AboutApp'

describe('AboutApp', () => {
  it('introduces the owner', () => {
    render(<AboutApp />)
    expect(screen.getByRole('heading', { name: 'Dwi Natasari Juwita' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Avatar Dwi Natasari Juwita' })).toBeInTheDocument()
    expect(screen.getByText('Write your tagline here')).toBeInTheDocument()
    expect(screen.getByText('Write your introduction here.')).toBeInTheDocument()
  })

  it('lists the quick facts', () => {
    render(<AboutApp />)
    expect(screen.getByText('Currently learning')).toBeInTheDocument()
    expect(screen.getByText('Hobbies')).toBeInTheDocument()
    expect(screen.getByText('Location')).toBeInTheDocument()
  })
})
