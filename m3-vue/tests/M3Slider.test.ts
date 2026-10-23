import { fireEvent, render, screen } from '@testing-library/vue'

import { M3Slider } from '@/components/slider'

describe('m3-vue/slider', () => {
  test('uses the full range when no value is supplied', () => {
    const view = render(M3Slider, { props: { min: 20, max: 120 } })

    expect(screen.getByRole('slider').getAttribute('aria-valuenow')).toBe('120')
    expect(view.container.querySelector<HTMLElement>('.m3-slider__value_max')?.style.getPropertyValue('--percentage')).toBe('100%')
  })

  test('positions a value relative to a nonzero minimum', async () => {
    const view = render(M3Slider, { props: { min: 20, max: 120, value: 20 } })
    const value = view.container.querySelector<HTMLElement>('.m3-slider__value_max')

    expect(value?.style.getPropertyValue('--percentage')).toBe('0%')

    await view.rerender({ min: 20, max: 120, value: 70 })
    expect(value?.style.getPropertyValue('--percentage')).toBe('50%')

    await view.rerender({ min: 20, max: 120, value: 120 })
    expect(value?.style.getPropertyValue('--percentage')).toBe('100%')
  })

  test('positions values across a negative range', () => {
    const view = render(M3Slider, { props: { min: -50, max: 50, value: 0 } })

    expect(view.container.querySelector<HTMLElement>('.m3-slider__value_max')?.style.getPropertyValue('--percentage')).toBe('50%')
  })

  test('updates a single value from its handles and endpoint actions', async () => {
    const view = render(M3Slider, {
      props: { min: 20, max: 120, step: 20, value: 60, ariaHandle: { label: 'Volume' } },
    })
    const handle = screen.getByRole('slider', { name: 'Volume' })
    const updates = () => view.emitted()['update:value']

    expect(handle.getAttribute('aria-valuemin')).toBe('20')
    expect(handle.getAttribute('aria-valuemax')).toBe('120')
    expect(handle.getAttribute('aria-valuenow')).toBe('60')
    expect(view.container.querySelector('.m3-slider_stepped')).not.toBeNull()

    await fireEvent.keyDown(handle, { code: 'Home' })
    expect(updates()?.at(-1)).toEqual([20])
    await fireEvent.keyDown(handle, { code: 'End' })
    expect(updates()?.at(-1)).toEqual([120])
    await fireEvent.keyDown(handle, { code: 'ArrowLeft' })
    expect(updates()?.at(-1)).toEqual([40])
    await fireEvent.keyDown(handle, { code: 'ArrowRight' })
    expect(updates()?.at(-1)).toEqual([80])

    await fireEvent.click(screen.getByRole('button', { name: '20' }))
    expect(updates()?.at(-1)).toEqual([20])
    await fireEvent.click(screen.getByRole('button', { name: '120' }))
    expect(updates()?.at(-1)).toEqual([120])
    await fireEvent.click(screen.getByRole('button', { name: '80' }))
    expect(updates()?.at(-1)).toEqual([80])
  })

  test('keeps range values ordered when adjusting either handle', async () => {
    const view = render(M3Slider, {
      props: {
        type: 'range', min: 20, max: 120, step: 20, value: [40, 80],
        ariaHandleMin: { label: 'From' }, ariaHandleMax: { label: 'To' },
      },
    })
    const start = screen.getByRole('slider', { name: 'From' })
    const end = screen.getByRole('slider', { name: 'To' })
    const updates = () => view.emitted()['update:value']

    expect(start.getAttribute('aria-valuemax')).toBe('80')
    expect(end.getAttribute('aria-valuemin')).toBe('40')

    await fireEvent.keyDown(start, { code: 'End' })
    expect(updates()?.at(-1)).toEqual([[80, 80]])
    await fireEvent.keyDown(end, { code: 'Home' })
    expect(updates()?.at(-1)).toEqual([[40, 40]])
    await fireEvent.keyDown(start, { code: 'ArrowRight' })
    expect(updates()?.at(-1)).toEqual([[60, 80]])
    await fireEvent.keyDown(end, { code: 'ArrowLeft' })
    expect(updates()?.at(-1)).toEqual([[40, 60]])
    await fireEvent.keyDown(start, { code: 'ArrowLeft' })
    expect(updates()?.at(-1)).toEqual([[20, 80]])
    await fireEvent.keyDown(start, { code: 'Home' })
    expect(updates()?.at(-1)).toEqual([[20, 80]])
    await fireEvent.keyDown(end, { code: 'ArrowRight' })
    expect(updates()?.at(-1)).toEqual([[40, 100]])
    await fireEvent.keyDown(end, { code: 'End' })
    expect(updates()?.at(-1)).toEqual([[40, 120]])
    const beforeIgnoredKeys = updates()?.length
    await fireEvent.keyDown(start, { code: 'Escape' })
    await fireEvent.keyDown(end, { code: 'Escape' })
    expect(updates()?.length).toBe(beforeIgnoredKeys)

    await fireEvent.click(screen.getByRole('button', { name: '20' }))
    expect(updates()?.at(-1)).toEqual([[20, 80]])
    await fireEvent.click(screen.getByRole('button', { name: '120' }))
    expect(updates()?.at(-1)).toEqual([[40, 120]])

    const middle = screen.getByRole('button', { name: '60' })
    middle.classList.add('m3-slider__notch_hidden')
    const before = updates()?.length
    await fireEvent.click(middle)
    expect(updates()?.length).toBe(before)
    middle.classList.remove('m3-slider__notch_hidden')
    await fireEvent.click(middle)
    expect(updates()?.at(-1)).toEqual([[40, 60]])
    await fireEvent.click(screen.getByRole('button', { name: '40' }))
    expect(updates()?.at(-1)).toEqual([[40, 80]])
  })

  test('ignores keyboard and endpoint actions while disabled', async () => {
    const view = render(M3Slider, { props: { value: 40, disabled: true } })
    const handle = screen.getByRole('slider')

    expect(handle.getAttribute('aria-disabled')).toBe('true')
    await fireEvent.keyDown(handle, { code: 'End' })
    await fireEvent.click(screen.getByRole('button', { name: '0' }))
    await fireEvent.click(screen.getByRole('button', { name: '100' }))
    expect(view.emitted()['update:value']).toBeUndefined()
  })

  test('maps dragging to the numeric range and constrains both range handles', async () => {
    const view = render(M3Slider, { props: { type: 'range', min: 20, max: 120, value: [40, 80] } })
    const track = view.container.querySelector<HTMLElement>('.m3-slider__track')!
    Object.defineProperty(track, 'offsetWidth', { configurable: true, value: 100 })
    vi.spyOn(track, 'getBoundingClientRect').mockReturnValue({ left: 10, right: 110 } as DOMRect)

    const [start, end] = screen.getAllByRole('slider')
    await fireEvent.mouseDown(end, { button: 0 })
    await fireEvent.mouseMove(window, { clientX: 60 })
    expect(view.emitted()['update:value']?.at(-1)).toEqual([[40, 70]])
    await fireEvent.mouseMove(window, { clientX: 0 })
    expect(view.emitted()['update:value']?.at(-1)).toEqual([[40, 40]])
    await fireEvent.mouseUp(window)

    await fireEvent.mouseDown(start, { button: 0 })
    await fireEvent.mouseMove(window, { clientX: 110 })
    expect(view.emitted()['update:value']?.at(-1)).toEqual([[80, 80]])
    await fireEvent.mouseUp(window)
  })

  test('uses coarse keyboard steps while Space is held and fine steps otherwise', async () => {
    const view = render(M3Slider, { props: { value: 50 } })
    const root = view.container.querySelector<HTMLElement>('.m3-slider')!
    const handle = screen.getByRole('slider')

    await fireEvent.keyDown(root, { key: ' ', code: 'Space' })
    await fireEvent.keyDown(handle, { code: 'ArrowRight' })
    expect(view.emitted()['update:value']?.at(-1)).toEqual([60])

    await fireEvent.keyUp(root, { key: ' ', code: 'Space' })
    await fireEvent.keyDown(handle, { code: 'ArrowLeft' })
    expect(view.emitted()['update:value']?.at(-1)).toEqual([49])
  })

  test('keeps the indicator bounded when the domain is degenerate or value is outside it', async () => {
    const view = render(M3Slider, { props: { min: 20, max: 20, value: 20 } })
    const indicator = view.container.querySelector<HTMLElement>('.m3-slider__value_max')!
    expect(indicator.style.getPropertyValue('--percentage')).toBe('0%')

    await view.rerender({ min: 20, max: 120, value: 500 })
    expect(indicator.style.getPropertyValue('--percentage')).toBe('100%')

    await view.rerender({ min: 20, max: 120, value: -10 })
    expect(indicator.style.getPropertyValue('--percentage')).toBe('0%')
  })

  test('snaps a dragged stepped value to the nearest available stop', async () => {
    const view = render(M3Slider, { props: { min: 20, max: 120, step: 20, value: 60 } })
    const track = view.container.querySelector<HTMLElement>('.m3-slider__track')!
    Object.defineProperty(track, 'offsetWidth', { configurable: true, value: 100 })
    vi.spyOn(track, 'getBoundingClientRect').mockReturnValue({ left: 10, right: 110 } as DOMRect)

    await fireEvent.mouseDown(screen.getByRole('slider'), { button: 0 })
    await fireEvent.mouseMove(window, { clientX: 45 })
    expect(view.emitted()['update:value']?.at(-1)).toEqual([60])
    await fireEvent.mouseMove(window, { clientX: 30 })
    expect(view.emitted()['update:value']?.at(-1)).toEqual([40])
    await fireEvent.mouseMove(window, { clientX: 200 })
    expect(view.emitted()['update:value']?.at(-1)).toEqual([120])
    await fireEvent.mouseUp(window)
  })

  test('labels both range handles and blocks dragging and stops while disabled', async () => {
    const view = render(M3Slider, {
      props: {
        type: 'range', min: 20, max: 120, step: 20, value: [40, 80], disabled: true,
        ariaHandleMin: { labelledBy: 'start-label' }, ariaHandleMax: { labelledBy: 'end-label' },
      },
    })
    const [start, end] = screen.getAllByRole('slider')
    expect(start.getAttribute('aria-labelledby')).toBe('start-label')
    expect(end.getAttribute('aria-labelledby')).toBe('end-label')

    await fireEvent.mouseDown(start, { button: 0 })
    await fireEvent.mouseDown(end, { button: 0 })
    await fireEvent.mouseMove(window, { clientX: 60 })
    await fireEvent.click(screen.getByRole('button', { name: '60' }))
    expect(view.emitted()['update:value']).toBeUndefined()
    expect(view.container.querySelector('.m3-slider_disabled')).not.toBeNull()
  })
})
