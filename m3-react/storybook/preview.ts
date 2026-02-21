import type { Preview, ReactRenderer } from '@storybook/react'

import '@modulify/m3-foundation/assets/stylesheets/normalize.scss'
import '@modulify/m3-foundation/assets/stylesheets/index.scss'

import './stylesheets/utils.scss'

import { withThemeByClassName } from '@storybook/addon-themes'
import { addons } from 'storybook/preview-api'

const themeClassByName = {
  light: 'm3-theme-light',
  dark: 'm3-theme-dark',
} as const

const themeClasses = Object.values(themeClassByName)

const applyThemeClass = (themeName?: unknown): void => {
  const rootElement = document.documentElement

  rootElement.classList.remove(...themeClasses)

  const nextClass =
    typeof themeName === 'string'
      ? themeClassByName[themeName as keyof typeof themeClassByName]
      : undefined

  rootElement.classList.add(nextClass ?? themeClassByName.light)
}

const pickThemeFromPayload = (payload: unknown): string | undefined => {
  if (!payload || typeof payload !== 'object' || !('globals' in payload)) {
    return undefined
  }

  const globals = (payload as { globals?: { theme?: unknown } }).globals

  return typeof globals?.theme === 'string' ? globals.theme : undefined
}

const pickThemeFromQuery = (): string | undefined => {
  const globalsParam = new URLSearchParams(window.location.search).get('globals')

  if (!globalsParam) {
    return undefined
  }

  const themePair = globalsParam
    .split(';')
    .find((entry) => entry.startsWith('theme:'))

  return themePair?.slice('theme:'.length)
}

const installThemeSync = (): void => {
  if (typeof window === 'undefined') {
    return
  }

  const syncWindow = window as Window & {
    __m3StorybookThemeSyncInstalled?: boolean
  }

  if (syncWindow.__m3StorybookThemeSyncInstalled) {
    return
  }

  syncWindow.__m3StorybookThemeSyncInstalled = true
  applyThemeClass(pickThemeFromQuery())

  const channel = addons.getChannel()

  channel.on('setGlobals', (payload: unknown) => {
    applyThemeClass(pickThemeFromPayload(payload))
  })

  channel.on('globalsUpdated', (payload: unknown) => {
    applyThemeClass(pickThemeFromPayload(payload))
  })
}

installThemeSync()

export default {
  parameters: {
    backgrounds: { disable: true },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: (a, b) => {
        return a.id.endsWith('docs') && !b.id.endsWith('docs')
          ? -1
          : !a.id.endsWith('docs') && b.id.endsWith('docs')
            ? 1
            : a.id === b.id
              ? 0
              : a.id.localeCompare(b.id, undefined, { numeric: true })
      },
    },
  },
  decorators: [
    withThemeByClassName<ReactRenderer>({
      themes: themeClassByName,
      defaultTheme: 'light',
    }),
  ],
} as Preview
