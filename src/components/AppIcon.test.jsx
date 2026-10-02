import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import AppIcon from './AppIcon'

describe('AppIcon', () => {
  it.each(['about', 'resume', 'contact', 'music', 'photos', 'projects', 'experience', 'github', 'linkedin', 'instagram', 'settings'])('renders a decorative icon for %s', (id) => {
    const { container } = render(<AppIcon id={id} className="size-12" />)
    const icon = container.firstChild
    expect(icon).toHaveAttribute('aria-hidden', 'true')
    expect(icon).toHaveClass('size-12')
    expect(icon.style.background).toContain('linear-gradient')
    expect(icon.querySelector('svg')).not.toBeNull()
  })

  it('draws the Trash without a tile by default', () => {
    const { container } = render(<AppIcon id="trash" className="size-12" />)
    const icon = container.firstChild
    expect(icon).toHaveAttribute('aria-hidden', 'true')
    expect(icon.style.background).toBe('')
    expect(icon).not.toHaveClass('shadow-md')
    expect(icon.querySelector('svg')).not.toBeNull()
  })

  it('puts the Trash on a light grey tile when asked', () => {
    const { container } = render(<AppIcon id="trash" tiled />)
    expect(container.firstChild.style.background).toContain('linear-gradient')
  })
})
