import { createApp, h, nextTick } from 'vue'
import { page } from 'vitest/browser'
import { ref } from 'vue'

import { M3Icon } from '@/components/icon'
import { M3Tab, M3TabGroup } from '@/components/tabs'

test('tab variants keep spec heights and indicator geometry', async () => {
  await page.viewport(600, 400)

  const mountPoint = document.createElement('div')
  mountPoint.style.width = '360px'
  document.body.append(mountPoint)

  const variant = ref<'primary' | 'secondary'>('primary')
  const label = ref('Inbox')
  const icon = ref(false)
  const app = createApp({
    render: () => h(M3TabGroup, { variant: variant.value, 'aria-label': 'Folders' }, {
      default: () => ['inbox', 'drafts'].map(value => h(M3Tab, {
        value,
        label: label.value,
        'aria-label': value === 'inbox' ? 'Inbox' : 'Drafts',
      }, {
        icon: icon.value ? () => h(M3Icon, { name: value }) : undefined,
        default: () => `${value} content`,
      })),
    }),
  })
  app.mount(mountPoint)

  try {
    const track = mountPoint.querySelector<HTMLElement>('.m3-tab-group__track')!
    const tab = track.querySelector<HTMLButtonElement>('[role="tab"]')!
    const indicator = track.querySelector<HTMLElement>('.m3-tab-group__indicator')!

    expect(track.getBoundingClientRect().height).toBe(48)
    expect(tab.getBoundingClientRect().height).toBe(48)
    expect(getComputedStyle(track, '::after').height).toBe('1px')
    expect(indicator.getBoundingClientRect().height).toBe(3)
    const labelRow = tab.querySelector<HTMLElement>('.m3-tab-group__label-row')!
    await vi.waitFor(() => expect(indicator.getBoundingClientRect().width).toBeCloseTo(Math.max(24, labelRow.getBoundingClientRect().width - 4), 0))

    icon.value = true
    await nextTick()
    expect(track.getBoundingClientRect().height).toBe(64)
    expect(tab.getBoundingClientRect().height).toBe(64)

    label.value = ''
    await nextTick()
    expect(track.getBoundingClientRect().height).toBe(48)
    expect(tab.getBoundingClientRect().height).toBe(48)
    await vi.waitFor(() => expect(indicator.getBoundingClientRect().width).toBeCloseTo(24, 0))

    variant.value = 'secondary'
    await nextTick()
    expect(indicator.getBoundingClientRect().height).toBe(2)
    await vi.waitFor(() => expect(indicator.getBoundingClientRect().width).toBeCloseTo(tab.getBoundingClientRect().width, 0))
  } finally {
    app.unmount()
    mountPoint.remove()
  }
})

test('query navigation restores the selected tab with browser Back', async () => {
  const original = window.location.href
  const start = new URL(original)
  start.searchParams.set('section', 'drafts')
  window.history.replaceState(null, '', start)
  const mountPoint = document.createElement('div')
  document.body.append(mountPoint)
  const app = createApp({
    render: () => h(M3TabGroup, { navigation: 'query', queryKey: 'section' }, {
      default: () => [
        h(M3Tab, { value: 'inbox', label: 'Inbox' }, { default: () => 'Inbox content' }),
        h(M3Tab, { value: 'drafts', label: 'Drafts' }, { default: () => 'Draft content' }),
      ],
    }),
  })
  app.mount(mountPoint)

  try {
    const panel = () => mountPoint.querySelector<HTMLElement>('[role="tabpanel"]:not([hidden])')
    await vi.waitFor(() => expect(panel()?.textContent).toBe('Draft content'))
    mountPoint.querySelector<HTMLButtonElement>('[role="tab"]')!.click()
    await vi.waitFor(() => expect(new URL(window.location.href).searchParams.get('section')).toBe('inbox'))
    window.history.back()
    await vi.waitFor(() => expect(panel()?.textContent).toBe('Draft content'))
  } finally {
    app.unmount()
    mountPoint.remove()
    window.history.replaceState(null, '', original)
  }
})
