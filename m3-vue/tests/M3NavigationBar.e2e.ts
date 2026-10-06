import { createApp, h, nextTick } from 'vue'
import { page } from 'vitest/browser'
import { ref } from 'vue'

import { M3Navigation, M3NavigationTab } from '@/components/navigation'

const destinations = ['Inbox', 'Outbox', 'Favorites', 'Trash']

const query = <T extends Element>(selector: string) => {
  const element = document.querySelector(selector) as T | null
  if (!element) {
    throw new Error(`Element not found: ${selector}`)
  }

  return element
}

const waitFor = async (assertion: () => void) => {
  const startedAt = performance.now()

  while (performance.now() - startedAt < 2000) {
    try {
      assertion()
      return
    } catch {
      await new Promise(resolve => setTimeout(resolve, 16))
    }
  }

  assertion()
}

test('flexible bar centers its horizontal items and grows with text', async () => {
  await page.viewport(320, 800)

  const content = document.createElement('main')
  content.className = 'm3-has-navigation_bar'
  document.body.append(content)

  const mountPoint = document.createElement('div')
  document.body.append(mountPoint)

  const app = createApp({
    render: () => h(M3Navigation, { appearance: 'bar' }, {
      default: () => destinations.map((label, index) => h(M3NavigationTab, {
        label,
        active: index === 0,
      }, {
        default: () => h('span', '★'),
        ...(index === 0 ? { badge: () => '24' } : {}),
      })),
    }),
  })
  app.mount(mountPoint)

  const scaledText = document.createElement('style')

  try {
    const nav = query<HTMLElement>('nav.m3-navigation_bar')
    const icon = query<HTMLElement>('.m3-navigation-tab__icon')
    expect(nav.getBoundingClientRect().height).toBe(64)
    expect(icon.getBoundingClientRect().width).toBe(56)

    await page.viewport(700, 800)
    await waitFor(() => expect(icon.getBoundingClientRect().width).toBe(24))

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
    await waitFor(() => expect(Number.parseFloat(getComputedStyle(content).paddingBottom)).toBe(nav.getBoundingClientRect().height))
  } finally {
    scaledText.remove()
    app.unmount()
    mountPoint.remove()
    content.remove()
  }
})

test('animates from the bar height to the rail height', async () => {
  await page.viewport(700, 800)

  const appearance = ref<'bar' | 'rail'>('bar')
  const mountPoint = document.createElement('div')
  document.body.append(mountPoint)

  const app = createApp({
    render: () => h(M3Navigation, { appearance: appearance.value }, {
      default: () => h(M3NavigationTab, { label: 'Inbox' }, () => '★'),
    }),
  })
  app.mount(mountPoint)

  try {
    const nav = query<HTMLElement>('nav.m3-navigation')
    expect(nav.getBoundingClientRect().height).toBe(64)

    appearance.value = 'rail'
    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 80))

    expect(nav.getBoundingClientRect().height).toBeGreaterThan(64)
    expect(nav.getBoundingClientRect().height).toBeLessThan(800)
  } finally {
    app.unmount()
    mountPoint.remove()
  }
})

test('slides the hidden modal rail offscreen at its expanded width', async () => {
  await page.viewport(900, 800)

  const expanded = ref(true)
  const mountPoint = document.createElement('div')
  document.body.append(mountPoint)
  const app = createApp({
    render: () => h(M3Navigation, {
      appearance: 'rail',
      expanded: expanded.value,
      hideWhenCollapsed: true,
      railExpandedMode: 'modal',
    }, {
      top: () => h('button', 'Menu'),
      default: () => h(M3NavigationTab, { label: 'Inbox' }, () => '★'),
    }),
  })
  app.mount(mountPoint)

  try {
    const nav = query<HTMLElement>('nav.m3-navigation')
    const expandedWidth = nav.getBoundingClientRect().width
    expect(expandedWidth).toBe(220)

    expanded.value = false
    await nextTick()
    expect(nav.classList.contains('m3-navigation_rail-leaving')).toBe(true)
    expect(nav.getBoundingClientRect().width).toBe(expandedWidth)

    await new Promise(resolve => setTimeout(resolve, 80))
    expect(nav.getBoundingClientRect().x).toBeLessThan(0)
    expect(nav.getBoundingClientRect().width).toBe(expandedWidth)

    await waitFor(() => expect(nav.classList.contains('m3-navigation_rail-hidden')).toBe(true))
    expect(nav.getBoundingClientRect().right).toBeLessThanOrEqual(0)
    expect(nav.getBoundingClientRect().width).toBe(expandedWidth)

    document.documentElement.dir = 'rtl'
    await waitFor(() => expect(nav.getBoundingClientRect().left).toBeGreaterThanOrEqual(window.innerWidth))
  } finally {
    document.documentElement.dir = ''
    app.unmount()
    mountPoint.remove()
  }
})

