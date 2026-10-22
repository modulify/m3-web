import type { ComponentSetupContext } from '@/utils/component'
import type { ElementReference } from '@modulify/m3-foundation/types/dom'
import type { HTMLAttributes, Ref } from 'react'
import type {
  ToolbarAction,
  ToolbarColor,
  ToolbarOrientation,
  ToolbarScroll,
  ToolbarSide,
  ToolbarVariant,
} from '@modulify/m3-foundation/types/components/toolbar'

import {
  getToolbarScrollState,
  getToolbarVisibleCount,
} from '@modulify/m3-foundation/lib/toolbar'
import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { M3Button } from '@/components/button'
import { M3Icon } from '@/components/icon'
import { M3Menu, M3MenuItem } from '@/components/menu'

import defineComponent from '@/utils/component'
import { defineSlot, distinct } from '@/utils/content'
import { toClassName } from '@/utils/styling'
import { useElementReference, useResizeObserver } from '@/hooks'

export interface M3ToolbarProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<M3ToolbarExposed>;
  label: string;
  variant?: ToolbarVariant;
  orientation?: ToolbarOrientation;
  color?: ToolbarColor;
  side?: ToolbarSide;
  scroll?: ToolbarScroll;
  scrollTarget?: HTMLElement | Window | null;
  actions?: ToolbarAction[];
  overflowLabel?: string;
}

export interface M3ToolbarExposed extends ElementReference<HTMLDivElement> {}

const Fab = defineSlot('M3Toolbar.Fab')

