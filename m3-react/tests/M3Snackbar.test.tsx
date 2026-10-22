import type {
  SnackbarActionContext,
  SnackbarActionRenderer,
  SnackbarHostMethods,
  SnackbarResult,
} from '@/components/snackbar'

import { act } from '@testing-library/react'
import { createRef } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import { M3Button } from '@/components/button'
import { M3Snackbar, M3SnackbarHost } from '@/components/snackbar'

describe('m3-react/snackbar', () => {
  afterEach(() => vi.useRealTimers())

  const visibleMessage = () => document.querySelector('.m3-snackbar__message')?.textContent
  const action = (label: string): SnackbarActionRenderer => {
    function renderAction (context: SnackbarActionContext) {
      return <M3Button {...context.buttonProps}>{label}</M3Button>
    }

    return renderAction
  }

  test('renders Material anatomy and Escape dismisses a focused snackbar', () => {
    const onDismiss = vi.fn()
    const onAction = vi.fn()
    render(
      <M3Snackbar message="Saved" layout="stacked" closable onAction={onAction} onDismiss={onDismiss}>
        <M3Snackbar.Action>{action('Undo')}</M3Snackbar.Action>
      </M3Snackbar>
    )

    expect(screen.getByRole('status').textContent).toBe('Saved')
    const actionButton = screen.getByRole('button', { name: 'Undo' })
    const closeButton = screen.getByRole('button', { name: 'Close notification' })
    const message = document.querySelector('.m3-snackbar__message')!
    expect(actionButton.classList.contains('m3-button_text')).toBe(true)
    expect(closeButton.classList.contains('m3-button_fixed')).toBe(true)
    expect(actionButton.getAttribute('aria-describedby')).toBe(message.id)
    expect(closeButton.getAttribute('aria-describedby')).toBe(message.id)
    expect(document.querySelector('.m3-snackbar_layout-stacked')).not.toBeNull()

    fireEvent.click(actionButton)
    expect(onAction).toHaveBeenCalledTimes(1)

    fireEvent.keyDown(actionButton, { key: 'Escape' })
    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  test('queues messages and exposes distinct action and dismiss results', async () => {
    vi.useFakeTimers()
    const host = createRef<SnackbarHostMethods>()
    render(<M3SnackbarHost ref={host} renderAction={action('Undo')} />)

    let first!: Promise<SnackbarResult>
    let second!: Promise<SnackbarResult>
    act(() => {
      first = host.current!.show({ message: 'Email archived' })
      second = host.current!.show({ message: 'Draft saved', action: null, duration: null })
    })

    expect(visibleMessage()).toBe('Email archived')
    expect(screen.queryByText('Draft saved')).toBeNull()

    fireEvent.click(screen.getByRole('button', { name: 'Undo' }))
    await expect(first).resolves.toBe('action')

    act(() => vi.advanceTimersByTime(150))
    expect(visibleMessage()).toBe('Draft saved')
    fireEvent.click(screen.getByRole('button', { name: 'Close notification' }))
    await expect(second).resolves.toBe('dismiss')
  })

  test('replaces outdated information and clears queued work', async () => {
    const host = createRef<SnackbarHostMethods>()
    render(<M3SnackbarHost ref={host} />)

    let old!: Promise<SnackbarResult>
    let pending!: Promise<SnackbarResult>
    let updated!: Promise<SnackbarResult>
    act(() => {
      old = host.current!.show({ message: 'Upload failed', action: action('Retry') })
      pending = host.current!.show({ message: 'Pending' })
      updated = host.current!.replace({ message: 'Upload complete', duration: null })
    })

    await expect(old).resolves.toBe('replaced')
    expect(visibleMessage()).toBe('Upload complete')
    expect(screen.queryByText('Upload failed')).toBeNull()

    act(() => host.current!.clear())
    await expect(updated).resolves.toBe('cleared')
    await expect(pending).resolves.toBe('cleared')
  })

  test('times out actionless feedback but not an actionable message', async () => {
    vi.useFakeTimers()
    const host = createRef<SnackbarHostMethods>()
    render(<M3SnackbarHost ref={host} />)

    let transient!: Promise<SnackbarResult>
    act(() => { transient = host.current!.show({ message: 'Saved', duration: 4000 }) })
    act(() => vi.advanceTimersByTime(4000))
    await expect(transient).resolves.toBe('timeout')
    act(() => vi.advanceTimersByTime(150))

    let persistent!: Promise<SnackbarResult>
    act(() => { persistent = host.current!.show({ message: 'Removed', action: action('Undo'), duration: 4000 }) })
    act(() => vi.advanceTimersByTime(10000))
    expect(visibleMessage()).toBe('Removed')
    fireEvent.click(screen.getByRole('button', { name: 'Close notification' }))
    await expect(persistent).resolves.toBe('dismiss')
  })

  test('shortcut reaches the action and closing restores focus to its trigger', () => {
    vi.useFakeTimers()
    const host = createRef<SnackbarHostMethods>()
    render(<><button type="button">Archive</button><M3SnackbarHost ref={host} /></>)
    const trigger = screen.getByRole('button', { name: 'Archive' })
    trigger.focus()
    act(() => { void host.current!.show({ message: 'Archived', action: action('Undo') }) })

    fireEvent.keyDown(document, { key: 'g', altKey: true })
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Undo' }))
    fireEvent.keyDown(document.activeElement!, { key: 'Escape' })
    act(() => vi.advanceTimersByTime(150))
    expect(document.activeElement).toBe(trigger)
  })

  test('hover pauses the countdown until the pointer leaves', async () => {
    vi.useFakeTimers()
    const host = createRef<SnackbarHostMethods>()
    render(<M3SnackbarHost ref={host} />)

    let result!: Promise<SnackbarResult>
    act(() => { result = host.current!.show({ message: 'Saved', duration: 4000 }) })
    act(() => vi.advanceTimersByTime(1000))
    fireEvent.mouseEnter(document.querySelector('.m3-snackbar-host')!)
    act(() => vi.advanceTimersByTime(10000))
    expect(visibleMessage()).toBe('Saved')

    fireEvent.mouseLeave(document.querySelector('.m3-snackbar-host')!)
    act(() => vi.advanceTimersByTime(2999))
    expect(visibleMessage()).toBe('Saved')
    act(() => vi.advanceTimersByTime(1))
    await expect(result).resolves.toBe('timeout')
  })

  test('focus pauses the countdown until it leaves the snackbar', async () => {
    vi.useFakeTimers()
    const host = createRef<SnackbarHostMethods>()
    render(<M3SnackbarHost ref={host} />)
    let result!: Promise<SnackbarResult>
    act(() => { result = host.current!.show({ message: 'Saved', duration: 1000, closable: true }) })

    const close = screen.getByRole('button', { name: 'Close notification' })
    fireEvent.focus(close)
    act(() => vi.advanceTimersByTime(2000))
    expect(visibleMessage()).toBe('Saved')

    fireEvent.blur(close, { relatedTarget: document.body })
    act(() => vi.advanceTimersByTime(1000))
    await expect(result).resolves.toBe('timeout')
  })

  test('rejects invalid durations without replacing the current message', async () => {
    const host = createRef<SnackbarHostMethods>()
    render(<M3SnackbarHost ref={host} />)
    act(() => { void host.current!.show({ message: 'Current', duration: null }) })

    await expect(host.current!.replace({ message: 'Invalid', duration: -1 })).rejects.toThrow(RangeError)
    expect(visibleMessage()).toBe('Current')
  })

  test('restores focus to the next available control when the trigger disappears', () => {
    vi.useFakeTimers()
    const host = createRef<SnackbarHostMethods>()
    const trigger = document.createElement('button')
    const next = document.createElement('button')
    document.body.append(trigger, next)
    render(<M3SnackbarHost ref={host} />)
    trigger.focus()
    act(() => { void host.current!.show({ message: 'Removed', action: action('Undo') }) })
    act(() => host.current!.focus())
    trigger.remove()

    act(() => host.current!.dismiss())
    act(() => vi.advanceTimersByTime(150))
    expect(document.activeElement).toBe(next)
    next.remove()
  })

  test('unmount settles the active and queued requests', async () => {
    const host = createRef<SnackbarHostMethods>()
    const view = render(<M3SnackbarHost ref={host} />)
    let active!: Promise<SnackbarResult>
    let queued!: Promise<SnackbarResult>
    act(() => {
      active = host.current!.show({ message: 'First', duration: null })
      queued = host.current!.show({ message: 'Second', duration: null })
    })

    view.unmount()
    await expect(active).resolves.toBe('disposed')
    await expect(queued).resolves.toBe('disposed')
  })

  test('replacement during exit restores focus before removing the old action', async () => {
    vi.useFakeTimers()
    const host = createRef<SnackbarHostMethods>()
    render(<><button type="button">Archive</button><M3SnackbarHost ref={host} /></>)
    const trigger = screen.getByRole('button', { name: 'Archive' })
    trigger.focus()

    let old!: Promise<SnackbarResult>
    let updated!: Promise<SnackbarResult>
    act(() => { old = host.current!.show({ message: 'Archived', action: action('Undo') }) })
    act(() => host.current!.focus())
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Undo' }))
    act(() => host.current!.dismiss())
    act(() => { updated = host.current!.replace({ message: 'Restored', action: action('Open') }) })

    await expect(old).resolves.toBe('dismiss')
    expect(document.activeElement).toBe(trigger)
    expect(visibleMessage()).toBe('Restored')
    fireEvent.click(screen.getByRole('button', { name: 'Open' }))
    await expect(updated).resolves.toBe('action')
  })

  test('replace starts feedback without an existing message and focus is inert when empty', async () => {
    const host = createRef<SnackbarHostMethods>()
    render(<M3SnackbarHost ref={host} />)
    act(() => host.current!.focus())
    act(() => host.current!.dismiss())

    let result!: Promise<SnackbarResult>
    act(() => { result = host.current!.replace({ message: 'Ready', duration: null, closable: false }) })
    expect(visibleMessage()).toBe('Ready')
    expect(screen.queryByRole('button', { name: 'Close notification' })).toBeNull()
    act(() => host.current!.clear())
    await expect(result).resolves.toBe('cleared')
  })

  test('reports disposal for calls made after the host unmounts', async () => {
    const host = createRef<SnackbarHostMethods>()
    const view = render(<M3SnackbarHost ref={host} />)
    const methods = host.current!
    view.unmount()
    await Promise.resolve()

    await expect(methods.show({ message: 'Too late' })).resolves.toBe('disposed')
    await expect(methods.replace({ message: 'Too late' })).resolves.toBe('disposed')
  })

  test('forwards host interaction callbacks while retaining pause and shortcut behavior', () => {
    vi.useFakeTimers()
    const onMouseEnter = vi.fn()
    const onMouseLeave = vi.fn()
    const onFocusCapture = vi.fn()
    const onBlurCapture = vi.fn()
    const host = createRef<SnackbarHostMethods>()
    render(
      <M3SnackbarHost
        ref={host}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onFocusCapture={onFocusCapture}
        onBlurCapture={onBlurCapture}
      />
    )
    act(() => { void host.current!.show({ message: 'Saved', action: action('Undo') }) })
    const root = document.querySelector('.m3-snackbar-host')!
    const actionButton = screen.getByRole('button', { name: 'Undo' })
    fireEvent.mouseEnter(root)
    fireEvent.mouseLeave(root)
    fireEvent.focus(actionButton)
    fireEvent.blur(actionButton, { relatedTarget: document.body })
    expect(onMouseEnter).toHaveBeenCalledTimes(1)
    expect(onMouseLeave).toHaveBeenCalledTimes(1)
    expect(onFocusCapture).toHaveBeenCalledTimes(1)
    expect(onBlurCapture).toHaveBeenCalledTimes(1)

    fireEvent.keyDown(document, { key: 'g', altKey: true, ctrlKey: true })
    expect(document.activeElement).not.toBe(actionButton)
  })
})
