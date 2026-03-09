#!/usr/bin/env node

import crypto from 'node:crypto'
import path from 'node:path'
import { mkdir, writeFile } from 'node:fs/promises'
import { chromium } from 'playwright'

function usage() {
  console.log([
    'usage:',
    '  node scripts/playwright-research.mjs --action style-dump --url https://... [options]',
    '',
    'actions:',
    '  dom-snapshot',
    '  style-dump',
    '  layout-metrics',
    '  a11y-snapshot',
    '  console-capture',
    '  trace',
    '  network-log',
    '  perf-marks',
    '  token-diff',
    '  motion-sample',
    '',
    'common options:',
    '  --url URL',
    '  --out FILE',
    '  --out-dir DIR',
    '  --width PX             default: 1440',
    '  --height PX            default: 1024',
    '  --wait-ms MS           default: 1200',
    '  --wait-until STATE     default: networkidle',
    '  --wait-selector CSS',
    '  --timeout MS           default: 45000',
    '',
    'selector options:',
    '  --selector CSS',
    '  --selectors CSS1||CSS2||CSS3',
    '  --compare-selector CSS',
    '',
    'action-specific options:',
    '  --props display,color,gap',
    '  --var-prefix --m3-sys-   may be repeated',
    '  --var-prefixes --m3-sys-,--m3-state-layers-',
    '  --action-selector CSS',
    '  --interaction click|hover|focus',
    '  --count N               motion-sample only; default: 6',
    '  --interval-ms MS        motion-sample only; default: 120',
  ].join('\n'))
}

function parseArgs(argv) {
  const args = {}
  const optionsWithValues = new Set([
    'action',
    'url',
    'out',
    'out-dir',
    'width',
    'height',
    'wait-ms',
    'wait-until',
    'wait-selector',
    'timeout',
    'selector',
    'selectors',
    'compare-selector',
    'props',
    'var-prefix',
    'var-prefixes',
    'action-selector',
    'interaction',
    'count',
    'interval-ms',
    'post-action-wait-ms',
    'full-page',
  ])

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index]

    if (!token.startsWith('--')) {
      continue
    }

    const inlineSeparatorIndex = token.indexOf('=')
    const hasInlineValue = inlineSeparatorIndex !== -1
    const key = hasInlineValue ? token.slice(2, inlineSeparatorIndex) : token.slice(2)
    const next = argv[index + 1]
    const expectsValue = optionsWithValues.has(key)
    const value = hasInlineValue
      ? token.slice(inlineSeparatorIndex + 1)
      : (!expectsValue || next == null ? 'true' : next)

    if (Object.hasOwn(args, key)) {
      const current = Array.isArray(args[key]) ? args[key] : [args[key]]
      current.push(value)
      args[key] = current
    } else {
      args[key] = value
    }

    if (!hasInlineValue && value !== 'true') {
      index += 1
    }
  }

  return args
}

function getArg(args, key, fallback = undefined) {
  const value = args[key]

  if (Array.isArray(value)) {
    return value[value.length - 1] ?? fallback
  }

  return value ?? fallback
}

function getArgs(args, key) {
  const value = args[key]

  if (value == null) {
    return []
  }

  return Array.isArray(value) ? value : [value]
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

function parseHttpUrl(value) {
  let parsed

  try {
    parsed = new URL(value)
  } catch {
    throw new Error(`Invalid --url value: ${value}`)
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error(`Unsupported URL protocol in --url: ${value}`)
  }

  return parsed
}

function defaultStem(action, parsedUrl, rawUrl) {
  const base = sanitizePart(`${parsedUrl.hostname}${parsedUrl.pathname || '/index'}`.toLowerCase()) || 'page'
  const hash = crypto.createHash('sha1').update(`${action}:${rawUrl}`).digest('hex').slice(0, 8)
  return `${base}-${action}-${hash}`
}

function defaultOutputPath({ action, parsedUrl, rawUrl, out, outDir, extension }) {
  if (out) {
    return out
  }

  const baseDir = outDir ?? path.join('drafts', 'research', action)

  return path.join(baseDir, `${defaultStem(action, parsedUrl, rawUrl)}.${extension}`)
}

function splitDelimitedValues(value, delimiter = '||') {
  if (!value) {
    return []
  }

  return String(value)
    .split(delimiter)
    .map((entry) => entry.trim())
    .filter(Boolean)
}

function resolveSelectors(args) {
  const directSelectors = getArgs(args, 'selector')
  const groupedSelectors = splitDelimitedValues(getArg(args, 'selectors', ''))

  const selectors = [...directSelectors, ...groupedSelectors].filter(Boolean)

  return selectors.length > 0 ? selectors : ['body']
}

function resolveVarPrefixes(args) {
  const directPrefixes = getArgs(args, 'var-prefix')
  const groupedPrefixes = String(getArg(args, 'var-prefixes', '--m3-sys-'))
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)

  const prefixes = [...directPrefixes, ...groupedPrefixes]

  return prefixes.length > 0 ? prefixes : ['--m3-sys-']
}

