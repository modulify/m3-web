import { createApp, h, nextTick } from 'vue'
import { page } from 'vitest/browser'
import { ref } from 'vue'

import { M3Progress } from '@/components/progress'

test('small linear progress keeps a 4px gap and follows RTL', async () => {
  await page.viewport(600, 400)
  const mountPoint = document.createElement('div')
  mountPoint.dir = 'rtl'
  mountPoint.style.width = '360px'
  document.body.append(mountPoint)

  const indeterminate = ref(false)
  const app = createApp({
    render: () => h(M3Progress, {
      value: 1,
      indeterminate: indeterminate.value,
      'aria-label': 'Loading article',
    }),
  })
  app.mount(mountPoint)

  try {
    const root = mountPoint.querySelector<HTMLElement>('[role="progressbar"]')!
    const active = root.querySelector<HTMLElement>('.m3-progress__active')!
    const track = root.querySelector<HTMLElement>('.m3-progress__track')!
    const stop = root.querySelector<HTMLElement>('.m3-progress__stop')!

    expect(active.getBoundingClientRect().width).toBe(4)
    expect(active.getBoundingClientRect().right).toBe(root.getBoundingClientRect().right)
    expect(active.getBoundingClientRect().left - track.getBoundingClientRect().right).toBe(4)
    expect(stop.getBoundingClientRect().left).toBe(root.getBoundingClientRect().left)

    indeterminate.value = true
    await nextTick()
    const motion = root.querySelector<SVGSVGElement>('.m3-progress__linear-motion')!
    await vi.waitFor(() => expect(motion.querySelector('.m3-progress__linear-motion-track')?.getAttribute('d')).toBeTruthy())
    expect(getComputedStyle(motion).transform).toContain('matrix(-1')
    expect(motion.querySelectorAll('.m3-progress__linear-motion-active')).toHaveLength(2)
  } finally {
    app.unmount()
    mountPoint.remove()
  }
})

test('indeterminate circular sweep and track stay coupled throughout a cycle', async () => {
  const mountPoint = document.createElement('div')
  document.body.append(mountPoint)
  const app = createApp({
    render: () => h(M3Progress, {
      variant: 'circular',
      shape: 'wavy',
      indeterminate: true,
      'aria-label': 'Loading article',
    }),
  })
  app.mount(mountPoint)

  try {
    const svg = mountPoint.querySelector('svg')!
    const track = svg.querySelector<SVGPathElement>('.m3-progress__circular-track')!
    const active = svg.querySelector<SVGPathElement>('.m3-progress__circular-active')!
    const trackStart = track.getPointAtLength(0)
    expect(trackStart.x).toBeCloseTo(24)
    expect(trackStart.y).toBeCloseTo(3.6, 1)
    const snapshots = []
    for (const time of [0, 1500, 2250, 3000, 4500, 5250, 5700, 5990, 6000, 6010]) {
      for (const animation of svg.getAnimations({ subtree: true })) {
        animation.pause()
        animation.currentTime = time
      }

      await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())))
      const endpoint = active.getPointAtLength(active.getTotalLength())
      const angle = (Math.atan2(endpoint.x - 24, 24 - endpoint.y) * 180 / Math.PI + 360) % 360
      snapshots.push({
        sweep: Number(getComputedStyle(svg).getPropertyValue('--m3-progress-circular-sweep')),
        activePath: active.getAttribute('d'),
        angle,
        trackLength: track.getAttribute('stroke-dasharray'),
        trackOffset: Number(track.getAttribute('stroke-dashoffset')),
        trackRendered: getComputedStyle(track).strokeDasharray,
        trackOpacity: Number(getComputedStyle(track).opacity),
      })
    }

    expect(snapshots[0].sweep).toBe(10)
    expect(snapshots[1].sweep).toBeCloseTo(77.59, 1)
    expect(snapshots[2].sweep).toBeCloseTo(85.11, 1)
    expect(snapshots[3].sweep).toBe(87)
    for (const index of [4, 5, 6, 7]) {
      expect(snapshots[index].sweep).toBeLessThan(snapshots[index - 1].sweep)
    }
    expect(snapshots[4].activePath).not.toBe(snapshots[5].activePath)
    expect(snapshots[5].activePath).not.toBe(snapshots[6].activePath)
    expect(snapshots.every(({ sweep, angle }) => Math.abs(sweep * 3.6 - angle) < 1)).toBe(true)
    const gap = Number((mountPoint.firstElementChild as HTMLElement).style.getPropertyValue('--m3-progress-circular-gap'))
    expect(snapshots.every(({ sweep, trackOffset }) => Math.abs(trackOffset + sweep + gap) < .01)).toBe(true)
    expect(snapshots.every(({ trackRendered }) => trackRendered !== 'none')).toBe(true)
    expect(snapshots[0].trackLength).not.toBe(snapshots[1].trackLength)
    expect(snapshots[3].trackOpacity).toBeLessThan(1)
    expect(snapshots[3].trackOpacity).toBeGreaterThanOrEqual(0)
    expect(Math.abs(snapshots[7].sweep - snapshots[8].sweep)).toBeLessThan(.1)
    expect(Math.abs(snapshots[9].sweep - snapshots[8].sweep)).toBeLessThan(.1)
  } finally {
    app.unmount()
    mountPoint.remove()
  }
})

