import { fileURLToPath } from 'node:url'
import { join } from 'node:path'

import { defineConfig, mergeConfig } from 'vitest/config'

import common from './vite.config.common'

const __parent = fileURLToPath(new URL('../', import.meta.url))
const __artifacts = join(__parent, 'artifacts', 'm3-react')

export default mergeConfig(common, defineConfig({
  test: {
    name: 'm3-react',
    globals: true,
    environment: 'jsdom',
    attachmentsDir: join(__artifacts, 'vitest', 'attachments'),
  },
}))
