export const THEME_STORAGE_KEY = 'theme'
export const THEME_PREFERENCES = ['light', 'dark', 'auto']
export const SYSTEM_DARK_QUERY = '(prefers-color-scheme: dark)'

// Storage can be blocked (e.g. Safari private mode); the site then simply follows the device.
export function readPreference() {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    return THEME_PREFERENCES.includes(stored) ? stored : 'auto'
  } catch {
    return 'auto'
  }
}

export function writePreference(preference) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, preference)
  } catch {
    // The choice still applies for this visit; it just isn't remembered.
  }
}

export function resolveTheme(preference, systemDark) {
  if (preference === 'auto') return systemDark ? 'dark' : 'light'
  return preference
}

export function applyTheme(theme) {
  const root = document.documentElement
  root.classList.toggle('dark', theme === 'dark')
  root.style.colorScheme = theme
}
