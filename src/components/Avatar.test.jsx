import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Avatar from './Avatar'

describe('Avatar', () => {
  it('shows the initials with an accessible label', () => {
    render(<Avatar />)
    const avatar = screen.getByRole('img', { name: 'Avatar Dwi Natasari Juwita' })
    expect(avatar).toHaveTextContent('DJ')
  })

  it('applies the requested size', () => {
    render(<Avatar size="lg" />)
    expect(screen.getByRole('img')).toHaveClass('size-24')
  })
})
