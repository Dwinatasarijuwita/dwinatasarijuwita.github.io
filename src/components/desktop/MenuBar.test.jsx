import { act, fireEvent, render, screen } from '@testing-library/react'
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

  describe('profile menu', () => {
    const profileButton = () => screen.getByRole('button', { name: 'Profile menu' })
    const forceQuitItem = () => screen.getByRole('menuitem', { name: 'Force Quit…' })

    it('opens from the avatar like the Apple menu and focuses its first item', () => {
      render(<MenuBar appName="Finder" canForceQuit onForceQuit={() => {}} />)
      expect(profileButton()).toHaveAttribute('aria-haspopup', 'menu')
      expect(profileButton()).toHaveAttribute('aria-expanded', 'false')
      expect(screen.queryByRole('menu')).not.toBeInTheDocument()

      fireEvent.click(profileButton())
      expect(profileButton()).toHaveAttribute('aria-expanded', 'true')
      expect(forceQuitItem()).toHaveFocus()

      fireEvent.click(profileButton())
      expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    })

    it('runs Force Quit and closes the menu', () => {
      const onForceQuit = vi.fn()
      render(<MenuBar appName="Finder" canForceQuit onForceQuit={onForceQuit} />)
      fireEvent.click(profileButton())
      fireEvent.click(forceQuitItem())
      expect(onForceQuit).toHaveBeenCalledOnce()
      expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    })

    it('greys out Force Quit when no app is open', () => {
      const onForceQuit = vi.fn()
      render(<MenuBar appName="Finder" canForceQuit={false} onForceQuit={onForceQuit} />)
      fireEvent.click(profileButton())
      expect(forceQuitItem()).toHaveAttribute('aria-disabled', 'true')
      fireEvent.click(forceQuitItem())
      expect(onForceQuit).not.toHaveBeenCalled()
      expect(screen.getByRole('menu')).toBeInTheDocument()
    })

    it('closes on Escape and gives focus back to the avatar', () => {
      render(<MenuBar appName="Finder" canForceQuit onForceQuit={() => {}} />)
      fireEvent.click(profileButton())
      fireEvent.keyDown(forceQuitItem(), { key: 'Escape' })
      expect(screen.queryByRole('menu')).not.toBeInTheDocument()
      expect(profileButton()).toHaveFocus()
    })

    it('closes when clicking anywhere else', () => {
      render(<MenuBar appName="Finder" canForceQuit onForceQuit={() => {}} />)
      fireEvent.click(profileButton())
      fireEvent.pointerDown(document.body)
      expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    })

    it('closes when the menu bar hides for full screen', () => {
      const { rerender } = render(<MenuBar appName="Finder" canForceQuit onForceQuit={() => {}} />)
      fireEvent.click(profileButton())
      // Going full screen moves focus off the bar first, otherwise the bar stays revealed for the keyboard.
      act(() => forceQuitItem().blur())
      rerender(<MenuBar appName="Finder" autoHide canForceQuit onForceQuit={() => {}} />)
      expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    })
  })
})
