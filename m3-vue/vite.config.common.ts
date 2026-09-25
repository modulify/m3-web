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
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})