test('determinate circular wave moves, then settles into a smooth complete ring', async () => {
  const mountPoint = document.createElement('div')
  document.body.append(mountPoint)
  const value = ref(40)
  const app = createApp({
    render: () => h(M3Progress, {
      variant: 'circular',
      shape: 'wavy',
      value: value.value,
      'aria-label': 'Loading article',
    }),
  })
  app.mount(mountPoint)

  try {
    const root = mountPoint.querySelector<HTMLElement>('[role="progressbar"]')!
    const active = root.querySelector<SVGPathElement>('.m3-progress__circular-active')!
    const initial = active.getAttribute('d')

    await vi.waitFor(() => expect(active.getAttribute('d')).not.toBe(initial))

    value.value = 100
    await nextTick()
    await vi.waitFor(() => expect(getComputedStyle(root).getPropertyValue('--m3-progress-wave-amplitude').trim()).toBe('0'), { timeout: 1500 })

    expect(active.getAttribute('d')).toMatch(/ Z$/)
    expect(root.getAttribute('aria-valuenow')).toBe('100')
  } finally {
    app.unmount()
    mountPoint.remove()
  }
})

test('trackless circular progress stays visibly open while rotating in a button-sized area', () => {
  const mountPoint = document.createElement('div')
  document.body.append(mountPoint)
  const app = createApp({
    render: () => h(M3Progress, {
      variant: 'circular',
      size: 24,
      track: false,
      indeterminate: true,
      'aria-label': 'Downloading',
    }),
  })
  app.mount(mountPoint)

  try {
    const svg = mountPoint.querySelector('svg')!
    const track = svg.querySelector<SVGPathElement>('.m3-progress__circular-track')!

    expect(getComputedStyle(track).display).toBe('none')
    expect(getComputedStyle(svg).animationName).toContain('m3-progress-circular-button-rotate')

    const snapshots = [0, 1200].map(time => {
      for (const animation of svg.getAnimations()) {
        animation.pause()
        animation.currentTime = time
      }

      return Number(getComputedStyle(svg).getPropertyValue('--m3-progress-circular-sweep'))
    })

    expect(snapshots[0]).toBe(10)
    expect(snapshots[1]).toBe(65)
  } finally {
    app.unmount()
    mountPoint.remove()
  }
})

test('linear wave is one continuous stroke without tiled pattern joins', () => {
  const mountPoint = document.createElement('div')
  document.body.append(mountPoint)
  const app = createApp({
    render: () => h(M3Progress, {
      shape: 'wavy',
      value: 40,
      'aria-label': 'Loading article',
    }),
  })
  app.mount(mountPoint)

  try {
    const wave = mountPoint.querySelector<SVGSVGElement>('.m3-progress__wave')!
    expect(wave.querySelectorAll('path')).toHaveLength(1)
    expect(wave.querySelector('pattern')).toBeNull()
    expect(wave.querySelector('path')!.getAttribute('d')).toContain('Q 8190')
  } finally {
    app.unmount()
    mountPoint.remove()
  }
})
