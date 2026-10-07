import { act } from '@testing-library/react'
import { page } from 'vitest/browser'
import { render, waitFor } from '@testing-library/react'

import { M3Navigation, M3NavigationTab } from '@/components/navigation'
import { M3SnackbarHost } from '@/components/snackbar'

const destinations = ['Inbox', 'Outbox', 'Favorites', 'Trash']

const query = <T extends Element>(selector: string) => {
  const element = document.querySelector(selector) as T | null
  if (!element) {
    throw new Error(`Element not found: ${selector}`)
  }

  return element
}

test('flexible bar centers its horizontal items and grows with text', async () => {
  await page.viewport(320, 800)

  const content = document.createElement('main')
  content.className = 'm3-has-navigation'
  document.body.append(content)
  const hostView = render(<M3SnackbarHost />, { container: content })

  const view = render(
    <M3Navigation appearance="bar">
      {destinations.map((label, index) => (
        <M3NavigationTab key={label} label={label} active={index === 0}>
          <span>★</span>
          {index === 0 ? <M3NavigationTab.Badge>24</M3NavigationTab.Badge> : null}
        </M3NavigationTab>
      ))}
    </M3Navigation>
  )

  const scaledText = document.createElement('style')

  try {
    const nav = query<HTMLElement>('nav.m3-navigation_bar')
    const host = query<HTMLElement>('.m3-snackbar-host')
    const icon = query<HTMLElement>('.m3-navigation-tab__icon')
    expect(nav.getBoundingClientRect().height).toBe(64)
    expect(icon.getBoundingClientRect().width).toBe(56)
    expect(getComputedStyle(host).left).toBe('16px')
    expect(getComputedStyle(host).bottom).toBe('80px')

    await act(async () => { await page.viewport(700, 800) })
    await waitFor(() => expect(icon.getBoundingClientRect().width).toBe(24))
    expect(getComputedStyle(host).left).toBe('24px')

    const section = query<HTMLElement>('.m3-navigation__section')
    const button = query<HTMLElement>('.m3-navigation-tab__button')
    const badge = query<HTMLElement>('.m3-navigation-tab__badge')
    const sectionRect = section.getBoundingClientRect()
    const buttonRect = button.getBoundingClientRect()
    const iconRect = icon.getBoundingClientRect()
    const badgeRect = badge.getBoundingClientRect()

    expect(sectionRect.width).toBe(480)
    expect(sectionRect.x).toBe(110)
    expect(buttonRect.y - nav.getBoundingClientRect().y).toBe(12)
    expect(buttonRect.height).toBe(40)
    expect(badgeRect.x).toBeGreaterThan(iconRect.x)
    expect(badgeRect.y).toBeLessThan(iconRect.y)

    scaledText.textContent = '.m3-navigation-tab__label { font-size: 24px !important; line-height: 32px !important; }'
    document.head.append(scaledText)

    await waitFor(() => expect(nav.getBoundingClientRect().height).toBeGreaterThan(64))
    await waitFor(() => expect(Number.parseFloat(getComputedStyle(content).paddingBottom)).toBeCloseTo(nav.getBoundingClientRect().height, 0))

    await act(async () => { await page.viewport(1300, 800) })
    await waitFor(() => expect(getComputedStyle(content).paddingLeft).toBe('0px'))
    expect(Number.parseFloat(getComputedStyle(host).bottom)).toBeCloseTo(nav.getBoundingClientRect().height + 16, 0)
  } finally {
    scaledText.remove()
    view.unmount()
    hostView.unmount()
    content.remove()
  }
})

test('animates from the bar height to the rail height', async () => {
  await page.viewport(700, 800)

  const view = render(<M3Navigation appearance="bar"><M3NavigationTab label="Inbox">★</M3NavigationTab></M3Navigation>)

  try {
    const nav = query<HTMLElement>('nav.m3-navigation')
    expect(nav.getBoundingClientRect().height).toBe(64)
    const transitionProperties = new Set<string>()
    nav.addEventListener('transitionrun', event => {
      if (event.target === nav) transitionProperties.add(event.propertyName)
    })

    view.rerender(<M3Navigation appearance="rail"><M3NavigationTab label="Inbox">★</M3NavigationTab></M3Navigation>)
    await waitFor(() => expect([...transitionProperties]).toContain('height'), { timeout: 2000 })
    await waitFor(() => expect(nav.getBoundingClientRect().height).toBe(800), { timeout: 2000 })
  } finally {
    view.unmount()
  }
})

