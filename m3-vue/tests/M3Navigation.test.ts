import { fireEvent } from '@testing-library/vue'
import { nextTick } from 'vue'
import { render, screen } from '@testing-library/vue'

import { M3Navigation } from '@/components/navigation'

describe('m3-vue/navigation', () => {
  test('renders slots and closes by scrim click', async () => {
    const view = render(M3Navigation, {
      props: {
        expanded: true,
      },
      slots: {
        top: 'Top',
        header: 'Header',
        subheader: 'Subheader',
        default: 'Main item',
        sections: 'Extra section',
      },
    })

    await nextTick()

    expect(screen.getByText('Top')).not.toBeNull()
    expect(screen.getByText('Header')).not.toBeNull()
    expect(screen.getByText('Subheader')).not.toBeNull()
    expect(screen.getByText('Main item')).not.toBeNull()
    expect(screen.getByText('Extra section')).not.toBeNull()

    const scrim = document.body.querySelector('.m3-scrim') as HTMLElement

    await fireEvent.click(scrim)

    expect(view.emitted()['update:expanded']?.[0]).toEqual([false])
  })

  test('switches from modal rail to standard rail at the large breakpoint', async () => {
    const initialWidth = window.innerWidth

    const view = render(M3Navigation, {
      props: {
        expanded: true,
        appearance: 'auto',
      },
      slots: {
        default: 'Main item',
      },
    })

    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      writable: true,
      value: 1700,
    })

    window.dispatchEvent(new Event('resize'))
    await nextTick()

    expect(document.querySelector('nav.m3-navigation_rail-expanded:not(.m3-navigation_modal)')).not.toBeNull()
    expect(view.emitted()['update:expanded']).toBeUndefined()

    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      writable: true,
      value: initialWidth,
    })
  })

  test('keeps auto rail expanded by default at a large width', async () => {
    const initialWidth = window.innerWidth
    Object.defineProperty(window, 'innerWidth', { configurable: true, writable: true, value: 1300 })
    window.dispatchEvent(new Event('resize'))

    const view = render(M3Navigation, { props: { appearance: 'auto' } })
    await view.rerender({ appearance: 'auto', expanded: true })

    expect(document.querySelector('nav.m3-navigation_rail-expanded:not(.m3-navigation_modal)')).not.toBeNull()
    expect(view.emitted()['update:expanded']).toBeUndefined()

    Object.defineProperty(window, 'innerWidth', { configurable: true, writable: true, value: initialWidth })
    window.dispatchEvent(new Event('resize'))
  })

  test('switches auto appearance across compact, medium, and large widths', async () => {
    const initialWidth = window.innerWidth

    render(M3Navigation, { props: { appearance: 'auto' }, slots: { default: 'Home' } })

    for (const [width, appearance] of [[400, 'bar'], [800, 'bar'], [900, 'rail'], [1300, 'rail-expanded']] as const) {
      Object.defineProperty(window, 'innerWidth', { configurable: true, writable: true, value: width })
      window.dispatchEvent(new Event('resize'))
      await nextTick()

      expect(document.querySelector('nav.m3-navigation')?.classList.contains(`m3-navigation_${appearance}`)).toBe(true)
    }

    Object.defineProperty(window, 'innerWidth', { configurable: true, writable: true, value: initialWidth })
    window.dispatchEvent(new Event('resize'))
  })

  test('keeps a requested appearance independent of viewport width', async () => {
    const initialWidth = window.innerWidth
    const view = render(M3Navigation, { props: { appearance: 'bar' }, slots: { default: 'Home' } })

    Object.defineProperty(window, 'innerWidth', { configurable: true, writable: true, value: 1700 })
    window.dispatchEvent(new Event('resize'))
    await nextTick()

    expect(document.querySelector('nav.m3-navigation_bar')).not.toBeNull()

    await view.rerender({ appearance: 'rail' })
    expect(document.querySelector('nav.m3-navigation_rail')).not.toBeNull()

    Object.defineProperty(window, 'innerWidth', { configurable: true, writable: true, value: initialWidth })
    window.dispatchEvent(new Event('resize'))
  })

  test('offers standard and modal rail expansion without changing explicit drawer', async () => {
    const view = render(M3Navigation, { props: { appearance: 'rail', expanded: true, expansion: 'standard' } })

    expect(document.querySelector('nav.m3-navigation_rail-expanded:not(.m3-navigation_modal)')).not.toBeNull()

    await view.rerender({ appearance: 'rail', expanded: true, expansion: 'modal' })
    expect(document.querySelector('nav.m3-navigation_rail-expanded.m3-navigation_modal')).not.toBeNull()

    await view.rerender({ appearance: 'drawer', expanded: false })
    expect(document.querySelector('nav.m3-navigation_drawer:not(.m3-navigation_modal)')).not.toBeNull()
  })

  test('keeps forced rail-expanded standard', () => {
    render(M3Navigation, { props: { appearance: 'rail-expanded' }, slots: { default: 'Home', sections: 'Settings' } })

    expect(document.querySelector('nav.m3-navigation_rail-expanded:not(.m3-navigation_modal)')).not.toBeNull()
    expect(document.querySelectorAll('.m3-navigation__section').length).toBe(1)
  })

  test('makes a collapsed immersive rail inert and restores it on expansion', async () => {
    const view = render(M3Navigation, { props: { appearance: 'rail', collapse: 'hidden' } })
    const nav = document.querySelector('nav.m3-navigation') as HTMLElement

    expect(nav.classList.contains('m3-navigation_rail-hidden')).toBe(true)
    expect(nav.hasAttribute('inert')).toBe(true)
    expect(nav.getAttribute('aria-hidden')).toBe('true')

    await view.rerender({ appearance: 'rail', collapse: 'hidden', expanded: true, expansion: 'standard' })
    expect(nav.classList.contains('m3-navigation_rail-expanded')).toBe(true)
    expect(nav.hasAttribute('inert')).toBe(false)
    expect(nav.hasAttribute('aria-hidden')).toBe(false)
  })

  test('keeps the bar limited to primary destinations when additional sections exist', () => {
    render(M3Navigation, {
      props: { appearance: 'bar' },
      slots: { default: 'Home', sections: 'Settings' },
    })

    expect(screen.queryByRole('button', { name: 'More' })).toBeNull()
    expect(document.querySelector('.m3-navigation__more')).toBeNull()
  })

  test('does not expand an explicitly requested bar into a drawer', async () => {
    const view = render(M3Navigation, { props: { appearance: 'bar', expanded: true }, slots: { default: 'Home' } })
    await nextTick()

    expect(document.querySelector('nav.m3-navigation_bar:not(.m3-navigation_modal)')).not.toBeNull()
    expect((document.querySelector('.m3-scrim') as HTMLElement).style.display).toBe('none')
    expect(view.emitted()['update:expanded']?.[0]).toEqual([false])
  })

  test('closes an open modal rail when the viewport switches to bar', async () => {
    const initialWidth = window.innerWidth
    Object.defineProperty(window, 'innerWidth', { configurable: true, writable: true, value: 900 })
    window.dispatchEvent(new Event('resize'))

    const view = render(M3Navigation, { props: { appearance: 'auto', expanded: true } })
    expect(document.querySelector('nav.m3-navigation_rail-expanded.m3-navigation_modal')).not.toBeNull()

    for (const width of [800, 400]) {
      Object.defineProperty(window, 'innerWidth', { configurable: true, writable: true, value: width })
      window.dispatchEvent(new Event('resize'))
      await nextTick()

      expect(document.querySelector('nav.m3-navigation_bar:not(.m3-navigation_modal)')).not.toBeNull()
      expect((document.querySelector('.m3-scrim') as HTMLElement).style.display).toBe('none')
    }

    expect(view.emitted()['update:expanded']?.some(event => Array.isArray(event) && event[0] === false)).toBe(true)

    Object.defineProperty(window, 'innerWidth', { configurable: true, writable: true, value: initialWidth })
    window.dispatchEvent(new Event('resize'))
  })
})
