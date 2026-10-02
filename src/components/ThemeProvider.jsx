import { useCallback, useEffect, useMemo, useState } from 'react'
import { SYSTEM_DARK_QUERY, applyTheme, readPreference, resolveTheme, writePreference } from '../lib/theme'
import { ThemeContext } from '../lib/themeContext'

export default function ThemeProvider({ children }) {
  const [preference, setPreferenceState] = useState(readPreference)

  useEffect(() => {
    const query = window.matchMedia(SYSTEM_DARK_QUERY)
    applyTheme(resolveTheme(preference, query.matches))
    if (preference !== 'auto') return
    // Under Auto, follow the device as it changes (e.g. a phone going dark at sunset).
    const onChange = (event) => applyTheme(resolveTheme('auto', event.matches))
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [preference])

  const setPreference = useCallback((next) => {
    writePreference(next)
    setPreferenceState(next)
  }, [])

  const value = useMemo(() => ({ preference, setPreference }), [preference, setPreference])
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
