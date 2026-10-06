import type { ComponentSetupContext } from '@/utils/component'
import type { HTMLAttributes, Ref } from 'react'
import type {
  SnackbarActionRenderer,
  SnackbarHostMethods,
  SnackbarOptions,
} from './types'
import type { SnackbarResult } from '@modulify/m3-foundation/types/components/snackbar'

import { isElement, isHTMLElement } from '@modulify/m3-foundation/lib/predicates'
import { useEffect, useRef, useState } from 'react'

import defineComponent from '@/utils/component'
import { toClassName } from '@/utils/styling'
import { useTimeout } from '@/hooks'

import M3Snackbar from './M3Snackbar'

interface Entry {
  options: SnackbarOptions;
  action: SnackbarActionRenderer | null;
  resolve: (result: SnackbarResult) => void;

  trigger: HTMLElement | null;
  nextFocus: HTMLElement | null;

  remaining: number | null;
  startedAt: number;
}

interface Display {
  entry: Entry;
  leaving: boolean;
}

const DEFAULT_DURATION_MS = 6000
const EXIT_TRANSITION_MS = 150

const PAGE_FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')
const SNACKBAR_CONTROLS_SELECTOR = '.m3-snackbar__action, .m3-snackbar__close'

export interface M3SnackbarHostProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  ref?: Ref<SnackbarHostMethods>;
  renderAction?: SnackbarActionRenderer;
}

const getNextFocusable = (trigger: HTMLElement | null): HTMLElement | null => {
  if (!trigger) return null
  const elements = Array.from(document.querySelectorAll<HTMLElement>(PAGE_FOCUSABLE_SELECTOR))
  return elements[elements.indexOf(trigger) + 1] ?? null
}

const isFocusable = (element: HTMLElement | null): element is HTMLElement => Boolean(
  element?.isConnected && !element.closest('[inert]') && !element.matches(':disabled')
)

