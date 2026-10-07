import { createApp, h, nextTick } from 'vue'
import { page } from 'vitest/browser'
import { ref } from 'vue'

import { M3Search } from '@/components/search'

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

test('adapts an open search without losing the query or overflowing the viewport', async () => {
  await page.viewport(390, 760)
  const query = ref('')
  const open = ref(false)
  const mountPoint = document.createElement('div')
  document.body.append(mountPoint)
  const app = createApp({
    render: () => h(M3Search, {
      query: query.value,
      open: open.value,
      label: 'Search messages',
      status: 'Results',
      'onUpdate:query': (value: string) => query.value = value,
      'onUpdate:open': (value: boolean) => open.value = value,
    }),
  })
  app.mount(mountPoint)

  try {
    (mountPoint.querySelector('.m3-search__trigger') as HTMLButtonElement).click()
    await nextTick()
    const input = document.querySelector('.m3-search__input') as HTMLInputElement
    input.value = 'notes'
    input.dispatchEvent(new Event('input', { bubbles: true }))
    await nextTick()

    const dialog = document.querySelector('.m3-search__view') as HTMLElement
    await waitFor(() => expect(dialog.classList.contains('m3-search__view_full-screen')).toBe(true))
    expect(getComputedStyle(document.querySelector('.m3-search__bar')!).visibility).toBe('hidden')
    expect(dialog.offsetWidth).toBe(390)
    expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(390)

    await page.viewport(900, 760)
    await waitFor(() => expect(dialog.classList.contains('m3-search__view_docked')).toBe(true))
    const docked = dialog.getBoundingClientRect()
    expect(docked.width).toBeLessThanOrEqual(720)
    expect(docked.left).toBeGreaterThanOrEqual(12)
    expect(docked.right).toBeLessThanOrEqual(888)
    expect(input.value).toBe('notes')
    expect(document.activeElement).toBe(input)
  } finally {
    app.unmount()
    mountPoint.remove()
  }
})
