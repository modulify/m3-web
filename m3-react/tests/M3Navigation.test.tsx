import type { M3NavigationExposed } from '@/components/navigation'

import { act } from '@testing-library/react'
import { createRef } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'

import {
  M3Navigation,
  M3NavigationSection,
  M3NavigationTab,
} from '@/components/navigation'

describe('m3-react/navigation', () => {
  test('opens from a trigger without relying on legacy DOM lookup', () => {
    const Navigation = () => {
      const [expanded, setExpanded] = useState(false)

      return (
        <M3Navigation
          appearance="drawer"
          expanded={expanded}
          onToggle={setExpanded}
        >
          <M3Navigation.Top>
            <button type="button" onClick={() => setExpanded(true)}>Open menu</button>
          </M3Navigation.Top>
        </M3Navigation>
      )
    }

    render(<Navigation />)

    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }))

    expect(document.body.querySelector('.m3-navigation_modal')).not.toBeNull()
  })

  test('exposes expand and collapse requests', () => {
    const ref = createRef<M3NavigationExposed>()
    const onToggle = vi.fn()

    render(<M3Navigation ref={ref} appearance="rail" onToggle={onToggle} />)

    act(() => ref.current?.expand())
    act(() => ref.current?.collapse())

    expect(onToggle).toHaveBeenNthCalledWith(1, true)
    expect(onToggle).toHaveBeenNthCalledWith(2, false)
  })

  test('renders slots and closes by scrim click', () => {
    const onToggle = vi.fn()

    render(
      <M3Navigation expanded={true} onToggle={onToggle}>
        <M3Navigation.Top>Top</M3Navigation.Top>
        <M3Navigation.Header>Header</M3Navigation.Header>
        <M3Navigation.Subheader>Subheader</M3Navigation.Subheader>

        <M3NavigationTab label="Home" />

        <M3NavigationSection>
          <M3NavigationSection.Header>Section header</M3NavigationSection.Header>
          <M3NavigationTab label="Settings" />
        </M3NavigationSection>
      </M3Navigation>
    )

    expect(screen.getByText('Top')).not.toBeNull()
    expect(screen.getByText('Header')).not.toBeNull()
    expect(screen.getByText('Subheader')).not.toBeNull()
    expect(screen.getByText('Section header')).not.toBeNull()

    const scrim = document.body.querySelector('.m3-scrim') as HTMLElement

    fireEvent.click(scrim)

    expect(onToggle).toHaveBeenCalledWith(false)
  })

  test('renders slots and repeated sections from fragments', () => {
    render(
      <M3Navigation expanded={true}>
        <>
          <M3Navigation.Top>Top from fragment</M3Navigation.Top>
          <>
            <M3Navigation.Header>Header from nested fragment</M3Navigation.Header>
          </>
        </>

        <M3NavigationTab label="Home" />

        <>
          <M3NavigationSection>
            <M3NavigationSection.Header>First section</M3NavigationSection.Header>
            <M3NavigationTab label="Settings" />
          </M3NavigationSection>

          <M3NavigationSection>
            <M3NavigationSection.Header>Second section</M3NavigationSection.Header>
            <M3NavigationTab label="Help" />
          </M3NavigationSection>
        </>
      </M3Navigation>
    )

    expect(screen.getByText('Top from fragment')).not.toBeNull()
    expect(screen.getByText('Header from nested fragment')).not.toBeNull()
    expect(screen.getByText('First section')).not.toBeNull()
    expect(screen.getByText('Second section')).not.toBeNull()
  })

  test('switches from modal rail to standard rail at the large breakpoint', () => {
    const onToggle = vi.fn()
    const initialWidth = window.innerWidth

    render(
      <M3Navigation
        appearance="auto"
        expanded={true}
        onToggle={onToggle}
      >
        <M3NavigationTab label="Home" />
      </M3Navigation>
    )

    act(() => {
      Object.defineProperty(window, 'innerWidth', {
        configurable: true,
        writable: true,
        value: 1700,
      })

      window.dispatchEvent(new Event('resize'))
    })

    expect(document.querySelector('nav.m3-navigation_rail-expanded:not(.m3-navigation_modal)')).not.toBeNull()
    expect(onToggle).not.toHaveBeenCalled()

    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      writable: true,
      value: initialWidth,
    })
  })

  test('keeps auto rail expanded by default at a large width', () => {
    const initialWidth = window.innerWidth

    act(() => {
      Object.defineProperty(window, 'innerWidth', { configurable: true, writable: true, value: 1300 })
      window.dispatchEvent(new Event('resize'))
    })

    const onToggle = vi.fn()
    const { rerender } = render(<M3Navigation appearance="auto" onToggle={onToggle} />)
    rerender(<M3Navigation appearance="auto" expanded onToggle={onToggle} />)

    expect(document.querySelector('nav.m3-navigation_rail-expanded:not(.m3-navigation_modal)')).not.toBeNull()
    expect(onToggle).not.toHaveBeenCalledWith(false)

    Object.defineProperty(window, 'innerWidth', { configurable: true, writable: true, value: initialWidth })
    act(() => window.dispatchEvent(new Event('resize')))
  })

  test('switches auto appearance across compact, medium, and large widths', () => {
    const initialWidth = window.innerWidth

    render(<M3Navigation appearance="auto"><M3NavigationTab label="Home" /></M3Navigation>)

    for (const [width, appearance] of [[400, 'bar'], [800, 'bar'], [900, 'rail'], [1300, 'rail-expanded']] as const) {
      act(() => {
        Object.defineProperty(window, 'innerWidth', { configurable: true, writable: true, value: width })
        window.dispatchEvent(new Event('resize'))
      })

      expect(document.querySelector('nav.m3-navigation')?.classList.contains(`m3-navigation_${appearance}`)).toBe(true)
      expect(document.querySelector('.m3-navigation-tab')?.classList.contains(`m3-navigation-tab_in-${appearance}`)).toBe(true)
    }

    Object.defineProperty(window, 'innerWidth', { configurable: true, writable: true, value: initialWidth })
    act(() => window.dispatchEvent(new Event('resize')))
  })

  test('keeps a requested appearance independent of viewport width', () => {
    const initialWidth = window.innerWidth
    const { rerender } = render(<M3Navigation appearance="bar"><M3NavigationTab label="Home" /></M3Navigation>)

    act(() => {
      Object.defineProperty(window, 'innerWidth', { configurable: true, writable: true, value: 1700 })
      window.dispatchEvent(new Event('resize'))
    })

    expect(document.querySelector('nav.m3-navigation_bar')).not.toBeNull()
    expect(document.querySelector('.m3-navigation-tab_in-bar')).not.toBeNull()

    rerender(<M3Navigation appearance="rail"><M3NavigationTab label="Home" /></M3Navigation>)

    expect(document.querySelector('nav.m3-navigation_rail')).not.toBeNull()
    expect(document.querySelector('.m3-navigation-tab_in-rail')).not.toBeNull()

    Object.defineProperty(window, 'innerWidth', { configurable: true, writable: true, value: initialWidth })
    act(() => window.dispatchEvent(new Event('resize')))
  })

  test('offers standard and modal rail expansion without changing explicit drawer', () => {
    const { rerender } = render(
      <M3Navigation appearance="rail" railExpandedMode="standard" expanded>
        <M3NavigationTab label="Home" />
        <M3NavigationSection><M3NavigationTab label="Settings" /></M3NavigationSection>
      </M3Navigation>
    )

    expect(document.querySelector('nav.m3-navigation_rail-expanded:not(.m3-navigation_modal)')).not.toBeNull()
    expect(document.querySelector('.m3-navigation-tab_in-rail-expanded')).not.toBeNull()

    rerender(<M3Navigation appearance="rail" railExpandedMode="modal" expanded><M3NavigationTab label="Home" /></M3Navigation>)
    expect(document.querySelector('nav.m3-navigation_rail-expanded.m3-navigation_modal')).not.toBeNull()

    rerender(<M3Navigation appearance="drawer"><M3NavigationTab label="Home" /></M3Navigation>)
    expect(document.querySelector('nav.m3-navigation_drawer:not(.m3-navigation_modal)')).not.toBeNull()
    expect(document.querySelector('.m3-navigation-tab_in-drawer')).not.toBeNull()
  })

  test('keeps forced rail-expanded standard and exposes every section', () => {
    const onToggle = vi.fn()
    const ref = createRef<M3NavigationExposed>()
    render(
      <M3Navigation ref={ref} appearance="rail-expanded" onToggle={onToggle}>
        <M3NavigationTab label="Home" />
        <M3NavigationSection><M3NavigationTab label="Settings" /></M3NavigationSection>
      </M3Navigation>
    )

    expect(document.querySelector('nav.m3-navigation_rail-expanded:not(.m3-navigation_modal)')).not.toBeNull()
    expect(document.querySelectorAll('.m3-navigation__section').length).toBe(2)
    act(() => ref.current?.collapse())
    expect(onToggle).not.toHaveBeenCalled()
  })

  test('makes a collapsed immersive rail inert and restores it on expansion', () => {
    const { rerender } = render(<M3Navigation appearance="rail" hideWhenCollapsed><M3NavigationTab label="Home" /></M3Navigation>)
    const nav = document.querySelector('nav.m3-navigation') as HTMLElement

    expect(nav.classList.contains('m3-navigation_rail-hidden')).toBe(true)
    expect(nav.hasAttribute('inert')).toBe(true)
    expect(nav.getAttribute('aria-hidden')).toBe('true')

    rerender(<M3Navigation appearance="rail" railExpandedMode="standard" hideWhenCollapsed expanded><M3NavigationTab label="Home" /></M3Navigation>)
    expect(nav.classList.contains('m3-navigation_rail-expanded')).toBe(true)
    expect(nav.hasAttribute('inert')).toBe(false)
    expect(nav.hasAttribute('aria-hidden')).toBe(false)
  })

  test('keeps the bar limited to primary destinations when additional sections exist', () => {
    render(
      <M3Navigation appearance="bar">
        <M3NavigationTab label="Home" />
        <M3NavigationSection><M3NavigationTab label="Settings" /></M3NavigationSection>
      </M3Navigation>
    )

    expect(screen.queryByRole('button', { name: 'More' })).toBeNull()
    expect(document.querySelector('.m3-navigation__more')).toBeNull()
  })

  test('does not expand an explicitly requested bar into a drawer', () => {
    const ref = createRef<M3NavigationExposed>()
    const onToggle = vi.fn()

    render(<M3Navigation ref={ref} appearance="bar" expanded onToggle={onToggle}>
      <M3NavigationTab label="Home" />
    </M3Navigation>)

    act(() => ref.current?.expand())

    expect(document.querySelector('nav.m3-navigation_bar:not(.m3-navigation_modal)')).not.toBeNull()
    expect(document.querySelector('.m3-navigation-tab_in-bar')).not.toBeNull()
    expect((document.querySelector('.m3-scrim') as HTMLElement).style.display).toBe('none')
    expect(onToggle).toHaveBeenCalledTimes(1)
    expect(onToggle).toHaveBeenCalledWith(false)
  })

  test('closes an open modal rail when the viewport switches to bar', () => {
    const initialWidth = window.innerWidth
    const onToggle = vi.fn()
    const ref = createRef<M3NavigationExposed>()

    act(() => {
      Object.defineProperty(window, 'innerWidth', { configurable: true, writable: true, value: 900 })
      window.dispatchEvent(new Event('resize'))
    })

    render(<M3Navigation ref={ref} appearance="auto" expanded onToggle={onToggle} />)
    expect(document.querySelector('nav.m3-navigation_rail-expanded.m3-navigation_modal')).not.toBeNull()

    for (const width of [800, 400]) {
      act(() => {
        Object.defineProperty(window, 'innerWidth', { configurable: true, writable: true, value: width })
        window.dispatchEvent(new Event('resize'))
      })

      expect(document.querySelector('nav.m3-navigation_bar:not(.m3-navigation_modal)')).not.toBeNull()
      expect((document.querySelector('.m3-scrim') as HTMLElement).style.display).toBe('none')
      act(() => ref.current?.expand())
    }

    expect(onToggle).toHaveBeenCalledWith(false)
    expect(onToggle).not.toHaveBeenCalledWith(true)

    Object.defineProperty(window, 'innerWidth', { configurable: true, writable: true, value: initialWidth })
    act(() => window.dispatchEvent(new Event('resize')))
  })
})
