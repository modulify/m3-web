import {
  act,
  fireEvent,
  render,
  screen,
} from '@testing-library/react'

import { M3Dialog } from '@/components/dialog'

describe('m3-react/dialog', () => {
  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  test('content appears after opening with fake timers', () => {
    vi.useFakeTimers()

    const { rerender } = render(
      <M3Dialog opened={false}>
        Dialog body
      </M3Dialog>
    )

    expect(screen.queryByText('Dialog body')).toBeNull()

    rerender(
      <M3Dialog opened={true}>
        Dialog body
      </M3Dialog>
    )

    act(() => {
      vi.advanceTimersByTime(600)
    })

    expect(screen.getByText('Dialog body')).not.toBeNull()
  })

  test('scrim click requests closing when not fullscreen', () => {
    vi.useFakeTimers()

    const onToggle = vi.fn()
    const { container } = render(
      <M3Dialog opened={true} onToggle={onToggle}>
        Dialog body
      </M3Dialog>
    )

    act(() => {
      vi.advanceTimersByTime(600)
    })

    const scrim = container.ownerDocument.querySelector('.m3-scrim') as HTMLElement

    fireEvent.click(scrim)

    expect(onToggle).toHaveBeenCalledWith(false)
  })
})
