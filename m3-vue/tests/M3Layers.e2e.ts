import type { SnackbarHostMethods } from '@/components/snackbar'

import {
  createApp,
  h,
  nextTick,
  ref,
} from 'vue'

import M3Popper from '@/components/popper/M3Popper.vue'
import M3Search from '@/components/search/M3Search.vue'
import M3SnackbarHost from '@/components/snackbar/M3SnackbarHost.vue'
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

test('a popover stays in its modal layer and handles Escape before the modal', async () => {
  const mountPoint = document.createElement('div')
  document.body.append(mountPoint)
  const target = ref<HTMLButtonElement | null>(null)
  const shown = ref(true)
  const app = createApp({
    render: () => h(M3Surface, {
      mode: 'modal',
      shown: shown.value,
      'onUpdate:shown': (value: boolean) => shown.value = value,
    }, { default: () => [
      h('button', { ref: target }, 'Open menu'),
      h(M3Popper, { target: () => target.value, detachTimeout: null }, { default: () => h('button', 'Menu action') }),
    ] }),
  })
  app.mount(mountPoint)

  try {
    const trigger = document.querySelector<HTMLButtonElement>('.m3-surface button')!
    trigger.click()
    await waitFor(() => expect(document.querySelector('.m3-popper_shown')).not.toBeNull())

    const layer = trigger.closest<HTMLElement>('.m3-layer')!
    const popper = document.querySelector<HTMLElement>('.m3-popper_shown')!
    expect(layer.querySelector('.m3-layer__popovers')!.contains(popper)).toBe(true)
    expect(getComputedStyle(layer).zIndex).toBe('1000')
    expect(getComputedStyle(layer.querySelector<HTMLElement>('.m3-layer__popovers')!).zIndex).toBe('100')
    expect(popper.inert).toBe(false)

    popper.querySelector<HTMLButtonElement>('button')!.focus()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true, cancelable: true }))
    expect(document.activeElement).toBe(trigger)

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }))
    await waitFor(() => expect(document.querySelector('.m3-popper_shown')).toBeNull())
    expect(shown.value).toBe(true)

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }))
    await nextTick()
    expect(shown.value).toBe(false)
  } finally {
    app.unmount()
    mountPoint.remove()
  }
})

test('a snackbar opened from a modal belongs to that layer', async () => {
  const mountPoint = document.createElement('div')
  document.body.append(mountPoint)
  const host = ref<SnackbarHostMethods | null>(null)
  const shown = ref(true)
  const app = createApp({
    render: () => [
      h(M3SnackbarHost, { ref: host }),
      h(M3Surface, { mode: 'modal', shown: shown.value }, { default: () => h('button', 'Notify') }),
    ],
  })
  app.mount(mountPoint)

  try {
    const trigger = document.querySelector<HTMLButtonElement>('.m3-surface button')!
    await waitFor(() => expect(trigger.closest('.m3-layer')?.getAttribute('data-m3-layer-active')).toBe('true'))
    trigger.focus()
    const result = host.value?.show({ message: 'Layer notice', duration: null })
    await nextTick()

    const layer = trigger.closest<HTMLElement>('.m3-layer')!
    const feedback = layer.querySelector<HTMLElement>('.m3-layer__feedback')!
    expect(feedback.querySelector('.m3-snackbar-host')).not.toBeNull()
    expect(feedback.querySelector('.m3-snackbar')).not.toBeNull()
    expect(getComputedStyle(feedback).zIndex).toBe('50')

    const close = feedback.querySelector<HTMLButtonElement>('.m3-snackbar__close')!
    close.focus()
    expect(document.activeElement).toBe(close)

    shown.value = false
    await nextTick()
    expect(await result).toBe('disposed')
  } finally {
    app.unmount()
    mountPoint.remove()
  }
})

test('a reopened modal moves above the previously opened modal', async () => {
  const mountPoint = document.createElement('div')
  document.body.append(mountPoint)
  const firstShown = ref(true)
  const secondShown = ref(true)
  const app = createApp({
    render: () => [
      h(M3Surface, { mode: 'modal', shown: firstShown.value }, { default: () => h('button', 'First') }),
      h(M3Surface, { mode: 'modal', shown: secondShown.value }, { default: () => h('button', 'Second') }),
    ],
  })
  app.mount(mountPoint)

  try {
    const first = [...document.querySelectorAll<HTMLButtonElement>('.m3-surface button')].find(button => button.textContent === 'First')!
    const second = [...document.querySelectorAll<HTMLButtonElement>('.m3-surface button')].find(button => button.textContent === 'Second')!
    const firstLayer = first.closest<HTMLElement>('.m3-layer')!
    const secondLayer = second.closest<HTMLElement>('.m3-layer')!

    await waitFor(() => expect(firstLayer.nextElementSibling).toBe(secondLayer))
    expect(firstLayer.inert).toBe(true)
    expect(document.activeElement).toBe(second)

    firstShown.value = false
    await nextTick()
    firstShown.value = true
    await nextTick()
    await waitFor(() => expect(secondLayer.nextElementSibling).toBe(firstLayer))
    expect(secondLayer.inert).toBe(true)
    expect(firstLayer.inert).toBe(false)
    expect(document.activeElement).toBe(first)
  } finally {
    app.unmount()
    mountPoint.remove()
  }
})

