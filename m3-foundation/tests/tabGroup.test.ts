import { expect, test } from 'vitest'

import { readTabNavigation, withTabNavigation } from '../lib/tabGroup'

test('query navigation preserves unrelated parameters and hash', () => {
  const original = new URL('https://example.test/mail?filter=unread&tab=inbox&page=2#message')
  const next = withTabNavigation(original, 'query', 'Черновики & shared')

  expect(next.searchParams.get('filter')).toBe('unread')
  expect(next.searchParams.get('page')).toBe('2')
  expect(next.hash).toBe('#message')
  expect(readTabNavigation(next, 'query')).toBe('Черновики & shared')
  expect(readTabNavigation(original, 'query')).toBe('inbox')
})

test('hash navigation encodes tab keys and ignores malformed hashes', () => {
  const original = new URL('https://example.test/mail?filter=unread')
  const next = withTabNavigation(original, 'hash', 'drafts/личное')

  expect(next.searchParams.get('filter')).toBe('unread')
  expect(readTabNavigation(next, 'hash')).toBe('drafts/личное')
  expect(readTabNavigation(new URL('https://example.test/mail#%zz'), 'hash')).toBeNull()
  expect(readTabNavigation(original, 'hash')).toBeNull()
})

test('query navigation uses the requested parameter name', () => {
  const url = new URL('https://example.test/mail?tab=inbox&folder=drafts')
  expect(readTabNavigation(url, 'query', 'folder')).toBe('drafts')
  expect(withTabNavigation(url, 'query', 'trash', 'folder').searchParams.get('tab')).toBe('inbox')
})
