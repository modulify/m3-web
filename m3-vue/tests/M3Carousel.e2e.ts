import type { M3CarouselExposed } from '@/components/carousel'

import { createApp, h, nextTick } from 'vue'
import { page } from 'vitest/browser'
import { ref } from 'vue'
import { userEvent } from 'vitest/browser'

import { M3Carousel, M3CarouselItem } from '@/components/carousel'

test('multi-browse changes visible item widths and keeps gaps while scrolling', async () => {
  await page.viewport(360, 640)
  const mountPoint = document.createElement('div')
  mountPoint.style.width = '360px'
  document.body.append(mountPoint)
  const carousel = ref<M3CarouselExposed | null>(null)
  const app = createApp({
    render: () => h(M3Carousel, { ref: carousel, height: 240, 'aria-label': 'Places' }, {
      default: () => Array.from({ length: 8 }, (_, index) =>
        h(M3CarouselItem, { 'aria-label': `Place ${index + 1}` }, {
          default: () => h('div', {
            style: { width: '100%', height: '100%', background: 'purple' },
          }),
        })
      ),
    }),
  })
  app.mount(mountPoint)
  await nextTick()

  try {
    const root = mountPoint.querySelector<HTMLElement>('.m3-carousel')!
    const items = Array.from(root.querySelectorAll<HTMLElement>('.m3-carousel__item'))

    await vi.waitFor(() => {
      expect(items[0].getBoundingClientRect().width).toBeGreaterThan(items[1].getBoundingClientRect().width)
    })
    expect(items[1].getBoundingClientRect().width).toBeGreaterThan(items[2].getBoundingClientRect().width)
    expect(items[2].getBoundingClientRect().width).toBeGreaterThanOrEqual(40)
    expect(items[2].getBoundingClientRect().width).toBeLessThanOrEqual(56)
    expect(items[1].getBoundingClientRect().left - items[0].getBoundingClientRect().right).toBeCloseTo(8, 0)

    carousel.value?.goTo(1, false)
    await vi.waitFor(() => {
      expect(items[1].getBoundingClientRect().width).toBeGreaterThan(items[0].getBoundingClientRect().width)
    })
    expect(items[1].getBoundingClientRect().left).toBeCloseTo(root.getBoundingClientRect().left + 16, 0)
    expect(items[2].getBoundingClientRect().left - items[1].getBoundingClientRect().right).toBeCloseTo(8, 0)

    const previousWidth = items[1].getBoundingClientRect().width
    mountPoint.style.width = '900px'
    await vi.waitFor(() => expect(items[1].getBoundingClientRect().width).toBeGreaterThan(previousWidth))
    expect(items[1].getBoundingClientRect().left).toBeCloseTo(root.getBoundingClientRect().left + 16, 0)
  } finally {
    app.unmount()
    mountPoint.remove()
  }
})

test('keeps foreground text anchored while the visual layer moves with parallax', async () => {
  const mountPoint = document.createElement('div')
  mountPoint.style.width = '360px'
  document.body.append(mountPoint)
  const carousel = ref<M3CarouselExposed | null>(null)
  const app = createApp({
    render: () => h(M3Carousel, { ref: carousel, 'aria-label': 'Places' }, {
      default: () => ['First', 'Second', 'Third', 'Fourth'].map(name =>
        h(M3CarouselItem, { 'aria-label': name }, {
          media: () => h('div', {
            style: { width: '100%', height: '100%', background: 'purple' },
          }),
          default: () => h('span', {
            style: { position: 'absolute', left: '24px', bottom: '24px' },
          }, name),
        })
      ),
    }),
  })
  app.mount(mountPoint)
  await nextTick()

  try {
    const item = mountPoint.querySelectorAll<HTMLElement>('.m3-carousel__item')[1]
    const media = item.querySelector<HTMLElement>('.m3-carousel__media')!
    const caption = item.querySelector<HTMLElement>('.m3-carousel__content span')!
    await vi.waitFor(() => expect(item.getBoundingClientRect().width).toBeGreaterThan(0))
    const widthBefore = item.getBoundingClientRect().width
    const mediaBefore = media.getBoundingClientRect().left - item.getBoundingClientRect().left

    carousel.value?.goTo(1, false)
    await vi.waitFor(() => expect(item.getBoundingClientRect().width).toBeGreaterThan(widthBefore))
    expect(caption.getBoundingClientRect().left - item.getBoundingClientRect().left).toBeCloseTo(24, 0)
    expect(media.getBoundingClientRect().left - item.getBoundingClientRect().left).not.toBeCloseTo(mediaBefore, 0)
  } finally {
    app.unmount()
    mountPoint.remove()
  }
})

