import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Desktop from './Desktop'

const dockButton = (name) => within(screen.getByRole('navigation', { name: 'Dock' })).getByRole('button', { name })
const openFromDock = (name) => fireEvent.click(dockButton(name))
const activeApp = () => screen.getByLabelText('Active app')
const resumeFile = () => screen.getByRole('button', { name: 'Dwi Natasari Juwita - CV.pdf' })

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, headers: { get: () => 'text/html' } }))
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('Desktop', () => {
  it('starts with no windows and the owner name in the menu bar', () => {
    render(<Desktop />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(activeApp()).toHaveTextContent('Dwi Natasari Juwita')
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
    fireEvent.click(screen.getByRole('button', { name: 'Close Contact' }))
    await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Contact' })).not.toBeInTheDocument())
    expect(activeApp()).toHaveTextContent('Dwi Natasari Juwita')
    expect(dockButton('Contact')).toHaveAttribute('data-open', 'false')
  })

  it('minimizes to the Dock and restores from it', () => {
    render(<Desktop />)
    openFromDock('Music Favorite')
    fireEvent.click(screen.getByRole('button', { name: 'Minimize Music Favorite' }))

    expect(screen.queryByRole('dialog', { name: 'Music Favorite' })).not.toBeInTheDocument()
    expect(dockButton('Music Favorite')).toHaveAttribute('data-open', 'true')
    expect(activeApp()).toHaveTextContent('Dwi Natasari Juwita')

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

  it('shows Resume as a file on the desktop instead of in the Dock', () => {
    render(<Desktop />)
    const dock = screen.getByRole('navigation', { name: 'Dock' })
    expect(within(dock).queryByRole('button', { name: 'Resume' })).not.toBeInTheDocument()
    expect(within(dock).getAllByRole('button')).toHaveLength(4)

    fireEvent.click(resumeFile())
    expect(screen.getByRole('dialog', { name: 'Resume' })).toBeInTheDocument()
    expect(activeApp()).toHaveTextContent('Resume')
  })

  it('shows Work Experience as a document file below the CV and opens it in a window', () => {
    render(<Desktop />)
    const files = within(screen.getByRole('list', { name: 'Desktop' })).getAllByRole('button')
    expect(files.map((file) => file.getAttribute('aria-label'))).toEqual(['Dwi Natasari Juwita - CV.pdf', 'Work Experience'])
    expect(files[1]).toHaveTextContent('DOC')

    fireEvent.click(files[1])
    expect(screen.getByRole('dialog', { name: 'Experience' })).toBeInTheDocument()
    expect(activeApp()).toHaveTextContent('Experience')
  })

  it('restores a minimized Resume from its desktop file', () => {
    render(<Desktop />)
    fireEvent.click(resumeFile())
    fireEvent.click(screen.getByRole('button', { name: 'Minimize Resume' }))
    expect(screen.queryByRole('dialog', { name: 'Resume' })).not.toBeInTheDocument()

    fireEvent.click(resumeFile())
    expect(screen.getByRole('dialog', { name: 'Resume' })).toBeInTheDocument()
  })

  it('moves focus from the Dock into the window it opens', () => {
    render(<Desktop />)
    dockButton('Photos').focus()
    openFromDock('Photos')
    expect(screen.getByRole('dialog', { name: 'Photos' })).toHaveFocus()
  })

  it('moves focus to the window brought to the front and leaves focus inside it alone', () => {
    render(<Desktop />)
    openFromDock('Contact')
    const contact = screen.getByRole('dialog', { name: 'Contact' })
    const closeButton = within(contact).getByRole('button', { name: 'Close Contact' })
    closeButton.focus()
    fireEvent.pointerDown(contact)
    expect(closeButton).toHaveFocus()

    openFromDock('About Me')
    expect(screen.getByRole('dialog', { name: 'About Me' })).toHaveFocus()
  })

  it('keeps windows in their own layer so the Dock and menu bar stay on top', () => {
    render(<Desktop />)
    openFromDock('About Me')
    expect(screen.getByRole('dialog', { name: 'About Me' }).parentElement).toHaveClass('isolate')
  })

  it('goes full screen on maximize and hides the Dock until the cursor reaches the bottom edge', () => {
    render(<Desktop />)
    openFromDock('About Me')
    const dock = screen.getByRole('navigation', { name: 'Dock' })
    expect(dock).toHaveAttribute('data-hidden', 'false')

    fireEvent.click(screen.getByRole('button', { name: 'Maximize About Me' }))
    const win = screen.getByRole('dialog', { name: 'About Me' })
    expect(win.style.height).toBe('calc(100% + 28px)')
    expect(win.style.maxHeight).toBe('calc(100% + 28px)')
    expect(dock).toHaveAttribute('data-hidden', 'true')

    fireEvent.mouseEnter(screen.getByTestId('dock-reveal-zone'))
    expect(dock).toHaveAttribute('data-hidden', 'false')
    fireEvent.mouseLeave(dock)
    expect(dock).toHaveAttribute('data-hidden', 'true')

    fireEvent.focus(within(dock).getByRole('button', { name: 'Contact' }))
    expect(dock).toHaveAttribute('data-hidden', 'false')
    fireEvent.blur(within(dock).getByRole('button', { name: 'Contact' }))

    fireEvent.click(screen.getByRole('button', { name: 'Maximize About Me' }))
    expect(dock).toHaveAttribute('data-hidden', 'false')
  })

  it('shows the Dock again when a normal window becomes active', () => {
    render(<Desktop />)
    openFromDock('About Me')
    fireEvent.click(screen.getByRole('button', { name: 'Maximize About Me' }))
    openFromDock('Contact')
    expect(screen.getByRole('navigation', { name: 'Dock' })).toHaveAttribute('data-hidden', 'false')
  })

  it('draws the traffic light symbols as centred icons, not text', () => {
    render(<Desktop />)
    openFromDock('About Me')
    for (const name of ['Close About Me', 'Minimize About Me', 'Maximize About Me']) {
      const button = screen.getByRole('button', { name })
      expect(button.querySelector('svg')).not.toBeNull()
      expect(button).toHaveTextContent(/^$/)
    }
  })

  it('hides the Dock again when the cursor leaves the bottom edge without entering it', () => {
    render(<Desktop />)
    openFromDock('About Me')
    fireEvent.click(screen.getByRole('button', { name: 'Maximize About Me' }))
    const zone = screen.getByTestId('dock-reveal-zone')
    fireEvent.mouseEnter(zone)
    fireEvent.mouseLeave(zone, { relatedTarget: document.body })
    expect(screen.getByRole('navigation', { name: 'Dock' })).toHaveAttribute('data-hidden', 'true')
  })

  it('only blocks clicks where the Dock itself is drawn', () => {
    render(<Desktop />)
    expect(screen.getByRole('navigation', { name: 'Dock' })).toHaveClass('pointer-events-none')
  })

  it('hides the menu bar in full screen until the cursor reaches the top edge', () => {
    render(<Desktop />)
    openFromDock('About Me')
    const menuBar = screen.getByTestId('menu-bar')
    expect(menuBar).toHaveAttribute('data-hidden', 'false')

    fireEvent.click(screen.getByRole('button', { name: 'Maximize About Me' }))
    expect(menuBar).toHaveAttribute('data-hidden', 'true')

    fireEvent.mouseEnter(screen.getByTestId('menu-bar-reveal-zone'))
    expect(menuBar).toHaveAttribute('data-hidden', 'false')
    fireEvent.mouseLeave(menuBar)
    expect(menuBar).toHaveAttribute('data-hidden', 'true')

    fireEvent.click(screen.getByRole('button', { name: 'Maximize About Me' }))
    expect(menuBar).toHaveAttribute('data-hidden', 'false')
  })

  it('covers the whole screen with square corners in full screen', () => {
    render(<Desktop />)
    openFromDock('About Me')
    const win = screen.getByRole('dialog', { name: 'About Me' })
    expect(win).toHaveClass('rounded-xl')

    fireEvent.click(screen.getByRole('button', { name: 'Maximize About Me' }))
    expect(win).toHaveClass('rounded-none')
    expect(win).not.toHaveClass('rounded-xl')
    expect(win.style.height).toBe('calc(100% + 28px)')

    fireEvent.click(screen.getByRole('button', { name: 'Maximize About Me' }))
    expect(win).toHaveClass('rounded-xl')
  })

  it('opens Photos from the Dock', () => {
    render(<Desktop />)
    openFromDock('Photos')
    expect(screen.getByRole('dialog', { name: 'Photos' })).toBeInTheDocument()
  })
})
