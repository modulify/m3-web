import type { M3NavigationTabExposed } from '@/components/navigation'

import { act, createRef } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import { M3Icon } from '@/components/icon'
import M3NavigationAppearance from '@/components/navigation/M3NavigationAppearance'
import { M3NavigationTab } from '@/components/navigation'

describe('m3-react/navigation-tab', () => {
  test('renders active tab with filled icon and badge', () => {
    const { container } = render(
      <M3NavigationTab active={true} label="Inbox" badged={true}>
        <M3NavigationTab.Icon>
          <M3Icon name="mail" />
        </M3NavigationTab.Icon>
        <M3NavigationTab.Badge>3</M3NavigationTab.Badge>
      </M3NavigationTab>
    )

    const root = container.querySelector('.m3-navigation-tab') as HTMLElement
    const button = screen.getByRole('button')
    const icon = container.querySelector('.m3-icon') as HTMLElement
    const badge = container.querySelector('.m3-navigation-tab__badge') as HTMLElement

    expect(root.classList.contains('m3-navigation-tab_active')).toBe(true)
    expect(icon.classList.contains('m3-icon_filled')).toBe(true)
    expect(button.getAttribute('aria-labelledby')).toContain('-label')
    expect(button.querySelector('.m3-navigation-tab__label')?.textContent).toBe('Inbox')
    expect(badge).not.toBeNull()
    expect(badge.closest('.m3-navigation-tab__button')).toBe(button)
    expect(screen.getByRole('status').textContent).toBe('3')
  })

  test('fires onNavigate on click', () => {
    const onNavigate = vi.fn()

    render(
      <M3NavigationTab label="Inbox" onNavigate={onNavigate}>
        <M3NavigationTab.Icon>
          <M3Icon name="mail" />
        </M3NavigationTab.Icon>
      </M3NavigationTab>
    )

    fireEvent.click(screen.getByRole('button'))

    expect(onNavigate).toHaveBeenCalledTimes(1)
  })

  test('respects explicit aria-label over generated aria-labelledby', () => {
    render(
      <M3NavigationTab
        label="Inbox"
        aria-label="Custom tab label"
      />
    )

    const button = screen.getByRole('button')

    expect(button.getAttribute('aria-label')).toBe('Custom tab label')
    expect(button.getAttribute('aria-labelledby')).toBeNull()
  })

  test('renders a destination as a link with current-page semantics', () => {
    render(<M3NavigationTab href="/inbox" label="Inbox" active />)

    const link = screen.getByRole('link', { name: 'Inbox' })

    expect(link.getAttribute('href')).toBe('/inbox')
    expect(link.getAttribute('aria-current')).toBe('page')
  })

  test('can switch between a button and a destination link', () => {
    const view = render(<M3NavigationTab label="Inbox" />)

    expect(screen.getByRole('button', { name: 'Inbox' })).not.toBeNull()

    view.rerender(<M3NavigationTab href="/inbox" label="Inbox" />)

    expect(screen.getByRole('link', { name: 'Inbox' }).getAttribute('href')).toBe('/inbox')
  })

  test('places drawer badges beside labels and hides icon badges from speech', () => {
    const { container } = render(
      <M3NavigationAppearance.Provider value="drawer">
        <M3NavigationTab active>
          <M3NavigationTab.Icon><M3Icon name="mail" /></M3NavigationTab.Icon>
          <M3NavigationTab.Label>Inbox</M3NavigationTab.Label>
          <M3NavigationTab.Badge>12</M3NavigationTab.Badge>
        </M3NavigationTab>
      </M3NavigationAppearance.Provider>
    )

    const badge = container.querySelector('.m3-navigation-tab__badge') as HTMLElement

    expect(badge.getAttribute('aria-hidden')).toBe('true')
    expect(container.querySelector('.m3-navigation-tab__badge-label')?.textContent).toBe('12')
    expect(screen.getByRole('button', { name: 'Inbox' })).not.toBeNull()
  })

  test('exposes programmatic focus and click while respecting prevented navigation', () => {
    const tab = createRef<M3NavigationTabExposed>()
    const onNavigate = vi.fn()
    const onKeyUp = vi.fn()

    render(
      <M3NavigationTab
        ref={tab}
        href="/inbox"
        label="Inbox"
        aria-labelledby="section-heading"
        prevent
        onNavigate={onNavigate}
        onKeyUp={onKeyUp}
      />
    )

    const link = screen.getByRole('link')

    expect(link.getAttribute('aria-labelledby')).toContain('section-heading')
    expect(tab.current?.el).toBe(link.closest('.m3-navigation-tab'))

    tab.current!.focus()
    expect(document.activeElement).toBe(link)

    fireEvent.keyUp(link, { code: 'Enter' })
    expect(onKeyUp).toHaveBeenCalledTimes(1)
    expect(fireEvent.click(link)).toBe(false)
    expect(onNavigate).toHaveBeenCalledTimes(1)

    tab.current!.blur()
    expect(document.activeElement).not.toBe(link)

    tab.current!.click()
    expect(onNavigate).toHaveBeenCalledTimes(2)
  })

  test('resolves standalone automatic appearance at compact and large widths', () => {
    const initialWidth = window.innerWidth

    try {
      const view = render(<M3NavigationTab aria-label="Inbox">
        <M3NavigationTab.Icon><M3Icon name="mail" /></M3NavigationTab.Icon>
      </M3NavigationTab>)
      const tab = view.container.querySelector('.m3-navigation-tab')!

      for (const [width, appearance] of [[400, 'bar'], [1700, 'rail-expanded']] as const) {
        act(() => {
          Object.defineProperty(window, 'innerWidth', { configurable: true, writable: true, value: width })
          window.dispatchEvent(new Event('resize'))
        })

        expect(tab.classList.contains(`m3-navigation-tab_in-${appearance}`)).toBe(true)
      }
    } finally {
      act(() => {
        Object.defineProperty(window, 'innerWidth', { configurable: true, writable: true, value: initialWidth })
        window.dispatchEvent(new Event('resize'))
      })
    }
  })

  test('supports an icon without a text label or event callbacks', () => {
    const view = render(<M3NavigationTab aria-label="Inbox">
      <M3NavigationTab.Icon />
    </M3NavigationTab>)
    const button = screen.getByRole('button', { name: 'Inbox' })

    expect(view.container.querySelector('.m3-navigation-tab__label')).toBeNull()
    fireEvent.keyUp(button, { code: 'Escape' })
    fireEvent.click(button)
  })
})
