import { defineComponent, h } from 'vue'
import { render, waitFor } from '@testing-library/vue'

import {
  useSurfaceCardPageMorph,
} from '@/components/surface/orchestration/useSurfaceCardPageMorph'

vi.mock('@modulify/m3-foundation/lib/surface/orchestration', async (importOriginal) => ({
  ...await importOriginal<typeof import('@modulify/m3-foundation/lib/surface/orchestration')>(),
  raf: async () => {},
  waitForMotion: async () => {},
}))

describe('m3-vue/card page morph', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  test('animates between the card bounds and full canvas bounds', async () => {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
      return DOMRect.fromRect(this.dataset.surfacePart === 'canvas'
        ? { x: 10, y: 20, width: 800, height: 600 }
        : { x: 30, y: 50, width: 320, height: 220 })
    })
    let morph!: ReturnType<typeof useSurfaceCardPageMorph>
    const Harness = defineComponent({
      setup() {
        morph = useSurfaceCardPageMorph(200)
        return () => h('div', { ref: morph.canvas, 'data-surface-part': 'canvas' }, [
          h('div', { ref: morph.originSlot }),
        ])
      },
    })
    render(Harness)
    await waitFor(() => expect(morph.overlayStyle.value.left).toBe('20px'))
    expect(morph.originHeight.value).toBe(220)

    await morph.toggleCardMode()
    expect(morph.expanded.value).toBe(true)
    expect(morph.surfaceExpanded.value).toBe(true)
    expect(morph.backgroundCollapsed.value).toBe(true)
    expect(morph.overlayStyle.value.width).toBe('800px')

    await morph.toggleCardMode()
    expect(morph.expanded.value).toBe(false)
    expect(morph.surfaceExpanded.value).toBe(false)
    expect(morph.backgroundCollapsed.value).toBe(false)
    expect(morph.overlayStyle.value.width).toBe('320px')
  })

  test('keeps a transition exclusive and handles a missing origin card', async () => {
    let morph!: ReturnType<typeof useSurfaceCardPageMorph>
    const Harness = defineComponent({
      setup() {
        morph = useSurfaceCardPageMorph(200)
        return () => h('div', { ref: morph.canvas })
      },
    })
    render(Harness)
    const opening = morph.toggleCardMode()
    await morph.toggleCardMode()
    expect(morph.busy.value).toBe(true)
    await opening
    expect(morph.expanded.value).toBe(true)

    await morph.toggleCardMode()
    expect(morph.expanded.value).toBe(false)
    expect(morph.busy.value).toBe(false)
  })

  test('updates expanded geometry on resize and survives detached elements', async () => {
    let resize!: ResizeObserverCallback
    vi.stubGlobal('ResizeObserver', class {
      constructor (callback: ResizeObserverCallback) { resize = callback }
      observe () {}
      unobserve () {}
      disconnect () {}
    })

    let width = 800
    let originWidth = 320
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
      return DOMRect.fromRect(this.dataset.surfacePart === 'canvas'
        ? { width, height: 600 }
        : { width: originWidth, height: 220 })
    })

    let morph!: ReturnType<typeof useSurfaceCardPageMorph>
    const Harness = defineComponent({
      setup() {
        morph = useSurfaceCardPageMorph(200)
        return () => h('div', { ref: morph.canvas, 'data-surface-part': 'canvas' }, [
          h('div', { ref: morph.originSlot }),
        ])
      },
    })
    render(Harness)
    await waitFor(() => expect(morph.overlayStyle.value.width).toBe('320px'))

    const origin = morph.originSlot.value
    morph.originSlot.value = null
    resize([], {} as ResizeObserver)
    await new Promise(resolve => setTimeout(resolve, 30))
    expect(morph.overlayStyle.value.width).toBe('320px')
    morph.originSlot.value = origin
    originWidth = 340
    resize([], {} as ResizeObserver)
    await waitFor(() => expect(morph.overlayStyle.value.width).toBe('340px'))

    await morph.toggleCardMode()
    width = 900
    resize([], {} as ResizeObserver)
    await waitFor(() => expect(morph.overlayStyle.value.width).toBe('900px'))

    morph.originSlot.value = null
    resize([], {} as ResizeObserver)
    await waitFor(() => expect(morph.originHeight.value).toBe(220))

    morph.canvas.value = null
    resize([], {} as ResizeObserver)
    await new Promise(resolve => setTimeout(resolve, 30))
    await morph.toggleCardMode()
    expect(morph.expanded.value).toBe(false)
    expect(morph.busy.value).toBe(false)
  })

  test('keeps the card expanded if its canvas disappears during opening', async () => {
    let morph!: ReturnType<typeof useSurfaceCardPageMorph>
    const Harness = defineComponent({
      setup() {
        morph = useSurfaceCardPageMorph(200)
        return () => h('div', { ref: morph.canvas }, [h('div', { ref: morph.originSlot })])
      },
    })
    render(Harness)

    const opening = morph.toggleCardMode()
    morph.canvas.value = null
    await opening

    expect(morph.expanded.value).toBe(true)
    expect(morph.backgroundCollapsed.value).toBe(false)

    await morph.toggleCardMode()
    expect(morph.expanded.value).toBe(false)
  })
})
