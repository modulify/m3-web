import { createApp, h, nextTick } from 'vue'
import { page } from 'vitest/browser'

import { M3ButtonGroup, M3ButtonGroupItem } from '@/components/button-group'
import { M3Icon } from '@/components/icon'

test('connected group fills its surface and keeps 48px targets at XS without moving neighbors', async () => {
  await page.viewport(600, 400)
  const mountPoint = document.createElement('div')
  mountPoint.style.width = '360px'
  document.body.append(mountPoint)

  const app = createApp({
    render: () => h(M3ButtonGroup, { variant: 'connected', size: 'xs', defaultValue: 'one' }, () => [
      h(M3ButtonGroupItem, { value: 'one' }, () => [h(M3Icon, { name: 'check' }), 'One']),
      h(M3ButtonGroupItem, { value: 'two' }, () => [h(M3Icon, { name: 'close' }), 'Two']),
    ]),
  })
  app.mount(mountPoint)

  try {
    const group = mountPoint.querySelector<HTMLElement>('.m3-button-group')!
    const wrappers = [...mountPoint.querySelectorAll<HTMLElement>('.m3-button-group__wrapper')]
    const buttons = [...mountPoint.querySelectorAll<HTMLButtonElement>('.m3-button-group__item')]
    const before = buttons.map(button => button.getBoundingClientRect().x)
    const icon = buttons[1]!.querySelector<HTMLElement>('.m3-button__icon')!
    const glyph = icon.querySelector<HTMLElement>('.m3-icon')!
    const label = buttons[1]!.querySelector<HTMLElement>('.m3-button__text')!
    const iconOffset = label.getBoundingClientRect().x - icon.getBoundingClientRect().right

    expect(group.getBoundingClientRect().width).toBe(360)
    expect(wrappers.every(wrapper => wrapper.getBoundingClientRect().height >= 48)).toBe(true)
    expect(buttons[0]!.getBoundingClientRect().height).toBe(32)
    expect(getComputedStyle(buttons[1]!).borderWidth).toBe('0px')
    expect(buttons[1]!.querySelector('.m3-button__state')!.getBoundingClientRect().width).toBe(buttons[1]!.getBoundingClientRect().width)
    expect(glyph.getBoundingClientRect().width).toBe(20)
    expect(glyph.getBoundingClientRect().height).toBe(20)
    expect(getComputedStyle(buttons[0]!).overflow).toBe('hidden')
    expect(Math.abs(icon.getBoundingClientRect().y + 10 - (label.getBoundingClientRect().y + label.getBoundingClientRect().height / 2))).toBeLessThan(1)

    buttons[1]!.click()
    await nextTick()
    expect(buttons[1]!.getAttribute('aria-pressed')).toBe('true')
    expect(buttons.map(button => button.getBoundingClientRect().x)).toEqual(before)
    expect(label.getBoundingClientRect().x - icon.getBoundingClientRect().right).toBe(iconOffset)
    expect(glyph.classList.contains('m3-icon_filled')).toBe(true)
  } finally {
    app.unmount()
    mountPoint.remove()
  }
})

test('an XS ordinary icon-only action keeps a 48px click target', async () => {
  await page.viewport(600, 400)
  const mountPoint = document.createElement('div')
  mountPoint.style.padding = '16px'
  document.body.append(mountPoint)
  const onClick = vi.fn()
  const app = createApp({
    render: () => h(M3ButtonGroup, { size: 'xs' }, () => h(M3ButtonGroupItem, { value: 'more', 'aria-label': 'More', onClick }, () => h(M3Icon, { name: 'more_vert' }))),
  })
  app.mount(mountPoint)

  try {
    const wrapper = mountPoint.querySelector<HTMLElement>('.m3-button-group__wrapper')!
    const button = wrapper.querySelector<HTMLButtonElement>('.m3-button-group__item')!
    expect(button.getBoundingClientRect().width).toBe(32)
    expect(button.getBoundingClientRect().height).toBe(32)
    expect(wrapper.getBoundingClientRect().height).toBe(48)
    expect(getComputedStyle(wrapper, '::before').insetInlineStart).toBe('-8px')
    const bounds = button.getBoundingClientRect()
    const hitTarget = document.elementFromPoint(bounds.left - 4, bounds.top + bounds.height / 2)
    expect(hitTarget).toBe(wrapper)
    ;(hitTarget as HTMLElement).click()
    await nextTick()
    expect(onClick).toHaveBeenCalledOnce()
  } finally {
    app.unmount()
    mountPoint.remove()
  }
})

test('connected icon button keeps its own visual width', async () => {
  const mountPoint = document.createElement('div')
  mountPoint.style.width = '360px'
  document.body.append(mountPoint)
  const app = createApp({
    render: () => h(M3ButtonGroup, { variant: 'connected' }, () => [
      h(M3ButtonGroupItem, { value: 'label' }, () => 'Label'),
      h(M3ButtonGroupItem, { value: 'more', kind: 'icon', width: 'wide', 'aria-label': 'More' }, () => h(M3Icon, { name: 'more_vert' })),
    ]),
  })
  app.mount(mountPoint)

  try {
    const iconButton = mountPoint.querySelector<HTMLButtonElement>('.m3-button-group__item.m3-button_fixed')!
    const wrapper = iconButton.parentElement!
    expect(iconButton.getBoundingClientRect().width).toBe(52)
    expect(wrapper.getBoundingClientRect().width).toBeGreaterThanOrEqual(48)
    expect(iconButton.querySelector('.m3-button__state')!.getBoundingClientRect().width).toBe(52)
  } finally {
    app.unmount()
    mountPoint.remove()
  }
})
