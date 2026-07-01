import {
  render,
  screen,
} from '@testing-library/react'

import { M3Icon } from '@/components/icon'
import {
  M3List,
  M3ListItem,
} from '@/components/list'

describe('m3-react/list', () => {
  test('renders native list semantics', () => {
    render(
      <M3List aria-label="Tasks">
        <M3ListItem>Inbox</M3ListItem>
        <M3ListItem>Archive</M3ListItem>
      </M3List>
    )

    expect(screen.getByRole('list').getAttribute('aria-label')).toBe('Tasks')
    expect(screen.getAllByRole('listitem').length).toBe(2)
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
    expect(item.style.getPropertyValue('--m3-list-item-supporting-lines')).toBe('2')
    expect(item.querySelector('.m3-list-item__content')).not.toBeNull()
    expect(item.querySelector('.m3-list-item__leading')?.textContent).toContain('event')
    expect(item.querySelector('.m3-list-item__headline')?.textContent).toContain('Planning meeting')
    expect(item.querySelector('.m3-list-item__supporting-text')?.textContent).toBe('Supporting details')
    expect(item.querySelector('.m3-list-item__trailing')?.textContent?.trim()).toBe('14:12')
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
    expect(item.style.getPropertyValue('--m3-list-item-supporting-lines')).toBe('1')
  })
})