test('slides the hidden modal rail offscreen at its expanded width', async () => {
  await page.viewport(900, 800)

  const navigation = (expanded: boolean) => (
    <M3Navigation appearance="rail" expanded={expanded} railExpandedMode="modal" hideWhenCollapsed>
      <M3Navigation.Top><button type="button">Menu</button></M3Navigation.Top>
      <M3NavigationTab label="Inbox">★</M3NavigationTab>
    </M3Navigation>
  )
  const view = render(navigation(true))

  try {
    const nav = query<HTMLElement>('nav.m3-navigation')
    const expandedWidth = nav.getBoundingClientRect().width
    expect(expandedWidth).toBe(220)
    const transitionProperties = new Set<string>()
    nav.addEventListener('transitionrun', event => {
      if (event.target === nav) transitionProperties.add(event.propertyName)
    })

    view.rerender(navigation(false))
    expect(nav.classList.contains('m3-navigation_rail-leaving')).toBe(true)
    expect(nav.getBoundingClientRect().width).toBe(expandedWidth)

    await waitFor(() => expect([...transitionProperties]).toContain('transform'), { timeout: 2000 })
    await waitFor(() => expect(nav.getBoundingClientRect().x).toBeLessThan(0), { timeout: 2000 })
    expect(nav.getBoundingClientRect().width).toBe(expandedWidth)

    await waitFor(() => expect(nav.classList.contains('m3-navigation_rail-hidden')).toBe(true), { timeout: 2000 })
    expect(nav.getBoundingClientRect().right).toBeLessThanOrEqual(0)
    expect(nav.getBoundingClientRect().width).toBe(expandedWidth)

    document.documentElement.dir = 'rtl'
    await waitFor(() => expect(nav.getBoundingClientRect().left).toBeGreaterThanOrEqual(window.innerWidth))
  } finally {
    document.documentElement.dir = ''
    view.unmount()
  }
})

test.each(['rail', 'rail-expanded'] as const)('scrolls %s destinations without moving the menu and FAB', async appearance => {
  await page.viewport(900, 320)

  const view = render(
    <M3Navigation appearance={appearance}>
      <M3Navigation.Top>
        <button type="button">Menu</button>
        <button type="button">FAB</button>
      </M3Navigation.Top>
      {Array.from({ length: 7 }, (_, index) => (
        <M3NavigationTab key={index} label={`Destination ${index + 1}`}>★</M3NavigationTab>
      ))}
    </M3Navigation>
  )

  try {
    const nav = query<HTMLElement>('nav.m3-navigation')
    const top = query<HTMLElement>('.m3-navigation__top')
    const body = query<HTMLElement>('.m3-navigation__body')
    const first = query<HTMLElement>('.m3-navigation-tab:first-child')
    const last = query<HTMLElement>('.m3-navigation-tab:last-child')
    const topY = top.getBoundingClientRect().y
    const firstY = first.getBoundingClientRect().y

    expect(body.scrollHeight).toBeGreaterThan(body.clientHeight)
    expect(getComputedStyle(body).overflowY).toBe('auto')
    expect(getComputedStyle(body, '::-webkit-scrollbar').width).toBe('12px')

    body.scrollTop = body.scrollHeight

    expect(body.scrollTop).toBeGreaterThan(0)
    expect(nav.scrollTop).toBe(0)
    expect(top.getBoundingClientRect().y).toBe(topY)
    expect(first.getBoundingClientRect().y).toBeLessThan(firstY)
    expect(last.getBoundingClientRect().bottom).toBeLessThanOrEqual(body.getBoundingClientRect().bottom)
  } finally {
    view.unmount()
  }
})

