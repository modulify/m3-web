import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const packageDirectories = [
  'm3-foundation',
  'm3-react',
  'm3-vue',
]

const npmTag = process.env.NPM_TAG

if (!npmTag) {
  throw new Error('NPM_TAG must be set explicitly before publishing packages')
}

const run = (command, args, options = {}) => {
  const result = spawnSync(command, args, {
    cwd: root,
    encoding: 'utf8',
    ...options,
  })

  if (result.error) {
    throw result.error
  }

  return result
}

const isPublished = (name, version) => {
  const result = run('npm', [
    'view',
    `${name}@${version}`,
    'version',
    '--json',
  ])

  if (result.status === 0) {
    return true
  }

  const output = `${result.stdout}\n${result.stderr}`

  if (/\bE404\b|404 Not Found/.test(output)) {
    return false
  }

  throw new Error(`Unable to check ${name}@${version} in npm:\n${output.trim()}`)
}

for (const packageDirectory of packageDirectories) {
  const directory = resolve(root, packageDirectory)
  const manifest = JSON.parse(readFileSync(resolve(directory, 'package.json'), 'utf8'))

  if (isPublished(manifest.name, manifest.version)) {
    console.log(`${manifest.name}@${manifest.version} is already published; skipping.`)
    continue
  }

  console.log(`Publishing ${manifest.name}@${manifest.version} with npm tag ${npmTag}.`)

  const result = run('npm', [
    'publish',
    '--access',
    'public',
    '--tag',
    npmTag,
  ], {
    cwd: directory,
    stdio: 'inherit',
  })

  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}
