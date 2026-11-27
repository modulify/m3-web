import type { SnackbarActionRenderer, SnackbarHostMethods } from '@/components/snackbar'

import { createLayerHost } from '@modulify/m3-foundation/lib/layers'
import { defineComponent } from 'vue'
import { fireEvent } from '@testing-library/vue'
import { h } from 'vue'
import { LAYER_DEACTIVATED_EVENT } from '@modulify/m3-foundation/lib/layers'
import { nextTick, ref } from 'vue'
import { render, screen } from '@testing-library/vue'
import { setLayerModal } from '@modulify/m3-foundation/lib/layers'

import { M3Button } from '@/components/button'
import { M3Snackbar, M3SnackbarHost } from '@/components/snackbar'

describe('m3-vue/snackbar', () => {
  afterEach(() => {
    vi.useRealTimers()
    document.body.innerHTML = ''
  })

  const action = (label: string): SnackbarActionRenderer => ({ buttonProps }) => h(M3Button, buttonProps, () => label)

  const mountHost = (renderAction?: SnackbarActionRenderer) => {
    const host = ref<SnackbarHostMethods | null>(null)
    render(defineComponent({
      setup: () => () => h(M3SnackbarHost, { ref: host, renderAction }),
    }))
    return host
  }

  const visibleMessage = () => document.querySelector('.m3-snackbar__message')?.textContent

  test('renders action and close controls with a polite message', async () => {
    render(M3Snackbar, {
      props: { message: 'Saved', layout: 'stacked', closable: true },
      slots: { action: action('Undo') },
    })
    await nextTick()

    expect(screen.getByRole('status').textContent).toBe('Saved')
    const actionButton = screen.getByRole('button', { name: 'Undo' })
    const closeButton = screen.getByRole('button', { name: 'Close notification' })
    const message = document.querySelector('.m3-snackbar__message')!
    expect(actionButton.classList.contains('m3-button_text')).toBe(true)
    expect(closeButton.classList.contains('m3-button_fixed')).toBe(true)
    expect(actionButton.getAttribute('aria-describedby')).toBe(message.id)
    expect(closeButton.getAttribute('aria-describedby')).toBe(message.id)
    expect(document.querySelector('.m3-snackbar_layout-stacked')).not.toBeNull()
  })

  test('queues messages and exposes distinct action and dismiss results', async () => {
    vi.useFakeTimers()
    const host = mountHost(action('Undo'))
    await nextTick()

    const first = host.value!.show({ message: 'Email archived' })
    const second = host.value!.show({ message: 'Draft saved', action: null, duration: null })
    await nextTick()

    expect(visibleMessage()).toBe('Email archived')
    expect(screen.queryByText('Draft saved')).toBeNull()
    await fireEvent.click(screen.getByRole('button', { name: 'Undo' }))
    await expect(first).resolves.toBe('action')

    vi.advanceTimersByTime(150)
    await nextTick()
    expect(visibleMessage()).toBe('Draft saved')
    await fireEvent.click(screen.getByRole('button', { name: 'Close notification' }))
    await expect(second).resolves.toBe('dismiss')
  })

  test('replaces outdated information and clears queued work', async () => {
    const host = mountHost()
    await nextTick()
    const old = host.value!.show({ message: 'Upload failed', action: action('Retry') })
    const pending = host.value!.show({ message: 'Pending' })
    const updated = host.value!.replace({ message: 'Upload complete', duration: null })
    await nextTick()

    await expect(old).resolves.toBe('replaced')
    expect(visibleMessage()).toBe('Upload complete')
    host.value!.clear()
    await expect(updated).resolves.toBe('cleared')
    await expect(pending).resolves.toBe('cleared')
  })

  test('times out actionless feedback but not an actionable message', async () => {
    vi.useFakeTimers()
    const host = mountHost()
    await nextTick()
    const transient = host.value!.show({ message: 'Saved', duration: 4000 })
    vi.advanceTimersByTime(4000)
    await expect(transient).resolves.toBe('timeout')
    vi.advanceTimersByTime(150)
    await nextTick()

    const persistent = host.value!.show({ message: 'Removed', action: action('Undo'), duration: 4000 })
    await nextTick()
    vi.advanceTimersByTime(10000)
    expect(visibleMessage()).toBe('Removed')
    await fireEvent.keyDown(document, { key: 'g', altKey: true })
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Undo' }))
    await fireEvent.keyDown(document.activeElement!, { key: 'Escape' })
    await expect(persistent).resolves.toBe('dismiss')
  })

  test('hover pauses the countdown until the pointer leaves', async () => {
    vi.useFakeTimers()
    const host = mountHost()
    await nextTick()
    const result = host.value!.show({ message: 'Saved', duration: 4000 })
    await nextTick()

    vi.advanceTimersByTime(1000)
    await fireEvent.mouseEnter(document.querySelector('.m3-snackbar-host')!)
    vi.advanceTimersByTime(10000)
    expect(visibleMessage()).toBe('Saved')

    await fireEvent.mouseLeave(document.querySelector('.m3-snackbar-host')!)
    vi.advanceTimersByTime(2999)
    expect(visibleMessage()).toBe('Saved')
    vi.advanceTimersByTime(1)
    await expect(result).resolves.toBe('timeout')
  })

  test('focus pauses the countdown until it leaves the snackbar', async () => {
    vi.useFakeTimers()
    const host = mountHost()
    await nextTick()
    const result = host.value!.show({ message: 'Saved', duration: 4000 })
    await nextTick()

    vi.advanceTimersByTime(1000)
    const element = document.querySelector('.m3-snackbar-host')!
    await fireEvent.focusIn(element)
    vi.advanceTimersByTime(10000)
    expect(visibleMessage()).toBe('Saved')

    await fireEvent.focusOut(element, { relatedTarget: document.body })
    vi.advanceTimersByTime(3000)
    await expect(result).resolves.toBe('timeout')
  })

  test('rejects invalid durations and ignores the shortcut when no action is available', async () => {
    const host = mountHost()
    await nextTick()

    await expect(host.value!.show({ message: 'Invalid', duration: -1 })).rejects.toThrow(RangeError)
    await expect(host.value!.show({ message: 'Invalid', duration: Infinity })).rejects.toThrow(RangeError)

    const result = host.value!.show({ message: 'Saved', duration: null, closable: false })
    await nextTick()
    const shortcut = new KeyboardEvent('keydown', { key: 'g', altKey: true, cancelable: true })
    document.dispatchEvent(shortcut)
    expect(shortcut.defaultPrevented).toBe(false)
    host.value!.clear()
    await expect(result).resolves.toBe('cleared')
  })

  test('shows feedback when focus is on an SVG element', async () => {
    const trigger = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    trigger.setAttribute('tabindex', '0')
    document.body.append(trigger)

    const host = ref<SnackbarHostMethods | null>(null)
    const view = render(defineComponent({
      setup: () => () => h(M3SnackbarHost, { ref: host }),
    }))
    await nextTick()
    trigger.focus()
    expect(document.activeElement).toBe(trigger)

    const result = host.value!.show({ message: 'Chart saved', duration: null })
    await nextTick()
    expect(visibleMessage()).toBe('Chart saved')

    host.value!.dismiss()
    await expect(result).resolves.toBe('dismiss')
    view.unmount()
    trigger.remove()
  })

  test('unmount settles the active and queued requests', async () => {
    const host = ref<SnackbarHostMethods | null>(null)
    const view = render(defineComponent({ setup: () => () => h(M3SnackbarHost, { ref: host }) }))
    await nextTick()
    const active = host.value!.show({ message: 'First', duration: null })
    const queued = host.value!.show({ message: 'Second', duration: null })

    view.unmount()
    await expect(active).resolves.toBe('disposed')
    await expect(queued).resolves.toBe('disposed')
  })

  test('replacement during exit restores focus before removing the old action', async () => {
    vi.useFakeTimers()
    const host = ref<SnackbarHostMethods | null>(null)
    render(defineComponent({
      setup: () => () => h('div', [h('button', 'Archive'), h(M3SnackbarHost, { ref: host })]),
    }))
    await nextTick()
    const trigger = screen.getByRole('button', { name: 'Archive' })
    trigger.focus()

    const old = host.value!.show({ message: 'Archived', action: action('Undo') })
    await nextTick()
    host.value!.focus()
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Undo' }))
    host.value!.dismiss()
    const updated = host.value!.replace({ message: 'Restored', action: action('Open') })
    await nextTick()

    await expect(old).resolves.toBe('dismiss')
    expect(document.activeElement).toBe(trigger)
    expect(visibleMessage()).toBe('Restored')
    await fireEvent.click(screen.getByRole('button', { name: 'Open' }))
    await expect(updated).resolves.toBe('action')
  })

  test('replace starts feedback without an existing message and focus is inert when empty', async () => {
    const host = mountHost()
    await nextTick()
    host.value!.focus()
    host.value!.dismiss()

    const result = host.value!.replace({ message: 'Ready', duration: null, closable: false })
    await nextTick()
    expect(visibleMessage()).toBe('Ready')
    expect(screen.queryByRole('button', { name: 'Close notification' })).toBeNull()

    host.value!.clear()
    await expect(result).resolves.toBe('cleared')
  })

  test('reports disposal for calls made after the host unmounts', async () => {
    const host = ref<SnackbarHostMethods | null>(null)
    const view = render(defineComponent({ setup: () => () => h(M3SnackbarHost, { ref: host }) }))
    await nextTick()
    const methods = host.value!

    view.unmount()
    await expect(methods.show({ message: 'Too late' })).resolves.toBe('disposed')
    await expect(methods.replace({ message: 'Too late' })).resolves.toBe('disposed')
  })

  test('disposes active and queued feedback when their modal layer deactivates', async () => {
    vi.useFakeTimers()
    const layer = createLayerHost(document)
    setLayerModal(layer, true)
    layer.dataset.m3LayerActive = 'true'
    document.body.append(layer)
    const app = document.createElement('div')
    layer.append(app)

    const host = ref<SnackbarHostMethods | null>(null)
    const view = render(defineComponent({
      setup: () => () => h('div', [
        h('button', { type: 'button' }, 'Save'),
        h(M3SnackbarHost, { ref: host }),
      ]),
    }), { container: app })
    await nextTick()
    screen.getByRole('button', { name: 'Save' }).focus()

    const active = host.value!.show({ message: 'Saved', duration: null })
    const queued = host.value!.show({ message: 'Queued', duration: null })
    await nextTick()
    expect(visibleMessage()).toBe('Saved')

    layer.dataset.m3LayerActive = 'false'
    layer.dispatchEvent(new Event(LAYER_DEACTIVATED_EVENT))
    await expect(active).resolves.toBe('disposed')
    vi.advanceTimersByTime(150)
    await nextTick()
    await expect(queued).resolves.toBe('disposed')
    expect(visibleMessage()).toBeUndefined()

    view.unmount()
    layer.remove()
  })

  test('disposes queued feedback if its layer deactivates before the queue advances', async () => {
    vi.useFakeTimers()
    const layer = createLayerHost(document)
    setLayerModal(layer, true)
    layer.dataset.m3LayerActive = 'true'
    document.body.append(layer)
    const app = document.createElement('div')
    layer.append(app)

    const host = ref<SnackbarHostMethods | null>(null)
    const view = render(defineComponent({
      setup: () => () => h('div', [
        h('button', { type: 'button' }, 'Save'),
        h(M3SnackbarHost, { ref: host }),
      ]),
    }), { container: app })
    await nextTick()
    screen.getByRole('button', { name: 'Save' }).focus()

    const active = host.value!.show({ message: 'Saved', duration: null })
    const queued = host.value!.show({ message: 'Queued', duration: null })
    await nextTick()
    expect(layer.querySelector('.m3-layer__feedback .m3-snackbar')).not.toBeNull()

    layer.dataset.m3LayerActive = 'false'
    host.value!.dismiss()
    await expect(active).resolves.toBe('dismiss')
    vi.advanceTimersByTime(150)
    await nextTick()

    await expect(queued).resolves.toBe('disposed')
    expect(visibleMessage()).toBeUndefined()

    view.unmount()
    layer.remove()
  })
})
