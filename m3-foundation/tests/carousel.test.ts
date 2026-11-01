/** @vitest-environment jsdom */

import {
  afterEach,
  expect,
  test,
  vi,
} from 'vitest'

import { attachCarousel } from '../lib/carousel'
import { carouselGeometry } from '../lib/carousel/geometry'

const base = {
  width: 360,
  height: 240,
  count: 8,
  preferred: 280,
  aspects: [],
  reduced: false,
}

test('multi-browse keeps large, medium, and small items separated while they move', () => {
  const geometry = carouselGeometry({ ...base, variant: 'multi-browse' })
  const initial = geometry.frames(0)
  const halfway = geometry.frames(geometry.positions[1] / 2)

  expect(initial.slice(0, 3).map(item => item.scale)).toEqual(['large', 'medium', 'small'])
  expect(initial[2].size).toBeGreaterThanOrEqual(40)
  expect(initial[2].size).toBeLessThanOrEqual(56)
  expect(initial[1].offset - initial[0].offset - initial[0].size).toBeCloseTo(8)
  expect(halfway[1].offset - halfway[0].offset - halfway[0].size).toBeCloseTo(8)
  expect(halfway[0].size).toBeLessThan(initial[0].size)
  expect(halfway[1].size).toBeGreaterThan(initial[1].size)
})

test('hero layouts keep a preview at each required side', () => {
  const hero = carouselGeometry({ ...base, variant: 'hero' }).frames(0)
  const centeredGeometry = carouselGeometry({ ...base, variant: 'hero-centered' })
  const centered = centeredGeometry.frames(centeredGeometry.positions[1])

  expect(hero[0].size).toBeGreaterThan(hero[1].size)
  expect(hero[1].offset).toBeGreaterThan(hero[0].offset)
  expect(centered.some(item => item.offset < centered[1].offset && item.size < centered[1].size)).toBe(true)
  expect(centered.some(item => item.offset > centered[1].offset && item.size < centered[1].size)).toBe(true)
})

test('uncontained layouts preserve widths and support distinct aspect ratios', () => {
  const uniform = carouselGeometry({ ...base, variant: 'uncontained' })
  const mixed = carouselGeometry({ ...base, variant: 'uncontained-multi-aspect', aspects: [16 / 9, 1, 9 / 16] })

  expect(uniform.frames(0)[0].size).toBe(uniform.frames(100)[0].size)
  expect(mixed.frames(0)[0].size).toBeCloseTo(224 * 16 / 9)
  expect(mixed.frames(0)[1].size).toBe(224)
  expect(mixed.frames(0)[2].size).toBeCloseTo(224 * 9 / 16)
  expect(mixed.frames(0)[1].offset - mixed.frames(0)[0].offset - mixed.frames(0)[0].size).toBe(8)
})

test('full-screen uses a vertical viewport-sized item and a 16px gap', () => {
  const geometry = carouselGeometry({ ...base, variant: 'full-screen' })

  expect(geometry.vertical).toBe(true)
  expect(geometry.frames(0)[0].size).toBe(240)
  expect(geometry.frames(0)[1].offset).toBe(256)
  expect(geometry.frames(geometry.positions[1])[1].offset).toBe(0)
})

test('reduced motion uses equal fixed sizes without parallax', () => {
  const geometry = carouselGeometry({ ...base, variant: 'multi-browse', reduced: true })
  const frames = geometry.frames(geometry.positions[1] / 2)

  expect(new Set(frames.map(item => item.size)).size).toBe(1)
  expect(frames.every(item => item.parallax === 0)).toBe(true)
})

