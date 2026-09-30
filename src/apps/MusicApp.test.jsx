import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import MusicApp from './MusicApp'

vi.mock('../data/songs', () => ({
  songs: [
    { title: 'Lost Stars', artist: 'Adam Levine', url: 'https://open.spotify.com/track/1Duym1lVQurgKHHSqpOWhY' },
    { title: 'Tanpa Link', artist: 'Artis & Kawan', url: '' },
  ],
}))

describe('MusicApp', () => {
  it('shows the playlist header', () => {
    render(<MusicApp />)
    expect(screen.getByRole('heading', { name: 'Lagu Favorit DJ' })).toBeInTheDocument()
    expect(screen.getByText('2 lagu')).toBeInTheDocument()
  })

  it('links each song to Spotify in a new tab', () => {
    render(<MusicApp />)
    const link = screen.getByRole('link', { name: /Lost Stars/ })
    expect(link).toHaveAttribute('href', 'https://open.spotify.com/track/1Duym1lVQurgKHHSqpOWhY')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    expect(link).toHaveTextContent('Adam Levine')
  })

  it('falls back to a Spotify search when a song has no link', () => {
    render(<MusicApp />)
    expect(screen.getByRole('link', { name: /Tanpa Link/ })).toHaveAttribute(
      'href',
      'https://open.spotify.com/search/Tanpa%20Link%20Artis%20%26%20Kawan',
    )
  })
})
