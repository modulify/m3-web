import {
  createApp,
  h,
  nextTick,
  ref,
} from 'vue'

import { M3Menu, M3MenuItem } from '@/components/menu'

test('switches between standard and vibrant color and density', async () => {
  const trigger = document.createElement('button')
  document.body.append(trigger)
  const mountPoint = document.createElement('div')
  document.body.append(mountPoint)
  const color = ref<'standard' | 'vibrant'>('vibrant')
  const density = ref<0 | -2>(-2)
  const app = createApp({
    render: () => h(M3Menu, {
      target: () => trigger,
      color: color.value,
      density: density.value,
    }, { default: () => h(M3MenuItem, null, () => 'Rename') }),
  })
  app.mount(mountPoint)

  try {
    trigger.click()
    const menu = await vi.waitFor(() => {
      const element = document.querySelector<HTMLElement>('.m3-menu.m3-popper_shown')
      expect(element).not.toBeNull()
      return element!
    })
    expect(menu.classList.contains('m3-menu_vibrant')).toBe(true)
    expect(menu.classList.contains('m3-menu_density--2')).toBe(true)
    expect(getComputedStyle(menu.querySelector('.m3-menu-item__content')!).minHeight).toBe('40px')

    color.value = 'standard'
    density.value = 0
    await nextTick()
    expect(menu.classList.contains('m3-menu_vibrant')).toBe(false)
    expect(menu.classList.contains('m3-menu_density--2')).toBe(false)
  } finally {
    app.unmount()
    trigger.remove()
    mountPoint.remove()
  }
})

test('leaves listbox keyboard handling to its consumer', async () => {
  const trigger = document.createElement('button')
  document.body.append(trigger)
  const mountPoint = document.createElement('div')
  document.body.append(mountPoint)
  const app = createApp({
    render: () => h(M3Menu, { target: () => trigger, role: 'listbox' }, {
      default: () => [
        h(M3MenuItem, { role: 'option' }, () => 'Draft'),
        h(M3MenuItem, { role: 'option' }, () => 'Published'),
      ],
    }),
  })
  app.mount(mountPoint)

  try {
    trigger.click()
    const menu = await vi.waitFor(() => {
      const element = document.querySelector<HTMLElement>('.m3-menu.m3-popper_shown')
      expect(element).not.toBeNull()
      return element!
    })
    const first = menu.querySelector<HTMLElement>('.m3-menu-item')!
    first.focus()
    first.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    expect(document.activeElement).toBe(first)
  } finally {
    app.unmount()
    trigger.remove()
    mountPoint.remove()
  }
})

test('menu keyboard navigation skips disabled items and returns focus on Escape', async () => {
  const trigger = document.createElement('button')
  trigger.textContent = 'Open menu'
  document.body.append(trigger)

  const mountPoint = document.createElement('div')
  document.body.append(mountPoint)
  const app = createApp({
    render: () => h(M3Menu, { target: () => trigger }, {
      default: () => [
        h(M3MenuItem, null, () => 'First'),
        h(M3MenuItem, { disabled: true }, () => 'Unavailable'),
        h(M3MenuItem, null, () => 'Last'),
      ],
    }),
  })
  app.mount(mountPoint)

  try {
    trigger.focus()
    trigger.click()
    await nextTick()

    await vi.waitFor(() => expect(document.activeElement?.textContent).toBe('First'))
    document.activeElement?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    expect(document.activeElement?.textContent).toBe('Last')

    document.activeElement?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    expect(document.activeElement?.textContent).toBe('First')
    document.activeElement?.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }))
    expect(document.activeElement?.textContent).toBe('Last')
    document.activeElement?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }))
    expect(document.activeElement?.textContent).toBe('First')
    document.activeElement?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }))
    expect(document.activeElement?.textContent).toBe('First')
    document.activeElement?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }))
    expect(document.activeElement?.textContent).toBe('Last')

    document.activeElement?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await vi.waitFor(() => expect(document.activeElement).toBe(trigger))
  } finally {
    app.unmount()
    trigger.remove()
    mountPoint.remove()
  }
})

