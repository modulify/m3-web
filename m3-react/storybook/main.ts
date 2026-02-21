import type { StorybookConfig } from '@storybook/react-vite'

const DEFAULT_ALLOWED_HOSTS = [
  'localhost',
  '127.0.0.1',
]

const envAllowedHosts = (process.env.STORYBOOK_ALLOWED_HOSTS ?? '')
  .split(',')
  .map(host => host.trim())
  .filter(Boolean)

const config: StorybookConfig = {
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-links',
    '@storybook/addon-themes',
  ],
  core: {
    builder: {
      name: '@storybook/builder-vite',
      options: {
        viteConfigPath: './vite.config.ts',
      },
    },
  },
  docs: {
    autodocs: 'tag',
  },
  framework: {
    name: '@storybook/react-vite',
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
    config.server ??= {}

    if (config.server.allowedHosts !== true) {
      config.server.allowedHosts = [
        ...(config.server.allowedHosts ?? []),
        ...DEFAULT_ALLOWED_HOSTS,
        ...envAllowedHosts,
      ]
    }

    if (typeof config.server.hmr === 'object') {
      config.server.hmr.clientPort = 80
    }

    return config
  },
}

export default config
