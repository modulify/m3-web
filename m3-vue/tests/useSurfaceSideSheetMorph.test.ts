import { defineComponent, h } from 'vue'
import { render, waitFor } from '@testing-library/vue'

import {
  useSurfaceSideSheetMorph,
} from '@/components/surface/orchestration/useSurfaceSideSheetMorph'

vi.mock('@modulify/m3-foundation/lib/surface/orchestration', async (importOriginal) => ({
  ...await importOriginal<typeof import('@modulify/m3-foundation/lib/surface/orchestration')>(),
  raf: async () => {},
  waitForMotion: async () => {},
}))

describe('m3-vue/side-sheet morph', () => {
  afterEach(() => vi.restoreAllMocks())

  test('morphs from measured docked geometry into a modal sheet and back', async () => {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect')
      .mockReturnValue(DOMRect.fromRect({ x: 600, y: 24, width: 320, height: 500 }))

    let morph!: ReturnType<typeof useSurfaceSideSheetMorph>
    const Harness = defineComponent({
      setup() {
        morph = useSurfaceSideSheetMorph()
        return () => h('div', { ref: morph.layoutRoot }, [
          h('div', { ref: morph.dockedHost }, [h('div', { 'data-panel-mode': 'docked' })]),
        ])
      },
    })
    render(Harness)
    await waitFor(() => expect(morph.sideSheetWidth.value).toBe(320))
    await morph.toggleSideSheetMode()
    expect(morph.sideSheetModal.value).toBe(true)
    expect(morph.modalShown.value).toBe(true)
    expect(morph.dockedHostStyle.value.width).toBe('0px')
    expect(morph.modalPanelProps.value.scrimShown).toBe(true)

    await morph.closeModalFromPanel()
    expect(morph.sideSheetModal.value).toBe(false)
    expect(morph.modalShown.value).toBe(false)
    expect(morph.dockedPanelStyle.value.visibility).toBe('visible')
    expect(morph.modalPanelProps.value.width).toBe(320)
  })

  test('does not open when there is no docked sheet to measure', async () => {
    let morph!: ReturnType<typeof useSurfaceSideSheetMorph>
    const Harness = defineComponent({
      setup() {
        morph = useSurfaceSideSheetMorph()
        return () => h('div')
      },
    })
    render(Harness)
    await morph.toggleSideSheetMode()
    expect(morph.sideSheetModal.value).toBe(false)
    expect(morph.modalShown.value).toBe(false)
    expect(morph.transitioning.value).toBe(false)
  })

  test('keeps the sheet modal while a second toggle is requested during transition', async () => {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue(DOMRect.fromRect({ x: 600, width: 320, height: 500 }))
    let morph!: ReturnType<typeof useSurfaceSideSheetMorph>
    const Harness = defineComponent({
      setup() {
        morph = useSurfaceSideSheetMorph()
        return () => h('div', { ref: morph.dockedHost })
      },
    })
    render(Harness)
    await waitFor(() => expect(morph.dockedHost.value).not.toBeNull())

    const opening = morph.toggleSideSheetMode()
    await morph.toggleSideSheetMode()
    expect(morph.transitioning.value).toBe(true)
    await opening
    expect(morph.sideSheetModal.value).toBe(true)
    await morph.toggleSideSheetMode()
    expect(morph.sideSheetModal.value).toBe(false)
  })

  test('uses the last measured width when the docked host temporarily has no width', async () => {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect')
      .mockReturnValue(DOMRect.fromRect({ x: 600, width: 0, height: 500 }))
    let morph!: ReturnType<typeof useSurfaceSideSheetMorph>
    const Harness = defineComponent({
      setup() {
        morph = useSurfaceSideSheetMorph()
        return () => h('div', { ref: morph.dockedHost })
      },
    })
    render(Harness)
    await waitFor(() => expect(morph.dockedHost.value).not.toBeNull())

    await morph.toggleSideSheetMode()
    expect(morph.modalPanelProps.value.width).toBe(280)
    await morph.closeModalFromPanel()
    expect(morph.dockedHostStyle.value.width).not.toBe('0px')
  })
})
