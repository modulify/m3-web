#!/usr/bin/env node

import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import crypto from 'node:crypto'
import { chromium } from 'playwright'

function parseArgs(argv) {
  const args = {}
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i]
    if (!token.startsWith('--')) {
      continue
    }
    const key = token.slice(2)
    const next = argv[i + 1]
    if (!next || next.startsWith('--')) {
      args[key] = 'true'
      continue
    }
    args[key] = next
    i += 1
  }
  return args
}

function toBool(value, fallback = true) {
  if (value == null) {
    return fallback
  }
  return !['0', 'false', 'no', 'off'].includes(String(value).toLowerCase())
}

function sanitizePart(value) {
  return value.replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
}

function parseHttpUrl(value) {
  let parsed
  try {
    parsed = new URL(value)
  } catch (error) {
    throw new Error(`Invalid --url value: ${value}`)
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error(`Unsupported URL protocol in --url: ${value}`)
  }

  return parsed
}

function defaultFileName(parsed, rawUrl) {
  const base = sanitizePart(`${parsed.hostname}${parsed.pathname || '/index'}`.toLowerCase()) || 'page'
  const hash = crypto.createHash('sha1').update(rawUrl).digest('hex').slice(0, 8)
  return `${base}-${hash}.png`
}

function metaPathFor(imagePath) {
  const ext = path.extname(imagePath)
  const withoutExt = ext ? imagePath.slice(0, -ext.length) : imagePath
  return `${withoutExt}.meta.json`
}

async function main() {
  const args = parseArgs(process.argv.slice(2))

  const requestedUrl = args.url
  if (!requestedUrl) {
    console.error('usage: node scripts/playwright-capture.mjs --url https://... [--out path.png] [--out-dir dir]')
    process.exit(2)
  }
  const parsedUrl = parseHttpUrl(requestedUrl)
  const url = parsedUrl.toString()

  const width = Number(args.width ?? 1440)
  const height = Number(args.height ?? 1024)
  const waitMs = Number(args['wait-ms'] ?? 1200)
  const timeoutMs = Number(args.timeout ?? 45000)
  const waitUntil = args['wait-until'] ?? 'networkidle'
  const waitSelector = args['wait-selector'] ?? null
  const fullPage = toBool(args['full-page'], true)

  const outDir = args['out-dir'] ?? 'drafts/screenshots'
  const outPath = args.out ? args.out : path.join(outDir, defaultFileName(parsedUrl, url))

  await mkdir(path.dirname(outPath), { recursive: true })

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: { width, height },
  })
  const page = await context.newPage()

  try {
    await page.goto(url, { waitUntil, timeout: timeoutMs })
    if (waitSelector) {
      await page.waitForSelector(waitSelector, { timeout: timeoutMs })
    }
    if (waitMs > 0) {
      await page.waitForTimeout(waitMs)
    }

    await page.screenshot({
      path: outPath,
      fullPage,
    })

    const meta = {
      captured_at: new Date().toISOString(),
      url_requested: url,
      url_final: page.url(),
      title: await page.title(),
      viewport: { width, height },
      full_page: fullPage,
      wait_until: waitUntil,
      wait_ms: waitMs,
      wait_selector: waitSelector,
      image_path: outPath,
    }

    const metaPath = metaPathFor(outPath)
    await writeFile(metaPath, `${JSON.stringify(meta, null, 2)}\n`, 'utf8')

    console.log(outPath)
    console.log(metaPath)
  } finally {
    await page.close().catch(() => {})
    await context.close().catch(() => {})
    await browser.close().catch(() => {})
  }
}

main().catch((error) => {
  if (error instanceof Error) {
    console.error(error.message)
  } else {
    console.error(String(error))
  }
  process.exit(1)
})
