import { createApp, h, nextTick } from 'vue'
import { page } from 'vitest/browser'
import { ref } from 'vue'

import { M3SideSheet } from '@/components/side-sheet'

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

test('starts modal sheet motion together with its scrim', async () => {
  await page.viewport(900, 800)

  const shown = ref(false)
  const mountPoint = document.createElement('div')
  document.body.append(mountPoint)
  const app = createApp({
    render: () => h(M3SideSheet, { shown: shown.value }, {
      title: () => 'Filters',
    }),
  })
  app.mount(mountPoint)

  const started = new Map<string, number>()
  const completed = new Map<string, number>()
  const canceled: string[] = []
  const transitionKey = (event: TransitionEvent) => {
    if (!(event.target instanceof HTMLElement)) return null
    if (event.target.matches('.m3-side-sheet') && event.propertyName === 'transform') return 'sheet'
    if (event.target.matches('.m3-surface__scrim') && event.propertyName === 'opacity') return 'scrim'
    return null
  }
  const onTransitionRun = (event: TransitionEvent) => {
    const key = transitionKey(event)
    if (key) started.set(key, performance.now())
  }
  const onTransitionEnd = (event: TransitionEvent) => {
    const key = transitionKey(event)
    if (key) completed.set(key, event.elapsedTime)
  }
  const onTransitionCancel = (event: TransitionEvent) => {
    const key = transitionKey(event)
    if (key === 'sheet') canceled.push(key)
  }
  document.addEventListener('transitionrun', onTransitionRun)
  document.addEventListener('transitionend', onTransitionEnd)
  document.addEventListener('transitioncancel', onTransitionCancel)

  try {
    shown.value = true
    await nextTick()
    await waitFor(() => expect(started.has('sheet')).toBe(true))
    await waitFor(() => expect(started.has('scrim')).toBe(true))
    expect(Math.abs(started.get('sheet')! - started.get('scrim')!)).toBeLessThan(150)
    await waitFor(() => expect(completed.has('sheet')).toBe(true))
    await waitFor(() => expect(getComputedStyle(document.querySelector<HTMLElement>('.m3-surface__scrim')!).opacity).toBe('1'))
    expect(completed.get('sheet')).toBeGreaterThanOrEqual(0.45)
    expect(canceled).toEqual([])

    started.clear()
    completed.clear()
    shown.value = false
    await nextTick()
    await waitFor(() => expect(started.has('sheet')).toBe(true))
    await waitFor(() => expect(started.has('scrim')).toBe(true))
    expect(Math.abs(started.get('sheet')! - started.get('scrim')!)).toBeLessThan(150)
    await waitFor(() => expect(completed.has('sheet')).toBe(true))
    await waitFor(() => expect(document.querySelector('.m3-side-sheet')).toBeNull())
  } finally {
    document.removeEventListener('transitionrun', onTransitionRun)
    document.removeEventListener('transitionend', onTransitionEnd)
    document.removeEventListener('transitioncancel', onTransitionCancel)
    app.unmount()
    mountPoint.remove()
  }
})
