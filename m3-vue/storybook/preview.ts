import type { Preview, VueRenderer } from '@storybook/vue3'

import '@modulify/m3-foundation/assets/stylesheets/normalize.scss'
import '@modulify/m3-foundation/assets/stylesheets/index.scss'

import './stylesheets/utils.scss'

import { withThemeByClassName } from '@storybook/addon-themes'

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
    withThemeByClassName<VueRenderer>({
      themes: {
        light: 'm3-theme-light',
        dark: 'm3-theme-dark',
      },
      defaultTheme: 'light',
    }),
  ],
} as Preview
