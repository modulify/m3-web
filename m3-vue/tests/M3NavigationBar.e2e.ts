import { createApp, h, nextTick } from 'vue'
import { page } from 'vitest/browser'
import { ref } from 'vue'

import { M3Adaptive } from '@/components/adaptive'
import { M3FabButton } from '@/components/fab-button'
import { M3Icon } from '@/components/icon'
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

test('flexible bar centers its horizontal items and keeps its geometry with larger text', async () => {
  await page.viewport(320, 800)

  const content = document.createElement('main')
  content.className = 'm3-has-navigation'
  document.body.append(content)
  const hostMountPoint = document.createElement('div')
  content.append(hostMountPoint)
  const hostApp = createApp(M3SnackbarHost)
  hostApp.mount(hostMountPoint)

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
    const host = query<HTMLElement>('.m3-snackbar-host')
    const icon = query<HTMLElement>('.m3-navigation-tab__icon')
    expect(nav.getBoundingClientRect().height).toBe(64)
    expect(icon.getBoundingClientRect().width).toBe(56)
    expect(getComputedStyle(host).left).toBe('16px')
    expect(getComputedStyle(host).bottom).toBe('80px')

    await page.viewport(700, 800)
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

    await waitFor(() => expect(getComputedStyle(query<HTMLElement>('.m3-navigation-tab__label')).fontSize).toBe('24px'))
    expect(nav.getBoundingClientRect().height).toBe(64)
    await waitFor(() => expect(Number.parseFloat(getComputedStyle(content).paddingBottom)).toBeCloseTo(nav.getBoundingClientRect().height, 0))

    await page.viewport(1300, 800)
    await waitFor(() => expect(getComputedStyle(content).paddingLeft).toBe('0px'))
    expect(Number.parseFloat(getComputedStyle(host).bottom)).toBeCloseTo(nav.getBoundingClientRect().height + 16, 0)
  } finally {
    scaledText.remove()
    app.unmount()
    mountPoint.remove()
    hostApp.unmount()
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
    const transitionProperties = new Set<string>()
    nav.addEventListener('transitionrun', event => {
      if (event.target === nav) transitionProperties.add(event.propertyName)
    })

    appearance.value = 'rail'
    await nextTick()
    await waitFor(() => expect([...transitionProperties]).toContain('height'))
    await waitFor(() => expect(nav.getBoundingClientRect().height).toBe(800))
  } finally {
    app.unmount()
    mountPoint.remove()
  }
})

test('slides the hidden modal rail offscreen at its expanded width', async () => {
  await page.viewport(900, 800)

  const content = document.createElement('main')
  content.className = 'm3-has-navigation'
  const hostMountPoint = document.createElement('div')
  content.append(hostMountPoint)
  document.body.append(content)
  const hostApp = createApp(M3SnackbarHost)
  hostApp.mount(hostMountPoint)
  const expanded = ref(true)
  const mountPoint = document.createElement('div')
  document.body.append(mountPoint)
  const app = createApp({
    render: () => h(M3Navigation, {
      appearance: 'rail',
      expanded: expanded.value,
      collapse: 'hidden',
      expansion: 'modal',
    }, {
      top: () => h('button', 'Menu'),
      default: () => h(M3NavigationTab, { label: 'Inbox' }, () => '★'),
    }),
  })
  app.mount(mountPoint)

  try {
    const nav = query<HTMLElement>('nav.m3-navigation')
    const host = query<HTMLElement>('.m3-snackbar-host')
    const expandedWidth = nav.getBoundingClientRect().width
    expect(expandedWidth).toBe(220)
    await waitFor(() => expect(getComputedStyle(content).paddingLeft).toBe('0px'))
    expect(getComputedStyle(host).left).toBe('24px')
    expect(getComputedStyle(host).bottom).toBe('24px')
    const transitionProperties = new Set<string>()
    nav.addEventListener('transitionrun', event => {
      if (event.target === nav) transitionProperties.add(event.propertyName)
    })

    expanded.value = false
    await nextTick()
    expect(nav.classList.contains('m3-navigation_rail-leaving')).toBe(true)
    expect(nav.getBoundingClientRect().width).toBe(expandedWidth)

    await waitFor(() => expect([...transitionProperties]).toContain('transform'))
    await waitFor(() => expect(nav.getBoundingClientRect().x).toBeLessThan(0))
    expect(nav.getBoundingClientRect().width).toBe(expandedWidth)

    await waitFor(() => expect(nav.classList.contains('m3-navigation_rail-hidden')).toBe(true))
    expect(nav.getBoundingClientRect().right).toBeLessThanOrEqual(0)
    expect(nav.getBoundingClientRect().width).toBe(expandedWidth)
    expect([...transitionProperties]).toEqual(['transform'])
    expect(getComputedStyle(host).left).toBe('24px')

    await page.viewport(500, 800)
    expect(getComputedStyle(content).paddingLeft).toBe('0px')
    expect(getComputedStyle(host).left).toBe('24px')
    expect(getComputedStyle(host).bottom).toBe('24px')

    document.documentElement.dir = 'rtl'
    await waitFor(() => expect(nav.getBoundingClientRect().left).toBeGreaterThanOrEqual(window.innerWidth))
  } finally {
    document.documentElement.dir = ''
    app.unmount()
    mountPoint.remove()
    hostApp.unmount()
    content.remove()
  }
})