const createCarousel = (count = 4) => {
  const root = document.createElement('div')
  const viewport = document.createElement('div')
  const track = document.createElement('div')
  const stage = document.createElement('div')
  const items = Array.from({ length: count }, () => document.createElement('div'))
  const captured = new Set<number>()

  root.className = 'm3-carousel'
  viewport.className = 'm3-carousel__scroll'
  track.className = 'm3-carousel__track'
  stage.className = 'm3-carousel__stage'
  items.forEach(item => {
    item.className = 'm3-carousel__item'
    item.tabIndex = 0
    stage.append(item)
  })
  track.append(stage)
  viewport.append(track)
  root.append(viewport)
  document.body.append(root)

  Object.defineProperties(root, {
    clientWidth: { configurable: true, value: 360 },
    clientHeight: { configurable: true, value: 240 },
  })
  Object.defineProperties(viewport, {
    scrollTo: {
      value: vi.fn(({ left, top }: ScrollToOptions) => {
        if (left !== undefined) viewport.scrollLeft = left
        if (top !== undefined) viewport.scrollTop = top
        viewport.dispatchEvent(new Event('scroll'))
      }),
    },
    setPointerCapture: { value: vi.fn((id: number) => captured.add(id)) },
    hasPointerCapture: { value: vi.fn((id: number) => captured.has(id)) },
    releasePointerCapture: { value: vi.fn((id: number) => captured.delete(id)) },
  })

  let resize: ResizeObserverCallback = () => {}
  const disconnect = vi.fn()
  vi.stubGlobal('ResizeObserver', class {
    constructor (callback: ResizeObserverCallback) { resize = callback }
    observe = vi.fn()
    disconnect = disconnect
  })
  vi.stubGlobal('matchMedia', () => ({ matches: false, addEventListener: vi.fn() }))
  vi.stubGlobal('requestAnimationFrame', () => 1)
  vi.stubGlobal('cancelAnimationFrame', vi.fn())

  return { root, viewport, items, resize: () => resize([], {} as ResizeObserver), disconnect }
}

const pointer = (type: string, x: number, id = 1, pointerType = 'mouse') => Object.assign(
  new Event(type, { bubbles: true, cancelable: true }),
  { pointerId: id, pointerType, button: 0, clientX: x, clientY: x }
)

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
  document.body.replaceChildren()
})

test('controller measures items, follows selection, and switches orientation', () => {
  const { root, viewport, items, resize, disconnect } = createCarousel()
  const onChange = vi.fn()
  const controller = attachCarousel(root, {
    variant: 'multi-browse',
    scroll: 'snap',
    preferred: 280,
    onChange,
  })

  expect(onChange).toHaveBeenCalledWith(0)
  expect(items[0].dataset.scale).toBe('large')
  controller.goTo(1, false)
  resize()
  expect(onChange).toHaveBeenLastCalledWith(1)
  expect(items[1].dataset.scale).toBe('large')

  controller.update({ variant: 'full-screen', scroll: 'snap', preferred: 280, onChange })
  controller.goTo(2, false)
  resize()
  expect(viewport.scrollTop).toBe(512)
  expect(onChange).toHaveBeenLastCalledWith(2)
  expect(items[2].style.getPropertyValue('--m3-carousel-size')).toBe('240px')

  controller.goTo(1, false)
  controller.dispose()
  expect(disconnect).toHaveBeenCalledOnce()
  expect(cancelAnimationFrame).toHaveBeenCalled()
})

test('mouse panning captures the pointer, snaps, and suppresses its click', () => {
  vi.useFakeTimers()
  const { root, viewport, items, resize } = createCarousel()
  const controller = attachCarousel(root, { variant: 'multi-browse', scroll: 'snap', preferred: 280 })
  const onClick = vi.fn()
  items[0].addEventListener('click', onClick)

  items[0].dispatchEvent(pointer('pointerdown', 200))
  window.dispatchEvent(pointer('pointermove', 195))
  expect(viewport.style.userSelect).toBe('none')
  expect(viewport.scrollLeft).toBe(5)

  window.dispatchEvent(pointer('pointermove', 120))
  expect(viewport.scrollLeft).toBe(80)
  expect(viewport.hasPointerCapture(1)).toBe(true)
  window.dispatchEvent(pointer('pointerup', 120))
  expect(viewport.scrollLeft).toBeGreaterThan(80)
  expect(viewport.hasPointerCapture(1)).toBe(false)
  expect(viewport.style.userSelect).toBe('')

  items[0].click()
  expect(onClick).not.toHaveBeenCalled()
  items[0].click()
  expect(onClick).toHaveBeenCalledOnce()

  viewport.scrollLeft = 120
  viewport.dispatchEvent(new Event('scroll'))
  vi.advanceTimersByTime(100)
  resize()
  expect(viewport.scrollLeft).toBeCloseTo(174.3)
  controller.dispose()
})

