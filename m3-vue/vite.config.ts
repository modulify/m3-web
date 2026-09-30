import type { LibraryFormats } from 'vite'

import { extname } from 'node:path'
import { globSync } from 'node:fs'
import { resolve } from 'node:path'

import { defineConfig } from 'vite'
import dts from 'unplugin-dts/vite'
import { mergeConfig } from 'vite'

import common from './vite.config.common'
import { dependencies, name, peerDependencies } from './package.json'

const externalPackages = [
  name,
  ...Object.keys(dependencies),
  ...Object.keys(peerDependencies),
]

const sourceRoot = resolve(import.meta.dirname, 'src')

const layerEntryNames: Record<string, string> = {
  'components/index.ts': 'components',
  'composables/index.ts': 'composables',
  'index.ts': 'index',
}

const entries = Object.fromEntries([
  ...globSync('**/*.ts', { cwd: sourceRoot }),
  ...globSync('**/*.vue', { cwd: sourceRoot }),
]
  .sort()
  .map(file => [
    layerEntryNames[file] ?? file.slice(0, -extname(file).length),
    resolve(sourceRoot, file),
  ]))

const isExternal = (id: string): boolean => (
  externalPackages.some(packageName => (
    id === packageName || id.startsWith(`${packageName}/`)
  ))
)

const getFileName = (format: LibraryFormats, entryName: string): string => {
  const extension = format === 'es' ? 'mjs' : format
  const normalizedEntryName = entryName.replaceAll('?', '.')

  return `${normalizedEntryName}.${extension}`
}

const declarationPlugin = dts({
  afterDiagnostic: (diagnostics) => {
    if (diagnostics.length > 0) {
      throw new Error('m3-vue declaration generation failed')
    }
  },
  cleanVueFileName: true,
  aliasesExclude: [
    /^@modulify\/m3-foundation(?:\/.*)?$/,
  ],
  entryRoot: 'src',
  include: [
    'shims-*.d.ts',
    'src/**/*.ts',
    'src/**/*.vue',
  ],
  outDirs: 'dist',
  tsconfigPath: './tsconfig.dts.json',
})

export default defineConfig(() => mergeConfig(common, {
  plugins: [declarationPlugin],

  build: {
    lib: {
      name: '@modulify/m3-vue',
      entry: entries,
      fileName: getFileName,
    },
    minify: false,
    rolldownOptions: {
      external: isExternal,
      preserveEntrySignatures: 'allow-extension',
      output: [
        {
          assetFileNames: 'm3-vue[extname]',
          chunkFileNames: '[name].mjs',
          format: 'es',
        },
        {
          assetFileNames: 'm3-vue[extname]',
          chunkFileNames: '[name].cjs',
          format: 'cjs',
        },
      ],
    },
  },
}))
