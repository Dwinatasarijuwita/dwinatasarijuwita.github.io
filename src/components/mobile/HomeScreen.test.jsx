import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import HomeScreen from './HomeScreen'

const tap = (name) => fireEvent.click(within(screen.getByRole('navigation', { name: 'Dock' })).getByRole('button', { name }))

afterEach(() => {
  vi.restoreAllMocks()
})

describe('HomeScreen', () => {
  it('shows the greeting widget and the four apps in the dock', () => {
    render(<HomeScreen />)
    expect(within(screen.getByRole('region', { name: 'Greeting' })).getByText('Dwi Natasari Juwita')).toBeInTheDocument()
    const dock = screen.getByRole('navigation', { name: 'Dock' })
    expect(within(dock).getAllByRole('button')).toHaveLength(4)
  })

  it('opens an app full screen and adds a history entry', () => {
    const pushState = vi.spyOn(window.history, 'pushState')
    render(<HomeScreen />)
    tap('Music Favorite')
    expect(screen.getByRole('dialog', { name: 'Music Favorite' })).toBeInTheDocument()
    expect(pushState).toHaveBeenCalledTimes(1)
    expect(window.history.state.app).toBe('music')
  })

  it('closes the app with the back button', async () => {
    render(<HomeScreen />)
    tap('About Me')
    fireEvent.click(screen.getByRole('button', { name: /Back/ }))
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })

  it('closes the app when the browser goes back', async () => {
    render(<HomeScreen />)
    tap('Contact')
    act(() => window.history.back())
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })

  it('adds only one history entry when an icon is tapped twice quickly', () => {
    const pushState = vi.spyOn(window.history, 'pushState')
    render(<HomeScreen />)
    tap('About Me')
    tap('About Me')
    expect(pushState).toHaveBeenCalledTimes(1)
  })

  it('goes back only once when close is pressed twice quickly', () => {
    const back = vi.spyOn(window.history, 'back').mockImplementation(() => {})
    render(<HomeScreen />)
    tap('About Me')
    const closeButton = screen.getByRole('button', { name: /Back/ })
    fireEvent.click(closeButton)
    fireEvent.click(closeButton)
    expect(back).toHaveBeenCalledTimes(1)
  })

  it('shows Photos as an app icon below the greeting while the Dock keeps four apps', () => {
    render(<HomeScreen />)
    expect(within(screen.getByRole('navigation', { name: 'Dock' })).getAllByRole('button')).toHaveLength(4)
    const grid = screen.getByRole('list', { name: 'Apps' })
    expect(within(grid).getByRole('button', { name: 'Photos' })).toHaveTextContent('Photos')
  })

  it('shows Projects, Experience, GitHub, LinkedIn, Instagram, Settings and Trash after Photos, with GitHub as a link that opens a new tab without adding history', () => {
    const pushState = vi.spyOn(window.history, 'pushState')
    render(<HomeScreen />)
    const items = within(screen.getByRole('list', { name: 'Apps' })).getAllByRole('listitem')
    expect(items.map((item) => item.textContent)).toEqual(['Photos', 'Projects', 'Experience', 'GitHub', 'LinkedIn', 'Instagram', 'Settings', 'Trash'])
    const link = within(items[3]).getByRole('link', { name: 'GitHub' })
    expect(link).toHaveAttribute('href', 'https://github.com/Dwinatasarijuwita')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    fireEvent.click(link)
    expect(pushState).not.toHaveBeenCalled()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('opens Projects from the home screen grid', () => {
    render(<HomeScreen />)
    fireEvent.click(within(screen.getByRole('list', { name: 'Apps' })).getByRole('button', { name: 'Projects' }))
    const sheet = screen.getByRole('dialog', { name: 'Projects' })
    expect(within(sheet).getByRole('list', { name: 'Projects' })).toBeInTheDocument()
  })
})