test('full-screen scrolls vertically one item at a time', async () => {
  const mountPoint = document.createElement('div')
  mountPoint.style.width = '320px'
  document.body.append(mountPoint)
  const carousel = ref<M3CarouselExposed | null>(null)
  const app = createApp({
    render: () => h(M3Carousel, { ref: carousel, variant: 'full-screen', height: 400, 'aria-label': 'Stories' }, {
      default: () => ['First', 'Second'].map(name =>
        h(M3CarouselItem, { 'aria-label': name }, { default: () => name })
      ),
    }),
  })
  app.mount(mountPoint)
  await nextTick()

  try {
    const root = mountPoint.querySelector<HTMLElement>('.m3-carousel')!
    const scroller = root.querySelector<HTMLElement>('.m3-carousel__scroll')!
    const second = root.querySelectorAll<HTMLElement>('.m3-carousel__item')[1]

    carousel.value?.goTo(1, false)
    await vi.waitFor(() => expect(scroller.scrollTop).toBe(416))
    await vi.waitFor(() => expect(second.getBoundingClientRect().top).toBeCloseTo(root.getBoundingClientRect().top, 0))
  } finally {
    app.unmount()
    mountPoint.remove()
  }
})

test('keyboard navigation moves focus and free scrolling snaps to an item', async () => {
  const mountPoint = document.createElement('div')
  mountPoint.style.width = '360px'
  document.body.append(mountPoint)
  const app = createApp({
    render: () => h(M3Carousel, { height: 240, 'aria-label': 'Places' }, {
      default: () => ['First', 'Second', 'Third', 'Fourth'].map(name =>
        h(M3CarouselItem, { 'aria-label': name }, { default: () => name })
      ),
    }),
  })
  app.mount(mountPoint)
  await nextTick()

  try {
    const scroller = mountPoint.querySelector<HTMLElement>('.m3-carousel__scroll')!
    const items = Array.from(mountPoint.querySelectorAll<HTMLElement>('.m3-carousel__item'))
    items[0].focus()
    items[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
    expect(document.activeElement).toBe(items[1])
    await vi.waitFor(() => expect(scroller.scrollLeft).toBeGreaterThan(0))

    items[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }))
    expect(document.activeElement).toBe(items[3])
    items[3].dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }))
    expect(document.activeElement).toBe(items[0])
    await vi.waitFor(() => expect(scroller.scrollLeft).toBeCloseTo(0, 0), { timeout: 2500 })

    const step = (scroller.scrollWidth - scroller.clientWidth) / (items.length - 1)
    scroller.scrollLeft = step * .8
    await vi.waitFor(() => expect(scroller.scrollLeft).toBeCloseTo(step, 0), { timeout: 2500 })
  } finally {
    app.unmount()
    mountPoint.remove()
  }
})

test('uncontained carousel reports the final item at the scroll limit', async () => {
  const mountPoint = document.createElement('div')
  mountPoint.style.width = '360px'
  document.body.append(mountPoint)
  let active = -1
  const app = createApp({
    render: () => h(M3Carousel, {
      variant: 'uncontained',
      preferred: 80,
      onChange: (index: number) => active = index,
    }, {
      default: () => Array.from({ length: 8 }, (_, index) =>
        h(M3CarouselItem, {}, { default: () => String(index) })
      ),
    }),
  })
  app.mount(mountPoint)
  await nextTick()

  try {
    const scroller = mountPoint.querySelector<HTMLElement>('.m3-carousel__scroll')!
    scroller.scrollLeft = scroller.scrollWidth
    await vi.waitFor(() => expect(active).toBe(7))
  } finally {
    app.unmount()
    mountPoint.remove()
  }
})

