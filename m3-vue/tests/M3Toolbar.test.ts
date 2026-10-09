import { fireEvent } from '@testing-library/vue'
import { h, nextTick } from 'vue'
import { render, screen, waitFor } from '@testing-library/vue'

import { M3Toolbar } from '@/components/toolbar'

const actions = [
  { id: 'bold', label: 'Bold', icon: 'format_bold', onClick: vi.fn() },
  { id: 'italic', label: 'Italic', icon: 'format_italic', onClick: vi.fn() },
  { id: 'underline', label: 'Underline', icon: 'format_underlined', onClick: vi.fn() },
  { id: 'link', label: 'Link', icon: 'link', onClick: vi.fn() },
  { id: 'image', label: 'Image', icon: 'image', onClick: vi.fn() },
]

describe('m3-vue/toolbar', () => {
  test('renders docked and vertical floating variants with accessible actions', async () => {
    const view = render(M3Toolbar, { props: { label: 'Editing', actions }, slots: { fab: () => h('button', 'Add') } })
    expect(screen.getByRole('toolbar', { name: 'Editing' }).getAttribute('aria-orientation')).toBe('horizontal')
    expect(screen.getByRole('button', { name: 'Bold' })).not.toBeNull()
    expect(view.container.querySelector('.m3-toolbar_docked')).not.toBeNull()
    expect(view.container.querySelector('.m3-toolbar__fab')).toBeNull()

    await view.rerender({ label: 'Editing', variant: 'floating', orientation: 'vertical', color: 'vibrant', side: 'start', actions })
    const toolbar = screen.getByRole('toolbar', { name: 'Editing' })
    expect(toolbar.getAttribute('aria-orientation')).toBe('vertical')
    expect(toolbar.classList.contains('m3-toolbar_side-start')).toBe(true)
    expect(toolbar.classList.contains('m3-toolbar_vibrant')).toBe(true)
    expect(view.container.querySelector('.m3-toolbar__fab')).not.toBeNull()
  })

  test('moves focus along the toolbar without stealing input arrows', async () => {
    render(M3Toolbar, { props: { label: 'Editing', actions: actions.slice(0, 2) }, slots: { default: () => h('input', { 'aria-label': 'Find' }) } })
    const bold = screen.getByRole('button', { name: 'Bold' })
    bold.focus()
    await fireEvent.keyDown(bold, { key: 'ArrowRight' })
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Italic' }))

    const input = screen.getByRole('textbox', { name: 'Find' })
    input.focus()
    await fireEvent.keyDown(input, { key: 'ArrowRight' })
    expect(document.activeElement).toBe(input)
  })

  test('moves excess actions into an accessible menu at a narrow width', async () => {
    const width = window.innerWidth
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 200 })
    try {
      render(M3Toolbar, { props: { label: 'Editing', actions, overflowLabel: 'More editing actions' } })
      await nextTick()
      expect(screen.getByRole('button', { name: 'Bold' })).not.toBeNull()
      expect(screen.queryByRole('button', { name: 'Underline' })).toBeNull()
      await fireEvent.click(screen.getByRole('button', { name: 'More editing actions' }))
      const item = await screen.findByText('Underline')
      await fireEvent.click(item)
      expect(actions[2].onClick).toHaveBeenCalledOnce()
    } finally {
      Object.defineProperty(window, 'innerWidth', { configurable: true, value: width })
    }
  })

  test('hides or collapses on forward scroll and restores on reverse scroll', async () => {
    const scroller = document.createElement('div')
    const view = render(M3Toolbar, {
      props: { label: 'Editing', variant: 'floating', scroll: 'collapse', scrollTarget: scroller, actions },
      slots: { fab: () => h('button', 'Add') },
    })
    const toolbar = screen.getByRole('toolbar', { name: 'Editing' })

    scroller.scrollTop = 40
    await fireEvent.scroll(scroller)
    expect(toolbar.classList.contains('m3-toolbar_collapsed')).toBe(true)
    expect(screen.getByRole('button', { name: 'Add' })).not.toBeNull()

    scroller.scrollTop = 20
    await fireEvent.scroll(scroller)
    expect(toolbar.classList.contains('m3-toolbar_collapsed')).toBe(false)
    await view.rerender({ label: 'Editing', scroll: 'hide', scrollTarget: scroller })
    scroller.scrollTop = 60
    await fireEvent.scroll(scroller)
    await waitFor(() => expect(toolbar.classList.contains('m3-toolbar_hidden')).toBe(true))
  })
})