test('search and dialog follow activation order instead of component type', async () => {
  const mountPoint = document.createElement('div')
  document.body.append(mountPoint)
  const searchOpen = ref(true)
  const dialogShown = ref(false)
  const app = createApp({
    render: () => [
      h(M3Search, { query: '', label: 'Search', status: '', open: searchOpen.value, layout: 'docked' }),
      h(M3Surface, { mode: 'modal', shown: dialogShown.value }, { default: () => h('button', 'Dialog action') }),
    ],
  })
  app.mount(mountPoint)

  try {
    await waitFor(() => expect(document.querySelector('.m3-search__view')).not.toBeNull())
    const search = document.querySelector<HTMLElement>('.m3-search__view')!
    const searchLayer = search.closest<HTMLElement>('.m3-layer')!
    dialogShown.value = true
    await nextTick()
    const dialog = document.querySelector<HTMLElement>('.m3-surface')!
    const dialogLayer = dialog.closest<HTMLElement>('.m3-layer')!
    await waitFor(() => expect(searchLayer.nextElementSibling).toBe(dialogLayer))
    expect(searchLayer.inert).toBe(true)

    searchOpen.value = false
    await nextTick()
    searchOpen.value = true
    await nextTick()
    await waitFor(() => expect(dialogLayer.nextElementSibling).toBe(searchLayer))
    expect(dialogLayer.inert).toBe(true)
    expect(searchLayer.inert).toBe(false)
  } finally {
    app.unmount()
    mountPoint.remove()
  }
})

test('showing an already open popover raises it visually and for Escape', async () => {
  const firstTarget = document.createElement('button')
  const secondTarget = document.createElement('button')
  const mountPoint = document.createElement('div')
  document.body.append(firstTarget, secondTarget, mountPoint)
  const first = ref<{ show(immediately?: boolean): void } | null>(null)
  const second = ref<{ show(immediately?: boolean): void } | null>(null)
  const app = createApp({
    render: () => [
      h(M3Popper, { ref: first, target: () => firstTarget, targetTriggers: [], overflow: [], detachTimeout: null }, { default: () => h('button', 'First menu') }),
      h(M3Popper, { ref: second, target: () => secondTarget, targetTriggers: [], overflow: [], detachTimeout: null }, { default: () => h('button', 'Second menu') }),
    ],
  })
  app.mount(mountPoint)

  try {
    await nextTick()
    expect(first.value).not.toBeNull()
    expect(second.value).not.toBeNull()
    first.value?.show(true)
    second.value?.show(true)
    await nextTick()
    expect(document.querySelectorAll('.m3-popper-positioner').length).toBe(2)
    await waitFor(() => expect(document.querySelectorAll('.m3-popper_shown').length).toBe(2))
    const poppers = [...document.querySelectorAll<HTMLElement>('.m3-popper_shown')]
    const firstHost = poppers.find(popper => popper.textContent === 'First menu')!.parentElement!.parentElement!
    const secondHost = poppers.find(popper => popper.textContent === 'Second menu')!.parentElement!.parentElement!

    first.value?.show(true)
    expect(secondHost.nextElementSibling).toBe(firstHost)

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }))
    await waitFor(() => expect(firstHost.querySelector('.m3-popper_shown')).toBeNull())
    expect(secondHost.querySelector('.m3-popper_shown')).not.toBeNull()
  } finally {
    app.unmount()
    mountPoint.remove()
    firstTarget.remove()
    secondTarget.remove()
  }
})

test('a page popover becomes inert beneath a newly opened modal', async () => {
  const target = document.createElement('button')
  const mountPoint = document.createElement('div')
  document.body.append(target, mountPoint)
  const modalShown = ref(false)
  const app = createApp({
    render: () => [
      h(M3Popper, { target: () => target, shown: true, overflow: [], detachTimeout: null }, { default: () => h('button', 'Page menu') }),
      h(M3Surface, { mode: 'modal', shown: modalShown.value }, { default: () => h('button', 'Modal action') }),
    ],
  })
  app.mount(mountPoint)

  try {
    await waitFor(() => expect(document.querySelector('.m3-popper_shown')).not.toBeNull())
    const popperHost = document.querySelector<HTMLElement>('.m3-popper_shown')!.parentElement!.parentElement!
    expect(popperHost.parentElement).toBe(document.body)

    modalShown.value = true
    await nextTick()
    await waitFor(() => expect(popperHost.inert).toBe(true))
    const modalLayer = document.querySelector<HTMLElement>('.m3-layer[data-m3-layer="modal"]')!
    const popover = popperHost.querySelector<HTMLElement>('.m3-popper-positioner')!
    expect(Number(getComputedStyle(modalLayer).zIndex)).toBeGreaterThan(Number(getComputedStyle(popover).zIndex))
  } finally {
    app.unmount()
    mountPoint.remove()
    target.remove()
  }
})
