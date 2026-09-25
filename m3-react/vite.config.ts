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
    find: /^\.\/hooks$/,
    replacement: `${name}/hooks`,
  },
]

const layers = {
  'package-root': {
    clean: true,
    declarations: false,
    entry: rootEntry,
    fileName: 'index',
    rootFacade: true,
  },
  'package-components': {
    clean: false,
    declarations: true,
    entry: resolve(__dirname, './src/components/index.ts'),
    fileName: 'components',
    rootFacade: false,
  },
  'package-hooks': {
    clean: false,
    declarations: false,
    entry: resolve(__dirname, './src/hooks/index.ts'),
    fileName: 'hooks',
    rootFacade: false,
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
              throw new Error('m3-react declaration generation failed')
            }
          },
          aliasesExclude: [
            /^react(?:\/.*)?$/,
            /^react-dom(?:\/.*)?$/,
          ],
          entryRoot: 'src',
          include: [
            'shims-*.d.ts',
            'src/**/*.ts',
            'src/**/*.tsx',
          ],
          outDirs: 'dist/types',
          tsconfigPath: './tsconfig.tsc.json',
        }),
      ] : []),
    ],

    resolve: {
      alias: layer.rootFacade ? rootLayerAliases : [],
    },

    build: {
      emptyOutDir: layer.clean,
      lib: {
        name: '@modulify/m3-react',
        formats: ['es', 'cjs'],
        entry: layer.entry,
        fileName: (format: LibraryFormats) => `${layer.fileName}.${format === 'es' ? 'mjs' : format}`,
      },
      minify: false,
      rollupOptions: {
        external: isExternal,
        output: {
          assetFileNames: 'm3-react[extname]',
        },
      },
    },
  })
})
