import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useTheme } from '../hooks/useTheme'
import { setSystemDark } from '../test/matchMedia'
import ThemeProvider from './ThemeProvider'

function Probe() {
  const { preference, setPreference } = useTheme()
  return (
    <>
      <p>{preference}</p>
      {['light', 'dark', 'auto'].map((p) => (
        <button key={p} type="button" onClick={() => setPreference(p)}>
          {p}
        </button>
      ))}
    </>
  )
}

const isDark = () => document.documentElement.classList.contains('dark')

beforeEach(() => {
  localStorage.clear()
  document.documentElement.classList.remove('dark')
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('ThemeProvider', () => {
  it('applies the stored preference on mount', () => {
    localStorage.setItem('theme', 'dark')
    render(<ThemeProvider><Probe /></ThemeProvider>)
    expect(isDark()).toBe(true)
    expect(screen.getByText('dark', { selector: 'p' })).toBeInTheDocument()
  })

  it('defaults to auto and follows the system', () => {
    setSystemDark(true)
    render(<ThemeProvider><Probe /></ThemeProvider>)
    expect(screen.getByText('auto', { selector: 'p' })).toBeInTheDocument()
    expect(isDark()).toBe(true)
    act(() => setSystemDark(false))
    expect(isDark()).toBe(false)
  })

  it('stores and applies a chosen preference', () => {
    render(<ThemeProvider><Probe /></ThemeProvider>)
    fireEvent.click(screen.getByRole('button', { name: 'dark' }))
    expect(localStorage.getItem('theme')).toBe('dark')
    expect(isDark()).toBe(true)
  })

  it('stops following the system once Light is chosen', () => {
    render(<ThemeProvider><Probe /></ThemeProvider>)
    fireEvent.click(screen.getByRole('button', { name: 'light' }))
    act(() => setSystemDark(true))
    expect(isDark()).toBe(false)
  })

  it('throws outside the provider', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<Probe />)).toThrow('useTheme must be used inside ThemeProvider')
  })
})
