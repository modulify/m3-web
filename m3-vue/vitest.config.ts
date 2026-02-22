import {
  defineProject,
  mergeConfig,
} from 'vitest/config'

import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

import viteConfig from './vite.config'

const __parent = fileURLToPath(new URL('../', import.meta.url))
const __artifacts = join(__parent, 'artifacts', 'm3-vue')

export default mergeConfig(viteConfig, defineProject({
  test: {
    name: 'm3-vue',
    globals: true,
    environment: 'jsdom',
    attachmentsDir: join(__artifacts, 'vitest', 'attachments'),
  },
}))
