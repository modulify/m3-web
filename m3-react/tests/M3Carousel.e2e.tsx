import type { M3CarouselExposed } from '@/components/carousel'

import { act, createRef } from 'react'
import { page } from 'vitest/browser'
import { render } from '@testing-library/react'
import { userEvent } from 'vitest/browser'
import { waitFor } from '@testing-library/react'

import { M3Carousel, M3CarouselItem } from '@/components/carousel'

test('multi-browse changes visible item widths and keeps gaps while scrolling', async () => {
  await page.viewport(360, 640)
  const ref = createRef<M3CarouselExposed>()
  const view = render(<div style={{ width: 360 }}>
    <M3Carousel ref={ref} height={240} aria-label="Places">
      {Array.from({ length: 8 }, (_, index) => <M3CarouselItem key={index} aria-label={`Place ${index + 1}`}>
        <div style={{ width: '100%', height: '100%', background: 'purple' }} />
      </M3CarouselItem>)}
    </M3Carousel>
  </div>)

  try {
    const root = view.container.querySelector<HTMLElement>('.m3-carousel')!
    const items = Array.from(root.querySelectorAll<HTMLElement>('.m3-carousel__item'))

    await waitFor(() => {
      expect(items[0].getBoundingClientRect().width).toBeGreaterThan(items[1].getBoundingClientRect().width)
    })
    expect(items[1].getBoundingClientRect().width).toBeGreaterThan(items[2].getBoundingClientRect().width)
    expect(items[2].getBoundingClientRect().width).toBeGreaterThanOrEqual(40)
    expect(items[2].getBoundingClientRect().width).toBeLessThanOrEqual(56)
    expect(items[1].getBoundingClientRect().left - items[0].getBoundingClientRect().right).toBeCloseTo(8, 0)

    act(() => ref.current?.goTo(1, false))
    await waitFor(() => {
      expect(items[1].getBoundingClientRect().width).toBeGreaterThan(items[0].getBoundingClientRect().width)
    })
    expect(items[1].getBoundingClientRect().left).toBeCloseTo(root.getBoundingClientRect().left + 16, 0)
    expect(items[2].getBoundingClientRect().left - items[1].getBoundingClientRect().right).toBeCloseTo(8, 0)

    const previousWidth = items[1].getBoundingClientRect().width
    const wrapper = view.container.firstElementChild as HTMLElement
    wrapper.style.width = '900px'
    await waitFor(() => expect(items[1].getBoundingClientRect().width).toBeGreaterThan(previousWidth))
    expect(items[1].getBoundingClientRect().left).toBeCloseTo(root.getBoundingClientRect().left + 16, 0)
  } finally {
    view.unmount()
  }
})

test('keeps foreground text anchored while the visual layer moves with parallax', async () => {
  const ref = createRef<M3CarouselExposed>()
  const view = render(<div style={{ width: 360 }}>
    <M3Carousel ref={ref} aria-label="Places">
      {['First', 'Second', 'Third', 'Fourth'].map(name => <M3CarouselItem
        key={name}
        aria-label={name}
        media={<div style={{ width: '100%', height: '100%', background: 'purple' }} />}
      >
        <span style={{ position: 'absolute', left: 24, bottom: 24 }}>{name}</span>
      </M3CarouselItem>)}
    </M3Carousel>
  </div>)

  try {
    const item = view.container.querySelectorAll<HTMLElement>('.m3-carousel__item')[1]
    const media = item.querySelector<HTMLElement>('.m3-carousel__media')!
    const caption = item.querySelector<HTMLElement>('.m3-carousel__content span')!
    await waitFor(() => expect(item.getBoundingClientRect().width).toBeGreaterThan(0))
    const widthBefore = item.getBoundingClientRect().width
    const mediaBefore = media.getBoundingClientRect().left - item.getBoundingClientRect().left

    act(() => ref.current?.goTo(1, false))
    await waitFor(() => expect(item.getBoundingClientRect().width).toBeGreaterThan(widthBefore))
    expect(caption.getBoundingClientRect().left - item.getBoundingClientRect().left).toBeCloseTo(24, 0)
    expect(media.getBoundingClientRect().left - item.getBoundingClientRect().left).not.toBeCloseTo(mediaBefore, 0)
  } finally {
    view.unmount()
  }
})