test.each(['rail', 'rail-expanded'] as const)('scrolls %s destinations without moving the menu and FAB', async appearance => {
  await page.viewport(900, 320)

  const mountPoint = document.createElement('div')
  document.body.append(mountPoint)
  const app = createApp({
    render: () => h(M3Navigation, { appearance }, {
      top: () => [h('button', 'Menu'), h('button', 'FAB')],
      default: () => Array.from({ length: 7 }, (_, index) => h(M3NavigationTab, {
        label: `Destination ${index + 1}`,
      }, () => '★')),
    }),
  })
  app.mount(mountPoint)

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
    app.unmount()
    mountPoint.remove()
  }
})

test('anchors each badge to the icon and keeps vertical labels available at medium width', async () => {
  await page.viewport(700, 800)

  const barLayout = ref<'auto' | 'vertical'>('auto')
  const mountPoint = document.createElement('div')
  document.body.append(mountPoint)
  const app = createApp({
    render: () => h(M3Navigation, { appearance: 'bar', barLayout: barLayout.value }, {
      default: () => [
        h(M3NavigationTab, { label: 'Inbox', active: true }, { default: () => h('span', '★'), badge: () => '24' }),
        h(M3NavigationTab, { label: 'Outbox', badged: true }, () => h('span', '★')),
        h(M3NavigationTab, { label: 'Favorites' }, () => h('span', '★')),
      ],
    }),
  })
  app.mount(mountPoint)

  try {
    const items = [...document.querySelectorAll<HTMLElement>('.m3-navigation-tab_in-bar')]
    const largeIcon = items[0].querySelector<HTMLElement>('.m3-navigation-tab__icon')!
    const largeBadge = items[0].querySelector<HTMLElement>('.m3-navigation-tab__badge')!
    const largeLabel = items[0].querySelector<HTMLElement>('.m3-navigation-tab__state .m3-navigation-tab__label')!
    const smallIcon = items[1].querySelector<HTMLElement>('.m3-navigation-tab__icon')!
    const smallBadge = items[1].querySelector<HTMLElement>('.m3-navigation-tab__badge')!

    expect(largeBadge.getBoundingClientRect().x - largeIcon.getBoundingClientRect().x).toBe(12)
    expect(smallBadge.getBoundingClientRect().x - smallIcon.getBoundingClientRect().x).toBe(24)
    expect(smallBadge.getBoundingClientRect().width).toBe(6)
    expect(smallBadge.getBoundingClientRect().height).toBe(6)
    expect(largeLabel.getBoundingClientRect().left - largeBadge.getBoundingClientRect().right).toBeGreaterThanOrEqual(4)

    barLayout.value = 'vertical'
    await nextTick()
    await waitFor(() => expect(largeIcon.getBoundingClientRect().width).toBe(56))

    const label = items[0].querySelector<HTMLElement>('.m3-navigation-tab__state .m3-navigation-tab__label')!
    expect(label.getBoundingClientRect().top).toBeGreaterThanOrEqual(largeIcon.getBoundingClientRect().bottom)
    expect(largeBadge.getBoundingClientRect().x - largeIcon.getBoundingClientRect().x).toBe(28)
    expect(smallBadge.getBoundingClientRect().x - smallIcon.getBoundingClientRect().x).toBe(40)

    await page.getByRole('button', { name: 'Inbox' }).hover()
    expect(getComputedStyle(items[0].querySelector<HTMLElement>('.m3-navigation-tab__state')!).backgroundColor).toBe('rgba(0, 0, 0, 0)')
    expect(getComputedStyle(largeIcon).boxShadow).not.toBe('none')
  } finally {
    app.unmount()
    mountPoint.remove()
  }
})

test('keeps the bar visible without a modal drawer when an open auto navigation crosses into bar width', async () => {
  await page.viewport(900, 800)
  const mountPoint = document.createElement('div')
  document.body.append(mountPoint)

  const app = createApp({
    render: () => h(M3Navigation, { appearance: 'auto', expanded: true }, {
      default: () => h(M3NavigationTab, { label: 'Inbox' }, () => '★'),
    }),
  })
  app.mount(mountPoint)

  try {
    await waitFor(() => expect(document.querySelector('nav.m3-navigation_rail-expanded.m3-navigation_modal')).not.toBeNull())

    await page.viewport(700, 800)
    await waitFor(() => expect(query<HTMLElement>('nav.m3-navigation_bar').classList.contains('m3-navigation_modal')).toBe(false))

    expect(getComputedStyle(query<HTMLElement>('.m3-scrim')).display).toBe('none')
  } finally {
    app.unmount()
    mountPoint.remove()
  }
})