test('anchors each badge to the icon and keeps vertical labels available at medium width', async () => {
  await page.viewport(700, 800)

  const tabs = (barLayout: 'auto' | 'vertical') => (
    <M3Navigation appearance="bar" barLayout={barLayout}>
      <M3NavigationTab label="Inbox" active><span>★</span><M3NavigationTab.Badge>24</M3NavigationTab.Badge></M3NavigationTab>
      <M3NavigationTab label="Outbox" badged><span>★</span></M3NavigationTab>
      <M3NavigationTab label="Favorites"><span>★</span></M3NavigationTab>
    </M3Navigation>
  )
  const view = render(tabs('auto'))

  try {
    const items = [...document.querySelectorAll<HTMLElement>('.m3-navigation-tab_in-bar')]
    const largeIcon = query<HTMLElement>('.m3-navigation-tab:first-child .m3-navigation-tab__icon')
    const largeBadge = query<HTMLElement>('.m3-navigation-tab:first-child .m3-navigation-tab__badge')
    const largeLabel = items[0].querySelector<HTMLElement>('.m3-navigation-tab__state .m3-navigation-tab__label')!
    const smallIcon = items[1].querySelector<HTMLElement>('.m3-navigation-tab__icon')!
    const smallBadge = items[1].querySelector<HTMLElement>('.m3-navigation-tab__badge')!

    expect(largeBadge.getBoundingClientRect().x - largeIcon.getBoundingClientRect().x).toBe(12)
    expect(smallBadge.getBoundingClientRect().x - smallIcon.getBoundingClientRect().x).toBe(24)
    expect(smallBadge.getBoundingClientRect().width).toBe(6)
    expect(smallBadge.getBoundingClientRect().height).toBe(6)
    expect(largeLabel.getBoundingClientRect().left - largeBadge.getBoundingClientRect().right).toBeGreaterThanOrEqual(4)

    view.rerender(tabs('vertical'))
    await waitFor(() => expect(largeIcon.getBoundingClientRect().width).toBe(56))

    const label = items[0].querySelector<HTMLElement>('.m3-navigation-tab__state .m3-navigation-tab__label')!
    expect(label.getBoundingClientRect().top).toBeGreaterThanOrEqual(largeIcon.getBoundingClientRect().bottom)
    expect(largeBadge.getBoundingClientRect().x - largeIcon.getBoundingClientRect().x).toBe(28)
    expect(smallBadge.getBoundingClientRect().x - smallIcon.getBoundingClientRect().x).toBe(40)

    await page.getByRole('button', { name: 'Inbox' }).hover()
    expect(getComputedStyle(items[0].querySelector<HTMLElement>('.m3-navigation-tab__state')!).backgroundColor).toBe('rgba(0, 0, 0, 0)')
    expect(getComputedStyle(largeIcon).boxShadow).not.toBe('none')
  } finally {
    view.unmount()
  }
})

test('keeps the bar visible without a modal drawer when an open auto navigation crosses into bar width', async () => {
  await page.viewport(900, 800)
  const view = render(<M3Navigation appearance="auto" expanded><M3NavigationTab label="Inbox">★</M3NavigationTab></M3Navigation>)

  try {
    await waitFor(() => expect(document.querySelector('nav.m3-navigation_rail-expanded.m3-navigation_modal')).not.toBeNull())

    await act(async () => { await page.viewport(700, 800) })
    await waitFor(() => expect(query<HTMLElement>('nav.m3-navigation_bar').classList.contains('m3-navigation_modal')).toBe(false))

    expect(getComputedStyle(query<HTMLElement>('.m3-scrim')).display).toBe('none')
  } finally {
    view.unmount()
  }
})

