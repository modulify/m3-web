import {
  defineConfig,
  mergeConfig,
} from 'vitest/config'

import vitestConfig from './vitest.config'

export default mergeConfig(vitestConfig, defineConfig({
  test: {
    name: 'm3-react-smoke',
    include: [
      'tests/**/*.smoke.ts',
    ],
  },
}))
