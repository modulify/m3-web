import type { M3ProgressExposed } from '@/components/progress'

import { createRef } from 'react'
import { render } from '@testing-library/react'

import { M3Progress, M3ProgressCircle, M3ProgressLine } from '@/components/progress'

describe('m3-react/progress', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  test('switches between line and circle without adding a wrapper element', () => {
    const ref = createRef<M3ProgressExposed>()
    const { getByRole, rerender } = render(<M3Progress ref={ref} aria-label="Loading article" />)
    const line = getByRole('progressbar')

    expect(line.classList.contains('m3-progress_linear')).toBe(true)
    expect(ref.current?.el).toBe(line)

    rerender(<M3Progress ref={ref} variant="circular" aria-label="Loading article" />)
    const circle = getByRole('progressbar')

    expect(circle).not.toBe(line)
    expect(circle.classList.contains('m3-progress_circular')).toBe(true)
    expect(ref.current?.el).toBe(circle)
  })

  test('allows using line and circle directly', () => {
    const { getByRole } = render(<>
      <M3ProgressLine value={25} stop={false} aria-label="Loading messages" />
      <M3ProgressCircle value={75} size={52} aria-label="Loading image" />
    </>)

    expect(getByRole('progressbar', { name: 'Loading messages' }).classList.contains('m3-progress_no-stop')).toBe(true)
    expect(getByRole('progressbar', { name: 'Loading image' }).querySelector('svg')?.getAttribute('viewBox')).toBe('0 0 52 52')
  })

  test('announces actual determinate progress and updates it', () => {
    const { getByRole, rerender } = render(<M3Progress value={35} aria-label="Loading article" />)
    const indicator = getByRole('progressbar', { name: 'Loading article' })

    expect(indicator.getAttribute('aria-valuemin')).toBe('0')
    expect(indicator.getAttribute('aria-valuemax')).toBe('100')
    expect(indicator.getAttribute('aria-valuenow')).toBe('35')
    expect(indicator.classList.contains('m3-progress_linear')).toBe(true)

    rerender(<M3Progress value={120} aria-label="Loading article" />)

    expect(indicator.getAttribute('aria-valuenow')).toBe('100')
    expect(indicator.classList.contains('m3-progress_complete')).toBe(true)
  })

  test('omits numeric values when progress becomes indeterminate', () => {
    const { getByRole, rerender } = render(<M3Progress value={25} aria-label="Loading article" />)
    const indicator = getByRole('progressbar')

    rerender(<M3Progress value={25} aria-label="Loading article" indeterminate />)

    expect(indicator.hasAttribute('aria-valuenow')).toBe(false)
    expect(indicator.hasAttribute('aria-valuemin')).toBe(false)
    expect(indicator.classList.contains('m3-progress_indeterminate')).toBe(true)
    expect(indicator.querySelector('.m3-progress__stop')).toBeNull()
    expect(indicator.querySelectorAll('.m3-progress__linear-motion-active')).toHaveLength(2)
  })

  test('renders a wavy circular indicator with configurable track and thickness', () => {
    const { getByRole } = render(
      <M3Progress variant="circular" shape="wavy" value={60} thickness={8} size={52} track={false} aria-label="Saving document" />
    )
    const indicator = getByRole('progressbar', { name: 'Saving document' })
    const graphic = indicator.querySelector('svg')

    expect(indicator.classList.contains('m3-progress_wavy')).toBe(true)
    expect(indicator.classList.contains('m3-progress_no-track')).toBe(true)
    expect(graphic?.getAttribute('viewBox')).toBe('0 0 52 52')
    expect(graphic?.querySelector('.m3-progress__circular-active')?.getAttribute('stroke-width')).toBe('8')
  })

  test('uses expressive wavy size and an open determinate arc', () => {
    const { getByRole, rerender } = render(<M3Progress variant="circular" shape="wavy" value={40} aria-label="Loading article" />)
    const indicator = getByRole('progressbar')
    const graphic = indicator.querySelector('svg')!
    const active = graphic.querySelector('.m3-progress__circular-active')!

    expect(graphic.getAttribute('viewBox')).toBe('0 0 48 48')
    expect(active.getAttribute('stroke-width')).toBe('4')
    expect(active.hasAttribute('stroke-dasharray')).toBe(false)
    expect(active.getAttribute('d')?.endsWith(' Z')).toBe(false)

    rerender(<M3Progress variant="circular" shape="wavy" value={100} aria-label="Loading article" />)
    expect(indicator.classList.contains('m3-progress_wave-flat')).toBe(true)
  })

  test('exposes no element after the selected indicator unmounts', () => {
    const ref = createRef<M3ProgressExposed>()
    const view = render(<M3Progress ref={ref} />)
    const exposed = ref.current!

    view.unmount()

    expect(exposed.el).toBeNull()
  })

  test('renders direct indicators with their default values', () => {
    const view = render(<>
      <M3ProgressLine aria-label="Line" />
      <M3ProgressCircle aria-label="Circle" />
    </>)

    expect(view.getByRole('progressbar', { name: 'Line' }).getAttribute('aria-valuenow')).toBe('0')
    expect(view.getByRole('progressbar', { name: 'Circle' }).getAttribute('aria-valuenow')).toBe('0')
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

    const view = render(<>
      <M3ProgressLine shape="wavy" aria-label="Line" indeterminate />
      <M3ProgressCircle shape="wavy" aria-label="Circle" indeterminate />
    </>)
    const queued = frames.splice(0)
    queued.forEach(frame => frame(1000))

    const line = view.getByRole('progressbar', { name: 'Line' })
    const circle = view.getByRole('progressbar', { name: 'Circle' })
    expect(line.querySelector('.m3-progress__linear-motion-active')?.getAttribute('d')).toContain('M ')
    expect(circle.querySelector('.m3-progress__circular-active')?.getAttribute('d')).toContain('M ')
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

    const view = render(<M3ProgressCircle shape="wavy" value={50} aria-label="Circle" />)
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

    const view = render(<>
      <M3ProgressCircle value={40} aria-label="Flat" />
      <M3ProgressCircle shape="wavy" value={40} aria-label="Wave" />
    </>)
    const queued = frames.splice(0)
    queued.forEach(frame => frame(1000))

    const flat = view.getByRole('progressbar', { name: 'Flat' })
    const wave = view.getByRole('progressbar', { name: 'Wave' })

    expect(flat.querySelector('.m3-progress__circular-active')?.getAttribute('stroke-dasharray')).toBe('40 60')
    expect(wave.querySelector('.m3-progress__circular-active')?.getAttribute('d')).toContain('M ')
    expect(frames).toHaveLength(0)
    view.unmount()
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

    const view = render(<M3ProgressLine aria-label="Line" indeterminate />)
    frames.shift()?.(performance.now() + 875)
    expect(view.getByRole('progressbar').querySelector('.m3-progress__linear-motion-active')?.getAttribute('d')).toContain('M ')

    view.unmount()
    resize([], {} as ResizeObserver)
  })
})
