import type { SnackbarActionRenderer, SnackbarHostMethods } from '@/components/snackbar'

import { defineComponent } from 'vue'
import { fireEvent } from '@testing-library/vue'
import { h, nextTick, ref } from 'vue'
import { render, screen } from '@testing-library/vue'

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
    expect(closeButton.classList.contains('m3-icon-button')).toBe(true)
    expect(actionButton.getAttribute('aria-describedby')).toBe(message.id)
    expect(closeButton.getAttribute('aria-describedby')).toBe(message.id)
    expect(document.querySelector('.m3-snackbar_layout-stacked')).not.toBeNull()
  })

  test('queues, acts and dismisses one snackbar at a time', async () => {
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

  test('replacement and clear settle all pending requests', async () => {
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

  test('actionless message times out; action remains and shortcut focuses it', async () => {
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
})
