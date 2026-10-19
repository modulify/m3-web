// @vitest-environment jsdom

import {
  afterEach,
  describe,
  expect,
  test,
  vi,
} from 'vitest'

import { clamp } from '../lib/surface/orchestration'
import {
  getModalAnchorStyle,
  getResolvedVariant,
  getSurfacePanelClassRecord,
  getSurfacePanelStyle,
} from '../lib/surface/style'
import {
  measureContainerRect,
  measureRelativeRect,
  raf,
  toMotionStyle,
  wait,
  waitForMotion,
} from '../lib/surface/orchestration'

const inset = { top: '8px', right: '16px', bottom: '24px', left: '32px' }
const scheduleFrame = (callback: FrameRequestCallback) => window.setTimeout(() => callback(0), 16)

describe('surface style', () => {
  test('resolves automatic surface variants from elevation while preserving explicit variants', () => {
    expect([0, 1, 2, 3, 4, 5].map(elevation => getResolvedVariant('auto', elevation))).toEqual([
      'surface',
      'surface-container-low',
      'surface-container',
      'surface-container-high',
      'surface-container-highest',
      'surface-bright',
    ])
    expect(getResolvedVariant('surface-dim', 4)).toBe('surface-dim')
    expect(getSurfacePanelClassRecord(0, 'auto')).toEqual({
      'm3-surface': true,
      '': false,
      'm3-surface_elevation-0': true,
    })
    expect(getSurfacePanelClassRecord(2, 'auto')).toMatchObject({
      'm3-surface_container': true,
      'm3-surface_elevation-2': true,
    })
  })

  test('uses fill sizing by default and accepts explicit bounds, corners, timing, and style overrides', () => {
    const defaults = getSurfacePanelStyle({})

    expect(defaults).toMatchObject({
      width: '100%',
      height: '100%',
      borderTopLeftRadius: '0px',
      overflow: 'visible',
    })

    const panel = getSurfacePanelStyle({
      fillWidth: false,
      fillHeight: false,
      width: 320,
      height: '40vh',
      minWidth: 120,
      maxWidth: '80vw',
      minHeight: 48,
      maxHeight: '90vh',
      rounding: 24,
      roundingTopLeft: 8,
      roundingTopRight: '12px',
      roundingBottomRight: 16,
      roundingBottomLeft: '20px',
      transitionMs: 400,
      transitionTiming: 'ease-in',
      overflow: 'auto',
      style: { opacity: 0.5 },
    })

    expect(panel).toMatchObject({
      width: '320px',
      height: '40vh',
      minWidth: '120px',
      maxWidth: '80vw',
      minHeight: '48px',
      maxHeight: '90vh',
      borderTopLeftRadius: '8px',
      borderTopRightRadius: '12px',
      borderBottomRightRadius: '16px',
      borderBottomLeftRadius: '20px',
      overflow: 'auto',
      opacity: 0.5,
      '--m3-surface-radius-transition-duration': '400ms',
    })
    expect(panel.transition).toContain('width 400ms ease-in')
    expect(getSurfacePanelStyle({ fillWidth: false, fillHeight: false, rounding: 12 })).toMatchObject({
      width: 'auto',
      height: 'auto',
      borderTopLeftRadius: '12px',
      borderBottomRightRadius: '12px',
    })
  })

  test('anchors modal panels to the requested viewport edges', () => {
    expect(getModalAnchorStyle('none', inset)).toEqual(inset)
    expect(getModalAnchorStyle('center', inset)).toMatchObject({
      top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
    })
    expect(getModalAnchorStyle('start', inset)).toMatchObject({ left: '32px', right: 'auto' })
    expect(getModalAnchorStyle('end', inset)).toMatchObject({ right: '16px', left: 'auto' })
    expect(getModalAnchorStyle('top', inset)).toMatchObject({ top: '8px', bottom: 'auto' })
    expect(getModalAnchorStyle('bottom', inset)).toMatchObject({ bottom: '24px', top: 'auto' })
    expect(getModalAnchorStyle('top-start', inset)).toMatchObject({ top: '8px', left: '32px' })
    expect(getModalAnchorStyle('top-end', inset)).toMatchObject({ top: '8px', right: '16px' })
    expect(getModalAnchorStyle('bottom-start', inset)).toMatchObject({ bottom: '24px', left: '32px' })
    expect(getModalAnchorStyle('bottom-end', inset)).toMatchObject({ bottom: '24px', right: '16px' })
  })
})

describe('surface orchestration', () => {
  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  test('measures a card relative to its canvas and formats its motion geometry', () => {
    const canvas = document.createElement('div')
    const card = document.createElement('div')
    vi.spyOn(canvas, 'getBoundingClientRect').mockReturnValue(DOMRect.fromRect({ x: 10, y: 20, width: 800, height: 600 }))
    vi.spyOn(card, 'getBoundingClientRect').mockReturnValue(DOMRect.fromRect({ x: 30, y: 50, width: 320, height: 220 }))

    expect(measureRelativeRect(canvas, card)).toEqual({ top: 30, left: 20, width: 320, height: 220 })
    expect(measureContainerRect(canvas)).toEqual({ top: 0, left: 0, width: 800, height: 600 })
    expect(toMotionStyle(measureRelativeRect(canvas, card)!)).toEqual({
      top: '30px', left: '20px', width: '320px', height: '220px',
    })
    expect(measureRelativeRect(null, card)).toBeNull()
    expect(measureContainerRect(null)).toBeNull()
    expect(clamp(12, 0, 10)).toBe(10)
    expect(clamp(-1, 0, 10)).toBe(0)
    expect(clamp(5, 0, 10)).toBe(5)
  })

  test('waits for an animation frame and uses zero delay for reduced motion', async () => {
    vi.useFakeTimers()
    vi.stubGlobal('requestAnimationFrame', scheduleFrame)
    vi.stubGlobal('matchMedia', () => ({ matches: true }))

    const frame = raf()
    const motion = waitForMotion(200)
    const delay = wait(20)

    await vi.advanceTimersByTimeAsync(0)
    await expect(motion).resolves.toBeUndefined()

    await vi.advanceTimersByTimeAsync(20)
    await expect(frame).resolves.toBeUndefined()
    await expect(delay).resolves.toBeUndefined()
  })
})
