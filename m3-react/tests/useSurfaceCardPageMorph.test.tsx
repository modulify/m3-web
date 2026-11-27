import { act, render, waitFor } from '@testing-library/react'

import {
  useSurfaceCardPageMorph,
} from '@/components/surface/orchestration/useSurfaceCardPageMorph'

vi.mock('@modulify/m3-foundation/lib/surface/orchestration', async (importOriginal) => ({
  ...await importOriginal<typeof import('@modulify/m3-foundation/lib/surface/orchestration')>(),
  raf: async () => {},
  waitForMotion: async () => {},
}))

describe('m3-react/card page morph', () => {
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
    const Harness = () => {
      morph = useSurfaceCardPageMorph(200)

      return <div ref={morph.canvasRef} data-surface-part="canvas">
        <div ref={morph.originSlotRef} />
      </div>
    }
    render(<Harness />)

    await waitFor(() => expect(morph.overlayStyle.left).toBe('20px'))
    expect(morph.originHeight).toBe(220)

    await act(async () => morph.toggleCardMode())
    expect(morph.expanded).toBe(true)
    expect(morph.surfaceExpanded).toBe(true)
    expect(morph.backgroundCollapsed).toBe(true)
    expect(morph.overlayStyle.width).toBe('800px')

    await act(async () => morph.toggleCardMode())
    expect(morph.expanded).toBe(false)
    expect(morph.surfaceExpanded).toBe(false)
    expect(morph.backgroundCollapsed).toBe(false)
    expect(morph.overlayStyle.width).toBe('320px')
  })

  test('keeps a transition exclusive and handles a missing origin card', async () => {
    let morph!: ReturnType<typeof useSurfaceCardPageMorph>
    const Harness = () => {
      morph = useSurfaceCardPageMorph(200)
      return <div ref={morph.canvasRef} />
    }
    render(<Harness />)

    await act(async () => {
      const opening = morph.toggleCardMode()
      await morph.toggleCardMode()
      await opening
    })
    expect(morph.expanded).toBe(true)

    await act(async () => morph.toggleCardMode())
    expect(morph.expanded).toBe(false)
    expect(morph.busy).toBe(false)
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
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
      return DOMRect.fromRect(this.dataset.surfacePart === 'canvas'
        ? { width, height: 600 }
        : { width: 320, height: 220 })
    })

    let morph!: ReturnType<typeof useSurfaceCardPageMorph>
    const Harness = () => {
      morph = useSurfaceCardPageMorph(200)
      return <div ref={morph.canvasRef} data-surface-part="canvas">
        <div ref={morph.originSlotRef} />
      </div>
    }
    render(<Harness />)
    await waitFor(() => expect(morph.overlayStyle.width).toBe('320px'))

    const origin = morph.originSlotRef.current
    morph.originSlotRef.current = null
    act(() => resize([], {} as ResizeObserver))
    await new Promise(resolve => setTimeout(resolve, 30))
    expect(morph.overlayStyle.width).toBe('320px')
    morph.originSlotRef.current = origin

    await act(async () => morph.toggleCardMode())
    width = 900
    act(() => resize([], {} as ResizeObserver))
    await waitFor(() => expect(morph.overlayStyle.width).toBe('900px'))

    morph.originSlotRef.current = null
    act(() => resize([], {} as ResizeObserver))
    await waitFor(() => expect(morph.originHeight).toBe(220))

    morph.canvasRef.current = null
    act(() => resize([], {} as ResizeObserver))
    await new Promise(resolve => setTimeout(resolve, 30))
    await act(async () => morph.toggleCardMode())
    expect(morph.expanded).toBe(false)
    expect(morph.busy).toBe(false)
  })

  test('keeps the card expanded if its canvas disappears during opening', async () => {
    let morph!: ReturnType<typeof useSurfaceCardPageMorph>
    const Harness = () => {
      morph = useSurfaceCardPageMorph(200)
      return <div ref={morph.canvasRef}><div ref={morph.originSlotRef} /></div>
    }
    render(<Harness />)

    await act(async () => {
      const opening = morph.toggleCardMode()
      morph.canvasRef.current = null
      await opening
    })

    expect(morph.expanded).toBe(true)
    expect(morph.backgroundCollapsed).toBe(false)

    await act(async () => morph.toggleCardMode())
    expect(morph.expanded).toBe(false)
  })
})
