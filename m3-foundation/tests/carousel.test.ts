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

test('reduced motion also removes parallax from uncontained items and scales hero items', () => {
  const uncontained = carouselGeometry({ ...base, variant: 'uncontained', reduced: true })
  const hero = carouselGeometry({ ...base, variant: 'hero', reduced: true })

  expect(uncontained.frames(100).every(item => item.parallax === 0)).toBe(true)
  expect(hero.frames(0)[0].size).toBeCloseTo((base.width - 32) * .8)
})

test('non-finite preferred size falls back to the standard item width', () => {
  const standard = carouselGeometry({ ...base, variant: 'uncontained' })
  const invalid = carouselGeometry({ ...base, variant: 'uncontained', preferred: Infinity })

  expect(invalid.frames(0)[0].size).toBe(standard.frames(0)[0].size)
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
    releasePointerCapture: { value: vi.fn((id: number) => {
      if (!captured.has(id)) {
        throw new Error('Pointer capture was already released')
      }

      captured.delete(id)
    }) },
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

  return { root, viewport, items, captured, resize: () => resize([], {} as ResizeObserver), disconnect }
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

test('finishes panning when pointer capture disappears before release', () => {
  const { root, viewport, items, captured } = createCarousel()
  const controller = attachCarousel(root, { variant: 'multi-browse', scroll: 'snap', preferred: 280 })

  items[0].dispatchEvent(pointer('pointerdown', 200))
  window.dispatchEvent(pointer('pointermove', 120))
  expect(captured.has(1)).toBe(true)

  captured.delete(1)

  expect(() => window.dispatchEvent(pointer('pointerup', 120))).not.toThrow()
  expect(viewport.releasePointerCapture).not.toHaveBeenCalled()
  expect(viewport.style.userSelect).toBe('')

  controller.dispose()
})

test('an empty carousel can finish a pan without neighboring positions', () => {
  const { root, viewport } = createCarousel(0)
  const controller = attachCarousel(root, { variant: 'multi-browse', scroll: 'snap', preferred: 280 })

  viewport.dispatchEvent(pointer('pointerdown', 200))
  window.dispatchEvent(pointer('pointermove', 150))
  window.dispatchEvent(pointer('pointerup', 150))

  expect(viewport.scrollTo).toHaveBeenCalledWith({ left: 0, behavior: 'smooth' })
  expect(viewport.style.userSelect).toBe('')
  controller.dispose()
})

test('reverse mouse panning snaps to the preceding item and ignores another pointer', () => {
  const { root, viewport, items } = createCarousel()
  const controller = attachCarousel(root, { variant: 'multi-browse', scroll: 'snap', preferred: 280 })

  controller.goTo(2, false)
  const startingOffset = viewport.scrollLeft

  items[2].dispatchEvent(pointer('pointerdown', 100))
  window.dispatchEvent(pointer('pointermove', 200))
  expect(viewport.scrollLeft).toBeLessThan(startingOffset)

  window.dispatchEvent(pointer('pointerup', 200, 2))
  expect(viewport.hasPointerCapture(1)).toBe(true)

  window.dispatchEvent(pointer('pointerup', 200))
  expect(viewport.hasPointerCapture(1)).toBe(false)
  expect(viewport.scrollLeft).toBeCloseTo(carouselGeometry({
    ...base,
    variant: 'multi-browse',
    count: items.length,
  }).positions[1])

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
  items[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }))
  expect(document.activeElement).toBe(items[2])
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

test('smooth keyboard scrolling is not interrupted by snap during the journey', () => {
  vi.useFakeTimers()
  const { root, viewport, items } = createCarousel()
  const controller = attachCarousel(root, { variant: 'multi-browse', scroll: 'snap', preferred: 280 })
  controller.goTo(3, false)

  const scrollTo = vi.mocked(viewport.scrollTo)
  scrollTo.mockClear()
  scrollTo.mockImplementation(() => {})

  items[3].dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }))
  expect(scrollTo).toHaveBeenCalledWith({ left: 0, behavior: 'smooth' })

  viewport.scrollLeft = 400
  viewport.dispatchEvent(new Event('scroll'))
  vi.advanceTimersByTime(100)
  expect(scrollTo).toHaveBeenCalledOnce()

  viewport.scrollLeft = 0
  viewport.dispatchEvent(new Event('scroll'))
  vi.advanceTimersByTime(100)
  expect(scrollTo).toHaveBeenCalledOnce()

  controller.dispose()
})

