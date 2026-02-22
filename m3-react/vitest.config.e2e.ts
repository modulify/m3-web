import {
  defineConfig,
  mergeConfig,
} from 'vitest/config'

import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { playwright } from '@vitest/browser-playwright'

import viteConfig from './vite.config'

const __parent = fileURLToPath(new URL('../', import.meta.url))
const __workspace = fileURLToPath(new URL('./', import.meta.url))
const __artifacts = join(__parent, 'artifacts', 'm3-react')

export default mergeConfig(viteConfig, defineConfig({
  root: __workspace,
  test: {
    name: 'm3-react-e2e',
    globals: true,
    include: [
      'tests/**/*.e2e.tsx',
    ],
    browser: {
      enabled: true,
      provider: playwright({
        launchOptions: {
          // Avoid headless_shell instability in Linux containers.
          channel: 'chromium',
        },
      }),
      headless: true,
      trace: {
        mode: 'retain-on-failure',
        tracesDir: join(__artifacts, 'playwright', 'traces'),
      },
      screenshotFailures: true,
      screenshotDirectory: join(__artifacts, 'playwright', 'screenshots'),
      instances: [
        {
          browser: 'chromium',
        },
      ],
    },
  },
}))
