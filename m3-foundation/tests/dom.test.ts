import { describe, expect, test } from 'vitest'

import { mergeIdRefs } from '../lib/dom'

describe('DOM utilities', () => {
  test('merges ID reference lists in their accessible-name order', () => {
    expect(mergeIdRefs('external-label description', 'internal-label')).toBe(
      'external-label description internal-label'
    )
  })

  test('normalizes whitespace and removes repeated IDs', () => {
    expect(mergeIdRefs(' external-label\tshared ', 'shared  internal-label')).toBe(
      'external-label shared internal-label'
    )
  })

  test('returns undefined for empty ID reference lists', () => {
    expect(mergeIdRefs(undefined, null, '', '  ')).toBeUndefined()
  })
})