test('keeps the rail FAB icon anchored while revealing its label', async () => {
  await page.viewport(1280, 800)

  const appearance = ref<'rail' | 'rail-expanded'>('rail')
  const label = ref('Compose')
  const mountPoint = document.createElement('div')
  document.body.append(mountPoint)
  const app = createApp({
    render: () => h(M3Navigation, { appearance: appearance.value }, {
      top: () => h(M3FabButton, { variant: 'tertiary' }, {
        default: () => [h(M3Icon, { name: 'edit' }), label.value],
      }),
      default: () => h(M3NavigationTab, { label: 'Inbox' }, () => '★'),
    }),
  })
  app.mount(mountPoint)

  try {
    const fab = query<HTMLElement>('.m3-navigation .m3-fab-button')
    const icon = query<HTMLElement>('.m3-navigation .m3-fab-button__icon')
    const text = query<HTMLElement>('.m3-navigation .m3-fab-button__text')
    const iconX = icon.getBoundingClientRect().x

    const sample = async () => {
      const start = performance.now()
      let middleOpacity = false
      while (performance.now() - start < 550) {
        await new Promise<void>(resolve => requestAnimationFrame(() => resolve()))
        expect(fab.getBoundingClientRect().width).toBeGreaterThanOrEqual(55.5)
        expect(Math.abs(icon.getBoundingClientRect().x - iconX)).toBeLessThan(1)
        const opacity = Number.parseFloat(getComputedStyle(text).opacity)
        middleOpacity ||= opacity > 0.05 && opacity < 0.95
      }
      expect(middleOpacity).toBe(true)
    }

    appearance.value = 'rail-expanded'
    await nextTick()
    await sample()
    expect(getComputedStyle(text).opacity).toBe('1')
    label.value = 'Compose an exceptionally long message'
    await nextTick()
    expect(fab.getBoundingClientRect().height).toBe(56)
    expect(text.scrollWidth).toBeGreaterThan(text.clientWidth)

    appearance.value = 'rail'
    await nextTick()
    await sample()
    expect(getComputedStyle(text).opacity).toBe('0')
  } finally {
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

  const appearance = ref<'bar' | 'bar-vertical'>('bar')
  const mountPoint = document.createElement('div')
  document.body.append(mountPoint)
  const app = createApp({
    render: () => h(M3Navigation, { appearance: appearance.value }, {
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

    appearance.value = 'bar-vertical'
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

test('keeps long bar labels on one line with an ellipsis and resolves breakpoint labels', async () => {
  await page.viewport(700, 800)

  const mediumLabel = ref('Входящие сообщения')
  const mountPoint = document.createElement('div')
  document.body.append(mountPoint)
  const app = createApp({
    render: () => h(M3Navigation, { appearance: 'bar' }, {
      default: () => [
        h(M3NavigationTab, {
          active: true,
        }, {
          default: () => '★',
          label: () => h(M3Adaptive, {
            regular: 'Входящие сообщения',
            compact: 'Входящие',
            medium: mediumLabel.value,
            large: 'Широкие',
            extraLarge: 'Максимум',
          }),
        }),
        ...['Черновики', 'Исходящие', 'Избранное', 'Корзина'].map(label => h(M3NavigationTab, { label }, () => '★')),
      ],
    }),
  })
  app.mount(mountPoint)

  try {
    const nav = query<HTMLElement>('nav.m3-navigation_bar')
    const label = query<HTMLElement>('.m3-navigation-tab__label')
    const mediumHeight = nav.getBoundingClientRect().height

    expect(getComputedStyle(label).whiteSpace).toBe('nowrap')
    expect(getComputedStyle(label).textOverflow).toBe('ellipsis')
    expect(label.scrollWidth).toBeGreaterThan(label.clientWidth)
    expect(nav.getBoundingClientRect().height).toBe(mediumHeight)
    expect(query<HTMLElement>('.m3-navigation-tab__button').getAttribute('aria-labelledby')).toBe(label.id)

    mediumLabel.value = 'Почта'
    await waitFor(() => expect(label.textContent).toBe('Почта'))

    await page.viewport(360, 800)
    await waitFor(() => expect(label.textContent).toBe('Входящие'))
    expect(getComputedStyle(label).textOverflow).toBe('ellipsis')

    await page.viewport(900, 800)
    await waitFor(() => expect(label.textContent).toBe('Входящие сообщения'))
    await page.viewport(1300, 800)
    await waitFor(() => expect(label.textContent).toBe('Широкие'))
    await page.viewport(1700, 800)
    await waitFor(() => expect(label.textContent).toBe('Максимум'))
  } finally {
    app.unmount()
    mountPoint.remove()
  }
})

test('can exclude bar from automatic navigation and open a hidden modal rail', async () => {
  await page.viewport(360, 800)

  const expanded = ref(false)
  const appearance = ref<'auto' | 'bar'>('auto')
  const mountPoint = document.createElement('div')
  document.body.append(mountPoint)
  const app = createApp({
    render: () => h(M3Navigation, {
      appearance: appearance.value,
      appearances: ['rail', 'rail-expanded'],
      expansion: 'modal',
      collapse: 'hidden',
      expanded: expanded.value,
    }, {
      default: () => h(M3NavigationTab, { label: 'Inbox' }, () => '★'),
    }),
  })
  app.mount(mountPoint)

  try {
    const nav = query<HTMLElement>('nav.m3-navigation')
    expect(nav.classList.contains('m3-navigation_rail-hidden')).toBe(true)
    expect(nav.classList.contains('m3-navigation_bar')).toBe(false)

    expanded.value = true
    await waitFor(() => expect(nav.classList.contains('m3-navigation_rail-expanded')).toBe(true))
    expect(nav.classList.contains('m3-navigation_modal')).toBe(true)

    expanded.value = false
    await waitFor(() => expect(nav.classList.contains('m3-navigation_rail-hidden')).toBe(true))

    await page.viewport(900, 800)
    await waitFor(() => expect(nav.classList.contains('m3-navigation_rail-hidden')).toBe(true))
    await page.viewport(1300, 800)
    await waitFor(() => expect(nav.classList.contains('m3-navigation_rail-expanded')).toBe(true))
    expect(nav.classList.contains('m3-navigation_bar')).toBe(false)
    await page.viewport(360, 800)
    await waitFor(() => expect(nav.classList.contains('m3-navigation_rail-hidden')).toBe(true))

    appearance.value = 'bar'
    await waitFor(() => expect(nav.classList.contains('m3-navigation_bar')).toBe(true))
  } finally {
    app.unmount()
    mountPoint.remove()
  }
})

test('keeps the vertical bar when it is the allowed bar form', async () => {
  await page.viewport(700, 800)
  const mountPoint = document.createElement('div')
  document.body.append(mountPoint)
  const app = createApp({
    render: () => h(M3Navigation, { appearance: 'auto', appearances: ['bar-vertical', 'rail'] }, {
      default: () => h(M3NavigationTab, { label: 'Inbox' }, () => '★'),
    }),
  })
  app.mount(mountPoint)

  try {
    const nav = query<HTMLElement>('nav.m3-navigation')
    expect(nav.classList.contains('m3-navigation_bar')).toBe(true)
    expect(nav.classList.contains('m3-navigation_bar-vertical')).toBe(true)
    expect(query<HTMLElement>('.m3-navigation-tab').classList.contains('m3-navigation-tab_in-bar')).toBe(true)

    await page.viewport(900, 800)
    await waitFor(() => expect(nav.classList.contains('m3-navigation_rail')).toBe(true))
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
  content.className = 'm3-has-navigation'
  document.body.append(content)
  const hostMountPoint = document.createElement('div')
  content.append(hostMountPoint)
  const hostApp = createApp(M3SnackbarHost)
  hostApp.mount(hostMountPoint)
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
    const host = query<HTMLElement>('.m3-snackbar-host')
    const items = [...rail.querySelectorAll<HTMLElement>('.m3-navigation-tab')]
    const label = items[0].querySelector<HTMLElement>('.m3-navigation-tab__state .m3-navigation-tab__label')!

    expect(rail.getBoundingClientRect().right).toBe(900)
    expect(getComputedStyle(content).paddingRight).toBe('96px')
    expect(getComputedStyle(host).right).toBe('120px')
    expect(items[0].getBoundingClientRect().height).toBeGreaterThan(56)
    expect(label.scrollHeight).toBeLessThanOrEqual(label.clientHeight)
    expect(items[1].getBoundingClientRect().top).toBeGreaterThanOrEqual(items[0].getBoundingClientRect().bottom)

    appearance.value = 'drawer'
    await nextTick()
    const drawer = query<HTMLElement>('nav.m3-navigation_drawer')
    expect(drawer.getBoundingClientRect().right).toBe(900)
    expect(getComputedStyle(drawer).borderTopLeftRadius).toBe('16px')
    await waitFor(() => expect(getComputedStyle(content).paddingRight).toBe('360px'))
    expect(getComputedStyle(host).right).toBe('384px')
  } finally {
    app.unmount()
    mountPoint.remove()
    hostApp.unmount()
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
  content.className = 'm3-has-navigation'
  document.body.append(content)
  const hostMountPoint = document.createElement('div')
  content.append(hostMountPoint)
  const hostApp = createApp(M3SnackbarHost)
  hostApp.mount(hostMountPoint)
  const mountPoint = document.createElement('div')
  document.body.append(mountPoint)
  const expanded = ref(false)
  const app = createApp({
    render: () => h(M3Navigation, { appearance: 'rail', expanded: expanded.value, expansion: 'standard' }, {
      default: () => h(M3NavigationTab, { label: 'Inbox' }, () => '★'),
    }),
  })
  app.mount(mountPoint)

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

    expanded.value = true
    await nextTick()
    await waitFor(() => expect([...transitionProperties]).toContain('width'))
    await waitFor(() => expect(nav.getBoundingClientRect().width).toBe(220))
    expect(getComputedStyle(content).paddingLeft).toBe('220px')
    expect(getComputedStyle(host).left).toBe('244px')
    expect(document.querySelector('[aria-modal="true"]')).toBeNull()
  } finally {
    app.unmount()
    mountPoint.remove()
    hostApp.unmount()
    content.remove()
  }
})
