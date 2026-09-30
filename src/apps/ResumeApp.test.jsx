import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { setMobile } from '../test/matchMedia'
import ResumeApp from './ResumeApp'

function stubFetch(response) {
  const fetch = vi.fn().mockResolvedValue({
    ok: response.ok,
    headers: { get: () => response.contentType },
  })
  vi.stubGlobal('fetch', fetch)
  return fetch
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('ResumeApp', () => {
  it('shows the PDF with a download button on desktop', async () => {
    const fetch = stubFetch({ ok: true, contentType: 'application/pdf' })
    render(<ResumeApp />)

    expect(await screen.findByTitle('Resume Dwi Natasari Juwita')).toHaveAttribute('src', '/resume.pdf')
    const download = screen.getByRole('link', { name: 'Download' })
    expect(download).toHaveAttribute('href', '/resume.pdf')
    expect(download).toHaveAttribute('download', 'Dwi Natasari Juwita - CV.pdf')
    expect(fetch).toHaveBeenCalledWith('/resume.pdf', { method: 'HEAD' })
  })

  it('shows open and download buttons instead of the PDF on mobile', async () => {
    stubFetch({ ok: true, contentType: 'application/pdf' })
    setMobile(true)
    render(<ResumeApp />)

    expect(await screen.findByRole('link', { name: 'Open PDF' })).toHaveAttribute('target', '_blank')
    expect(screen.getByRole('link', { name: 'Download CV' })).toHaveAttribute('download', 'Dwi Natasari Juwita - CV.pdf')
    expect(screen.queryByTitle('Resume Dwi Natasari Juwita')).not.toBeInTheDocument()
  })

  it('says the CV is coming soon when the file is missing', async () => {
    stubFetch({ ok: false, contentType: 'text/html' })
    render(<ResumeApp />)
    expect(await screen.findByText('CV coming soon')).toBeInTheDocument()
  })

  it('treats an HTML page served with 200 (Vite dev fallback) as missing', async () => {
    stubFetch({ ok: true, contentType: 'text/html' })
    render(<ResumeApp />)
    expect(await screen.findByText('CV coming soon')).toBeInTheDocument()
  })

  it('treats a network error as missing', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))
    render(<ResumeApp />)
    expect(await screen.findByText('CV coming soon')).toBeInTheDocument()
  })
})
