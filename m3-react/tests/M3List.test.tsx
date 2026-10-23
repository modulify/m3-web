import { fireEvent, render, screen } from '@testing-library/react'

import { M3Icon } from '@/components/icon'
import { M3List, M3ListItem } from '@/components/list'

describe('m3-react/list', () => {
  test('uses standard styling by default and supports segmented lists', () => {
    const { rerender } = render(<M3List><M3ListItem selected={true}>Inbox</M3ListItem></M3List>)
    const list = screen.getByRole('list')

    expect(list.classList.contains('m3-list_segmented')).toBe(false)

    rerender(<M3List appearance="segmented"><M3ListItem selected={true}>Inbox</M3ListItem></M3List>)
    expect(list.classList.contains('m3-list_segmented')).toBe(true)
  })

  test('renders explicit list semantics on generic elements', () => {
    render(
      <M3List aria-label="Tasks">
        <M3ListItem>Inbox</M3ListItem>
        <M3ListItem>Archive</M3ListItem>
      </M3List>
    )

    const list = screen.getByRole('list')
    const items = screen.getAllByRole('listitem')

    expect(list.tagName).toBe('DIV')
    expect(list.getAttribute('aria-label')).toBe('Tasks')
    expect(items).toHaveLength(2)
    expect(items.every(item => item.tagName === 'DIV')).toBe(true)
  })

  test('allows composite list roles to override defaults', () => {
    render(
      <M3List role="listbox">
        <M3ListItem role="option" aria-selected={true}>Inbox</M3ListItem>
      </M3List>
    )

    expect(screen.getByRole('listbox').tagName).toBe('DIV')
    expect(screen.getByRole('option').getAttribute('aria-selected')).toBe('true')
  })

  test('renders item slots and resolves multiline layout', () => {
    render(
      <M3List>
        <M3ListItem overline="Today" supportingText="Supporting details">
          <M3ListItem.Leading>
            <M3Icon name="event" />
          </M3ListItem.Leading>
          Planning meeting
          <M3ListItem.Trailing>
            14:12
          </M3ListItem.Trailing>
        </M3ListItem>
      </M3List>
    )

    const item = screen.getByRole('listitem')

    expect(item.classList.contains('m3-list-item_multiline')).toBe(true)
    expect(item.classList.contains('m3-list-item_three-line')).toBe(true)
    expect(item.style.getPropertyValue('--m3-list-item-supporting-lines')).toBe('2')
    expect(item.querySelector('.m3-list-item__content')).not.toBeNull()
    expect(item.querySelector('.m3-list-item__leading')?.textContent).toContain('event')
    expect(item.querySelector('.m3-list-item__headline')?.textContent).toContain('Planning meeting')
    expect(item.querySelector('.m3-list-item__supporting-text')?.textContent).toBe('Supporting details')
    expect(item.querySelector('.m3-list-item__trailing')?.textContent?.trim()).toBe('14:12')
  })

  test('uses explicit text slots before fallback props', () => {
    render(<M3ListItem overline="Old section" headline="Old title" supportingText="Old summary" selected>
      <M3ListItem.Overline>Today</M3ListItem.Overline>
      <M3ListItem.Headline>Planning meeting</M3ListItem.Headline>
      <M3ListItem.SupportingText>New agenda</M3ListItem.SupportingText>
    </M3ListItem>)

    const item = screen.getByRole('listitem')
    expect(item.classList.contains('m3-list-item_selected')).toBe(true)
    expect(item.querySelector('.m3-list-item__overline')?.textContent).toBe('Today')
    expect(item.querySelector('.m3-list-item__headline')?.textContent).toBe('Planning meeting')
    expect(item.querySelector('.m3-list-item__supporting-text')?.textContent).toBe('New agenda')
  })

  test('renders interactive links and disabled buttons', () => {
    render(
      <M3List>
        <M3ListItem href="/settings">Settings</M3ListItem>
        <M3ListItem disabled={true} interactive={true}>Archive</M3ListItem>
      </M3List>
    )

    expect(screen.getByRole('link', { name: 'Settings' }).getAttribute('href')).toBe('/settings')
    expect(screen.getByRole('button', { name: 'Archive' }).hasAttribute('disabled')).toBe(true)
  })

  test('invokes the row action through its button surface', () => {
    const onClick = vi.fn()
    render(<M3ListItem interactive onClick={onClick}>Open details</M3ListItem>)

    fireEvent.click(screen.getByRole('button', { name: 'Open details' }))
    expect(onClick).toHaveBeenCalledOnce()
  })

  test('normalizes string line count', () => {
    render(
      <M3List>
        <M3ListItem lines="2" supportingText="One supporting line">
          Notifications
        </M3ListItem>
      </M3List>
    )

    const item = screen.getByRole('listitem')

    expect(item.classList.contains('m3-list-item_multiline')).toBe(true)
    expect(item.classList.contains('m3-list-item_three-line')).toBe(false)
    expect(item.style.getPropertyValue('--m3-list-item-supporting-lines')).toBe('1')
  })
})
