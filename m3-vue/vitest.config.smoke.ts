import {
  defineProject,
  mergeConfig,
} from 'vitest/config'

import vitestConfig from './vitest.config'

export default mergeConfig(vitestConfig, defineProject({
  test: {
    name: 'm3-vue-smoke',
    include: [
      'tests/**/*.smoke.ts',
    ],
  },
}))
