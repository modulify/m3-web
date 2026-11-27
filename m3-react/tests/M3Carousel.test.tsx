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

test('renders named carousel items in declaration order and moves focus with arrows', () => {
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

test('stores different aspect ratios for uncontained items', () => {
  render(<M3Carousel variant="uncontained-multi-aspect">
    <M3CarouselItem aspect={16 / 9} aria-label="Wide">Wide image</M3CarouselItem>
    <M3CarouselItem aspect={9 / 16} aria-label="Tall">Tall image</M3CarouselItem>
  </M3Carousel>)

  expect(screen.getAllByRole('group').map(item => item.getAttribute('data-aspect'))).toEqual([
    String(16 / 9),
    String(9 / 16),
  ])
})

test('renders an empty carousel and bare items without content', () => {
  const empty = render(<M3Carousel />)

  expect(empty.getByRole('region', { name: 'Carousel' }).querySelector('.m3-carousel__item')).toBeNull()

  empty.unmount()

  const bare = render(<M3Carousel><M3CarouselItem /></M3Carousel>)

  expect(bare.getByRole('group').querySelector('.m3-carousel__content')?.childElementCount).toBe(0)
})

test('exposes its rendered root and programmatic navigation', () => {
  const ref = createRef<M3CarouselExposed>()
  const view = render(<M3Carousel ref={ref}>
    <M3CarouselItem>First</M3CarouselItem>
    <M3CarouselItem>Second</M3CarouselItem>
  </M3Carousel>)

  expect(ref.current?.el).toBe(view.getByRole('region', { name: 'Carousel' }))

  ref.current?.goTo(1, false)
  expect(HTMLElement.prototype.scrollTo).toHaveBeenCalledWith({ left: expect.any(Number), behavior: 'auto' })

  view.unmount()
  expect(ref.current).toBeNull()
})

test('applies a controlled position, height, and labels to keyed items', () => {
  render(<M3Carousel index={1} height={240} scroll="auto">
    <M3CarouselItem key="first" aria-label="First">First</M3CarouselItem>
    <M3CarouselItem key="second" aria-label="Second">Second</M3CarouselItem>
  </M3Carousel>)

  const region = screen.getByRole('region', { name: 'Carousel' })

  expect(region.style.height).toBe('240px')
  expect(screen.getAllByRole('group').map(item => item.getAttribute('aria-label'))).toEqual([
    'First, 1 of 2',
    'Second, 2 of 2',
  ])
  expect(HTMLElement.prototype.scrollTo).toHaveBeenCalledWith({ left: expect.any(Number), behavior: 'auto' })
})

test('item descriptors do not render outside a carousel', () => {
  const view = render(<M3CarouselItem aria-label="First">First</M3CarouselItem>)

  expect(view.container.childElementCount).toBe(0)
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
