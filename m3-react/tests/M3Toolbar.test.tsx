import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'

import { M3Toolbar } from '@/components/toolbar'

const actions = [
  { id: 'bold', label: 'Bold', icon: 'format_bold', onClick: vi.fn() },
  { id: 'italic', label: 'Italic', icon: 'format_italic', onClick: vi.fn() },
  { id: 'underline', label: 'Underline', icon: 'format_underlined', onClick: vi.fn() },
  { id: 'link', label: 'Link', icon: 'link', onClick: vi.fn() },
  { id: 'image', label: 'Image', icon: 'image', onClick: vi.fn() },
]

describe('m3-react/toolbar', () => {
  test('renders docked and vertical floating variants with accessible actions', () => {
    const { rerender, container } = render(<M3Toolbar label="Editing" actions={actions}>
      <M3Toolbar.Fab><button type="button">Add</button></M3Toolbar.Fab>
    </M3Toolbar>)
    expect(screen.getByRole('toolbar', { name: 'Editing' }).getAttribute('aria-orientation')).toBe('horizontal')
    expect(screen.getByRole('button', { name: 'Bold' })).not.toBeNull()
    expect(container.querySelector('.m3-toolbar_docked')).not.toBeNull()
    expect(container.querySelector('.m3-toolbar__fab')).toBeNull()

    rerender(<M3Toolbar label="Editing" variant="floating" orientation="vertical" color="vibrant" side="start" actions={actions}>
      <M3Toolbar.Fab><button type="button">Add</button></M3Toolbar.Fab>
    </M3Toolbar>)
    const toolbar = screen.getByRole('toolbar', { name: 'Editing' })
    expect(toolbar.getAttribute('aria-orientation')).toBe('vertical')
    expect(toolbar.classList.contains('m3-toolbar_side-start')).toBe(true)
    expect(toolbar.classList.contains('m3-toolbar_vibrant')).toBe(true)
    expect(container.querySelector('.m3-toolbar__fab')).not.toBeNull()
  })

  test('moves focus along the toolbar without stealing input arrows', () => {
    render(<M3Toolbar label="Editing" actions={actions.slice(0, 2)}><input aria-label="Find" /></M3Toolbar>)
    const bold = screen.getByRole('button', { name: 'Bold' })
    bold.focus()
    fireEvent.keyDown(bold, { key: 'ArrowRight' })
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Italic' }))

    const input = screen.getByRole('textbox', { name: 'Find' })
    input.focus()
    fireEvent.keyDown(input, { key: 'ArrowRight' })
    expect(document.activeElement).toBe(input)
  })

  test('moves excess actions into an accessible menu at a narrow width', async () => {
    const width = window.innerWidth
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 200 })
    try {
      render(<M3Toolbar label="Editing" actions={actions} overflowLabel="More editing actions" />)
      expect(screen.getByRole('button', { name: 'Bold' })).not.toBeNull()
      expect(screen.queryByRole('button', { name: 'Underline' })).toBeNull()
      fireEvent.click(screen.getByRole('button', { name: 'More editing actions' }))
      const item = await screen.findByText('Underline')
      fireEvent.click(item)
      expect(actions[2].onClick).toHaveBeenCalledOnce()
    } finally {
      Object.defineProperty(window, 'innerWidth', { configurable: true, value: width })
    }
  })

  test('hides or collapses on forward scroll and restores on reverse scroll', async () => {
    const scroller = document.createElement('div')
    const view = render(<M3Toolbar label="Editing" variant="floating" scroll="collapse" scrollTarget={scroller} actions={actions}>
      <M3Toolbar.Fab><button type="button">Add</button></M3Toolbar.Fab>
    </M3Toolbar>)
    const toolbar = screen.getByRole('toolbar', { name: 'Editing' })

    scroller.scrollTop = 40
    fireEvent.scroll(scroller)
    await waitFor(() => expect(toolbar.classList.contains('m3-toolbar_collapsed')).toBe(true))
    expect(screen.getByRole('button', { name: 'Add' })).not.toBeNull()

    scroller.scrollTop = 20
    fireEvent.scroll(scroller)
    await waitFor(() => expect(toolbar.classList.contains('m3-toolbar_collapsed')).toBe(false))
    view.rerender(<M3Toolbar label="Editing" scroll="hide" scrollTarget={scroller} />)
    scroller.scrollTop = 60
    fireEvent.scroll(scroller)
    await waitFor(() => expect(toolbar.classList.contains('m3-toolbar_hidden')).toBe(true))
  })
})
