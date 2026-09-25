import { resolve } from 'node:path'

import { defineConfig } from 'vite'
import dts from 'unplugin-dts/vite'

import { dependencies } from './package.json'

const entries = {
  'lib/Scheduler': resolve(__dirname, 'lib/Scheduler.ts'),
  'lib/calendar': resolve(__dirname, 'lib/calendar/index.ts'),
  'lib/motion': resolve(__dirname, 'lib/motion/index.ts'),
  'lib/motion/values': resolve(__dirname, 'lib/motion/values.ts'),
  'lib/platform': resolve(__dirname, 'lib/platform.ts'),
  'lib/popper': resolve(__dirname, 'lib/popper/index.ts'),
  'lib/popper/Listener': resolve(__dirname, 'lib/popper/Listener.ts'),
  'lib/popper/closer': resolve(__dirname, 'lib/popper/closer.ts'),
  'lib/popper/floating': resolve(__dirname, 'lib/popper/floating.ts'),
  'lib/popper/globalEvents': resolve(__dirname, 'lib/popper/globalEvents.ts'),
  'lib/popper/predicates': resolve(__dirname, 'lib/popper/predicates.ts'),
  'lib/popper/scheduling': resolve(__dirname, 'lib/popper/scheduling.ts'),
  'lib/predicates': resolve(__dirname, 'lib/predicates.ts'),
  'lib/scroll': resolve(__dirname, 'lib/scroll.ts'),
  'lib/surface/descriptor': resolve(__dirname, 'lib/surface/descriptor.ts'),
  'lib/surface/orchestration': resolve(__dirname, 'lib/surface/orchestration.ts'),
  'lib/surface/style': resolve(__dirname, 'lib/surface/style.ts'),
}

const externalPackages = Object.keys(dependencies)

const isExternal = (id: string): boolean => externalPackages.some(packageName => (
  id === packageName || id.startsWith(`${packageName}/`)
))

const usePublishedTypes = (content: string): string => content.replace(
  /(['"])(?:\.\.?\/)+types\//g,
  '$1@modulify/m3-foundation/types/'
)

export default defineConfig({
  plugins: [
    dts({
      beforeWriteFile: (_filePath, content) => ({
        content: usePublishedTypes(content),
      }),
      entryRoot: '.',
      include: [
        'lib/**/*.ts',
      ],
      outDirs: 'dist',
      tsconfigPath: './tsconfig.json',
    }),
  ],

  build: {
    lib: {
      entry: entries,
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => `${entryName}.${format === 'es' ? 'mjs' : 'cjs'}`,
    },
    minify: false,
    rollupOptions: {
      external: isExternal,
    },
  },
})
