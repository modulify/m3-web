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

const rootEntry = resolve(__dirname, './src/index.ts')
const rootLayerAliases = [
  {
    find: /^\.\/components$/,
    replacement: `${name}/components`,
  },
  {
    find: /^\.\/composables$/,
    replacement: `${name}/composables`,
  },
]

const layers = {
  'package-root': {
    clean: true,
    declarations: false,
    entry: rootEntry,
    fileName: 'index',
  },
  'package-components': {
    clean: false,
    declarations: true,
    entry: resolve(__dirname, './src/components/index.ts'),
    fileName: 'components',
  },
  'package-composables': {
    clean: false,
    declarations: false,
    entry: resolve(__dirname, './src/composables/index.ts'),
    fileName: 'composables',
  },
}

const isExternal = (id: string): boolean => (
  externalPackages.some(packageName => (
    id === packageName || id.startsWith(`${packageName}/`)
  ))
)

export default defineConfig(({ mode }) => {
  const layer = layers[mode as keyof typeof layers] ?? layers['package-root']

  return mergeConfig(common, {
    plugins: [
      ...(layer.declarations ? [
        dts({
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
          outDirs: 'dist/types',
          tsconfigPath: './tsconfig.dts.json',
        }),
      ] : []),
    ],

    resolve: {
      alias: mode === 'package-root' ? rootLayerAliases : [],
    },

    build: {
      emptyOutDir: layer.clean,
      lib: {
        name: '@modulify/m3-vue',
        formats: ['es', 'cjs'],
        entry: layer.entry,
        fileName: (format: LibraryFormats) => `${layer.fileName}.${format === 'es' ? 'mjs' : format}`,
      },
      minify: false,
      rollupOptions: {
        external: isExternal,
        output: {
          assetFileNames: 'm3-vue[extname]',
        },
      },
    },
  })
})
