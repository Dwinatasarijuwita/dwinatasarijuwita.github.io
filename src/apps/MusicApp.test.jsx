import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import MusicApp from './MusicApp'

vi.mock('../data/songs', () => ({
  songs: [
    { title: 'Lost Stars', artist: 'Adam Levine', url: 'https://open.spotify.com/track/1Duym1lVQurgKHHSqpOWhY', cover: '37677af5b4f23fe9dc8a3c04' },
    { title: 'Tanpa Link', artist: 'Artis & Kawan', url: '' },
  ],
}))

const nowPlaying = () => screen.getByRole('region', { name: 'Now playing' })

describe('MusicApp', () => {
  it('shows the playlist header', () => {
    render(<MusicApp />)
    expect(screen.getByRole('heading', { name: "Tasya's Favorite Songs" })).toBeInTheDocument()
    expect(screen.getByText('2 songs on repeat')).toBeInTheDocument()
  })

  it('starts on the first song with its Spotify player', async () => {
    render(<MusicApp />)
    // Without Spotify's iFrame API (as in tests) the player falls back to a plain embed.
    await waitFor(() => expect(screen.getByTitle('Play Lost Stars on Spotify').tagName).toBe('IFRAME'))
    expect(within(nowPlaying()).getByRole('heading', { name: 'Lost Stars' })).toBeInTheDocument()
    expect(screen.getByTitle('Play Lost Stars on Spotify')).toHaveAttribute('src', 'https://open.spotify.com/embed/track/1Duym1lVQurgKHHSqpOWhY?theme=0')
    expect(screen.getByRole('button', { name: /Lost Stars/ })).toHaveAttribute('aria-current', 'true')
  })

  it('links each song to Spotify in a new tab', () => {
    render(<MusicApp />)
    const link = screen.getByRole('link', { name: 'Open Lost Stars by Adam Levine in Spotify' })
    expect(link).toHaveAttribute('href', 'https://open.spotify.com/track/1Duym1lVQurgKHHSqpOWhY')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('falls back to a Spotify search when a song has no link', () => {
    render(<MusicApp />)
    fireEvent.click(screen.getByRole('button', { name: /Tanpa Link/ }))
    expect(within(nowPlaying()).getByRole('heading', { name: 'Tanpa Link' })).toBeInTheDocument()
    expect(screen.queryByTitle(/on Spotify/)).toBeNull()
    expect(within(nowPlaying()).getByRole('link', { name: 'Find on Spotify' })).toHaveAttribute(
      'href',
      'https://open.spotify.com/search/Tanpa%20Link%20Artis%20%26%20Kawan',
    )
  })
  it('searches by title or artist and says when nothing matches', () => {
    render(<MusicApp />)
    const search = screen.getByRole('searchbox', { name: 'Search songs' })
    fireEvent.change(search, { target: { value: 'kawan' } })
    expect(screen.getByRole('button', { name: /Tanpa Link/ })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Lost Stars/ })).toBeNull()
    fireEvent.change(search, { target: { value: 'zzz' } })
    expect(screen.getByText('No song matches “zzz”.')).toBeInTheDocument()
  })
})
