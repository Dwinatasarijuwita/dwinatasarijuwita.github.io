import { act, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { setMobile } from '../../test/matchMedia'
import Home from '.'

describe('Home', () => {
  it('shows the macOS desktop on wide screens', () => {
    render(<Home />)
    expect(screen.getByLabelText('Active app')).toHaveTextContent('Dwi Natasari Juwita')
    expect(screen.queryByRole('region', { name: 'Greeting' })).not.toBeInTheDocument()
  })

  it('shows the iPhone home screen on small screens', () => {
    setMobile(true)
    render(<Home />)
    expect(screen.getByRole('region', { name: 'Greeting' })).toBeInTheDocument()
    expect(screen.queryByLabelText('Active app')).not.toBeInTheDocument()
  })

  it('switches layout when the viewport crosses the breakpoint', () => {
    render(<Home />)
    act(() => setMobile(true))
    expect(screen.getByRole('region', { name: 'Greeting' })).toBeInTheDocument()
  })
})