test('mouse drag over item text pans without selecting it', async () => {
  const mountPoint = document.createElement('div')
  mountPoint.style.width = '360px'
  document.body.append(mountPoint)
  let clicks = 0
  let itemClicks = 0
  const app = createApp({
    render: () => h(M3Carousel, { height: 240, 'aria-label': 'Places' }, {
      default: () => Array.from({ length: 8 }, (_, index) =>
        h(M3CarouselItem, {
          'aria-label': `Place ${index + 1}`,
          onClick: () => itemClicks++,
        }, {
          default: () => [
            h('span', `Place ${index + 1}`),
            ...(index === 0 ? [h('button', { onClick: () => clicks++ }, 'Open')] : []),
          ],
        })
      ),
    }),
  })
  app.mount(mountPoint)
  await nextTick()

  try {
    const scroller = mountPoint.querySelector<HTMLElement>('.m3-carousel__scroll')!
    const items = mountPoint.querySelectorAll<HTMLElement>('.m3-carousel__item')
    await userEvent.dragAndDrop(items[1], items[0])
    await vi.waitFor(() => expect(scroller.scrollLeft).toBeGreaterThan(0))
    expect(window.getSelection()?.toString()).toBe('')
    await userEvent.click(mountPoint.querySelector('button')!)
    expect(clicks).toBe(1)
    await userEvent.click(items[1])
    expect(itemClicks).toBeGreaterThan(0)
    expect(document.activeElement).toBe(items[1])
    items[1].dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerType: 'mouse', button: 0 }))
    expect(scroller.style.userSelect).toBe('none')
    window.dispatchEvent(new PointerEvent('pointercancel', { pointerType: 'mouse' }))
    expect(scroller.style.userSelect).toBe('')
  } finally {
    app.unmount()
    mountPoint.remove()
  }
})

test('mouse drag over an image pans instead of starting native image drag', async () => {
  const mountPoint = document.createElement('div')
  mountPoint.style.width = '360px'
  document.body.append(mountPoint)
  const app = createApp({
    render: () => h(M3Carousel, { variant: 'uncontained', preferred: 180, scroll: 'auto', 'aria-label': 'Places' }, {
      default: () => [
        h(M3CarouselItem, {}, { default: () => 'First' }),
        h(M3CarouselItem, {}, {
          default: () => h('img', {
            src: 'data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=',
            alt: 'Second',
            style: { width: '100%', height: '100%' },
          }),
        }),
        h(M3CarouselItem, {}, { default: () => 'Third' }),
        h(M3CarouselItem, {}, { default: () => 'Fourth' }),
      ],
    }),
  })
  app.mount(mountPoint)
  await nextTick()

  try {
    const scroller = mountPoint.querySelector<HTMLElement>('.m3-carousel__scroll')!
    const image = mountPoint.querySelector('img')!
    const first = mountPoint.querySelector<HTMLElement>('.m3-carousel__item')!
    await userEvent.dragAndDrop(image, first)
    await vi.waitFor(() => expect(scroller.scrollLeft).toBeGreaterThan(0))
  } finally {
    app.unmount()
    mountPoint.remove()
  }
})

test('a short mouse pan advances a snapping carousel', async () => {
  const mountPoint = document.createElement('div')
  mountPoint.style.width = '360px'
  document.body.append(mountPoint)
  const app = createApp({
    render: () => h(M3Carousel, { height: 240, 'aria-label': 'Places' }, {
      default: () => [
        h(M3CarouselItem, {}, { default: () => h('div', { style: { position: 'relative', height: '100%' } }, [
          h('span', { 'data-testid': 'pan-start', style: { position: 'absolute', left: '120px' } }, 'Start'),
          h('span', { 'data-testid': 'pan-end', style: { position: 'absolute', left: '80px' } }, 'End'),
        ]) }),
        ...Array.from({ length: 5 }, (_, index) => h(M3CarouselItem, {}, { default: () => `Place ${index + 2}` })),
      ],
    }),
  })
  app.mount(mountPoint)
  await nextTick()

  try {
    const scroller = mountPoint.querySelector<HTMLElement>('.m3-carousel__scroll')!
    const first = mountPoint.querySelector<HTMLElement>('.m3-carousel__item')!
    const step = first.getBoundingClientRect().width + 8
    const start = mountPoint.querySelector('[data-testid="pan-start"]')!
    const end = mountPoint.querySelector('[data-testid="pan-end"]')!
    await userEvent.dragAndDrop(start, end)
    await vi.waitFor(() => expect(scroller.scrollLeft).toBeCloseTo(step, 0), { timeout: 2500 })
  } finally {
    app.unmount()
    mountPoint.remove()
  }
})

