import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { WindowActiveContext } from '../hooks/useWindowActive'
import PhotosApp from './PhotosApp'

const shownPhoto = () => screen.getByRole('img', { name: /^Photo \d+ of \d+$/ })
const thumbnail = (n) => within(screen.getByRole('list', { name: 'All photos' })).getByRole('button', { name: `Show photo ${n}` })
const albums = () => screen.getByRole('group', { name: 'Albums' })
const openPhoto = (n) => fireEvent.click(screen.getByRole('button', { name: `Open photo ${n}` }))

describe('PhotosApp', () => {
  it('opens on the whole library as a grid', () => {
    render(<PhotosApp />)
    expect(screen.getByRole('heading', { name: 'Library' })).toBeInTheDocument()
    expect(screen.getByText('13 photos')).toBeInTheDocument()
    expect(within(screen.getByRole('list', { name: 'Library photos' })).getAllByRole('button')).toHaveLength(13)
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('filters the grid by album', () => {
    render(<PhotosApp />)
    fireEvent.click(within(albums()).getByRole('button', { name: 'Moments' }))
    expect(within(albums()).getByRole('button', { name: 'Moments' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('heading', { name: 'Moments' })).toBeInTheDocument()
    expect(within(screen.getByRole('list', { name: 'Moments photos' })).getAllByRole('button')).toHaveLength(4)
  })

  it('opens a photo in the viewer and moves through the strip', () => {
    render(<PhotosApp />)
    openPhoto(2)
    expect(screen.getByRole('dialog', { name: 'Photo viewer' })).toBeInTheDocument()
    expect(shownPhoto()).toHaveAccessibleName('Photo 2 of 13')
    expect(screen.getByRole('button', { name: 'Done' })).toHaveFocus()
    fireEvent.click(thumbnail(5))
    expect(shownPhoto()).toHaveAccessibleName('Photo 5 of 13')
    expect(thumbnail(5)).toHaveAttribute('aria-current', 'true')
  })

  it('moves with the arrow buttons and keys, stopping at the ends', () => {
    render(<PhotosApp />)
    openPhoto(1)
    expect(screen.getByRole('button', { name: 'Previous photo' })).toBeDisabled()
    fireEvent.click(screen.getByRole('button', { name: 'Next photo' }))
    fireEvent.keyDown(window, { key: 'ArrowRight' })
    expect(shownPhoto()).toHaveAccessibleName('Photo 3 of 13')
    fireEvent.keyDown(window, { key: 'ArrowLeft' })
    expect(shownPhoto()).toHaveAccessibleName('Photo 2 of 13')
    fireEvent.click(thumbnail(13))
    fireEvent.keyDown(window, { key: 'ArrowRight' })
    expect(shownPhoto()).toHaveAccessibleName('Photo 13 of 13')
    expect(screen.getByRole('button', { name: 'Next photo' })).toBeDisabled()
  })

  it('only moves through the album it was opened from', () => {
    render(<PhotosApp />)
    fireEvent.click(within(albums()).getByRole('button', { name: 'Me' }))
    openPhoto(1)
    expect(shownPhoto()).toHaveAccessibleName('Photo 1 of 4')
    expect(within(screen.getByRole('list', { name: 'All photos' })).getAllByRole('button')).toHaveLength(4)
  })

  it('closes with Done or Escape and returns focus to the photo in the grid', () => {
    render(<PhotosApp />)
    openPhoto(3)
    fireEvent.keyDown(window, { key: 'ArrowRight' })
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(screen.getByRole('button', { name: 'Open photo 4' })).toHaveFocus()
    openPhoto(1)
    fireEvent.click(screen.getByRole('button', { name: 'Done' }))
    expect(screen.getByRole('button', { name: 'Open photo 1' })).toHaveFocus()
  })

  it('ignores the arrow keys while its window is not the active one', () => {
    render(
      <WindowActiveContext.Provider value={false}>
        <PhotosApp />
      </WindowActiveContext.Provider>,
    )
    openPhoto(1)
    fireEvent.keyDown(window, { key: 'ArrowRight' })
    expect(shownPhoto()).toHaveAccessibleName('Photo 1 of 13')
  })
})
