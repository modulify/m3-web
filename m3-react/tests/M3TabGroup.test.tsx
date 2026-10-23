import {
  act,
  fireEvent,
  render,
  screen,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { M3Tab, M3TabGroup } from '@/components/tabs'

const renderTabs = (props: React.ComponentProps<typeof M3TabGroup> = {}) => render(
  <M3TabGroup aria-label="Sections" {...props}>
    <M3Tab value="inbox" label="Inbox" badge="24">Inbox content</M3Tab>
    <M3Tab value="drafts" label="Drafts">Draft content</M3Tab>
    <M3Tab value="trash" label="Trash" disabled>Trash content</M3Tab>
  </M3TabGroup>
)

describe('m3-react/tabs', () => {
  test('renders an empty group while asynchronous tabs are loading', () => {
    render(<M3TabGroup aria-label="Loading sections" />)
    expect(screen.getByRole('tablist', { name: 'Loading sections' })).not.toBeNull()
    expect(screen.queryByRole('tab')).toBeNull()
    expect(screen.queryByRole('tabpanel')).toBeNull()
  })

  test('links selected tab and panel, and switches on click', () => {
    const onChange = vi.fn()
    renderTabs({ onChange })

    const inbox = screen.getByRole('tab', { name: 'Inbox' })
    const drafts = screen.getByRole('tab', { name: 'Drafts' })
    expect(inbox.getAttribute('aria-selected')).toBe('true')
    expect(inbox.getAttribute('aria-controls')).toBe(screen.getByRole('tabpanel').id)
    expect(screen.getByRole('tabpanel').getAttribute('aria-labelledby')).toBe(inbox.id)
    expect(document.getElementById(drafts.getAttribute('aria-controls')!)?.hidden).toBe(true)

    fireEvent.click(inbox)
    expect(onChange).not.toHaveBeenCalled()

    fireEvent.click(drafts)
    expect(drafts.getAttribute('aria-selected')).toBe('true')
    expect(screen.getByRole('tabpanel').textContent).toBe('Draft content')
    expect(screen.queryByText('Inbox content')).toBeNull()
    expect(onChange).toHaveBeenCalledExactlyOnceWith('drafts')
  })

  test('uses manual keyboard activation and skips disabled tabs', async () => {
    const onChange = vi.fn()
    renderTabs({ onChange, layout: 'scrollable', variant: 'secondary' })

    const inbox = screen.getByRole('tab', { name: 'Inbox' })
    const drafts = screen.getByRole('tab', { name: 'Drafts' })
    act(() => inbox.focus())
    fireEvent.keyDown(inbox, { key: 'ArrowRight' })
    expect(document.activeElement).toBe(drafts)
    expect(inbox.getAttribute('aria-selected')).toBe('true')
    await userEvent.keyboard('{Enter}')
    expect(onChange).toHaveBeenCalledWith('drafts')
    fireEvent.keyDown(drafts, { key: 'ArrowRight' })
    expect(document.activeElement).toBe(inbox)
    expect(screen.getByRole('tablist').parentElement?.parentElement?.classList.contains('m3-tab-group_scrollable')).toBe(true)
  })

  test('treats value changes as selection signals and supports nested fragments', () => {
    const onChange = vi.fn()
    const { rerender } = render(
      <M3TabGroup value="drafts" onChange={onChange}>
        <><M3Tab value="inbox" label="Inbox">Inbox content</M3Tab></>
        <M3Tab value="drafts" label="Drafts">Draft content</M3Tab>
      </M3TabGroup>
    )
    fireEvent.click(screen.getByRole('tab', { name: 'Inbox' }))
    expect(onChange).toHaveBeenCalledWith('inbox')
    expect(screen.getByRole('tabpanel').textContent).toBe('Inbox content')

    rerender(<M3TabGroup value="drafts">
      <M3Tab value="inbox" label="Inbox">Inbox content</M3Tab>
      <M3Tab value="drafts" label="Drafts">Draft content</M3Tab>
    </M3TabGroup>)
    expect(screen.getByRole('tabpanel').textContent).toBe('Inbox content')

    rerender(<M3TabGroup value="inbox">
      <M3Tab value="inbox" label="Inbox">Inbox content</M3Tab>
      <M3Tab value="drafts" label="Drafts">Draft content</M3Tab>
    </M3TabGroup>)
    rerender(<M3TabGroup value="drafts">
      <M3Tab value="inbox" label="Inbox">Inbox content</M3Tab>
      <M3Tab value="drafts" label="Drafts">Draft content</M3Tab>
    </M3TabGroup>)
    expect(screen.getByRole('tabpanel').textContent).toBe('Draft content')
  })

  test('keeps declared order when a conditional tab disappears and reappears', () => {
    const tabs = (showMiddle: boolean) => <M3TabGroup aria-label="Sections">
      <M3Tab value="first" label="First">First content</M3Tab>
      {showMiddle && <M3Tab value="middle" label="Middle">Middle content</M3Tab>}
      <M3Tab value="last" label="Last">Last content</M3Tab>
    </M3TabGroup>
    const labels = () => screen.getAllByRole('tab').map(tab => tab.textContent?.trim())
    const { rerender } = render(tabs(true))
    expect(labels()).toEqual(['First', 'Middle', 'Last'])

    rerender(tabs(false))
    expect(labels()).toEqual(['First', 'Last'])

    rerender(tabs(true))
    expect(labels()).toEqual(['First', 'Middle', 'Last'])
    fireEvent.click(screen.getByRole('tab', { name: 'Middle' }))
    expect(screen.getByRole('tabpanel').textContent).toBe('Middle content')
  })

  test('follows mapped array order through reordering, insertion, and removal', () => {
    const one = { value: 'one', label: 'One' }
    const two = { value: 'two', label: 'Two' }
    const three = { value: 'three', label: 'Three' }
    const tabs = (items: typeof one[]) => <M3TabGroup aria-label="Sections">
      <M3Tab value="first" label="First">First content</M3Tab>
      {items.map(item => <M3Tab key={item.value} value={item.value} label={item.label}>{item.label} content</M3Tab>)}
      <M3Tab value="last" label="Last">Last content</M3Tab>
    </M3TabGroup>
    const labels = () => screen.getAllByRole('tab').map(tab => tab.textContent?.trim())
    const { rerender } = render(tabs([one, two]))
    expect(labels()).toEqual(['First', 'One', 'Two', 'Last'])

    fireEvent.click(screen.getByRole('tab', { name: 'Two' }))
    rerender(tabs([two, one]))
    expect(labels()).toEqual(['First', 'Two', 'One', 'Last'])
    expect(screen.getByRole('tabpanel').textContent).toBe('Two content')

    rerender(tabs([three, two, one]))
    expect(labels()).toEqual(['First', 'Three', 'Two', 'One', 'Last'])

    rerender(tabs([two]))
    expect(labels()).toEqual(['First', 'Two', 'Last'])
    expect(screen.getByRole('tabpanel').textContent).toBe('Two content')
  })

  test('renders icon badges, custom names, and a requested initial tab', () => {
    render(<M3TabGroup id="mail-tabs" value="drafts" variant="secondary" layout="scrollable" aria-label="Folders">
      <M3Tab value="inbox" label="Inbox" icon={<span>icon</span>} badge={0} aria-label="Inbox, no unread messages">Inbox content</M3Tab>
      <M3Tab value="drafts" label="Drafts" badge="2">Draft content</M3Tab>
      <M3Tab value="trash" label="Trash" disabled>Trash content</M3Tab>
    </M3TabGroup>)

    const inbox = screen.getByRole('tab', { name: 'Inbox, no unread messages' })
    expect(inbox.querySelector('.m3-tab-group__icon .m3-badge')?.textContent).toBe('0')
    expect(screen.getByRole('tab', { name: 'Drafts' }).querySelector('.m3-tab-group__label-row .m3-badge')?.textContent).toBe('2')
    expect(screen.getByRole('tabpanel').id).toBe('mail-tabs-panel-drafts')
    expect(screen.getByRole('tablist', { name: 'Folders' })).not.toBeNull()
    expect(screen.getByRole('tab', { name: 'Trash' }).hasAttribute('disabled')).toBe(true)
    expect(screen.getByRole('tablist').parentElement?.parentElement?.classList.contains('m3-tab-group_secondary')).toBe(true)
  })

  test('renders an icon-only tab with a compact target and an accessible name', () => {
    render(<M3TabGroup aria-label="Mail folders">
      <M3Tab value="inbox" label="" icon={<span>icon</span>} aria-label="Inbox">Inbox content</M3Tab>
      <M3Tab value="drafts" label="" icon={<span>icon</span>} aria-label="Drafts">Draft content</M3Tab>
    </M3TabGroup>)

    const inbox = screen.getByRole('tab', { name: 'Inbox' })
    expect(inbox.classList.contains('m3-tab-group__tab_icon-only')).toBe(true)
    expect(inbox.querySelector('.m3-tab-group__label-row')).toBeNull()
    expect(inbox.querySelector('.m3-tab-group__icon')).not.toBeNull()
  })

  test('handles Home, End, RTL arrows, and a cancelled keyboard event', () => {
    render(<M3TabGroup dir="rtl" onKeyDown={event => {
      if (event.key === 'Home') event.preventDefault()
    }}>
      <M3Tab value="a" label="A">A panel</M3Tab>
      <M3Tab value="b" label="B">B panel</M3Tab>
      <M3Tab value="c" label="C">C panel</M3Tab>
    </M3TabGroup>)
    const a = screen.getByRole('tab', { name: 'A' })
    const b = screen.getByRole('tab', { name: 'B' })
    const c = screen.getByRole('tab', { name: 'C' })
    act(() => a.focus())
    fireEvent.keyDown(a, { key: 'ArrowLeft' })
    expect(document.activeElement).toBe(b)
    fireEvent.keyDown(b, { key: 'End' })
    expect(document.activeElement).toBe(c)
    fireEvent.keyDown(c, { key: 'Home' })
    expect(document.activeElement).toBe(c)
    fireEvent.keyDown(c, { key: 'ArrowRight' })
    expect(document.activeElement).toBe(b)
    fireEvent.keyDown(b, { key: 'ArrowLeft' })
    expect(document.activeElement).toBe(c)
  })

  test('falls back when the requested tab becomes unavailable', () => {
    const { rerender } = render(<M3TabGroup value="b">
      <M3Tab value="a" label="A">A panel</M3Tab>
      <M3Tab value="b" label="B">B panel</M3Tab>
    </M3TabGroup>)
    expect(screen.getByRole('tabpanel').textContent).toBe('B panel')
    rerender(<M3TabGroup value="b">
      <M3Tab value="a" label="A">A panel</M3Tab>
      <M3Tab value="b" label="B" disabled>B panel</M3Tab>
    </M3TabGroup>)
    expect(screen.getByRole('tabpanel').textContent).toBe('A panel')
    expect(screen.getByRole('tab', { name: 'A' }).getAttribute('tabindex')).toBe('0')
  })

  test('synchronizes query navigation with clicks, value changes, and browser history', () => {
    const original = window.location.href
    window.history.replaceState(null, '', '/mail?folder=work&tab=drafts#message')
    try {
      const onChange = vi.fn()
      const { rerender } = renderTabs({ navigation: 'query', value: 'inbox', onChange })
      expect(screen.getByRole('tabpanel').textContent).toBe('Draft content')
      expect(onChange).not.toHaveBeenCalled()

      fireEvent.click(screen.getByRole('tab', { name: 'Inbox' }))
      expect(window.location.search).toBe('?folder=work&tab=inbox')
      expect(window.location.hash).toBe('#message')
      expect(onChange).toHaveBeenCalledExactlyOnceWith('inbox')

      act(() => {
        window.history.replaceState(null, '', '/mail?folder=work&tab=drafts#message')
        window.dispatchEvent(new PopStateEvent('popstate'))
      })
      expect(screen.getByRole('tabpanel').textContent).toBe('Draft content')
      expect(onChange).toHaveBeenCalledTimes(2)

      rerender(<M3TabGroup navigation="query" value="drafts" aria-label="Sections">
        <M3Tab value="inbox" label="Inbox">Inbox content</M3Tab>
        <M3Tab value="drafts" label="Drafts">Draft content</M3Tab>
      </M3TabGroup>)
      rerender(<M3TabGroup navigation="query" value="inbox" aria-label="Sections">
        <M3Tab value="inbox" label="Inbox">Inbox content</M3Tab>
        <M3Tab value="drafts" label="Drafts">Draft content</M3Tab>
      </M3TabGroup>)
      expect(window.location.search).toBe('?folder=work&tab=inbox')
      expect(screen.getByRole('tabpanel').textContent).toBe('Inbox content')
    } finally {
      window.history.replaceState(null, '', original)
    }
  })

  test('reads a custom query key and hash navigation', () => {
    const original = window.location.href
    window.history.replaceState(null, '', '/mail?folder=drafts#inbox')
    try {
      const { unmount } = renderTabs({ navigation: 'query', queryKey: 'folder' })
      expect(screen.getByRole('tabpanel').textContent).toBe('Draft content')
      unmount()

      renderTabs({ navigation: 'hash' })
      expect(screen.getByRole('tabpanel').textContent).toBe('Inbox content')
      fireEvent.click(screen.getByRole('tab', { name: 'Drafts' }))
      expect(window.location.hash).toBe('#drafts')
      expect(window.location.search).toBe('?folder=drafts')
    } finally {
      window.history.replaceState(null, '', original)
    }
  })
})
