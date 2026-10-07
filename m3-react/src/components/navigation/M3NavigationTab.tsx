import type { ComponentSetupContext } from '@/utils/component'
import type { ElementReference } from '@modulify/m3-foundation/types/dom'
import type { FC } from 'react'
import type { HTMLAttributes } from 'react'
import type { Interactable } from '@modulify/m3-foundation/types/dom'
import type { M3LinkExposed } from '@/components/link'
import type { M3RippleExposed } from '@/components/ripple'
import type { Ref } from 'react'

import { mergeIdRefs } from '@modulify/m3-foundation/lib/dom'
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { M3Badge } from '@/components/badge'
import { M3IconAppearance } from '@/components/icon'
import { M3Link } from '@/components/link'
import { M3Ripple } from '@/components/ripple'

import { compose } from '@/utils/events'
import defineComponent from '@/utils/component'
import { defineSlot, distinct } from '@/utils/content'
import { toClassName } from '@/utils/styling'
import { useBreakpoint, useId } from '@/hooks'

import { useM3NavigationAppearance } from './M3NavigationAppearance'

export interface M3NavigationTabProps extends HTMLAttributes<HTMLElement> {
  ref?: Ref<M3NavigationTabExposed>;
  href?: string;
  label?: string;
  active?: boolean;
  badged?: boolean;
  /** Disables default click event handler on button element, useful for programmatic navigation. */
  prevent?: boolean;
  onNavigate?: () => void;
}

export interface M3NavigationTabExposed extends M3NavigationTabMethods, ElementReference<HTMLDivElement> {}

export interface M3NavigationTabMethods extends Interactable {}

const Icon: FC<HTMLAttributes<HTMLElement>> = defineSlot('M3NavigationTab.Icon', ({
  className = '',
  children = [],
  ...attrs
}) => (
  <span className={toClassName(['m3-navigation-tab__icon', className])} {...attrs}>
    {children}
  </span>
))

const Label = defineSlot('M3NavigationTab.Label')
const Badge = defineSlot('M3NavigationTab.Badge')

export default defineComponent(function M3NavigationTab({
  ref: _ref,
  id,
  href,
  label = '',
  active = false,
  badged = false,
  prevent = false,
  children = [],
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  onKeyUp = () => {},
  onNavigate = () => {},
  ...attrs
}: M3NavigationTabProps, { expose }: ComponentSetupContext<M3NavigationTabExposed>) {
  const root = useRef<HTMLDivElement | null>(null)
  const link = useRef<M3LinkExposed | null>(null)
  const ripple = useRef<M3RippleExposed | null>(null)
  const [rippleTarget, setRippleTarget] = useState<HTMLElement | null>(null)
  const [rippleSurface, setRippleSurface] = useState<HTMLElement | null>(null)

  useEffect(() => {
    const target = link.current?.el ?? null
    setRippleTarget(current => current === target ? current : target)
  })

  const [slots, content, hasSlot] = useMemo(() => distinct(children, {
    icon: Icon,
    label: Label,
    badge: Badge,
  }), [children])

  const requestedAppearance = useM3NavigationAppearance()
  const breakpoint = useBreakpoint()
  const resolvedAppearance = requestedAppearance === 'auto'
    ? breakpoint.ge('large') ? 'rail-expanded' : breakpoint.ge('expanded') ? 'rail' : 'bar'
    : requestedAppearance
  const appearance = resolvedAppearance === 'bar-vertical' ? 'bar' : resolvedAppearance
  const inDrawer = appearance === 'drawer'

  const hasLabel = hasSlot('label') || label.length > 0

  const _id = useId(id, 'm3-navigation-item')

  const labelId = _id + '-label'
  const buttonAriaLabelledBy = ariaLabelledBy === undefined
    ? ariaLabel === undefined ? labelId : undefined
    : mergeIdRefs(ariaLabelledBy, labelId)

  expose({
    get el () { return root.current },
    click: () => link.current?.click(),
    focus: () => link.current?.focus(),
    blur: () => link.current?.blur(),
  })

  return (
    <div
      ref={root}
      className={toClassName({
        ['m3-navigation-tab']: true,
        ['m3-navigation-tab_in-' + appearance]: true,
        ['m3-navigation-tab_labelled']: hasLabel,
        ['m3-navigation-tab_active']: active,
      })}
      {...attrs}
    >
      <M3Link
        ref={link}
        href={href}
        aria-label={ariaLabel}
        aria-labelledby={buttonAriaLabelledBy}
        aria-current={active ? 'page' : undefined}
        className="m3-navigation-tab__button"
        onClick={event => {
          if (prevent) {
            event.preventDefault()
          }

          onNavigate()
        }}
        onKeyUp={compose(event => {
          if (event.code === 'Enter') {
            ripple.current?.activate(event.nativeEvent)
          }
        }, onKeyUp)}
      >
        <span className="m3-navigation-tab__state">
          <M3IconAppearance.Provider value={active ? 'filled' : 'outlined'}>
            {slots.icon ?? <span className="m3-navigation-tab__icon">{content}</span>}
          </M3IconAppearance.Provider>

          {hasSlot('badge') || badged ? (
            <M3Badge
              aria-hidden={inDrawer}
              role="status"
              className={toClassName({
                'm3-navigation-tab__badge': true,
                'm3-navigation-tab__badge_labelled': !!slots.badge,
              })}
            >
              {slots.badge}
            </M3Badge>
          ) : null}

          {hasLabel ? (
            <span
              id={labelId}
              className="m3-navigation-tab__label"
            >
              {slots.label ?? label}
            </span>
          ) : null}

          {hasSlot('badge') && inDrawer ? (
            <span
              role="status"
              className="m3-navigation-tab__badge-label"
            >
              {slots.badge}
            </span>
          ) : null}

          <span ref={setRippleSurface} className="m3-navigation-tab__ripple-surface">
            <M3Ripple ref={ripple} owner={rippleTarget} surface={rippleSurface} centered />
          </span>
        </span>
      </M3Link>
    </div>
  )
}, {
  slots: { Badge, Icon, Label },
})
