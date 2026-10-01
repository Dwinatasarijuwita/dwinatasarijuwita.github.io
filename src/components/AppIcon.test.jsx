import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import AppIcon from './AppIcon'

describe('AppIcon', () => {
  it.each(['about', 'resume', 'contact', 'music', 'photos', 'projects', 'experience', 'github', 'linkedin', 'instagram'])('renders a decorative icon for %s', (id) => {
    const { container } = render(<AppIcon id={id} className="size-12" />)
    const icon = container.firstChild
    expect(icon).toHaveAttribute('aria-hidden', 'true')
    expect(icon).toHaveClass('size-12')
    expect(icon.style.background).toContain('linear-gradient')
    expect(icon.querySelector('svg')).not.toBeNull()
  })
})
