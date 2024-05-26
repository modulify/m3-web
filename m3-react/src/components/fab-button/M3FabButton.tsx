import type {
  ForwardRefRenderFunction,
  HTMLAttributes,
} from 'react'

import type {
  Clickable,
  Focusable,
} from '@modulify/m3-foundation'

import type {
  Size,
  Variant,
} from '@modulify/m3-foundation/types/components/fab-button'

import type { M3RippleMethods } from '@/components/ripple'

import { M3Ripple } from '@/components/ripple'

import {
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react'

import {
  useElementEffect,
  useTarget,
} from '@/hooks'

import { compose } from '@/utils/events'
import { normalize } from '@/utils/content'
import { toClassName } from '@/utils/styling'

type RootElement = HTMLAnchorElement | HTMLButtonElement

export interface M3FabButtonProps extends HTMLAttributes<RootElement> {
  type?: HTMLButtonElement['type'];
  href?: string;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
}

export interface M3FabButtonMethods extends Clickable, Focusable {}

const M3FabButton: ForwardRefRenderFunction<
  M3FabButtonMethods,
  M3FabButtonProps
> = ({
  type = 'button',
  href = '',
  variant = 'filled',
  size = 'md',
  disabled = false,
  className = '',
  children = [],
  onKeyUp = () => {},
  ...attrs
}, ref) => {
  const root = useRef<HTMLButtonElement | null>(null)
  const ripple = useRef<M3RippleMethods | null>(null)
  const [rippleTarget, setRippleTarget] = useTarget<HTMLElement>()

  useImperativeHandle(ref, () => ({
    click: () => root.current?.click(),
    focus: () => root.current?.focus(),
    blur: () => root.current?.blur(),
  }))

  useElementEffect(root, setRippleTarget)

  const content = normalize(children)

  const hasText = content.some(([, isIcon]) => !isIcon)
  const [, hasLeadingIcon] = content[0] ?? [null, false]
  const [, hasTrailingIcon] = content[content.length - 1] ?? [null, false]

  return (
    <button
      ref={root}
      type={type}
      className={toClassName({
        [className]: className.length > 0,
        ['m3-fab-button']: true,
        ['m3-fab-button_' + variant]: variant !== 'filled',
        ['m3-fab-button_' + size]: size !== 'md',
        ['m3-fab-button_has-leading-icon']: hasText && hasLeadingIcon,
        ['m3-fab-button_has-trailing-icon']: hasText && hasTrailingIcon,
      })}
      disabled={disabled}
      onKeyUp={compose(event => {
        if (event.code === 'Enter') {
          ripple.current?.activate(event.nativeEvent)
        }
      }, onKeyUp)}
      {...attrs}
    >
      <M3Ripple ref={ripple} owner={rippleTarget} />
      <span className="m3-fab-button__state">
        {content.map(([child, isIcon], index) => (
          <span
            key={index}
            className={toClassName({
              'm3-fab-button__icon': isIcon,
              'm3-fab-button__text': !isIcon,
            })}
          >
            {child}
          </span>
        ))}
      </span>
    </button>
  )
}

export default forwardRef(M3FabButton)