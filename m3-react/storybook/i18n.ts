import type { ReactNode } from 'react'

import { useSyncExternalStore } from 'react'

import { addons } from 'storybook/preview-api'

export type StorybookLocale = 'en-US' | 'ru-RU'

type LocalizedProps = {
  children?: ReactNode
  locale: StorybookLocale
}

type LocalizedValues<T> = Record<StorybookLocale, T>

type GlobalsPayload = {
  globals?: {
    locale?: unknown
  }
}

type LocaleSyncWindow = Window & {
  __m3StorybookLocaleSyncCleanup?: () => void
}

export const DEFAULT_STORYBOOK_LOCALE: StorybookLocale = 'en-US'

export const STORYBOOK_LOCALE_ITEMS = [
  { value: 'en-US', title: 'English', right: 'EN' },
  { value: 'ru-RU', title: 'Русский', right: 'RU' },
]

const subscribers = new Set<() => void>()
let currentLocale: StorybookLocale = DEFAULT_STORYBOOK_LOCALE

export const resolveStorybookLocale = (value: unknown): StorybookLocale => {
  return value === 'ru-RU' ? value : DEFAULT_STORYBOOK_LOCALE
}

export const localize = <T>(
  locale: unknown,
  values: LocalizedValues<T>
): T => values[resolveStorybookLocale(locale)]

const readLocaleFromQuery = (): StorybookLocale => {
  if (typeof window === 'undefined') return DEFAULT_STORYBOOK_LOCALE

  const globals = new URLSearchParams(window.location.search).get('globals')
  const locale = globals
    ?.split(';')
    .find(value => value.startsWith('locale:'))
    ?.slice('locale:'.length)

  return resolveStorybookLocale(locale)
}

const readLocaleFromPayload = (payload: unknown): StorybookLocale | undefined => {
  if (!payload || typeof payload !== 'object' || !('globals' in payload)) {
    return undefined
  }

  const locale = (payload as GlobalsPayload).globals?.locale

  return typeof locale === 'string' ? resolveStorybookLocale(locale) : undefined
}

const updateLocale = (locale: StorybookLocale): void => {
  if (locale === currentLocale) return

  currentLocale = locale
  subscribers.forEach(subscriber => subscriber())
}

const subscribe = (subscriber: () => void): (() => void) => {
  subscribers.add(subscriber)
  return () => subscribers.delete(subscriber)
}

export const installStorybookLocaleSync = (): void => {
  if (typeof window === 'undefined') return

  const syncWindow = window as LocaleSyncWindow
  syncWindow.__m3StorybookLocaleSyncCleanup?.()
  updateLocale(readLocaleFromQuery())

  const channel = addons.getChannel()
  const handleGlobals = (payload: unknown) => {
    const locale = readLocaleFromPayload(payload)
    if (locale) updateLocale(locale)
  }

  channel.on('setGlobals', handleGlobals)
  channel.on('globalsUpdated', handleGlobals)

  syncWindow.__m3StorybookLocaleSyncCleanup = () => {
    channel.off('setGlobals', handleGlobals)
    channel.off('globalsUpdated', handleGlobals)
  }
}

export const useStorybookLocale = (): StorybookLocale => {
  return useSyncExternalStore(
    subscribe,
    () => currentLocale,
    () => DEFAULT_STORYBOOK_LOCALE
  )
}

export const Localized = ({
  children,
  locale,
}: LocalizedProps): ReactNode => {
  const currentStorybookLocale = useStorybookLocale()

  return currentStorybookLocale === locale ? children : null
}
