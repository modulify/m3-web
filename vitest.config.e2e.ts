import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      './m3-react/vitest.config.e2e.ts',
      './m3-vue/vitest.config.e2e.ts',
    ],
  },
})
