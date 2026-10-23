import { fireEvent, render, screen } from '@testing-library/react'

import { M3MenuItem } from '@/components/menu'

vi.mock('@modulify/m3-foundation/lib/popper/floating', () => ({
  computePosition: vi.fn(async () => ({ placement: 'right-start', side: 'right' })),
}))

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
    const link = screen.getByRole('menuitem', { name: 'Settings' })
    expect(link.tagName).toBe('A')
    expect(link.getAttribute('href')).toBe('/settings')
    expect(link.classList.contains('m3-menu-item_selected')).toBe(true)
    expect(container.querySelectorAll('.m3-menu-item__icon')).toHaveLength(2)
    fireEvent.keyUp(link, { code: 'Enter' })
    fireEvent.keyUp(link, { code: 'Escape' })
    expect(onKeyUp).toHaveBeenCalledTimes(2)
  })

  test('renders a disabled action as a button when no destination is supplied', () => {
    render(<M3MenuItem disabled>Delete</M3MenuItem>)
    const action = screen.getByRole('menuitem', { name: 'Delete' })
    expect(action.tagName).toBe('BUTTON')
    expect(action.classList.contains('m3-menu-item_disabled')).toBe(true)
    expect(action.getAttribute('aria-disabled')).toBe('true')
    expect(action.getAttribute('href')).toBeNull()
  })

  test('uses checked semantics for single and multiple choice items', () => {
    render(<>
      <M3MenuItem selection="single" selected>One</M3MenuItem>
      <M3MenuItem selection="multiple">Two</M3MenuItem>
    </>)

    expect(screen.getByRole('menuitemradio', { name: 'One' }).getAttribute('aria-checked')).toBe('true')
    expect(screen.getByRole('menuitemcheckbox', { name: 'Two' }).getAttribute('aria-checked')).toBe('false')
  })

  test('does not activate a disabled destination', () => {
    const onClick = vi.fn()
    render(<M3MenuItem href="/delete" disabled onClick={onClick}>Delete</M3MenuItem>)
    const item = screen.getByRole('menuitem', { name: 'Delete' })

    expect(item.tagName).toBe('BUTTON')
    expect(item.getAttribute('href')).toBeNull()
    fireEvent.click(item)
    fireEvent.keyUp(item, { code: 'Enter' })
    expect(onClick).not.toHaveBeenCalled()
  })

  test('does not open a submenu from a disabled parent', () => {
    render(<M3MenuItem disabled>
      More actions
      <M3MenuItem.Submenu><M3MenuItem>Archive</M3MenuItem></M3MenuItem.Submenu>
    </M3MenuItem>)
    const parent = screen.getByRole('menuitem', { name: 'More actions' })

    fireEvent.mouseEnter(parent)
    fireEvent.keyDown(parent, { key: 'ArrowRight' })
    fireEvent.click(parent)
    expect(parent.getAttribute('aria-expanded')).toBe('false')
  })

  test('opens a submenu when its parent is clicked', () => {
    render(<M3MenuItem>
      More actions
      <M3MenuItem.Submenu><M3MenuItem>Archive</M3MenuItem></M3MenuItem.Submenu>
    </M3MenuItem>)
    const parent = screen.getByRole('menuitem', { name: 'More actions' })

    fireEvent.click(parent)
    expect(parent.getAttribute('aria-expanded')).toBe('true')
  })
})
