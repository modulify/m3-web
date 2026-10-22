import { fireEvent } from '@testing-library/vue'
import { h } from 'vue'
import { render, screen, waitFor } from '@testing-library/vue'

import { M3MenuItem } from '@/components/menu'
import { M3SplitButton } from '@/components/split-button'

describe('m3-vue/split-button', () => {
  test('uses open as an initial state and reacts to changed commands', async () => {
    const view = render(M3SplitButton, {
      props: { id: 'save-actions', open: true, menuLabel: 'More options' },
      slots: {
        default: 'Save',
        menu: () => h(M3MenuItem, {}, () => 'Another action'),
      },
    })
    const group = screen.getByRole('group')
    const trailing = screen.getByRole('button', { name: 'More options' })

    expect(group.id).toBe('save-actions')
    expect(trailing.getAttribute('aria-controls')).toBe('save-actions-menu')
    expect(trailing.getAttribute('aria-expanded')).toBe('true')
    await waitFor(() => expect(screen.getByText('Another action')).toBeTruthy())
    expect(document.getElementById('save-actions-menu')).toBeTruthy()

    await fireEvent.click(trailing)
    await waitFor(() => expect(trailing.getAttribute('aria-expanded')).toBe('false'))

    await view.rerender({ open: true })
    expect(trailing.getAttribute('aria-expanded')).toBe('false')

    await view.rerender({ open: false })
    await view.rerender({ open: true })
    expect(trailing.getAttribute('aria-expanded')).toBe('true')

    await view.rerender({ id: 'send-actions' })
    expect(group.id).toBe('send-actions')
    expect(trailing.getAttribute('aria-controls')).toBe('send-actions-menu')
    expect(document.getElementById('send-actions-menu')).toBeTruthy()
  })

  test('keeps the two actions independent and opens the related menu', async () => {
    const onAction = vi.fn()
    const onToggle = vi.fn()
    const onUpdateOpen = vi.fn()

    render(M3SplitButton, {
      props: { menuLabel: 'More sending options', onAction, onToggle, 'onUpdate:open': onUpdateOpen },
      slots: {
        default: 'Send',
        menu: ({ close }: { close: () => void }) => h(M3MenuItem, { onClick: close }, () => 'Schedule send'),
      },
    })

    const main = screen.getByRole('button', { name: 'Send' })
    const trailing = screen.getByRole('button', { name: 'More sending options' })
    expect(main.tabIndex).toBe(0)
    expect(trailing.tabIndex).toBe(0)
    expect(main.hasAttribute('aria-pressed')).toBe(false)
    expect(trailing.getAttribute('aria-expanded')).toBe('false')

    await fireEvent.click(main)
    expect(onAction).toHaveBeenCalledTimes(1)
    expect(onToggle).not.toHaveBeenCalled()

    await fireEvent.click(trailing)
    await waitFor(() => expect(onToggle).toHaveBeenCalledWith(true))
    expect(onUpdateOpen).toHaveBeenCalledWith(true)
    expect(onAction).toHaveBeenCalledTimes(1)
    expect(trailing.getAttribute('aria-expanded')).toBe('true')

    await fireEvent.click(screen.getByText('Schedule send'))
    await waitFor(() => expect(trailing.getAttribute('aria-expanded')).toBe('false'))
  })

  test('uses the requested size and appearance for both buttons', () => {
    render(M3SplitButton, { props: { size: 'lg', appearance: 'outlined', menuLabel: 'Other options' }, slots: { default: 'Save' } })
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(2)
    for (const button of buttons) {
      expect(button.classList.contains('m3-button_lg')).toBe(true)
      expect(button.classList.contains('m3-button_outlined')).toBe(true)
    }
  })
})
