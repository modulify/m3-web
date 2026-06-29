import type { Preview, VueRenderer } from '@storybook/vue3'

import '@modulify/m3-foundation/assets/stylesheets/normalize.scss'
import '@modulify/m3-foundation/assets/stylesheets/index.scss'
import '@modulify/m3-foundation/assets/stylesheets/storybook/utils.scss'

import { withThemeByClassName } from '@storybook/addon-themes'
import { addons } from 'storybook/preview-api'
import theme from './theme'
import { MdxCodeBlock, MdxCodePreBlock } from './utils/mdxCodeBlock'

type DocsParameter = NonNullable<NonNullable<Preview['parameters']>['docs']> & {
  components?: {
    code: typeof MdxCodeBlock
    pre: typeof MdxCodePreBlock
  }
}

const themeClassByName = {
  light: 'm3-theme-light',
  dark: 'm3-theme-dark',
} as const

const themeClasses = Object.values(themeClassByName)

const docsParameter: DocsParameter = {
  components: {
    code: MdxCodeBlock,
    pre: MdxCodePreBlock,
  },
  source: {
    language: 'text',
  },
  theme,
}

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
    a11y: {
      test: 'error',
      options: {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa'],
        },
      },
    },
    backgrounds: { disable: true },
    docs: docsParameter,
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: (a = { id: '' }, b = { id: '' }) => {
        const aId = a?.id ?? ''
        const bId = b?.id ?? ''

        return aId.endsWith('docs') && !bId.endsWith('docs')
          ? -1
          : !aId.endsWith('docs') && bId.endsWith('docs')
            ? 1
            : aId === bId
              ? 0
              : aId.localeCompare(bId, undefined, { numeric: true })
      },
    },
  },
  decorators: [
    withThemeByClassName<VueRenderer>({
      themes: themeClassByName,
      defaultTheme: 'light',
    }),
  ],
  tags: ['autodocs'],
} satisfies Preview
