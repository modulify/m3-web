import { act } from '@testing-library/react'
import { page } from 'vitest/browser'
import { render, waitFor } from '@testing-library/react'

import { M3Icon } from '@/components/icon'
import { M3Tab, M3TabGroup } from '@/components/tabs'

test('tab variants keep spec heights and indicator geometry', async () => {
  await page.viewport(600, 400)

  const tabs = (variant: 'primary' | 'secondary', label: string, icon: boolean) => <div style={{ width: 360 }}>
    <M3TabGroup variant={variant} aria-label="Folders">
      <M3Tab value="inbox" label={label} icon={icon ? <M3Icon name="inbox" /> : undefined} aria-label="Inbox">Inbox content</M3Tab>
      <M3Tab value="drafts" label={label} icon={icon ? <M3Icon name="drafts" /> : undefined} aria-label="Drafts">Draft content</M3Tab>
    </M3TabGroup>
  </div>

  const view = render(tabs('primary', 'Inbox', false))

  try {
    const track = view.container.querySelector<HTMLElement>('.m3-tab-group__track')!
    const tab = track.querySelector<HTMLButtonElement>('[role="tab"]')!
    const indicator = track.querySelector<HTMLElement>('.m3-tab-group__indicator')!

    expect(track.getBoundingClientRect().height).toBe(48)
    expect(tab.getBoundingClientRect().height).toBe(48)
    expect(getComputedStyle(track, '::after').height).toBe('1px')
    expect(indicator.getBoundingClientRect().height).toBe(3)
    const label = tab.querySelector<HTMLElement>('.m3-tab-group__label-row')!
    await waitFor(() => expect(indicator.getBoundingClientRect().width).toBeCloseTo(Math.max(24, label.getBoundingClientRect().width - 4), 0))

    view.rerender(tabs('primary', 'Inbox', true))
    expect(track.getBoundingClientRect().height).toBe(64)
    expect(tab.getBoundingClientRect().height).toBe(64)

    view.rerender(tabs('primary', '', true))
    expect(track.getBoundingClientRect().height).toBe(48)
    expect(tab.getBoundingClientRect().height).toBe(48)
    await waitFor(() => expect(indicator.getBoundingClientRect().width).toBeCloseTo(24, 0))

    view.rerender(tabs('secondary', '', true))
    expect(indicator.getBoundingClientRect().height).toBe(2)
    await waitFor(() => expect(indicator.getBoundingClientRect().width).toBeCloseTo(tab.getBoundingClientRect().width, 0))
  } finally {
    view.unmount()
  }
})

test('query navigation restores the selected tab with browser Back', async () => {
  const original = window.location.href
  const start = new URL(original)
  start.searchParams.set('section', 'drafts')
  window.history.replaceState(null, '', start)
  const view = render(<M3TabGroup navigation="query" queryKey="section">
    <M3Tab value="inbox" label="Inbox">Inbox content</M3Tab>
    <M3Tab value="drafts" label="Drafts">Draft content</M3Tab>
  </M3TabGroup>)

  try {
    await waitFor(() => expect(view.getByRole('tabpanel').textContent).toBe('Draft content'))
    act(() => view.getByRole('tab', { name: 'Inbox' }).click())
    await waitFor(() => expect(new URL(window.location.href).searchParams.get('section')).toBe('inbox'))
    await act(async () => {
      const returned = new Promise<void>(resolve => window.addEventListener('popstate', () => resolve(), { once: true }))
      window.history.back()
      await returned
    })
    await waitFor(() => expect(view.getByRole('tabpanel').textContent).toBe('Draft content'))
  } finally {
    view.unmount()
    window.history.replaceState(null, '', original)
  }
})
