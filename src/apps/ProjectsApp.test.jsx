import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { projects } from '../data/projects'
import ProjectsApp from './ProjectsApp'

const list = () => screen.getByRole('list', { name: 'Projects' })
const openDetail = (name) => fireEvent.click(within(list()).getByRole('button', { name: new RegExp(name) }))

describe('ProjectsApp', () => {
  it('lists every project with its subtitle and an Open link to the live site', () => {
    render(<ProjectsApp />)
    expect(screen.getByRole('heading', { name: 'Projects' })).toBeInTheDocument()
    const rows = within(list()).getAllByRole('listitem')
    expect(rows).toHaveLength(projects.length)
    projects.forEach((project, index) => {
      const row = within(rows[index])
      expect(row.getByText(project.name)).toBeInTheDocument()
      expect(row.getByText(project.subtitle)).toBeInTheDocument()
      const link = row.getByRole('link', { name: `Open ${project.name}` })
      expect(link).toHaveAttribute('href', project.url)
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    })
  })

  it('keeps the Open link outside the row button so it never opens the detail view', () => {
    render(<ProjectsApp />)
    const link = screen.getByRole('link', { name: 'Open Permata Job Apply' })
    expect(link.closest('button')).toBeNull()
    fireEvent.click(link)
    expect(list()).toBeInTheDocument()
  })

  it('opens a project detail with its description, role, tech stack and screenshots', () => {
    render(<ProjectsApp />)
    openDetail('Permata Indonesia Company Profile')
    const project = projects.find((item) => item.id === 'company-profile')
    const detail = screen.getByRole('article', { name: project.name })
    expect(within(detail).getByRole('heading', { name: project.name })).toBeInTheDocument()
    expect(within(detail).getByRole('link', { name: `Open ${project.name}` })).toHaveAttribute('href', project.url)
    expect(within(detail).getByText(project.description)).toBeInTheDocument()
    const role = within(within(detail).getByRole('region', { name: 'My Role' })).getAllByRole('listitem')
    expect(role.map((item) => item.textContent)).toEqual(project.role)
    const tech = within(within(detail).getByRole('list', { name: 'Tech stack' })).getAllByRole('listitem')
    expect(tech.map((item) => item.textContent)).toEqual(['React', 'SCSS'])
    const shots = within(within(detail).getByRole('list', { name: 'Screenshots' })).getAllByRole('img')
    expect(shots.map((img) => img.getAttribute('alt'))).toEqual(project.screenshots.map((shot) => shot.alt))
    for (const img of shots) expect(img).toHaveAttribute('loading', 'lazy')
  })

  it('reserves each screenshot\'s size before it loads and keeps the strip padding when snapping', () => {
    render(<ProjectsApp />)
    openDetail('Permata Job Apply')
    const strip = screen.getByRole('list', { name: 'Screenshots' })
    // Without scroll padding, snapping aligns the first screenshot flush with the window edge.
    expect(strip).toHaveClass('scroll-px-6')
    // Snapping fights trackpad and mouse-wheel scrolling (it pulls back every frame), so only touch screens snap.
    expect(strip).toHaveClass('pointer-coarse:snap-x')
    expect(strip).not.toHaveClass('snap-x')
    const project = projects.find((item) => item.id === 'job-apply')
    within(strip).getAllByRole('img').forEach((img, index) => {
      expect(img).toHaveAttribute('width', String(project.screenshots[index].width))
      expect(img).toHaveAttribute('height', String(project.screenshots[index].height))
    })
  })

  it('goes back to the list from the detail view', () => {
    render(<ProjectsApp />)
    openDetail('Permata Job Apply')
    fireEvent.click(screen.getByRole('button', { name: '‹ Projects' }))
    expect(within(list()).getAllByRole('listitem')).toHaveLength(projects.length)
    expect(screen.queryByRole('article')).not.toBeInTheDocument()
  })

  it('scrolls back to the top when switching views', () => {
    const { container } = render(<ProjectsApp />)
    const scroller = container.firstChild
    scroller.scrollTop = 300
    openDetail('Permata Indonesia Business')
    expect(scroller.scrollTop).toBe(0)
    scroller.scrollTop = 300
    fireEvent.click(screen.getByRole('button', { name: '‹ Projects' }))
    expect(scroller.scrollTop).toBe(0)
  })

  it('keeps keyboard focus inside the app when switching views', () => {
    render(<ProjectsApp />)
    const row = within(list()).getByRole('button', { name: /Permata Indonesia Business/ })
    row.focus()
    fireEvent.click(row)
    const back = screen.getByRole('button', { name: '‹ Projects' })
    expect(back).toHaveFocus()
    fireEvent.click(back)
    expect(within(list()).getByRole('button', { name: /Permata Indonesia Business/ })).toHaveFocus()
  })

  it('does not take focus when it first opens', () => {
    render(<ProjectsApp />)
    expect(document.body).toHaveFocus()
  })

  it('starts on the list again when reopened', () => {
    const { unmount } = render(<ProjectsApp />)
    openDetail('Permata Job Apply')
    unmount()
    render(<ProjectsApp />)
    expect(list()).toBeInTheDocument()
    expect(screen.queryByRole('article')).not.toBeInTheDocument()
  })
})
