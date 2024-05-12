import type {
  ForwardRefRenderFunction,
  HTMLAttributes,
} from 'react'

import type { Appearance } from '@modulify/m3-foundation/types/components/button'
import type {
  Clickable,
  Focusable,
} from '@modulify/m3-foundation'

import type { ElementEffect } from '@/hooks/useElementEffect'

import type { M3RippleMethods } from '@/components/ripple'

import { M3Ripple } from '@/components/ripple'

import {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react'

import { useElementEffect } from '@/hooks'

import { compose } from '@/utils/events'
import { normalize } from '@/utils/content'
import { toClassName } from '@/utils/styling'

type RootElement = HTMLAnchorElement | HTMLButtonElement

export interface M3ButtonProps extends HTMLAttributes<RootElement> {
  type?: HTMLButtonElement['type'];
  href?: string;
  appearance?: Appearance;
  effects?: ElementEffect<RootElement>[];
  disabled?: boolean;
}

export interface M3ButtonMethods extends Clickable, Focusable {}

const M3Button: ForwardRefRenderFunction<
  M3ButtonMethods,
  M3ButtonProps
> = ({
  type = 'button',
  href = '',
  appearance = 'filled',
  effects = [],
  disabled = false,
  className = '',
  children = [],
  onKeyUp = () => {},
  ...attrs
}, ref) => {
  const root = useRef<HTMLButtonElement | null>(null)
  const ripple = useRef<M3RippleMethods | null>(null)

  useImperativeHandle(ref, () => ({
    click: () => root.current?.click(),
    focus: () => root.current?.focus(),
    blur: () => root.current?.blur(),
  }))

  useElementEffect(root, effects)

  const content = useMemo(() => normalize(children), [children])

  const hasText = useMemo(() => content.some(([, isIcon]) => !isIcon), [content])
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