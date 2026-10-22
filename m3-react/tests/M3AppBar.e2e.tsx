import { act } from '@testing-library/react'
import { page } from 'vitest/browser'
import { render, waitFor } from '@testing-library/react'

import { M3AppBar } from '@/components/app-bar'
import { M3Button } from '@/components/button'

test('renders the six documented heights and grows flexible content without truncation', async () => {
  await page.viewport(900, 800)

  const cases = [
    ['search', 64], ['small', 64], ['medium', 112],
    ['medium-flexible', 112], ['large', 152], ['large-flexible', 120],
  ] as const

  for (const [appearance, height] of cases) {
    const view = render(<M3AppBar appearance={appearance} headline="Library" />)
    expect(view.container.querySelector('.m3-app-bar')!.getBoundingClientRect().height).toBe(height)
    view.unmount()
  }

  const view = render(<M3AppBar appearance="large-flexible" headline="A long title that needs two lines across a compact window" subtitle="Additional context" />)
  try {
    await page.viewport(360, 800)
    const bar = view.container.querySelector('.m3-app-bar')!
    const headline = view.container.querySelector('.m3-app-bar__headline')!
    expect(bar.getBoundingClientRect().height).toBeGreaterThanOrEqual(152)
    expect(headline.scrollHeight).toBeLessThanOrEqual(headline.clientHeight)
  } finally {
    view.unmount()
  }
})

test.each(['ltr', 'rtl'] as const)('centers a small title while keeping actions at the %s edges', direction => {
  const view = render(<M3AppBar headline="Library" subtitle="Recent" alignment="center" dir={direction}>
    <M3AppBar.Leading><M3Button aria-label="Back" width="medium">←</M3Button></M3AppBar.Leading>
    <M3AppBar.Trailing>
      <M3Button aria-label="Favorites" width="medium">★</M3Button>
      <M3Button aria-label="Settings" width="medium">⚙</M3Button>
    </M3AppBar.Trailing>
  </M3AppBar>)

  try {
    const bar = view.container.querySelector('.m3-app-bar')!.getBoundingClientRect()
    const title = view.container.querySelector('.m3-app-bar__title')!.getBoundingClientRect()
    const leading = view.container.querySelector('.m3-app-bar__leading .m3-button_fixed')!.getBoundingClientRect()
    const trailing = view.container.querySelector('.m3-app-bar__trailing .m3-button_fixed:last-child')!.getBoundingClientRect()

    expect(Math.abs((title.left + title.right) / 2 - (bar.left + bar.right) / 2)).toBeLessThan(1)
    expect(direction === 'ltr' ? leading.left - bar.left : bar.right - leading.right).toBe(4)
    expect(direction === 'ltr' ? bar.right - trailing.right : trailing.left - bar.left).toBe(4)
    expect(leading.width).toBe(48)
    expect(trailing.width).toBe(48)
  } finally {
    view.unmount()
  }
})

test('collapses a flexible bar against its own scroll container and expands at the top', async () => {
  await page.viewport(900, 800)
  const scroller = document.createElement('main')
  Object.assign(scroller.style, { height: '300px', overflowY: 'auto' })
  document.body.append(scroller)
  const view = render(<>
    <M3AppBar appearance="medium-flexible" headline="Library" subtitle="Recent items" scroll="collapse" scrollTarget={scroller} />
    <div style={{ height: 1000 }} />
  </>, { container: scroller })

  try {
    const bar = scroller.querySelector<HTMLElement>('.m3-app-bar')!
    expect(bar.getBoundingClientRect().height).toBe(136)
    const transitions = new Set<string>()
    bar.addEventListener('transitionrun', event => transitions.add(event.propertyName))
    await act(async () => { scroller.scrollTop = 100 })
    await waitFor(() => expect(bar.classList.contains('m3-app-bar_collapsed')).toBe(true))
    await waitFor(() => expect(transitions.has('height')).toBe(true))
    await waitFor(() => expect(bar.getBoundingClientRect().height).toBe(64))
    await act(async () => { scroller.scrollTop = 0 })
    await waitFor(() => expect(bar.classList.contains('m3-app-bar_collapsed')).toBe(false))
    await waitFor(() => expect(bar.getBoundingClientRect().height).toBe(136))
  } finally {
    view.unmount()
    scroller.remove()
  }
})
