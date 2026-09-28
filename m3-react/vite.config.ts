import type { LibraryFormats } from 'vite'

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

const entries = {
  components: resolve(import.meta.dirname, 'src/components/index.ts'),
  hooks: resolve(import.meta.dirname, 'src/hooks/index.ts'),
  index: resolve(import.meta.dirname, 'src/index.ts'),
}

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
      throw new Error('m3-react declaration generation failed')
    }
  },
  aliasesExclude: [
    /^@modulify\/m3-foundation(?:\/.*)?$/,
    /^react(?:\/.*)?$/,
    /^react-dom(?:\/.*)?$/,
  ],
  entryRoot: 'src',
  include: [
    'shims-*.d.ts',
    'src/**/*.ts',
    'src/**/*.tsx',
  ],
  outDirs: 'dist',
  tsconfigPath: './tsconfig.dts.json',
})

export default defineConfig(() => mergeConfig(common, {
  plugins: [declarationPlugin],

  build: {
    lib: {
      name: '@modulify/m3-react',
      formats: ['es', 'cjs'],
      entry: entries,
      fileName: getFileName,
    },
    minify: false,
    rolldownOptions: {
      external: isExternal,
      output: {
        assetFileNames: 'm3-react[extname]',
        preserveModules: true,
        preserveModulesRoot: resolve(import.meta.dirname, 'src'),
      },
    },
  },
}))
