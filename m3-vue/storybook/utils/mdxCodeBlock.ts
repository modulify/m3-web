import '../stylesheets/mdxCodeBlock.scss'

import React from 'react'

import type { ComponentPropsWithoutRef, ReactElement, ReactNode } from 'react'

import bash from 'highlight.js/lib/languages/bash'
import css from 'highlight.js/lib/languages/css'
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import json from 'highlight.js/lib/languages/json'
import typescript from 'highlight.js/lib/languages/typescript'
import xml from 'highlight.js/lib/languages/xml'

type MdxCodeBlockProps = ComponentPropsWithoutRef<'code'>
type MdxPreBlockProps = ComponentPropsWithoutRef<'pre'>
type CodeElementProps = ComponentPropsWithoutRef<'code'> & {
  'data-language'?: string
}

type HighlightPayload = {
  html: string
  language: string | null
}

type CodePayload = {
  badgeLanguage: string | null
  highlightLanguage: string | null
  source: string
}

type RenderCodeBlockProps = {
  badgeLanguage: string | null
  className?: string
  codeLanguage: string | null
  copied: boolean
  html: string
  onCopy: () => void
  restProps: Omit<MdxPreBlockProps, 'children' | 'className'>
}

type ResolvedLanguages = {
  badgeLanguage: string | null
  codeLanguage: string | null
}

const AUTO_DETECT_MAX_LENGTH = 5000
const CODE_BLOCK_CLASS = 'm3-docs-code-block'
const COPY_BUTTON_CLASS = 'm3-docs-code-copy'
const COPY_RESET_DELAY_MS = 1500
const COPY_STATE_ATTRIBUTE = 'data-copied'
const COPY_SUCCESS_TEXT = 'Copied'
const COPY_TEXT = 'Copy code'
const LANGUAGE_BADGE_CLASS = 'm3-docs-code-language'
const LANGUAGE_PREFIXES = ['language-', 'lang-']
const PANEL_CLASS = 'm3-panel m3-panel_elevated-1'
const NON_SPECIFIC_LANGUAGES = new Set(['plain', 'plaintext', 'text', 'txt'])

const HIGHLIGHT_LANGUAGE_ALIASES: Record<string, string> = {
  cjs: 'javascript',
  html: 'xml',
  js: 'javascript',
  jsx: 'javascript',
  markup: 'xml',
  sh: 'bash',
  shell: 'bash',
  ts: 'typescript',
  tsx: 'typescript',
  vue: 'xml',
}

const BADGE_LANGUAGE_ALIASES: Record<string, string> = {
  atom: 'html',
  html: 'html',
  js: 'javascript',
  jsx: 'jsx',
  json: 'json',
  markup: 'html',
  rss: 'html',
  sh: 'bash',
  shell: 'bash',
  svg: 'html',
  ts: 'typescript',
  tsx: 'tsx',
  vue: 'html',
  xhtml: 'html',
  xml: 'html',
}

const SUPPORTED_HIGHLIGHT_LANGUAGES = new Set([
  'atom',
  'bash',
  'css',
  'html',
  'javascript',
  'json',
  'rss',
  'svg',
  'typescript',
  'xhtml',
  'xml',
])

let languagesRegistered = false

const highlightRegistrations = [
  ['bash', bash],
  ['css', css],
  ['javascript', javascript],
  ['json', json],
  ['typescript', typescript],
  ['xml', xml],
] as const

function ensureLanguagesRegistered (): void {
  if (languagesRegistered) return

  highlightRegistrations.forEach(([name, definition]) => {
    hljs.registerLanguage(name, definition)
  })

  languagesRegistered = true
}

