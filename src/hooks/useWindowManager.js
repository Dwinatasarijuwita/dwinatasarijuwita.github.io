import { useMemo, useReducer } from 'react'

export function createInitialState(apps) {
  const windows = {}
  const initialPositions = {}
  for (const app of apps) {
    initialPositions[app.id] = app.initialPosition
    windows[app.id] = {
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      position: app.initialPosition,
      zIndex: 0,
    }
  }
  return { windows, activeId: null, topZ: 0, initialPositions }
}

function topmostVisible(windows) {
  let best = null
  for (const [id, win] of Object.entries(windows)) {
    if (!win.isOpen || win.isMinimized) continue
    if (best === null || win.zIndex > windows[best].zIndex) best = id
  }
  return best
}

function update(state, id, changes) {
  return { ...state, windows: { ...state.windows, [id]: { ...state.windows[id], ...changes } } }
}

function bringToFront(state, id, changes = {}) {
  const topZ = state.topZ + 1
  return { ...update(state, id, { ...changes, zIndex: topZ }), topZ, activeId: id }
}

export function windowReducer(state, action) {
  const { id } = action
  const win = state.windows[id]
  if (!win) return state

  switch (action.type) {
    case 'open':
      return bringToFront(state, id, { isOpen: true, isMinimized: false })
    case 'focus':
      if (!win.isOpen || win.isMinimized || state.activeId === id) return state
      return bringToFront(state, id)
    case 'close': {
      const next = update(state, id, {
        isOpen: false,
        isMinimized: false,
        isMaximized: false,
        position: state.initialPositions[id],
        zIndex: 0,
      })
      return { ...next, activeId: topmostVisible(next.windows) }
    }
    case 'minimize': {
      const next = update(state, id, { isMinimized: true })
      return { ...next, activeId: topmostVisible(next.windows) }
    }
    case 'toggleMaximize':
      return bringToFront(state, id, { isMaximized: !win.isMaximized })
    case 'move':
      return update(state, id, { position: action.position })
    default:
      return state
  }
}

export function useWindowManager(apps) {
  const [state, dispatch] = useReducer(windowReducer, apps, createInitialState)

  const actions = useMemo(
    () => ({
      open: (id) => dispatch({ type: 'open', id }),
      close: (id) => dispatch({ type: 'close', id }),
      minimize: (id) => dispatch({ type: 'minimize', id }),
      toggleMaximize: (id) => dispatch({ type: 'toggleMaximize', id }),
      focus: (id) => dispatch({ type: 'focus', id }),
      move: (id, position) => dispatch({ type: 'move', id, position }),
    }),
    [],
  )

  return { windows: state.windows, activeId: state.activeId, ...actions }
}
