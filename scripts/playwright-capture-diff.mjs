#!/usr/bin/env node

import path from 'node:path'
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { PNG } from 'pngjs'
import pixelmatch from 'pixelmatch'

function usage() {
  console.log([
    'usage:',
    '  node scripts/playwright-capture-diff.mjs --left path.png --right path.png [--out diff.png] [--summary summary.json]',
    '  node scripts/playwright-capture-diff.mjs --left dir-a --right dir-b [--out-dir diffs]',
    '',
    'options:',
    '  --left PATH',
    '  --right PATH',
    '  --out FILE          diff PNG path for single-image mode',
    '  --summary FILE      JSON summary path for single-image mode',
    '  --out-dir DIR       output directory for directory mode',
    '  --threshold N       pixelmatch threshold (default: 0.1)',
  ].join('\n'))
}

function parseArgs(argv) {
  const args = {}

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index]

    if (!token.startsWith('--')) {
      continue
    }

    const key = token.slice(2)
    const next = argv[index + 1]
    const value = !next || next.startsWith('--') ? 'true' : next
    args[key] = value

    if (value !== 'true') {
      index += 1
    }
  }

  return args
}

async function statKind(targetPath) {
  try {
    const { stat } = await import('node:fs/promises')
    const metadata = await stat(targetPath)

    if (metadata.isDirectory()) {
      return 'dir'
    }

    if (metadata.isFile()) {
      return 'file'
    }

    return 'other'
  } catch {
    return null
  }
}

async function readPng(filePath) {
  const content = await readFile(filePath)

  return PNG.sync.read(content)
}

async function writePng(filePath, png) {
  await mkdir(path.dirname(filePath), { recursive: true })
  await writeFile(filePath, PNG.sync.write(png))
}

async function diffPair(leftPath, rightPath, outPath, threshold) {
  const left = await readPng(leftPath)
  const right = await readPng(rightPath)

  if (left.width !== right.width || left.height !== right.height) {
    return {
      left_path: leftPath,
      right_path: rightPath,
      out_path: outPath ?? null,
      size_mismatch: {
        left: { width: left.width, height: left.height },
        right: { width: right.width, height: right.height },
      },
      different_pixels: null,
      total_pixels: null,
      mismatch_ratio: null,
    }
  }

  const diff = new PNG({ width: left.width, height: left.height })
  const differentPixels = pixelmatch(left.data, right.data, diff.data, left.width, left.height, { threshold })
  const totalPixels = left.width * left.height

  if (outPath) {
    await writePng(outPath, diff)
  }

  return {
    left_path: leftPath,
    right_path: rightPath,
    out_path: outPath ?? null,
    size_mismatch: null,
    different_pixels: differentPixels,
    total_pixels: totalPixels,
    mismatch_ratio: totalPixels === 0 ? 0 : differentPixels / totalPixels,
  }
}

async function listPngFiles(dirPath) {
  const files = await readdir(dirPath)

  return files.filter((fileName) => fileName.toLowerCase().endsWith('.png')).sort()
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const helpRequested = args.help === 'true'

  if (helpRequested || !args.left || !args.right) {
    usage()
    process.exit(helpRequested ? 0 : 2)
  }

  const leftPath = args.left
  const rightPath = args.right
  const leftKind = await statKind(leftPath)
  const rightKind = await statKind(rightPath)
  const threshold = Number(args.threshold ?? 0.1)

  if (!leftKind || !rightKind) {
    throw new Error('expected existing --left and --right paths')
  }

  if (leftKind !== rightKind) {
    throw new Error('--left and --right must both be files or both be directories')
  }

  if (leftKind === 'file') {
    const outPath = args.out
    const summaryPath = args.summary
      ?? (outPath ? outPath.replace(/\.png$/i, '.json') : path.join('drafts', 'research', 'capture-diff', 'summary.json'))
    const result = await diffPair(leftPath, rightPath, outPath, threshold)

    await mkdir(path.dirname(summaryPath), { recursive: true })
    await writeFile(summaryPath, `${JSON.stringify(result, null, 2)}\n`, 'utf8')

    if (outPath) {
      console.log(outPath)
    }
    console.log(summaryPath)
    return
  }

  const outDir = args['out-dir'] ?? path.join('drafts', 'research', 'capture-diff')
  const leftFiles = await listPngFiles(leftPath)
  const rightFiles = await listPngFiles(rightPath)
  const leftSet = new Set(leftFiles)
  const rightSet = new Set(rightFiles)
  const common = leftFiles.filter((fileName) => rightSet.has(fileName))
  const leftOnly = leftFiles.filter((fileName) => !rightSet.has(fileName))
  const rightOnly = rightFiles.filter((fileName) => !leftSet.has(fileName))
  const results = []

  for (const fileName of common) {
    const result = await diffPair(
      path.join(leftPath, fileName),
      path.join(rightPath, fileName),
      path.join(outDir, fileName),
      threshold,
    )

    results.push({
      file_name: fileName,
      ...result,
    })
  }

  const summary = {
    compared_at: new Date().toISOString(),
    left_dir: leftPath,
    right_dir: rightPath,
    compared_files: results.length,
    left_only: leftOnly,
    right_only: rightOnly,
    results,
  }
  const summaryPath = path.join(outDir, 'summary.json')

  await mkdir(outDir, { recursive: true })
  await writeFile(summaryPath, `${JSON.stringify(summary, null, 2)}\n`, 'utf8')

  console.log(outDir)
  console.log(summaryPath)
}

main().catch((error) => {
  if (error instanceof Error) {
    console.error(error.message)
  } else {
    console.error(String(error))
  }

  process.exit(1)
})
