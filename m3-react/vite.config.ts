import { defineConfig } from 'vite'
import { resolve } from 'node:path'

import common from './vite.config.common'
import {
  dependencies,
  peerDependencies,
} from './package.json'

export default defineConfig({
  ...common,

  build: {
    lib: {
      name: '@modulify/m3-react',
      formats: ['es', 'cjs'],
      entry: resolve(__dirname, './src/index.ts'),
      fileName: (format) => `m3-react.${{
        es: 'mjs',
        cjs: 'cjs',
      }[format]}`,
    },
    minify: false,
    rollupOptions: {
      external: [
        ...Object.keys(dependencies).filter(d => d !== '@modulify/m3-foundation'),
        ...Object.keys(peerDependencies),
      ],
      output: {
        assetFileNames: 'm3-react[extname]',
      },
    },
  },
})