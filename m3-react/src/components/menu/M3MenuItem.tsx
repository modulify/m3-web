import type { ComponentSetupContext } from '@/utils/component'
import type { ElementReference } from '@modulify/m3-foundation/types/dom'
import type { HTMLAttributes } from 'react'
import type { M3LinkExposed } from '@/components/link'
import type { M3RippleExposed } from '@/components/ripple'
import type { Ref } from 'react'

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { M3Link } from '@/components/link'
import { M3Ripple } from '@/components/ripple'

import { compose } from '@/utils/events'
import defineComponent from '@/utils/component'
import { defineSlot, distinct } from '@/utils/content'
import { toClassName } from '@/utils/styling'

export interface M3MenuItemProps extends HTMLAttributes<HTMLElement> {
  ref?: Ref<M3MenuItemExposed>;
  href?: string;
  selected?: boolean;
  disabled?: boolean;
}

export interface M3MenuItemExposed extends ElementReference<HTMLElement> {}

const Leading = defineSlot('M3MenuItem.Leading')
const Trailing = defineSlot('M3MenuItem.Trailing')

export default defineComponent(function M3MenuItem({
  ref: _ref,
  href,
  selected = false,
  disabled = false,
  className = '',
  children = [],
  onKeyUp = () => {},
  ...attrs
}: M3MenuItemProps, { expose }: ComponentSetupContext<M3MenuItemExposed>) {
  const root = useRef<M3LinkExposed | null>(null)
  const ripple = useRef<M3RippleExposed | null>(null)

  expose({
    get el () { return root.current?.el ?? null },
  })

  const [rippleTarget, setRippleTarget] = useState<HTMLElement | null>(null)

  useEffect(() => {
    setRippleTarget(root.current?.el ?? null)
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
      {...attrs}
      onKeyUp={compose(event => {
        if (event.code === 'Enter') {
          ripple.current?.activate(event.nativeEvent)
        }
      }, onKeyUp)}
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
}, {
  slots: { Leading, Trailing },
})