test('keeps modal drawer focus inside and restores it after dismissal', async () => {
  await page.viewport(900, 800)
  const outside = document.createElement('button')
  outside.textContent = 'Outside'
  document.body.append(outside)
  outside.focus()
  expect(document.activeElement).toBe(outside)
  const onToggle = vi.fn()
  const tabs = (expanded: boolean) => (
    <M3Navigation appearance="rail" expanded={expanded} onToggle={onToggle}>
      <M3NavigationTab label="Inbox">★</M3NavigationTab>
      <M3NavigationTab label="Outbox">★</M3NavigationTab>
    </M3Navigation>
  )
  const view = render(tabs(true))

  try {
    const dialog = query<HTMLElement>('[role="dialog"][aria-modal="true"]')
    const buttons = [...dialog.querySelectorAll<HTMLButtonElement>('.m3-navigation-tab__button')]

    expect(outside.inert).toBe(true)
    expect(document.activeElement).toBe(buttons[0])

    buttons[1].focus()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }))
    expect(document.activeElement).toBe(buttons[0])

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }))
    expect(onToggle).toHaveBeenCalledWith(false)
    view.rerender(tabs(false))

    await waitFor(() => expect(outside.inert).toBe(false))
    await waitFor(() => expect(document.activeElement).toBe(outside))

    const escapeAfterDismissal = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true })
    document.dispatchEvent(escapeAfterDismissal)
    expect(escapeAfterDismissal.defaultPrevented).toBe(false)
  } finally {
    view.unmount()
    outside.remove()
  }
})

test('places rail and drawer at the leading edge in RTL and keeps rail labels visible at 2x text', async () => {
  await page.viewport(900, 800)
  const previousDirection = document.documentElement.dir
  document.documentElement.dir = 'rtl'
  const content = document.createElement('main')
  content.className = 'm3-has-navigation'
  document.body.append(content)
  const hostView = render(<M3SnackbarHost />, { container: content })
  const scaledText = document.createElement('style')
  scaledText.textContent = '.m3-navigation-tab__state .m3-navigation-tab__label { font-size: 24px !important; line-height: 32px !important; }'
  document.head.append(scaledText)
  const tabs = (appearance: 'rail' | 'drawer') => (
    <M3Navigation appearance={appearance}>
      <M3NavigationTab label="Favorites">★</M3NavigationTab>
      <M3NavigationTab label="Outbox">★</M3NavigationTab>
    </M3Navigation>
  )
  const view = render(tabs('rail'))

  try {
    const rail = query<HTMLElement>('nav.m3-navigation_rail')
    const host = query<HTMLElement>('.m3-snackbar-host')
    const items = [...rail.querySelectorAll<HTMLElement>('.m3-navigation-tab')]
    const label = items[0].querySelector<HTMLElement>('.m3-navigation-tab__state .m3-navigation-tab__label')!

    expect(rail.getBoundingClientRect().right).toBe(900)
    expect(getComputedStyle(content).paddingRight).toBe('96px')
    expect(getComputedStyle(host).right).toBe('120px')
    expect(items[0].getBoundingClientRect().height).toBeGreaterThan(56)
    expect(label.scrollHeight).toBeLessThanOrEqual(label.clientHeight)
    expect(items[1].getBoundingClientRect().top).toBeGreaterThanOrEqual(items[0].getBoundingClientRect().bottom)

    view.rerender(tabs('drawer'))
    const drawer = query<HTMLElement>('nav.m3-navigation_drawer')
    expect(drawer.getBoundingClientRect().right).toBe(900)
    expect(getComputedStyle(drawer).borderTopLeftRadius).toBe('16px')
    await waitFor(() => expect(getComputedStyle(content).paddingRight).toBe('360px'))
    expect(getComputedStyle(host).right).toBe('384px')
  } finally {
    view.unmount()
    hostView.unmount()
    scaledText.remove()
    content.remove()
    document.documentElement.dir = previousDirection
  }
})

test('animates the active indicator in the bar and rail', async () => {
  await page.viewport(400, 800)
  const tabs = (appearance: 'bar' | 'rail', active: number) => (
    <M3Navigation appearance={appearance}>
      <M3NavigationTab label="Inbox" active={active === 0}>★</M3NavigationTab>
      <M3NavigationTab label="Outbox" active={active === 1}>★</M3NavigationTab>
      <M3NavigationTab label="Favorites">★</M3NavigationTab>
    </M3Navigation>
  )
  const view = render(tabs('bar', 0))

  try {
    const icon = query<HTMLElement>('.m3-navigation-tab:nth-child(2) .m3-navigation-tab__icon')
    expect(getComputedStyle(icon, '::before').transitionProperty).toContain('transform')
    expect(getComputedStyle(icon, '::before').transform).toContain('matrix(0,')

    view.rerender(tabs('bar', 1))
    await waitFor(() => expect(getComputedStyle(icon, '::before').transform).toContain('matrix(1,'))

    view.rerender(tabs('rail', 1))
    const button = query<HTMLElement>('.m3-navigation-tab:nth-child(2) .m3-navigation-tab__button')
    expect(getComputedStyle(button, '::before').transitionProperty).toContain('transform')
    expect(getComputedStyle(button, '::before').transform).toContain('matrix(1,')
  } finally {
    view.unmount()
  }
})