function escapeHtml (value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function normalizeLanguageFromClass (className?: string | null): string | null {
  if (!className) return null

  const tokens = className.split(/\s+/u)
  for (const token of tokens) {
    for (const prefix of LANGUAGE_PREFIXES) {
      if (token.startsWith(prefix)) {
        return token.slice(prefix.length)
      }
    }
  }

  return null
}

function normalizeLanguageToken (value?: string | null): string | null {
  const normalized = value?.trim().toLowerCase()
  return normalized || null
}

function isSpecificLanguage (language: string | null): language is string {
  return Boolean(language && !NON_SPECIFIC_LANGUAGES.has(language))
}

function resolveHighlightLanguage (value?: string | null): string | null {
  const normalized = normalizeLanguageToken(value)
  if (!isSpecificLanguage(normalized)) return null

  const aliasResolved = HIGHLIGHT_LANGUAGE_ALIASES[normalized] || normalized

  return SUPPORTED_HIGHLIGHT_LANGUAGES.has(aliasResolved) ? aliasResolved : null
}

function resolveBadgeLanguage (value?: string | null): string | null {
  const normalized = normalizeLanguageToken(value)
  if (!isSpecificLanguage(normalized)) return null

  return BADGE_LANGUAGE_ALIASES[normalized] || normalized
}

function inferBadgeLanguageFromSource (source: string): string | null {
  if (!source.trim()) return null

  const containsMarkup = /<[^>]+>/u.test(source)
  const containsJsxComponent = /<[A-Z][A-Za-z0-9_.:-]*/u.test(source)
  const containsJsxExpression = /\{[^}]+\}/u.test(source)

  if (containsJsxComponent && containsJsxExpression) return 'tsx'
  if (containsMarkup) return 'html'
  return null
}

function extractText (node: ReactNode): string {
  if (typeof node === 'string') return node
  if (typeof node === 'number' || typeof node === 'boolean') return String(node)
  if (Array.isArray(node)) return node.map(extractText).join('')

  if (React.isValidElement<{ children?: ReactNode }>(node)) {
    return extractText(node.props.children)
  }

  return ''
}

function findCodeElement (node: ReactNode): ReactElement<CodeElementProps> | null {
  if (React.isValidElement<CodeElementProps>(node) && node.type === 'code') {
    return node
  }

  if (Array.isArray(node)) {
    for (const child of node) {
      const codeElement = findCodeElement(child)
      if (codeElement) return codeElement
    }
  }

  if (React.isValidElement<{ children?: ReactNode }>(node)) {
    return findCodeElement(node.props.children)
  }

  return null
}

function trimTrailingNewline (source: string): string {
  return source.replace(/\r?\n$/u, '')
}

function highlightKnownLanguage (source: string, language: string): HighlightPayload {
  return {
    html: hljs.highlight(source, {
      ignoreIllegals: true,
      language,
    }).value,
    language,
  }
}

function highlightAutoLanguage (source: string): HighlightPayload {
  const autoResult = hljs.highlightAuto(source)

  return {
    html: autoResult.value,
    language: autoResult.language || null,
  }
}

function highlightSource (source: string, language: string | null): HighlightPayload {
  ensureLanguagesRegistered()

  if (source.trim() === '') {
    return { html: '', language }
  }

  try {
    if (language) return highlightKnownLanguage(source, language)
    if (source.length > AUTO_DETECT_MAX_LENGTH) return { html: escapeHtml(source), language: null }
    return highlightAutoLanguage(source)
  } catch {
    return { html: escapeHtml(source), language }
  }
}

async function copyTextToClipboard (value: string): Promise<boolean> {
  if (!value) return false

  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(value)
      return true
    } catch {
      // Fallback below for restricted clipboard contexts.
    }
  }

  if (!document.body || typeof document.execCommand !== 'function') return false

  const textarea = document.createElement('textarea')
  textarea.value = value
  textarea.setAttribute('readonly', 'true')
  textarea.style.left = '-9999px'
  textarea.style.opacity = '0'
  textarea.style.pointerEvents = 'none'
  textarea.style.position = 'fixed'
  document.body.appendChild(textarea)
  textarea.select()

  try {
    return document.execCommand('copy')
  } finally {
    textarea.remove()
  }
}

function joinClassNames (...parts: Array<string | null | undefined>): string {
  return parts.filter(Boolean).join(' ')
}

function pickRawLanguageToken (children: ReactNode, className?: string): string | null {
  const codeElement = findCodeElement(children)
  const codeProps = codeElement?.props

  return normalizeLanguageToken(
    codeProps?.['data-language'] ||
      normalizeLanguageFromClass(codeProps?.className) ||
      normalizeLanguageFromClass(className)
  )
}

function resolveCodePayload (children: ReactNode, className?: string): CodePayload {
  const codeElement = findCodeElement(children)
  const source = trimTrailingNewline(extractText(codeElement?.props?.children ?? children))
  const rawLanguage = pickRawLanguageToken(children, className)
  const inferredBadgeLanguage = inferBadgeLanguageFromSource(source)
  const badgeLanguage = inferredBadgeLanguage || resolveBadgeLanguage(rawLanguage)
  const highlightLanguage = resolveHighlightLanguage(badgeLanguage || rawLanguage)

  return {
    badgeLanguage,
    highlightLanguage,
    source,
  }
}

