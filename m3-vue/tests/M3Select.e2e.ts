import { createApp, h, nextTick } from 'vue'

import { M3Select } from '@/components/select'

test.each(['ltr', 'rtl'] as const)('aligns the exposed menu with a wide text field in %s', async (direction) => {
  const mountPoint = document.createElement('div')
  mountPoint.dir = direction
  mountPoint.style.padding = '24px'
  document.body.append(mountPoint)

  const app = createApp({
    render: () => h(M3Select, {
      label: 'Status',
      style: { width: '360px' },
      options: [{ value: 'draft', label: 'Draft' }],
    }),
  })
  app.mount(mountPoint)

  try {
    const field = mountPoint.querySelector<HTMLElement>('[role="combobox"]')!
    const fieldContainer = field.closest<HTMLElement>('.m3-select__field')!
    await nextTick()
    field.click()

    const menu = await vi.waitFor(() => {
      const element = document.querySelector<HTMLElement>('.m3-select__menu.m3-popper_shown')
      expect(element).not.toBeNull()
      return element!
    })
    const fieldRect = fieldContainer.getBoundingClientRect()
    const menuRect = menu.getBoundingClientRect()

    expect(menuRect.width).toBeCloseTo(fieldRect.width, 0)
    expect(menuRect.top).toBeGreaterThanOrEqual(fieldRect.bottom - 1)
    expect(direction === 'ltr' ? menuRect.left : menuRect.right)
      .toBeCloseTo(direction === 'ltr' ? fieldRect.left : fieldRect.right, 0)
  } finally {
    app.unmount()
    mountPoint.remove()
  }
})

test('scrolls long menus without changing the first item shape', async () => {
  const mountPoint = document.createElement('div')
  document.body.append(mountPoint)
  const app = createApp({
    render: () => h(M3Select, {
      label: 'Choice',
      options: Array.from({ length: 12 }, (_, index) => ({ value: index, label: `Option ${index + 1}` })),
    }),
  })
  app.mount(mountPoint)

  try {
    const field = mountPoint.querySelector<HTMLElement>('[role="combobox"]')!
    await nextTick()
    field.click()

    const menu = await vi.waitFor(() => {
      const element = document.querySelector<HTMLElement>('.m3-select__menu.m3-popper_shown')
      expect(element).not.toBeNull()
      return element!
    })
    const first = menu.querySelector<HTMLElement>('.m3-menu-item')!

    expect(getComputedStyle(first).borderTopLeftRadius).toBe('12px')
    expect(getComputedStyle(menu).paddingInlineEnd).toBe('4px')
    expect(first.parentElement).toBe(menu)
    expect(menu.scrollHeight).toBeGreaterThan(menu.clientHeight)
    expect(menu.querySelector('.m3-scroll-rail')).toBeNull()
    menu.scrollTop = menu.scrollHeight
    expect(menu.scrollTop).toBeGreaterThan(0)
  } finally {
    app.unmount()
    mountPoint.remove()
  }
})
