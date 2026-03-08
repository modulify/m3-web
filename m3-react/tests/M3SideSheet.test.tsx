import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'

import { M3Icon } from '@/components/icon'
import { M3SideSheet } from '@/components/side-sheet'

vi.mock('@/components/scroll-rail', () => ({
  M3ScrollRail: () => <div data-testid="scroll-rail-mock" />,
}))

describe('m3-react/side-sheet', () => {
  test('renders dialog and default aria-labelledby', () => {
    render(
      <M3SideSheet shown={true}>
        <M3SideSheet.Title>
          Panel title
        </M3SideSheet.Title>

        Panel content
      </M3SideSheet>
    )

    const dialog = screen.getByRole('dialog')
    const labelId = dialog.getAttribute('aria-labelledby') as string

    expect(screen.getByText('Panel content')).not.toBeNull()
    expect(document.getElementById(labelId)?.textContent?.trim()).toBe('Panel title')
  })

  test('keeps title in header and footer outside scroll content', () => {
    render(
      <M3SideSheet shown={true}>
        <M3SideSheet.Title>
          Panel title
        </M3SideSheet.Title>

        <div>Panel content</div>

        <M3SideSheet.Footer>
          <div>Footer actions</div>
        </M3SideSheet.Footer>
      </M3SideSheet>
    )

    const title = screen.getByText('Panel title')
    const content = screen.getByText('Panel content')
    const footer = screen.getByText('Footer actions')

    expect(title.closest('.m3-side-sheet__header')).not.toBeNull()
    expect(title.closest('.m3-side-sheet__content')).toBeNull()
    expect(content.closest('.m3-side-sheet__content')).not.toBeNull()
    expect(footer.closest('.m3-side-sheet__footer')).not.toBeNull()
    expect(footer.closest('.m3-side-sheet__content')).toBeNull()
  })

  test('emits close request on scrim click when not docked', async () => {
    const onToggle = vi.fn()

    render(
      <M3SideSheet shown={true} docked={false} onToggle={onToggle}>
        <M3SideSheet.Title>
          Panel title
        </M3SideSheet.Title>
      </M3SideSheet>
    )

    await waitFor(() => {
      expect(document.body.querySelector('.m3-surface__scrim')).not.toBeNull()
    })

    const scrim = document.body.querySelector('.m3-surface__scrim') as HTMLElement

    fireEvent.click(scrim)

    expect(onToggle).toHaveBeenCalledWith(false)
  })

  test('emits close request on close button click', () => {
    const onToggle = vi.fn()

    render(
      <M3SideSheet shown={true} onToggle={onToggle}>
        <M3SideSheet.Title>
          Panel title
        </M3SideSheet.Title>

        <M3SideSheet.CloseIcon>
          <M3Icon name="close" />
        </M3SideSheet.CloseIcon>
      </M3SideSheet>
    )

    fireEvent.click(screen.getByRole('button'))

    expect(onToggle).toHaveBeenCalledWith(false)
  })
})
