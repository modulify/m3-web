import type { ComponentSetupContext } from '@/utils/component'
import type { ElementReference } from '@modulify/m3-foundation/types/dom'
import type {
  HTMLAttributes,
  ReactElement,
  ReactNode,
  Ref,
} from 'react'
import type {
  TabLayout,
  TabNavigation,
  TabVariant,
} from '@modulify/m3-foundation/types/components/tabs'

import type { M3TabProps } from './M3Tab'

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'

import defineComponent from '@/utils/component'
import { distinct } from '@/utils/content'
import { M3Badge } from '@/components/badge'
import { M3Ripple } from '@/components/ripple'
import { toClassName } from '@/utils/styling'
import { useElementReference, useId } from '@/hooks'

import { M3Tab } from './M3Tab'
import { useTabGroupSelection } from './useTabGroupSelection'

interface TabButtonProps {
  id: string;
  panelId: string;
  tab: M3TabProps;
  active: boolean;
  focused: boolean;
  onActivate: () => void;
  onFocus: () => void;
}

const TabButton = ({ id, panelId, tab, active, focused, onActivate, onFocus }: TabButtonProps) => {
  const [owner, setOwner] = useState<HTMLButtonElement | null>(null)
  const iconOnly = !!tab.icon && (tab.label === null || tab.label === '')

  return (
    <button
      ref={setOwner}
      id={id}
      type="button"
      role="tab"
      aria-controls={panelId}
      aria-selected={active}
      aria-label={tab['aria-label']}
      disabled={tab.disabled}
      tabIndex={focused ? 0 : -1}
      className={toClassName(['m3-tab-group__tab', { 'm3-tab-group__tab_icon-only': iconOnly }])}
      onClick={onActivate}
      onFocus={onFocus}
    >
      {tab.icon && <span className="m3-tab-group__icon" aria-hidden="true">
        {tab.icon}
        {tab.badge !== undefined && tab.badge !== null && <M3Badge className="m3-tab-group__badge">{tab.badge}</M3Badge>}
      </span>}
      {!iconOnly && <span className="m3-tab-group__label-row">
        <span className="m3-tab-group__label">{tab.label}</span>
        {!tab.icon && tab.badge !== undefined && tab.badge !== null && <M3Badge className="m3-tab-group__badge" aria-hidden="true">{tab.badge}</M3Badge>}
      </span>}
      <M3Ripple owner={owner} />
    </button>
  )
}

export interface M3TabGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
  ref?: Ref<M3TabGroupExposed>;
  variant?: TabVariant;
  layout?: TabLayout;
  value?: string;
  navigation?: TabNavigation;
  queryKey?: string;
  onChange?: (value: string) => void;
  children?: ReactNode;
}

export interface M3TabGroupExposed extends ElementReference<HTMLDivElement> {}