test('keeps modal drawer focus inside and restores it after dismissal', async () => {
  await page.viewport(900, 800)
  const outside = document.createElement('button')
  outside.textContent = 'Outside'
  document.body.append(outside)
  outside.focus()
  const expanded = ref(true)
  const navigationLabel = ref('Primary navigation')
  const mountPoint = document.createElement('div')
  document.body.append(mountPoint)
  const app = createApp({
    render: () => h(M3Navigation, {
      appearance: 'rail',
      expanded: expanded.value,
      'aria-label': navigationLabel.value,
      'onUpdate:expanded': (value: boolean) => expanded.value = value,
    }, {
      default: () => [
        h(M3NavigationTab, { label: 'Inbox' }, () => '★'),
        h(M3NavigationTab, { label: 'Outbox' }, () => '★'),
      ],
    }),
  })
  app.mount(mountPoint)

  try {
    const dialog = query<HTMLElement>('[role="dialog"][aria-modal="true"]')
    const buttons = [...dialog.querySelectorAll<HTMLButtonElement>('.m3-navigation-tab__button')]

    await waitFor(() => expect(outside.inert).toBe(true))
    expect(document.activeElement).toBe(buttons[0])
    expect(dialog.getAttribute('aria-label')).toBe('Primary navigation')

    navigationLabel.value = 'Destinations'
    await nextTick()
    expect(dialog.getAttribute('aria-label')).toBe('Destinations')

    buttons[1].focus()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }))
    expect(document.activeElement).toBe(buttons[0])

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }))
    await nextTick()
    expect(expanded.value).toBe(false)

    await waitFor(() => expect(outside.inert).toBe(false))
    await waitFor(() => expect(document.activeElement).toBe(outside))

    const escapeAfterDismissal = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true })
    document.dispatchEvent(escapeAfterDismissal)
    expect(escapeAfterDismissal.defaultPrevented).toBe(false)
  } finally {
    app.unmount()
    mountPoint.remove()
    outside.remove()
  }
})

test('places rail and drawer at the leading edge in RTL and keeps rail labels visible at 2x text', async () => {
  await page.viewport(900, 800)
  const previousDirection = document.documentElement.dir
  document.documentElement.dir = 'rtl'
  const content = document.createElement('main')
  content.className = 'm3-has-navigation_rail'
  document.body.append(content)
  const scaledText = document.createElement('style')
  scaledText.textContent = '.m3-navigation-tab__state .m3-navigation-tab__label { font-size: 24px !important; line-height: 32px !important; }'
  document.head.append(scaledText)
  const appearance = ref<'rail' | 'drawer'>('rail')
  const mountPoint = document.createElement('div')
  document.body.append(mountPoint)
  const app = createApp({
    render: () => h(M3Navigation, { appearance: appearance.value }, {
      default: () => [
        h(M3NavigationTab, { label: 'Favorites' }, () => '★'),
        h(M3NavigationTab, { label: 'Outbox' }, () => '★'),
      ],
    }),
  })
  app.mount(mountPoint)

  try {
    const rail = query<HTMLElement>('nav.m3-navigation_rail')
    const items = [...rail.querySelectorAll<HTMLElement>('.m3-navigation-tab')]
    const label = items[0].querySelector<HTMLElement>('.m3-navigation-tab__state .m3-navigation-tab__label')!

    expect(rail.getBoundingClientRect().right).toBe(900)
    expect(getComputedStyle(content).paddingRight).toBe('96px')
    expect(items[0].getBoundingClientRect().height).toBeGreaterThan(56)
    expect(label.scrollHeight).toBeLessThanOrEqual(label.clientHeight)
    expect(items[1].getBoundingClientRect().top).toBeGreaterThanOrEqual(items[0].getBoundingClientRect().bottom)

    content.className = 'm3-has-navigation_drawer'
    appearance.value = 'drawer'
    await nextTick()
    const drawer = query<HTMLElement>('nav.m3-navigation_drawer')
    expect(drawer.getBoundingClientRect().right).toBe(900)
    expect(getComputedStyle(drawer).borderTopLeftRadius).toBe('16px')
    await waitFor(() => expect(getComputedStyle(content).paddingRight).toBe('360px'))
  } finally {
    app.unmount()
    mountPoint.remove()
    scaledText.remove()
    content.remove()
    document.documentElement.dir = previousDirection
  }
})

