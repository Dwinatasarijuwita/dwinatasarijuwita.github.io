import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Avatar from './Avatar'

describe('Avatar', () => {
  it('shows the profile photo with an accessible label', () => {
    render(<Avatar />)
    const avatar = screen.getByRole('img', { name: 'Avatar Dwi Natasari Juwita' })
    expect(avatar.tagName).toBe('IMG')
    expect(avatar.getAttribute('src')).toContain('dwi-natasari-juwita')
  })

  it('applies the requested size', () => {
    render(<Avatar size="lg" />)
    expect(screen.getByRole('img').parentElement).toHaveClass('size-24')
  })

  it('has an extra small size for the menu bar', () => {
    render(<Avatar size="xs" />)
    expect(screen.getByRole('img').parentElement).toHaveClass('size-5')
  })

  it('zooms in on the face', () => {
    render(<Avatar />)
    expect(screen.getByRole('img')).toHaveClass('scale-[1.4]')
  })
})
