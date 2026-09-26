import type { ComponentSetupContext } from '@/utils/component'
import type { ElementReference } from '@modulify/m3-foundation/types/dom'
import type { HTMLAttributes } from 'react'
import type { Interactable } from '@modulify/m3-foundation/types/dom'
import type { M3RippleExposed } from '@/components/ripple'
import type { Ref } from 'react'
import type { Size, Variant } from '@modulify/m3-foundation/types/components/fab-button'

import { useRef } from 'react'

import { M3Ripple } from '@/components/ripple'

import { compose } from '@/utils/events'
import defineComponent from '@/utils/component'
import { normalize } from '@/utils/content'
import { toClassName } from '@/utils/styling'
import { useElementEffect, useInteractable, useTarget } from '@/hooks'

type RootElement = HTMLAnchorElement | HTMLButtonElement

export interface M3FabButtonProps extends HTMLAttributes<RootElement> {
  ref?: Ref<M3FabButtonExposed>;
  type?: HTMLButtonElement['type'];
  href?: string;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
}

export interface M3FabButtonExposed extends M3FabButtonMethods, ElementReference<HTMLButtonElement> {}

export interface M3FabButtonMethods extends Interactable {}

export default defineComponent(function M3FabButton({
  ref: _ref,
  type = 'button',
  href = '',
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  children = [],
  onKeyUp = () => {},
  ...attrs
}: M3FabButtonProps, { expose }: ComponentSetupContext<M3FabButtonExposed>) {
  const root = useRef<HTMLButtonElement | null>(null)
  const ripple = useRef<M3RippleExposed | null>(null)
  const [rippleTarget, setRippleTarget] = useTarget<HTMLElement>()
  const interactable = useInteractable(root)

  expose(interactable)

  useElementEffect(root, setRippleTarget)

  const content = normalize(children)

  const hasText = content.some(([, isIcon]) => !isIcon)
  const [, hasLeadingIcon] = content[0] ?? [null, false]
  const [, hasTrailingIcon] = content[content.length - 1] ?? [null, false]

  return (
    <button
      ref={root}
      type={type}
      disabled={disabled}
      className={toClassName({
        [className]: className.length > 0,
        ['m3-fab-button']: true,
        ['m3-fab-button_' + variant]: variant !== 'primary',
        ['m3-fab-button_' + size]: size !== 'md',
        ['m3-fab-button_has-leading-icon']: hasText && hasLeadingIcon,
        ['m3-fab-button_has-trailing-icon']: hasText && hasTrailingIcon,
      })}
      {...attrs}
      onKeyUp={compose(event => {
        if (event.code === 'Enter') {
          ripple.current?.activate(event.nativeEvent)
        }
      }, onKeyUp)}
    >
      <M3Ripple ref={ripple} owner={rippleTarget}/>
      <span className="m3-fab-button__state" />
      <span className="m3-fab-button__content">
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
})
