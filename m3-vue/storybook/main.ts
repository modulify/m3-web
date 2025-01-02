import type { StorybookConfig } from '@storybook/vue3-vite'

import { join, dirname } from 'path'

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath (value: string): string {
  return dirname(require.resolve(join(value, 'package.json')))
}

const config: StorybookConfig = {
  addons: [
    getAbsolutePath('@chromatic-com/storybook'),
    getAbsolutePath('@storybook/addon-a11y'),
    getAbsolutePath('@storybook/addon-essentials'),
    getAbsolutePath('@storybook/addon-interactions'),
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@storybook/addon-themes'),
  ],
  core: {
    builder: {
      name: '@storybook/builder-vite',
      options: {
        viteConfigPath: './vite.config.ts',
      },
    },
  },
  framework: {
    name: getAbsolutePath('@storybook/vue3-vite'),
    options: {},
  },
  staticDirs: [
    { from: './assets', to: '/assets' },
  ],
  stories: [
    './**/*.mdx',
    './**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  viteFinal: async (config) => {
    if (config.server && typeof config.server.hmr === 'object') {
      config.server.hmr.clientPort = 80
    }

    return config
  },
}

export default config