test('uses expressive rail geometry and keeps the whole expanded row interactive', async () => {
  await page.viewport(1300, 800)
  const content = document.createElement('main')
  content.className = 'm3-has-navigation'
  document.body.append(content)
  const scaledText = document.createElement('style')
  const onNavigate = vi.fn()
  const view = render(
    <M3Navigation appearance="auto">
      <M3NavigationTab label="Inbox" active onNavigate={onNavigate}>
        ★<M3NavigationTab.Badge>24</M3NavigationTab.Badge>
      </M3NavigationTab>
      <M3NavigationTab label="Important destination">★</M3NavigationTab>
    </M3Navigation>
  )

  try {
    await waitFor(() => expect(document.querySelector('nav.m3-navigation_rail-expanded')).not.toBeNull())
    const nav = query<HTMLElement>('nav.m3-navigation_rail-expanded')
    const button = query<HTMLElement>('.m3-navigation-tab__button')
    const state = query<HTMLElement>('.m3-navigation-tab__state')
    const badge = query<HTMLElement>('.m3-navigation-tab__badge')
    const label = query<HTMLElement>('.m3-navigation-tab__label')

    await waitFor(() => expect(nav.getBoundingClientRect().width).toBe(220))
    expect(button.getBoundingClientRect().width).toBe(220)
    expect(state.getBoundingClientRect().width).toBeLessThan(button.getBoundingClientRect().width)
    expect(state.getBoundingClientRect().height).toBeGreaterThanOrEqual(56)
    expect(badge.getBoundingClientRect().left).toBeGreaterThanOrEqual(label.getBoundingClientRect().right)
    expect(getComputedStyle(content).paddingLeft).toBe('220px')
    expect(document.querySelector('[aria-modal="true"]')).toBeNull()

    button.click()
    expect(onNavigate).toHaveBeenCalledTimes(1)

    scaledText.textContent = '.m3-navigation-tab_in-rail-expanded .m3-navigation-tab__label { font-size: 28px !important; line-height: 36px !important; }'
    document.head.append(scaledText)
    const longItem = query<HTMLElement>('.m3-navigation-tab:nth-child(2)')
    expect(longItem.getBoundingClientRect().height).toBeGreaterThan(56)
    const longLabel = longItem.querySelector<HTMLElement>('.m3-navigation-tab__label')!
    expect(longLabel.scrollHeight).toBeLessThanOrEqual(longLabel.clientHeight)

    await act(async () => { await page.viewport(900, 800) })
    await waitFor(() => expect(query<HTMLElement>('nav.m3-navigation_rail').getBoundingClientRect().width).toBe(96))
    expect(button.getBoundingClientRect().width).toBe(96)
    expect(getComputedStyle(button, '::before').width).toBe('56px')
    expect(getComputedStyle(button, '::before').height).toBe('32px')
    expect(getComputedStyle(content).paddingLeft).toBe('96px')
  } finally {
    scaledText.remove()
    view.unmount()
    content.remove()
  }
})

test('uses a scrim only for modal rail expansion and leaves page inset at collapsed width', async () => {
  await page.viewport(900, 800)
  const content = document.createElement('main')
  content.className = 'm3-has-navigation'
  document.body.append(content)
  const view = render(
    <M3Navigation appearance="rail" railExpandedMode="modal" expanded>
      <M3NavigationTab label="Inbox">★</M3NavigationTab>
    </M3Navigation>
  )

  try {
    const nav = query<HTMLElement>('nav.m3-navigation_rail-expanded.m3-navigation_modal')
    expect(nav.getBoundingClientRect().width).toBe(220)
    expect(getComputedStyle(query<HTMLElement>('.m3-scrim')).display).not.toBe('none')
    expect(getComputedStyle(content).paddingLeft).toBe('96px')
    expect(document.querySelector('[role="dialog"][aria-modal="true"]')).not.toBeNull()
    expect(content.inert).toBe(true)
  } finally {
    view.unmount()
    content.remove()
  }
})

