import { describe, expect, test } from 'vitest'

import {
  isDelay,
  isOverflowBehavior,
  isPlacement,
  isTriggerOptions,
} from '../lib/popper/predicates'

describe('popper predicates', () => {
  test('accepts partial delay objects', () => {
    expect(isDelay({})).toBe(true)
    expect(isDelay({ show: 100 })).toBe(true)
    expect(isDelay({ hide: '200' })).toBe(true)
    expect(isDelay({ show: 'not-a-number' })).toBe(false)
  })

  test('accepts partial trigger schemas', () => {
    expect(isTriggerOptions({})).toBe(true)
    expect(isTriggerOptions({ show: ['hover'] })).toBe(true)
    expect(isTriggerOptions({ hide: ['click'] })).toBe(true)
    expect(isTriggerOptions({ show: ['invalid'] })).toBe(false)
  })

  test('checks finite sets of popper values', () => {
    expect(isPlacement('bottom-start')).toBe(true)
    expect(isPlacement('center')).toBe(false)
    expect(isOverflowBehavior(['flip', 'shift'])).toBe(true)
    expect(isOverflowBehavior(['flip', 'invalid'])).toBe(false)
  })
})
