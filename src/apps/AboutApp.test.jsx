import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import AboutApp from './AboutApp'

describe('AboutApp', () => {
  it('introduces the owner', () => {
    render(<AboutApp />)
    expect(screen.getByRole('heading', { name: 'Dwi Natasari Juwita' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Avatar Dwi Natasari Juwita' })).toBeInTheDocument()
    expect(screen.getByText('Tulis tagline-mu di sini')).toBeInTheDocument()
    expect(screen.getByText('Tulis perkenalanmu di sini.')).toBeInTheDocument()
  })

  it('lists the quick facts', () => {
    render(<AboutApp />)
    expect(screen.getByText('Sedang belajar')).toBeInTheDocument()
    expect(screen.getByText('Hobi')).toBeInTheDocument()
    expect(screen.getByText('Lokasi')).toBeInTheDocument()
  })
})
