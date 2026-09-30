import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'
import Window from './Window'

const app = { id: 'resume', title: 'Resume', Component: () => <p>isi</p>, size: { width: 720, height: 560 } }
const state = { isOpen: true, isMinimized: false, isMaximized: false, position: { x: 220, y: 32 }, zIndex: 1 }
const noop = () => {}

function translate(element) {
  const read = (axis) => Number(element.style.transform.match(new RegExp(`translate${axis}\\((-?[\\d.]+)px\\)`))?.[1] ?? 0)
  return { x: read('X'), y: read('Y') }
}

function renderWindow(props) {
  return render(
    <Window
      app={app}
      state={state}
      isActive
      constraintsRef={createRef()}
      areaSize={{ width: 1440, height: 872 }}
      onFocus={noop}
      onClose={noop}
      onMinimize={noop}
      onToggleMaximize={noop}
      onMove={noop}
      {...props}
    />,
  )
}

describe('Window', () => {
  it('opens at its stored position when it fits', async () => {
    renderWindow()
    const win = screen.getByRole('dialog', { name: 'Resume' })
    await waitFor(() => expect(translate(win)).toEqual({ x: 220, y: 32 }))
  })

  it('moves back inside a desktop that is too small for its stored position', async () => {
    const { rerender } = renderWindow()
    rerender(
      <Window
        app={app}
        state={state}
        isActive
        constraintsRef={createRef()}
        areaSize={{ width: 900, height: 600 }}
        onFocus={noop}
        onClose={noop}
        onMinimize={noop}
        onToggleMaximize={noop}
        onMove={noop}
      />,
    )
    const win = screen.getByRole('dialog', { name: 'Resume' })
    await waitFor(() => expect(translate(win)).toEqual({ x: 180, y: 32 }))
  })

  it('can slide down behind the Dock like on a real Mac', async () => {
    renderWindow({ state: { ...state, position: { x: 220, y: 300 } } })
    const win = screen.getByRole('dialog', { name: 'Resume' })
    await waitFor(() => expect(translate(win)).toEqual({ x: 220, y: 300 }))
  })

  it('stops embedded content (like the PDF) from swallowing the pointer while the title bar is held', () => {
    renderWindow()
    const content = screen.getByText('isi').parentElement
    expect(content).not.toHaveClass('pointer-events-none')

    fireEvent.pointerDown(screen.getByRole('heading', { name: 'Resume' }))
    expect(content).toHaveClass('pointer-events-none')

    fireEvent.pointerUp(window)
    expect(content).not.toHaveClass('pointer-events-none')
  })

  it('slides up under the menu bar when maximized so it covers the whole screen', async () => {
    renderWindow({ state: { ...state, isMaximized: true } })
    const win = screen.getByRole('dialog', { name: 'Resume' })
    await waitFor(() => expect(translate(win)).toEqual({ x: 0, y: -28 }))
  })
})
