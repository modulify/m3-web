import { createApp, h } from 'vue'
import { page } from 'vitest/browser'

import { M3LoadingIndicator } from '@/components/loading-indicator'

const stages = Array.from({ length: 7 }, (_, index) => index * 650)
const samples = [
  ...stages,
  ...stages.map(time => time + 325),
  ...stages.map(time => time + 649),
  ...stages,
]

test('loading indicator renders every shape, morph midpoint, and contained appearance', async () => {
  await page.viewport(800, 400)

  const frames = new Map<number, FrameRequestCallback>()
  let nextFrame = 0

  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
    frames.set(++nextFrame, callback)
    return nextFrame
  })
  vi.stubGlobal('cancelAnimationFrame', (id: number) => frames.delete(id))
  vi.stubGlobal('matchMedia', () => ({ matches: false, addEventListener: () => {} }))

  const mountPoint = document.createElement('div')
  document.body.append(mountPoint)

  const app = createApp({
    render: () => h('div', {
      'data-testid': 'loading-indicator-geometry',
      style: {
        display: 'grid',
        width: 'max-content',
        gridTemplateColumns: 'repeat(7, 48px)',
        gap: '12px',
        padding: '12px',
        background: 'white',
      },
    }, samples.map((_, index) => h(M3LoadingIndicator, {
      key: index,
      contained: index >= 21,
      'aria-label': `Shape ${index + 1}`,
    }))),
  })
  app.mount(mountPoint)

  const advance = (times: number[]) => {
    const callbacks = [...frames.values()]
    frames.clear()

    expect(callbacks).toHaveLength(times.length)
    callbacks.forEach((callback, index) => callback(1000 + times[index]))
  }

  try {
    advance(samples.map(() => 0))
    advance(samples)
    vi.unstubAllGlobals()

    await expect(page.getByTestId('loading-indicator-geometry'))
      .toMatchScreenshot('loading-indicator-geometry')
  } finally {
    app.unmount()
    mountPoint.remove()
    vi.unstubAllGlobals()
  }
})
