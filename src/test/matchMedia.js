let mobile = false
const listeners = new Set()

function matchMedia(query) {
  const isWidthQuery = query.includes('max-width')
  return {
    media: query,
    get matches() {
      return isWidthQuery ? mobile : false
    },
    onchange: null,
    addEventListener: (_type, listener) => {
      if (isWidthQuery) listeners.add(listener)
    },
    removeEventListener: (_type, listener) => listeners.delete(listener),
    addListener: (listener) => {
      if (isWidthQuery) listeners.add(listener)
    },
    removeListener: (listener) => listeners.delete(listener),
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

export function resetMatchMedia() {
  mobile = false
  listeners.clear()
}