test('submenu opens from its parent and returns focus on the reverse arrow', async () => {
  const trigger = document.createElement('button')
  trigger.textContent = 'Open menu'
  document.body.append(trigger)

  const mountPoint = document.createElement('div')
  document.body.append(mountPoint)
  const app = createApp({
    render: () => h(M3Menu, { target: () => trigger }, {
      default: () => h(M3MenuItem, null, {
        default: () => 'More actions',
        submenu: () => [
          h(M3MenuItem, null, () => 'Favorite'),
          h(M3MenuItem, null, () => 'Archive'),
        ],
      }),
    }),
  })
  app.mount(mountPoint)

  try {
    trigger.focus()
    trigger.click()
    await nextTick()

    const parent = await vi.waitFor(() => {
      const item = document.querySelector<HTMLElement>('.m3-menu-item[aria-haspopup="menu"]')
      expect(item).not.toBeNull()
      return item!
    })
    await vi.waitFor(() => expect(document.activeElement).toBe(parent))
    expect(parent?.getAttribute('aria-expanded')).toBe('false')

    parent?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
    await vi.waitFor(() => expect(parent?.getAttribute('aria-expanded')).toBe('true'))
    const child = await vi.waitFor(() => {
      const item = Array.from(document.querySelectorAll<HTMLElement>('.m3-menu-item')).find(item => item.textContent?.includes('Favorite'))
      expect(item).toBeDefined()
      return item!
    })
    await vi.waitFor(() => expect(document.activeElement).toBe(child))

    child?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }))
    await vi.waitFor(() => expect(document.activeElement).toBe(parent))
    await vi.waitFor(() => expect(parent?.getAttribute('aria-expanded')).toBe('false'))

    parent?.blur()
    await vi.waitFor(() => expect(parent?.getAttribute('aria-expanded')).toBe('false'))

    parent?.click()
    await vi.waitFor(() => expect(parent?.getAttribute('aria-expanded')).toBe('true'))
    parent?.dispatchEvent(new MouseEvent('mouseleave'))
    await vi.waitFor(() => expect(parent?.getAttribute('aria-expanded')).toBe('false'))

    parent?.dispatchEvent(new MouseEvent('mouseenter'))
    await vi.waitFor(() => expect(parent?.getAttribute('aria-expanded')).toBe('true'))
    const action = Array.from(document.querySelectorAll<HTMLElement>('.m3-menu-item')).find(item => item.textContent?.includes('Archive'))
    action?.click()
    await vi.waitFor(() => expect(document.querySelectorAll('.m3-menu.m3-popper_shown')).toHaveLength(0))
  } finally {
    app.unmount()
    trigger.remove()
    mountPoint.remove()
  }
})

test('submenu keyboard directions follow RTL layout', async () => {
  const previousDirection = document.dir
  document.dir = 'rtl'
  const trigger = document.createElement('button')
  document.body.append(trigger)
  const mountPoint = document.createElement('div')
  document.body.append(mountPoint)
  const app = createApp({
    render: () => h(M3Menu, { target: () => trigger }, {
      default: () => h(M3MenuItem, null, {
        default: () => 'More',
        submenu: () => h(M3MenuItem, null, () => 'Child'),
      }),
    }),
  })
  app.mount(mountPoint)

  try {
    trigger.focus()
    trigger.click()
    await nextTick()
    await vi.waitFor(() => expect(document.querySelector('.m3-menu.m3-popper_shown')).not.toBeNull())
    const parent = await vi.waitFor(() => {
      const item = document.querySelector<HTMLElement>('.m3-menu-item[aria-haspopup="menu"]')
      expect(item).not.toBeNull()
      return item!
    })
    parent.focus()
    expect(document.activeElement).toBe(parent)

    parent?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }))
    await vi.waitFor(() => expect(document.querySelectorAll('.m3-menu.m3-popper_shown')).toHaveLength(2))
    const child = await vi.waitFor(() => {
      const item = Array.from(document.querySelectorAll<HTMLElement>('.m3-menu-item')).find(item => item.textContent?.includes('Child'))
      expect(item).toBeDefined()
      return item!
    })
    child.focus()
    expect(document.activeElement).toBe(child)

    child?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
    await vi.waitFor(() => expect(document.activeElement).toBe(parent))
  } finally {
    app.unmount()
    trigger.remove()
    mountPoint.remove()
    document.dir = previousDirection
  }
})
