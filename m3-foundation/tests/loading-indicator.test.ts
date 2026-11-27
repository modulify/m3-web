import { expect, test } from 'vitest'

import { geometryAt, normalizeSize } from '../lib/loading-indicator'

test('loading indicator scales its 48px reference footprint within the recommended range', () => {
  expect(normalizeSize(48)).toBe(48)
  expect(normalizeSize(12)).toBe(24)
  expect(normalizeSize(320)).toBe(240)
  expect(normalizeSize(Number.NaN)).toBe(48)
})

test('loading indicator rotates continuously across its repeating shape cycle', () => {
  const initial = geometryAt(0)
  const next = geometryAt(650)
  const final = geometryAt(7 * 650)

  expect(initial.rotation).toBe(0)
  expect(next.rotation).toBeGreaterThan(initial.rotation)
  expect(final.rotation).toBeGreaterThan(next.rotation)

  for (let stage = 1; stage <= 7; stage++) {
    const before = geometryAt(stage * 650 - 1)
    const after = geometryAt(stage * 650)
    expect(Math.abs(before.rotation - after.rotation)).toBeLessThan(0.3)
  }
})

test('loading indicator treats invalid and negative elapsed time as the initial frame', () => {
  const initial = geometryAt(0)

  expect(geometryAt(-650)).toEqual(initial)
  expect(geometryAt(Number.NaN)).toEqual(initial)
  expect(geometryAt(Number.POSITIVE_INFINITY)).toEqual(initial)
})
