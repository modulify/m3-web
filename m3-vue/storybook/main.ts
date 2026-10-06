import type { StorybookConfig } from '@storybook/vue3-vite'

import remarkGfm from 'remark-gfm'

const DEFAULT_ALLOWED_HOSTS = [
  'localhost',
  '127.0.0.1',
  '.modulify.test',
]

const envAllowedHosts = (process.env.STORYBOOK_ALLOWED_HOSTS ?? '')
  .split(',')
  .map(host => host.trim())
  .filter(Boolean)

const allowedHosts = Array.from(new Set([
  ...DEFAULT_ALLOWED_HOSTS,
  ...envAllowedHosts,
]))

const config: StorybookConfig = {
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-a11y',
    {
      name: '@storybook/addon-docs',
      options: {
        mdxPluginOptions: {
          mdxCompileOptions: {
            remarkPlugins: [remarkGfm],
          },
        },
      },
    },
    '@storybook/addon-links',
    '@storybook/addon-themes',
  ],
  core: {
    allowedHosts,
    disableWhatsNewNotifications: true,
  },
  framework: {
    name: '@storybook/vue3-vite',
    options: {
      builder: {
        viteConfigPath: './storybook/vite.config.ts',
      },
    },
  },
  features: {
    sidebarOnboardingChecklist: false,
  },
  staticDirs: [
    { from: '../../storybook/assets', to: '/storybook-assets' },
    { from: './assets', to: '/assets' },
    { from: '../assets', to: '/brand' },
  ],
  stories: [
    './**/*.mdx',
    './**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  viteFinal: async (config) => {
    config.server ??= {}
    config.server.watch = {
      ...(config.server.watch ?? {}),
      awaitWriteFinish: {
        stabilityThreshold: 100,
        pollInterval: 10,
      },
    }

    if (config.server.allowedHosts !== true) {
      config.server.allowedHosts = [
        ...(config.server.allowedHosts ?? []),
        ...allowedHosts,
      ]
    }

    if (typeof config.server.hmr === 'object') {
      config.server.hmr.clientPort = 80
    }

    return config
  },
}

export default config
