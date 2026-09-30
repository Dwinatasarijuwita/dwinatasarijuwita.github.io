import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Desktop from './Desktop'

const dockButton = (name) => within(screen.getByRole('navigation', { name: 'Dock' })).getByRole('button', { name })
const openFromDock = (name) => fireEvent.click(dockButton(name))
const activeApp = () => screen.getByLabelText('Aplikasi aktif')

describe('Desktop', () => {
  it('starts with no windows and Finder active', () => {
    render(<Desktop />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(activeApp()).toHaveTextContent('Finder')
  })

  it('opens a window from the Dock and marks it active', () => {
    render(<Desktop />)
    openFromDock('About Me')
    const win = screen.getByRole('dialog', { name: 'About Me' })
    expect(within(win).getByRole('heading', { name: 'Dwi Natasari Juwita' })).toBeInTheDocument()
    expect(activeApp()).toHaveTextContent('About Me')
    expect(dockButton('About Me')).toHaveAttribute('data-open', 'true')
  })

  it('closes a window with the red button', async () => {
    render(<Desktop />)
    openFromDock('Contact')
    fireEvent.click(screen.getByRole('button', { name: 'Tutup Contact' }))
    await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Contact' })).not.toBeInTheDocument())
    expect(activeApp()).toHaveTextContent('Finder')
    expect(dockButton('Contact')).toHaveAttribute('data-open', 'false')
  })

  it('minimizes to the Dock and restores from it', () => {
    render(<Desktop />)
    openFromDock('Music Favorite')
    fireEvent.click(screen.getByRole('button', { name: 'Minimize Music Favorite' }))

    expect(screen.queryByRole('dialog', { name: 'Music Favorite' })).not.toBeInTheDocument()
    expect(dockButton('Music Favorite')).toHaveAttribute('data-open', 'true')
    expect(activeApp()).toHaveTextContent('Finder')

    openFromDock('Music Favorite')
    expect(screen.getByRole('dialog', { name: 'Music Favorite' })).toBeInTheDocument()
    expect(activeApp()).toHaveTextContent('Music Favorite')
  })

  it('brings a clicked window to the front', () => {
    render(<Desktop />)
    openFromDock('About Me')
    openFromDock('Music Favorite')
    const about = screen.getByRole('dialog', { name: 'About Me' })
    const music = screen.getByRole('dialog', { name: 'Music Favorite' })

    fireEvent.pointerDown(about)

    expect(Number(about.style.zIndex)).toBeGreaterThan(Number(music.style.zIndex))
    expect(activeApp()).toHaveTextContent('About Me')
  })

  it('maximizes with the green button and restores with a title bar double-click', () => {
    render(<Desktop />)
    openFromDock('About Me')
    const win = screen.getByRole('dialog', { name: 'About Me' })
    expect(win.style.width).toBe('540px')

    fireEvent.click(screen.getByRole('button', { name: 'Maximize About Me' }))
    expect(win.style.width).toBe('100%')

    fireEvent.doubleClick(within(win).getByRole('heading', { name: 'About Me' }))
    expect(win.style.width).toBe('540px')
  })

  it('never lets a window grow past the desktop area on small screens', () => {
    render(<Desktop />)
    openFromDock('About Me')
    const win = screen.getByRole('dialog', { name: 'About Me' })
    expect(win.style.maxWidth).toBe('100%')
    expect(win.style.maxHeight).toBe('calc(100% - 88px)')
  })
})
