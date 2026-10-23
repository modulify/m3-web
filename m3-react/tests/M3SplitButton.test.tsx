import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'

import { M3MenuItem } from '@/components/menu'
import { M3SplitButton } from '@/components/split-button'

vi.mock('@modulify/m3-foundation/lib/popper/floating', () => ({
  computePosition: vi.fn(async () => ({ placement: 'bottom-end', side: 'bottom' })),
}))

describe('m3-react/split-button', () => {
  test('uses open as an initial state and reacts to changed commands', async () => {
    const menu = <M3MenuItem>Another action</M3MenuItem>
    const { rerender } = render(<M3SplitButton id="save-actions" menuLabel="More options" menu={menu} open>Save</M3SplitButton>)
    const group = screen.getByRole('group')
    const trailing = screen.getByRole('button', { name: 'More options' })

    expect(group.id).toBe('save-actions')
    expect(trailing.getAttribute('aria-controls')).toBe('save-actions-menu')
    expect(trailing.getAttribute('aria-expanded')).toBe('true')
    await waitFor(() => expect(screen.getByText('Another action')).toBeTruthy())
    expect(document.getElementById('save-actions-menu')).toBeTruthy()
    await waitFor(() => expect(document.getElementById('save-actions-menu')?.classList.contains('m3-popper_shown')).toBe(true))

    fireEvent.click(trailing)
    await waitFor(() => expect(trailing.getAttribute('aria-expanded')).toBe('false'))

    rerender(<M3SplitButton id="save-actions" menuLabel="More options" menu={menu} open>Save</M3SplitButton>)
    expect(trailing.getAttribute('aria-expanded')).toBe('false')

    rerender(<M3SplitButton id="save-actions" open={false} menuLabel="More options" menu={menu}>Save</M3SplitButton>)
    rerender(<M3SplitButton id="save-actions" menuLabel="More options" menu={menu} open>Save</M3SplitButton>)
    expect(trailing.getAttribute('aria-expanded')).toBe('true')

    rerender(<M3SplitButton id="send-actions" menuLabel="More options" menu={menu} open>Save</M3SplitButton>)
    expect(group.id).toBe('send-actions')
    expect(trailing.getAttribute('aria-controls')).toBe('send-actions-menu')
    expect(document.getElementById('send-actions-menu')).toBeTruthy()
  })

  test('keeps the two actions independent and opens the related menu', async () => {
    const onAction = vi.fn()
    const onToggle = vi.fn()

    render(<M3SplitButton menuLabel="More sending options" menu={({ close }) => <M3MenuItem onClick={close}>Schedule send</M3MenuItem>} onAction={onAction} onToggle={onToggle}>
      Send
    </M3SplitButton>)

    const main = screen.getByRole('button', { name: 'Send' })
    const trailing = screen.getByRole('button', { name: 'More sending options' })
    expect(main.tabIndex).toBe(0)
    expect(trailing.tabIndex).toBe(0)
    expect(main.hasAttribute('aria-pressed')).toBe(false)
    expect(trailing.getAttribute('aria-expanded')).toBe('false')

    fireEvent.click(main)
    expect(onAction).toHaveBeenCalledTimes(1)
    expect(onToggle).not.toHaveBeenCalled()

    fireEvent.click(trailing)
    await waitFor(() => expect(onToggle).toHaveBeenCalledWith(true))
    expect(onAction).toHaveBeenCalledTimes(1)
    expect(trailing.getAttribute('aria-expanded')).toBe('true')

    fireEvent.click(screen.getByText('Schedule send'))
    await waitFor(() => expect(trailing.getAttribute('aria-expanded')).toBe('false'))
  })

  test('uses the requested size and appearance for both buttons', () => {
    render(<M3SplitButton size="lg" appearance="outlined" menuLabel="Other options" menu={null}>Save</M3SplitButton>)
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(2)
    for (const button of buttons) {
      expect(button.classList.contains('m3-button_lg')).toBe(true)
      expect(button.classList.contains('m3-button_outlined')).toBe(true)
    }
  })
})