export default defineComponent(function M3SnackbarHost({
  ref: _ref,
  className = '',
  renderAction,
  onMouseEnter,
  onMouseLeave,
  onFocusCapture,
  onBlurCapture,
  ...attrs
}: M3SnackbarHostProps, { expose }: ComponentSetupContext<SnackbarHostMethods>) {
  const [display, setDisplay] = useState<Display | null>(null)
  const [announcement, setAnnouncement] = useState('')
  const root = useRef<HTMLDivElement | null>(null)

  const active = useRef<Entry | null>(null)
  const leaving = useRef<Entry | null>(null)
  const queue = useRef<Entry[]>([])

  const timerRunning = useRef(false)
  const paused = useRef({ hover: false, focus: false })
  const disposed = useRef(false)

  const durationTimeout = useTimeout(() => {
    timerRunning.current = false
    finish('timeout')
  }, DEFAULT_DURATION_MS)
  const exitTimeout = useTimeout((entry: Entry) => {
    restoreFocus(entry)
    leaving.current = null
    const next = queue.current.shift()
    if (next) begin(next)
    else {
      setDisplay(null)
      setAnnouncement('')
    }
  }, EXIT_TRANSITION_MS)

  const stopTimer = () => {
    if (!timerRunning.current) return
    durationTimeout.cancel()
    timerRunning.current = false
    if (active.current && active.current.remaining !== null) {
      active.current.remaining = Math.max(0, active.current.remaining - (Date.now() - active.current.startedAt))
    }
  }

  const pause = (kind: 'hover' | 'focus') => {
    paused.current[kind] = true
    stopTimer()
  }

  const resume = (kind: 'hover' | 'focus') => {
    paused.current[kind] = false
    const entry = active.current
    if (!entry || paused.current.hover || paused.current.focus || entry.remaining === null) return

    entry.startedAt = Date.now()
    timerRunning.current = true
    durationTimeout.scheduleWithDelay(entry.remaining)
  }

  const restoreFocus = (entry: Entry) => {
    if (!root.current?.contains(document.activeElement)) return
    const target = isFocusable(entry.trigger) ? entry.trigger : isFocusable(entry.nextFocus) ? entry.nextFocus : null
    target?.focus()
  }

  const begin = (entry: Entry) => {
    active.current = entry
    paused.current = { hover: false, focus: false }
    setDisplay({ entry, leaving: false })
    setAnnouncement(entry.options.message)
    if (entry.remaining !== null) {
      entry.startedAt = Date.now()
      timerRunning.current = true
      durationTimeout.scheduleWithDelay(entry.remaining)
    }
  }

  const finish = (result: SnackbarResult) => {
    const entry = active.current
    if (!entry) return
    stopTimer()
    active.current = null
    leaving.current = entry
    entry.resolve(result)
    setDisplay({ entry, leaving: true })
    setAnnouncement('')
    exitTimeout.schedule(entry)
  }

  const makeEntry = (options: SnackbarOptions, resolve: Entry['resolve']): Entry => {
    const activeElement = document.activeElement
    const trigger = isHTMLElement(activeElement) ? activeElement : null
    const action = options.action === undefined ? renderAction ?? null : options.action
    const duration = action ? null : options.duration === undefined ? DEFAULT_DURATION_MS : options.duration
    if (duration !== null && (!Number.isFinite(duration) || duration < 0)) {
      throw new RangeError('Snackbar duration must be a non-negative finite number or null')
    }
    return {
      options,
      action,
      resolve,
      trigger,
      nextFocus: getNextFocusable(trigger),
      remaining: duration,
      startedAt: 0,
    }
  }

  const show = (options: SnackbarOptions): Promise<SnackbarResult> => new Promise(resolve => {
    if (disposed.current) {
      resolve('disposed')
      return
    }

    const entry = makeEntry(options, resolve)
    if (active.current || leaving.current) queue.current.push(entry)
    else begin(entry)
  })

  const replace = (options: SnackbarOptions): Promise<SnackbarResult> => new Promise(resolve => {
    if (disposed.current) {
      resolve('disposed')
      return
    }

    const previous = active.current ?? leaving.current
    if (previous) restoreFocus(previous)

    const entry = makeEntry(options, resolve)
    stopTimer()
    exitTimeout.cancel()
    leaving.current = null
    active.current?.resolve('replaced')
    begin(entry)
  })

  const clear = () => {
    queue.current.splice(0).forEach(entry => entry.resolve('cleared'))
    finish('cleared')
  }

  const focus = () => {
    if (!active.current) return
    root.current?.querySelector<HTMLElement>(SNACKBAR_CONTROLS_SELECTOR)?.focus()
  }

  expose({ show, replace, dismiss: () => finish('dismiss'), clear, focus })

  useEffect(() => {
    disposed.current = false
    const onKeyDown = (event: KeyboardEvent) => {
      if (!event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.key.toLowerCase() !== 'g' || !active.current) return
      if (!root.current?.querySelector(SNACKBAR_CONTROLS_SELECTOR)) return

      event.preventDefault()
      focus()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      disposed.current = true
      queueMicrotask(() => {
        if (!disposed.current) return
        stopTimer()
        exitTimeout.cancel()
        active.current?.resolve('disposed')
        queue.current.splice(0).forEach(entry => entry.resolve('disposed'))
        active.current = null
        leaving.current = null
      })
    }
  }, [])

  const options = display?.entry.options
  const closable = options?.closable ?? Boolean(display?.entry.action || display?.entry.remaining === null)

  return (
    <div
      ref={root}
      className={toClassName(['m3-snackbar-host', className])}
      {...attrs}
      onMouseEnter={event => { pause('hover'); onMouseEnter?.(event) }}
      onMouseLeave={event => { resume('hover'); onMouseLeave?.(event) }}
      onFocusCapture={event => { pause('focus'); onFocusCapture?.(event) }}
      onBlurCapture={event => {
        if (!isElement(event.relatedTarget) || !event.currentTarget.contains(event.relatedTarget)) resume('focus')
        onBlurCapture?.(event)
      }}
    >
      <span className="m3-snackbar-host__announcement" role="status" aria-live="polite" aria-atomic="true">
        {announcement}
      </span>
      {display && options && (
        <M3Snackbar
          message={options.message}
          layout={options.layout}
          closable={closable}
          closeLabel={options.closeLabel}
          leaving={display.leaving}
          announce={false}
          onAction={() => finish('action')}
          onDismiss={() => finish('dismiss')}
        >
          {display.entry.action && <M3Snackbar.Action>{display.entry.action}</M3Snackbar.Action>}
        </M3Snackbar>
      )}
    </div>
  )
})
