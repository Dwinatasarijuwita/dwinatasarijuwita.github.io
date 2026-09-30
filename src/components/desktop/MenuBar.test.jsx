import { act, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import MenuBar from './MenuBar'

afterEach(() => {
  vi.useRealTimers()
})

describe('MenuBar', () => {
  it('shows the active app name and the logo', () => {
    render(<MenuBar appName="Music Favorite" />)
    expect(screen.getByLabelText('Aplikasi aktif')).toHaveTextContent('Music Favorite')
    expect(screen.getByRole('img', { name: 'Logo' })).toBeInTheDocument()
  })

  it('updates the clock when the minute changes and cleans up its timer', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 8, 30, 14, 5, 50))
    const { unmount } = render(<MenuBar appName="Finder" />)
    expect(screen.getByText('Rab 30 Sep 14.05')).toBeInTheDocument()

    act(() => vi.advanceTimersByTime(10_000))
    expect(screen.getByText('Rab 30 Sep 14.06')).toBeInTheDocument()

    unmount()
    expect(vi.getTimerCount()).toBe(0)
  })
})
