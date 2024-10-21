import {
  defineProject,
  mergeConfig,
} from 'vitest/config'

import viteConfig from './vite.config'

export default mergeConfig(viteConfig, defineProject({
  test: {
    name: 'm3-vue',
    globals: true,
    environment: 'jsdom',
  },
}))
