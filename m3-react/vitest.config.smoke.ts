import { fileURLToPath } from 'node:url'
import { join } from 'node:path'

import { playwright } from '@vitest/browser-playwright'
import { defineConfig, mergeConfig } from 'vitest/config'

import common from './vite.config.common'

const __parent = fileURLToPath(new URL('../', import.meta.url))
const __workspace = fileURLToPath(new URL('./', import.meta.url))
const __artifacts = join(__parent, 'artifacts', 'm3-react')

export default mergeConfig(common, defineConfig({
  root: __workspace,
  define: {
    'import.meta.env.VITEST_STORYBOOK': JSON.stringify('false'),
  },
  optimizeDeps: {
    include: ['storybook/test'],
  },
  test: {
    name: 'm3-react-smoke',
    globals: true,
    attachmentsDir: join(__artifacts, 'storybook', 'attachments'),
    include: [
      'tests/**/*.smoke.ts',
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
        tracesDir: join(__artifacts, 'storybook', 'traces'),
      },
      screenshotFailures: true,
      screenshotDirectory: join(__artifacts, 'storybook', 'screenshots'),
      instances: [
        {
          browser: 'chromium',
        },
      ],
    },
  },
}))
