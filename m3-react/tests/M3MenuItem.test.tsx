import type { M3LinkProps } from '@/components/link'
import type { M3MenuItemExposed } from '@/components/menu'

import { createRef } from 'react'
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'

import { M3MenuItem } from '@/components/menu'

const linkBehavior = vi.hoisted(() => ({
  missing: false,
  forwardDisabledClick: false,
}))

vi.mock('@/components/link', async (importOriginal) => {
  const original = await importOriginal<typeof import('@/components/link')>()

  return {
    ...original,
    M3Link: (props: M3LinkProps) => {
      if (linkBehavior.missing) return null

      if (linkBehavior.forwardDisabledClick) {
        return <button type="button" data-testid="unexpected-click" onClick={props.onClick}>
          {props.children}
        </button>
      }

      return <original.M3Link {...props} />
    },
  }
})

vi.mock('@modulify/m3-foundation/lib/popper/floating', () => ({
  computePosition: vi.fn(async () => ({ placement: 'right-start', side: 'right' })),
}))

describe('m3-react/menu-item', () => {
  afterEach(() => {
    linkBehavior.missing = false
    linkBehavior.forwardDisabledClick = false
  })

  test('tolerates a link that disappears before effects run', () => {
    linkBehavior.missing = true
    const view = render(<M3MenuItem>Action</M3MenuItem>)

    expect(view.container.childElementCount).toBe(0)
  })

  test('ignores a disabled item click forwarded by its child', () => {
    linkBehavior.forwardDisabledClick = true
    const onClick = vi.fn()
    render(<M3MenuItem disabled onClick={onClick}>Delete</M3MenuItem>)

    const item = screen.getByTestId('unexpected-click')
    const event = new MouseEvent('click', { bubbles: true, cancelable: true })
    item.dispatchEvent(event)

    expect(event.defaultPrevented).toBe(true)
    expect(onClick).not.toHaveBeenCalled()
  })

  test('renders selected destination with leading and trailing content', () => {
    const onKeyUp = vi.fn()
    const ref = createRef<M3MenuItemExposed>()
    const { container } = render(
      <M3MenuItem ref={ref} href="/settings" selected onKeyUp={onKeyUp}>
        <M3MenuItem.Leading><span aria-hidden="true">⚙</span></M3MenuItem.Leading>
        Settings
        <M3MenuItem.Trailing><span aria-hidden="true">↗</span></M3MenuItem.Trailing>
      </M3MenuItem>
    )
    const link = screen.getByRole('menuitem', { name: 'Settings' })
    expect(link.tagName).toBe('A')
    expect(link.getAttribute('href')).toBe('/settings')
    expect(ref.current?.el).toBe(link)
    expect(link.classList.contains('m3-menu-item_selected')).toBe(true)
    expect(container.querySelectorAll('.m3-menu-item__icon')).toHaveLength(2)
    fireEvent.keyUp(link, { code: 'Enter' })
    fireEvent.keyUp(link, { code: 'Escape' })
    fireEvent.mouseEnter(link)
    fireEvent.mouseLeave(link)
    expect(onKeyUp).toHaveBeenCalledTimes(2)
  })

  test('renders without item content and clears its exposed element on unmount', () => {
    const ref = createRef<M3MenuItemExposed>()
    const view = render(<M3MenuItem ref={ref} />)
    const exposed = ref.current!

    expect(exposed.el).toBe(view.getByRole('menuitem'))
    view.unmount()
    expect(exposed.el).toBeNull()
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

  test('opens a submenu on hover and closes it after leaving', async () => {
    render(<M3MenuItem>
      More actions
      <M3MenuItem.Submenu><M3MenuItem>Archive</M3MenuItem></M3MenuItem.Submenu>
    </M3MenuItem>)
    const parent = screen.getByRole('menuitem', { name: 'More actions' })

    fireEvent.mouseEnter(parent)
    expect(parent.getAttribute('aria-expanded')).toBe('true')

    fireEvent.mouseLeave(parent)
    await waitFor(() => {
      expect(parent.getAttribute('aria-expanded')).toBe('false')
    })
  })

  test('keeps a submenu open while the pointer moves from its parent into the menu', async () => {
    render(<M3MenuItem>
      More actions
      <M3MenuItem.Submenu><M3MenuItem>Archive</M3MenuItem></M3MenuItem.Submenu>
    </M3MenuItem>)
    const parent = screen.getByRole('menuitem', { name: 'More actions' })

    fireEvent.mouseEnter(parent)
    const submenu = await screen.findByRole('menu')
    fireEvent.mouseLeave(parent)
    fireEvent.mouseEnter(submenu)

    await new Promise(resolve => setTimeout(resolve, 250))
    expect(parent.getAttribute('aria-expanded')).toBe('true')

    fireEvent.mouseLeave(submenu)
    await waitFor(() => expect(parent.getAttribute('aria-expanded')).toBe('false'))
  })

  test('opens a submenu with the leading arrow in RTL and closes on outside focus', () => {
    document.dir = 'rtl'

    try {
      render(<M3MenuItem>
        More actions
        <M3MenuItem.Submenu><M3MenuItem>Archive</M3MenuItem></M3MenuItem.Submenu>
      </M3MenuItem>)
      const parent = screen.getByRole('menuitem', { name: 'More actions' })

      fireEvent.keyDown(parent, { key: 'ArrowLeft' })
      expect(parent.getAttribute('aria-expanded')).toBe('true')

      fireEvent.blur(parent, { relatedTarget: document.body })
      expect(parent.getAttribute('aria-expanded')).toBe('false')
    } finally {
      document.dir = ''
    }
  })

  test('keeps a submenu open while focus moves between its parent and child', async () => {
    render(<M3MenuItem>
      More actions
      <M3MenuItem.Submenu><M3MenuItem>Archive</M3MenuItem></M3MenuItem.Submenu>
    </M3MenuItem>)
    const parent = screen.getByRole('menuitem', { name: 'More actions' })

    fireEvent.blur(parent, { relatedTarget: document.body })

    fireEvent.mouseEnter(parent)
    const submenu = await screen.findByRole('menu')
    const child = screen.getByRole('menuitem', { name: 'Archive' })

    fireEvent.blur(parent, { relatedTarget: child })
    expect(parent.getAttribute('aria-expanded')).toBe('true')

    fireEvent.blur(submenu, { relatedTarget: parent })
    expect(parent.getAttribute('aria-expanded')).toBe('true')

    fireEvent.blur(submenu, { relatedTarget: document.body })
    expect(parent.getAttribute('aria-expanded')).toBe('false')
  })
})
