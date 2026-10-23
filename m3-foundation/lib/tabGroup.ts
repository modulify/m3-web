import type { TabNavigation } from '../types/components/tabs'

export const readTabNavigation = (url: URL, navigation: TabNavigation, queryKey = 'tab'): string | null => {
  if (navigation === 'query') return url.searchParams.get(queryKey)

  const hash = url.hash.slice(1)
  if (!hash) return null

  try {
    return decodeURIComponent(hash)
  } catch {
    return null
  }
}

export const withTabNavigation = (
  url: URL,
  navigation: TabNavigation,
  value: string,
  queryKey = 'tab'
): URL => {
  const next = new URL(url)
  if (navigation === 'hash') next.hash = encodeURIComponent(value)
  else next.searchParams.set(queryKey, value)
  return next
}
