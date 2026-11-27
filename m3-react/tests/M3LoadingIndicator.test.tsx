import type { M3LoadingIndicatorExposed } from '@/components/loading-indicator'

import { createRef } from 'react'
import { render } from '@testing-library/react'

import { M3LoadingIndicator } from '@/components/loading-indicator'

describe('m3-react/loading-indicator', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  test('renders both appearances with indeterminate progress semantics', () => {
    const view = render(<>
      <M3LoadingIndicator aria-label="Loading article" />
      <M3LoadingIndicator size={96} aria-label="Loading messages" contained />
    </>)
    const defaultIndicator = view.getByRole('progressbar', { name: 'Loading article' })
    const contained = view.getByRole('progressbar', { name: 'Loading messages' })

    expect(defaultIndicator.classList.contains('m3-loading-indicator_contained')).toBe(false)
    expect(contained.classList.contains('m3-loading-indicator_contained')).toBe(true)
    expect(contained.style.getPropertyValue('--m3-loading-indicator-size')).toBe('96px')
    expect(contained.hasAttribute('aria-valuenow')).toBe(false)
    expect(contained.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true')
  })

  test('exposes its root element and clears it after unmount', () => {
    const ref = createRef<M3LoadingIndicatorExposed>()
    const view = render(<M3LoadingIndicator ref={ref} aria-label="Loading article" />)
    const exposed = ref.current!

    expect(exposed.el).toBe(view.getByRole('progressbar'))

    view.unmount()
    expect(exposed.el).toBeNull()
  })

  test('advances the shape and stops scheduling frames when reduced motion is requested', () => {
    const frames = new Map<number, FrameRequestCallback>()
    let nextFrame = 0
    const preference = {
      matches: false,
      addEventListener: vi.fn(),
    }
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      frames.set(++nextFrame, callback)
      return nextFrame
    })
    vi.stubGlobal('cancelAnimationFrame', (id: number) => frames.delete(id))
    vi.stubGlobal('matchMedia', () => preference)

    const advance = (time: number) => {
      const [id, callback] = frames.entries().next().value!
      frames.delete(id)
      callback(time)
    }

    const view = render(<M3LoadingIndicator aria-label="Loading article" />)
    const indicator = view.getByRole('progressbar')
    const path = indicator.querySelector('path')!
    const initial = path.getAttribute('d')

    advance(1000)
    advance(1325)

    expect(path.getAttribute('d')).not.toBe(initial)
    expect(frames.size).toBe(1)

    preference.matches = true
    preference.addEventListener.mock.calls[0][1]()
    advance(1400)

    expect(path.getAttribute('d')).toBe(initial)
    expect(frames.size).toBe(0)

    view.unmount()
  })
})
