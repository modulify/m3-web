import { defineComponent } from 'vue'
import { fireEvent } from '@testing-library/vue'
import { h, ref } from 'vue'
import { render, screen } from '@testing-library/vue'
import { waitFor } from '@testing-library/vue'

import { M3MenuItem } from '@/components/menu'

vi.mock('@modulify/m3-foundation/lib/popper/floating', () => ({
  computePosition: vi.fn(async () => ({ placement: 'right-start', side: 'right' })),
}))

describe('m3-vue/menu-item', () => {
  test('exposes the rendered menu item to its parent', () => {
    const instance = ref<{ el: HTMLElement | null } | null>(null)
    const view = render(defineComponent({
      setup: () => () => h(M3MenuItem, { ref: instance }, () => 'Settings'),
    }))

    expect(instance.value?.el).toBe(view.getByRole('menuitem', { name: 'Settings' }))
  })

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

    const root = container.querySelector('.m3-menu-item') as HTMLButtonElement

    expect(root.tagName).toBe('BUTTON')
    expect(root.getAttribute('href')).toBeNull()
    expect(root.getAttribute('role')).toBe('menuitem')
    expect(root.getAttribute('aria-disabled')).toBe('true')
    expect(root.classList.contains('m3-menu-item_selected')).toBe(true)
    expect(root.classList.contains('m3-menu-item_disabled')).toBe(true)

    const icons = container.querySelectorAll('.m3-menu-item__icon')

    expect(icons.length).toBe(2)
    expect(container.querySelector('.m3-menu-item__body')?.textContent?.trim()).toBe('Body')
  })

  test('exposes selected options as checked menu items', () => {
    const { container } = render(M3MenuItem, {
      props: { selection: 'multiple', selected: true },
      slots: { default: 'Favorite' },
    })

    const item = container.querySelector('.m3-menu-item')
    expect(item?.getAttribute('role')).toBe('menuitemcheckbox')
    expect(item?.getAttribute('aria-checked')).toBe('true')
  })

  test('supports a single choice and invokes an enabled action once', async () => {
    const onClick = vi.fn()
    const view = render({
      render: () => h(M3MenuItem, { selection: 'single', selected: false, onClick }, () => 'Draft'),
    })
    const item = view.container.querySelector<HTMLElement>('.m3-menu-item')!

    expect(item.getAttribute('role')).toBe('menuitemradio')
    expect(item.getAttribute('aria-checked')).toBe('false')
    await fireEvent.click(item)
    await fireEvent.keyUp(item, { key: 'Enter' })
    await fireEvent.mouseEnter(item)
    await fireEvent.mouseLeave(item)
    await fireEvent.keyDown(item, { key: 'ArrowRight' })
    expect(onClick).toHaveBeenCalledOnce()
  })

  test('does not activate a disabled destination', async () => {
    const onClick = vi.fn()
    const view = render({
      render: () => h(M3MenuItem, { href: '/delete', disabled: true, onClick }, () => 'Delete'),
    })
    const item = view.container.querySelector<HTMLElement>('.m3-menu-item')!

    expect(item.tagName).toBe('BUTTON')
    expect(item.getAttribute('href')).toBeNull()
    await fireEvent.click(item)
    await fireEvent.keyUp(item, { code: 'Enter' })
    await fireEvent.keyUp(item, { key: 'Enter' })
    expect(onClick).not.toHaveBeenCalled()
  })

  test('does not open a submenu from a disabled parent', async () => {
    const view = render(M3MenuItem, {
      props: { disabled: true },
      slots: {
        default: 'More actions',
        submenu: () => h(M3MenuItem, null, () => 'Archive'),
      },
    })
    const parent = view.container.querySelector<HTMLElement>('.m3-menu-item')!

    await fireEvent.mouseEnter(parent)
    await fireEvent.keyDown(parent, { key: 'ArrowRight' })
    await fireEvent.click(parent)
    expect(parent.getAttribute('aria-expanded')).toBe('false')
  })

  test('opens a submenu when its parent is clicked', async () => {
    const view = render(M3MenuItem, {
      slots: {
        default: 'More actions',
        submenu: () => h(M3MenuItem, null, () => 'Archive'),
      },
    })
    const parent = view.container.querySelector<HTMLElement>('.m3-menu-item')!

    await fireEvent.click(parent)
    expect(parent.getAttribute('aria-expanded')).toBe('true')
  })

  test('opens a submenu on hover and closes it after leaving', async () => {
    const view = render(M3MenuItem, {
      slots: {
        default: 'More actions',
        submenu: () => h(M3MenuItem, null, () => 'Archive'),
      },
    })
    const parent = view.container.querySelector<HTMLElement>('.m3-menu-item')!

    await fireEvent.mouseEnter(parent)
    expect(parent.getAttribute('aria-expanded')).toBe('true')

    await fireEvent.mouseLeave(parent)
    await waitFor(() => {
      expect(parent.getAttribute('aria-expanded')).toBe('false')
    })
  })

  test('keeps a submenu open while the pointer moves from its parent into the menu', async () => {
    const view = render(M3MenuItem, {
      slots: {
        default: 'More actions',
        submenu: () => h(M3MenuItem, null, () => 'Archive'),
      },
    })
    const parent = view.container.querySelector<HTMLElement>('.m3-menu-item')!

    await fireEvent.mouseEnter(parent)
    const submenu = await screen.findByRole('menu')
    await fireEvent.mouseLeave(parent)
    await fireEvent.mouseEnter(submenu)

    await new Promise(resolve => setTimeout(resolve, 250))
    expect(parent.getAttribute('aria-expanded')).toBe('true')

    await fireEvent.mouseLeave(submenu)
    await waitFor(() => expect(parent.getAttribute('aria-expanded')).toBe('false'))
  })

  test('opens a submenu with the leading arrow in RTL and closes on outside focus', async () => {
    document.dir = 'rtl'

    try {
      const view = render(M3MenuItem, {
        slots: {
          default: 'More actions',
          submenu: () => h(M3MenuItem, null, () => 'Archive'),
        },
      })
      const parent = view.container.querySelector<HTMLElement>('.m3-menu-item')!

      await fireEvent.keyDown(parent, { key: 'ArrowLeft' })
      expect(parent.getAttribute('aria-expanded')).toBe('true')

      await fireEvent.blur(parent, { relatedTarget: document.body })
      expect(parent.getAttribute('aria-expanded')).toBe('false')
    } finally {
      document.dir = ''
    }
  })

  test('keeps a submenu open while focus moves between its parent and child', async () => {
    const view = render(M3MenuItem, {
      slots: {
        default: 'More actions',
        submenu: () => h(M3MenuItem, null, () => 'Archive'),
      },
    })
    const parent = view.container.querySelector<HTMLElement>('.m3-menu-item')!

    await fireEvent.blur(parent, { relatedTarget: document.body })
    await fireEvent.keyDown(parent, { key: 'ArrowUp' })
    expect(parent.getAttribute('aria-expanded')).toBe('false')

    await fireEvent.mouseEnter(parent)
    const submenu = await screen.findByRole('menu')
    const child = screen.getByRole('menuitem', { name: 'Archive' })

    await fireEvent.blur(parent, { relatedTarget: child })
    expect(parent.getAttribute('aria-expanded')).toBe('true')

    await fireEvent.focusOut(submenu, { relatedTarget: parent })
    expect(parent.getAttribute('aria-expanded')).toBe('true')

    await fireEvent.focusOut(submenu, { relatedTarget: document.body })
    expect(parent.getAttribute('aria-expanded')).toBe('false')
  })
})