export const M3TabGroup = defineComponent(function M3TabGroup({
  ref: _ref,
  variant = 'primary',
  layout = 'fixed',
  value,
  navigation,
  queryKey = 'tab',
  onChange = () => {},
  children,
  id: idProp,
  className = '',
  onKeyDown = () => {},
  ...attrs
}: M3TabGroupProps, { expose }: ComponentSetupContext<M3TabGroupExposed>) {
  const root = useRef<HTMLDivElement | null>(null)
  const track = useRef<HTMLDivElement | null>(null)
  const id = useId(idProp, 'm3-tab-group')
  const { collections } = distinct(children, { collections: { tabs: M3Tab } })
  const tabs = collections.tabs as ReactElement<M3TabProps>[]
  const available = tabs.filter(tab => !tab.props.disabled)
  const { selected, activate } = useTabGroupSelection({
    available: available.map(tab => tab.props.value),
    value,
    navigation,
    queryKey,
    onChange,
  })
  const [focusedValue, setFocusedValue] = useState<string | undefined>()
  const focusable = available.some(tab => tab.props.value === focusedValue) ? focusedValue : available.find(tab => tab.props.value === selected)?.props.value ?? available[0]?.props.value
  const [indicator, setIndicator] = useState({ offset: 0, width: 0 })

  expose(useElementReference(root))

  const updateIndicator = useCallback(() => {
    const active = track.current?.querySelector<HTMLButtonElement>('[role="tab"][aria-selected="true"]')
    const label = variant === 'primary' ? active?.querySelector<HTMLElement>('.m3-tab-group__label-row, .m3-tab-group__icon') : null
    const next = active
      ? label
        ? { offset: active.offsetLeft + label.offsetLeft + Math.min(2, (label.offsetWidth - 24) / 2), width: Math.max(24, label.offsetWidth - 4) }
        : { offset: active.offsetLeft, width: active.offsetWidth }
      : { offset: 0, width: 0 }
    setIndicator(previous => previous.offset === next.offset && previous.width === next.width ? previous : next)
  }, [variant])

  useLayoutEffect(updateIndicator)

  useLayoutEffect(() => {
    const active = track.current?.querySelector<HTMLButtonElement>('[role="tab"][aria-selected="true"]')
    active?.scrollIntoView?.({ block: 'nearest', inline: 'nearest' })
  }, [selected])

  useEffect(() => {
    if (!track.current || !('ResizeObserver' in window)) return
    const observer = new ResizeObserver(updateIndicator)
    observer.observe(track.current)
    track.current.querySelectorAll('[role="tab"]').forEach(tab => observer.observe(tab))
    return () => observer.disconnect()
  }, [children, updateIndicator])

  const moveFocus = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const current = event.target as HTMLElement
    if (current.getAttribute('role') !== 'tab') return
    const buttons = Array.from(track.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)') ?? [])
    const index = buttons.indexOf(current as HTMLButtonElement)
    if (index < 0) return
    const rtl = getComputedStyle(track.current!).direction === 'rtl'
    const delta = event.key === 'ArrowRight' ? (rtl ? -1 : 1) : event.key === 'ArrowLeft' ? (rtl ? 1 : -1) : 0
    const next = event.key === 'Home' ? buttons[0] : event.key === 'End' ? buttons.at(-1) : delta ? buttons[(index + delta + buttons.length) % buttons.length] : null
    if (!next) return
    event.preventDefault()
    next.focus()
    next.scrollIntoView?.({ block: 'nearest', inline: 'nearest' })
  }

  const withIcons = tabs.some(tab => tab.props.icon)

  return (
    <div
      ref={root}
      id={id}
      className={toClassName([className, 'm3-tab-group', `m3-tab-group_${variant}`, `m3-tab-group_${layout}`, { 'm3-tab-group_with-icons': withIcons }])}
      {...attrs}
      onKeyDown={event => {
        onKeyDown(event)
        if (!event.defaultPrevented) moveFocus(event)
      }}
    >
      <div className="m3-tab-group__scroll">
        <div
          ref={track}
          className="m3-tab-group__track"
          role="tablist"
          aria-label={attrs['aria-label']}
          aria-labelledby={attrs['aria-labelledby']}
          style={{
            '--m3-tab-group-indicator-offset': `${indicator.offset}px`,
            '--m3-tab-group-indicator-width': `${indicator.width}px`,
          } as React.CSSProperties}
        >
          {tabs.map(tab => {
            const name = tab.props.value
            return <TabButton
              key={name}
              id={`${id}-tab-${name}`}
              panelId={`${id}-panel-${name}`}
              tab={tab.props}
              active={name === selected && !tab.props.disabled}
              focused={name === focusable}
              onActivate={() => activate(name)}
              onFocus={() => setFocusedValue(name)}
            />
          })}
          <span className="m3-tab-group__indicator" aria-hidden="true" />
        </div>
      </div>
      {tabs.map(tab => {
        const active = tab.props.value === selected && !tab.props.disabled
        return <div
          key={tab.props.value}
          id={`${id}-panel-${tab.props.value}`}
          role="tabpanel"
          aria-labelledby={`${id}-tab-${tab.props.value}`}
          tabIndex={active ? 0 : -1}
          hidden={!active}
          className="m3-tab-group__panel"
        >{active && tab.props.children}</div>
      })}
    </div>
  )
})
