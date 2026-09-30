import { act, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import MenuBar from './MenuBar'

afterEach(() => {
  vi.useRealTimers()
})

describe('MenuBar', () => {
  it('shows the active app name and the profile photo instead of a logo', () => {
    render(<MenuBar appName="Music Favorite" />)
    expect(screen.getByLabelText('Active app')).toHaveTextContent('Music Favorite')
    expect(screen.getByRole('img', { name: 'Avatar Dwi Natasari Juwita' })).toBeInTheDocument()
    expect(screen.queryByRole('img', { name: 'Logo' })).not.toBeInTheDocument()
  })

  it('updates the clock when the minute changes and cleans up its timer', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 8, 30, 14, 5, 50))
    const { unmount } = render(<MenuBar appName="Finder" />)
    expect(screen.getByText('Wed Sep 30 2:05 PM')).toBeInTheDocument()

    act(() => vi.advanceTimersByTime(10_000))
    expect(screen.getByText('Wed Sep 30 2:06 PM')).toBeInTheDocument()

    unmount()
    expect(vi.getTimerCount()).toBe(0)
  })
})
