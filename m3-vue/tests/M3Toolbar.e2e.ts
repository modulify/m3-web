import { createApp, h, nextTick } from 'vue'
import { page } from 'vitest/browser'

import { M3FabButton } from '@/components/fab-button'
import { M3Icon } from '@/components/icon'
import { M3Toolbar } from '@/components/toolbar'

const actions = ['Bold', 'Italic', 'Underline', 'Link', 'Image', 'Align'].map((label, index) => ({
  id: String(index), label, icon: 'edit', onClick: vi.fn(),
}))
const overflowActions = actions.map((action, index) => index === 4 ? { ...action, label: 'Вставить изображение' } : action)

const waitFor = async (assertion: () => void) => {
  const startedAt = performance.now()
  while (performance.now() - startedAt < 2000) {
    try { assertion(); return } catch { await new Promise(resolve => setTimeout(resolve, 16)) }
  }
  assertion()
}

test('keeps floating actions within the viewport and restores overflowed actions after resize', async () => {
  await page.viewport(320, 700)
  const mountPoint = document.createElement('div')
  document.body.append(mountPoint)
  const app = createApp(M3Toolbar, { label: 'Editing', variant: 'floating', actions: overflowActions, overflowLabel: 'More tools' })
  app.mount(mountPoint)

  try {
    const toolbar = mountPoint.querySelector<HTMLElement>('.m3-toolbar')!
    const container = toolbar.querySelector<HTMLElement>('.m3-toolbar__container')!
    await waitFor(() => expect(mountPoint.querySelector('[aria-label="More tools"]')).not.toBeNull())
    const bounds = container.getBoundingClientRect()
    expect(bounds.height).toBe(64)
    expect(bounds.left).toBeGreaterThanOrEqual(16)
    expect(bounds.right).toBeLessThanOrEqual(304)

    const trigger = mountPoint.querySelector('[aria-label="More tools"]') as HTMLButtonElement
    trigger.click()
    await waitFor(() => expect([...document.querySelectorAll('.m3-menu-item')].some(item => item.textContent?.includes('Вставить изображение'))).toBe(true))
    const item = [...document.querySelectorAll<HTMLElement>('.m3-menu-item')].find(element => element.textContent?.includes('Вставить изображение'))!
    const menu = item.closest<HTMLElement>('.m3-menu')!
    await waitFor(() => {
      const menuBounds = menu.getBoundingClientRect()
      const toolbarBounds = toolbar.getBoundingClientRect()
      expect(Math.min(menuBounds.bottom, toolbarBounds.bottom) - Math.max(menuBounds.top, toolbarBounds.top)).toBeGreaterThan(0)
      const x = (Math.max(menuBounds.left, toolbarBounds.left) + Math.min(menuBounds.right, toolbarBounds.right)) / 2
      const y = (Math.max(menuBounds.top, toolbarBounds.top) + Math.min(menuBounds.bottom, toolbarBounds.bottom)) / 2
      expect(document.elementFromPoint(x, y)?.closest('.m3-menu')).toBe(menu)
    })
    const body = item.querySelector<HTMLElement>('.m3-menu-item__body')!
    const textStarts = [...menu.querySelectorAll('.m3-menu-item__body')].map(element => {
      const range = document.createRange()
      range.selectNodeContents(element)
      return range.getBoundingClientRect().left
    })
    expect(Math.max(...textStarts) - Math.min(...textStarts)).toBeLessThan(1)
    expect(body.scrollWidth).toBeLessThanOrEqual(body.clientWidth)
    expect(body.getBoundingClientRect().height).toBeLessThan(parseFloat(getComputedStyle(body).lineHeight) * 1.5)
    item.click()
    expect(actions[4].onClick).toHaveBeenCalledOnce()

    await page.viewport(900, 700)
    await waitFor(() => expect(mountPoint.querySelector('[aria-label="More tools"]')).toBeNull())
    expect(mountPoint.querySelector('[aria-label="Вставить изображение"]')).not.toBeNull()
  } finally {
    app.unmount()
    mountPoint.remove()
  }
})

test('restores the full floating width after collapsing to the FAB', async () => {
  await page.viewport(900, 700)
  const scroller = document.createElement('main')
  Object.assign(scroller.style, { height: '300px', overflowY: 'auto' })
  document.body.append(scroller)
  const app = createApp({
    render: () => [
      h(M3Toolbar, {
        label: 'Editing', variant: 'floating', scroll: 'collapse', scrollTarget: scroller, actions,
      }, {
        default: () => h('button', 'Custom action'),
        fab: () => h(M3FabButton, { 'aria-label': 'Add' }, () => h(M3Icon, { name: 'add' })),
      }),
      h('div', { style: { height: '1000px' } }),
    ],
  })
  app.mount(scroller)

  try {
    const toolbar = scroller.querySelector<HTMLElement>('.m3-toolbar')!
    const container = toolbar.querySelector<HTMLElement>('.m3-toolbar__container')!
    await document.fonts.ready
    const expandedWidth = container.getBoundingClientRect().width
    scroller.scrollTop = 100
    await waitFor(() => expect(toolbar.classList.contains('m3-toolbar_collapsed')).toBe(true))
    scroller.scrollTop = 0
    await waitFor(() => expect(toolbar.classList.contains('m3-toolbar_collapsed')).toBe(false))
    await waitFor(() => expect(container.getBoundingClientRect().width).toBeCloseTo(expandedWidth, 0))
  } finally {
    app.unmount()
    scroller.remove()
  }
})

test('positions vertical floating toolbar at the logical end and collapses to FAB on scroll', async () => {
  await page.viewport(900, 700)
  const scroller = document.createElement('main')
  Object.assign(scroller.style, { height: '300px', overflowY: 'auto' })
  document.body.append(scroller)
  const app = createApp({
    render: () => [
      h(M3Toolbar, {
        label: 'Editing', variant: 'floating', orientation: 'vertical', scroll: 'collapse', scrollTarget: scroller, actions: actions.slice(0, 3),
      }, { fab: () => h(M3FabButton, { 'aria-label': 'Add' }, () => h(M3Icon, { name: 'add' })) }),
      h('div', { style: { height: '1000px' } }),
    ],
  })
  app.mount(scroller)

  try {
    const toolbar = scroller.querySelector<HTMLElement>('.m3-toolbar')!
    expect(Math.round(900 - toolbar.getBoundingClientRect().right)).toBe(24)
    scroller.scrollTop = 100
    await nextTick()
    await waitFor(() => expect(toolbar.classList.contains('m3-toolbar_collapsed')).toBe(true))
    expect(scroller.querySelector('[aria-label="Add"]')).not.toBeNull()
    scroller.scrollTop = 0
    await nextTick()
    await waitFor(() => expect(toolbar.classList.contains('m3-toolbar_collapsed')).toBe(false))
  } finally {
    app.unmount()
    scroller.remove()
  }
})
