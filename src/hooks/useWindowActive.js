import { createContext, useContext } from 'react'

// True while the app's window is the front, visible one. Mobile sheets are always active.
export const WindowActiveContext = createContext(true)

export function useWindowActive() {
  return useContext(WindowActiveContext)
}
