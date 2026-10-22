import { page } from 'vitest/browser'
import { render } from '@testing-library/react'

import { M3Button } from '@/components/button'
import { M3Icon } from '@/components/icon'

test('fixed button keeps its width and clips ripple to the visible surface', async () => {
  await page.viewport(600, 400)
  const view = render(
    <div style={{ padding: 24 }}>
      <M3Button size="xs" width="narrow" appearance="tonal" aria-label="More">
        <M3Icon name="more_vert" />
      </M3Button>
      <M3Button width="wide">Go</M3Button>
      <M3Button appearance="filled" aria-label="Pin" width="medium" toggleable><M3Icon name="push_pin" /></M3Button>
      <M3Button>Continue</M3Button>
      <span style={{ background: 'var(--m3-sys-surface-container-highest)' }} data-reference />
    </div>
  )

  try {
    const fixed = view.container.querySelector<HTMLButtonElement>('.m3-button_fixed')!
    const regular = view.container.querySelector<HTMLButtonElement>('.m3-button:not(.m3-button_fixed)')!
    const bounds = fixed.getBoundingClientRect()

    expect(bounds.width).toBe(28)
    expect(bounds.height).toBe(32)
    expect(view.container.querySelector<HTMLButtonElement>('.m3-button_fixed.m3-button_wide')!.getBoundingClientRect().width).toBe(52)
    expect(document.elementFromPoint(bounds.left - 5, bounds.top + bounds.height / 2)).toBe(fixed)
    expect(getComputedStyle(fixed).backgroundColor).not.toBe('rgba(0, 0, 0, 0)')
    expect(getComputedStyle(view.container.querySelector('.m3-button_fixed.m3-button_toggleable')!).backgroundColor)
      .toBe(getComputedStyle(view.container.querySelector('[data-reference]')!).backgroundColor)
    expect(getComputedStyle(fixed.querySelector('.m3-button__ripple')!).overflow).toBe('hidden')
    expect(getComputedStyle(regular.querySelector('.m3-button__ripple')!).overflow).toBe('hidden')
  } finally {
    view.unmount()
  }
})

test('XS narrow icon button keeps a 48px target around one clipped visual surface', async () => {
  await page.viewport(600, 400)
  const view = render(
    <div style={{ padding: 24 }}>
      <M3Button size="xs" width="narrow" aria-label="More">
        <M3Icon name="more_vert" />
      </M3Button>
    </div>
  )

  try {
    const button = view.container.querySelector<HTMLButtonElement>('.m3-button_fixed')!
    const bounds = button.getBoundingClientRect()

    expect(bounds.width).toBe(28)
    expect(bounds.height).toBe(32)
    expect(getComputedStyle(button, '::after').insetInlineStart).toBe('-10px')
    expect(getComputedStyle(button, '::after').insetBlockStart).toBe('-8px')
    expect(document.elementFromPoint(bounds.left - 5, bounds.top + bounds.height / 2)).toBe(button)
    expect(button.querySelector('.m3-button__ripple')).toBeTruthy()
    expect(getComputedStyle(button.querySelector('.m3-button__ripple')!).overflow).toBe('hidden')
  } finally {
    view.unmount()
  }
})