test.each(['wheel', 'touchstart'])('native %s scrolling takes over a pending smooth scroll', eventType => {
  vi.useFakeTimers()
  const { root, viewport } = createCarousel()
  const controller = attachCarousel(root, { variant: 'multi-browse', scroll: 'snap', preferred: 280 })
  const scrollTo = vi.mocked(viewport.scrollTo)

  scrollTo.mockClear()
  scrollTo.mockImplementation(() => {})
  controller.goTo(3)
  expect(scrollTo).toHaveBeenCalledOnce()

  viewport.scrollLeft = 120
  viewport.dispatchEvent(new Event('scroll'))
  vi.advanceTimersByTime(100)
  expect(scrollTo).toHaveBeenCalledOnce()

  viewport.dispatchEvent(new Event(eventType))
  viewport.dispatchEvent(new Event('scroll'))
  vi.advanceTimersByTime(100)
  expect(scrollTo).toHaveBeenCalledTimes(2)

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
  window.dispatchEvent(pointer('pointercancel', 150, 2))
  expect(viewport.style.userSelect).toBe('none')
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

test('vertical panning uses the pointer Y coordinate and honors the release threshold', () => {
  vi.useFakeTimers()
  const { root, viewport, items } = createCarousel()
  const controller = attachCarousel(root, { variant: 'full-screen', scroll: 'snap', preferred: 280 })

  items[0].dispatchEvent(pointer('pointerdown', 200))
  window.dispatchEvent(pointer('pointermove', 198))
  expect(viewport.scrollTop).toBe(0)
  window.dispatchEvent(pointer('pointermove', 140))
  expect(viewport.scrollTop).toBe(60)
  window.dispatchEvent(pointer('pointerup', 140))
  expect(viewport.scrollTop).toBe(256)

  items[1].dispatchEvent(pointer('pointerdown', 140))
  window.dispatchEvent(pointer('pointermove', 150))
  window.dispatchEvent(pointer('pointerup', 150))
  expect(viewport.scrollTop).toBe(246)
  vi.advanceTimersByTime(100)
  expect(viewport.scrollTop).toBe(256)

  controller.dispose()
})

test('keyboard controls respect disabled items, boundaries, and Space activation', () => {
  const { root, viewport, items } = createCarousel()
  items[0].classList.add('m3-carousel__item_interactive')
  items[1].setAttribute('aria-disabled', 'true')
  const onClick = vi.fn()
  items[0].addEventListener('click', onClick)
  const controller = attachCarousel(root, { variant: 'multi-browse', scroll: 'snap', preferred: 280 })

  items[0].dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }))
  expect(items[0].classList.contains('m3-carousel__item_pressed')).toBe(true)
  items[0].dispatchEvent(new KeyboardEvent('keyup', { key: ' ', bubbles: true }))
  expect(onClick).toHaveBeenCalledOnce()
  items[0].dispatchEvent(new KeyboardEvent('keyup', { key: 'Escape', bubbles: true }))
  items[2].dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', bubbles: true }))
  expect(onClick).toHaveBeenCalledOnce()

  items[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
  expect(document.activeElement).toBe(items[2])
  items[2].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }))
  expect(document.activeElement).toBe(items[0])
  items[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }))
  expect(document.activeElement).toBe(items[0])
  expect(viewport.scrollLeft).toBe(0)

  items[0].setAttribute('aria-disabled', 'true')
  items[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
  expect(items[0].classList.contains('m3-carousel__item_pressed')).toBe(false)
  items[0].dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', bubbles: true }))
  expect(onClick).toHaveBeenCalledOnce()

  controller.dispose()
})

test('ignores keyboard input outside its own items', () => {
  const { root } = createCarousel()
  const controller = attachCarousel(root, { variant: 'multi-browse', scroll: 'snap', preferred: 280 })

  root.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))

  const outerItem = document.createElement('div')
  outerItem.className = 'm3-carousel__item'
  root.before(outerItem)
  outerItem.append(root)
  root.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))

  expect(document.activeElement).toBe(document.body)
  controller.dispose()
})

