import type { ComponentSetupContext } from '@/utils/component'
import type {
  CSSProperties,
  FC,
  FormEvent,
  HTMLAttributes,
  ReactNode,
  Ref,
} from 'react'
import type {
  SearchAnchorRect,
  SearchAppearance,
  SearchDockedPosition,
  SearchLayout,
  SearchViewport,
} from '@modulify/m3-foundation/types/components/search'

import { activateModalFocus } from '@modulify/m3-foundation/lib/modal'
import { createPortal } from 'react-dom'
import { CSSTransition } from 'react-transition-group'
import { durations } from '@modulify/m3-foundation/lib/motion'
import {
  getSearchDockedPosition,
  getSearchRevealOrigin,
  resolveSearchLayout,
} from '@modulify/m3-foundation/lib/search'
import {
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { M3Button } from '@/components/button'
import { M3Icon } from '@/components/icon'

import defineComponent from '@/utils/component'
import { defineSlot, distinct } from '@/utils/content'
import { toClassName } from '@/utils/styling'
import { useBreakpoint, useId, useLayerHost } from '@/hooks'

export interface SearchResultsContext {
  query: string;
  close(): void;
  submit(): void;
}

interface ResultsProps {
  render?: (context: SearchResultsContext) => ReactNode;
  children?: ReactNode;
}

type SearchViewStyle = CSSProperties & {
  '--m3-search-docked-left'?: string;
  '--m3-search-docked-top'?: string;
  '--m3-search-docked-width'?: string;
  '--m3-search-origin-left'?: string;
  '--m3-search-origin-right'?: string;
  '--m3-search-origin-offset-y'?: string;
}

export interface M3SearchProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSubmit'> {
  ref?: Ref<M3SearchExposed>;
  query: string;
  label: string;
  status: string;
  open: boolean;
  hint?: string;
  backLabel?: string;
  clearLabel?: string;
  appearance?: SearchAppearance;
  layout?: SearchLayout;
  onQueryChange: (query: string) => void;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (query: string) => void;
}

export interface M3SearchExposed {
  open(): void;
  close(): void;
  focus(): void;
}

const Leading = defineSlot('M3Search.Leading')
const Trailing = defineSlot('M3Search.Trailing')
const Actions = defineSlot('M3Search.Actions')
const Results: FC<ResultsProps> = defineSlot('M3Search.Results', () => null)

const resultSelector = 'a[href], button:not(:disabled), [tabindex="0"]'
const SEARCH_TRANSITION_MS = durations.medium2

