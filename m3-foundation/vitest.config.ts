import {
  defineProject,
} from 'vitest/config'

import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __parent = fileURLToPath(new URL('../', import.meta.url))
const __artifacts = join(__parent, 'artifacts', 'm3-foundation')

export default defineProject({
  test: {
    name: 'm3-foundation',
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    attachmentsDir: join(__artifacts, 'vitest', 'attachments'),
  },
})