test.each([
  { position: 'start', disabled: 1, initial: 0, from: 1, to: 0, direction: 1 },
  { position: 'end', disabled: 2, initial: 1, from: 1, to: 2, direction: -1 },
])('mouse pan can $position on a disabled item', async ({ disabled, initial, from, to, direction }) => {
  const mountPoint = document.createElement('div')
  mountPoint.style.width = '360px'
  document.body.append(mountPoint)
  const carousel = ref<M3CarouselExposed | null>(null)
  const app = createApp({
    render: () => h(M3Carousel, { ref: carousel, 'aria-label': 'Places' }, {
      default: () => Array.from({ length: 6 }, (_, index) =>
        h(M3CarouselItem, { interactive: true, disabled: index === disabled }, {
          default: () => `Place ${index + 1}`,
        })
      ),
    }),
  })
  app.mount(mountPoint)
  await nextTick()

  try {
    const scroller = mountPoint.querySelector<HTMLElement>('.m3-carousel__scroll')!
    const items = mountPoint.querySelectorAll<HTMLElement>('.m3-carousel__item')
    await vi.waitFor(() => expect(items[1].getBoundingClientRect().width).toBeGreaterThan(0))

    carousel.value?.goTo(initial, false)
    if (initial) await vi.waitFor(() => expect(scroller.scrollLeft).toBeGreaterThan(0))
    const before = scroller.scrollLeft

    await userEvent.dragAndDrop(items[from], items[to])
    await vi.waitFor(() => expect((scroller.scrollLeft - before) * direction).toBeGreaterThan(0))
  } finally {
    app.unmount()
    mountPoint.remove()
  }
})

test.each([
  { key: 'Home', target: 0 },
  { key: 'ArrowLeft', target: 2 },
])('moving focus backward with $key does not jump the scroll position', async ({ key, target }) => {
  const mountPoint = document.createElement('div')
  mountPoint.style.width = '360px'
  document.body.append(mountPoint)
  const carousel = ref<M3CarouselExposed | null>(null)
  const app = createApp({
    render: () => h(M3Carousel, { ref: carousel, 'aria-label': 'Places' }, {
      default: () => Array.from({ length: 6 }, (_, index) =>
        h(M3CarouselItem, {}, { default: () => `Place ${index + 1}` })
      ),
    }),
  })
  app.mount(mountPoint)
  await nextTick()

  try {
    const scroller = mountPoint.querySelector<HTMLElement>('.m3-carousel__scroll')!
    const items = mountPoint.querySelectorAll<HTMLElement>('.m3-carousel__item')
    carousel.value?.goTo(3, false)
    await vi.waitFor(() => expect(scroller.scrollLeft).toBeGreaterThan(500))
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
    app.unmount()
    mountPoint.remove()
  }
})