test('ignores a focused item inserted before the next measurement', () => {
  const { root, viewport } = createCarousel()
  const controller = attachCarousel(root, { variant: 'multi-browse', scroll: 'snap', preferred: 280 })
  const lateItem = document.createElement('div')
  lateItem.className = 'm3-carousel__item'
  root.querySelector('.m3-carousel__stage')!.append(lateItem)
  vi.spyOn(lateItem, 'matches').mockImplementation(selector => selector === ':focus-visible')

  lateItem.dispatchEvent(new FocusEvent('focusin', { bubbles: true }))

  expect(viewport.scrollTo).not.toHaveBeenCalled()
  controller.dispose()
})

test('remeasures when items are added and keeps the selected item after a size change', () => {
  const { root, viewport, items, resize } = createCarousel()
  const onChange = vi.fn()
  const controller = attachCarousel(root, { variant: 'multi-browse', scroll: 'snap', preferred: 280, onChange })

  controller.goTo(1, false)
  resize()
  expect(onChange).toHaveBeenLastCalledWith(1)
  const current = viewport.scrollLeft

  const extra = document.createElement('div')
  extra.className = 'm3-carousel__item'
  extra.tabIndex = 0
  items[1].after(extra)
  Object.defineProperty(root, 'clientWidth', { configurable: true, value: 420 })
  resize()

  expect(extra.dataset.scale).toBeDefined()
  expect(viewport.scrollLeft).not.toBe(current)
  expect(onChange).toHaveBeenLastCalledWith(1)

  controller.dispose()
})

test('starts empty and renders items after they arrive', () => {
  const { root, viewport, resize } = createCarousel(0)
  const onChange = vi.fn()
  const controller = attachCarousel(root, { variant: 'multi-browse', scroll: 'snap', preferred: 280, onChange })

  expect(onChange).not.toHaveBeenCalled()
  controller.goTo(3)
  expect(viewport.scrollTo).toHaveBeenCalledWith({ left: 0, behavior: 'smooth' })

  const item = document.createElement('div')
  item.className = 'm3-carousel__item'
  root.querySelector('.m3-carousel__stage')!.append(item)
  resize()

  expect(item.dataset.scale).toBe('large')
  expect(onChange).toHaveBeenCalledWith(0)
  controller.dispose()
})

test('uses immediate scrolling when reduced motion is requested', () => {
  const { root, viewport, items } = createCarousel()
  vi.stubGlobal('matchMedia', () => ({ matches: true, addEventListener: vi.fn() }))
  const controller = attachCarousel(root, { variant: 'multi-browse', scroll: 'snap', preferred: 280 })

  controller.goTo(2)
  expect(viewport.scrollTo).toHaveBeenCalledWith({ left: expect.any(Number), behavior: 'auto' })
  expect(items.every(item => item.style.getPropertyValue('--m3-carousel-parallax') === '0px')).toBe(true)

  controller.dispose()
})

test('renders the active item after native scrolling', () => {
  const { root, viewport, items } = createCarousel()
  let renderFrame: FrameRequestCallback | undefined
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
    renderFrame = callback
    return 1
  })
  const onChange = vi.fn()
  const controller = attachCarousel(root, {
    variant: 'multi-browse',
    scroll: 'auto',
    preferred: 280,
    onChange,
  })

  viewport.scrollLeft = 200
  viewport.dispatchEvent(new Event('scroll'))
  renderFrame?.(0)

  expect(onChange).toHaveBeenLastCalledWith(1)
  expect(items[1].dataset.scale).toBe('large')
  controller.dispose()
})

test('remeasures after a reduced motion preference change', () => {
  const { root, items } = createCarousel()
  let onChange: EventListener | undefined
  const preference = {
    matches: false,
    addEventListener: vi.fn((_type: string, callback: EventListener) => {
      onChange = callback
    }),
  }
  vi.stubGlobal('matchMedia', () => preference)
  const controller = attachCarousel(root, {
    variant: 'multi-browse',
    scroll: 'snap',
    preferred: 280,
  })

  expect(items.some(item => item.style.getPropertyValue('--m3-carousel-parallax') !== '0px')).toBe(true)

  preference.matches = true
  onChange?.(new Event('change'))

  expect(items.every(item => item.style.getPropertyValue('--m3-carousel-parallax') === '0px')).toBe(true)
  controller.dispose()
})
