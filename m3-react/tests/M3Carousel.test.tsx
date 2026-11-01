import type { M3CarouselExposed } from '@/components/carousel'

import { createRef } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import { M3Carousel, M3CarouselItem } from '@/components/carousel'

beforeEach(() => {
  vi.stubGlobal('ResizeObserver', class {
    observe() {}
    disconnect() {}
  })
  vi.stubGlobal('matchMedia', () => ({ matches: false, addEventListener: () => {} }))
  Object.defineProperty(HTMLElement.prototype, 'scrollTo', { configurable: true, value: vi.fn() })
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
  delete (HTMLElement.prototype as Partial<HTMLElement>).scrollTo
})

test('renders named carousel items in template order and moves focus with arrows', () => {
  const onChange = vi.fn()
  render(<M3Carousel aria-label="Places" onChange={onChange}>
    <M3CarouselItem aria-label="Mountains">Mountain image</M3CarouselItem>
    <M3CarouselItem aria-label="Coast">Coast image</M3CarouselItem>
    <M3CarouselItem aria-label="Forest">Forest image</M3CarouselItem>
  </M3Carousel>)

  expect(screen.getByRole('region', { name: 'Places' }).getAttribute('aria-roledescription')).toBe('carousel')
  const items = screen.getAllByRole('group')
  expect(items.map(item => item.getAttribute('aria-label'))).toEqual([
    'Mountains, 1 of 3',
    'Coast, 2 of 3',
    'Forest, 3 of 3',
  ])

  items[0].focus()
  fireEvent.keyDown(items[0], { key: 'ArrowRight' })
  expect(document.activeElement).toBe(items[1])
  expect(onChange).toHaveBeenCalledWith(0)
})

test('exposes programmatic navigation and keeps aspect ratios on items', () => {
  const ref = createRef<M3CarouselExposed>()
  render(<M3Carousel ref={ref} variant="uncontained-multi-aspect">
    <M3CarouselItem aspect={16 / 9} aria-label="Wide">Wide image</M3CarouselItem>
    <M3CarouselItem aspect={9 / 16} aria-label="Tall">Tall image</M3CarouselItem>
  </M3Carousel>)

  expect(screen.getAllByRole('group').map(item => item.getAttribute('data-aspect'))).toEqual([
    String(16 / 9),
    String(9 / 16),
  ])
  ref.current?.goTo(1, false)
  expect(HTMLElement.prototype.scrollTo).toHaveBeenCalled()
})

test('activates interactive items with pointer and keyboard and skips disabled items', () => {
  const activate = vi.fn()
  const disabled = vi.fn()
  render(<M3Carousel aria-label="Places">
    <M3CarouselItem aria-label="Mountains" interactive onClick={activate}>Mountains</M3CarouselItem>
    <M3CarouselItem aria-label="Museum" interactive disabled onClick={disabled}>Museum</M3CarouselItem>
    <M3CarouselItem aria-label="Garden" interactive onClick={activate}>Garden</M3CarouselItem>
  </M3Carousel>)

  const region = screen.getByRole('region', { name: 'Places' })
  const items = Array.from(region.querySelectorAll<HTMLElement>('.m3-carousel__item'))
  expect(screen.getAllByRole('button').map(item => item.getAttribute('aria-label'))).toEqual([
    'Mountains, 1 of 3', 'Museum, 2 of 3', 'Garden, 3 of 3',
  ])
  expect(items[1].getAttribute('aria-disabled')).toBe('true')
  expect(items[1].tabIndex).toBe(-1)
  expect(items[1].querySelector('.m3-ripple')).toBeNull()

  fireEvent.click(items[0])
  items[0].focus()
  expect(fireEvent.keyDown(items[0], { key: ' ' })).toBe(false)
  expect(items[0].classList.contains('m3-carousel__item_pressed')).toBe(true)
  fireEvent.keyUp(items[0], { key: ' ' })
  expect(items[0].classList.contains('m3-carousel__item_pressed')).toBe(false)
  fireEvent.keyUp(items[0], { key: 'Enter' })
  expect(activate).toHaveBeenCalledTimes(3)

  fireEvent.keyDown(items[0], { key: 'ArrowRight' })
  expect(document.activeElement).toBe(items[2])
  fireEvent.click(items[1])
  fireEvent.keyUp(items[1], { key: 'Enter' })
  expect(disabled).not.toHaveBeenCalled()
})
