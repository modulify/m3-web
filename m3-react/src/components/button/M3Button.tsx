import type { Appearance } from '@modulify/m3-foundation/types/components/button'
import type { Focusable } from '@modulify/m3-foundation'

import type { M3RippleMethods } from '@/components/ripple'

import { M3Ripple } from '@/components/ripple'

import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react'

import { compose } from '@/utils/events'
import { normalize } from '@/utils/runtime'
import { toClassName } from '@/utils/styling'

type RootElement = HTMLAnchorElement | HTMLButtonElement

export interface M3ButtonProps extends React.HTMLAttributes<RootElement> {
  type?: HTMLButtonElement['type'];
  href?: string;
  appearance?: Appearance;
  disabled?: boolean;
}

export interface M3ButtonMethods extends Focusable {}

const M3Button: React.ForwardRefRenderFunction<
  M3ButtonMethods,
  M3ButtonProps
> = ({
  type = 'button',
  href = '',
  appearance = 'filled',
  disabled = false,
  className = '',
  children = [],
  onKeyUp = () => {},
  ...attrs
}, ref) => {
  const root = useRef<HTMLButtonElement | null>(null)
  const ripple = useRef<M3RippleMethods | null>(null)

  useImperativeHandle(ref, () => ({
    focus: () => root.current?.focus(),
    blur: () => root.current?.blur(),
  }))

  const content = normalize(children)

  const hasText = content.some(([, isIcon]) => !isIcon)
  const [, hasLeadingIcon] = content[0] ?? [null, false]
  const [, hasTrailingIcon] = content[content.length - 1] ?? [null, false]

  return (
    <button
      ref={root}
      type={type}
      className={toClassName([className, {
        ['m3-button']: true,
        ['m3-button_' + appearance]: true,
        ['m3-button_has-leading-icon']: hasText && hasLeadingIcon,
        ['m3-button_has-trailing-icon']: hasText && hasTrailingIcon,
      }])}
      disabled={disabled}
      onKeyUp={compose(event => {
        if (event.code === 'Enter') {
          ripple.current?.activate(event)
        }
      }, onKeyUp)}
      {...attrs}
    >
      <M3Ripple ref={ripple} owner={root} />
      <span className="m3-button__state">
        {content.map(([child, isIcon], index) => (
          <span
            key={index}
            className={toClassName({
              'm3-button__icon': isIcon,
              'm3-button__text': !isIcon,
            })}
          >
            {child}
          </span>
        ))}
      </span>
    </button>
  )
}

export default forwardRef(M3Button)