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

    render(<M3BottomSheet peek={280} aria-label="Details" shown onExpand={onExpand}>Details</M3BottomSheet>)

    fireEvent.click(screen.getByRole('button', { name: 'Resize bottom sheet' }))

    expect(onExpand).toHaveBeenCalledWith(true)
  })
})