test('full-screen scrolls vertically one item at a time', async () => {
  const ref = createRef<M3CarouselExposed>()
  const view = render(<div style={{ width: 320 }}>
    <M3Carousel ref={ref} variant="full-screen" height={400} aria-label="Stories">
      <M3CarouselItem aria-label="First">First story</M3CarouselItem>
      <M3CarouselItem aria-label="Second">Second story</M3CarouselItem>
    </M3Carousel>
  </div>)

  try {
    const root = view.container.querySelector<HTMLElement>('.m3-carousel')!
    const scroller = root.querySelector<HTMLElement>('.m3-carousel__scroll')!
    const second = root.querySelectorAll<HTMLElement>('.m3-carousel__item')[1]

    act(() => ref.current?.goTo(1, false))
    await waitFor(() => expect(scroller.scrollTop).toBe(416))
    await waitFor(() => expect(second.getBoundingClientRect().top).toBeCloseTo(root.getBoundingClientRect().top, 0))
  } finally {
    view.unmount()
  }
})

test('keyboard navigation moves focus and free scrolling snaps to an item', async () => {
  const view = render(<div style={{ width: 360 }}>
    <M3Carousel height={240} aria-label="Places">
      {['First', 'Second', 'Third', 'Fourth'].map(name =>
        <M3CarouselItem key={name} aria-label={name}>{name}</M3CarouselItem>
      )}
    </M3Carousel>
  </div>)

  try {
    const scroller = view.container.querySelector<HTMLElement>('.m3-carousel__scroll')!
    const items = Array.from(view.container.querySelectorAll<HTMLElement>('.m3-carousel__item'))
    items[0].focus()
    items[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
    expect(document.activeElement).toBe(items[1])
    await waitFor(() => expect(scroller.scrollLeft).toBeGreaterThan(0))

    items[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }))
    expect(document.activeElement).toBe(items[3])
    items[3].dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }))
    expect(document.activeElement).toBe(items[0])
    await waitFor(() => expect(scroller.scrollLeft).toBeCloseTo(0, 0), { timeout: 2500 })

    const step = (scroller.scrollWidth - scroller.clientWidth) / (items.length - 1)
    scroller.scrollLeft = step * .8
    await waitFor(() => expect(scroller.scrollLeft).toBeCloseTo(step, 0), { timeout: 2500 })
  } finally {
    view.unmount()
  }
})

test('uncontained carousel reports the final item at the scroll limit', async () => {
  const ref = createRef<M3CarouselExposed>()
  let active = -1
  const view = render(<div style={{ width: 360 }}>
    <M3Carousel ref={ref} variant="uncontained" preferred={80} onChange={index => active = index}>
      {Array.from({ length: 8 }, (_, index) => <M3CarouselItem key={index}>{index}</M3CarouselItem>)}
    </M3Carousel>
  </div>)

  try {
    act(() => ref.current?.goTo(7, false))
    await waitFor(() => expect(active).toBe(7))
  } finally {
    view.unmount()
  }
})

test('mouse drag over item text pans without selecting it', async () => {
  let clicks = 0
  let itemClicks = 0
  const view = render(<div style={{ width: 360 }}>
    <M3Carousel height={240} aria-label="Places">
      {Array.from({ length: 8 }, (_, index) =>
        <M3CarouselItem
          key={index}
          aria-label={`Place ${index + 1}`}
          onClick={() => itemClicks++}
        >
          <span>Place {index + 1}</span>
          {index === 0 && <button onClick={() => clicks++}>Open</button>}
        </M3CarouselItem>
      )}
    </M3Carousel>
  </div>)

  try {
    const scroller = view.container.querySelector<HTMLElement>('.m3-carousel__scroll')!
    const items = view.container.querySelectorAll<HTMLElement>('.m3-carousel__item')
    await userEvent.dragAndDrop(items[1], items[0])
    await waitFor(() => expect(scroller.scrollLeft).toBeGreaterThan(0))
    expect(window.getSelection()?.toString()).toBe('')
    await userEvent.click(view.getByRole('button', { name: 'Open' }))
    expect(clicks).toBe(1)
    await userEvent.click(items[1])
    expect(itemClicks).toBeGreaterThan(0)
    expect(document.activeElement).toBe(items[1])
    items[1].dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerType: 'mouse', button: 0 }))
    expect(scroller.style.userSelect).toBe('none')
    window.dispatchEvent(new PointerEvent('pointercancel', { pointerType: 'mouse' }))
    expect(scroller.style.userSelect).toBe('')
  } finally {
    view.unmount()
  }
})

