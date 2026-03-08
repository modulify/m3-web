import {
  fireEvent,
  render,
  screen,
} from '@testing-library/vue'

import { nextTick } from 'vue'

import { M3Dialog } from '@/components/dialog'

describe('m3-vue/dialog', () => {
  afterEach(() => {
    vi.useRealTimers()
    document.body.innerHTML = ''
  })

  test('opens by prop and emits close request on scrim click', async () => {
    const view = render(M3Dialog, {
      props: {
        opened: false,
      },
      slots: {
        default: 'Dialog body',
      },
    })

    expect(screen.queryByText('Dialog body')).toBeNull()

    await view.rerender({ opened: true })
    await nextTick()

    expect(screen.getByText('Dialog body')).not.toBeNull()

    const scrim = document.body.querySelector('.m3-surface__scrim') as HTMLElement

    await fireEvent.click(scrim)

    expect(view.emitted()['update:opened']?.[0]).toEqual([false])
  })

  test('renders modal surface root instead of legacy container', async () => {
    render(M3Dialog, {
      props: {
        opened: true,
      },
      slots: {
        default: 'Dialog body',
      },
    })

    await nextTick()

    expect(document.body.querySelector('.m3-surface[role="dialog"]')).not.toBeNull()
    expect(document.body.querySelector('.m3-dialog-container')).toBeNull()
  })

  test('does not render scrim or legacy fullscreen class in fullscreen mode', async () => {
    render(M3Dialog, {
      props: {
        opened: true,
        fullscreen: true,
      },
      slots: {
        default: 'Fullscreen body',
      },
    })

    await nextTick()

    expect(screen.getByText('Fullscreen body')).not.toBeNull()
    expect(document.body.querySelector('.m3-surface__scrim')).toBeNull()
    expect(document.body.querySelector('.m3-dialog_fullscreen')).toBeNull()
  })

  test('renders icon, header, footer and content wrappers', async () => {
    render(M3Dialog, {
      props: {
        opened: true,
      },
      slots: {
        icon: '<span data-testid="icon-node">ICON</span>',
        header: '<h2 data-testid="header-node">Header</h2>',
        footer: '<button data-testid="footer-node">Close</button>',
        default: '<div data-testid="content-node">Dialog body</div>',
      },
    })

    await nextTick()

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
    render(M3Dialog, {
      props: {
        opened: true,
        'data-testid': 'dialog-root',
        'aria-label': 'Settings dialog',
      } as {
        opened: boolean,
        'data-testid': string,
        'aria-label': string,
      },
      slots: {
        default: 'Dialog body',
      },
    })

    await nextTick()

    const dialog = document.body.querySelector('.m3-surface[role="dialog"]') as HTMLElement | null

    expect(screen.getByTestId('dialog-root')).not.toBeNull()
    expect(dialog?.getAttribute('aria-label')).toBe('Settings dialog')
    expect(dialog?.getAttribute('role')).toBe('dialog')
  })

  test('keeps dialog mounted during close animation before unmounting', async () => {
    vi.useFakeTimers()

    const view = render(M3Dialog, {
      props: {
        opened: true,
      },
      slots: {
        default: 'Dialog body',
      },
    })

    await nextTick()
    expect(screen.getByText('Dialog body')).not.toBeNull()

    await view.rerender({ opened: false })
    await nextTick()

    expect(screen.getByText('Dialog body')).not.toBeNull()

    vi.advanceTimersByTime(300)
    await nextTick()

    expect(screen.queryByText('Dialog body')).toBeNull()
  })

  test('toggles scrim visibility when fullscreen changes', async () => {
    const view = render(M3Dialog, {
      props: {
        opened: true,
        fullscreen: false,
      },
      slots: {
        default: 'Dialog body',
      },
    })

    await nextTick()
    expect(document.body.querySelector('.m3-surface__scrim')).not.toBeNull()

    await view.rerender({ opened: true, fullscreen: true })
    await nextTick()

    expect(document.body.querySelector('.m3-surface__scrim')).toBeNull()
  })
})
