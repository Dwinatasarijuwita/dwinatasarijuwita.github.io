import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { WindowActiveContext } from '../hooks/useWindowActive'
import PhotosApp from './PhotosApp'

const shownPhoto = () => screen.getByRole('img', { name: /^Photo \d+ of 13$/ })
const thumbnail = (n) => within(screen.getByRole('list', { name: 'All photos' })).getByRole('button', { name: `Show photo ${n}` })

describe('PhotosApp', () => {
  it('shows the first photo and a strip of thumbnails', () => {
    render(<PhotosApp />)
    expect(shownPhoto()).toHaveAccessibleName('Photo 1 of 13')
    expect(within(screen.getByRole('list', { name: 'All photos' })).getAllByRole('button')).toHaveLength(13)
    expect(thumbnail(1)).toHaveAttribute('aria-current', 'true')
  })

  it('shows a photo when its thumbnail is clicked', () => {
    render(<PhotosApp />)
    fireEvent.click(thumbnail(3))
    expect(shownPhoto()).toHaveAccessibleName('Photo 3 of 13')
    expect(thumbnail(3)).toHaveAttribute('aria-current', 'true')
    expect(thumbnail(1)).not.toHaveAttribute('aria-current')
  })

  it('moves with the left and right arrow keys', () => {
    render(<PhotosApp />)
    fireEvent.keyDown(window, { key: 'ArrowRight' })
    fireEvent.keyDown(window, { key: 'ArrowRight' })
    expect(shownPhoto()).toHaveAccessibleName('Photo 3 of 13')
    fireEvent.keyDown(window, { key: 'ArrowLeft' })
    expect(shownPhoto()).toHaveAccessibleName('Photo 2 of 13')
  })

  it('stops at the first and last photo', () => {
    render(<PhotosApp />)
    fireEvent.keyDown(window, { key: 'ArrowLeft' })
    expect(shownPhoto()).toHaveAccessibleName('Photo 1 of 13')
    fireEvent.click(thumbnail(13))
    fireEvent.keyDown(window, { key: 'ArrowRight' })
    expect(shownPhoto()).toHaveAccessibleName('Photo 13 of 13')
  })

  it('ignores the arrow keys while its window is not the active one', () => {
    render(
      <WindowActiveContext.Provider value={false}>
        <PhotosApp />
      </WindowActiveContext.Provider>,
    )
    fireEvent.keyDown(window, { key: 'ArrowRight' })
    expect(shownPhoto()).toHaveAccessibleName('Photo 1 of 13')
  })
})
