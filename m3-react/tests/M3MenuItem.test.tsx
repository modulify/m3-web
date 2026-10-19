import { fireEvent, render, screen } from '@testing-library/react'

import { M3MenuItem } from '@/components/menu'

describe('m3-react/menu-item', () => {
  test('renders selected destination with leading and trailing content', () => {
    const onKeyUp = vi.fn()
    const { container } = render(
      <M3MenuItem href="/settings" selected onKeyUp={onKeyUp}>
        <M3MenuItem.Leading><span aria-hidden="true">⚙</span></M3MenuItem.Leading>
        Settings
        <M3MenuItem.Trailing><span aria-hidden="true">↗</span></M3MenuItem.Trailing>
      </M3MenuItem>
    )
    const link = screen.getByRole('link', { name: 'Settings' })
    expect(link.getAttribute('href')).toBe('/settings')
    expect(link.classList.contains('m3-menu-item_selected')).toBe(true)
    expect(container.querySelectorAll('.m3-menu-item__icon')).toHaveLength(2)
    fireEvent.keyUp(link, { code: 'Enter' })
    fireEvent.keyUp(link, { code: 'Escape' })
    expect(onKeyUp).toHaveBeenCalledTimes(2)
  })

  test('renders a disabled action as a button when no destination is supplied', () => {
    render(<M3MenuItem disabled>Delete</M3MenuItem>)
    const action = screen.getByRole('button', { name: 'Delete' })
    expect(action.classList.contains('m3-menu-item_disabled')).toBe(true)
    expect(action.getAttribute('href')).toBeNull()
  })
})
