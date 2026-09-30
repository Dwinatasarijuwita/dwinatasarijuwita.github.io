import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import ContactApp from './ContactApp'

function mockClipboard() {
  const writeText = vi.fn().mockResolvedValue(undefined)
  Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })
  return writeText
}

afterEach(() => {
  delete navigator.clipboard
})

describe('ContactApp', () => {
  it('links the email address with mailto', () => {
    render(<ContactApp />)
    expect(screen.getByRole('link', { name: 'tasyakstr@gmail.com' })).toHaveAttribute(
      'href',
      'mailto:tasyakstr@gmail.com',
    )
  })

  it('copies the email and confirms, then resets after 2 seconds', async () => {
    const writeText = mockClipboard()
    render(<ContactApp />)

    fireEvent.click(screen.getByRole('button', { name: 'Salin email' }))

    expect(await screen.findByRole('button', { name: 'Tersalin ✓' })).toBeInTheDocument()
    expect(writeText).toHaveBeenCalledWith('tasyakstr@gmail.com')
    await waitFor(() => expect(screen.getByRole('button', { name: 'Salin email' })).toBeInTheDocument(), {
      timeout: 3000,
    })
  })

  it('hides the copy button when the clipboard is unavailable', () => {
    render(<ContactApp />)
    expect(screen.queryByRole('button', { name: 'Salin email' })).not.toBeInTheDocument()
  })

  it('links the phone number to a WhatsApp chat in a new tab', () => {
    render(<ContactApp />)
    const link = screen.getByRole('link', { name: /0857-1825-9166/ })
    expect(link).toHaveAttribute('href', 'https://wa.me/6285718259166')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    expect(screen.getByText('WhatsApp')).toBeInTheDocument()
  })
})
