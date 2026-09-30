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

  it('marks open apps', () => {
    render(<Dock apps={apps} windows={windowsWith(['contact'])} onOpen={() => {}} />)
    expect(screen.getByRole('button', { name: 'Contact' })).toHaveAttribute('data-open', 'true')
    expect(screen.getByRole('button', { name: 'About Me' })).toHaveAttribute('data-open', 'false')
  })
})