function resolveRenderedLanguages (payload: CodePayload, highlight: HighlightPayload): ResolvedLanguages {
  const codeLanguage = highlight.language || payload.highlightLanguage
  const badgeLanguage =
    payload.badgeLanguage ||
    resolveBadgeLanguage(codeLanguage) ||
    inferBadgeLanguageFromSource(payload.source)

  return {
    badgeLanguage,
    codeLanguage,
  }
}

function useCopyState (source: string): { copied: boolean; onCopy: () => void } {
  const [copied, setCopied] = React.useState(false)
  const resetTimerRef = React.useRef<number | null>(null)

  React.useEffect(() => () => {
    if (resetTimerRef.current) {
      window.clearTimeout(resetTimerRef.current)
    }
  }, [])

  const onCopy = React.useCallback(() => {
    void copyTextToClipboard(source).then((success) => {
      if (!success) return

      setCopied(true)
      if (resetTimerRef.current) window.clearTimeout(resetTimerRef.current)

      resetTimerRef.current = window.setTimeout(() => {
        setCopied(false)
        resetTimerRef.current = null
      }, COPY_RESET_DELAY_MS)
    })
  }, [source])

  return { copied, onCopy }
}

function getCodeClassName (codeLanguage: string | null): string {
  return codeLanguage ? `hljs language-${codeLanguage}` : 'hljs'
}

function renderLanguageBadge (badgeLanguage: string | null): React.ReactElement {
  return React.createElement(
    'span',
    {
      className: LANGUAGE_BADGE_CLASS,
    },
    badgeLanguage || 'text'
  )
}

function renderCopyButton (copied: boolean, onCopy: () => void): React.ReactElement {
  return React.createElement(
    'button',
    {
      type: 'button',
      className: COPY_BUTTON_CLASS,
      'aria-label': 'Copy code block',
      [COPY_STATE_ATTRIBUTE]: copied ? 'true' : 'false',
      onClick: onCopy,
    },
    copied ? COPY_SUCCESS_TEXT : COPY_TEXT
  )
}

function renderCodeContent (codeHtml: string, codeLanguage: string | null): React.ReactElement {
  return React.createElement('code', {
    className: getCodeClassName(codeLanguage),
    'data-language': codeLanguage || undefined,
    dangerouslySetInnerHTML: {
      __html: codeHtml,
    },
  })
}

function renderCodeBlock ({
  badgeLanguage,
  className,
  codeLanguage,
  copied,
  html,
  onCopy,
  restProps,
}: RenderCodeBlockProps): React.ReactElement {
  return React.createElement(
    'pre',
    {
      ...restProps,
      className: joinClassNames(PANEL_CLASS, CODE_BLOCK_CLASS, className),
      'data-language': codeLanguage || undefined,
    },
    renderLanguageBadge(badgeLanguage),
    renderCopyButton(copied, onCopy),
    renderCodeContent(html, codeLanguage)
  )
}

export function MdxCodeBlock (props: MdxCodeBlockProps): React.ReactElement {
  const { children, ...restProps } = props
  return React.createElement('code', restProps, children)
}

export function MdxCodePreBlock (props: MdxPreBlockProps): React.ReactElement {
  const { children, className, ...restProps } = props
  const payload = React.useMemo(
    () => resolveCodePayload(children, className),
    [children, className]
  )
  const highlight = React.useMemo(
    () => highlightSource(payload.source, payload.highlightLanguage),
    [payload.highlightLanguage, payload.source]
  )
  const { copied, onCopy } = useCopyState(payload.source)
  const languages = React.useMemo(
    () => resolveRenderedLanguages(payload, highlight),
    [payload, highlight]
  )

  if (payload.source.trim() === '') {
    return React.createElement('pre', { className, ...restProps }, children)
  }

  return renderCodeBlock({
    badgeLanguage: languages.badgeLanguage,
    className,
    codeLanguage: languages.codeLanguage,
    copied,
    html: highlight.html || escapeHtml(payload.source),
    onCopy,
    restProps,
  })
}
