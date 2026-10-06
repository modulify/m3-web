import { render, waitFor } from '@testing-library/react'

import { M3Surface } from '@/components/surface'

test('modal surfaces contain focus, restore it, and ignore docked surfaces', async () => {
  const outside = document.createElement('button')
  const alreadyInert = document.createElement('div')
  alreadyInert.inert = true
  outside.textContent = 'Outside'
  document.body.append(outside, alreadyInert)
  outside.focus()

  const onToggle = vi.fn()
  const onDismiss = vi.fn()
  const surface = (shown: boolean, ariaModal?: 'false') => (
    <M3Surface mode="modal" shown={shown} aria-modal={ariaModal} onToggle={onToggle} onDismiss={onDismiss}>
      <input aria-label="First" />
      <button>Last</button>
    </M3Surface>
  )
  const view = render(surface(true))
  const addedLater = document.createElement('button')

  try {
    const dialog = document.querySelector<HTMLElement>('.m3-surface[role="dialog"]')!
    const first = dialog.querySelector<HTMLInputElement>('input')!
    const last = dialog.querySelector<HTMLButtonElement>('button')!

    expect(outside.inert).toBe(true)
    expect(document.activeElement).toBe(first)
    await waitFor(() => expect(document.querySelector<HTMLElement>('.m3-surface__scrim')).not.toBeNull())
    expect(document.querySelector<HTMLElement>('.m3-surface__scrim')!.inert).toBe(false)

    last.focus()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }))
    expect(document.activeElement).toBe(first)

    addedLater.textContent = 'Added later'
    document.body.append(addedLater)
    await waitFor(() => expect(addedLater.inert).toBe(true))

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }))
    expect(onToggle).toHaveBeenCalledWith(false)
    expect(onDismiss).toHaveBeenCalledTimes(1)
    view.rerender(surface(false))

    await waitFor(() => expect(outside.inert).toBe(false))
    await waitFor(() => expect(document.activeElement).toBe(outside))
    expect(alreadyInert.inert).toBe(true)

    view.rerender(surface(true, 'false'))
    expect(outside.inert).toBe(false)
    expect(document.activeElement).toBe(outside)
  } finally {
    view.unmount()
    addedLater.remove()
    outside.remove()
    alreadyInert.remove()
  }
})

test('closing a nested modal restores focus to the modal below it', async () => {
  const outside = document.createElement('button')
  document.body.append(outside)
  outside.focus()

  const topToggle = vi.fn()
  const surfaces = (nested: boolean) => (
    <>
      <M3Surface mode="modal" shown><button>Lower</button></M3Surface>
      {nested ? <M3Surface mode="modal" shown onToggle={topToggle}><button>Upper</button></M3Surface> : null}
    </>
  )
  const view = render(surfaces(false))

  try {
    const lower = document.querySelector<HTMLButtonElement>('.m3-surface button')!
    expect(document.activeElement).toBe(lower)

    view.rerender(surfaces(true))
    const upper = [...document.querySelectorAll<HTMLButtonElement>('.m3-surface button')].at(-1)!
    expect(document.activeElement).toBe(upper)
    expect(lower.closest<HTMLElement>('.m3-surface')!.inert).toBe(true)

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }))
    expect(topToggle).toHaveBeenCalledWith(false)
    view.rerender(surfaces(false))
    await waitFor(() => expect(document.activeElement).toBe(lower))
  } finally {
    view.unmount()
    outside.remove()
  }
})

test('wraps focus in keyboard tab order when controls use positive tabindex', () => {
  const view = render(
    <M3Surface mode="modal" shown>
      <button tabIndex={2}>Second</button>
      <button tabIndex={1}>First</button>
      <button>Last</button>
    </M3Surface>
  )

  try {
    const dialog = document.querySelector<HTMLElement>('.m3-surface[role="dialog"]')!
    const buttons = [...dialog.querySelectorAll<HTMLButtonElement>('button')]

    expect(document.activeElement).toBe(buttons[1])
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true, cancelable: true }))
    expect(document.activeElement).toBe(buttons[2])

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }))
    expect(document.activeElement).toBe(buttons[1])
  } finally {
    view.unmount()
  }
})
