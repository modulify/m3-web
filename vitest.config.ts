import {
  configDefaults,
  defineConfig,
} from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      './m3-react/vitest.config.ts',
      './m3-vue/vitest.config.ts',
    ],
    coverage: {
      reporter: 'html',
      provider: 'istanbul',
      exclude: [
        '**/storybook/**',
        ...configDefaults.coverage.exclude,
      ],
    },
  },
})
