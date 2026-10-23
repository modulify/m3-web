import { fireEvent, render, screen } from '@testing-library/react'

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
    fireEvent.click(screen.getByRole('button', { name: '60' }))
    expect(onUpdate).not.toHaveBeenCalled()
    expect(container.querySelector('.m3-slider_disabled')).not.toBeNull()
  })
})
