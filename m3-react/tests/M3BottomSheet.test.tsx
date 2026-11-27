import type { M3BottomSheetExposed } from '@/components/bottom-sheet'

import { act } from '@testing-library/react'
import { createRef } from 'react'
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'

import { M3BottomSheet } from '@/components/bottom-sheet'

describe('m3-react/bottom-sheet', () => {
  beforeEach(() => vi.spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockReturnValue(700))
  afterEach(() => vi.restoreAllMocks())

  test('standard mode leaves the page interactive and has no scrim', () => {
    render(<M3BottomSheet peek={280} aria-label="Details" shown>Details</M3BottomSheet>)

    const sheet = screen.getByRole('dialog', { name: 'Details' })

    expect(sheet.getAttribute('aria-modal')).toBe('false')
    expect(sheet.style.getPropertyValue('--m3-bottom-sheet-height')).toBe('280px')
    expect(document.body.querySelector('.m3-surface__scrim')).toBeNull()
  })

  test('modal mode presents a scrim and requests dismissal', async () => {
    const onToggle = vi.fn()
    const onDismiss = vi.fn()

    render(<M3BottomSheet variant="modal" aria-label="Options" shown onToggle={onToggle} onDismiss={onDismiss} />)

    const sheet = screen.getByRole('dialog', { name: 'Options' })
    expect(sheet.getAttribute('aria-modal')).toBe('true')

    await waitFor(() => {
      expect(document.body.querySelector('.m3-surface__scrim')).not.toBeNull()
    })

    const scrim = document.body.querySelector('.m3-surface__scrim') as HTMLElement

    fireEvent.click(scrim)
    expect(onToggle).toHaveBeenCalledWith(false)
    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  test('the handle requests a height change when activated', () => {
    const onExpand = vi.fn()
    const onExpandChanged = vi.fn()

    const view = render(
      <M3BottomSheet peek={280} aria-label="Details" shown onExpand={onExpand}>Details</M3BottomSheet>
    )

    fireEvent.click(screen.getByRole('button', { name: 'Resize bottom sheet' }))
    expect(onExpand).toHaveBeenCalledWith(true)

    view.rerender(
      <M3BottomSheet peek={280} aria-label="Details" shown onExpand={onExpandChanged}>Details</M3BottomSheet>
    )
    fireEvent.click(screen.getByRole('button', { name: 'Resize bottom sheet' }))

    expect(onExpand).toHaveBeenCalledTimes(1)
    expect(onExpandChanged).toHaveBeenCalledWith(false)
  })

  test('exposes show, hide, expand, and collapse controls', () => {
    const ref = createRef<M3BottomSheetExposed>()
    const onToggle = vi.fn()
    const onExpand = vi.fn()

    render(
      <M3BottomSheet
        ref={ref}
        peek={280}
        aria-label="Details"
        shown
        onToggle={onToggle}
        onExpand={onExpand}
      >
        Details
      </M3BottomSheet>
    )

    expect(ref.current?.el).toBe(screen.getByRole('dialog', { name: 'Details' }))

    act(() => ref.current?.show())
    act(() => ref.current?.hide())
    expect(onToggle.mock.calls).toEqual([[true], [false]])

    act(() => ref.current?.expand())
    expect(onExpand).toHaveBeenLastCalledWith(true)
    act(() => ref.current?.collapse())
    expect(onExpand).toHaveBeenLastCalledWith(false)
  })

  test('can omit the drag handle and follow a changed expanded prop', () => {
    const { rerender } = render(
      <M3BottomSheet peek={280} aria-label="Details" handle={false} shown>Details</M3BottomSheet>
    )

    expect(screen.queryByRole('button', { name: 'Resize bottom sheet' })).toBeNull()

    rerender(
      <M3BottomSheet peek={280} aria-label="Details" handle={false} shown expanded>Details</M3BottomSheet>
    )

    const sheet = screen.getByRole('dialog', { name: 'Details' })
    expect(sheet.style.getPropertyValue('--m3-bottom-sheet-height')).toBe('700px')
  })

  test('unmounts after closing and mounts again when reopened', async () => {
    const view = render(<M3BottomSheet aria-label="Details" shown>Details</M3BottomSheet>)
    expect(screen.getByRole('dialog', { name: 'Details' })).toBeTruthy()

    view.rerender(<M3BottomSheet shown={false} aria-label="Details">Details</M3BottomSheet>)
    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'Details' })).toBeNull()
    }, { timeout: 1000 })

    view.rerender(<M3BottomSheet aria-label="Details" shown>Details</M3BottomSheet>)
    expect(screen.getByRole('dialog', { name: 'Details' })).toBeTruthy()
  })
})