function resolveCssProps(args) {
  return String(getArg(
    args,
    'props',
    'display,position,width,height,min-width,min-height,max-width,max-height,margin,padding,gap,font-size,line-height,color,background-color,border-radius,z-index',
  ))
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)
}

async function createPage(args) {
  const width = toNumber(getArg(args, 'width', '1440'), 1440)
  const height = toNumber(getArg(args, 'height', '1024'), 1024)
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: { width, height },
  })
  const page = await context.newPage()

  return {
    browser,
    context,
    page,
    viewport: { width, height },
  }
}

async function navigate(page, args) {
  const url = getArg(args, 'url')
  const timeout = toNumber(getArg(args, 'timeout', '45000'), 45000)
  const waitUntil = getArg(args, 'wait-until', 'networkidle')
  const waitSelector = getArg(args, 'wait-selector', '')
  const waitMs = toNumber(getArg(args, 'wait-ms', '1200'), 1200)

  await page.goto(url, { waitUntil, timeout })

  if (waitSelector) {
    await page.waitForSelector(waitSelector, { timeout })
  }

  if (waitMs > 0) {
    await page.waitForTimeout(waitMs)
  }

  return {
    finalUrl: page.url(),
    title: await page.title(),
    waitUntil,
    waitSelector: waitSelector || null,
    waitMs,
    timeout,
  }
}

