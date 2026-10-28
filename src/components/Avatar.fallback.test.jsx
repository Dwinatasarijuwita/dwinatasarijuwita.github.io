import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import Avatar from './Avatar'

vi.mock('../lib/profilePhoto', () => ({ profilePhotoUrl: null }))

describe('Avatar without a photo', () => {
  it('falls back to the initials', () => {
    render(<Avatar />)
    expect(screen.getByRole('img', { name: 'Avatar Dwi Natasari Juwita' })).toHaveTextContent('DJ')
  })
})
