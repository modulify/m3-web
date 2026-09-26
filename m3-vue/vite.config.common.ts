import path from 'node:path'

import { defineConfig } from 'vite'
import svg from 'vite-svg-loader'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue(),
    svg(),
  ],

  resolve: {
    alias: [
      {
        find: /^@modulify\/m3-foundation\/lib\/(.+)$/,
        replacement: path.resolve(__dirname, '../m3-foundation/lib/$1'),
      },
      {
        find: '@',
        replacement: path.resolve(__dirname, './src'),
      },
    ],
  },
})
