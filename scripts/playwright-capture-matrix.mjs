#!/usr/bin/env node

import crypto from 'node:crypto'
import path from 'node:path'
import { mkdir, writeFile } from 'node:fs/promises'
import { chromium } from 'playwright'

function usage() {
  console.log([
    'usage:',
    '  node scripts/playwright-capture-matrix.mjs --url https://... [--themes dark,light] [--viewports desktop:1440x1024,mobile:390x844]',
    '  node scripts/playwright-capture-matrix.mjs --base-url http://m3-vue.modulify.test/ --story-id patterns-local-theming--danger-action-scope',
    '',
    'options:',
    '  --url URL',
    '  --base-url URL        default: http://m3-vue.modulify.test/',
    '  --story-id ID',
    '  --globals KEY:VALUE;KEY:VALUE',
    '  --globals-sets SET1||SET2',
    '  --args KEY:VALUE;KEY:VALUE',
    '  --args-sets SET1||SET2',
    '  --themes dark,light',
    '  --viewports NAME:WIDTHxHEIGHT,NAME:WIDTHxHEIGHT',
    '  --out-dir DIR',
    '  --wait-ms MS',
    '  --wait-until STATE',
    '  --wait-selector CSS',
    '  --full-page BOOL',
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

function parseHttpUrl(value) {
  let parsed

  try {
    parsed = new URL(value)
  } catch {
    throw new Error(`Invalid URL: ${value}`)
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error(`Unsupported URL protocol: ${value}`)
  }

  return parsed
}

function toBool(value, fallback = true) {
  if (value == null) {
    return fallback
  }

  return !['0', 'false', 'no', 'off'].includes(String(value).toLowerCase())
}

function toNumber(value, fallback) {
  const parsed = Number(value)

  return Number.isFinite(parsed) ? parsed : fallback
}

function sanitizePart(value) {
  return value
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function defaultFileName(url, variant) {
  const parsed = new URL(url)
  const base = sanitizePart(`${parsed.hostname}${parsed.pathname || '/index'}-${variant}`.toLowerCase()) || 'capture'
  const hash = crypto.createHash('sha1').update(`${url}:${variant}`).digest('hex').slice(0, 8)
  return `${base}-${hash}.png`
}

function splitSetList(value) {
  if (!value) {
    return ['']
  }

  return String(value)
    .split('||')
    .map((entry) => entry.trim())
    .filter(Boolean)
}

function parseThemes(value) {
  if (!value) {
    return ['']
  }

  return String(value)
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)
}

function parseViewports(value) {
  if (!value) {
    return [{
      name: 'desktop',
      width: 1440,
      height: 1024,
    }]
  }

  return String(value)
    .split(',')
    .map((entry, index) => {
      const trimmed = entry.trim()
      const [namePart, sizePartRaw] = trimmed.includes(':')
        ? trimmed.split(':')
        : [`viewport-${index + 1}`, trimmed]
      const sizePart = sizePartRaw.trim()
      const match = sizePart.match(/^(\d+)x(\d+)$/i)

      if (!match) {
        throw new Error(`Invalid viewport entry: ${trimmed}`)
      }

      return {
        name: sanitizePart(namePart.trim()) || `viewport-${index + 1}`,
        width: Number(match[1]),
        height: Number(match[2]),
      }
    })
}

function mergeQueryGroup(baseGroup, extraGroup) {
  const parts = []

  if (baseGroup) {
    parts.push(...baseGroup.split(';').map((entry) => entry.trim()).filter(Boolean))
  }

  if (extraGroup) {
    parts.push(...extraGroup.split(';').map((entry) => entry.trim()).filter(Boolean))
  }

  return parts.join(';')
}

function buildStoryUrl(args, theme, globalsSet, argSet) {
  const baseUrl = parseHttpUrl(args['base-url'] ?? 'http://m3-vue.modulify.test/')
  const storyId = args['story-id']

  if (!storyId) {
    throw new Error('expected --story-id when --url is not provided')
  }

  const url = new URL(baseUrl.toString())
  url.searchParams.set('path', `/story/${storyId}`)

  const globals = mergeQueryGroup(args.globals ?? '', mergeQueryGroup(theme ? `theme:${theme}` : '', globalsSet))
  const storyArgs = mergeQueryGroup(args.args ?? '', argSet)

  if (globals) {
    url.searchParams.set('globals', globals)
  }

  if (storyArgs) {
    url.searchParams.set('args', storyArgs)
  }

  return url.toString()
}

function buildDirectUrl(args, theme, globalsSet) {
  const baseUrl = new URL(parseHttpUrl(args.url).toString())
  const currentGlobals = baseUrl.searchParams.get('globals') ?? ''
  const globals = mergeQueryGroup(currentGlobals, mergeQueryGroup(args.globals ?? '', mergeQueryGroup(theme ? `theme:${theme}` : '', globalsSet)))

  if (globals) {
    baseUrl.searchParams.set('globals', globals)
  }

  return baseUrl.toString()
}

async function captureOne({ url, outPath, viewport, waitMs, waitUntil, waitSelector, fullPage }) {
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: {
      width: viewport.width,
      height: viewport.height,
    },
  })
  const page = await context.newPage()

  try {
    await page.goto(url, {
      waitUntil,
      timeout: 45000,
    })

    if (waitSelector) {
      await page.waitForSelector(waitSelector, { timeout: 45000 })
    }

    if (waitMs > 0) {
      await page.waitForTimeout(waitMs)
    }

    await mkdir(path.dirname(outPath), { recursive: true })
    await page.screenshot({
      path: outPath,
      fullPage,
    })

    const metaPath = outPath.replace(/\.png$/i, '.meta.json')
    await writeFile(metaPath, `${JSON.stringify({
      captured_at: new Date().toISOString(),
      url_requested: url,
      url_final: page.url(),
      title: await page.title(),
      viewport,
      wait_ms: waitMs,
      wait_until: waitUntil,
      wait_selector: waitSelector || null,
      full_page: fullPage,
      image_path: outPath,
    }, null, 2)}\n`, 'utf8')

    return {
      image_path: outPath,
      meta_path: metaPath,
      final_url: page.url(),
      title: await page.title(),
    }
  } finally {
    await page.close().catch(() => {})
    await context.close().catch(() => {})
    await browser.close().catch(() => {})
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const helpRequested = args.help === 'true'

  if (helpRequested || (!args.url && !args['story-id'])) {
    usage()
    process.exit(helpRequested ? 0 : 2)
  }

  const themes = parseThemes(args.themes)
  const globalsSets = splitSetList(args['globals-sets'])
  const argsSets = splitSetList(args['args-sets'])
  const viewports = parseViewports(args.viewports)
  const outDir = args['out-dir'] ?? path.join('drafts', 'screenshots', 'capture-matrix')
  const waitMs = toNumber(args['wait-ms'] ?? '1200', 1200)
  const waitUntil = args['wait-until'] ?? 'networkidle'
  const waitSelector = args['wait-selector'] ?? ''
  const fullPage = toBool(args['full-page'], false)
  const results = []

  for (const theme of themes) {
    for (const globalsSet of globalsSets) {
      for (const argSet of argsSets) {
        for (const viewport of viewports) {
          const url = args.url
            ? buildDirectUrl(args, theme, globalsSet)
            : buildStoryUrl(args, theme, globalsSet, argSet)
          const variant = [
            theme || 'default-theme',
            globalsSet ? sanitizePart(globalsSet) : 'base-globals',
            argSet ? sanitizePart(argSet) : 'base-args',
            viewport.name,
          ].join('-')
          const outPath = path.join(outDir, defaultFileName(url, variant))
          const capture = await captureOne({
            url,
            outPath,
            viewport,
            waitMs,
            waitUntil,
            waitSelector,
            fullPage,
          })

          results.push({
            theme: theme || null,
            globals_set: globalsSet || null,
            args_set: argSet || null,
            viewport,
            url,
            ...capture,
          })
        }
      }
    }
  }

  const summaryPath = path.join(outDir, 'summary.json')
  await mkdir(outDir, { recursive: true })
  await writeFile(summaryPath, `${JSON.stringify({
    captured_at: new Date().toISOString(),
    results,
  }, null, 2)}\n`, 'utf8')

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
