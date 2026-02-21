import type {
  FC,
  HTMLAttributes,
  ReactNode,
} from 'react'

import type { M3LinkMethods } from '@/components/link'
import type { M3RippleMethods } from '@/components/ripple'

import { M3Link } from '@/components/link'
import { M3Ripple } from '@/components/ripple'

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { compose } from '@/utils/events'
import { distinct } from '@/utils/content'
import { toClassName } from '@/utils/styling'

export interface M3MenuItemProps extends HTMLAttributes<HTMLElement> {
  href?: string;
  selected?: boolean;
  disabled?: boolean;
}

const Leading: FC<{ children: ReactNode }> = props => <>{props.children}</>
const Trailing: FC<{ children: ReactNode }> = props => <>{props.children}</>

const M3MenuItem: FC<M3MenuItemProps> = ({
  href,
  selected = false,
  disabled = false,
  className = '',
  children = [],
  onKeyUp = () => {},
  ...attrs
}) => {
  const root = useRef<M3LinkMethods | null>(null)
  const ripple = useRef<M3RippleMethods | null>(null)

  const [rippleTarget, setRippleTarget] = useState<HTMLElement | null>(null)

  useEffect(() => {
    setRippleTarget(root.current?.el() ?? null)
  }, [])

  const [slots, content] = useMemo(() => distinct(children, {
    leading: Leading,
    trailing: Trailing,
  }), [children])

  return (
    <M3Link
      ref={root}
      href={href}
      className={toClassName([className, {
        'm3-menu-item': true,
        'm3-menu-item_selected': selected,
        'm3-menu-item_disabled': disabled,
      }])}
      onKeyUp={compose(event => {
        if (event.code === 'Enter') {
          ripple.current?.activate(event.nativeEvent)
        }
      }, onKeyUp)}
      {...attrs}
    >
      <M3Ripple ref={ripple} owner={rippleTarget} />

      <span className="m3-menu-item__state" />
      <span className="m3-menu-item__content">
        {slots.leading ? (
          <span className="m3-menu-item__icon">
            {slots.leading}
          </span>
        ) : null}

        <span className="m3-menu-item__body">
          {content}
        </span>

        {slots.trailing ? (
          <span className="m3-menu-item__icon">
            {slots.trailing}
          </span>
        ) : null}
      </span>
    </M3Link>
  )
}

export default Object.assign(M3MenuItem, {
  Leading,
  Trailing,
})
