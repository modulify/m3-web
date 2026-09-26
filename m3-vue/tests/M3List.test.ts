import { render, screen } from '@testing-library/vue'

import { M3Icon } from '@/components/icon'
import { M3List, M3ListItem } from '@/components/list'

describe('m3-vue/list', () => {
  test('renders explicit list semantics on generic elements', () => {
    render({
      components: {
        M3List,
        M3ListItem,
      },

      template: `
        <M3List aria-label="Tasks">
            <M3ListItem>Inbox</M3ListItem>
            <M3ListItem>Archive</M3ListItem>
        </M3List>
      `,
    })

    const list = screen.getByRole('list')
    const items = screen.getAllByRole('listitem')

    expect(list.tagName).toBe('DIV')
    expect(list.getAttribute('aria-label')).toBe('Tasks')
    expect(items).toHaveLength(2)
    expect(items.every(item => item.tagName === 'DIV')).toBe(true)
  })

  test('allows composite list roles to override defaults', () => {
    render({
      components: {
        M3List,
        M3ListItem,
      },

      template: `
        <M3List role="listbox">
            <M3ListItem aria-selected="true" role="option">Inbox</M3ListItem>
        </M3List>
      `,
    })

    expect(screen.getByRole('listbox').tagName).toBe('DIV')
    expect(screen.getByRole('option').getAttribute('aria-selected')).toBe('true')
  })

  test('renders item slots and resolves multiline layout', () => {
    render({
      components: {
        M3Icon,
        M3List,
        M3ListItem,
      },

      template: `
        <M3List>
            <M3ListItem overline="Today" supporting-text="Supporting details">
                <template #leading>
                    <M3Icon name="event" />
                </template>

                Planning meeting

                <template #trailing>
                    14:12
                </template>
            </M3ListItem>
        </M3List>
      `,
    })

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
    render({
      components: {
        M3List,
        M3ListItem,
      },

      template: `
        <M3List>
            <M3ListItem href="/settings">Settings</M3ListItem>
            <M3ListItem disabled interactive>Archive</M3ListItem>
        </M3List>
      `,
    })

    expect(screen.getByRole('link', { name: 'Settings' }).getAttribute('href')).toBe('/settings')
    expect(screen.getByRole('button', { name: 'Archive' }).hasAttribute('disabled')).toBe(true)
  })

  test('normalizes string line count', () => {
    render({
      components: {
        M3List,
        M3ListItem,
      },

      template: `
        <M3List>
            <M3ListItem lines="2" supporting-text="One supporting line">
                Notifications
            </M3ListItem>
        </M3List>
      `,
    })

    const item = screen.getByRole('listitem')

    expect(item.classList.contains('m3-list-item_multiline')).toBe(true)
    expect(item.style.getPropertyValue('--m3-list-item-supporting-lines')).toBe('1')
  })
})