test('keyboard navigation skips disabled items and activates interactive items', () => {
  const { root, viewport, items, resize } = createCarousel()
  root.style.direction = 'rtl'
  items[1].setAttribute('aria-disabled', 'true')
  items[3].classList.add('m3-carousel__item_interactive')
  const onClick = vi.fn()
  items[3].addEventListener('click', onClick)
  const controller = attachCarousel(root, { variant: 'multi-browse', scroll: 'snap', preferred: 280 })

  items[2].focus()
  items[2].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
  expect(document.activeElement).toBe(items[0])
  items[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }))
  expect(document.activeElement).toBe(items[3])
  items[3].dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
  expect(items[3].classList.contains('m3-carousel__item_pressed')).toBe(true)
  items[3].dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', bubbles: true }))
  expect(onClick).toHaveBeenCalledOnce()

  items[3].dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }))
  expect(document.activeElement).toBe(items[0])
  resize()
  expect(viewport.scrollLeft).toBe(0)

  controller.update({ variant: 'full-screen', scroll: 'snap', preferred: 280 })
  items[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
  expect(document.activeElement).toBe(items[2])
  items[2].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }))
  expect(document.activeElement).toBe(items[0])
  controller.dispose()
})

test('touch and controls do not start a mouse pan, and canceled pans release selection', () => {
  const { root, viewport, items } = createCarousel()
  const button = document.createElement('button')
  items[0].append(button)
  const controller = attachCarousel(root, { variant: 'multi-browse', scroll: 'auto', preferred: 280 })

  button.dispatchEvent(pointer('pointerdown', 200))
  window.dispatchEvent(pointer('pointermove', 100))
  expect(viewport.scrollLeft).toBe(0)
  items[0].dispatchEvent(pointer('pointerdown', 200, 2, 'touch'))
  window.dispatchEvent(pointer('pointermove', 100, 2, 'touch'))
  expect(viewport.scrollLeft).toBe(0)

  items[0].dispatchEvent(pointer('pointerdown', 200))
  window.dispatchEvent(pointer('pointermove', 150))
  expect(viewport.scrollLeft).toBe(50)
  window.dispatchEvent(pointer('pointercancel', 150))
  expect(viewport.style.userSelect).toBe('')
  controller.dispose()
})

test('free scrolling stays free and a native drag is blocked only during a mouse pan', () => {
  vi.useFakeTimers()
  const { root, viewport, items } = createCarousel()
  const controller = attachCarousel(root, { variant: 'multi-browse', scroll: 'auto', preferred: 280 })

  viewport.scrollLeft = 80
  viewport.dispatchEvent(new Event('scroll'))
  vi.advanceTimersByTime(100)
  expect(viewport.scrollLeft).toBe(80)

  const nativeDrag = () => new Event('dragstart', { bubbles: true, cancelable: true })
  const before = nativeDrag()
  items[0].dispatchEvent(before)
  expect(before.defaultPrevented).toBe(false)

  items[0].dispatchEvent(pointer('pointerdown', 200))
  const during = nativeDrag()
  items[0].dispatchEvent(during)
  expect(during.defaultPrevented).toBe(true)
  window.dispatchEvent(pointer('pointercancel', 200))

  const after = nativeDrag()
  items[0].dispatchEvent(after)
  expect(after.defaultPrevented).toBe(false)

  controller.update({ variant: 'multi-browse', scroll: 'snap', preferred: 280 })
  items[0].dispatchEvent(pointer('pointerdown', 200))
  viewport.scrollLeft = 120
  viewport.dispatchEvent(new Event('scroll'))
  vi.advanceTimersByTime(100)
  expect(viewport.scrollLeft).toBe(120)
  window.dispatchEvent(pointer('pointercancel', 200))
  viewport.dispatchEvent(new Event('scroll'))
  vi.advanceTimersByTime(100)
  expect(viewport.scrollLeft).toBeCloseTo(174.3)
  controller.dispose()
})