test('animates a standard rail expansion and resizes page content', async () => {
  await page.viewport(900, 800)
  const content = document.createElement('main')
  content.className = 'm3-has-navigation'
  document.body.append(content)
  const hostView = render(<M3SnackbarHost />, { container: content })
  const renderRail = (expanded: boolean) => (
    <M3Navigation appearance="rail" expanded={expanded} railExpandedMode="standard">
      <M3NavigationTab label="Inbox">★</M3NavigationTab>
    </M3Navigation>
  )
  const view = render(renderRail(false))

  try {
    const nav = query<HTMLElement>('nav.m3-navigation')
    const host = query<HTMLElement>('.m3-snackbar-host')
    expect(nav.getBoundingClientRect().width).toBe(96)
    expect(getComputedStyle(host).left).toBe('120px')
    expect(getComputedStyle(host).bottom).toBe('24px')
    const transitionProperties = new Set<string>()
    nav.addEventListener('transitionrun', event => {
      if (event.target === nav) transitionProperties.add(event.propertyName)
    })

    view.rerender(renderRail(true))
    await waitFor(() => expect([...transitionProperties]).toContain('width'), { timeout: 2000 })
    await waitFor(() => expect(nav.getBoundingClientRect().width).toBe(220), { timeout: 2000 })
    expect(getComputedStyle(content).paddingLeft).toBe('220px')
    expect(getComputedStyle(host).left).toBe('244px')
    expect(document.querySelector('[aria-modal="true"]')).toBeNull()
  } finally {
    view.unmount()
    hostView.unmount()
    content.remove()
  }
})

test('hides an immersive collapsed rail while keeping an external menu trigger available', async () => {
  await page.viewport(900, 800)
  const trigger = document.createElement('button')
  trigger.textContent = 'Open menu'
  const content = document.createElement('main')
  content.className = 'm3-has-navigation'
  document.body.append(trigger, content)
  const hostView = render(<M3SnackbarHost />, { container: content })
  trigger.focus()
  const renderRail = (expanded: boolean) => (
    <M3Navigation appearance="rail" expanded={expanded} hideWhenCollapsed>
      <M3NavigationTab label="Inbox">★</M3NavigationTab>
    </M3Navigation>
  )
  const view = render(renderRail(false))

  try {
    const nav = query<HTMLElement>('nav.m3-navigation')
    const host = query<HTMLElement>('.m3-snackbar-host')
    await waitFor(() => expect(nav.getBoundingClientRect().right).toBeLessThanOrEqual(0))
    expect(nav.inert).toBe(true)
    await waitFor(() => expect(getComputedStyle(content).paddingLeft).toBe('0px'), { timeout: 2000 })
    expect(getComputedStyle(host).left).toBe('24px')
    expect(getComputedStyle(host).bottom).toBe('24px')
    expect(trigger.inert).toBe(false)

    view.rerender(renderRail(true))
    await waitFor(() => expect(nav.getBoundingClientRect().x).toBe(0))
    expect(nav.classList.contains('m3-navigation_modal')).toBe(true)
    expect(getComputedStyle(content).paddingLeft).toBe('0px')
    expect(getComputedStyle(host).left).toBe('24px')
    expect(trigger.inert).toBe(true)

    view.rerender(renderRail(false))
    await waitFor(() => expect(nav.getBoundingClientRect().right).toBeLessThanOrEqual(0))
    await waitFor(() => expect(trigger.inert).toBe(false))

    await act(async () => { await page.viewport(500, 800) })
    expect(getComputedStyle(content).paddingLeft).toBe('0px')
    expect(getComputedStyle(host).left).toBe('24px')
    expect(getComputedStyle(host).bottom).toBe('24px')
  } finally {
    view.unmount()
    hostView.unmount()
    trigger.remove()
    content.remove()
  }
})
