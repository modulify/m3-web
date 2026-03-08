import type {
  App,
  Component,
} from 'vue'

import {
  createApp,
  h,
  nextTick,
} from 'vue'

import { page } from 'vitest/browser'

import SurfaceCardPageMorph from '../storybook/examples/surface/SurfaceCardPageMorph.vue'
import SurfaceNestedDialogsChain from '../storybook/examples/surface/SurfaceNestedDialogsChain.vue'
import SurfaceSideSheetAlwaysModal from '../storybook/examples/surface/SurfaceSideSheetAlwaysModal.vue'
import SurfaceSideSheetModalToWindow from '../storybook/examples/surface/SurfaceSideSheetModalToWindow.vue'
import SurfaceSideSheetMorph from '../storybook/examples/surface/SurfaceSideSheetMorph.vue'

type MountedStory = {
  app: App;
  mountPoint: HTMLDivElement;
}

const delay = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms))

const waitFor = async (assertion: () => void, timeoutMs = 1800) => {
  const startedAt = Date.now()
  let lastError: unknown

  while (Date.now() - startedAt < timeoutMs) {
    try {
      assertion()
      return
    } catch (error) {
      lastError = error
      await delay(14)
    }
  }

  throw lastError ?? new Error('waitFor timeout')
}

const mountStory = (component: Component): MountedStory => {
  const mountPoint = document.createElement('div')
  mountPoint.setAttribute('data-testid', 'surface-story-mount')
  document.body.append(mountPoint)

  const app = createApp({
    render: () => h(component),
  })

  app.mount(mountPoint)

  return {
    app,
    mountPoint,
  }
}

const query = <T extends Element>(selector: string) => {
  const element = document.querySelector(selector) as T | null
  if (!element) {
    throw new Error(`Element not found: ${selector}`)
  }

  return element
}

const click = (selector: string) => {
  query<HTMLElement>(selector).dispatchEvent(new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
  }))
}

const collectSeries = async (reader: () => number, durationMs = 360, stepMs = 24) => {
  const values: number[] = []
  const startedAt = performance.now()

  while (performance.now() - startedAt < durationMs) {
    values.push(reader())
    await delay(stepMs)
  }

  return values
}

const deltas = (values: number[]) => values.slice(1).map((value, index) => value - values[index])

const toNumber = (raw: string) => {
  const value = Number.parseFloat(raw)

  if (Number.isNaN(value)) {
    throw new Error(`Expected numeric CSS value, got "${raw}"`)
  }

  return value
}

const matrixTranslateY = (element: HTMLElement) => {
  const transform = getComputedStyle(element).transform

  if (!transform || transform === 'none') {
    return 0
  }

  const matrix3d = transform.match(/^matrix3d\((.+)\)$/)
  if (matrix3d) {
    const values = matrix3d[1].split(',').map(part => Number.parseFloat(part.trim()))

    return values[13] ?? 0
  }

  const matrix2d = transform.match(/^matrix\((.+)\)$/)
  if (matrix2d) {
    const values = matrix2d[1].split(',').map(part => Number.parseFloat(part.trim()))

    return values[5] ?? 0
  }

  return 0
}

const expectCentered = (element: HTMLElement, tolerancePx = 8) => {
  const rect = element.getBoundingClientRect()
  const centerX = rect.left + (rect.width / 2)
  const centerY = rect.top + (rect.height / 2)

  expect(Math.abs(centerX - (window.innerWidth / 2))).toBeLessThanOrEqual(tolerancePx)
  expect(Math.abs(centerY - (window.innerHeight / 2))).toBeLessThanOrEqual(tolerancePx)
}

