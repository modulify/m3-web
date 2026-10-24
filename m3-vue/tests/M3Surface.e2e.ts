import type { App } from 'vue'

import { createApp, nextTick } from 'vue'
import { page } from 'vitest/browser'

import SurfaceExperimentHarness from './fixtures/SurfaceExperimentHarness.vue'

const RUN_ID = 'EXP-2026-02-23-surface-e2e-002h-001'
const SCREENSHOT_DIR = `../../drafts/experiment/runs/${RUN_ID}/screenshots/e2e`
const MAX_EASING_RATE_FACTOR = 5
const MAX_BACKTRACK_PX = 6
const SIDE_SHEET_TRANSITION_MS = 420
const CARD_TRANSITION_MS = 320

type HarnessMount = {
  app: App;
  mountPoint: HTMLDivElement;
}

type RectPoint = {
  timestamp: number;
  width: number;
  height: number;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const waitFor = async (assertion: () => void, timeoutMs = 1600) => {
  const startedAt = Date.now()
  let lastError: unknown

  while (Date.now() - startedAt < timeoutMs) {
    try {
      assertion()
      return
    } catch (error) {
      lastError = error
      await delay(12)
    }
  }

  throw lastError ?? new Error('waitFor timeout')
}

const mountHarness = (): HarnessMount => {
  const mountPoint = document.createElement('div')
  mountPoint.setAttribute('data-testid', 'surface-harness-mount')
  document.body.append(mountPoint)

  const app = createApp(SurfaceExperimentHarness)
  app.mount(mountPoint)

  return {
    app,
    mountPoint,
  }
}

const collectRectSeries = (element: HTMLElement, durationMs: number) => new Promise<RectPoint[]>((resolve) => {
  const points: RectPoint[] = []

  const sample = (timestamp: number) => {
    const rect = element.getBoundingClientRect()
    // CSS transitions and rAF timestamps share the frame's animation clock.
    points.push({ timestamp, width: rect.width, height: rect.height })

    if (timestamp - points[0].timestamp >= durationMs) {
      resolve(points)
    } else {
      requestAnimationFrame(sample)
    }
  }

  requestAnimationFrame(sample)
})

const deltas = (values: number[]) => values.slice(1).map((value, index) => value - values[index])

const expectSmoothGrowth = (
  points: RectPoint[],
  dimension: 'width' | 'height',
  totalChange: number,
  transitionMs: number
) => {
  expect(points.length).toBeGreaterThan(2)
  const values = points.map(point => point[dimension])
  const valueDeltas = deltas(values)
  const rates = valueDeltas.map((delta, index) => (
    delta / (points[index + 1].timestamp - points[index].timestamp)
  ))

  expect(valueDeltas.some(delta => delta > 0)).toBe(true)
  expect(Math.min(...valueDeltas)).toBeGreaterThan(-MAX_BACKTRACK_PX)
  expect(Math.max(...rates)).toBeLessThan(
    Math.abs(totalChange) / transitionMs * MAX_EASING_RATE_FACTOR
  )
}

const click = (selector: string) => {
  const element = document.querySelector(selector) as HTMLButtonElement | null
  if (!element) {
    throw new Error(`Element not found: ${selector}`)
  }

  element.dispatchEvent(new MouseEvent('click', { bubbles: true }))
}

const capture = async (name: string) => {
  await page.screenshot({
    path: `${SCREENSHOT_DIR}/${name}.png`,
  })
}

describe('m3-vue/surface e2e', () => {
  let mounted: HarnessMount | null = null

  beforeEach(async () => {
    await page.viewport(1440, 1024)
    mounted = mountHarness()
  })

  afterEach(() => {
    mounted?.app.unmount()
    mounted?.mountPoint.remove()
    mounted = null
    document.body.innerHTML = ''
  })

  test('orchestrates multiple roles and morphs docked side-sheet to modal without layout jerk', async () => {
    await waitFor(() => {
      const root = document.querySelector('[data-testid="surface-exp-root"]')
      expect(root).not.toBeNull()
    })

    const staticRoles = [
      'surface-container-lowest',
      'surface-container-low',
      'surface-container-high',
      'surface-dim',
    ]

    staticRoles.forEach((role) => {
      const block = document.querySelector(`[data-testid="static-role-${role}"]`) as HTMLElement | null
      expect(block).not.toBeNull()
      expect(block?.classList.contains(`m3-surface_${role.replace(/^surface-/, '')}`)).toBe(true)
    })

    const content = document.querySelector('[data-testid="sheet-layout-content"]') as HTMLElement
    const beforeRect = content.getBoundingClientRect()

    await capture('scenario-a-side-sheet-before')

    click('[data-testid="sheet-to-modal"]')
    await nextTick()

    const rectSeries = await collectRectSeries(content, 560)

    await waitFor(() => {
      const modalSheet = document.querySelector('[data-testid="orchestrated-side-sheet"][role="dialog"]')
      const scrim = document.querySelector('.m3-surface__scrim')
      expect(modalSheet).not.toBeNull()
      expect(scrim).not.toBeNull()
    })

    await delay(180)
    await capture('scenario-a-side-sheet-mid')

    await delay(220)
    const afterRect = content.getBoundingClientRect()
    expect(afterRect.width).toBeGreaterThan(beforeRect.width + 220)
    expectSmoothGrowth(rectSeries, 'width', afterRect.width - beforeRect.width, SIDE_SHEET_TRANSITION_MS)

    await capture('scenario-a-side-sheet-after')
  })

  test('expands card-like surface into page-like container with reserved layout zones', async () => {
    await waitFor(() => {
      const card = document.querySelector('[data-testid="orchestrated-card-surface"]') as HTMLElement | null
      expect(card).not.toBeNull()
    })

    const canvas = document.querySelector('[data-testid="card-canvas"]') as HTMLElement
    const overlayWrap = document.querySelector('[data-testid="card-overlay-wrap"]') as HTMLElement
    const origin = document.querySelector('[data-testid="card-origin-slot"]') as HTMLElement

    await waitFor(() => {
      const rect = overlayWrap.getBoundingClientRect()
      const originRect = origin.getBoundingClientRect()
      expect(Math.abs(rect.width - originRect.width)).toBeLessThan(0.5)
      expect(Math.abs(rect.height - originRect.height)).toBeLessThan(0.5)
      expect(overlayWrap.getAnimations()).toHaveLength(0)
    })

    const beforeRect = overlayWrap.getBoundingClientRect()

    expect(beforeRect.width).toBeGreaterThan(280)
    expect(beforeRect.height).toBeGreaterThan(180)

    await capture('scenario-b-card-before')

    click('[data-testid="card-to-page"]')
    await nextTick()

    const rectSeries = await collectRectSeries(overlayWrap, 380)
    await delay(240)
    const afterRect = overlayWrap.getBoundingClientRect()
    const canvasRect = canvas.getBoundingClientRect()

    expect(afterRect.width).toBeGreaterThan(canvasRect.width - 44)
    expect(afterRect.height).toBeGreaterThan(canvasRect.height - 44)
    expectSmoothGrowth(rectSeries, 'width', afterRect.width - beforeRect.width, CARD_TRANSITION_MS)
    expectSmoothGrowth(rectSeries, 'height', afterRect.height - beforeRect.height, CARD_TRANSITION_MS)

    const morphedSurface = document.querySelector('[data-testid="orchestrated-card-surface"]') as HTMLElement
    expect(morphedSurface.classList.contains('m3-surface')).toBe(true)
    expect(morphedSurface.classList.contains('m3-surface_container')).toBe(false)
    expect(morphedSurface.style.borderTopLeftRadius).toBe('0px')

    await capture('scenario-b-card-after')
  })
})
