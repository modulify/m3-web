import {
  fireEvent,
  render,
  screen,
} from '@testing-library/vue'

import { h } from 'vue'

import { M3Icon } from '@/components/icon'
import { M3NavigationTab } from '@/components/navigation'

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
    const icon = container.querySelector('.m3-icon') as HTMLElement
    const badge = container.querySelector('.m3-navigation-tab__badge') as HTMLElement

    expect(root.classList.contains('m3-navigation-tab_active')).toBe(true)
    expect(icon.classList.contains('m3-icon_filled')).toBe(true)
    expect(root.getAttribute('aria-labelledby')).toContain('-label-for-rail')
    expect(badge).not.toBeNull()
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
    const { container } = render(M3NavigationTab, {
      props: {
        label: 'Inbox',
      },
      attrs: {
        'aria-label': 'Custom tab label',
      },
    })

    const root = container.querySelector('.m3-navigation-tab') as HTMLElement

    expect(root.getAttribute('aria-label')).toBe('Custom tab label')
    expect(root.getAttribute('aria-labelledby')).toBeNull()
  })
})
