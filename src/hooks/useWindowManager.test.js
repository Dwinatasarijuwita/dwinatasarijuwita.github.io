import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createInitialState, useWindowManager, windowReducer } from './useWindowManager'

const apps = [
  { id: 'a', initialPosition: { x: 10, y: 20 } },
  { id: 'b', initialPosition: { x: 50, y: 60 } },
]

const run = (...actions) => actions.reduce(windowReducer, createInitialState(apps))
const open = (id) => ({ type: 'open', id })

describe('windowReducer', () => {
  it('starts with every window closed and nothing active', () => {
    const state = run()
    expect(state.activeId).toBeNull()
    expect(state.windows.a).toEqual({
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      position: { x: 10, y: 20 },
      zIndex: 0,
    })
  })

  it('opens a window and makes it active', () => {
    const state = run(open('a'))
    expect(state.windows.a.isOpen).toBe(true)
    expect(state.activeId).toBe('a')
  })

  it('stacks the most recently opened or focused window on top', () => {
    let state = run(open('a'), open('b'))
    expect(state.windows.b.zIndex).toBeGreaterThan(state.windows.a.zIndex)
    expect(state.activeId).toBe('b')

    state = windowReducer(state, { type: 'focus', id: 'a' })
    expect(state.windows.a.zIndex).toBeGreaterThan(state.windows.b.zIndex)
    expect(state.activeId).toBe('a')
  })

  it('only focuses a window that is already open', () => {
    const state = run(open('a'), open('b'), open('a'))
    expect(state.windows.a.isOpen).toBe(true)
    expect(state.windows.b.isOpen).toBe(true)
    expect(state.activeId).toBe('a')
  })

  it('closing resets the position and hands focus to the next window', () => {
    const state = run(open('a'), { type: 'move', id: 'a', position: { x: 300, y: 400 } }, open('b'), {
      type: 'close',
      id: 'a',
    })
    expect(state.windows.a.isOpen).toBe(false)
    expect(state.windows.a.position).toEqual({ x: 10, y: 20 })
    expect(state.activeId).toBe('b')
  })

  it('closing the last window leaves nothing active', () => {
    expect(run(open('a'), { type: 'close', id: 'a' }).activeId).toBeNull()
  })

  it('closing all resets every window, minimized ones included, and leaves nothing active', () => {
    const state = run(
      open('a'),
      { type: 'move', id: 'a', position: { x: 300, y: 400 } },
      { type: 'toggleMaximize', id: 'a' },
      open('b'),
      { type: 'minimize', id: 'b' },
      { type: 'closeAll', ids: ['a', 'b'] },
    )
    expect(state.windows).toEqual(createInitialState(apps).windows)
    expect(state.activeId).toBeNull()
  })

  it('closing all leaves windows outside the list open and hands them focus', () => {
    const three = [...apps, { id: 'c', initialPosition: { x: 0, y: 0 } }]
    const state = [open('c'), open('a'), open('b'), { type: 'closeAll', ids: ['a', 'b'] }].reduce(
      windowReducer,
      createInitialState(three),
    )
    expect(state.windows.c.isOpen).toBe(true)
    expect(state.windows.a.isOpen).toBe(false)
    expect(state.activeId).toBe('c')
  })

  it('minimizing keeps the window open and moves focus to the next visible window', () => {
    const state = run(open('a'), open('b'), { type: 'minimize', id: 'b' })
    expect(state.windows.b.isOpen).toBe(true)
    expect(state.windows.b.isMinimized).toBe(true)
    expect(state.activeId).toBe('a')
  })

  it('reopening a minimized window restores it at its last position', () => {
    const state = run(
      open('a'),
      { type: 'move', id: 'a', position: { x: 300, y: 400 } },
      { type: 'minimize', id: 'a' },
      open('a'),
    )
    expect(state.windows.a.isMinimized).toBe(false)
    expect(state.windows.a.position).toEqual({ x: 300, y: 400 })
    expect(state.activeId).toBe('a')
  })

  it('ignores focus on a minimized window', () => {
    const before = run(open('a'), open('b'), { type: 'minimize', id: 'a' })
    expect(windowReducer(before, { type: 'focus', id: 'a' })).toBe(before)
  })

  it('toggles maximize without losing the position', () => {
    let state = run(open('a'), { type: 'toggleMaximize', id: 'a' })
    expect(state.windows.a.isMaximized).toBe(true)
    state = windowReducer(state, { type: 'toggleMaximize', id: 'a' })
    expect(state.windows.a.isMaximized).toBe(false)
    expect(state.windows.a.position).toEqual({ x: 10, y: 20 })
  })

  it('ignores unknown window ids', () => {
    const before = run()
    expect(windowReducer(before, open('missing'))).toBe(before)
  })
})

describe('useWindowManager', () => {
  it('exposes the state and actions', () => {
    const { result } = renderHook(() => useWindowManager(apps))
    act(() => result.current.open('b'))
    expect(result.current.windows.b.isOpen).toBe(true)
    expect(result.current.activeId).toBe('b')

    act(() => result.current.closeAll(['a', 'b']))
    expect(result.current.windows.b.isOpen).toBe(false)
    expect(result.current.activeId).toBeNull()
  })
})
