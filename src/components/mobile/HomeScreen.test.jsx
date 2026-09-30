import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import HomeScreen from './HomeScreen'

const tap = (name) => fireEvent.click(within(screen.getByRole('navigation', { name: 'Dock' })).getByRole('button', { name }))

afterEach(() => {
  vi.restoreAllMocks()
})

describe('HomeScreen', () => {
  it('shows the greeting widget and three apps in the dock', () => {
    render(<HomeScreen />)
    expect(within(screen.getByRole('region', { name: 'Sapaan' })).getByText('Dwi Natasari Juwita')).toBeInTheDocument()
    const dock = screen.getByRole('navigation', { name: 'Dock' })
    expect(within(dock).getAllByRole('button')).toHaveLength(3)
    expect(within(dock).queryByRole('button', { name: 'Resume' })).not.toBeInTheDocument()
  })

  it('shows Resume as a labelled app icon below the greeting widget', () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, headers: { get: () => 'text/html' } }))
    render(<HomeScreen />)
    const grid = screen.getByRole('list', { name: 'Aplikasi' })
    const greeting = screen.getByRole('region', { name: 'Sapaan' })
    expect(greeting.compareDocumentPosition(grid) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()

    const resume = within(grid).getByRole('button', { name: 'Resume' })
    expect(resume).toHaveTextContent('Resume')
    fireEvent.click(resume)
    expect(screen.getByRole('dialog', { name: 'Resume' })).toBeInTheDocument()
    vi.unstubAllGlobals()
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
    fireEvent.click(screen.getByRole('button', { name: /Kembali/ }))
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
    const closeButton = screen.getByRole('button', { name: /Kembali/ })
    fireEvent.click(closeButton)
    fireEvent.click(closeButton)
    expect(back).toHaveBeenCalledTimes(1)
  })
})
