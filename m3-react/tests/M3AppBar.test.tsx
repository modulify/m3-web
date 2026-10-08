import { fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'

import { M3AppBar } from '@/components/app-bar'
import { M3Search } from '@/components/search'

const appearances = ['search', 'small', 'medium', 'medium-flexible', 'large', 'large-flexible'] as const

describe('m3-react/app-bar', () => {
  test.each(appearances)('renders %s with one appropriate title', appearance => {
    const view = render(
      <M3AppBar appearance={appearance} headline="Library" subtitle="Recent items">
        <M3AppBar.Leading><button type="button">Menu</button></M3AppBar.Leading>
        <M3AppBar.Trailing><button type="button">Favorite</button></M3AppBar.Trailing>
      </M3AppBar>
    )

    const bar = view.container.querySelector('.m3-app-bar')!
    expect(bar.classList.contains(`m3-app-bar_${appearance}`)).toBe(true)
    expect(screen.getByRole('button', { name: 'Menu' })).not.toBeNull()
    expect(screen.getByRole('button', { name: 'Favorite' })).not.toBeNull()
    expect(screen.queryByRole('heading', { name: 'Library' }) !== null).toBe(appearance !== 'search')
    expect(view.container.querySelector('.m3-app-bar__subtitle') !== null).toBe(
      appearance === 'small' || appearance.includes('flexible')
    )
  })

  test('tracks a supplied scroll root and re-expands flexible content at the top', () => {
    const scroller = document.createElement('div')
    const view = render(<M3AppBar appearance="medium-flexible" headline="Library" scroll="collapse" scrollTarget={scroller} />)
    const bar = view.container.querySelector('.m3-app-bar')!

    scroller.scrollTop = 40
    fireEvent.scroll(scroller)
    expect(bar.classList.contains('m3-app-bar_under')).toBe(true)
    expect(bar.classList.contains('m3-app-bar_collapsed')).toBe(true)

    scroller.scrollTop = 0
    fireEvent.scroll(scroller)
    expect(bar.classList.contains('m3-app-bar_collapsed')).toBe(false)
    expect(bar.classList.contains('m3-app-bar_under')).toBe(false)
  })

  test('shows a flexible image until the bar collapses', () => {
    const scroller = document.createElement('div')
    const view = render(<M3AppBar appearance="large-flexible" headline="Library" scroll="collapse" scrollTarget={scroller}>
      <M3AppBar.Image><img src="/library.svg" alt="" /></M3AppBar.Image>
    </M3AppBar>)

    expect(view.container.querySelector('.m3-app-bar__image img')).not.toBeNull()
    scroller.scrollTop = 40
    fireEvent.scroll(scroller)
    expect(view.container.querySelector('.m3-app-bar__image')).toBeNull()
  })

  test('keeps one search view owner when composed with M3Search', () => {
    const Example = () => {
      const [open, setOpen] = useState(false)
      const [query, setQuery] = useState('')
      return <M3AppBar appearance="search">
        <M3AppBar.Search>
          <M3Search
            query={query}
            open={open}
            label="Search library"
            status=""
            layout="full-screen"
            onQueryChange={setQuery}
            onOpenChange={setOpen}
          />
        </M3AppBar.Search>
      </M3AppBar>
    }

    render(<Example />)
    fireEvent.click(screen.getByRole('button', { name: 'Search library' }))
    expect(screen.getAllByRole('dialog', { name: 'Search library' })).toHaveLength(1)
  })
})
