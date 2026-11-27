import { defineComponent } from 'vue'
import { fireEvent } from '@testing-library/vue'
import { h, nextTick, ref } from 'vue'
import { render, screen } from '@testing-library/vue'

import { M3Icon } from '@/components/icon'
import { M3Navigation, M3NavigationTab } from '@/components/navigation'

describe('m3-vue/navigation-tab', () => {
  test('renders active tab with filled icon and badge', () => {
    const { container } = render(M3NavigationTab, {
      props: {
        active: true,
        label: 'Inbox',
        badged: true,
      },
      slots: {
        default: () => h(M3Icon, { name: 'mail' }),
        badge: '3',
      },
    })

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

  test('emits navigate on click', async () => {
    const view = render(M3NavigationTab, {
      props: {
        label: 'Inbox',
      },
      slots: {
        default: () => h(M3Icon, { name: 'mail' }),
      },
    })

    await fireEvent.click(screen.getByRole('button'))

    expect(view.emitted().navigate).toHaveLength(1)
  })

  test('respects explicit aria-label over generated aria-labelledby', () => {
    render(M3NavigationTab, {
      props: {
        label: 'Inbox',
      },
      attrs: {
        'aria-label': 'Custom tab label',
      },
    })

    const button = screen.getByRole('button')

    expect(button.getAttribute('aria-label')).toBe('Custom tab label')
    expect(button.getAttribute('aria-labelledby')).toBeNull()
  })

  test('places drawer badges beside labels and hides icon badges from speech', () => {
    render(M3Navigation, {
      props: { appearance: 'drawer' },
      slots: { default: () => [
        h(M3NavigationTab, { label: 'Inbox' }, {
          default: () => h(M3Icon, { name: 'mail' }),
          badge: () => '12',
        }),
        h(M3NavigationTab, { label: 'Drafts', badged: true }, {
          default: () => h(M3Icon, { name: 'drafts' }),
        }),
      ] },
    })

    const badges = document.querySelectorAll('.m3-navigation-tab__badge')
    expect(badges).toHaveLength(2)
    expect([...badges].every(badge => badge.getAttribute('aria-hidden') === 'true')).toBe(true)
    expect(document.querySelector('.m3-navigation-tab__badge-label')?.textContent).toBe('12')
  })

  test('exposes programmatic focus and click while respecting prevented navigation', async () => {
    const tab = ref<{
      el: HTMLElement | null;
      click(): void;
      focus(): void;
      blur(): void;
        } | null>(null)
    const onNavigate = vi.fn()

    render(defineComponent({
      setup: () => () => h(M3NavigationTab, {
        ref: tab,
        href: '/inbox',
        label: 'Inbox',
        prevent: true,
        onNavigate,
      }),
    }))

    const link = screen.getByRole('link')
    expect(tab.value?.el).toBe(link.closest('.m3-navigation-tab'))

    tab.value?.focus()
    expect(document.activeElement).toBe(link)

    tab.value?.blur()
    expect(document.activeElement).not.toBe(link)

    tab.value?.click()
    expect(onNavigate).toHaveBeenCalledOnce()
  })

  test('resolves standalone automatic appearance at compact and large widths', async () => {
    const initialWidth = window.innerWidth

    try {
      const view = render(M3NavigationTab, { attrs: { 'aria-label': 'Inbox' } })
      const tab = view.container.querySelector('.m3-navigation-tab')!

      for (const [width, appearance] of [[400, 'bar'], [1700, 'rail-expanded']] as const) {
        Object.defineProperty(window, 'innerWidth', { configurable: true, writable: true, value: width })
        window.dispatchEvent(new Event('resize'))
        await nextTick()

        expect(tab.classList.contains(`m3-navigation-tab_in-${appearance}`)).toBe(true)
      }
    } finally {
      Object.defineProperty(window, 'innerWidth', { configurable: true, writable: true, value: initialWidth })
      window.dispatchEvent(new Event('resize'))
      await nextTick()
    }
  })

  test('merges an explicit labelled-by reference', () => {
    const view = render(M3NavigationTab, {
      attrs: { 'aria-labelledby': 'section-heading' },
      slots: { default: () => h(M3Icon, { name: 'mail' }) },
    })
    const button = screen.getByRole('button')

    expect(button.getAttribute('aria-labelledby')).toContain('section-heading')
  })

  test('supports an icon without a text label or event callbacks', async () => {
    const view = render(M3NavigationTab, {
      attrs: { 'aria-label': 'Inbox' },
      slots: { default: () => h(M3Icon, { name: 'mail' }) },
    })
    const button = screen.getByRole('button', { name: 'Inbox' })

    expect(view.container.querySelector('.m3-navigation-tab__label')).toBeNull()
    await fireEvent.keyUp(button, { code: 'Escape' })
    await fireEvent.click(button)
  })
})
