import {
  createApp,
  h,
  nextTick,
  ref,
} from 'vue'
import { render } from '@testing-library/vue'

import { M3Progress, M3ProgressCircle, M3ProgressLine } from '@/components/progress'

describe('m3-vue/progress', () => {
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
})
