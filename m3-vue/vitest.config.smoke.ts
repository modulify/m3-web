import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { playwright } from '@vitest/browser-playwright'
import { defineConfig, mergeConfig } from 'vitest/config'

import viteConfig from './vite.config.common'

const __parent = fileURLToPath(new URL('../', import.meta.url))
const __workspace = fileURLToPath(new URL('./', import.meta.url))
const __artifacts = join(__parent, 'artifacts', 'm3-vue')
const __compilerDom = fileURLToPath(new URL(
  './node_modules/@vue/compiler-dom/dist/compiler-dom.esm-browser.js',
  import.meta.url
))
const __vue = fileURLToPath(new URL('./node_modules/vue/dist/vue.esm-bundler.js', import.meta.url))

export default mergeConfig(viteConfig, defineConfig({
  root: __workspace,
  define: {
    'import.meta.env.VITEST_STORYBOOK': JSON.stringify('false'),
  },
  optimizeDeps: {
    include: ['storybook/test'],
  },
  resolve: {
    alias: [
      {
        find: '@vue/compiler-dom',
        replacement: __compilerDom,
      },
      {
        find: 'vue',
        replacement: __vue,
      },
    ],
  },
  test: {
    name: 'm3-vue-smoke',
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
