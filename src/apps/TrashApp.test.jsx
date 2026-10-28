import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import TrashApp from './TrashApp'

const sidebar = () => screen.getByRole('navigation', { name: 'Dreams' })
const pick = (title) => fireEvent.click(within(sidebar()).getByRole('button', { name: title }))

describe('TrashApp', () => {
  it('counts the dreams and groups them by status', () => {
    render(<TrashApp />)
    expect(screen.getByText('Trash — 4 dreams')).toBeInTheDocument()
    expect(within(sidebar()).getByText('Not Yet')).toBeInTheDocument()
    expect(within(sidebar()).getByText('No Longer Possible')).toBeInTheDocument()
  })

  it('opens on the first dream', () => {
    render(<TrashApp />)
    expect(within(sidebar()).getByRole('button', { name: 'Travel the World Solo' })).toHaveAttribute('aria-current', 'true')
    expect(screen.getByRole('heading', { level: 2, name: 'Travel the World Solo' })).toBeInTheDocument()
  })

  it('shows the picked dream with its info rows', () => {
    render(<TrashApp />)
    pick('Work in Accounting')
    expect(screen.getByRole('heading', { level: 2, name: 'Work in Accounting' })).toBeInTheDocument()
    expect(screen.getByText('Dreams › Career')).toBeInTheDocument()
    expect(screen.getByText('Junior high')).toBeInTheDocument()
    expect(screen.getByText('2018')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'What came instead' })).toBeInTheDocument()
  })

  it('shows a dash for Date Deleted and no "What came instead" on a not-yet dream', () => {
    render(<TrashApp />)
    expect(screen.getByText('—')).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'What came instead' })).toBeNull()
  })

  it('lets a not-yet dream be put back, and clears the message on another pick', () => {
    render(<TrashApp />)
    fireEvent.click(screen.getByRole('button', { name: 'Put Back' }))
    expect(screen.getByText('Still on the list — working on it.')).toBeInTheDocument()
    pick('Umrah with My Parents')
    expect(screen.queryByText('Still on the list — working on it.')).toBeNull()
  })

  it('cannot put back a dream that is no longer possible', () => {
    render(<TrashApp />)
    pick('Study at UGM')
    expect(screen.getByRole('button', { name: 'Put Back' })).toBeDisabled()
    expect(screen.getByText('The original location no longer exists.')).toBeInTheDocument()
  })

  it('moves to the detail view on pick and back to the list, focusing the open dream', () => {
    render(<TrashApp />)
    const root = screen.getByTestId('trash')
    expect(root).toHaveAttribute('data-view', 'list')
    pick('Study at UGM')
    expect(root).toHaveAttribute('data-view', 'detail')
    fireEvent.click(screen.getByRole('button', { name: '‹ Trash' }))
    expect(root).toHaveAttribute('data-view', 'list')
    expect(within(sidebar()).getByRole('button', { name: 'Study at UGM' })).toHaveFocus()
  })

  it('asks before emptying and keeps everything', () => {
    render(<TrashApp />)
    const empty = screen.getByRole('button', { name: 'Empty' })
    fireEvent.click(empty)
    const alert = screen.getByRole('alertdialog', { name: 'Are you sure you want to permanently erase these dreams?' })
    expect(alert).toHaveAccessibleDescription("Some dreams are worth keeping, even the ones that didn't happen.")
    const keep = within(alert).getByRole('button', { name: 'Keep Them' })
    expect(keep).toHaveFocus()
    fireEvent.click(keep)
    expect(screen.queryByRole('alertdialog')).toBeNull()
    expect(empty).toHaveFocus()
    expect(within(sidebar()).getAllByRole('button')).toHaveLength(4)
  })

  it('closes the alert with Escape', () => {
    render(<TrashApp />)
    fireEvent.click(screen.getByRole('button', { name: 'Empty' }))
    fireEvent.keyDown(screen.getByRole('alertdialog'), { key: 'Escape' })
    expect(screen.queryByRole('alertdialog')).toBeNull()
    expect(screen.getByRole('button', { name: 'Empty' })).toHaveFocus()
  })

  it('keeps focus inside the alert on Tab', () => {
    render(<TrashApp />)
    fireEvent.click(screen.getByRole('button', { name: 'Empty' }))
    const keep = screen.getByRole('button', { name: 'Keep Them' })
    expect(fireEvent.keyDown(keep, { key: 'Tab' })).toBe(false)
    expect(keep).toHaveFocus()
  })

  it('keeps focus in the alert when its backdrop is clicked', () => {
    render(<TrashApp />)
    fireEvent.click(screen.getByRole('button', { name: 'Empty' }))
    const backdrop = screen.getByRole('alertdialog').parentElement
    expect(fireEvent.mouseDown(backdrop)).toBe(false)
    expect(screen.getByRole('button', { name: 'Keep Them' })).toHaveFocus()
  })

  it('makes everything behind the alert inert while it is open', () => {
    render(<TrashApp />)
    const empty = screen.getByRole('button', { name: 'Empty' })
    fireEvent.click(empty)
    expect(empty.closest('[inert]')).not.toBeNull()
    expect(sidebar().closest('[inert]')).not.toBeNull()
    expect(screen.getByRole('alertdialog').closest('[inert]')).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Keep Them' }))
    expect(document.querySelector('[data-testid="trash"] [inert]')).toBeNull()
  })
})
