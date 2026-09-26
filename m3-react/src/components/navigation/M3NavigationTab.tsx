import type { ComponentSetupContext } from '@/utils/component'
import type { ElementReference } from '@modulify/m3-foundation/types/dom'
import type { FC } from 'react'
import type { HTMLAttributes } from 'react'
import type { Interactable } from '@modulify/m3-foundation/types/dom'
import type { M3RippleExposed } from '@/components/ripple'
import type { Ref } from 'react'

import { useMemo, useRef } from 'react'

import { M3Badge } from '@/components/badge'
import { M3IconAppearance } from '@/components/icon'
import { M3Ripple } from '@/components/ripple'

import { compose } from '@/utils/events'
import defineComponent from '@/utils/component'
import { defineSlot, distinct } from '@/utils/content'
import { toClassName } from '@/utils/styling'
import {
  useBreakpoint,
  useElementEffect,
  useId,
  useInteractable,
  useTarget,
} from '@/hooks'

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
  onKeyUp = () => {},
  onNavigate = () => {},
  ...attrs
}: M3NavigationTabProps, { expose }: ComponentSetupContext<M3NavigationTabExposed>) {
  const root = useRef<HTMLDivElement | null>(null)
  const button = useRef<HTMLButtonElement | null>(null)
  const ripple = useRef<M3RippleExposed | null>(null)
  const [rippleTarget, setRippleTarget] = useTarget<HTMLElement>()
  const interactable = useInteractable(root, button)

  useElementEffect(button, setRippleTarget)

  const [slots, content, hasSlot] = useMemo(() => distinct(children, {
    icon: Icon,
    label: Label,
    badge: Badge,
  }), [children])

  const appearance = useM3NavigationAppearance()
  const breakpoint = useBreakpoint()

  const inDrawer = breakpoint.ge('large') || appearance === 'drawer'

  const hasLabel = hasSlot('label') || label.length > 0

  const _id = useId(id, 'm3-navigation-item')

  const labelIdForDrawer = _id + '-label-for-drawer'
  const labelIdForRail = _id + '-label-for-rail'
  const labelId = inDrawer ? labelIdForDrawer : labelIdForRail

  expose(interactable)

  return (
    <div
      ref={root}
      className={toClassName({
        ['m3-navigation-tab']: true,
        ['m3-navigation-tab_in-' + appearance]: true,
        ['m3-navigation-tab_labelled']: hasLabel,
        ['m3-navigation-tab_active']: active,
      })}
      {...{
        ...('aria-label' in attrs ? {} : { 'aria-labelledby': labelId }),
        ...attrs,
      }}
    >
      <button
        ref={button}
        aria-labelledby={labelId}
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
        <M3Ripple ref={ripple} owner={rippleTarget} />

        <span className="m3-navigation-tab__state">
          <M3IconAppearance.Provider value={active ? 'filled' : 'outlined'}>
            {slots.icon ?? content}
          </M3IconAppearance.Provider>

          {hasLabel ? (
            <span
              id={labelIdForDrawer}
              aria-hidden={!inDrawer}
              className="m3-navigation-tab__label"
            >
              {slots.label ?? label}
            </span>
          ) : null}

          {hasSlot('badge') ? (
            <span
              aria-hidden={!inDrawer}
              role="status"
              className="m3-navigation-tab__badge-label"
            >
              {slots.badge}
            </span>
          ) : null}
        </span>
      </button>

      {hasLabel ? (
        <div
          id={labelIdForRail}
          aria-hidden={inDrawer}
          className="m3-navigation-tab__label"
        >
          {slots.label ?? label}
        </div>
      ) : null}

      {hasSlot('badge') || badged ? (
        <M3Badge
          aria-hidden={inDrawer}
          className={toClassName({
            'm3-navigation-tab__badge': true,
            'm3-navigation-tab__badge_labelled': !!slots.badge,
          })}
        >
          {slots.badge}
        </M3Badge>
      ) : null}
    </div>
  )
}, {
  slots: { Badge, Icon, Label },
})
