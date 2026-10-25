import type { M3ProgressExposed } from '@/components/progress'

import { createRef } from 'react'
import { render } from '@testing-library/react'

import { M3Progress, M3ProgressCircle, M3ProgressLine } from '@/components/progress'

describe('m3-react/progress', () => {
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
})
