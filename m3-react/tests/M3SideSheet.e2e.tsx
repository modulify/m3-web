import { page } from 'vitest/browser'
import { render, waitFor } from '@testing-library/react'

import { M3SideSheet } from '@/components/side-sheet'

test('starts modal sheet motion together with its scrim', async () => {
  await page.viewport(900, 800)

  const scene = (shown: boolean) => (
    <M3SideSheet shown={shown}>
      <M3SideSheet.Title>Filters</M3SideSheet.Title>
    </M3SideSheet>
  )
  const view = render(scene(false))
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
    view.rerender(scene(true))
    await waitFor(() => expect(started.has('sheet')).toBe(true), { timeout: 2000 })
    await waitFor(() => expect(started.has('scrim')).toBe(true), { timeout: 2000 })
    expect(Math.abs(started.get('sheet')! - started.get('scrim')!)).toBeLessThan(150)
    await waitFor(() => expect(completed.has('sheet')).toBe(true), { timeout: 2000 })
    await waitFor(() => expect(getComputedStyle(document.querySelector<HTMLElement>('.m3-surface__scrim')!).opacity).toBe('1'), { timeout: 2000 })
    expect(completed.get('sheet')).toBeGreaterThanOrEqual(0.45)
    expect(canceled).toEqual([])

    started.clear()
    completed.clear()
    view.rerender(scene(false))
    await waitFor(() => expect(started.has('sheet')).toBe(true), { timeout: 2000 })
    await waitFor(() => expect(started.has('scrim')).toBe(true), { timeout: 2000 })
    expect(Math.abs(started.get('sheet')! - started.get('scrim')!)).toBeLessThan(150)
    await waitFor(() => expect(completed.has('sheet')).toBe(true), { timeout: 2000 })
    await waitFor(() => expect(document.querySelector('.m3-side-sheet')).toBeNull(), { timeout: 2000 })
  } finally {
    document.removeEventListener('transitionrun', onTransitionRun)
    document.removeEventListener('transitionend', onTransitionEnd)
    document.removeEventListener('transitioncancel', onTransitionCancel)
    view.unmount()
  }
})