export default defineComponent(function M3Toolbar({
  ref: _ref,
  label,
  variant = 'docked',
  orientation = 'horizontal',
  color = 'standard',
  side = 'end',
  scroll = 'pinned',
  scrollTarget,
  actions = [],
  overflowLabel = 'More actions',
  className = '',
  children = [],
  onKeyDown = () => {},
  onFocusCapture = () => {},
  ...attrs
}: M3ToolbarProps, { expose }: ComponentSetupContext<M3ToolbarExposed>) {
  const root = useRef<HTMLDivElement | null>(null)
  const actionGroup = useRef<HTMLDivElement | null>(null)
  const custom = useRef<HTMLDivElement | null>(null)
  const overflow = useRef<HTMLButtonElement | null>(null)
  const [overflowTarget, setOverflowTarget] = useState<HTMLButtonElement | null>(null)
  const [visibleCount, setVisibleCount] = useState(actions.length)
  const [scrollActive, setScrollActive] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [slots, content] = useMemo(() => distinct(children, { fab: Fab }), [children])
  const vertical = variant === 'floating' && orientation === 'vertical'
  const hasFab = variant === 'floating' && !!slots.fab
  const collapsed = scroll === 'collapse' && scrollActive && hasFab
  const hidden = scroll === 'hide' && scrollActive
  const shown = actions.slice(0, visibleCount)
  const excess = actions.slice(visibleCount)

  expose(useElementReference(root))

  const updateMeasurements = () => {
    const parent = root.current?.parentElement
    if (!parent) return
    const axis = vertical ? Math.min(parent.clientHeight || window.innerHeight, window.innerHeight) : parent.clientWidth || window.innerWidth
    const outer = variant === 'docked' ? 0 : vertical ? 48 : 32
    const padding = variant === 'docked' ? 32 : 16
    const customSize = vertical
      ? Math.max(custom.current?.scrollHeight ?? 0, custom.current?.offsetHeight ?? 0)
      : Math.max(custom.current?.scrollWidth ?? 0, custom.current?.offsetWidth ?? 0)
    const fabSize = hasFab ? 64 : 0
    setVisibleCount(getToolbarVisibleCount(axis - outer - padding, actions.length, customSize + fabSize))
    if (variant === 'floating' && actionGroup.current) {
      const size = (vertical ? actionGroup.current.scrollHeight : actionGroup.current.scrollWidth) + padding
      root.current?.style.setProperty('--m3-toolbar-expanded-size', `${size}px`)
    }
  }

  useResizeObserver(() => [root.current?.parentElement ?? null, custom.current], updateMeasurements)
  useLayoutEffect(updateMeasurements, [actions, variant, orientation, hasFab, visibleCount])

  useEffect(() => {
    const target = scrollTarget ?? window
    const position = () => target === window ? window.scrollY : (target as HTMLElement).scrollTop
    const controller = new AbortController()
    let previous = position()

    const update = () => {
      const current = position()
      setScrollActive(active => root.current?.contains(document.activeElement)
        ? false
        : getToolbarScrollState(previous, current, active, scroll))
      previous = current
    }

    update()
    target.addEventListener('scroll', update, { passive: true, signal: controller.signal })
    return () => controller.abort('Toolbar scroll listener disposed')
  }, [scroll, scrollTarget])

  useEffect(() => {
    if (excess.length === 0) setMenuOpen(false)
  }, [excess.length])

  return <div
    ref={root}
    role="toolbar"
    aria-label={label}
    aria-orientation={vertical ? 'vertical' : 'horizontal'}
    className={toClassName([className, {
      'm3-toolbar': true,
      [`m3-toolbar_${variant}`]: true,
      [`m3-toolbar_${color}`]: true,
      'm3-toolbar_vertical': vertical,
      'm3-toolbar_side-start': vertical && side === 'start',
      'm3-toolbar_hidden': hidden,
      'm3-toolbar_collapsed': collapsed,
    }])}
    {...attrs}
    onFocusCapture={event => {
      setScrollActive(false)
      onFocusCapture(event)
    }}
    onKeyDown={event => {
      const target = event.target as HTMLElement
      if (target.matches('input, textarea, select, [contenteditable="true"]')) {
        onKeyDown(event)
        return
      }

      const first = vertical ? 'ArrowUp' : 'ArrowLeft'
      const last = vertical ? 'ArrowDown' : 'ArrowRight'
      if (event.key === first || event.key === last || event.key === 'Home' || event.key === 'End') {
        const controls = [...(root.current?.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], input:not(:disabled)') ?? [])]
        const index = controls.indexOf(document.activeElement as HTMLElement)
        if (index !== -1 && controls.length > 0) {
          const rtl = !vertical && getComputedStyle(root.current!).direction === 'rtl'
          const direction = event.key === first ? -1 : 1
          const next = event.key === 'Home' ? 0 : event.key === 'End' ? controls.length - 1
            : (index + direction * (rtl ? -1 : 1) + controls.length) % controls.length
          controls[next]?.focus()
          event.preventDefault()
        }
      }
      onKeyDown(event)
    }}
  >
    <div className="m3-toolbar__container" inert={collapsed}>
      <div ref={actionGroup} className="m3-toolbar__actions">
        {shown.map(action => <span key={action.id} className="m3-toolbar__action">
          <M3Button aria-label={action.label}
            aria-pressed={action.selected}
            appearance={action.selected ? 'tonal' : 'standard'}
            disabled={action.disabled}
            width="medium"
            onClick={action.onClick}
          >
            <M3Icon name={action.icon} />
          </M3Button>
        </span>)}
        {content && <div ref={custom} className="m3-toolbar__custom">{content}</div>}
        {excess.length > 0 && <span className="m3-toolbar__action">
          <M3Button ref={instance => {
            overflow.current = instance?.el ?? null
            setOverflowTarget(current => current === overflow.current ? current : overflow.current)
          }} appearance="standard"
          aria-label={overflowLabel}
          aria-expanded={menuOpen}
          aria-haspopup="menu"
          width="medium"
          >
            <M3Icon name="more_vert" />
          </M3Button>
        </span>}
      </div>
    </div>
    {hasFab && <div className="m3-toolbar__fab">{slots.fab}</div>}
    {excess.length > 0 && <M3Menu className="m3-toolbar__menu" target={overflowTarget} shown={menuOpen} onToggle={setMenuOpen}>
      {excess.map(action => <M3MenuItem
        key={action.id}
        selected={action.selected}
        disabled={action.disabled}
        onClick={() => {
          if (!action.disabled) action.onClick()
          setMenuOpen(false)
        }}
      >
        <M3MenuItem.Leading><M3Icon name={action.icon} /></M3MenuItem.Leading>
        {action.label}
      </M3MenuItem>)}
    </M3Menu>}
  </div>
}, { slots: { Fab } })