export default defineComponent(function M3Search({
  ref: _ref,
  id,
  query,
  label,
  status,
  open,
  hint = label,
  backLabel = 'Back',
  clearLabel = 'Clear search',
  appearance = 'contained',
  layout = 'auto',
  className = '',
  children = [],
  onQueryChange,
  onOpenChange,
  onSubmit,
  ...attrs
}: M3SearchProps, { expose }: ComponentSetupContext<M3SearchExposed>) {
  const breakpoint = useBreakpoint()
  const resolvedLayout = resolveSearchLayout(layout, breakpoint.name)
  const rootId = useId(id, 'm3-search')
  const viewId = rootId + '-view'
  const resultsId = rootId + '-results'
  const accessibleName = hint === label ? label : `${hint} ${label}`

  const bar = useRef<HTMLDivElement | null>(null)
  const overlay = useRef<HTMLDivElement | null>(null)
  const dialog = useRef<HTMLDivElement | null>(null)
  const input = useRef<HTMLInputElement | null>(null)
  const results = useRef<HTMLDivElement | null>(null)
  const callbacks = useRef({ onOpenChange, onQueryChange, onSubmit })
  callbacks.current = { onOpenChange, onQueryChange, onSubmit }

  const [position, setPosition] = useState<SearchDockedPosition>({ left: 12, top: 12, width: 360 })
  const [anchor, setAnchor] = useState<SearchAnchorRect>({ left: 12, top: 12, width: 360 })
  const [viewport, setViewport] = useState<SearchViewport>({ width: 384, height: 640 })
  const [overlayMounted, setOverlayMounted] = useState(open)
  const layerHost = useLayerHost(open || overlayMounted)
  const parsed = useMemo(() => distinct(children, {
    slots: { leading: Leading, trailing: Trailing, actions: Actions, results: Results },
  }), [children])

  const close = () => callbacks.current.onOpenChange(false)
  const submit = () => {
    callbacks.current.onSubmit?.(query)
    results.current?.focus()
  }

  expose({
    open: () => callbacks.current.onOpenChange(true),
    close,
    focus: () => open ? input.current?.focus() : bar.current?.querySelector('button')?.focus(),
  })

  useLayoutEffect(() => {
    if (!open || !bar.current) return

    const update = () => {
      if (!bar.current) return
      const rect = bar.current.getBoundingClientRect()
      const nextViewport = {
        width: window.innerWidth,
        height: window.innerHeight,
      }
      setAnchor({ left: rect.left, top: rect.top, width: rect.width })
      setViewport(nextViewport)
      if (resolvedLayout === 'docked') setPosition(getSearchDockedPosition(rect, nextViewport))
    }

    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(update)
    observer?.observe(bar.current)
    window.addEventListener('resize', update)
    window.addEventListener('scroll', update, true)
    update()

    return () => {
      observer?.disconnect()
      window.removeEventListener('resize', update)
      window.removeEventListener('scroll', update, true)
    }
  }, [open, resolvedLayout])

  useLayoutEffect(() => {
    if (!open || !dialog.current || !layerHost) return

    const deactivate = activateModalFocus({
      dialog: dialog.current,
      layer: layerHost,
      onEscape: () => callbacks.current.onOpenChange(false),
    })
    input.current?.focus()
    return deactivate
  }, [open, layerHost])

  useLayoutEffect(() => {
    if (open) setOverlayMounted(true)
  }, [open])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    submit()
  }

  const focusResult = (last: boolean) => {
    const items = results.current?.querySelectorAll<HTMLElement>(resultSelector)
    const target = last ? items?.[items.length - 1] : items?.[0]
    target?.focus()
  }

  const origin = getSearchRevealOrigin(anchor, viewport, position, resolvedLayout)
  const viewStyle: SearchViewStyle = {
    '--m3-search-docked-left': `${position.left}px`,
    '--m3-search-docked-top': `${position.top}px`,
    '--m3-search-docked-width': `${position.width}px`,
    '--m3-search-origin-left': `${origin.left}px`,
    '--m3-search-origin-right': `${origin.right}px`,
    '--m3-search-origin-offset-y': `${origin.offsetY}px`,
  }

  const context: SearchResultsContext = { query, close, submit }
  const resultsSlot = parsed.slots.results
  const resultsContent = resultsSlot
    ? resultsSlot.props.render?.(context) ?? resultsSlot.props.children
    : parsed.content

  return (
    <>
      <div id={rootId} className={toClassName(['m3-search', className, { 'm3-search_open': open }])} {...attrs}>
        <div ref={bar} className="m3-search__bar">
          {parsed.slots.leading ? <div className="m3-search__leading">{parsed.slots.leading}</div> : null}
          <button
            type="button"
            className="m3-search__trigger"
            aria-label={accessibleName}
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-controls={open ? viewId : undefined}
            onClick={() => onOpenChange(true)}
          >
            {!parsed.slots.leading ? (
              <span className="m3-search__trigger-icon"><M3Icon name="search" aria-hidden="true" /></span>
            ) : null}
            <span className={toClassName(['m3-search__trigger-text', { 'm3-search__trigger-text_filled': query.length > 0 }])}>
              {query || hint}
            </span>
          </button>
          {parsed.slots.trailing ? <div className="m3-search__trailing">{parsed.slots.trailing}</div> : null}
        </div>
      </div>

      {layerHost ? createPortal(
        <CSSTransition
          nodeRef={overlay}
          in={open}
          timeout={SEARCH_TRANSITION_MS}
          classNames="m3-search"
          mountOnEnter
          unmountOnExit
          onExited={() => setOverlayMounted(false)}
        >
          <div ref={overlay} className="m3-search__overlay" aria-hidden={!open}>
            {resolvedLayout === 'docked' ? (
              <div className="m3-search__scrim" onClick={close} />
            ) : null}
            <div
              ref={dialog}
              id={viewId}
              role="dialog"
              aria-modal={open ? true : undefined}
              aria-label={label}
              inert={!open}
              tabIndex={-1}
              style={viewStyle}
              className={toClassName(['m3-search__view', {
                [`m3-search__view_${appearance}`]: true,
                [`m3-search__view_${resolvedLayout}`]: true,
              }])}
            >
              <form role="search" className="m3-search__header" onSubmit={handleSubmit}>
                <M3Button appearance="standard" aria-label={backLabel} width="medium" onClick={close}>
                  <M3Icon name="arrow_back" />
                </M3Button>
                <input
                  ref={input}
                  type="search"
                  className="m3-search__input"
                  value={query}
                  placeholder={hint}
                  aria-label={accessibleName}
                  aria-controls={resultsId}
                  onChange={event => callbacks.current.onQueryChange(event.target.value)}
                  onKeyDown={event => {
                    if (event.key === 'ArrowDown') {
                      event.preventDefault()
                      focusResult(false)
                    } else if (event.key === 'ArrowUp') {
                      event.preventDefault()
                      focusResult(true)
                    }
                  }}
                />
                <div className="m3-search__actions">
                  {query ? (
                    <M3Button appearance="standard" aria-label={clearLabel} width="medium" onClick={() => {
                      callbacks.current.onQueryChange('')
                      input.current?.focus()
                    }}>
                      <M3Icon name="close" />
                    </M3Button>
                  ) : null}
                  {parsed.slots.actions}
                </div>
              </form>
              <div
                ref={results}
                id={resultsId}
                className="m3-search__results"
                tabIndex={-1}
                onKeyDown={event => {
                  if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
                  const items = [...event.currentTarget.querySelectorAll<HTMLElement>(resultSelector)]
                  const current = items.indexOf(event.target as HTMLElement)
                  const next = event.key === 'ArrowDown'
                    ? items[Math.min(current + 1, items.length - 1)]
                    : items[Math.max(current - 1, 0)]
                  if (next) {
                    event.preventDefault()
                    next.focus()
                  }
                }}
              >
                {resultsContent}
              </div>
              <div className="m3-search__status" role="status" aria-live="polite">{status}</div>
            </div>
          </div>
        </CSSTransition>,
        layerHost
      ) : null}
    </>
  )
}, {
  slots: { Leading, Trailing, Actions, Results },
})
