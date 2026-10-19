import { defineComponent } from 'vue'
import { fireEvent } from '@testing-library/vue'
import { h } from 'vue'
import { render, screen } from '@testing-library/vue'

import { M3ListItem } from '@/components/list'

describe('m3-vue/list-item', () => {
  test('renders static content as a one-line headline', () => {
    const view = render(M3ListItem, { slots: { default: 'Plain content' } })
    expect(view.container.querySelector('.m3-list-item__headline')?.textContent).toBe('Plain content')
    expect(view.container.querySelector('button, a')).toBeNull()
  })

  test('renders a three-line selected destination with accessory slots', async () => {
    const onClick = vi.fn((event: MouseEvent) => event.preventDefault())
    const onKeyup = vi.fn()
    const view = render(M3ListItem, {
      props: { href: '/inbox', headline: 'Inbox', overline: 'Mail', supportingText: '24 unread', selected: true },
      attrs: { onClick, onKeyup },
      slots: { leading: '<span>Icon</span>', trailing: '<span>24</span>' },
    })
    const item = view.container.querySelector('.m3-list-item') as HTMLElement
    const link = screen.getByRole('link', { name: /Inbox/ })
    expect(item.classList.contains('m3-list-item_selected')).toBe(true)
    expect(item.style.getPropertyValue('--m3-list-item-supporting-lines')).toBe('2')
    expect(view.container.querySelector('.m3-list-item__leading')).not.toBeNull()
    expect(view.container.querySelector('.m3-list-item__trailing')).not.toBeNull()
    await fireEvent.click(link)
    await fireEvent.keyUp(link, { code: 'Enter' })
    expect(onClick).toHaveBeenCalledTimes(1)
    expect(onKeyup).toHaveBeenCalledTimes(1)
  })

  test('prevents disabled destination activation and supports a slot-based button action', async () => {
    const onClick = vi.fn()
    const disabled = render(M3ListItem, {
      props: { href: '/admin', headline: 'Admin', disabled: true },
      attrs: { onClick },
    })
    const anchor = disabled.container.querySelector('a') as HTMLAnchorElement
    expect(anchor.getAttribute('aria-disabled')).toBe('true')
    expect(anchor.tabIndex).toBe(-1)
    expect(anchor.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))).toBe(false)
    expect(onClick).not.toHaveBeenCalled()

    const enabled = render(M3ListItem, {
      props: { interactive: true, type: 'submit', lines: 2 },
      slots: { headline: 'Save draft', supportingText: 'Keep working later' },
    })
    const button = enabled.container.querySelector('button') as HTMLButtonElement
    expect(button.type).toBe('submit')
    expect(enabled.container.querySelector('.m3-list-item__supporting-text')?.textContent).toBe('Keep working later')
  })

  test('accepts multiple click listeners on an interactive item', async () => {
    const first = vi.fn()
    const second = vi.fn()
    const Harness = defineComponent({
      setup: () => () => h(M3ListItem, { interactive: true, onClick: [first, second] }, { default: () => 'Open' }),
    })
    render(Harness)
    await fireEvent.click(screen.getByRole('button', { name: 'Open' }))
    expect(first).toHaveBeenCalledTimes(1)
    expect(second).toHaveBeenCalledTimes(1)
  })
})
