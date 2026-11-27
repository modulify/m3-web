import {
  createApp,
  h,
  nextTick,
  ref,
} from 'vue'
import { render } from '@testing-library/vue'

import { M3Progress, M3ProgressCircle, M3ProgressLine } from '@/components/progress'

describe('m3-vue/progress', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  test('switches between line and circle without adding a wrapper element', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const variant = ref<'linear' | 'circular'>('linear')
    const view = ref<{ el: HTMLDivElement | null } | null>(null)
    const app = createApp({
      render: () => h(M3Progress, { ref: view, variant: variant.value, 'aria-label': 'Loading article' }),
    })
    app.mount(host)

    try {
      const line = host.querySelector<HTMLElement>('[role="progressbar"]')!
      expect(line.classList.contains('m3-progress_linear')).toBe(true)
      expect(view.value?.el).toBe(line)

      variant.value = 'circular'
      await nextTick()
      const circle = host.querySelector<HTMLElement>('[role="progressbar"]')!
      expect(circle).not.toBe(line)
      expect(circle.classList.contains('m3-progress_circular')).toBe(true)
      expect(view.value?.el).toBe(circle)
    } finally {
      app.unmount()
      host.remove()
    }
  })

  test('allows using line and circle directly', () => {
    const line = render(M3ProgressLine, {
      props: { value: 25, stop: false },
      attrs: { 'aria-label': 'Loading messages' },
    })
    const circle = render(M3ProgressCircle, {
      props: { value: 75, size: 52 },
      attrs: { 'aria-label': 'Loading image' },
    })

    expect(line.getByRole('progressbar', { name: 'Loading messages' }).classList.contains('m3-progress_no-stop')).toBe(true)
    expect(circle.getByRole('progressbar', { name: 'Loading image' }).querySelector('svg')?.getAttribute('viewBox')).toBe('0 0 52 52')
  })

  test('announces actual determinate progress and updates it', async () => {
    const { getByRole, rerender } = render(M3Progress, {
      props: { value: 35 },
      attrs: { 'aria-label': 'Loading article' },
    })
    const indicator = getByRole('progressbar', { name: 'Loading article' })

    expect(indicator.getAttribute('aria-valuemin')).toBe('0')
    expect(indicator.getAttribute('aria-valuemax')).toBe('100')
    expect(indicator.getAttribute('aria-valuenow')).toBe('35')
    expect(indicator.classList.contains('m3-progress_linear')).toBe(true)

    await rerender({ value: 120 })

    expect(indicator.getAttribute('aria-valuenow')).toBe('100')
    expect(indicator.classList.contains('m3-progress_complete')).toBe(true)
  })

  test('omits numeric values when progress becomes indeterminate', async () => {
    const { getByRole, rerender } = render(M3Progress, {
      props: { value: 25 },
      attrs: { 'aria-label': 'Loading article' },
    })
    const indicator = getByRole('progressbar')

    await rerender({ value: 25, indeterminate: true })

    expect(indicator.hasAttribute('aria-valuenow')).toBe(false)
    expect(indicator.hasAttribute('aria-valuemin')).toBe(false)
    expect(indicator.classList.contains('m3-progress_indeterminate')).toBe(true)
    expect(indicator.querySelector('.m3-progress__stop')).toBeNull()
    expect(indicator.querySelectorAll('.m3-progress__linear-motion-active')).toHaveLength(2)
  })

  test('renders a wavy circular indicator with configurable track and thickness', () => {
    const { getByRole } = render(M3Progress, {
      props: { variant: 'circular', shape: 'wavy', value: 60, thickness: 8, size: 52, track: false },
      attrs: { 'aria-label': 'Saving document' },
    })
    const indicator = getByRole('progressbar', { name: 'Saving document' })
    const graphic = indicator.querySelector('svg')

    expect(indicator.classList.contains('m3-progress_wavy')).toBe(true)
    expect(indicator.classList.contains('m3-progress_no-track')).toBe(true)
    expect(graphic?.getAttribute('viewBox')).toBe('0 0 52 52')
    expect(graphic?.querySelector('.m3-progress__circular-active')?.getAttribute('stroke-width')).toBe('8')
  })

  test('uses expressive wavy size and an open determinate arc', async () => {
    const { getByRole, rerender } = render(M3Progress, {
      props: { variant: 'circular', shape: 'wavy', value: 40 },
      attrs: { 'aria-label': 'Loading article' },
    })
    const indicator = getByRole('progressbar')
    const graphic = indicator.querySelector('svg')!
    const active = graphic.querySelector('.m3-progress__circular-active')!

    expect(graphic.getAttribute('viewBox')).toBe('0 0 48 48')
    expect(active.getAttribute('stroke-width')).toBe('4')
    expect(active.hasAttribute('stroke-dasharray')).toBe(false)
    expect(active.getAttribute('d')?.endsWith(' Z')).toBe(false)

    await rerender({ value: 100 })
    expect(indicator.classList.contains('m3-progress_wave-flat')).toBe(true)
  })

  test('exposes no element after the selected indicator unmounts', () => {
    const host = document.createElement('div')
    document.body.append(host)
    const view = ref<{ el: HTMLDivElement | null } | null>(null)
    const app = createApp({
      render: () => h(M3Progress, { ref: view }),
    })
    app.mount(host)
    const exposed = view.value!

    app.unmount()
    host.remove()

    expect(exposed.el).toBeNull()
  })

  test('draws reduced-motion line and circular frames without scheduling another frame', () => {
    const frames: FrameRequestCallback[] = []
    const changes: Array<() => void> = []
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      frames.push(callback)
      return frames.length
    })
    vi.stubGlobal('cancelAnimationFrame', vi.fn())
    vi.stubGlobal('matchMedia', () => ({
      matches: true,
      addEventListener: (_type: string, listener: () => void) => changes.push(listener),
    }))
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect')
      .mockReturnValue(DOMRect.fromRect({ width: 400, height: 10 }))

    const line = render(M3ProgressLine, {
      props: { shape: 'wavy', indeterminate: true },
      attrs: { 'aria-label': 'Line' },
    })
    const circle = render(M3ProgressCircle, {
      props: { shape: 'wavy', indeterminate: true },
      attrs: { 'aria-label': 'Circle' },
    })
    const queued = frames.splice(0)
    queued.forEach(frame => frame(1000))

    const lineBar = line.getByRole('progressbar', { name: 'Line' })
    const circleBar = circle.getByRole('progressbar', { name: 'Circle' })

    expect(lineBar.querySelector('.m3-progress__linear-motion-active')?.getAttribute('d')).toContain('M ')
    expect(circleBar.querySelector('.m3-progress__circular-active')?.getAttribute('d')).toContain('M ')
    expect(frames).toHaveLength(0)
    changes.forEach(change => change())
    expect(frames).toHaveLength(2)
  })

  test('keeps circular wave motion running while it has amplitude', () => {
    const frames: FrameRequestCallback[] = []
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      frames.push(callback)
      return frames.length
    })
    vi.stubGlobal('cancelAnimationFrame', vi.fn())

    const view = render(M3ProgressCircle, { props: { shape: 'wavy', value: 50 } })
    frames.shift()?.(1000)

    expect(view.getByRole('progressbar').querySelector('.m3-progress__circular-active')?.getAttribute('d')).toContain('M ')
    expect(frames).toHaveLength(1)
    view.unmount()
  })

  test('draws a flat circle and freezes a determinate wave in reduced motion', () => {
    const frames: FrameRequestCallback[] = []
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      frames.push(callback)
      return frames.length
    })
    vi.stubGlobal('cancelAnimationFrame', vi.fn())
    vi.stubGlobal('matchMedia', () => ({ matches: true, addEventListener: vi.fn() }))

    const flat = render(M3ProgressCircle, { props: { value: 40 } })
    const wave = render(M3ProgressCircle, { props: { shape: 'wavy', value: 40 } })
    const queued = frames.splice(0)
    queued.forEach(frame => frame(1000))

    expect(flat.container.querySelector('.m3-progress__circular-active')?.getAttribute('stroke-dasharray')).toBe('40 60')
    expect(wave.container.querySelector('.m3-progress__circular-active')?.getAttribute('d')).toContain('M ')
    expect(frames).toHaveLength(0)
    flat.unmount()
    wave.unmount()
  })

  test('draws linear motion without a media-query API and tolerates a late resize', () => {
    let resize!: ResizeObserverCallback
    const frames: FrameRequestCallback[] = []
    vi.stubGlobal('matchMedia', undefined)
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      frames.push(callback)
      return frames.length
    })
    vi.stubGlobal('cancelAnimationFrame', vi.fn())
    vi.stubGlobal('ResizeObserver', class {
      constructor (callback: ResizeObserverCallback) { resize = callback }
      observe () { resize([], this as ResizeObserver) }
      unobserve () {}
      disconnect () {}
    })

    const view = render(M3ProgressLine, { props: { indeterminate: true } })
    frames.shift()?.(performance.now() + 875)
    expect(view.getByRole('progressbar').querySelector('.m3-progress__linear-motion-active')?.getAttribute('d')).toContain('M ')

    view.unmount()
    resize([], {} as ResizeObserver)
  })
})
