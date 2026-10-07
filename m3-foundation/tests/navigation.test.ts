import { describe, expect, test } from 'vitest'

import {
  isBarAppearance,
  isExpandableAppearance,
  isExpandedRail,
  isHiddenRail,
  isModalExpansion,
  resolveNavigationAppearance,
} from '../lib/navigation'

describe('resolveNavigationAppearance', () => {
  test('preserves the default adaptive mapping', () => {
    expect(resolveNavigationAppearance('compact')).toBe('bar')
    expect(resolveNavigationAppearance('medium')).toBe('bar')
    expect(resolveNavigationAppearance('expanded')).toBe('rail')
    expect(resolveNavigationAppearance('large')).toBe('rail-expanded')
    expect(resolveNavigationAppearance('extra-large')).toBe('rail-expanded')
  })

  test('selects the next wider allowed form or falls back to the widest narrower form', () => {
    expect(resolveNavigationAppearance('compact', ['rail', 'rail-expanded'])).toBe('rail')
    expect(resolveNavigationAppearance('medium', ['rail', 'rail-expanded'])).toBe('rail')
    expect(resolveNavigationAppearance('expanded', ['bar', 'rail-expanded'])).toBe('rail-expanded')
    expect(resolveNavigationAppearance('extra-large', ['bar', 'rail'])).toBe('rail')
    expect(resolveNavigationAppearance('compact', ['rail-expanded'])).toBe('rail-expanded')
  })

  test('uses the vertical bar when it is the only allowed bar form', () => {
    expect(resolveNavigationAppearance('compact', ['bar-vertical', 'rail'])).toBe('bar-vertical')
    expect(resolveNavigationAppearance('medium', ['bar-vertical', 'rail'])).toBe('bar-vertical')
    expect(resolveNavigationAppearance('expanded', ['bar-vertical'])).toBe('bar-vertical')
    expect(resolveNavigationAppearance('medium', ['bar', 'bar-vertical', 'rail'])).toBe('bar')
  })

  test('identifies bar, expandable, and modal forms', () => {
    expect(isBarAppearance('bar-vertical')).toBe(true)
    expect(isBarAppearance('rail')).toBe(false)
    expect(isExpandableAppearance('drawer')).toBe(true)
    expect(isExpandableAppearance('bar')).toBe(false)
    expect(isExpandedRail('rail', true)).toBe(true)
    expect(isHiddenRail('rail', false, 'hidden')).toBe(true)
    expect(isHiddenRail('rail', true, 'hidden')).toBe(false)
    expect(isModalExpansion('rail', true, 'auto', false)).toBe(true)
    expect(isModalExpansion('rail', true, 'auto', true)).toBe(false)
    expect(isModalExpansion('drawer', true, 'standard', true)).toBe(true)
    expect(isModalExpansion('bar-vertical', true, 'modal', false)).toBe(false)
  })

  test('rejects an empty or invalid allow-list', () => {
    expect(() => resolveNavigationAppearance('compact', [])).toThrow(RangeError)
    expect(() => resolveNavigationAppearance('compact', ['drawer' as never])).toThrow(RangeError)
  })
})
