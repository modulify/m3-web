/** @vitest-environment jsdom */

import {
  afterEach,
  describe,
  expect,
  test,
  vi,
} from 'vitest'

import {
  createRail,
  getClientSize,
  getClientWidth,
  getScrollDistance,
  getScrollDistanceY,
  getScrollRatio,
  getScrollRatioX,
  getSliderHeight,
  getSliderSize,
  syncSlider,
} from '../lib/scroll'

const setElementMetrics = (element: HTMLElement, metrics: Partial<Record<
  'clientHeight' | 'clientWidth' | 'offsetLeft' | 'offsetTop' | 'scrollHeight' | 'scrollWidth',
  number
>>) => {
  Object.entries(metrics).forEach(([property, value]) => {
    Object.defineProperty(element, property, {
      configurable: true,
      value,
    })
  })
}

const dispatchMouseEvent = (
  target: EventTarget,
  type: 'mousedown' | 'mousemove' | 'mouseup',
  pageX: number,
  pageY: number
) => {
  const event = new MouseEvent(type, {
    bubbles: true,
    clientX: pageX,
    clientY: pageY,
  })

  target.dispatchEvent(event)
}

afterEach(() => {
  document.body.replaceChildren()
  vi.unstubAllGlobals()
})

describe('scroll utilities', () => {
  test('reads horizontal and vertical element metrics', () => {
    const box = document.createElement('div')
    const slider = document.createElement('div')

    setElementMetrics(box, {
      clientHeight: 100,
      clientWidth: 200,
      scrollHeight: 400,
      scrollWidth: 500,
    })
    slider.style.height = '25px'
    slider.style.width = '80px'

    expect(getScrollRatioX(box)).toBe(0.4)
    expect(getScrollRatio(box, false)).toBe(0.25)
    expect(getScrollDistanceY(box)).toBe(300)
    expect(getScrollDistance(box, true)).toBe(300)
    expect(getClientWidth(box)).toBe(200)
    expect(getClientSize(box, false)).toBe(100)
    expect(getSliderHeight(slider)).toBe(25)
    expect(getSliderSize(slider, true)).toBe(80)
  })

  test('returns safe defaults without measurable elements', () => {
    const box = document.createElement('div')

    expect(getScrollRatioX(null)).toBe(0)
    expect(getScrollRatioX(box)).toBe(0)
    expect(getScrollDistanceY(null)).toBe(0)
    expect(getClientWidth(null)).toBe(0)
    expect(getSliderHeight(null)).toBe(0)
  })

  test('synchronizes slider geometry with vertical and horizontal scrolling', () => {
    const box = document.createElement('div')
    const slider = document.createElement('div')

    setElementMetrics(box, {
      clientHeight: 100,
      clientWidth: 200,
      scrollHeight: 400,
      scrollWidth: 500,
    })
    box.scrollLeft = 50
    box.scrollTop = 100

    expect(syncSlider(box, slider, false)).toBe(true)
    expect(slider.style.height).toBe('25px')
    expect(slider.style.top).toBe('25px')
    expect(slider.style.width).toBe('')

    expect(syncSlider(box, slider, true)).toBe(true)
    expect(slider.style.height).toBe('')
    expect(slider.style.left).toBe('20px')
    expect(slider.style.top).toBe('')
    expect(slider.style.width).toBe('80px')

    setElementMetrics(box, { scrollWidth: 200 })

    expect(syncSlider(box, slider, true)).toBe(false)
  })
})

describe('scroll rail', () => {
  test('requires a slider element', () => {
    expect(() => createRail(document.createElement('div'), {})).toThrow(
      'Slider element not found'
    )
  })

  test('tracks its scroll container, orientation, disabled state, and pointer dragging', () => {
    const resizeObservers: Array<{
      disconnect: ReturnType<typeof vi.fn>;
      observe: ReturnType<typeof vi.fn>;
    }> = []

    vi.stubGlobal('ResizeObserver', class {
      disconnect = vi.fn()
      observe = vi.fn()

      constructor () {
        resizeObservers.push(this)
      }
    })

    const box = document.createElement('div')
    const railElement = document.createElement('div')
    const slider = document.createElement('div')
    const onDragStart = vi.fn()
    const onDragEnd = vi.fn()
    const onToggle = vi.fn()

    slider.className = 'm3-scroll-rail__slider'
    railElement.append(slider)
    box.append(railElement)
    document.body.append(box)

    setElementMetrics(box, {
      clientHeight: 100,
      clientWidth: 200,
      scrollHeight: 400,
      scrollWidth: 500,
    })
    setElementMetrics(slider, {
      offsetLeft: 20,
      offsetTop: 25,
    })
    box.scrollTop = 100

    const rail = createRail(railElement, {
      onDragEnd,
      onDragStart,
      onToggle,
    })

    rail.init()

    expect(resizeObservers).toHaveLength(1)
    expect(resizeObservers[0].observe).toHaveBeenCalledWith(box)
    expect(onToggle).toHaveBeenLastCalledWith(true)
    expect(slider.style.height).toBe('25px')

    dispatchMouseEvent(slider, 'mousedown', 10, 20)
    dispatchMouseEvent(window, 'mousemove', 15, 30)

    expect(onDragStart).toHaveBeenCalledOnce()
    expect(box.scrollTop).toBe(140)
    expect(slider.style.top).toBe('35px')

    dispatchMouseEvent(window, 'mouseup', 15, 30)

    expect(onDragEnd).toHaveBeenCalledOnce()

    box.scrollLeft = 50
    rail.horizontal = true

    expect(rail.horizontal).toBe(true)
    expect(slider.style.left).toBe('20px')
    expect(slider.style.width).toBe('80px')

    rail.disabled = true

    expect(rail.disabled).toBe(true)
    expect(onToggle).toHaveBeenLastCalledWith(false)

    rail.disabled = false

    expect(rail.disabled).toBe(false)
    expect(onToggle).toHaveBeenLastCalledWith(true)

    const nextBox = document.createElement('div')
    setElementMetrics(nextBox, {
      clientWidth: 300,
      scrollWidth: 600,
    })
    nextBox.append(railElement)
    rail.sync()

    expect(resizeObservers[0].disconnect).toHaveBeenCalledOnce()
    expect(resizeObservers[1].observe).toHaveBeenCalledWith(nextBox)

    rail.destroy()

    expect(resizeObservers[1].disconnect).toHaveBeenCalledOnce()
  })

  test('stays inactive while detached or when dragging has no scroll distance', () => {
    vi.stubGlobal('ResizeObserver', class {
      disconnect = vi.fn()
      observe = vi.fn()
    })

    const railElement = document.createElement('div')
    const slider = document.createElement('div')
    const onToggle = vi.fn()

    slider.className = 'm3-scroll-rail__slider'
    railElement.append(slider)

    const rail = createRail(railElement, { onToggle })
    rail.init()

    expect(onToggle).toHaveBeenLastCalledWith(false)

    dispatchMouseEvent(window, 'mousemove', 10, 10)

    const box = document.createElement('div')
    box.append(railElement)
    document.body.append(box)
    rail.sync()

    dispatchMouseEvent(slider, 'mousedown', 10, 10)
    dispatchMouseEvent(window, 'mousemove', 20, 20)

    expect(box.scrollTop).toBe(0)

    rail.destroy()
  })
})
