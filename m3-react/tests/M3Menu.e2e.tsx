import { act, fireEvent, render } from '@testing-library/react'

import { M3Menu, M3MenuItem } from '@/components/menu'

test('switches between standard and vibrant color and density', async () => {
  const trigger = document.createElement('button')
  document.body.append(trigger)
  const view = render(<M3Menu target={trigger} color="vibrant" density={-2}>
    <M3MenuItem>Rename</M3MenuItem>
  </M3Menu>)

  try {
    await act(async () => trigger.click())
    const menu = await vi.waitFor(() => {
      const element = document.querySelector<HTMLElement>('.m3-menu.m3-popper_shown')
      expect(element).not.toBeNull()
      return element!
    })
    expect(menu.classList.contains('m3-menu_vibrant')).toBe(true)
    expect(menu.classList.contains('m3-menu_density--2')).toBe(true)
    expect(getComputedStyle(menu.querySelector('.m3-menu-item__content')!).minHeight).toBe('40px')

    view.rerender(<M3Menu target={trigger}><M3MenuItem>Rename</M3MenuItem></M3Menu>)
    expect(menu.classList.contains('m3-menu_vibrant')).toBe(false)
    expect(menu.classList.contains('m3-menu_density--2')).toBe(false)
  } finally {
    view.unmount()
    trigger.remove()
  }
})

test('leaves listbox keyboard handling to its consumer', async () => {
  const trigger = document.createElement('button')
  document.body.append(trigger)
  const view = render(<M3Menu target={trigger} role="listbox">
    <M3MenuItem role="option">Draft</M3MenuItem>
    <M3MenuItem role="option">Published</M3MenuItem>
  </M3Menu>)

  try {
    await act(async () => trigger.click())
    const menu = await vi.waitFor(() => {
      const element = document.querySelector<HTMLElement>('.m3-menu.m3-popper_shown')
      expect(element).not.toBeNull()
      return element!
    })
    const first = menu.querySelector<HTMLElement>('.m3-menu-item')!
    first.focus()
    fireEvent.keyDown(first, { key: 'ArrowDown' })
    expect(document.activeElement).toBe(first)
  } finally {
    view.unmount()
    trigger.remove()
  }
})

test('menu keyboard navigation skips disabled items and returns focus on Escape', async () => {
  const trigger = document.createElement('button')
  trigger.textContent = 'Open menu'
  document.body.append(trigger)

  const view = render(<M3Menu target={trigger}>
    <M3MenuItem>First</M3MenuItem>
    <M3MenuItem disabled>Unavailable</M3MenuItem>
    <M3MenuItem>Last</M3MenuItem>
  </M3Menu>)

  try {
    await act(async () => {
      trigger.focus()
      trigger.click()
    })

    await vi.waitFor(() => expect(document.activeElement?.textContent).toBe('First'))
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' })
    expect(document.activeElement?.textContent).toBe('Last')

    fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' })
    expect(document.activeElement?.textContent).toBe('First')
    fireEvent.keyDown(document.activeElement!, { key: 'End' })
    expect(document.activeElement?.textContent).toBe('Last')
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowUp' })
    expect(document.activeElement?.textContent).toBe('First')
    fireEvent.keyDown(document.activeElement!, { key: 'Home' })
    expect(document.activeElement?.textContent).toBe('First')
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowUp' })
    expect(document.activeElement?.textContent).toBe('Last')

    fireEvent.keyDown(document.activeElement!, { key: 'Escape' })
    await vi.waitFor(() => expect(document.activeElement).toBe(trigger))
  } finally {
    view.unmount()
    trigger.remove()
  }
})

