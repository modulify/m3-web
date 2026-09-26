import type { Appearance } from '@modulify/m3-foundation/types/components/button'
import type { ComponentSetupContext } from '@/utils/component'
import type { ElementEffect } from '@/hooks/useElementEffect'
import type { ElementReference } from '@modulify/m3-foundation/types/dom'
import type { HTMLAttributes } from 'react'
import type { Interactable } from '@modulify/m3-foundation/types/dom'
import type { M3RippleExposed } from '@/components/ripple'
import type { Ref } from 'react'

import { useMemo, useRef } from 'react'

import { M3Ripple } from '@/components/ripple'

import { compose } from '@/utils/events'
import defineComponent from '@/utils/component'
import { normalize } from '@/utils/content'
import { toClassName } from '@/utils/styling'
import { useElementEffect, useInteractable, useTarget } from '@/hooks'

type RootElement = HTMLAnchorElement | HTMLButtonElement

export interface M3ButtonProps extends HTMLAttributes<RootElement> {
  ref?: Ref<M3ButtonExposed>;
  type?: HTMLButtonElement['type'];
  href?: string;
  appearance?: Appearance;
  disabled?: boolean;
  effects?: ElementEffect<RootElement>[];
}

export interface M3ButtonExposed extends M3ButtonMethods, ElementReference<HTMLButtonElement> {}

export interface M3ButtonMethods extends Interactable {}

export default defineComponent(function M3Button({
  ref: _ref,
  type = 'button',
  href = '',
  appearance = 'filled',
  disabled = false,
  effects = [],
  className = '',
  children = [],
  onKeyUp = () => {},
  ...attrs
}: M3ButtonProps, { expose }: ComponentSetupContext<M3ButtonExposed>) {
  const root = useRef<HTMLButtonElement | null>(null)
  const ripple = useRef<M3RippleExposed | null>(null)

  const [rippleTarget, setRippleTarget] = useTarget<HTMLButtonElement>()
  const interactable = useInteractable(root)

  expose(interactable)

  useElementEffect(root, effects)
  useElementEffect(root, setRippleTarget)

  const content = useMemo(() => normalize(children), [children])

  const hasText = useMemo(() => content.some(([, isIcon]) => !isIcon), [content])
  const [, hasLeadingIcon] = content[0] ?? [null, false]
  const [, hasTrailingIcon] = content[content.length - 1] ?? [null, false]

  return (
    <button
      ref={root}
      type={type}
      disabled={disabled}
      className={toClassName([className, {
        ['m3-button']: true,
        ['m3-button_' + appearance]: true,
        ['m3-button_has-leading-icon']: hasText && hasLeadingIcon,
        ['m3-button_has-trailing-icon']: hasText && hasTrailingIcon,
      }])}
      {...attrs}
      onKeyUp={compose(event => {
        if (event.code === 'Enter') {
          ripple.current?.activate(event.nativeEvent)
        }
      }, onKeyUp)}
    >
      <M3Ripple ref={ripple} owner={rippleTarget} />
      <span className="m3-button__state" />
      <span className="m3-button__content">
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
})
