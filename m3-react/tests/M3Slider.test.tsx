import {
  act,
  fireEvent,
  render,
  screen,
} from '@testing-library/react'

import { M3Slider } from '@/components/slider'

describe('m3-react/slider', () => {
  test('uses the full range when no value is supplied', () => {
    const { container } = render(<M3Slider min={20} max={120} />)

    expect(screen.getByRole('slider').getAttribute('aria-valuenow')).toBe('120')
    expect(container.querySelector<HTMLElement>('.m3-slider__value_max')?.style.getPropertyValue('--percentage')).toBe('100%')
  })

  test('positions a value relative to a nonzero minimum', () => {
    const { container, rerender } = render(<M3Slider min={20} max={120} value={20} />)
    const value = container.querySelector<HTMLElement>('.m3-slider__value_max')

    expect(value?.style.getPropertyValue('--percentage')).toBe('0%')

    rerender(<M3Slider min={20} max={120} value={70} />)
    expect(value?.style.getPropertyValue('--percentage')).toBe('50%')

    rerender(<M3Slider min={20} max={120} value={120} />)
    expect(value?.style.getPropertyValue('--percentage')).toBe('100%')
  })

  test('positions values across a negative range', () => {
    const { container } = render(<M3Slider min={-50} max={50} value={0} />)

    expect(container.querySelector<HTMLElement>('.m3-slider__value_max')?.style.getPropertyValue('--percentage')).toBe('50%')
  })

  test('updates a single value from its handles and endpoint actions', () => {
    const onUpdate = vi.fn()
    const { container } = render(
      <M3Slider min={20} max={120} step={20} value={60} ariaHandle={{ label: 'Volume' }} onUpdate={onUpdate} />
    )
    const handle = screen.getByRole('slider', { name: 'Volume' })

    expect(handle.getAttribute('aria-valuemin')).toBe('20')
    expect(handle.getAttribute('aria-valuemax')).toBe('120')
    expect(handle.getAttribute('aria-valuenow')).toBe('60')
    expect(container.querySelector('.m3-slider_stepped')).not.toBeNull()

    fireEvent.keyDown(handle, { code: 'Home' })
    expect(onUpdate).toHaveBeenLastCalledWith(20)
    fireEvent.keyDown(handle, { code: 'End' })
    expect(onUpdate).toHaveBeenLastCalledWith(120)
    fireEvent.keyDown(handle, { code: 'ArrowLeft' })
    expect(onUpdate).toHaveBeenLastCalledWith(40)
    fireEvent.keyDown(handle, { code: 'ArrowRight' })
    expect(onUpdate).toHaveBeenLastCalledWith(80)

    fireEvent.click(screen.getByRole('button', { name: '20' }))
    expect(onUpdate).toHaveBeenLastCalledWith(20)
    fireEvent.click(screen.getByRole('button', { name: '120' }))
    expect(onUpdate).toHaveBeenLastCalledWith(120)
    fireEvent.click(screen.getByRole('button', { name: '80' }))
    expect(onUpdate).toHaveBeenLastCalledWith(80)
  })

  test('keeps range values ordered when adjusting either handle', () => {
    const onUpdate = vi.fn()
    render(<M3Slider type="range" min={20} max={120} step={20} value={[40, 80]} ariaHandleMin={{ label: 'From' }} ariaHandleMax={{ label: 'To' }} onUpdate={onUpdate} />)

    const start = screen.getByRole('slider', { name: 'From' })
    const end = screen.getByRole('slider', { name: 'To' })
    expect(start.getAttribute('aria-valuemax')).toBe('80')
    expect(end.getAttribute('aria-valuemin')).toBe('40')

    fireEvent.keyDown(start, { code: 'End' })
    expect(onUpdate).toHaveBeenLastCalledWith([80, 80])
    fireEvent.keyDown(end, { code: 'Home' })
    expect(onUpdate).toHaveBeenLastCalledWith([40, 40])
    fireEvent.keyDown(start, { code: 'ArrowRight' })
    expect(onUpdate).toHaveBeenLastCalledWith([60, 80])
    fireEvent.keyDown(end, { code: 'ArrowLeft' })
    expect(onUpdate).toHaveBeenLastCalledWith([40, 60])
    fireEvent.keyDown(start, { code: 'ArrowLeft' })
    expect(onUpdate).toHaveBeenLastCalledWith([20, 80])
    fireEvent.keyDown(start, { code: 'Home' })
    expect(onUpdate).toHaveBeenLastCalledWith([20, 80])
    fireEvent.keyDown(end, { code: 'ArrowRight' })
    expect(onUpdate).toHaveBeenLastCalledWith([40, 100])
    fireEvent.keyDown(end, { code: 'End' })
    expect(onUpdate).toHaveBeenLastCalledWith([40, 120])
    onUpdate.mockClear()
    fireEvent.keyDown(start, { code: 'Escape' })
    fireEvent.keyDown(end, { code: 'Escape' })
    expect(onUpdate).not.toHaveBeenCalled()

    fireEvent.click(screen.getByRole('button', { name: '20' }))
    expect(onUpdate).toHaveBeenLastCalledWith([20, 80])
    fireEvent.click(screen.getByRole('button', { name: '120' }))
    expect(onUpdate).toHaveBeenLastCalledWith([40, 120])

    const middle = screen.getByRole('button', { name: '60' })
    middle.classList.add('m3-slider__notch_hidden')
    onUpdate.mockClear()
    fireEvent.click(middle)
    expect(onUpdate).not.toHaveBeenCalled()
    middle.classList.remove('m3-slider__notch_hidden')
    fireEvent.click(middle)
    expect(onUpdate).toHaveBeenLastCalledWith([40, 60])
    fireEvent.click(screen.getByRole('button', { name: '40' }))
    expect(onUpdate).toHaveBeenLastCalledWith([40, 80])
  })

  test('advances either handle to the next step without exceeding the maximum', () => {
    const onUpdate = vi.fn()
    render(<M3Slider type="range" min={0} max={100} step={20} value={[45, 95]} onUpdate={onUpdate} />)
    const [start, end] = screen.getAllByRole('slider')

    fireEvent.keyDown(start, { code: 'ArrowRight' })
    expect(onUpdate).toHaveBeenLastCalledWith([60, 95])

    fireEvent.keyDown(end, { code: 'ArrowRight' })
    expect(onUpdate).toHaveBeenLastCalledWith([45, 100])
  })

  test('ignores keyboard and endpoint actions while disabled', () => {
    const onUpdate = vi.fn()
    render(<M3Slider value={40} disabled onUpdate={onUpdate} />)

    const handle = screen.getByRole('slider')
    expect(handle.getAttribute('aria-disabled')).toBe('true')
    fireEvent.keyDown(handle, { code: 'End' })
    fireEvent.click(screen.getByRole('button', { name: '0' }))
    fireEvent.click(screen.getByRole('button', { name: '100' }))
    expect(onUpdate).not.toHaveBeenCalled()
  })

  test('maps dragging to the numeric range and constrains both range handles', () => {
    const onUpdate = vi.fn()
    const { container } = render(<M3Slider type="range" min={20} max={120} value={[40, 80]} onUpdate={onUpdate} />)
    const track = container.querySelector<HTMLElement>('.m3-slider__track')!
    Object.defineProperty(track, 'offsetWidth', { configurable: true, value: 100 })
    vi.spyOn(track, 'getBoundingClientRect').mockReturnValue({ left: 10, right: 110 } as DOMRect)

    const [start, end] = screen.getAllByRole('slider')
    fireEvent.mouseDown(end, { button: 0 })
    fireEvent.mouseMove(window, { clientX: 60 })
    expect(onUpdate).toHaveBeenLastCalledWith([40, 70])
    fireEvent.mouseMove(window, { clientX: 0 })
    expect(onUpdate).toHaveBeenLastCalledWith([40, 40])
    fireEvent.mouseUp(window)

    fireEvent.mouseDown(start, { button: 0 })
    fireEvent.mouseMove(window, { clientX: 110 })
    expect(onUpdate).toHaveBeenLastCalledWith([80, 80])
    fireEvent.mouseUp(window)
  })

  test('ignores dragging until the track has a measurable width', () => {
    const onUpdate = vi.fn()
    render(<M3Slider type="range" min={20} max={120} value={[40, 80]} onUpdate={onUpdate} />)
    const [start, end] = screen.getAllByRole('slider')

    fireEvent.mouseDown(start, { button: 0 })
    fireEvent.mouseMove(window, { clientX: 40 })
    fireEvent.mouseUp(window)
    fireEvent.mouseDown(end, { button: 0 })
    fireEvent.mouseMove(window, { clientX: 80 })
    fireEvent.mouseUp(window)
    expect(onUpdate).not.toHaveBeenCalled()
  })

  test('uses coarse keyboard steps while Space is held and fine steps otherwise', () => {
    const onUpdate = vi.fn()
    const { container } = render(<M3Slider value={50} onUpdate={onUpdate} />)
    const root = container.querySelector<HTMLElement>('.m3-slider')!
    const handle = screen.getByRole('slider')

    fireEvent.keyDown(root, { key: ' ', code: 'Space' })
    fireEvent.keyUp(root, { code: 'ShiftLeft' })
    fireEvent.keyDown(handle, { code: 'ArrowRight' })
    expect(onUpdate).toHaveBeenLastCalledWith(60)

    fireEvent.keyUp(root, { key: ' ', code: 'Space' })
    fireEvent.keyDown(handle, { code: 'ArrowLeft' })
    expect(onUpdate).toHaveBeenLastCalledWith(49)
  })

  test('keeps the indicator bounded when the domain is degenerate or value is outside it', () => {
    const { container, rerender } = render(<M3Slider min={20} max={20} value={20} />)
    const indicator = container.querySelector<HTMLElement>('.m3-slider__value_max')!
    expect(indicator.style.getPropertyValue('--percentage')).toBe('0%')

    rerender(<M3Slider min={20} max={120} value={500} />)
    expect(indicator.style.getPropertyValue('--percentage')).toBe('100%')

    rerender(<M3Slider min={20} max={120} value={-10} />)
    expect(indicator.style.getPropertyValue('--percentage')).toBe('0%')
  })

  test('keeps keyboard updates inside a degenerate range', () => {
    const onUpdate = vi.fn()
    render(<M3Slider type="range" min={20} max={20} value={[20, 20]} onUpdate={onUpdate} />)
    const [start, end] = screen.getAllByRole('slider')

    fireEvent.keyDown(start, { code: 'ArrowRight' })
    fireEvent.keyDown(end, { code: 'ArrowLeft' })
    expect(onUpdate).toHaveBeenNthCalledWith(1, [20, 20])
    expect(onUpdate).toHaveBeenNthCalledWith(2, [20, 20])
  })

  test('snaps a dragged stepped value to the nearest available stop', () => {
    const onUpdate = vi.fn()
    const { container } = render(<M3Slider min={20} max={120} step={20} value={60} onUpdate={onUpdate} />)
    const track = container.querySelector<HTMLElement>('.m3-slider__track')!
    Object.defineProperty(track, 'offsetWidth', { configurable: true, value: 100 })
    vi.spyOn(track, 'getBoundingClientRect').mockReturnValue({ left: 10, right: 110 } as DOMRect)

    fireEvent.mouseDown(screen.getByRole('slider'), { button: 0 })
    fireEvent.mouseMove(window, { clientX: 45 })
    expect(onUpdate).toHaveBeenLastCalledWith(60)
    fireEvent.mouseMove(window, { clientX: 30 })
    expect(onUpdate).toHaveBeenLastCalledWith(40)
    fireEvent.mouseMove(window, { clientX: 33 })
    expect(onUpdate).toHaveBeenLastCalledWith(40)
    fireEvent.mouseMove(window, { clientX: 200 })
    expect(onUpdate).toHaveBeenLastCalledWith(120)
    fireEvent.mouseUp(window)
  })

  test('labels both range handles and blocks dragging and stops while disabled', () => {
    const onUpdate = vi.fn()
    const { container } = render(
      <M3Slider
        type="range"
        min={20}
        max={120}
        step={20}
        value={[40, 80]}
        ariaHandleMin={{ labelledBy: 'start-label' }}
        ariaHandleMax={{ labelledBy: 'end-label' }}
        disabled
        onUpdate={onUpdate}
      />
    )
    const [start, end] = screen.getAllByRole('slider')
    expect(start.getAttribute('aria-labelledby')).toBe('start-label')
    expect(end.getAttribute('aria-labelledby')).toBe('end-label')

    fireEvent.mouseDown(start, { button: 0 })
    fireEvent.mouseDown(end, { button: 0 })
    fireEvent.mouseMove(window, { clientX: 60 })
    fireEvent.touchStart(start, { touches: [{ clientX: 60 }] })
    fireEvent.touchStart(end, { touches: [{ clientX: 60 }] })
    fireEvent.keyDown(start, { code: 'ArrowRight' })
    fireEvent.keyDown(end, { code: 'ArrowLeft' })
    fireEvent.click(screen.getByRole('button', { name: '60' }))
    expect(onUpdate).not.toHaveBeenCalled()
    expect(container.querySelector('.m3-slider_disabled')).not.toBeNull()
  })

  test('marks stepped stops covered by the active range and hides stops under the handles', () => {
    vi.useFakeTimers({ toFake: ['requestAnimationFrame', 'cancelAnimationFrame'] })

    try {
      const { container, rerender } = render(<M3Slider min={0} max={100} step={25} value={50} />)
      const active = container.querySelector<HTMLElement>('.m3-slider__filler_active')!
      const handle = screen.getByRole('slider')
      const notches = screen.getAllByRole('button')

      vi.spyOn(active, 'getBoundingClientRect').mockReturnValue({ left: 0, right: 50 } as DOMRect)
      vi.spyOn(handle, 'getBoundingClientRect').mockReturnValue({ left: 48, right: 52 } as DOMRect)
      notches.forEach((notch, index) => {
        vi.spyOn(notch, 'getBoundingClientRect').mockReturnValue({ left: index * 25 } as DOMRect)
      })

      act(() => vi.advanceTimersByTime(20))

      expect(notches[1].classList.contains('m3-slider__notch_active')).toBe(true)
      expect(notches[2].getAttribute('aria-hidden')).toBe('true')
      expect(notches[3].classList.contains('m3-slider__notch_active')).toBe(false)

      rerender(<M3Slider type="range" min={0} max={100} step={25} value={[25, 75]} />)
      const [minHandle, maxHandle] = screen.getAllByRole('slider')
      vi.spyOn(minHandle, 'getBoundingClientRect').mockReturnValue({ left: 23, right: 27 } as DOMRect)
      vi.spyOn(maxHandle, 'getBoundingClientRect').mockReturnValue({ left: 73, right: 77 } as DOMRect)
      vi.spyOn(active, 'getBoundingClientRect').mockReturnValue({ left: 25, right: 75 } as DOMRect)

      fireEvent.transitionEnd(container.querySelector('.m3-slider__value_min')!)

      expect(notches[1].getAttribute('aria-hidden')).toBe('true')
      expect(notches[2].classList.contains('m3-slider__notch_active')).toBe(true)
      expect(notches[3].getAttribute('aria-hidden')).toBe('true')
    } finally {
      vi.useRealTimers()
    }
  })

  test('supports touch dragging and stops updating after touchend', () => {
    const onUpdate = vi.fn()
    const { container } = render(<M3Slider min={0} max={100} value={25} onUpdate={onUpdate} />)
    const track = container.querySelector<HTMLElement>('.m3-slider__track')!
    Object.defineProperty(track, 'offsetWidth', { configurable: true, value: 100 })
    vi.spyOn(track, 'getBoundingClientRect').mockReturnValue({ left: 10, right: 110 } as DOMRect)

    fireEvent.touchStart(screen.getByRole('slider'), { touches: [{ clientX: 35 }] })
    fireEvent.touchMove(window, { touches: [{ clientX: 85 }] })
    expect(onUpdate).toHaveBeenLastCalledWith(75)

    fireEvent.touchEnd(window)
    onUpdate.mockClear()
    fireEvent.touchMove(window, { touches: [{ clientX: 100 }] })
    expect(onUpdate).not.toHaveBeenCalled()
  })

  test('ignores a touch move without active touches and resumes the drag', () => {
    const onUpdate = vi.fn()
    const { container } = render(<M3Slider value={25} onUpdate={onUpdate} />)
    const track = container.querySelector<HTMLElement>('.m3-slider__track')!
    Object.defineProperty(track, 'offsetWidth', { configurable: true, value: 100 })
    vi.spyOn(track, 'getBoundingClientRect').mockReturnValue({ left: 10, right: 110 } as DOMRect)

    fireEvent.touchStart(screen.getByRole('slider'), { touches: [{ clientX: 35 }] })
    fireEvent.touchMove(window, { touches: [] })
    expect(onUpdate).not.toHaveBeenCalled()

    fireEvent.touchMove(window, { touches: [{ clientX: 85 }] })
    expect(onUpdate).toHaveBeenLastCalledWith(75)
  })

  test('ignores a drag while its track has no layout and resumes when layout returns', () => {
    const onUpdate = vi.fn()
    const { container } = render(<M3Slider value={25} onUpdate={onUpdate} />)
    const track = container.querySelector<HTMLElement>('.m3-slider__track')!
    let width = 100
    Object.defineProperty(track, 'offsetWidth', { configurable: true, get: () => width })
    vi.spyOn(track, 'getBoundingClientRect').mockReturnValue({ left: 10, right: 110 } as DOMRect)

    fireEvent.mouseDown(screen.getByRole('slider'), { button: 0 })
    fireEvent.mouseMove(window, { clientX: 35 })
    expect(onUpdate).toHaveBeenLastCalledWith(25)

    width = 0
    onUpdate.mockClear()
    fireEvent.mouseMove(window, { clientX: 60 })
    expect(onUpdate).not.toHaveBeenCalled()

    width = 100
    fireEvent.mouseMove(window, { clientX: 85 })
    expect(onUpdate).toHaveBeenLastCalledWith(75)
  })

  test('stops updates when unmounted during a drag', () => {
    const onUpdate = vi.fn()
    const { container, unmount } = render(<M3Slider value={25} onUpdate={onUpdate} />)
    const track = container.querySelector<HTMLElement>('.m3-slider__track')!
    Object.defineProperty(track, 'offsetWidth', { configurable: true, value: 100 })
    vi.spyOn(track, 'getBoundingClientRect').mockReturnValue({ left: 10, right: 110 } as DOMRect)

    fireEvent.mouseDown(screen.getByRole('slider'), { button: 0 })
    unmount()
    fireEvent.mouseMove(window, { clientX: 85 })
    expect(onUpdate).not.toHaveBeenCalled()
  })

  test('ignores a minimum-handle drag after changing to a single slider', () => {
    const onUpdate = vi.fn()
    const { container, rerender } = render(<M3Slider type="range" value={[25, 75]} onUpdate={onUpdate} />)
    const track = container.querySelector<HTMLElement>('.m3-slider__track')!
    Object.defineProperty(track, 'offsetWidth', { configurable: true, value: 100 })
    vi.spyOn(track, 'getBoundingClientRect').mockReturnValue({ left: 0, right: 100 } as DOMRect)

    fireEvent.mouseDown(screen.getAllByRole('slider')[0], { button: 0 })
    rerender(<M3Slider value={75} onUpdate={onUpdate} />)
    fireEvent.mouseMove(window, { clientX: 50 })
    expect(onUpdate).not.toHaveBeenCalled()
  })

  test('stops a range touch drag when disabled during the gesture', () => {
    const onUpdate = vi.fn()
    const { container, rerender } = render(
      <M3Slider type="range" min={0} max={100} value={[25, 75]} onUpdate={onUpdate} />
    )
    const track = container.querySelector<HTMLElement>('.m3-slider__track')!
    Object.defineProperty(track, 'offsetWidth', { configurable: true, value: 100 })
    vi.spyOn(track, 'getBoundingClientRect').mockReturnValue({ left: 10, right: 110 } as DOMRect)

    const start = screen.getAllByRole('slider')[0]
    fireEvent.touchStart(start, { touches: [{ clientX: 35 }] })
    fireEvent.touchMove(window, { touches: [{ clientX: 60 }] })
    expect(onUpdate).toHaveBeenLastCalledWith([50, 75])

    rerender(<M3Slider type="range" min={0} max={100} value={[25, 75]} disabled onUpdate={onUpdate} />)
    onUpdate.mockClear()
    fireEvent.touchMove(window, { touches: [{ clientX: 85 }] })
    expect(onUpdate).not.toHaveBeenCalled()

    rerender(<M3Slider type="range" min={0} max={100} value={[25, 75]} onUpdate={onUpdate} />)
    fireEvent.touchStart(screen.getAllByRole('slider')[0], { touches: [{ clientX: 35 }] })
    fireEvent.touchMove(window, { touches: [{ clientX: 85 }] })
    expect(onUpdate).toHaveBeenLastCalledWith([75, 75])
  })

  test('rebuilds stepped stops when the step changes', () => {
    const { rerender } = render(<M3Slider min={0} max={100} step={25} value={50} />)
    const labels = () => screen.getAllByRole('button').map(button => button.getAttribute('aria-label'))

    expect(labels()).toEqual(['0', '25', '50', '75', '100'])

    rerender(<M3Slider min={0} max={100} step={20} value={50} />)
    expect(labels()).toEqual(['0', '20', '40', '60', '80', '100'])

    rerender(<M3Slider min={0} max={100} step={25} value={50} />)
    fireEvent.transitionEnd(document.querySelector('.m3-slider__value_max')!)
    expect(labels()).toEqual(['0', '25', '50', '75', '100'])
  })
})
