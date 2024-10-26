import type {
  FC,
  ForwardRefRenderFunction,
  HTMLAttributes,
  ReactNode,
} from 'react'

import type {
  Clickable,
  Focusable,
} from '@modulify/m3-foundation'

import type { M3RippleMethods } from '@/components/ripple'

import { M3Badge } from '@/components/badge'
import { M3IconAppearance } from '@/components/icon'
import { M3Ripple } from '@/components/ripple'

import {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react'

import {
  useBreakpoint,
  useElementEffect,
  useId,
  useTarget,
} from '@/hooks'

import { compose } from '@/utils/events'
import { distinct } from '@/utils/content'
import { toClassName } from '@/utils/styling'
import { useM3NavigationAppearance } from './M3NavigationAppearance'

export interface M3NavigationTabProps extends HTMLAttributes<HTMLElement> {
  href?: string;
  label?: string;
  active?: boolean;
  badged?: boolean;
  /** Disables default click event handler on button element, useful for programmatic navigation. */
  prevent?: boolean;
  onNavigate?: () => void;
}

export interface M3NavigationTabMethods extends Clickable, Focusable {}

const Icon: FC<HTMLAttributes<HTMLElement>> = ({
  className = '',
  children = [],
  ...attrs
}) => (
  <span className={toClassName(['m3-navigation-tab__icon', className])} {...attrs}>
    {children}
  </span>
)

const Label: FC<{ children: ReactNode }> = props => <>{props.children}</>
const Badge: FC<{ children: ReactNode }> = props => <>{props.children}</>

const M3NavigationTab: ForwardRefRenderFunction<
  M3NavigationTabMethods,
  M3NavigationTabProps
> = ({
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
}, ref) => {
  const button = useRef<HTMLButtonElement | null>(null)
  const ripple = useRef<M3RippleMethods | null>(null)
  const [rippleTarget, setRippleTarget] = useTarget<HTMLElement>()

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

  useImperativeHandle(ref, () => ({
    click: () => button.current?.click(),
    focus: () => button.current?.focus(),
    blur: () => button.current?.blur(),
  }))

  return (
    <div
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
              className="m3-navigation-tab__badge-label"
              role="status"
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
}

export default Object.assign(forwardRef(M3NavigationTab), {
  Badge,
  Icon,
  Label,
})