test('mouse drag over an image pans instead of starting native image drag', async () => {
  const view = render(<div style={{ width: 360 }}>
    <M3Carousel variant="uncontained" preferred={180} scroll="auto" aria-label="Places">
      <M3CarouselItem>First</M3CarouselItem>
      <M3CarouselItem>
        <img
          src="data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA="
          alt="Second"
          style={{ width: '100%', height: '100%' }}
        />
      </M3CarouselItem>
      <M3CarouselItem>Third</M3CarouselItem>
      <M3CarouselItem>Fourth</M3CarouselItem>
    </M3Carousel>
  </div>)

  try {
    const scroller = view.container.querySelector<HTMLElement>('.m3-carousel__scroll')!
    const image = view.container.querySelector('img')!
    const first = view.container.querySelector<HTMLElement>('.m3-carousel__item')!
    await userEvent.dragAndDrop(image, first)
    await waitFor(() => expect(scroller.scrollLeft).toBeGreaterThan(0))
  } finally {
    view.unmount()
  }
})

test('a short mouse pan advances a snapping carousel', async () => {
  const view = render(<div style={{ width: 360 }}>
    <M3Carousel height={240} aria-label="Places">
      <M3CarouselItem>
        <div style={{ position: 'relative', height: '100%' }}>
          <span data-testid="pan-start" style={{ position: 'absolute', left: 120 }}>Start</span>
          <span data-testid="pan-end" style={{ position: 'absolute', left: 80 }}>End</span>
        </div>
      </M3CarouselItem>
      {Array.from({ length: 5 }, (_, index) => <M3CarouselItem key={index}>Place {index + 2}</M3CarouselItem>)}
    </M3Carousel>
  </div>)

  try {
    const scroller = view.container.querySelector<HTMLElement>('.m3-carousel__scroll')!
    const first = view.container.querySelector<HTMLElement>('.m3-carousel__item')!
    const step = first.getBoundingClientRect().width + 8
    await userEvent.dragAndDrop(view.getByTestId('pan-start'), view.getByTestId('pan-end'))
    await waitFor(() => expect(scroller.scrollLeft).toBeCloseTo(step, 0), { timeout: 2500 })
  } finally {
    view.unmount()
  }
})

test.each([
  { position: 'start', disabled: 1, initial: 0, from: 1, to: 0, direction: 1 },
  { position: 'end', disabled: 2, initial: 1, from: 1, to: 2, direction: -1 },
])('mouse pan can $position on a disabled item', async ({ disabled, initial, from, to, direction }) => {
  const ref = createRef<M3CarouselExposed>()
  const view = render(<div style={{ width: 360 }}>
    <M3Carousel ref={ref} aria-label="Places">
      {Array.from({ length: 6 }, (_, index) =>
        <M3CarouselItem key={index} disabled={index === disabled} interactive>Place {index + 1}</M3CarouselItem>
      )}
    </M3Carousel>
  </div>)

  try {
    const scroller = view.container.querySelector<HTMLElement>('.m3-carousel__scroll')!
    const items = view.container.querySelectorAll<HTMLElement>('.m3-carousel__item')
    await waitFor(() => expect(items[1].getBoundingClientRect().width).toBeGreaterThan(0))

    act(() => ref.current?.goTo(initial, false))
    if (initial) await waitFor(() => expect(scroller.scrollLeft).toBeGreaterThan(0))
    const before = scroller.scrollLeft

    await userEvent.dragAndDrop(items[from], items[to])
    await vi.waitFor(() => expect((scroller.scrollLeft - before) * direction).toBeGreaterThan(0))
  } finally {
    view.unmount()
  }
})

test.each([
  { key: 'Home', target: 0 },
  { key: 'ArrowLeft', target: 2 },
])('moving focus backward with $key does not jump the scroll position', async ({ key, target }) => {
  const ref = createRef<M3CarouselExposed>()
  const view = render(<div style={{ width: 360 }}>
    <M3Carousel ref={ref} aria-label="Places">
      {Array.from({ length: 6 }, (_, index) =>
        <M3CarouselItem key={index}>Place {index + 1}</M3CarouselItem>
      )}
    </M3Carousel>
  </div>)

  try {
    const scroller = view.container.querySelector<HTMLElement>('.m3-carousel__scroll')!
    const items = view.container.querySelectorAll<HTMLElement>('.m3-carousel__item')
    act(() => ref.current?.goTo(3, false))
    await waitFor(() => expect(scroller.scrollLeft).toBeGreaterThan(500))
    items[3].focus({ preventScroll: true })
    const before = scroller.scrollLeft
    const offsets: number[] = []
    scroller.addEventListener('scroll', () => offsets.push(scroller.scrollLeft))

    items[3].dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))

    expect(document.activeElement).toBe(items[target])
    await vi.waitFor(() => expect(offsets.length).toBeGreaterThan(0))
    expect(offsets[0]).toBeGreaterThan(before - 50)
    await vi.waitFor(() => expect(scroller.scrollLeft).toBeLessThan(target ? before - 50 : 50))
  } finally {
    view.unmount()
  }
})

