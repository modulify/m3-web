import type { Focusable } from '@modulify/m3-foundation'
import type { M3RippleMethods } from '@/components/ripple'

import { M3Badge } from '@/components/badge'
import { M3IconAppearance } from '@/components/icon'
import { M3Ripple } from '@/components/ripple'

import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react'

import makeId from '@/utils/id'
import { compose } from '@/utils/events'
import { distribute } from '@/utils/content'
import { toClassName } from '@/utils/styling'
import { useBreakpoint } from '@/composables/breakpoint'
import { useM3NavigationAppearance } from './M3NavigationAppearance'

export interface M3NavigationTabProps extends React.HTMLAttributes<HTMLElement> {
  href?: string;
  label?: string;
  active?: boolean;
  badged?: boolean;
  /** Disables default click event handler on button element, useful for programmatic navigation. */
  prevent?: boolean;
  onNavigate?: () => void;
}

export interface M3NavigationTabMethods extends Focusable {}

const Icon: React.FC<React.HTMLAttributes<HTMLElement>> = ({
  className = '',
  children = [],
  ...attrs
}) => (
  <span className={toClassName(['m3-navigation-tab__icon', className])} {...attrs}>
    {children}
  </span>
)

const Label: React.FC<{ children: React.ReactNode }> = props => <>{props.children}</>
const Badge: React.FC<{ children: React.ReactNode }> = props => <>{props.children}</>

const M3NavigationTab: React.ForwardRefRenderFunction<
  M3NavigationTabMethods,
  M3NavigationTabProps
> = ({
  id= makeId('m3-navigation-item'),
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

  const [slots, content] = distribute(children, {
    icon: Icon,
    label: Label,
    badge: Badge,
  })

  const appearance = useM3NavigationAppearance()
  const breakpoint = useBreakpoint()

  const inDrawer = breakpoint.ge('large') || appearance === 'drawer'

  const hasLabel = !!slots.label || label.length > 0

  const labelIdForDrawer = id + '-label-for-drawer'
  const labelIdForRail = id + '-label-for-rail'
  const labelId = inDrawer ? labelIdForDrawer : labelIdForRail

  useImperativeHandle(ref, () => ({
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
            ripple.current?.activate(event)
          }
        }, onKeyUp)}
      >
        <M3Ripple ref={ripple} owner={button} />

        <span className="m3-navigation-tab__state">
          <M3IconAppearance.Provider value={active ? 'filled' : 'outlined'}>
            {slots.icon ?? content}
          </M3IconAppearance.Provider>

          {hasLabel
            ?
            <span
              id={labelIdForDrawer}
              aria-hidden={!inDrawer}
              className="m3-navigation-tab__label"
              children={slots.label ?? label}
            />
            : null
          }

          {slots.badge
            ?
            <span
              aria-hidden={!inDrawer}
              className="m3-navigation-tab__badge-label"
              children={slots.badge}
              role="status"
            />
            : null
          }
        </span>
      </button>

      {hasLabel
        ?
        <div
          id={labelIdForRail}
          aria-hidden={inDrawer}
          className="m3-navigation-tab__label"
          children={slots.label ?? label}
        />
        : null
      }

      {slots.badge || badged
        ?
        <M3Badge
          aria-hidden={inDrawer}
          className={toClassName({
            'm3-navigation-tab__badge': true,
            'm3-navigation-tab__badge_labelled': !!slots.badge,
          })}
          children={slots.badge}
        />
        : null
      }
    </div>
  )
}

export default Object.assign(forwardRef(M3NavigationTab), {
  Badge,
  Icon,
  Label,
})