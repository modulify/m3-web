import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'

import { M3Dialog } from '@/components/dialog'

describe('m3-react/dialog', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  test('content appears after opening', async () => {
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

    await waitFor(() => {
      expect(screen.getByText('Dialog body')).not.toBeNull()
    })
  })

  test('scrim click requests closing when not fullscreen', async () => {
    const onToggle = vi.fn()
    render(
      <M3Dialog opened={true} onToggle={onToggle}>
        Dialog body
      </M3Dialog>
    )

    await waitFor(() => {
      expect(document.body.querySelector('.m3-surface__scrim')).not.toBeNull()
    })

    const scrim = document.body.querySelector('.m3-surface__scrim') as HTMLElement

    fireEvent.click(scrim)

    expect(onToggle).toHaveBeenCalledTimes(1)
    expect(onToggle).toHaveBeenCalledWith(false)
  })

  test('renders modal surface root instead of legacy container', async () => {
    render(
      <M3Dialog opened={true}>
        Dialog body
      </M3Dialog>
    )

    await waitFor(() => {
      expect(document.body.querySelector('.m3-surface[role="dialog"]')).not.toBeNull()
    })

    expect(document.body.querySelector('.m3-dialog-container')).toBeNull()
  })

  test('does not render scrim or legacy fullscreen class in fullscreen mode', async () => {
    render(
      <M3Dialog opened={true} fullscreen={true}>
        Fullscreen body
      </M3Dialog>
    )

    await waitFor(() => {
      expect(screen.getByText('Fullscreen body')).not.toBeNull()
    })

    expect(document.body.querySelector('.m3-surface__scrim')).toBeNull()
    expect(document.body.querySelector('.m3-dialog_fullscreen')).toBeNull()
  })

  test('renders icon, header, footer and content wrappers', async () => {
    render(
      <M3Dialog opened={true}>
        <M3Dialog.Icon>
          <span data-testid="icon-node">ICON</span>
        </M3Dialog.Icon>

        <M3Dialog.Header>
          <h2 data-testid="header-node">Header</h2>
        </M3Dialog.Header>

        <div data-testid="content-node">Dialog body</div>

        <M3Dialog.Footer>
          <button type="button" data-testid="footer-node">Close</button>
        </M3Dialog.Footer>
      </M3Dialog>
    )

    await waitFor(() => {
      expect(screen.getByTestId('content-node')).not.toBeNull()
    })

    expect(document.body.querySelector('.m3-dialog__icon')).not.toBeNull()
    expect(document.body.querySelector('.m3-dialog__header')).not.toBeNull()
    expect(document.body.querySelector('.m3-dialog__footer')).not.toBeNull()
    expect(document.body.querySelector('.m3-dialog__content')).not.toBeNull()
    expect(screen.getByTestId('icon-node')).not.toBeNull()
    expect(screen.getByTestId('header-node')).not.toBeNull()
    expect(screen.getByTestId('footer-node')).not.toBeNull()
    expect(screen.getByTestId('content-node')).not.toBeNull()
  })

  test('forwards dialog attributes and keeps default modal role', async () => {
    render(
      <M3Dialog
        opened={true}
        data-testid="dialog-root"
        aria-label="Settings dialog"
      >
        Dialog body
      </M3Dialog>
    )

    await waitFor(() => {
      expect(screen.getByTestId('dialog-root')).not.toBeNull()
    })

    const dialog = document.body.querySelector('.m3-surface[role="dialog"]') as HTMLElement | null

    expect(dialog?.getAttribute('aria-label')).toBe('Settings dialog')
    expect(dialog?.getAttribute('role')).toBe('dialog')
  })

  test('keeps dialog mounted during close animation before unmounting', async () => {
    const { rerender } = render(
      <M3Dialog opened={true}>
        Dialog body
      </M3Dialog>
    )

    await waitFor(() => {
      expect(screen.getByText('Dialog body')).not.toBeNull()
    })

    vi.useFakeTimers()

    rerender(
      <M3Dialog opened={false}>
        Dialog body
      </M3Dialog>
    )

    expect(screen.getByText('Dialog body')).not.toBeNull()

    await act(async () => {
      vi.advanceTimersByTime(300)
    })

    expect(screen.queryByText('Dialog body')).toBeNull()
  })

  test('toggles scrim visibility when fullscreen changes', async () => {
    const { rerender } = render(
      <M3Dialog opened={true} fullscreen={false}>
        Dialog body
      </M3Dialog>
    )

    await waitFor(() => {
      expect(document.body.querySelector('.m3-surface__scrim')).not.toBeNull()
    })

    rerender(
      <M3Dialog opened={true} fullscreen={true}>
        Dialog body
      </M3Dialog>
    )

    await waitFor(() => {
      expect(screen.getByText('Dialog body')).not.toBeNull()
    })

    expect(document.body.querySelector('.m3-surface__scrim')).toBeNull()
  })
})