test('interactive items ripple and activate while disabled items remain inert', async () => {
  const mountPoint = document.createElement('div')
  mountPoint.style.width = '360px'
  document.body.append(mountPoint)
  let activations = 0
  const app = createApp({
    render: () => h(M3Carousel, { 'aria-label': 'Places' }, {
      default: () => [
        h(M3CarouselItem, {
          interactive: true,
          'aria-label': 'Mountains',
          onClick: () => activations++,
        }, { default: () => 'Mountains' }),
        h(M3CarouselItem, {
          interactive: true,
          disabled: true,
          'aria-label': 'Museum',
          onClick: () => activations++,
        }, { default: () => 'Museum' }),
        h(M3CarouselItem, {
          interactive: true,
          'aria-label': 'Garden',
          onClick: () => activations++,
        }, { default: () => 'Garden' }),
      ],
    }),
  })
  app.mount(mountPoint)
  await nextTick()

  try {
    const items = mountPoint.querySelectorAll<HTMLElement>('.m3-carousel__item')
    await userEvent.click(items[0])
    expect(activations).toBe(1)
    await vi.waitFor(() => expect(items[0].querySelector('.m3-ripple')).not.toBeNull())

    items[0].focus()
    const space = new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true })
    expect(items[0].dispatchEvent(space)).toBe(false)
    expect(items[0].classList.contains('m3-carousel__item_pressed')).toBe(true)
    items[0].dispatchEvent(new KeyboardEvent('keyup', { key: ' ', code: 'Space', bubbles: true }))
    expect(items[0].classList.contains('m3-carousel__item_pressed')).toBe(false)
    expect(activations).toBe(2)

    items[0].dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', code: 'Enter', bubbles: true }))
    expect(activations).toBe(3)
    await vi.waitFor(() => {
      const ripple = items[0].querySelector<HTMLElement>('.m3-ripple')!
      expect(parseFloat(ripple.style.left)).toBeCloseTo((items[0].clientWidth - parseFloat(ripple.style.width)) / 2, 0)
    })

    const itemRect = items[0].getBoundingClientRect()
    items[0].dispatchEvent(new MouseEvent('click', {
      bubbles: true,
      clientX: itemRect.left + 20,
      clientY: itemRect.top + 20,
    }))
    expect(activations).toBe(4)
    await vi.waitFor(() => {
      const ripple = items[0].querySelector<HTMLElement>('.m3-ripple')!
      expect(parseFloat(ripple.style.left)).toBeLessThan(0)
    })

    items[1].click()
    expect(activations).toBe(4)
    expect(items[1].getAttribute('aria-disabled')).toBe('true')
    expect(getComputedStyle(items[1]).opacity).toBe('0.38')
  } finally {
    app.unmount()
    mountPoint.remove()
  }
})

test('clicking a neighboring interactive item activates it without scrolling', async () => {
  const mountPoint = document.createElement('div')
  mountPoint.style.width = '360px'
  document.body.append(mountPoint)
  let activations = 0
  const app = createApp({
    render: () => h(M3Carousel, { 'aria-label': 'Places' }, {
      default: () => Array.from({ length: 4 }, (_, index) =>
        h(M3CarouselItem, {
          interactive: true,
          onClick: () => activations++,
        }, { default: () => `Place ${index + 1}` })
      ),
    }),
  })
  app.mount(mountPoint)
  await nextTick()

  try {
    const scroller = mountPoint.querySelector<HTMLElement>('.m3-carousel__scroll')!
    const items = mountPoint.querySelectorAll<HTMLElement>('.m3-carousel__item')
    await vi.waitFor(() => expect(items[1].getBoundingClientRect().width).toBeGreaterThan(0))

    await userEvent.click(items[0])
    const scrollTo = vi.spyOn(scroller, 'scrollTo')
    await userEvent.click(items[1])

    expect(activations).toBe(2)
    expect(document.activeElement).toBe(items[1])
    expect(scrollTo).not.toHaveBeenCalled()
    expect(scroller.scrollLeft).toBe(0)
  } finally {
    app.unmount()
    mountPoint.remove()
  }
})

test('tabbing to an offscreen item brings it into view', async () => {
  const mountPoint = document.createElement('div')
  mountPoint.style.width = '360px'
  document.body.append(mountPoint)
  const app = createApp({
    render: () => h(M3Carousel, { 'aria-label': 'Places' }, {
      default: () => Array.from({ length: 6 }, (_, index) =>
        h(M3CarouselItem, {}, { default: () => `Place ${index + 1}` })
      ),
    }),
  })
  app.mount(mountPoint)
  await nextTick()

  try {
    const scroller = mountPoint.querySelector<HTMLElement>('.m3-carousel__scroll')!
    const items = mountPoint.querySelectorAll<HTMLElement>('.m3-carousel__item')
    await vi.waitFor(() => expect(items[0].getBoundingClientRect().width).toBeGreaterThan(0))

    items[0].focus()
    await userEvent.keyboard('{Tab}{Tab}{Tab}{Tab}')

    expect(document.activeElement).toBe(items[4])
    await vi.waitFor(() => expect(scroller.scrollLeft).toBeGreaterThan(0))
  } finally {
    app.unmount()
    mountPoint.remove()
  }
})
