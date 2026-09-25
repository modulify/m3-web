import { spawnSync } from 'node:child_process'
import {
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import {
  join,
  resolve,
} from 'node:path'

const root = resolve(import.meta.dirname, '..')
const packageDirectories = [
  'm3-foundation',
  'm3-react',
  'm3-vue',
]

const readManifest = directory => JSON.parse(
  readFileSync(resolve(root, directory, 'package.json'), 'utf8'),
)

const manifests = Object.fromEntries(packageDirectories.map(directory => [
  directory,
  readManifest(directory),
]))

const foundationPackageName = manifests['m3-foundation'].name

const collectExportTargets = (exports) => Object.values(exports).flatMap(value => (
  typeof value === 'string' ? [value] : Object.values(value)
))

const assertPublishedExportsExist = (directory, manifest, packedPaths) => {
  const missingTargets = collectExportTargets(manifest.exports)
    .filter(target => !target.includes('*'))
    .map(target => target.replace(/^\.\//, ''))
    .filter(target => !packedPaths.includes(target))

  if (missingTargets.length > 0) {
    throw new Error(`${directory} exports missing package files: ${missingTargets.join(', ')}`)
  }
}

const assertDeclarationsArePublishable = (directory, packedPaths) => {
  const declarationPaths = packedPaths.filter(path => path.endsWith('.d.ts'))
  const privateReference = /(?:from|import\()\s*['"](?:@\/|~types\/)|\/(?:home|tmp)\//

  for (const declarationPath of declarationPaths) {
    const content = readFileSync(resolve(root, directory, declarationPath), 'utf8')

    if (privateReference.test(content)) {
      throw new Error(`${directory}/${declarationPath} contains a private declaration reference`)
    }
  }
}

const assertNoPrivateRuntimeChunks = (directory, manifest, packedPaths) => {
  const publicRuntimePaths = new Set(collectExportTargets(manifest.exports)
    .filter(target => /\.(?:cjs|js|mjs)$/.test(target))
    .map(target => target.replace(/^\.\//, '')))
  const privateRuntimePaths = packedPaths.filter(path => (
    path.startsWith('dist/')
    && /\.(?:cjs|js|mjs)$/.test(path)
    && !publicRuntimePaths.has(path)
  ))

  if (privateRuntimePaths.length > 0) {
    throw new Error(`${directory} contains private runtime chunks: ${privateRuntimePaths.join(', ')}`)
  }
}

const assertRootDelegatesToLayers = (directory, manifest) => {
  const layerSpecifiers = Object.entries(manifest.exports)
    .filter(([exportPath, target]) => (
      exportPath !== '.'
      && typeof target === 'object'
      && ('import' in target || 'require' in target)
    ))
    .map(([exportPath]) => `${manifest.name}/${exportPath.slice(2)}`)
  const rootRuntimePaths = new Set([
    manifest.exports['.'].import,
    manifest.exports['.'].require,
  ])

  for (const runtimePath of rootRuntimePaths) {
    const content = readFileSync(
      resolve(root, directory, runtimePath.replace(/^\.\//, '')),
      'utf8',
    )

    const missingSpecifiers = layerSpecifiers.filter(specifier => !content.includes(specifier))

    if (missingSpecifiers.length > 0) {
      throw new Error(`${directory}/${runtimePath} must delegate to ${missingSpecifiers.join(', ')}`)
    }
  }
}

const assertFoundationIsExternal = (directory, packedPaths) => {
  const runtimePaths = packedPaths.filter(path => (
    path.startsWith('dist/') && /\.(?:cjs|js|mjs)$/.test(path)
  ))
  let hasExternalReference = false

  for (const runtimePath of runtimePaths) {
    const content = readFileSync(resolve(root, directory, runtimePath), 'utf8')

    hasExternalReference ||= content.includes(foundationPackageName)

    if (content.includes('../m3-foundation/')) {
      throw new Error(`${directory}/${runtimePath} contains bundled ${foundationPackageName} sources`)
    }
  }

  if (!hasExternalReference) {
    throw new Error(`${directory} does not reference ${foundationPackageName} as an external dependency`)
  }
}

const run = (command, args, cwd = root) => {
  const result = spawnSync(command, args, {
    cwd,
    encoding: 'utf8',
    stdio: 'pipe',
  })

  if (result.error) {
    throw result.error
  }

  if (result.status !== 0) {
    const output = `${result.stdout}\n${result.stderr}`.trim()
    throw new Error(`${command} ${args.join(' ')} failed:\n${output}`)
  }

  return result.stdout
}

const temporaryDirectory = mkdtempSync(join(tmpdir(), 'm3-web-packages-'))

try {
  const tarballs = Object.fromEntries(packageDirectories.map(directory => {
    const manifest = manifests[directory]
    const packOutput = run('npm', [
      'pack',
      '--json',
      '--pack-destination',
      temporaryDirectory,
    ], resolve(root, directory))
    const [{
      filename,
      files,
    }] = JSON.parse(packOutput)
    const tarball = resolve(temporaryDirectory, filename)
    const packedPaths = files.map(file => file.path)

    assertPublishedExportsExist(directory, manifest, packedPaths)
    assertDeclarationsArePublishable(directory, packedPaths)

    if (directory === 'm3-foundation') {
      if (!packedPaths.some(path => path.startsWith('types/'))) {
        throw new Error('m3-foundation must publish its source types/ contract')
      }

      const forbiddenRootEntries = [
        'index.d.ts',
        'dist/index.d.ts',
        'dist/index.mjs',
        'dist/index.cjs',
      ]

      if (packedPaths.some(path => forbiddenRootEntries.includes(path))) {
        throw new Error('m3-foundation must not publish a package root entrypoint')
      }

      if (packedPaths.some(path => path.startsWith('dist/types/'))) {
        throw new Error('m3-foundation must not duplicate its source types/ contract under dist/')
      }
    } else if (packedPaths.some(path => /(?:^|\/)shims-[^/]+\.d\.ts$/.test(path))) {
      throw new Error(`${directory} must not publish build-only declaration shims`)
    } else {
      assertNoPrivateRuntimeChunks(directory, manifest, packedPaths)
      assertRootDelegatesToLayers(directory, manifest)
      assertFoundationIsExternal(directory, packedPaths)
    }

    return [manifest.name, tarball]
  }))

  const reactManifest = manifests['m3-react']
  const vueManifest = manifests['m3-vue']
  const rootManifest = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'))

  const consumerManifest = {
    private: true,
    type: 'module',
    dependencies: {
      ...Object.fromEntries(Object.entries(tarballs).map(([name, tarball]) => [
        name,
        `file:${tarball}`,
      ])),
      ...reactManifest.peerDependencies,
      ...vueManifest.peerDependencies,
    },
    devDependencies: {
      '@types/react': reactManifest.devDependencies['@types/react'],
      '@types/react-dom': reactManifest.devDependencies['@types/react-dom'],
      '@types/react-transition-group': reactManifest.devDependencies['@types/react-transition-group'],
      typescript: rootManifest.devDependencies.typescript,
    },
  }

  writeFileSync(
    resolve(temporaryDirectory, 'package.json'),
    `${JSON.stringify(consumerManifest, null, 2)}\n`,
  )
  writeFileSync(resolve(temporaryDirectory, 'tsconfig.json'), `${JSON.stringify({
    compilerOptions: {
      lib: ['DOM', 'ES2022'],
      module: 'ESNext',
      moduleResolution: 'Bundler',
      noEmit: true,
      skipLibCheck: false,
      strict: true,
      target: 'ES2022',
    },
    include: ['consumer.ts'],
  }, null, 2)}\n`)
  writeFileSync(resolve(temporaryDirectory, 'consumer.ts'), `
import { createRef } from 'react'
import { ref } from 'vue'

import { CalendarDay } from '@modulify/m3-foundation/lib/calendar'
import type { ElementReference, Interactable } from '@modulify/m3-foundation/types/dom'
import {
  durations,
  easing,
  timing,
  type M3MotionDuration,
  type M3MotionEasing,
} from '@modulify/m3-foundation/lib/motion'
import { M3Button as RootM3Button } from '@modulify/m3-react'
import { useAnimationFrame as useRootReactAnimationFrame } from '@modulify/m3-react'
import { useBreakpoint as useRootReactBreakpoint } from '@modulify/m3-react'
import { useClickable as useRootReactClickable } from '@modulify/m3-react'
import { useElementReference as useRootReactElementReference } from '@modulify/m3-react'
import { useFocusable as useRootReactFocusable } from '@modulify/m3-react'
import { useInteractable as useRootReactInteractable } from '@modulify/m3-react'
import { useMutationObserver as useRootReactMutationObserver } from '@modulify/m3-react'
import { useResizeObserver as useRootReactResizeObserver } from '@modulify/m3-react'
import { useTimeout as useRootReactTimeout } from '@modulify/m3-react'
import {
  M3Button,
  type M3ButtonExposed,
  type M3ButtonMethods,
  type M3ButtonProps,
  type M3DialogExposed,
  type M3LinkExposed,
  type M3NavigationExposed,
  type M3SideSheetExposed,
} from '@modulify/m3-react/components'
import {
  useAnimationFrame as useReactAnimationFrame,
  useBreakpoint as useReactBreakpoint,
  useClickable as useReactClickable,
  useElementReference as useReactElementReference,
  useFocusable as useReactFocusable,
  useId as useReactId,
  useInteractable as useReactInteractable,
  useMutationObserver as useReactMutationObserver,
  useResizeObserver as useReactResizeObserver,
  useTimeout as useReactTimeout,
} from '@modulify/m3-react/hooks'
import { M3Select as RootM3Select } from '@modulify/m3-vue'
import { useAnimationFrame as useRootVueAnimationFrame } from '@modulify/m3-vue'
import { useBreakpoint as useRootVueBreakpoint } from '@modulify/m3-vue'
import { useMutationObserver as useRootVueMutationObserver } from '@modulify/m3-vue'
import { useResizeObserver as useRootVueResizeObserver } from '@modulify/m3-vue'
import { useTimeout as useRootVueTimeout } from '@modulify/m3-vue'
import { M3Select, type M3SelectOption } from '@modulify/m3-vue/components'
import {
  useAnimationFrame as useVueAnimationFrame,
  useBreakpoint as useVueBreakpoint,
  useId as useVueId,
  useMutationObserver as useVueMutationObserver,
  useResizeObserver as useVueResizeObserver,
  useTimeout as useVueTimeout,
} from '@modulify/m3-vue/composables'

const buttonRef = createRef<M3ButtonExposed>()
const dialogRef = createRef<M3DialogExposed>()
const navigationRef = createRef<M3NavigationExposed>()
const sideSheetRef = createRef<M3SideSheetExposed>()
const buttonProps: M3ButtonProps = { appearance: 'filled', ref: buttonRef }
const duration: M3MotionDuration = 'medium2'
const easingName: M3MotionEasing = 'standard'
const options: M3SelectOption<number>[] = [{ value: 1, label: 'One' }]
const reactObserverTarget = createRef<HTMLDivElement>()
const reactMutationObserverTargets: Parameters<typeof useReactMutationObserver>[0] = [reactObserverTarget]
const reactResizeObserverTargets: Parameters<typeof useReactResizeObserver>[0] = [reactObserverTarget]
const interactable: Interactable = {} as M3ButtonMethods
const elementReference: ElementReference<HTMLButtonElement> = {} as M3ButtonExposed
const linkElement: M3LinkExposed['el'] = null
const vueObserverTarget = ref<HTMLDivElement | null>(null)
const vueMutationObserverTargets: Parameters<typeof useVueMutationObserver>[0] = [vueObserverTarget]
const vueResizeObserverTargets: Parameters<typeof useVueResizeObserver>[0] = [vueObserverTarget]

void [
  CalendarDay,
  M3Button,
  M3Select,
  RootM3Button,
  RootM3Select,
  buttonRef,
  buttonProps,
  dialogRef,
  duration,
  durations,
  easing,
  easingName,
  elementReference,
  interactable,
  linkElement,
  navigationRef,
  options,
  reactMutationObserverTargets,
  reactResizeObserverTargets,
  sideSheetRef,
  useReactAnimationFrame,
  useReactBreakpoint,
  useReactClickable,
  useReactElementReference,
  useReactFocusable,
  useReactId,
  useReactInteractable,
  useReactMutationObserver,
  useReactResizeObserver,
  useReactTimeout,
  useRootReactAnimationFrame,
  useRootReactBreakpoint,
  useRootReactClickable,
  useRootReactElementReference,
  useRootReactFocusable,
  useRootReactInteractable,
  useRootReactMutationObserver,
  useRootReactResizeObserver,
  useRootReactTimeout,
  useRootVueAnimationFrame,
  useRootVueBreakpoint,
  useRootVueMutationObserver,
  useRootVueResizeObserver,
  useRootVueTimeout,
  useVueAnimationFrame,
  useVueBreakpoint,
  useVueId,
  useVueMutationObserver,
  useVueResizeObserver,
  useVueTimeout,
  timing,
  vueMutationObserverTargets,
  vueResizeObserverTargets,
]
`)
  writeFileSync(resolve(temporaryDirectory, 'consumer.mjs'), `
import { access } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

import { CalendarDay } from '@modulify/m3-foundation/lib/calendar'
import { durations, easing, timing } from '@modulify/m3-foundation/lib/motion'
import { M3Button as RootM3Button } from '@modulify/m3-react'
import { useAnimationFrame as useRootReactAnimationFrame } from '@modulify/m3-react'
import { useBreakpoint as useRootReactBreakpoint } from '@modulify/m3-react'
import { useClickable as useRootReactClickable } from '@modulify/m3-react'
import { useElementReference as useRootReactElementReference } from '@modulify/m3-react'
import { useFocusable as useRootReactFocusable } from '@modulify/m3-react'
import { useInteractable as useRootReactInteractable } from '@modulify/m3-react'
import { useMutationObserver as useRootReactMutationObserver } from '@modulify/m3-react'
import { useResizeObserver as useRootReactResizeObserver } from '@modulify/m3-react'
import { useTimeout as useRootReactTimeout } from '@modulify/m3-react'
import { M3Button } from '@modulify/m3-react/components'
import {
  useAnimationFrame as useReactAnimationFrame,
  useBreakpoint as useReactBreakpoint,
  useClickable as useReactClickable,
  useElementReference as useReactElementReference,
  useFocusable as useReactFocusable,
  useId as useReactId,
  useInteractable as useReactInteractable,
  useMutationObserver as useReactMutationObserver,
  useResizeObserver as useReactResizeObserver,
  useTimeout as useReactTimeout,
} from '@modulify/m3-react/hooks'
import { M3Select as RootM3Select } from '@modulify/m3-vue'
import { useAnimationFrame as useRootVueAnimationFrame } from '@modulify/m3-vue'
import { useBreakpoint as useRootVueBreakpoint } from '@modulify/m3-vue'
import { useMutationObserver as useRootVueMutationObserver } from '@modulify/m3-vue'
import { useResizeObserver as useRootVueResizeObserver } from '@modulify/m3-vue'
import { useTimeout as useRootVueTimeout } from '@modulify/m3-vue'
import { M3Select } from '@modulify/m3-vue/components'
import {
  useAnimationFrame as useVueAnimationFrame,
  useBreakpoint as useVueBreakpoint,
  useId as useVueId,
  useMutationObserver as useVueMutationObserver,
  useResizeObserver as useVueResizeObserver,
  useTimeout as useVueTimeout,
} from '@modulify/m3-vue/composables'

await access(fileURLToPath(import.meta.resolve('@modulify/m3-foundation/styles.css')))

let foundationRootResolutionError

try {
  import.meta.resolve('@modulify/m3-foundation')
} catch (error) {
  foundationRootResolutionError = error
}

if (foundationRootResolutionError?.code !== 'ERR_PACKAGE_PATH_NOT_EXPORTED') {
  throw new Error('Expected @modulify/m3-foundation package root to be unavailable')
}

if (
  !CalendarDay
  || !durations
  || !easing
  || !M3Button
  || !M3Select
  || !RootM3Button
  || !RootM3Select
  || !useReactAnimationFrame
  || !useReactBreakpoint
  || !useReactClickable
  || !useReactElementReference
  || !useReactFocusable
  || !useReactId
  || !useReactInteractable
  || !useReactMutationObserver
  || !useReactResizeObserver
  || !useReactTimeout
  || !useRootReactAnimationFrame
  || !useRootReactBreakpoint
  || !useRootReactClickable
  || !useRootReactElementReference
  || !useRootReactFocusable
  || !useRootReactInteractable
  || !useRootReactMutationObserver
  || !useRootReactResizeObserver
  || !useRootReactTimeout
  || !useRootVueAnimationFrame
  || !useRootVueBreakpoint
  || !useRootVueMutationObserver
  || !useRootVueResizeObserver
  || !useRootVueTimeout
  || !useVueAnimationFrame
  || !useVueBreakpoint
  || !useVueId
  || !useVueMutationObserver
  || !useVueResizeObserver
  || !useVueTimeout
  || !timing
) {
  throw new Error('Expected ESM package exports are unavailable')
}
`)
  writeFileSync(resolve(temporaryDirectory, 'consumer.cjs'), `
const { CalendarDay } = require('@modulify/m3-foundation/lib/calendar')
const { durations, easing, timing } = require('@modulify/m3-foundation/lib/motion')
const { M3Button: RootM3Button } = require('@modulify/m3-react')
const { useAnimationFrame: useRootReactAnimationFrame } = require('@modulify/m3-react')
const { useBreakpoint: useRootReactBreakpoint } = require('@modulify/m3-react')
const { useClickable: useRootReactClickable } = require('@modulify/m3-react')
const { useElementReference: useRootReactElementReference } = require('@modulify/m3-react')
const { useFocusable: useRootReactFocusable } = require('@modulify/m3-react')
const { useInteractable: useRootReactInteractable } = require('@modulify/m3-react')
const { useMutationObserver: useRootReactMutationObserver } = require('@modulify/m3-react')
const { useResizeObserver: useRootReactResizeObserver } = require('@modulify/m3-react')
const { useTimeout: useRootReactTimeout } = require('@modulify/m3-react')
const { M3Button } = require('@modulify/m3-react/components')
const {
  useAnimationFrame: useReactAnimationFrame,
  useBreakpoint: useReactBreakpoint,
  useClickable: useReactClickable,
  useElementReference: useReactElementReference,
  useFocusable: useReactFocusable,
  useId: useReactId,
  useInteractable: useReactInteractable,
  useMutationObserver: useReactMutationObserver,
  useResizeObserver: useReactResizeObserver,
  useTimeout: useReactTimeout,
} = require('@modulify/m3-react/hooks')
const { M3Select: RootM3Select } = require('@modulify/m3-vue')
const { useAnimationFrame: useRootVueAnimationFrame } = require('@modulify/m3-vue')
const { useBreakpoint: useRootVueBreakpoint } = require('@modulify/m3-vue')
const { useMutationObserver: useRootVueMutationObserver } = require('@modulify/m3-vue')
const { useResizeObserver: useRootVueResizeObserver } = require('@modulify/m3-vue')
const { useTimeout: useRootVueTimeout } = require('@modulify/m3-vue')
const { M3Select } = require('@modulify/m3-vue/components')
const {
  useAnimationFrame: useVueAnimationFrame,
  useBreakpoint: useVueBreakpoint,
  useId: useVueId,
  useMutationObserver: useVueMutationObserver,
  useResizeObserver: useVueResizeObserver,
  useTimeout: useVueTimeout,
} = require('@modulify/m3-vue/composables')

if (
  !CalendarDay
  || !durations
  || !easing
  || !M3Button
  || !M3Select
  || !RootM3Button
  || !RootM3Select
  || !useReactAnimationFrame
  || !useReactBreakpoint
  || !useReactClickable
  || !useReactElementReference
  || !useReactFocusable
  || !useReactId
  || !useReactInteractable
  || !useReactMutationObserver
  || !useReactResizeObserver
  || !useReactTimeout
  || !useRootReactAnimationFrame
  || !useRootReactBreakpoint
  || !useRootReactClickable
  || !useRootReactElementReference
  || !useRootReactFocusable
  || !useRootReactInteractable
  || !useRootReactMutationObserver
  || !useRootReactResizeObserver
  || !useRootReactTimeout
  || !useRootVueAnimationFrame
  || !useRootVueBreakpoint
  || !useRootVueMutationObserver
  || !useRootVueResizeObserver
  || !useRootVueTimeout
  || !useVueAnimationFrame
  || !useVueBreakpoint
  || !useVueId
  || !useVueMutationObserver
  || !useVueResizeObserver
  || !useVueTimeout
  || !timing
) {
  throw new Error('Expected CommonJS package exports are unavailable')
}
`)

  run('npm', [
    'install',
    '--ignore-scripts',
    '--no-audit',
    '--no-fund',
    '--package-lock=false',
  ], temporaryDirectory)
  run(process.execPath, [
    resolve(temporaryDirectory, 'node_modules/typescript/bin/tsc'),
    '--project',
    'tsconfig.json',
  ], temporaryDirectory)
  run('node', ['consumer.mjs'], temporaryDirectory)
  run('node', ['consumer.cjs'], temporaryDirectory)

  console.log('Packed package external dependencies, ESM, CommonJS, CSS, and TypeScript contracts are valid.')
} finally {
  rmSync(temporaryDirectory, {
    force: true,
    recursive: true,
  })
}