test('animates the active indicator in the bar and rail', async () => {
  await page.viewport(400, 800)
  const appearance = ref<'bar' | 'rail'>('bar')
  const active = ref(0)
  const mountPoint = document.createElement('div')
  document.body.append(mountPoint)
  const app = createApp({
    render: () => h(M3Navigation, { appearance: appearance.value }, {
      default: () => [
        h(M3NavigationTab, { label: 'Inbox', active: active.value === 0 }, () => '★'),
        h(M3NavigationTab, { label: 'Outbox', active: active.value === 1 }, () => '★'),
        h(M3NavigationTab, { label: 'Favorites' }, () => '★'),
      ],
    }),
  })
  app.mount(mountPoint)

  try {
    const icon = query<HTMLElement>('.m3-navigation-tab:nth-child(2) .m3-navigation-tab__icon')
    expect(getComputedStyle(icon, '::before').transitionProperty).toContain('transform')
    expect(getComputedStyle(icon, '::before').transform).toContain('matrix(0,')

    active.value = 1
    await nextTick()
    await waitFor(() => expect(getComputedStyle(icon, '::before').transform).toContain('matrix(1,'))

    appearance.value = 'rail'
    await nextTick()
    const button = query<HTMLElement>('.m3-navigation-tab:nth-child(2) .m3-navigation-tab__button')
    expect(getComputedStyle(button, '::before').transitionProperty).toContain('transform')
    expect(getComputedStyle(button, '::before').transform).toContain('matrix(1,')
  } finally {
    app.unmount()
    mountPoint.remove()
  }
})

test('uses expressive rail geometry in standard and modal layouts', async () => {
  await page.viewport(1300, 800)
  const content = document.createElement('main')
  content.className = 'm3-has-navigation'
  document.body.append(content)
  const scaledText = document.createElement('style')
  const mountPoint = document.createElement('div')
  document.body.append(mountPoint)
  const expanded = ref(false)
  const app = createApp({
    render: () => h(M3Navigation, { appearance: 'auto', expanded: expanded.value }, {
      default: () => [
        h(M3NavigationTab, { label: 'Inbox', active: true }, {
          default: () => '★',
          badge: () => '24',
        }),
        h(M3NavigationTab, { label: 'Important destination' }, () => '★'),
      ],
    }),
  })
  app.mount(mountPoint)

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
    expect(badge.getBoundingClientRect().left).toBeGreaterThanOrEqual(label.getBoundingClientRect().right)
    expect(getComputedStyle(content).paddingLeft).toBe('220px')
    expect(document.querySelector('[aria-modal="true"]')).toBeNull()

    scaledText.textContent = '.m3-navigation-tab_in-rail-expanded .m3-navigation-tab__label { font-size: 28px !important; line-height: 36px !important; }'
    document.head.append(scaledText)
    const longItem = query<HTMLElement>('.m3-navigation-tab:nth-child(2)')
    expect(longItem.getBoundingClientRect().height).toBeGreaterThan(56)
    const longLabel = longItem.querySelector<HTMLElement>('.m3-navigation-tab__label')!
    expect(longLabel.scrollHeight).toBeLessThanOrEqual(longLabel.clientHeight)

    await page.viewport(900, 800)
    await waitFor(() => expect(query<HTMLElement>('nav.m3-navigation_rail').getBoundingClientRect().width).toBe(96))
    expect(button.getBoundingClientRect().width).toBe(96)
    expect(getComputedStyle(button, '::before').width).toBe('56px')
    expect(getComputedStyle(content).paddingLeft).toBe('96px')

    expanded.value = true
    await nextTick()
    await waitFor(() => expect(query<HTMLElement>('nav.m3-navigation_rail-expanded.m3-navigation_modal').getBoundingClientRect().width).toBe(220))
    expect(getComputedStyle(content).paddingLeft).toBe('96px')
    expect(document.querySelector('[role="dialog"][aria-modal="true"]')).not.toBeNull()
  } finally {
    scaledText.remove()
    app.unmount()
    mountPoint.remove()
    content.remove()
  }
})

test('animates standard rail expansion and resizes page content', async () => {
  await page.viewport(900, 800)
  const content = document.createElement('main')
  content.className = 'm3-has-navigation_rail'
  document.body.append(content)
  const mountPoint = document.createElement('div')
  document.body.append(mountPoint)
  const expanded = ref(false)
  const app = createApp({
    render: () => h(M3Navigation, { appearance: 'rail', expanded: expanded.value, railExpandedMode: 'standard' }, {
      default: () => h(M3NavigationTab, { label: 'Inbox' }, () => '★'),
    }),
  })
  app.mount(mountPoint)

  try {
    const nav = query<HTMLElement>('nav.m3-navigation')
    expect(nav.getBoundingClientRect().width).toBe(96)
    expanded.value = true
    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 80))
    expect(nav.getBoundingClientRect().width).toBeGreaterThan(96)
    expect(nav.getBoundingClientRect().width).toBeLessThan(220)
    await waitFor(() => expect(nav.getBoundingClientRect().width).toBe(220))
    expect(getComputedStyle(content).paddingLeft).toBe('220px')
    expect(document.querySelector('[aria-modal="true"]')).toBeNull()
  } finally {
    app.unmount()
    mountPoint.remove()
    content.remove()
  }
})
