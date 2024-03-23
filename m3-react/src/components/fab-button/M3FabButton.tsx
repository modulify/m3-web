import type { Focusable } from '~types/dom'

import type {
  Size,
  Variant,
} from '~types/components/fab-button'

import type { M3RippleMethods } from '@/components/ripple'

import { M3Ripple } from '@/components/ripple'

import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react'

import { normalize } from '@/utils/runtime'
import { toClassName } from '@/utils/styling'

type RootElement = HTMLAnchorElement | HTMLButtonElement

export interface M3FabButtonProps extends React.HTMLAttributes<RootElement> {
  type?: HTMLButtonElement['type'];
  href?: string;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
}

export interface M3FabButtonMethods extends Focusable {}

const M3FabButton: React.ForwardRefRenderFunction<
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
  onKeyDown = () => {},
  onKeyUp = () => {},
  ...attrs
}, ref) => {
  const root = useRef<HTMLButtonElement | null>(null)
  const ripple = useRef<M3RippleMethods | null>(null)

  useImperativeHandle(ref, () => ({
    focus: () => root.current?.focus(),
    blur: () => root.current?.blur(),
  }))

  const _onKeyDown = (event: React.KeyboardEvent<RootElement>) => {
    if (event.code === 'Space') {
      event.preventDefault()
      ripple.current?.activate(event)
    }

    onKeyDown(event)
  }

  const _onKeyUp = (event: React.KeyboardEvent<RootElement>) => {
    if (event.code === 'Enter') {
      ripple.current?.activate(event)
    }

    onKeyUp(event)
  }

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
      onKeyDown={_onKeyDown}
      onKeyUp={_onKeyUp}
      {...attrs}
    >
      <M3Ripple ref={ripple} owner={root} />
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