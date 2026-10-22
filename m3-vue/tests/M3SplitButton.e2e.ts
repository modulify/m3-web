import { createApp, h, nextTick } from 'vue'
import { page } from 'vitest/browser'

import { M3MenuItem } from '@/components/menu'
import { M3SplitButton } from '@/components/split-button'

test('XS split button keeps two targets, a 2px gap, and a stable layout when its menu opens', async () => {
  await page.viewport(600, 400)
  const mountPoint = document.createElement('div')
  mountPoint.style.padding = '24px'
  document.body.append(mountPoint)
  const app = createApp({
    render: () => h(M3SplitButton, { size: 'xs', menuLabel: 'Other actions' }, {
      default: () => 'Send',
      menu: () => h(M3MenuItem, null, () => 'Later'),
    }),
  })
  app.mount(mountPoint)

  try {
    const group = mountPoint.querySelector<HTMLElement>('.m3-split-button')!
    const segments = [...group.querySelectorAll<HTMLElement>('.m3-split-button__segment')]
    const buttons = [...group.querySelectorAll<HTMLButtonElement>('button')]
    const width = group.getBoundingClientRect().width

    expect(buttons).toHaveLength(2)
    expect(segments.every(segment => segment.getBoundingClientRect().height >= 48)).toBe(true)
    expect(buttons.every(button => button.getBoundingClientRect().height === 32)).toBe(true)
    expect(buttons[1]!.getBoundingClientRect().width).toBe(48)
    expect(getComputedStyle(group).gap).toBe('2px')
    expect(getComputedStyle(buttons[0]!).borderStartEndRadius).toBe('4px')
    expect(getComputedStyle(buttons[1]!).borderStartStartRadius).toBe('4px')

    buttons[1]!.click()
    await nextTick()
    await vi.waitFor(() => expect(buttons[1]!.getAttribute('aria-expanded')).toBe('true'))
    expect(group.getBoundingClientRect().width).toBe(width)
    await vi.waitFor(() => expect(buttons[1]!.getBoundingClientRect().width).toBe(32))
  } finally {
    app.unmount()
    mountPoint.remove()
  }
})
