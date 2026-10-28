import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import MoviesApp from './MoviesApp'

const row = (genre) => screen.getByRole('region', { name: genre })
const filters = () => screen.getByRole('group', { name: 'Filter by genre' })

describe('MoviesApp', () => {
  it("says up front that this is Tasya's own list", () => {
    render(<MoviesApp />)
    expect(screen.getByRole('heading', { level: 1, name: "Tasya's Favorites" })).toBeInTheDocument()
    expect(screen.getByText("Comfort shows I'd defend with my whole chest")).toBeInTheDocument()
  })

  it('features Hospital Playlist with the reason it is a favorite', () => {
    render(<MoviesApp />)
    expect(screen.getByRole('heading', { level: 2, name: 'Hospital Playlist' })).toBeInTheDocument()
    expect(screen.getByText(/purely to heal/)).toBeInTheDocument()
  })

  it('offers All plus every genre on the list, with how many titles each holds', () => {
    render(<MoviesApp />)
    const chips = within(filters()).getAllByRole('button').map((b) => b.textContent)
    expect(chips.slice(0, 5)).toEqual(['All 8', 'Medical TV 3', 'Horror 1', 'Comedies 3', 'Korean 7'])
    expect(chips).toEqual(expect.arrayContaining(['Fantasy 1', 'Sports 1', 'Indonesian 1']))
    expect(chips).not.toEqual(expect.arrayContaining([expect.stringMatching(/Mystery|Thriller/)]))
    expect(within(filters()).getByRole('button', { name: 'All 8' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('filters to one genre and back to All', () => {
    render(<MoviesApp />)
    fireEvent.click(within(filters()).getByRole('button', { name: 'Comedies 3' }))
    expect(within(filters()).getByRole('button', { name: 'Comedies 3' })).toHaveAttribute('aria-pressed', 'true')
    expect(within(row('Comedies')).getAllByRole('button').map((b) => b.getAttribute('aria-label'))).toEqual([
      'Resident Playbook, 2025',
      'My Demon, 2023',
      'Fight for My Way, 2017',
    ])
    expect(screen.queryByRole('region', { name: 'Medical TV' })).toBeNull()
    fireEvent.click(within(filters()).getByRole('button', { name: 'All 8' }))
    expect(row('Medical TV')).toBeInTheDocument()
  })

  it('puts each title in the row of every genre it belongs to', () => {
    render(<MoviesApp />)
    expect(within(row('Medical TV')).getAllByRole('button').map((b) => b.getAttribute('aria-label'))).toEqual([
      'Hospital Playlist, 2020',
      'The Trauma Code: Heroes on Call, 2025',
      'Resident Playbook, 2025',
    ])
    expect(within(row('Horror')).getByRole('button', { name: 'All of Us Are Dead, 2022' })).toBeInTheDocument()
    expect(within(row('Indonesian')).getByRole('button', { name: '5 cm, 2012' })).toBeInTheDocument()
  })

  it('opens the details of a title and returns focus to its poster on close', () => {
    render(<MoviesApp />)
    const poster = within(row('Sports')).getByRole('button', { name: 'Fight for My Way, 2017' })
    fireEvent.click(poster)
    const details = screen.getByRole('dialog', { name: 'Fight for My Way' })
    expect(within(details).getByText('2017')).toBeInTheDocument()
    expect(within(within(details).getByRole('list', { name: 'Genres' })).getAllByRole('listitem').map((li) => li.textContent)).toEqual([
      'Korean',
      'Comedies',
      'Romantic TV',
      'Sports',
    ])
    fireEvent.keyDown(details, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(poster).toHaveFocus()
  })
})
