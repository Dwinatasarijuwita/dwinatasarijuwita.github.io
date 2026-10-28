let mobile = false
let systemDark = false
const listeners = new Set()
const systemDarkListeners = new Set()

function listenersFor(query) {
  if (query.includes('max-width')) return listeners
  if (query.includes('prefers-color-scheme: dark')) return systemDarkListeners
  return null
}

function matchMedia(query) {
  const isWidthQuery = query.includes('max-width')
  const isSystemDarkQuery = query.includes('prefers-color-scheme: dark')
  const own = listenersFor(query)
  return {
    media: query,
    get matches() {
      if (isWidthQuery) return mobile
      if (isSystemDarkQuery) return systemDark
      return false
    },
    onchange: null,
    addEventListener: (_type, listener) => own?.add(listener),
    removeEventListener: (_type, listener) => own?.delete(listener),
    addListener: (listener) => own?.add(listener),
    removeListener: (listener) => own?.delete(listener),
    dispatchEvent: () => false,
  }
}

export function installMatchMedia() {
  window.matchMedia = matchMedia
}

export function setMobile(value) {
  mobile = value
  listeners.forEach((listener) => listener({ matches: value }))
}

export function setSystemDark(value) {
  systemDark = value
  systemDarkListeners.forEach((listener) => listener({ matches: value }))
}

export function resetMatchMedia() {
  mobile = false
  systemDark = false
  listeners.clear()
  systemDarkListeners.clear()
}
