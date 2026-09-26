import path from 'node:path'

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svg from 'vite-plugin-svgr'

export default defineConfig({
  plugins: [
    react(),
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
      {
        find: 'react',
        replacement: path.resolve(__dirname, './node_modules/react'),
      },
      {
        find: 'react-dom',
        replacement: path.resolve(__dirname, './node_modules/react-dom'),
      },
    ],
  },
})