test('interactive items ripple and activate while disabled items remain inert', async () => {
  let activations = 0
  const view = render(<div style={{ width: 360 }}>
    <M3Carousel aria-label="Places">
      <M3CarouselItem aria-label="Mountains" interactive onClick={() => activations++}>Mountains</M3CarouselItem>
      <M3CarouselItem aria-label="Museum" interactive disabled onClick={() => activations++}>Museum</M3CarouselItem>
      <M3CarouselItem aria-label="Garden" interactive onClick={() => activations++}>Garden</M3CarouselItem>
    </M3Carousel>
  </div>)

  try {
    const items = view.container.querySelectorAll<HTMLElement>('.m3-carousel__item')
    await userEvent.click(items[0])
    expect(activations).toBe(1)
    await waitFor(() => expect(items[0].querySelector<HTMLElement>('.m3-ripple')?.style.display).toBe('inline-block'))

    items[0].focus()
    const space = new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true })
    expect(items[0].dispatchEvent(space)).toBe(false)
    expect(items[0].classList.contains('m3-carousel__item_pressed')).toBe(true)
    items[0].dispatchEvent(new KeyboardEvent('keyup', { key: ' ', code: 'Space', bubbles: true }))
    expect(items[0].classList.contains('m3-carousel__item_pressed')).toBe(false)
    expect(activations).toBe(2)

    items[0].dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', code: 'Enter', bubbles: true }))
    expect(activations).toBe(3)
    const ripple = items[0].querySelector<HTMLElement>('.m3-ripple')!
    expect(parseFloat(ripple.style.left)).toBeCloseTo((items[0].clientWidth - parseFloat(ripple.style.width)) / 2, 0)

    const itemRect = items[0].getBoundingClientRect()
    items[0].dispatchEvent(new MouseEvent('click', {
      bubbles: true,
      clientX: itemRect.left + 20,
      clientY: itemRect.top + 20,
    }))
    expect(activations).toBe(4)
    expect(parseFloat(ripple.style.left)).toBeLessThan(0)

    items[1].click()
    expect(activations).toBe(4)
    expect(items[1].getAttribute('aria-disabled')).toBe('true')
    expect(getComputedStyle(items[1]).opacity).toBe('0.38')
  } finally {
    view.unmount()
  }
})

test('clicking a neighboring interactive item activates it without scrolling', async () => {
  let activations = 0
  const view = render(<div style={{ width: 360 }}>
    <M3Carousel aria-label="Places">
      {Array.from({ length: 4 }, (_, index) =>
        <M3CarouselItem key={index} interactive onClick={() => activations++}>
          Place {index + 1}
        </M3CarouselItem>
      )}
    </M3Carousel>
  </div>)

  try {
    const scroller = view.container.querySelector<HTMLElement>('.m3-carousel__scroll')!
    const items = view.container.querySelectorAll<HTMLElement>('.m3-carousel__item')
    await waitFor(() => expect(items[1].getBoundingClientRect().width).toBeGreaterThan(0))

    await userEvent.click(items[0])
    const scrollTo = vi.spyOn(scroller, 'scrollTo')
    await userEvent.click(items[1])

    expect(activations).toBe(2)
    expect(document.activeElement).toBe(items[1])
    expect(scrollTo).not.toHaveBeenCalled()
    expect(scroller.scrollLeft).toBe(0)
  } finally {
    view.unmount()
  }
})

test('tabbing to an offscreen item brings it into view', async () => {
  const view = render(<div style={{ width: 360 }}>
    <M3Carousel aria-label="Places">
      {Array.from({ length: 6 }, (_, index) =>
        <M3CarouselItem key={index}>Place {index + 1}</M3CarouselItem>
      )}
    </M3Carousel>
  </div>)

  try {
    const scroller = view.container.querySelector<HTMLElement>('.m3-carousel__scroll')!
    const items = view.container.querySelectorAll<HTMLElement>('.m3-carousel__item')
    await waitFor(() => expect(items[0].getBoundingClientRect().width).toBeGreaterThan(0))

    items[0].focus()
    await userEvent.keyboard('{Tab}{Tab}{Tab}{Tab}')

    expect(document.activeElement).toBe(items[4])
    await waitFor(() => expect(scroller.scrollLeft).toBeGreaterThan(0))
  } finally {
    view.unmount()
  }
})
