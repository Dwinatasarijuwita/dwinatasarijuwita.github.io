import { act, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { setMobile } from '../../test/matchMedia'
import Home from '.'

describe('Home', () => {
  it('shows the macOS desktop on wide screens', () => {
    render(<Home />)
    expect(screen.getByLabelText('Aplikasi aktif')).toHaveTextContent('Dwi Natasari Juwita')
    expect(screen.queryByRole('region', { name: 'Sapaan' })).not.toBeInTheDocument()
  })

  it('shows the iPhone home screen on small screens', () => {
    setMobile(true)
    render(<Home />)
    expect(screen.getByRole('region', { name: 'Sapaan' })).toBeInTheDocument()
    expect(screen.queryByLabelText('Aplikasi aktif')).not.toBeInTheDocument()
  })

  it('switches layout when the viewport crosses the breakpoint', () => {
    render(<Home />)
    act(() => setMobile(true))
    expect(screen.getByRole('region', { name: 'Sapaan' })).toBeInTheDocument()
  })
})