async function writeJson(outPath, payload) {
  await mkdir(path.dirname(outPath), { recursive: true })
  await writeFile(outPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8')
}

async function collectElementSnapshot(page, selector, fn, errorLabel = 'selector') {
  return page.evaluate(({ selector: targetSelector, label, evaluateFnSource }) => {
    const element = document.querySelector(targetSelector)

    if (!element) {
      throw new Error(`${label} not found: ${targetSelector}`)
    }

    const evaluateFn = new Function('element', `return (${evaluateFnSource})(element)`)

    return evaluateFn(element)
  }, { selector, label: errorLabel, evaluateFnSource: fn.toString() })
}

async function runDomSnapshot(page, args, meta) {
  const selector = getArg(args, 'selector', 'body')
  const outPath = defaultOutputPath({
    action: 'dom-snapshot',
    parsedUrl: meta.parsedUrl,
    rawUrl: meta.url,
    out: getArg(args, 'out'),
    outDir: getArg(args, 'out-dir'),
    extension: 'json',
  })

  const snapshot = await collectElementSnapshot(page, selector, (element) => {
    const htmlElement = element

    return {
      tag_name: htmlElement.tagName.toLowerCase(),
      id: htmlElement.id || null,
      class_name: htmlElement.className || '',
      text_content: htmlElement.textContent ?? '',
      outer_html: htmlElement.outerHTML,
    }
  })

  await writeJson(outPath, {
    action: 'dom-snapshot',
    captured_at: new Date().toISOString(),
    url_requested: meta.url,
    url_final: meta.navigation.finalUrl,
    title: meta.navigation.title,
    selector,
    snapshot,
  })

  console.log(outPath)
}

async function runStyleDump(page, args, meta) {
  const selector = getArg(args, 'selector', 'body')
  const cssProps = resolveCssProps(args)
  const varPrefixes = resolveVarPrefixes(args)
  const outPath = defaultOutputPath({
    action: 'style-dump',
    parsedUrl: meta.parsedUrl,
    rawUrl: meta.url,
    out: getArg(args, 'out'),
    outDir: getArg(args, 'out-dir'),
    extension: 'json',
  })

  const styles = await page.evaluate(({ targetSelector, cssProps: props, prefixes }) => {
    const element = document.querySelector(targetSelector)

    if (!element) {
      throw new Error(`selector not found: ${targetSelector}`)
    }

    const style = getComputedStyle(element)
    const cssProps = Object.fromEntries(props.map((prop) => [prop, style.getPropertyValue(prop).trim()]))
    const variables = {}

    for (const property of style) {
      if (prefixes.some((prefix) => property.startsWith(prefix))) {
        variables[property] = style.getPropertyValue(property).trim()
      }
    }

    return {
      tag_name: element.tagName.toLowerCase(),
      class_name: element.className || '',
      css_props: cssProps,
      variables,
    }
  }, { targetSelector: selector, cssProps, prefixes: varPrefixes })

  await writeJson(outPath, {
    action: 'style-dump',
    captured_at: new Date().toISOString(),
    url_requested: meta.url,
    url_final: meta.navigation.finalUrl,
    title: meta.navigation.title,
    selector,
    css_props: cssProps,
    var_prefixes: varPrefixes,
    styles,
  })

  console.log(outPath)
}

async function runLayoutMetrics(page, args, meta) {
  const selectors = resolveSelectors(args)
  const outPath = defaultOutputPath({
    action: 'layout-metrics',
    parsedUrl: meta.parsedUrl,
    rawUrl: meta.url,
    out: getArg(args, 'out'),
    outDir: getArg(args, 'out-dir'),
    extension: 'json',
  })

  const metrics = await page.evaluate((requestedSelectors) => {
    const describeElement = (element) => {
      const rect = element.getBoundingClientRect()
      const style = getComputedStyle(element)
      const offsetParent = element.offsetParent

      return {
        tag_name: element.tagName.toLowerCase(),
        class_name: element.className || '',
        rect: {
          x: rect.x,
          y: rect.y,
          top: rect.top,
          left: rect.left,
          right: rect.right,
          bottom: rect.bottom,
          width: rect.width,
          height: rect.height,
        },
        client: {
          width: element.clientWidth,
          height: element.clientHeight,
        },
        offset: {
          width: element.offsetWidth,
          height: element.offsetHeight,
          top: element.offsetTop,
          left: element.offsetLeft,
        },
        scroll: {
          width: element.scrollWidth,
          height: element.scrollHeight,
          top: element.scrollTop,
          left: element.scrollLeft,
        },
        computed: {
          display: style.display,
          position: style.position,
          box_sizing: style.boxSizing,
          margin: style.margin,
          padding: style.padding,
          gap: style.gap,
          z_index: style.zIndex,
        },
        offset_parent: offsetParent
          ? {
            tag_name: offsetParent.tagName.toLowerCase(),
            class_name: offsetParent.className || '',
          }
          : null,
      }
    }

    return {
      viewport: {
        inner_width: window.innerWidth,
        inner_height: window.innerHeight,
        scroll_x: window.scrollX,
        scroll_y: window.scrollY,
      },
      selectors: requestedSelectors.map((selector) => {
        const element = document.querySelector(selector)

        return {
          selector,
          found: Boolean(element),
          metrics: element ? describeElement(element) : null,
        }
      }),
    }
  }, selectors)

  await writeJson(outPath, {
    action: 'layout-metrics',
    captured_at: new Date().toISOString(),
    url_requested: meta.url,
    url_final: meta.navigation.finalUrl,
    title: meta.navigation.title,
    selectors,
    metrics,
  })

  console.log(outPath)
}

async function runA11ySnapshot(page, args, meta) {
  const selector = getArg(args, 'selector')
  const timeout = toNumber(getArg(args, 'timeout', '45000'), 45000)
  const outPath = defaultOutputPath({
    action: 'a11y-snapshot',
    parsedUrl: meta.parsedUrl,
    rawUrl: meta.url,
    out: getArg(args, 'out'),
    outDir: getArg(args, 'out-dir'),
    extension: 'json',
  })

  const targetSelector = selector ?? 'body'
  const locator = page.locator(targetSelector)
  const elementCount = await locator.count()

  if (elementCount === 0) {
    throw new Error(`selector not found: ${targetSelector}`)
  }

  const snapshotYaml = await locator.first().ariaSnapshot({ timeout })
  const snapshot = snapshotYaml
    .split('\n')
    .map((line) => line.replace(/\r$/, ''))
    .filter((line) => line.length > 0)

  await writeJson(outPath, {
    action: 'a11y-snapshot',
    captured_at: new Date().toISOString(),
    url_requested: meta.url,
    url_final: meta.navigation.finalUrl,
    title: meta.navigation.title,
    selector: targetSelector,
    matched_count: elementCount,
    snapshot_yaml: snapshotYaml,
    snapshot,
  })

  console.log(outPath)
}

async function runConsoleCapture(page, args, meta) {
  const outPath = defaultOutputPath({
    action: 'console-capture',
    parsedUrl: meta.parsedUrl,
    rawUrl: meta.url,
    out: getArg(args, 'out'),
    outDir: getArg(args, 'out-dir'),
    extension: 'json',
  })

  const consoleEntries = []
  const pageErrors = []
  const requestFailures = []

  page.on('console', (message) => {
    consoleEntries.push({
      type: message.type(),
      text: message.text(),
      location: message.location(),
    })
  })

  page.on('pageerror', (error) => {
    pageErrors.push({
      message: error.message,
      stack: error.stack ?? null,
    })
  })

  page.on('requestfailed', (request) => {
    requestFailures.push({
      url: request.url(),
      method: request.method(),
      resource_type: request.resourceType(),
      failure_text: request.failure()?.errorText ?? null,
    })
  })

  const navigation = await navigate(page, args)

  await writeJson(outPath, {
    action: 'console-capture',
    captured_at: new Date().toISOString(),
    url_requested: meta.url,
    url_final: navigation.finalUrl,
    title: navigation.title,
    console: consoleEntries,
    page_errors: pageErrors,
    request_failures: requestFailures,
  })

  console.log(outPath)
}

async function runTrace(page, context, args, meta) {
  const outPath = defaultOutputPath({
    action: 'trace',
    parsedUrl: meta.parsedUrl,
    rawUrl: meta.url,
    out: getArg(args, 'out'),
    outDir: getArg(args, 'out-dir'),
    extension: 'zip',
  })
  const actionSelector = getArg(args, 'action-selector', '')
  const interaction = getArg(args, 'interaction', 'click')

  await mkdir(path.dirname(outPath), { recursive: true })
  await context.tracing.start({
    screenshots: true,
    snapshots: true,
    sources: true,
  })

  const navigation = await navigate(page, args)

  if (actionSelector) {
    const locator = page.locator(actionSelector)

    if (interaction === 'hover') {
      await locator.hover()
    } else if (interaction === 'focus') {
      await locator.focus()
    } else {
      await locator.click()
    }

    await page.waitForTimeout(toNumber(getArg(args, 'post-action-wait-ms', '400'), 400))
  }

  await context.tracing.stop({ path: outPath })

  const metaPath = outPath.replace(/\.zip$/i, '.meta.json')

  await writeJson(metaPath, {
    action: 'trace',
    captured_at: new Date().toISOString(),
    url_requested: meta.url,
    url_final: navigation.finalUrl,
    title: navigation.title,
    interaction: actionSelector
      ? {
        selector: actionSelector,
        type: interaction,
      }
      : null,
    trace_path: outPath,
  })

  console.log(outPath)
  console.log(metaPath)
}

async function runNetworkLog(page, args, meta) {
  const outPath = defaultOutputPath({
    action: 'network-log',
    parsedUrl: meta.parsedUrl,
    rawUrl: meta.url,
    out: getArg(args, 'out'),
    outDir: getArg(args, 'out-dir'),
    extension: 'json',
  })

  const entries = []
  const requestIndex = new Map()
  let nextId = 1

  page.on('request', (request) => {
    const entry = {
      id: nextId,
      url: request.url(),
      method: request.method(),
      resource_type: request.resourceType(),
      started_at: new Date().toISOString(),
      status: null,
      ok: null,
      failed: false,
      failure_text: null,
    }

    nextId += 1
    entries.push(entry)
    requestIndex.set(request, entry)
  })

  page.on('response', (response) => {
    const entry = requestIndex.get(response.request())

    if (!entry) {
      return
    }

    entry.status = response.status()
    entry.ok = response.ok()
    entry.ended_at = new Date().toISOString()
  })

  page.on('requestfailed', (request) => {
    const entry = requestIndex.get(request)

    if (!entry) {
      return
    }

    entry.failed = true
    entry.failure_text = request.failure()?.errorText ?? null
    entry.ended_at = new Date().toISOString()
  })

  const navigation = await navigate(page, args)

  await writeJson(outPath, {
    action: 'network-log',
    captured_at: new Date().toISOString(),
    url_requested: meta.url,
    url_final: navigation.finalUrl,
    title: navigation.title,
    entries,
  })

  console.log(outPath)
}

async function runPerfMarks(page, args, meta) {
  const outPath = defaultOutputPath({
    action: 'perf-marks',
    parsedUrl: meta.parsedUrl,
    rawUrl: meta.url,
    out: getArg(args, 'out'),
    outDir: getArg(args, 'out-dir'),
    extension: 'json',
  })

  const navigation = await navigate(page, args)
  const perf = await page.evaluate(() => {
    const serializeEntry = (entry) => ({
      name: entry.name,
      entry_type: entry.entryType,
      start_time: entry.startTime,
      duration: entry.duration,
      initiator_type: 'initiatorType' in entry ? entry.initiatorType : undefined,
      transfer_size: 'transferSize' in entry ? entry.transferSize : undefined,
      encoded_body_size: 'encodedBodySize' in entry ? entry.encodedBodySize : undefined,
      decoded_body_size: 'decodedBodySize' in entry ? entry.decodedBodySize : undefined,
      render_blocking_status: 'renderBlockingStatus' in entry ? entry.renderBlockingStatus : undefined,
      response_end: 'responseEnd' in entry ? entry.responseEnd : undefined,
      dom_complete: 'domComplete' in entry ? entry.domComplete : undefined,
      dom_content_loaded: 'domContentLoadedEventEnd' in entry ? entry.domContentLoadedEventEnd : undefined,
      load_event_end: 'loadEventEnd' in entry ? entry.loadEventEnd : undefined,
    })

    return {
      time_origin: performance.timeOrigin,
      now: performance.now(),
      navigation: performance.getEntriesByType('navigation').map(serializeEntry),
      paints: performance.getEntriesByType('paint').map(serializeEntry),
      marks: performance.getEntriesByType('mark').map(serializeEntry),
      measures: performance.getEntriesByType('measure').map(serializeEntry),
      resources: performance.getEntriesByType('resource').slice(0, 200).map(serializeEntry),
      memory: 'memory' in performance
        ? {
          js_heap_size_limit: performance.memory.jsHeapSizeLimit,
          total_js_heap_size: performance.memory.totalJSHeapSize,
          used_js_heap_size: performance.memory.usedJSHeapSize,
        }
        : null,
    }
  })

  await writeJson(outPath, {
    action: 'perf-marks',
    captured_at: new Date().toISOString(),
    url_requested: meta.url,
    url_final: navigation.finalUrl,
    title: navigation.title,
    perf,
  })

  console.log(outPath)
}

async function runTokenDiff(page, args, meta) {
  const selector = getArg(args, 'selector')
  const compareSelector = getArg(args, 'compare-selector')

  if (!selector || !compareSelector) {
    throw new Error('token-diff requires --selector and --compare-selector')
  }

  const outPath = defaultOutputPath({
    action: 'token-diff',
    parsedUrl: meta.parsedUrl,
    rawUrl: meta.url,
    out: getArg(args, 'out'),
    outDir: getArg(args, 'out-dir'),
    extension: 'json',
  })
  const prefixes = resolveVarPrefixes(args)

  const diff = await page.evaluate(({ leftSelector, rightSelector, varPrefixes }) => {
    const collectVariables = (element) => {
      const style = getComputedStyle(element)
      const variables = {}

      for (const property of style) {
        if (varPrefixes.some((prefix) => property.startsWith(prefix))) {
          variables[property] = style.getPropertyValue(property).trim()
        }
      }

      return variables
    }

    const left = document.querySelector(leftSelector)
    const right = document.querySelector(rightSelector)

    if (!left) {
      throw new Error(`selector not found: ${leftSelector}`)
    }

    if (!right) {
      throw new Error(`compare selector not found: ${rightSelector}`)
    }

    const leftVariables = collectVariables(left)
    const rightVariables = collectVariables(right)
    const names = [...new Set([...Object.keys(leftVariables), ...Object.keys(rightVariables)])].sort()
    const changed = {}

    for (const name of names) {
      if ((leftVariables[name] ?? null) !== (rightVariables[name] ?? null)) {
        changed[name] = {
          left: leftVariables[name] ?? null,
          right: rightVariables[name] ?? null,
        }
      }
    }

    return {
      left_selector: leftSelector,
      right_selector: rightSelector,
      prefixes: varPrefixes,
      changed,
      left_variables: leftVariables,
      right_variables: rightVariables,
    }
  }, { leftSelector: selector, rightSelector: compareSelector, varPrefixes: prefixes })

  await writeJson(outPath, {
    action: 'token-diff',
    captured_at: new Date().toISOString(),
    url_requested: meta.url,
    url_final: meta.navigation.finalUrl,
    title: meta.navigation.title,
    diff,
  })

  console.log(outPath)
}

async function runMotionSample(page, args, meta) {
  const interactionSelector = getArg(args, 'action-selector', '')
  const interaction = getArg(args, 'interaction', interactionSelector ? 'click' : '')
  const count = toNumber(getArg(args, 'count', '6'), 6)
  const intervalMs = toNumber(getArg(args, 'interval-ms', '120'), 120)
  const fullPage = toBool(getArg(args, 'full-page', 'false'), false)
  const outDir = getArg(args, 'out-dir')
    ?? path.join('drafts', 'research', 'motion-sample', defaultStem('motion-sample', meta.parsedUrl, meta.url))

  await mkdir(outDir, { recursive: true })

  const navigation = await navigate(page, args)

  if (interactionSelector) {
    const locator = page.locator(interactionSelector)

    if (interaction === 'hover') {
      await locator.hover()
    } else if (interaction === 'focus') {
      await locator.focus()
    } else {
      await locator.click()
    }
  }

  const frames = []

  for (let index = 0; index < count; index += 1) {
    const filePath = path.join(outDir, `frame-${String(index + 1).padStart(2, '0')}.png`)
    await page.screenshot({
      path: filePath,
      fullPage,
    })

    frames.push({
      index: index + 1,
      elapsed_ms: index * intervalMs,
      image_path: filePath,
    })

    if (index < count - 1 && intervalMs > 0) {
      await page.waitForTimeout(intervalMs)
    }
  }

  const metaPath = path.join(outDir, 'meta.json')

  await writeJson(metaPath, {
    action: 'motion-sample',
    captured_at: new Date().toISOString(),
    url_requested: meta.url,
    url_final: navigation.finalUrl,
    title: navigation.title,
    interaction: interactionSelector
      ? {
        selector: interactionSelector,
        type: interaction || null,
      }
      : null,
    count,
    interval_ms: intervalMs,
    frames,
  })

  console.log(outDir)
  console.log(metaPath)
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const helpRequested = toBool(getArg(args, 'help', 'false'), false)

  if (helpRequested || !getArg(args, 'action')) {
    usage()
    process.exit(helpRequested ? 0 : 2)
  }

  const action = getArg(args, 'action')
  const requestedUrl = getArg(args, 'url')

  if (!requestedUrl) {
    throw new Error('expected --url')
  }

  const parsedUrl = parseHttpUrl(requestedUrl)
  const url = parsedUrl.toString()
  const runtime = await createPage(args)
  const meta = {
    action,
    url,
    parsedUrl,
    viewport: runtime.viewport,
    navigation: null,
  }

  try {
    if (action === 'console-capture') {
      await runConsoleCapture(runtime.page, args, meta)
      return
    }

    if (action === 'network-log') {
      await runNetworkLog(runtime.page, args, meta)
      return
    }

    if (action === 'trace') {
      await runTrace(runtime.page, runtime.context, args, meta)
      return
    }

    if (action === 'perf-marks') {
      await runPerfMarks(runtime.page, args, meta)
      return
    }

    if (action === 'motion-sample') {
      await runMotionSample(runtime.page, args, meta)
      return
    }

    meta.navigation = await navigate(runtime.page, args)

    if (action === 'dom-snapshot') {
      await runDomSnapshot(runtime.page, args, meta)
      return
    }

    if (action === 'style-dump') {
      await runStyleDump(runtime.page, args, meta)
      return
    }

    if (action === 'layout-metrics') {
      await runLayoutMetrics(runtime.page, args, meta)
      return
    }

    if (action === 'a11y-snapshot') {
      await runA11ySnapshot(runtime.page, args, meta)
      return
    }

    if (action === 'token-diff') {
      await runTokenDiff(runtime.page, args, meta)
      return
    }

    throw new Error(`Unsupported --action value: ${action}`)
  } finally {
    await runtime.page.close().catch(() => {})
    await runtime.context.close().catch(() => {})
    await runtime.browser.close().catch(() => {})
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
