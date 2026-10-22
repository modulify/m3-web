import { createApp, h } from 'vue'
import { page } from 'vitest/browser'

import { M3Button } from '@/components/button'
import { M3Icon } from '@/components/icon'

test('fixed button keeps its width and clips ripple to the visible surface', async () => {
  await page.viewport(600, 400)
  const mountPoint = document.createElement('div')
  mountPoint.style.padding = '24px'
  document.body.append(mountPoint)
  const app = createApp({
    render: () => h('div', [
      h(M3Button, { size: 'xs', width: 'narrow', appearance: 'tonal', 'aria-label': 'More' }, () => h(M3Icon, { name: 'more_vert' })),
      h(M3Button, { width: 'wide' }, () => 'Go'),
      h(M3Button, { width: 'medium', appearance: 'filled', toggleable: true, 'aria-label': 'Pin' }, () => h(M3Icon, { name: 'push_pin' })),
      h(M3Button, {}, () => 'Continue'),
      h('span', { style: { background: 'var(--m3-sys-surface-container-highest)' }, 'data-reference': '' }),
    ]),
  })
  app.mount(mountPoint)

  try {
    const fixed = mountPoint.querySelector<HTMLButtonElement>('.m3-button_fixed')!
    const regular = mountPoint.querySelector<HTMLButtonElement>('.m3-button:not(.m3-button_fixed)')!
    const bounds = fixed.getBoundingClientRect()

    expect(bounds.width).toBe(28)
    expect(bounds.height).toBe(32)
    expect(mountPoint.querySelector<HTMLButtonElement>('.m3-button_fixed.m3-button_wide')!.getBoundingClientRect().width).toBe(52)
    expect(document.elementFromPoint(bounds.left - 5, bounds.top + bounds.height / 2)).toBe(fixed)
    expect(getComputedStyle(fixed).backgroundColor).not.toBe('rgba(0, 0, 0, 0)')
    expect(getComputedStyle(mountPoint.querySelector('.m3-button_fixed.m3-button_toggleable')!).backgroundColor)
      .toBe(getComputedStyle(mountPoint.querySelector('[data-reference]')!).backgroundColor)
    expect(getComputedStyle(fixed.querySelector('.m3-button__ripple')!).overflow).toBe('hidden')
    expect(getComputedStyle(regular.querySelector('.m3-button__ripple')!).overflow).toBe('hidden')
  } finally {
    app.unmount()
    mountPoint.remove()
  }
})

test('XS narrow icon button keeps a 48px target around one clipped visual surface', async () => {
  await page.viewport(600, 400)
  const mountPoint = document.createElement('div')
  mountPoint.style.padding = '24px'
  document.body.append(mountPoint)
  const app = createApp({
    render: () => h(M3Button, { size: 'xs', width: 'narrow', 'aria-label': 'More' }, () => h(M3Icon, { name: 'more_vert' })),
  })
  app.mount(mountPoint)

  try {
    const button = mountPoint.querySelector<HTMLButtonElement>('.m3-button_fixed')!
    const bounds = button.getBoundingClientRect()

    expect(bounds.width).toBe(28)
    expect(bounds.height).toBe(32)
    expect(getComputedStyle(button, '::after').insetInlineStart).toBe('-10px')
    expect(getComputedStyle(button, '::after').insetBlockStart).toBe('-8px')
    expect(document.elementFromPoint(bounds.left - 5, bounds.top + bounds.height / 2)).toBe(button)
    expect(button.querySelector('.m3-button__ripple')).toBeTruthy()
    expect(getComputedStyle(button.querySelector('.m3-button__ripple')!).overflow).toBe('hidden')
  } finally {
    app.unmount()
    mountPoint.remove()
  }
})
