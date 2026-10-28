import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import ForceQuitDialog from './ForceQuitDialog'

const openApps = [
  { id: 'about', title: 'About Me' },
  { id: 'music', title: 'Music Favorite' },
  { id: 'photos', title: 'Photos' },
]

function setup(apps = openApps) {
  const props = {
    apps,
    isActive: true,
    zIndex: 1,
    onFocus: vi.fn(),
    onQuit: vi.fn(),
    onQuitAll: vi.fn(),
    onClose: vi.fn(),
  }
  const view = render(<ForceQuitDialog {...props} />)
  return { ...props, rerender: (next) => view.rerender(<ForceQuitDialog {...props} apps={next} />) }
}

const list = () => screen.getByRole('listbox', { name: 'Open apps' })
const selected = () => within(list()).getByRole('option', { selected: true })
const forceQuitButton = () => screen.getByRole('button', { name: 'Force Quit' })
const quitAllButton = () => screen.getByRole('button', { name: 'Quit All' })

describe('ForceQuitDialog', () => {
  it('lists the open apps with the first one selected and the list focused', () => {
    setup()
    expect(screen.getByRole('dialog', { name: 'Force Quit Applications' })).toBeInTheDocument()
    expect(within(list()).getAllByRole('option').map((option) => option.textContent)).toEqual([
      'About Me',
      'Music Favorite',
      'Photos',
    ])
    expect(selected()).toHaveTextContent('About Me')
    expect(list()).toHaveFocus()
    expect(list()).toHaveAttribute('aria-activedescendant', selected().id)
  })

  it('force quits the app chosen by click or arrow keys', () => {
    const { onQuit } = setup()
    fireEvent.click(within(list()).getByRole('option', { name: 'Photos' }))
    expect(selected()).toHaveTextContent('Photos')

    fireEvent.keyDown(list(), { key: 'ArrowUp' })
    expect(selected()).toHaveTextContent('Music Favorite')
    fireEvent.keyDown(list(), { key: 'ArrowDown' })
    fireEvent.keyDown(list(), { key: 'ArrowDown' })
    expect(selected()).toHaveTextContent('Photos')

    fireEvent.click(forceQuitButton())
    expect(onQuit).toHaveBeenCalledWith('photos')
  })

  it('force quits the selected app with Enter', () => {
    const { onQuit } = setup()
    fireEvent.keyDown(list(), { key: 'Enter' })
    expect(onQuit).toHaveBeenCalledWith('about')
  })

  it('selects the app that took the place of the one just quit', () => {
    const { rerender } = setup()
    fireEvent.click(within(list()).getByRole('option', { name: 'Music Favorite' }))
    rerender([openApps[0], openApps[2]])
    expect(selected()).toHaveTextContent('Photos')

    rerender([openApps[0]])
    expect(selected()).toHaveTextContent('About Me')
  })

  it('quits every app at once', () => {
    const { onQuitAll } = setup()
    fireEvent.click(quitAllButton())
    expect(onQuitAll).toHaveBeenCalledOnce()
  })

  it('greys out both buttons when nothing is open', () => {
    setup([])
    expect(screen.getByText('No apps are open.')).toBeInTheDocument()
    expect(forceQuitButton()).toBeDisabled()
    expect(quitAllButton()).toBeDisabled()
  })

  it('closes with Escape or its red button', () => {
    const { onClose } = setup()
    fireEvent.keyDown(list(), { key: 'Escape' })
    fireEvent.click(screen.getByRole('button', { name: 'Close Force Quit Applications' }))
    expect(onClose).toHaveBeenCalledTimes(2)
  })
})
