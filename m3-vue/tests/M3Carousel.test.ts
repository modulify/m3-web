import { fireEvent } from '@testing-library/vue'
import { h, nextTick } from 'vue'
import { render, screen } from '@testing-library/vue'

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

test('renders named carousel items in slot order and moves focus with arrows', async () => {
  const view = render(M3Carousel, {
    attrs: { 'aria-label': 'Places' },
    slots: { default: () => [
      h(M3CarouselItem, { 'aria-label': 'Mountains' }, { default: () => 'Mountain image' }),
      h(M3CarouselItem, { 'aria-label': 'Coast' }, { default: () => 'Coast image' }),
      h(M3CarouselItem, { 'aria-label': 'Forest' }, { default: () => 'Forest image' }),
    ] },
  })
  await nextTick()

  expect(screen.getByRole('region', { name: 'Places' }).getAttribute('aria-roledescription')).toBe('carousel')
  const items = screen.getAllByRole('group')
  expect(items.map(item => item.getAttribute('aria-label'))).toEqual([
    'Mountains, 1 of 3',
    'Coast, 2 of 3',
    'Forest, 3 of 3',
  ])

  items[0].focus()
  await fireEvent.keyDown(items[0], { key: 'ArrowRight' })
  expect(document.activeElement).toBe(items[1])
  expect(view.emitted().change?.[0]).toEqual([0])
})

test('stores different aspect ratios for uncontained items', async () => {
  render(M3Carousel, {
    props: { variant: 'uncontained-multi-aspect' },
    slots: { default: () => [
      h(M3CarouselItem, { aspect: 16 / 9, 'aria-label': 'Wide' }, { default: () => 'Wide image' }),
      h(M3CarouselItem, { aspect: 9 / 16, 'aria-label': 'Tall' }, { default: () => 'Tall image' }),
    ] },
  })
  await nextTick()

  expect(screen.getAllByRole('group').map(item => item.getAttribute('data-aspect'))).toEqual([
    String(16 / 9),
    String(9 / 16),
  ])
})

test('activates interactive items with pointer and keyboard and skips disabled items', async () => {
  const activate = vi.fn()
  const disabled = vi.fn()
  render(M3Carousel, {
    attrs: { 'aria-label': 'Places' },
    slots: { default: () => [
      h(M3CarouselItem, {
        interactive: true,
        'aria-label': 'Mountains',
        onClick: activate,
      }, { default: () => 'Mountains' }),
      h(M3CarouselItem, {
        interactive: true,
        disabled: true,
        'aria-label': 'Museum',
        onClick: disabled,
      }, { default: () => 'Museum' }),
      h(M3CarouselItem, { interactive: true, 'aria-label': 'Garden', onClick: activate }, { default: () => 'Garden' }),
    ] },
  })
  await nextTick()

  const region = screen.getByRole('region', { name: 'Places' })
  const items = Array.from(region.querySelectorAll<HTMLElement>('.m3-carousel__item'))
  expect(screen.getAllByRole('button').map(item => item.getAttribute('aria-label'))).toEqual([
    'Mountains, 1 of 3', 'Museum, 2 of 3', 'Garden, 3 of 3',
  ])
  expect(items[1].getAttribute('aria-disabled')).toBe('true')
  expect(items[1].tabIndex).toBe(-1)
  expect(items[1].querySelector('.m3-ripple')).toBeNull()

  await fireEvent.click(items[0])
  items[0].focus()
  const space = new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true })
  expect(items[0].dispatchEvent(space)).toBe(false)
  expect(items[0].classList.contains('m3-carousel__item_pressed')).toBe(true)
  await fireEvent.keyUp(items[0], { key: ' ' })
  expect(items[0].classList.contains('m3-carousel__item_pressed')).toBe(false)
  await fireEvent.keyUp(items[0], { key: 'Enter' })
  expect(activate).toHaveBeenCalledTimes(3)

  await fireEvent.keyDown(items[0], { key: 'ArrowRight' })
  expect(document.activeElement).toBe(items[2])
  await fireEvent.click(items[1])
  await fireEvent.keyUp(items[1], { key: 'Enter' })
  expect(disabled).not.toHaveBeenCalled()
})
