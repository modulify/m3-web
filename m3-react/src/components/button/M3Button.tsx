import type { Appearance } from '@modulify/m3-foundation/types/components/button'
import type { ComponentSetupContext } from '@/utils/component'
import type { ElementEffect } from '@/hooks/useElementEffect'
import type { ElementReference } from '@modulify/m3-foundation/types/dom'
import type { HTMLAttributes } from 'react'
import type { Interactable } from '@modulify/m3-foundation/types/dom'
import type { M3RippleExposed } from '@/components/ripple'
import type { Ref } from 'react'
import type {
  Rounding,
  Size,
  Width,
} from '@modulify/m3-foundation/types/components/button'

import { useMemo, useRef } from 'react'

import { M3IconAppearance } from '@/components/icon'
import { M3Ripple } from '@/components/ripple'
import { useM3ButtonSize } from '@/components/button/M3ButtonSize'

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
  size?: Size;
  rounding?: Rounding;
  /** Use auto for content width; other values select compact, fixed width geometry. */
  width?: Width;
  toggleable?: boolean;
  selected?: boolean;
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
  size,
  rounding = 'round',
  width = 'auto',
  toggleable = false,
  selected = false,
  disabled = false,
  effects = [],
  className = '',
  children = [],
  onKeyUp = () => {},
  ...attrs
}: M3ButtonProps, { expose }: ComponentSetupContext<M3ButtonExposed>) {
  const root = useRef<HTMLButtonElement | null>(null)
  const ripple = useRef<M3RippleExposed | null>(null)
  const sizeInherited = useM3ButtonSize()
  const sizeActual = size ?? sizeInherited ?? 'sm'

  const [rippleTarget, setRippleTarget] = useTarget<HTMLButtonElement>()
  const interactable = useInteractable(root)

  expose(interactable)

  useElementEffect(root, effects)
  useElementEffect(root, setRippleTarget)

  const content = useMemo(() => normalize(children), [children])

  const hasText = useMemo(() => content.some(([, isIcon]) => !isIcon), [content])
  const [, hasLeadingIcon] = content[0] ?? [null, false]
  const [, hasTrailingIcon] = content[content.length - 1] ?? [null, false]
  const fixed = width !== 'auto'
  const toggle = toggleable && appearance !== 'text'
  return (
    <button
      ref={root}
      type={type}
      disabled={disabled}
      className={toClassName([className, {
        ['m3-button']: true,
        ['m3-button_' + appearance]: true,
        ['m3-button_' + sizeActual]: sizeActual !== 'sm',
        'm3-button_fixed': fixed,
        ['m3-button_' + width]: fixed && width !== 'medium',
        ['m3-button_square']: rounding === 'square',
        ['m3-button_toggleable']: toggle,
        ['m3-button_selected']: toggle && selected,
        ['m3-button_has-leading-icon']: hasText && hasLeadingIcon,
        ['m3-button_has-trailing-icon']: hasText && hasTrailingIcon,
      }])}
      aria-pressed={toggle ? selected : undefined}
      {...attrs}
      onKeyUp={compose(event => {
        if (event.code === 'Enter') {
          ripple.current?.activate(event.nativeEvent)
        }
      }, onKeyUp)}
    >
      <span className="m3-button__ripple"><M3Ripple ref={ripple} owner={rippleTarget} /></span>
      <span className="m3-button__state" />
      <span className="m3-button__content">
        <M3IconAppearance.Provider value={fixed ? (!toggle || selected ? 'filled' : 'outlined') : (toggle && selected ? 'filled' : 'outlined')}>
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
        </M3IconAppearance.Provider>
      </span>
    </button>
  )
})
