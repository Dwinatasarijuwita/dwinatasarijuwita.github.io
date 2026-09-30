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
  it('copies the email when it is clicked and confirms it, then clears the notice after 2 seconds', async () => {
    const writeText = mockClipboard()
    render(<ContactApp />)

    fireEvent.click(screen.getByRole('button', { name: /tasyakstr@gmail\.com/ }))

    expect(await screen.findByText(/Email berhasil disalin/)).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('Email berhasil disalin')
    expect(writeText).toHaveBeenCalledWith('tasyakstr@gmail.com')
    await waitFor(() => expect(screen.queryByText(/Email berhasil disalin/)).not.toBeInTheDocument(), {
      timeout: 3000,
    })
  })

  it('no longer shows a separate copy button', () => {
    mockClipboard()
    render(<ContactApp />)
    expect(screen.queryByRole('button', { name: 'Salin email' })).not.toBeInTheDocument()
  })

  it('falls back to a mailto link when the clipboard is unavailable', () => {
    render(<ContactApp />)
    expect(screen.getByRole('link', { name: 'tasyakstr@gmail.com' })).toHaveAttribute(
      'href',
      'mailto:tasyakstr@gmail.com',
    )
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
