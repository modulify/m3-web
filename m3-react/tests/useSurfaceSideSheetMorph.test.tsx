import { act, render, waitFor } from '@testing-library/react'

import {
  useSurfaceSideSheetMorph,
} from '@/components/surface/orchestration/useSurfaceSideSheetMorph'

vi.mock('@modulify/m3-foundation/lib/surface/orchestration', async (importOriginal) => ({
  ...await importOriginal<typeof import('@modulify/m3-foundation/lib/surface/orchestration')>(),
  raf: async () => {},
  waitForMotion: async () => {},
}))

describe('m3-react/side-sheet morph', () => {
  afterEach(() => vi.restoreAllMocks())

  test('morphs from measured docked geometry into a modal sheet and back', async () => {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect')
      .mockReturnValue(DOMRect.fromRect({ x: 600, y: 24, width: 320, height: 500 }))

    let morph!: ReturnType<typeof useSurfaceSideSheetMorph>
    const Harness = () => {
      morph = useSurfaceSideSheetMorph()

      return <div ref={morph.layoutRootRef}>
        <div ref={morph.dockedHostRef}>
          <div data-panel-mode="docked" />
        </div>
      </div>
    }
    render(<Harness />)

    await waitFor(() => expect(morph.sideSheetWidth).toBe(320))
    await act(async () => morph.toggleSideSheetMode())
    expect(morph.sideSheetModal).toBe(true)
    expect(morph.modalShown).toBe(true)
    expect(morph.dockedHostStyle.width).toBe('0px')
    expect(morph.modalPanelProps.scrimShown).toBe(true)
    window.dispatchEvent(new Event('resize'))

    await act(async () => morph.closeModalFromPanel())
    expect(morph.sideSheetModal).toBe(false)
    expect(morph.modalShown).toBe(false)
    expect(morph.dockedPanelStyle.visibility).toBe('visible')
    expect(morph.modalPanelProps.width).toBe(320)
  })

  test('does not open when there is no docked sheet to measure', async () => {
    let morph!: ReturnType<typeof useSurfaceSideSheetMorph>
    const Harness = () => {
      morph = useSurfaceSideSheetMorph()
      return <div />
    }
    render(<Harness />)

    await act(async () => morph.toggleSideSheetMode())
    expect(morph.sideSheetModal).toBe(false)
    expect(morph.modalShown).toBe(false)
    expect(morph.transitioning).toBe(false)
  })

  test('keeps the sheet modal while a second toggle is requested during transition', async () => {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect')
      .mockReturnValue(DOMRect.fromRect({ x: 600, width: 320, height: 500 }))

    let morph!: ReturnType<typeof useSurfaceSideSheetMorph>
    const Harness = () => {
      morph = useSurfaceSideSheetMorph()
      return <div ref={morph.dockedHostRef} />
    }
    render(<Harness />)

    await act(async () => {
      const opening = morph.toggleSideSheetMode()
      await morph.toggleSideSheetMode()
      await opening
    })
    expect(morph.sideSheetModal).toBe(true)

    await act(async () => morph.toggleSideSheetMode())
    expect(morph.sideSheetModal).toBe(false)
  })

  test('uses the last measured width when the docked host temporarily has no width', async () => {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect')
      .mockReturnValue(DOMRect.fromRect({ x: 600, width: 0, height: 500 }))

    let morph!: ReturnType<typeof useSurfaceSideSheetMorph>
    const Harness = () => {
      morph = useSurfaceSideSheetMorph()
      return <div ref={morph.dockedHostRef} />
    }
    render(<Harness />)

    await act(async () => morph.toggleSideSheetMode())
    expect(morph.modalPanelProps.width).toBe(280)

    await act(async () => morph.closeModalFromPanel())
    expect(morph.dockedHostStyle.width).not.toBe('0px')
  })

  test('keeps the modal open if its docked destination disappears before closing', async () => {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect')
      .mockReturnValue(DOMRect.fromRect({ x: 600, width: 320, height: 500 }))

    let morph!: ReturnType<typeof useSurfaceSideSheetMorph>
    const Harness = () => {
      morph = useSurfaceSideSheetMorph()
      return <div ref={morph.dockedHostRef} />
    }
    render(<Harness />)

    await act(async () => morph.closeModalFromPanel())
    await act(async () => {
      const opening = morph.toggleSideSheetMode()
      await morph.closeModalFromPanel()
      await opening
    })
    expect(morph.sideSheetModal).toBe(true)

    morph.dockedHostRef.current = null
    await act(async () => morph.closeModalFromPanel())

    expect(morph.sideSheetModal).toBe(true)
    expect(morph.transitioning).toBe(false)
    window.dispatchEvent(new Event('resize'))
  })

  test('remeasures a docked host without a panel after resizing', async () => {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect')
      .mockReturnValue(DOMRect.fromRect({ x: 600, width: 320, height: 500 }))

    let morph!: ReturnType<typeof useSurfaceSideSheetMorph>
    const Harness = () => {
      morph = useSurfaceSideSheetMorph()
      return <div ref={morph.dockedHostRef} />
    }
    render(<Harness />)

    window.dispatchEvent(new Event('resize'))
    await waitFor(() => expect(morph.modalPanelProps.width).toBe(320))

    morph.dockedHostRef.current = null
    window.dispatchEvent(new Event('resize'))
    await new Promise(resolve => setTimeout(resolve, 30))
    expect(morph.modalPanelProps.width).toBe(320)
  })
})
