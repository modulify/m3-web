import { page } from 'vitest/browser'
import { render, waitFor } from '@testing-library/react'

import { M3TimePicker } from '@/components/time-picker'

test('vertical 24-hour picker keeps both time selectors at the spec width', async () => {
  await page.viewport(800, 800)
  const view = render(<M3TimePicker value={{ hour: 14, minute: 45 }} format="24h" opened />)

  try {
    await waitFor(() => expect(document.querySelector('.m3-time-picker__dial')).toBeTruthy())

    const dialog = document.querySelector<HTMLElement>('.m3-time-picker-dialog')!
    const body = dialog.querySelector<HTMLElement>('.m3-time-picker__body')!
    const fields = body.querySelector<HTMLElement>('.m3-time-picker__fields')!
    const [hour, minute] = fields.querySelectorAll<HTMLElement>('.m3-time-picker__value')
    const dial = dialog.querySelector<HTMLElement>('.m3-time-picker__dial')!

    expect(dialog.offsetWidth).toBe(328)
    expect(hour.offsetWidth).toBe(114)
    expect(minute.offsetWidth).toBe(114)
    expect(hour.offsetHeight).toBe(80)
    expect(minute.offsetHeight).toBe(80)
    expect(dial.offsetWidth).toBe(256)
    expect(dial.offsetHeight).toBe(256)

    const center = (element: HTMLElement) => {
      const rect = element.getBoundingClientRect()
      return rect.left + rect.width / 2
    }
    expect(center(fields)).toBeCloseTo(center(body), 0)
  } finally {
    view.unmount()
  }
})
