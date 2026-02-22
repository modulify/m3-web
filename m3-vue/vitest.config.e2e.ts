import {
  defineProject,
  mergeConfig,
} from 'vitest/config'

import { fileURLToPath } from 'node:url'

import { playwright } from '@vitest/browser-playwright'

import viteConfig from './vite.config'

const workspaceRoot = fileURLToPath(new URL('./', import.meta.url))
const browserProvider = playwright({
  launchOptions: {
    // Avoid headless_shell instability in Linux containers.
    channel: 'chromium',
  },
})

export default mergeConfig(viteConfig, defineProject({
  root: workspaceRoot,
  test: {
    name: 'm3-vue-e2e',
    globals: true,
    include: [
      'tests/**/*.e2e.ts',
    ],
    browser: {
      enabled: true,
      provider: browserProvider,
      headless: true,
      instances: [
        {
          browser: 'chromium',
        },
      ],
    },
  },
}))