test('submenu opens from its parent and returns focus on the reverse arrow', async () => {
  const trigger = document.createElement('button')
  trigger.textContent = 'Open menu'
  document.body.append(trigger)

  const view = render(<M3Menu target={trigger}>
    <M3MenuItem>
      More actions
      <M3MenuItem.Submenu>
        <M3MenuItem>Favorite</M3MenuItem>
        <M3MenuItem>Archive</M3MenuItem>
      </M3MenuItem.Submenu>
    </M3MenuItem>
  </M3Menu>)

  try {
    await act(async () => {
      trigger.focus()
      trigger.click()
    })

    const parent = await vi.waitFor(() => {
      const item = document.querySelector<HTMLElement>('.m3-menu-item[aria-haspopup="menu"]')
      expect(item).not.toBeNull()
      return item!
    })
    await vi.waitFor(() => expect(document.activeElement).toBe(parent))
    expect(parent?.getAttribute('aria-expanded')).toBe('false')

    await act(async () => fireEvent.keyDown(parent!, { key: 'ArrowRight' }))
    await vi.waitFor(() => expect(parent?.getAttribute('aria-expanded')).toBe('true'))
    const child = await vi.waitFor(() => {
      const item = Array.from(document.querySelectorAll<HTMLElement>('.m3-menu-item')).find(item => item.textContent?.includes('Favorite'))
      expect(item).toBeDefined()
      return item!
    })
    await vi.waitFor(() => expect(document.activeElement).toBe(child))

    await act(async () => fireEvent.keyDown(child!, { key: 'ArrowLeft' }))
    await vi.waitFor(() => expect(document.activeElement).toBe(parent))
    await vi.waitFor(() => expect(parent?.getAttribute('aria-expanded')).toBe('false'))

    parent?.blur()
    await vi.waitFor(() => expect(parent?.getAttribute('aria-expanded')).toBe('false'))

    await act(async () => fireEvent.click(parent!))
    await vi.waitFor(() => expect(parent?.getAttribute('aria-expanded')).toBe('true'))
    await act(async () => fireEvent.mouseLeave(parent!))
    await vi.waitFor(() => expect(parent?.getAttribute('aria-expanded')).toBe('false'))

    await act(async () => fireEvent.mouseEnter(parent!))
    await vi.waitFor(() => expect(parent?.getAttribute('aria-expanded')).toBe('true'))
    const action = Array.from(document.querySelectorAll<HTMLElement>('.m3-menu-item')).find(item => item.textContent?.includes('Archive'))
    await act(async () => fireEvent.click(action!))
    await vi.waitFor(() => expect(document.querySelectorAll('.m3-menu.m3-popper_shown')).toHaveLength(0))
  } finally {
    view.unmount()
    trigger.remove()
  }
})

test('submenu keyboard directions follow RTL layout', async () => {
  const previousDirection = document.dir
  document.dir = 'rtl'
  const trigger = document.createElement('button')
  document.body.append(trigger)
  const view = render(<M3Menu target={trigger}>
    <M3MenuItem>
      More
      <M3MenuItem.Submenu><M3MenuItem>Child</M3MenuItem></M3MenuItem.Submenu>
    </M3MenuItem>
  </M3Menu>)

  try {
    await act(async () => {
      trigger.focus()
      trigger.click()
    })
    await vi.waitFor(() => expect(document.querySelector('.m3-menu.m3-popper_shown')).not.toBeNull())
    const parent = await vi.waitFor(() => {
      const item = document.querySelector<HTMLElement>('.m3-menu-item[aria-haspopup="menu"]')
      expect(item).not.toBeNull()
      return item!
    })
    parent.focus()
    expect(document.activeElement).toBe(parent)

    await act(async () => fireEvent.keyDown(parent!, { key: 'ArrowLeft' }))
    await vi.waitFor(() => expect(document.querySelectorAll('.m3-menu.m3-popper_shown')).toHaveLength(2))
    const child = await vi.waitFor(() => {
      const item = Array.from(document.querySelectorAll<HTMLElement>('.m3-menu-item')).find(item => item.textContent?.includes('Child'))
      expect(item).toBeDefined()
      return item!
    })
    child.focus()
    expect(document.activeElement).toBe(child)

    await act(async () => fireEvent.keyDown(child!, { key: 'ArrowRight' }))
    await vi.waitFor(() => expect(document.activeElement).toBe(parent))
  } finally {
    view.unmount()
    trigger.remove()
    document.dir = previousDirection
  }
})
