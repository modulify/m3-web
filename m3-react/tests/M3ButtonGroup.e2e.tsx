import { act } from '@testing-library/react'
import { page } from 'vitest/browser'
import { render } from '@testing-library/react'

import { M3ButtonGroup, M3ButtonGroupItem } from '@/components/button-group'
import { M3Icon } from '@/components/icon'

test('connected group fills its surface and keeps 48px targets at XS without moving neighbors', async () => {
  await page.viewport(600, 400)
  const view = render(
    <div style={{ width: 360 }}>
      <M3ButtonGroup variant="connected" size="xs" defaultValue="one">
        <M3ButtonGroupItem value="one"><M3Icon name="check" />One</M3ButtonGroupItem>
        <M3ButtonGroupItem value="two"><M3Icon name="close" />Two</M3ButtonGroupItem>
      </M3ButtonGroup>
    </div>
  )

  try {
    const group = view.container.querySelector<HTMLElement>('.m3-button-group')!
    const wrappers = [...view.container.querySelectorAll<HTMLElement>('.m3-button-group__wrapper')]
    const buttons = [...view.container.querySelectorAll<HTMLButtonElement>('.m3-button-group__item')]
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
    expect(buttons[0]!.querySelector(':scope > .m3-button__ripple > .m3-ripple')).toBeTruthy()
    expect(Math.abs(icon.getBoundingClientRect().y + 10 - (label.getBoundingClientRect().y + label.getBoundingClientRect().height / 2))).toBeLessThan(1)

    await act(async () => buttons[1]!.click())
    expect(buttons[1]!.getAttribute('aria-pressed')).toBe('true')
    expect(buttons.map(button => button.getBoundingClientRect().x)).toEqual(before)
    expect(label.getBoundingClientRect().x - icon.getBoundingClientRect().right).toBe(iconOffset)
    expect(glyph.classList.contains('m3-icon_filled')).toBe(true)
  } finally {
    view.unmount()
  }
})

test('an XS ordinary icon-only action keeps a 48px click target', async () => {
  const onClick = vi.fn()
  const view = render(
    <div style={{ padding: 16 }}>
      <M3ButtonGroup size="xs">
        <M3ButtonGroupItem value="more" aria-label="More" onClick={onClick}><M3Icon name="more_vert" /></M3ButtonGroupItem>
      </M3ButtonGroup>
    </div>
  )

  try {
    const wrapper = view.container.querySelector<HTMLElement>('.m3-button-group__wrapper')!
    const button = wrapper.querySelector<HTMLButtonElement>('.m3-button-group__item')!
    expect(button.getBoundingClientRect().width).toBe(32)
    expect(button.getBoundingClientRect().height).toBe(32)
    expect(wrapper.getBoundingClientRect().height).toBe(48)
    expect(getComputedStyle(wrapper, '::before').insetInlineStart).toBe('-8px')
    const bounds = button.getBoundingClientRect()
    const hitTarget = document.elementFromPoint(bounds.left - 4, bounds.top + bounds.height / 2)
    expect(hitTarget).toBe(wrapper)
    await act(async () => (hitTarget as HTMLElement).click())
    expect(onClick).toHaveBeenCalledOnce()
  } finally {
    view.unmount()
  }
})

test('connected icon button keeps its own visual width', async () => {
  const view = render(
    <div style={{ width: 360 }}>
      <M3ButtonGroup variant="connected">
        <M3ButtonGroupItem value="label">Label</M3ButtonGroupItem>
        <M3ButtonGroupItem value="more" kind="icon" width="wide" aria-label="More"><M3Icon name="more_vert" /></M3ButtonGroupItem>
      </M3ButtonGroup>
    </div>
  )

  try {
    const iconButton = view.container.querySelector<HTMLButtonElement>('.m3-button-group__item.m3-button_fixed')!
    const wrapper = iconButton.parentElement!
    expect(iconButton.getBoundingClientRect().width).toBe(52)
    expect(wrapper.getBoundingClientRect().width).toBeGreaterThanOrEqual(48)
    expect(iconButton.querySelector('.m3-button__state')!.getBoundingClientRect().width).toBe(52)
  } finally {
    view.unmount()
  }
})
