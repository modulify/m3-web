import {
  defineConfig,
  mergeConfig,
} from 'vitest/config'

import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

import viteConfig from './vite.config'

const __parent = fileURLToPath(new URL('../', import.meta.url))
const __artifacts = join(__parent, 'artifacts', 'm3-react')

export default mergeConfig(viteConfig, defineConfig({
  test: {
    name: 'm3-react',
    globals: true,
    environment: 'jsdom',
    attachmentsDir: join(__artifacts, 'vitest', 'attachments'),
  },
}))
