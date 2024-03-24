import { defineConfig } from 'vite'
import path from 'node:path'

import common from './vite.config.common'
import {
  dependencies,
  peerDependencies,
} from './package.json'

export default defineConfig({
  ...common,

  build: {
    lib: {
      name: '@modulify/m3-vue',
      formats: ['es', 'cjs'],
      entry: path.resolve(__dirname, './src/index.ts'),
      fileName: (format) => `m3-vue.${{
        es: 'esm',
        cjs: 'common',
      }[format]}.js`,
    },
    minify: false,
    rollupOptions: {
      external: [
        ...Object.keys(dependencies).filter(d => d !== '@modulify/m3-foundation'),
        ...Object.keys(peerDependencies),
      ],
      output: {
        assetFileNames: 'm3-vue[extname]',
      },
    },
  },
})