import { fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import ThemeProvider from '../components/ThemeProvider'
import SettingsApp from './SettingsApp'

const renderSettings = () =>
  render(
    <ThemeProvider>
      <SettingsApp />
    </ThemeProvider>,
  )

beforeEach(() => {
  localStorage.clear()
  document.documentElement.classList.remove('dark')
})

describe('SettingsApp', () => {
  it('offers Light, Dark and Auto, with Auto chosen for a new visitor', () => {
    renderSettings()
    const group = screen.getByRole('radiogroup', { name: 'Appearance' })
    expect(within(group).getAllByRole('radio').map((radio) => radio.labels[0].textContent.trim())).toEqual(['Light', 'Dark', 'Auto'])
    expect(screen.getByRole('radio', { name: 'Auto' })).toBeChecked()
    expect(screen.getByText('Auto switches between light and dark to match your device.')).toBeInTheDocument()
  })

  it('shows a preference stored before it opened', () => {
    localStorage.setItem('theme', 'dark')
    renderSettings()
    expect(screen.getByRole('radio', { name: 'Dark' })).toBeChecked()
  })

  it('switches the site to dark at once', () => {
    renderSettings()
    fireEvent.click(screen.getByRole('radio', { name: 'Dark' }))
    expect(document.documentElement).toHaveClass('dark')
    expect(localStorage.getItem('theme')).toBe('dark')
  })

  // jsdom has no stylesheet, so check the classes: in dark mode a plain `dark:ring-*` would
  // outrank `peer-checked:ring-blue-500` and hide which card is chosen.
  it('keeps the blue ring on the chosen card in dark mode', () => {
    renderSettings()
    const preview = screen.getByRole('radio', { name: 'Dark' }).nextElementSibling
    expect(preview).toHaveClass('peer-checked:ring-blue-500', 'dark:peer-checked:ring-blue-500')
  })
})
