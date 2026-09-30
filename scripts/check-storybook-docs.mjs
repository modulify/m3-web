#!/usr/bin/env node

import { createReadStream } from 'node:fs'
import { readFile, stat } from 'node:fs/promises'
import { createServer } from 'node:http'
import { extname, resolve, sep } from 'node:path'

import { chromium } from 'playwright'

const DEFAULT_TARGETS = [
  'm3-react/dist-storybook',
  'm3-vue/dist-storybook',
]

const MIME_TYPES = {
  '.css': 'text/css',
  '.gif': 'image/gif',
  '.html': 'text/html',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.mjs': 'text/javascript',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
}

const STORYBOOK_ERROR_PATTERNS = [
  'The component failed to render properly',
  'Expected component `',
]

const STORYBOOK_LOCALES = [
  'en-US',
  'ru-RU',
]

const toErrorMessage = value => value instanceof Error ? value.message : String(value)

const normalizeBaseUrl = value => `${value.replace(/\/+$/, '')}/`

const resolveRequestPath = async (root, requestUrl) => {
  const pathname = decodeURIComponent(new URL(requestUrl, 'http://localhost').pathname)
  const candidate = resolve(root, `.${pathname}`)

  if (candidate !== root && !candidate.startsWith(`${root}${sep}`)) {
    return null
  }

  try {
    const metadata = await stat(candidate)

    return metadata.isDirectory() ? resolve(candidate, 'index.html') : candidate
  } catch {
    return null
  }
}

const createStaticServer = async directory => {
  const root = resolve(directory)

  await stat(resolve(root, 'index.json'))

  const server = createServer(async (request, response) => {
    const file = await resolveRequestPath(root, request.url ?? '/')

    if (file === null) {
      response.writeHead(404)
      response.end('Not found')
      return
    }

    response.setHeader('Content-Type', MIME_TYPES[extname(file)] ?? 'application/octet-stream')
    createReadStream(file)
      .on('error', () => {
        if (!response.headersSent) {
          response.writeHead(500)
        }

        response.end('Unable to read file')
      })
      .pipe(response)
  })

  await new Promise((resolveListening, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', resolveListening)
  })

  const address = server.address()

  if (address === null || typeof address === 'string') {
    server.close()
    throw new Error(`Unable to determine static server address for ${directory}`)
  }

  return {
    baseUrl: `http://127.0.0.1:${address.port}/`,
    close: () => new Promise((resolveClosed, reject) => {
      server.close(error => error === undefined ? resolveClosed() : reject(error))
    }),
  }
}

const loadTarget = async target => {
  if (/^https?:\/\//u.test(target)) {
    const baseUrl = normalizeBaseUrl(target)
    const response = await fetch(new URL('index.json', baseUrl))

    if (!response.ok) {
      throw new Error(`Unable to load ${response.url}: HTTP ${response.status}`)
    }

    return {
      baseUrl,
      index: await response.json(),
      close: async () => {},
    }
  }

  const server = await createStaticServer(target)

  return {
    ...server,
    index: JSON.parse(await readFile(resolve(target, 'index.json'), 'utf8')),
  }
}

const inspectDocsEntry = async (browser, baseUrl, entry, locale) => {
  const page = await browser.newPage()
  const runtimeErrors = []

  page.on('console', message => {
    if (
      message.type() === 'error'
      && !message.text().startsWith('Failed to load resource:')
    ) {
      runtimeErrors.push(`console.error: ${message.text()}`)
    }
  })
  page.on('pageerror', error => {
    runtimeErrors.push(`pageerror: ${error.message}`)
  })

  try {
    const url = new URL('iframe.html', baseUrl)
    url.searchParams.set('id', entry.id)
    url.searchParams.set('viewMode', 'docs')
    url.searchParams.set('globals', `locale:${locale}`)

    const response = await page.goto(url.href, {
      waitUntil: 'domcontentloaded',
      timeout: 30_000,
    })

    if (response === null || !response.ok()) {
      runtimeErrors.push(`navigation: HTTP ${response?.status() ?? 'unknown'}`)
    }

    await page.waitForFunction(
      () => (document.querySelector('#storybook-docs')?.textContent.trim().length ?? 0) > 0,
      undefined,
      { timeout: 15_000 }
    )

    const bodyText = await page.locator('body').innerText()
    const renderedText = (await page.locator('#storybook-docs').innerText()).trim()

    if (renderedText.length === 0) {
      runtimeErrors.push('render: #storybook-docs is empty')
    }

    for (const pattern of STORYBOOK_ERROR_PATTERNS) {
      if (bodyText.includes(pattern)) {
        runtimeErrors.push(`render: page contains ${JSON.stringify(pattern)}`)
      }
    }
  } catch (error) {
    runtimeErrors.push(`render: ${toErrorMessage(error)}`)
  } finally {
    await page.close()
  }

  return runtimeErrors
}

const targets = process.argv.slice(2)
const browser = await chromium.launch({ channel: 'chromium' })
const failures = []

try {
  for (const target of targets.length > 0 ? targets : DEFAULT_TARGETS) {
    const loadedTarget = await loadTarget(target)

    try {
      const docsEntries = Object.values(loadedTarget.index.entries ?? {})
        .filter(entry => entry.type === 'docs')

      if (docsEntries.length === 0) {
        failures.push(`${target}: no docs entries found in index.json`)
        continue
      }

      console.log(`Checking ${docsEntries.length} docs entries in ${target}`)

      for (const entry of docsEntries) {
        for (const locale of STORYBOOK_LOCALES) {
          const errors = await inspectDocsEntry(
            browser,
            loadedTarget.baseUrl,
            entry,
            locale
          )

          if (errors.length > 0) {
            failures.push(`${target}:${entry.id}:${locale}\n  ${errors.join('\n  ')}`)
          }
        }
      }
    } finally {
      await loadedTarget.close()
    }
  }
} finally {
  await browser.close()
}

if (failures.length > 0) {
  throw new Error(`Storybook docs smoke check failed:\n${failures.join('\n')}`)
}

console.log('All Storybook docs entries rendered without runtime errors.')
