import { act } from '@testing-library/react'
import { page } from 'vitest/browser'
import { render, waitFor } from '@testing-library/react'

import { M3BottomSheet } from '@/components/bottom-sheet'

test('modal sheet starts at half the viewport and expands without moving its handle', async () => {
  await page.viewport(390, 800)

  const onExpand = vi.fn()
  const onToggle = vi.fn()
  const view = render(
    <M3BottomSheet variant="modal" aria-label="Options" shown onExpand={onExpand} onToggle={onToggle}>
      <div style={{ height: 1200 }}>Long content</div>
    </M3BottomSheet>
  )

  try {
    const sheet = document.querySelector<HTMLElement>('.m3-bottom-sheet')!
    const handle = sheet.querySelector<HTMLButtonElement>('.m3-bottom-sheet__handle')!

    await waitFor(() => expect(Math.round(sheet.getBoundingClientRect().height)).toBe(400))
    expect(Math.round(sheet.getBoundingClientRect().width)).toBe(390)
    expect(getComputedStyle(handle).height).toBe('48px')

    act(() => handle.click())
    await waitFor(() => expect(onExpand).toHaveBeenCalledWith(true))
    await waitFor(() => expect(Math.round(sheet.getBoundingClientRect().height)).toBe(728))
    expect(Math.round(handle.getBoundingClientRect().top)).toBe(72)

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }))
    expect(onToggle).toHaveBeenCalledWith(false)
  } finally {
    view.unmount()
  }
})
