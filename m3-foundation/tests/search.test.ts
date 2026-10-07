import { describe, expect, it } from 'vitest'

import {
  getSearchDockedPosition,
  getSearchRevealOrigin,
  resolveSearchLayout,
} from '../lib/search'

describe('Search layout', () => {
  it('uses full-screen only at the compact breakpoint in auto mode', () => {
    expect(resolveSearchLayout('auto', 'compact')).toBe('full-screen')
    expect(resolveSearchLayout('auto', 'medium')).toBe('docked')
    expect(resolveSearchLayout('auto', 'expanded')).toBe('docked')
    expect(resolveSearchLayout('auto', 'large')).toBe('docked')
    expect(resolveSearchLayout('full-screen', 'large')).toBe('full-screen')
    expect(resolveSearchLayout('docked', 'compact')).toBe('docked')
  })

  it('keeps the docked view within a narrow viewport', () => {
    expect(getSearchDockedPosition(
      { left: 24, top: 80, width: 340 },
      { width: 400, height: 700 }
    )).toEqual({ left: 12, top: 80, width: 364 })
  })

  it('keeps a maximum-width bar aligned with its docked view', () => {
    expect(getSearchDockedPosition(
      { left: 60, top: 80, width: 720 },
      { width: 1000, height: 800 }
    )).toEqual({ left: 60, top: 80, width: 720 })
  })

  it('clamps the view at the right and bottom edges', () => {
    expect(getSearchDockedPosition(
      { left: 1100, top: 700, width: 760 },
      { width: 1200, height: 800 }
    )).toEqual({ left: 468, top: 548, width: 720 })
  })

  it('starts the contained reveal at the collapsed bar in either layout', () => {
    const anchor = { left: 24, top: 80, width: 342 }
    const viewport = { width: 390, height: 760 }
    const position = { left: 12, top: 80, width: 366 }

    expect(getSearchRevealOrigin(anchor, viewport, position, 'full-screen'))
      .toEqual({ left: 24, right: 24, offsetY: 68 })
    expect(getSearchRevealOrigin(anchor, viewport, position, 'docked'))
      .toEqual({ left: 12, right: 12, offsetY: 0 })
  })
})
