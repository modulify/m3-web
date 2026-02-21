import { render } from '@testing-library/vue'

import { M3MenuItem } from '@/components/menu'

describe('m3-vue/menu-item', () => {
  test('renders href link with selected and disabled modifiers', () => {
    const { container } = render(M3MenuItem, {
      props: {
        href: '//example.com',
        selected: true,
        disabled: true,
      },
      slots: {
        leading: 'L',
        default: 'Body',
        trailing: 'T',
      },
    })

    const root = container.querySelector('.m3-menu-item') as HTMLAnchorElement

    expect(root.tagName).toBe('A')
    expect(root.getAttribute('href')).toBe('//example.com')
    expect(root.classList.contains('m3-menu-item_selected')).toBe(true)
    expect(root.classList.contains('m3-menu-item_disabled')).toBe(true)

    const icons = container.querySelectorAll('.m3-menu-item__icon')

    expect(icons.length).toBe(2)
    expect(container.querySelector('.m3-menu-item__body')?.textContent?.trim()).toBe('Body')
  })
})