describe('m3-vue/surface stories e2e', () => {
  let mounted: MountedStory | null = null

  beforeEach(async () => {
    await page.viewport(1440, 1024)
  })

  afterEach(() => {
    mounted?.app.unmount()
    mounted?.mountPoint.remove()
    mounted = null
    document.body.innerHTML = ''
  })

  test('keeps side-sheet docked->modal->docked roundtrip smooth and stateful', async () => {
    mounted = mountStory(SurfaceSideSheetMorph)

    await waitFor(() => {
      expect(document.querySelector('[data-testid="surface-morph-sheet"][data-panel-mode="docked"]')).not.toBeNull()
    })

    const root = query<HTMLElement>('[data-testid="surface-morph-root"]')
    const content = query<HTMLElement>('[data-testid="surface-morph-content-grid"]')
    const beforeWidth = content.getBoundingClientRect().width

    click('[data-testid="surface-morph-toggle"]')
    await nextTick()

    const expandSeries = await collectSeries(() => query<HTMLElement>('[data-testid="surface-morph-content-grid"]').getBoundingClientRect().width, 440, 28)
    const expandDeltas = deltas(expandSeries)

    await waitFor(() => {
      expect(root.getAttribute('data-sheet-modal')).toBe('true')
      expect(document.querySelector('[data-testid="surface-morph-sheet"][data-panel-mode="modal"]')).not.toBeNull()
      expect(document.querySelector('.m3-surface__scrim')).not.toBeNull()
    })

    const modalWidth = content.getBoundingClientRect().width
    expect(modalWidth).toBeGreaterThan(beforeWidth + 220)
    expect(expandDeltas.some(delta => delta > 0.2)).toBe(true)
    expect(Math.min(...expandDeltas)).toBeGreaterThan(-8)

    click('[data-testid="surface-morph-toggle"]')
    await nextTick()

    const collapseSeries = await collectSeries(() => query<HTMLElement>('[data-testid="surface-morph-content-grid"]').getBoundingClientRect().width, 1320, 32)
    const collapseDeltas = deltas(collapseSeries)

    await waitFor(() => {
      expect(root.getAttribute('data-sheet-modal')).toBe('false')
      expect(document.querySelector('[data-testid="surface-morph-sheet"][data-panel-mode="docked"]')).not.toBeNull()
      expect(document.querySelector('[data-testid="surface-morph-sheet"][data-panel-mode="modal"]')).toBeNull()
    }, 2200)

    await delay(340)

    const afterWidth = content.getBoundingClientRect().width
    expect(Math.abs(afterWidth - beforeWidth)).toBeLessThan(16)
    expect(collapseDeltas.some(delta => delta < -0.2)).toBe(true)
    expect(Math.max(...collapseDeltas)).toBeLessThan(34)
  })

  test('keeps card->page->card geometry and layer choreography stable', async () => {
    mounted = mountStory(SurfaceCardPageMorph)

    await waitFor(() => {
      expect(document.querySelector('[data-testid="surface-card-origin"]')).not.toBeNull()
    })

    const root = query<HTMLElement>('[data-testid="surface-card-page-root"]')
    const canvas = query<HTMLElement>('[data-testid="surface-card-canvas"]')
    const overlayWrap = query<HTMLElement>('[data-testid="surface-card-overlay-wrap"]')
    const originBefore = query<HTMLElement>('[data-testid="surface-card-origin"]').getBoundingClientRect()

    expect(document.querySelector('[data-testid="surface-card-grid"]')).not.toBeNull()

    click('[data-testid="surface-card-toggle"]')
    await nextTick()

    await delay(120)
    expect(document.querySelector('[data-testid="surface-card-grid"]')).not.toBeNull()

    const widthSeries = await collectSeries(() => query<HTMLElement>('[data-testid="surface-card-overlay-wrap"]').getBoundingClientRect().width, 380, 28)
    const heightSeries = await collectSeries(() => query<HTMLElement>('[data-testid="surface-card-overlay-wrap"]').getBoundingClientRect().height, 380, 28)
    const widthDeltas = deltas(widthSeries)
    const heightDeltas = deltas(heightSeries)

    expect(widthDeltas.some(delta => delta > 0.2) || heightDeltas.some(delta => delta > 0.2)).toBe(true)
    expect(Math.min(...widthDeltas)).toBeGreaterThan(-8)
    expect(Math.min(...heightDeltas)).toBeGreaterThan(-8)

    await waitFor(() => {
      expect(root.getAttribute('data-card-expanded')).toBe('true')
      expect(document.querySelector('[data-testid="surface-card-grid"]')).toBeNull()
    }, 2200)

    const expandedOverlayWrap = query<HTMLElement>('[data-testid="surface-card-overlay-wrap"]')
    const expandedRect = expandedOverlayWrap.getBoundingClientRect()
    const canvasRect = canvas.getBoundingClientRect()
    expect(expandedRect.width).toBeGreaterThan(canvasRect.width - 6)
    expect(expandedRect.height).toBeGreaterThan(canvasRect.height - 6)

    click('[data-testid="surface-card-toggle"]')
    await nextTick()

    await delay(80)
    expect(document.querySelector('[data-testid="surface-card-grid"]')).not.toBeNull()

    const collapseWidthSeries = await collectSeries(() => query<HTMLElement>('[data-testid="surface-card-overlay-wrap"]').getBoundingClientRect().width, 420, 28)
    const collapseHeightSeries = await collectSeries(() => query<HTMLElement>('[data-testid="surface-card-overlay-wrap"]').getBoundingClientRect().height, 420, 28)
    const collapseWidthDeltas = deltas(collapseWidthSeries)
    const collapseHeightDeltas = deltas(collapseHeightSeries)

    expect(collapseWidthDeltas.some(delta => delta < -0.2)).toBe(true)
    expect(collapseWidthDeltas.some(delta => delta < -0.2) || collapseHeightDeltas.some(delta => delta < -0.2)).toBe(true)
    expect(Math.max(...collapseWidthDeltas)).toBeLessThan(42)
    expect(Math.max(...collapseHeightDeltas)).toBeLessThan(42)

    await waitFor(() => {
      expect(root.getAttribute('data-card-expanded')).toBe('false')
      expect(document.querySelector('[data-testid="surface-card-grid"]')).not.toBeNull()
    }, 2200)

    const originAfter = query<HTMLElement>('[data-testid="surface-card-origin"]').getBoundingClientRect()
    const collapsedOverlayWrap = query<HTMLElement>('[data-testid="surface-card-overlay-wrap"]')
    const collapsedRect = collapsedOverlayWrap.getBoundingClientRect()

    expect(Math.abs(collapsedRect.width - originAfter.width)).toBeLessThan(12)
    expect(Math.abs(collapsedRect.height - originAfter.height)).toBeLessThan(12)
    expect(Math.abs(originAfter.width - originBefore.width)).toBeLessThan(8)
    expect(Math.abs(originAfter.height - originBefore.height)).toBeLessThan(8)
  })

  test('reopens always-modal side-sheet with animated entry after close', async () => {
    mounted = mountStory(SurfaceSideSheetAlwaysModal)

    await waitFor(() => {
      expect(document.querySelector('[data-testid="surface-always-open"]')).not.toBeNull()
    })

    const openAndSampleEntry = async () => {
      click('[data-testid="surface-always-open"]')
      await nextTick()

      await waitFor(() => {
        expect(document.querySelector('[data-testid="surface-always-panel"]')).not.toBeNull()
      })

      const rightSeries = await collectSeries(
        () => toNumber(getComputedStyle(query<HTMLElement>('[data-testid="surface-always-panel"]')).right),
        380,
        24
      )

      const rightDeltas = deltas(rightSeries)
      const amplitude = Math.max(...rightSeries) - Math.min(...rightSeries)

      expect(amplitude).toBeGreaterThan(40)
      expect(rightDeltas.some(delta => delta > 0.2)).toBe(true)
    }

    await openAndSampleEntry()

    click('[data-testid="surface-always-close"]')
    await nextTick()

    await waitFor(() => {
      expect(document.querySelector('[data-testid="surface-always-panel"]')).toBeNull()
    }, 2200)

    await openAndSampleEntry()
  })

  test('closes modal window with fade+slide and keeps animated re-open in side-sheet mode', async () => {
    mounted = mountStory(SurfaceSideSheetModalToWindow)

    await waitFor(() => {
      expect(document.querySelector('[data-testid="surface-window-open"]')).not.toBeNull()
    })

    const openAndSampleSheetEntry = async () => {
      click('[data-testid="surface-window-open"]')
      await nextTick()

      await waitFor(() => {
        const panel = document.querySelector('[data-testid="surface-window-panel"]') as HTMLElement | null
        expect(panel).not.toBeNull()
        expect(panel?.getAttribute('data-panel-mode')).toBe('sheet')
      })

      const rightSeries = await collectSeries(
        () => toNumber(getComputedStyle(query<HTMLElement>('[data-testid="surface-window-panel"]')).right),
        380,
        24
      )

      const rightDeltas = deltas(rightSeries)
      const amplitude = Math.max(...rightSeries) - Math.min(...rightSeries)

      expect(amplitude).toBeGreaterThan(40)
      expect(rightDeltas.some(delta => delta > 0.2)).toBe(true)

      await waitFor(() => {
        expect(query<HTMLButtonElement>('[data-testid="surface-window-toggle-mode"]').disabled).toBe(false)
      }, 1200)
    }

    await openAndSampleSheetEntry()

    click('[data-testid="surface-window-toggle-mode"]')
    await nextTick()

    await waitFor(() => {
      expect(query<HTMLElement>('[data-testid="surface-window-panel"]').getAttribute('data-panel-mode')).toBe('window')
    }, 1800)

    await waitFor(() => {
      expect(query<HTMLButtonElement>('[data-testid="surface-window-close"]').disabled).toBe(false)
    }, 1200)

    click('[data-testid="surface-window-close"]')
    await nextTick()

    await delay(260)
    expect(document.querySelector('[data-testid="surface-window-panel"]')).not.toBeNull()

    await waitFor(() => {
      expect(document.querySelector('[data-testid="surface-window-panel"]')).toBeNull()
      expect(query<HTMLElement>('[data-testid="surface-window-root"]').getAttribute('data-panel-mounted')).toBe('false')
    }, 2600)

    await openAndSampleSheetEntry()
  })

  test('keeps only one top scrim in nested chain and preserves center+slide dialog motion', async () => {
    mounted = mountStory(SurfaceNestedDialogsChain)

    await waitFor(() => {
      expect(document.querySelector('[data-testid="surface-dialog-chain-open-root"]')).not.toBeNull()
    })

    click('[data-testid="surface-dialog-chain-open-root"]')
    await nextTick()

    await waitFor(() => {
      expect(document.querySelector('[data-testid="surface-dialog-chain-level-1"]')).not.toBeNull()
      expect(query<HTMLElement>('.surface-dialog-chain').getAttribute('data-top-level')).toBe('0')
    })

    while (true) {
      const root = query<HTMLElement>('.surface-dialog-chain')
      const topLevel = Number.parseInt(root.getAttribute('data-top-level') ?? '-1', 10)

      expect(topLevel).toBeGreaterThanOrEqual(0)

      const topDialogSelector = `[data-testid="surface-dialog-chain-level-${topLevel + 1}"]`
      await waitFor(() => {
        expectCentered(query<HTMLElement>(topDialogSelector), 10)
      }, 900)

      expect(document.querySelectorAll('.m3-surface__scrim').length).toBe(1)

      const openNextSelector = `[data-testid="surface-dialog-chain-open-next-${topLevel + 1}"]`
      const openNextButton = document.querySelector(openNextSelector) as HTMLButtonElement | null

      if (!openNextButton) {
        break
      }

      openNextButton.dispatchEvent(new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }))
      await nextTick()

      const nextDialogSelector = `[data-testid="surface-dialog-chain-level-${topLevel + 2}"]`
      await waitFor(() => {
        expect(document.querySelector(nextDialogSelector)).not.toBeNull()
      })

      const translateYSeries = await collectSeries(
        () => matrixTranslateY(query<HTMLElement>(nextDialogSelector)),
        340,
        24
      )
      const translateYDeltas = deltas(translateYSeries)
      const amplitude = Math.max(...translateYSeries) - Math.min(...translateYSeries)

      expect(amplitude).toBeGreaterThan(6)
      expect(translateYDeltas.some(delta => delta < -0.15)).toBe(true)

      await waitFor(() => {
        expect(query<HTMLElement>('.surface-dialog-chain').getAttribute('data-top-level')).toBe(`${topLevel + 1}`)
      })

      expect(document.querySelectorAll('.m3-surface__scrim').length).toBe(1)
      expectCentered(query<HTMLElement>(nextDialogSelector), 10)
    }
  })
})
