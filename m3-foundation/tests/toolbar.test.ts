import { describe, expect, test } from 'vitest'

import { getToolbarScrollState, getToolbarVisibleCount } from '../lib/toolbar'

describe('toolbar layout', () => {
  test('reserves overflow space only when all actions cannot fit', () => {
    expect(getToolbarVisibleCount(256, 5)).toBe(5)
    expect(getToolbarVisibleCount(200, 5)).toBe(2)
    expect(getToolbarVisibleCount(48, 5)).toBe(0)
    expect(getToolbarVisibleCount(260, 5, 100)).toBe(2)
  })

  test('retains scroll state until direction changes and resets at the top', () => {
    expect(getToolbarScrollState(0, 20, false, 'hide')).toBe(true)
    expect(getToolbarScrollState(20, 20, true, 'hide')).toBe(true)
    expect(getToolbarScrollState(20, 10, true, 'hide')).toBe(false)
    expect(getToolbarScrollState(20, 0, true, 'collapse')).toBe(false)
    expect(getToolbarScrollState(0, 20, false, 'pinned')).toBe(false)
  })
})
