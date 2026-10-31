import { createApp, h, nextTick } from 'vue'
import { page } from 'vitest/browser'
import { ref } from 'vue'

import { M3BottomSheet } from '@/components/bottom-sheet'

const waitFor = async (assertion: () => void) => {
  const startedAt = performance.now()
  while (performance.now() - startedAt < 2000) {
    try {
      assertion()
      return
    } catch {
      await new Promise(resolve => setTimeout(resolve, 16))
    }
  }
  assertion()
}

test('modal sheet starts at half the viewport and expands without moving its handle', async () => {
  await page.viewport(390, 800)

  const expanded = ref(false)
  const shown = ref(true)
  const mountPoint = document.createElement('div')
  document.body.append(mountPoint)
  const app = createApp({
    render: () => h(M3BottomSheet, {
      shown: shown.value,
      expanded: expanded.value,
      variant: 'modal',
      'aria-label': 'Options',
      'onUpdate:expanded': (next: boolean) => expanded.value = next,
      'onUpdate:shown': (next: boolean) => shown.value = next,
    }, { default: () => h('div', { style: { height: '1200px' } }, 'Long content') }),
  })
  app.mount(mountPoint)

  try {
    await nextTick()
    const sheet = document.querySelector<HTMLElement>('.m3-bottom-sheet')!
    const handle = sheet.querySelector<HTMLButtonElement>('.m3-bottom-sheet__handle')!

    await waitFor(() => expect(Math.round(sheet.getBoundingClientRect().height)).toBe(400))
    expect(Math.round(sheet.getBoundingClientRect().width)).toBe(390)
    expect(getComputedStyle(handle).height).toBe('48px')

    handle.click()
    await waitFor(() => expect(expanded.value).toBe(true))
    await waitFor(() => expect(Math.round(sheet.getBoundingClientRect().height)).toBe(728))
    expect(Math.round(handle.getBoundingClientRect().top)).toBe(72)

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }))
    await waitFor(() => expect(shown.value).toBe(false))
  } finally {
    app.unmount()
    mountPoint.remove()
  }
})
