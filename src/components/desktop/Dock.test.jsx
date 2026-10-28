import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { apps } from '../../data/apps'
import { createInitialState } from '../../hooks/useWindowManager'
import Dock from './Dock'

function windowsWith(openIds) {
  const { windows } = createInitialState(apps)
  for (const id of openIds) windows[id] = { ...windows[id], isOpen: true }
  return windows
}

describe('Dock', () => {
  it('shows a button for every app', () => {
    render(<Dock apps={apps} windows={windowsWith([])} onOpen={() => {}} />)
    const dock = screen.getByRole('navigation', { name: 'Dock' })
    for (const title of ['About Me', 'Resume', 'Contact', 'Music Favorite']) {
      expect(within(dock).getByRole('button', { name: title })).toBeInTheDocument()
    }
  })

  it('opens the clicked app', () => {
    const onOpen = vi.fn()
    render(<Dock apps={apps} windows={windowsWith([])} onOpen={onOpen} />)
    fireEvent.click(screen.getByRole('button', { name: 'Music Favorite' }))
    expect(onOpen).toHaveBeenCalledWith('music')
  })

  it.each([
    ['GitHub', 'https://github.com/Dwinatasarijuwita'],
    ['LinkedIn', 'https://www.linkedin.com/in/dwi-natasari-juwita-970474218/'],
    ['Instagram', 'https://www.instagram.com/tasyakstr/'],
  ])('opens %s in a new tab as a link', (name, href) => {
    const onOpen = vi.fn()
    render(<Dock apps={apps} windows={windowsWith([])} onOpen={onOpen} />)
    const link = within(screen.getByRole('navigation', { name: 'Dock' })).getByRole('link', { name })
    expect(link).toHaveAttribute('href', href)
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    fireEvent.click(link)
    expect(onOpen).not.toHaveBeenCalled()
  })

  it('marks open apps', () => {
    render(<Dock apps={apps} windows={windowsWith(['contact'])} onOpen={() => {}} />)
    expect(screen.getByRole('button', { name: 'Contact' })).toHaveAttribute('data-open', 'true')
    expect(screen.getByRole('button', { name: 'About Me' })).toHaveAttribute('data-open', 'false')
  })

  it('separates Trash from the other apps with a divider', () => {
    render(<Dock apps={apps} windows={windowsWith([])} onOpen={() => {}} />)
    const dock = screen.getByRole('navigation', { name: 'Dock' })
    const separators = within(dock).getAllByRole('separator')
    expect(separators).toHaveLength(1)
    const trash = within(dock).getByRole('button', { name: 'Trash' })
    expect(separators[0].compareDocumentPosition(trash) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(within(dock).getByRole('link', { name: 'Instagram' }).compareDocumentPosition(separators[0]) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })
})
