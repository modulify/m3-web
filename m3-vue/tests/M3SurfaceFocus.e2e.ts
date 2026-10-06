import {
  createApp,
  h,
  nextTick,
  ref,
} from 'vue'

import M3Surface from '@/components/surface/M3Surface.vue'

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

test('modal surfaces contain focus, restore it, and ignore docked surfaces', async () => {
  const outside = document.createElement('button')
  document.body.append(outside)
  outside.focus()

  const shown = ref(true)
  const ariaModal = ref<'true' | 'false'>('true')
  const onDismiss = vi.fn()
  const mountPoint = document.createElement('div')
  document.body.append(mountPoint)
  const app = createApp({
    render: () => h(M3Surface, {
      mode: 'modal',
      shown: shown.value,
      'aria-modal': ariaModal.value,
      'onUpdate:shown': (value: boolean) => shown.value = value,
      onDismiss,
    }, { default: () => [h('input', { 'aria-label': 'First' }), h('button', 'Last')] }),
  })
  app.mount(mountPoint)
  const addedLater = document.createElement('button')

  try {
    const dialog = document.querySelector<HTMLElement>('.m3-surface[role="dialog"]')!
    const first = dialog.querySelector<HTMLInputElement>('input')!
    const last = dialog.querySelector<HTMLButtonElement>('button')!

    await waitFor(() => expect(outside.inert).toBe(true))
    expect(document.activeElement).toBe(first)
    await waitFor(() => expect(document.querySelector<HTMLElement>('.m3-surface__scrim')).not.toBeNull())
    expect(document.querySelector<HTMLElement>('.m3-surface__scrim')!.inert).toBe(false)

    last.focus()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }))
    expect(document.activeElement).toBe(first)

    document.body.append(addedLater)
    await waitFor(() => expect(addedLater.inert).toBe(true))

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }))
    await nextTick()
    expect(shown.value).toBe(false)
    expect(onDismiss).toHaveBeenCalledTimes(1)
    await waitFor(() => expect(outside.inert).toBe(false))
    await waitFor(() => expect(document.activeElement).toBe(outside))

    ariaModal.value = 'false'
    shown.value = true
    await nextTick()
    expect(outside.inert).toBe(false)
    expect(document.activeElement).toBe(outside)
  } finally {
    app.unmount()
    mountPoint.remove()
    addedLater.remove()
    outside.remove()
  }
})

test('closing a nested modal restores focus to the modal below it', async () => {
  const outside = document.createElement('button')
  document.body.append(outside)
  outside.focus()

  const nested = ref(false)
  const topShown = ref(true)
  const mountPoint = document.createElement('div')
  document.body.append(mountPoint)
  const app = createApp({
    render: () => [
      h(M3Surface, { mode: 'modal', shown: true }, { default: () => h('button', 'Lower') }),
      nested.value ? h(M3Surface, {
        mode: 'modal',
        shown: topShown.value,
        'onUpdate:shown': (value: boolean) => topShown.value = value,
      }, { default: () => h('button', 'Upper') }) : null,
    ],
  })
  app.mount(mountPoint)

  try {
    const lower = document.querySelector<HTMLButtonElement>('.m3-surface button')!
    await waitFor(() => expect(document.activeElement).toBe(lower))

    nested.value = true
    await nextTick()
    const upper = [...document.querySelectorAll<HTMLButtonElement>('.m3-surface button')].at(-1)!
    expect(document.activeElement).toBe(upper)
    expect(lower.closest<HTMLElement>('.m3-surface')!.inert).toBe(true)

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }))
    await nextTick()
    expect(topShown.value).toBe(false)
    nested.value = false
    await nextTick()
    await waitFor(() => expect(document.activeElement).toBe(lower))
  } finally {
    app.unmount()
    mountPoint.remove()
    outside.remove()
  }
})
