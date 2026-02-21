import { defineConfig } from 'vite'
import path from 'node:path'
import react from '@vitejs/plugin-react'
import svg from 'vite-plugin-svgr'

export default defineConfig({
  plugins: [
    react(),
    svg(),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      react: path.resolve(__dirname, './node_modules/react'),
      'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
    },
  },
})
