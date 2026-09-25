import type { Appearance } from '@modulify/m3-foundation/types/components/icon-button'
import type { ComponentSetupContext } from '@/utils/component'
import type { ElementReference } from '@modulify/m3-foundation/types/dom'
import type { HTMLAttributes } from 'react'
import type { Interactable } from '@modulify/m3-foundation/types/dom'
import type { M3RippleExposed } from '@/components/ripple'
import type { Ref } from 'react'

import { useRef } from 'react'

import { M3IconAppearance } from '@/components/icon'
import { M3Ripple } from '@/components/ripple'

import { compose } from '@/utils/events'
import defineComponent from '@/utils/component'
import { toClassName } from '@/utils/styling'
import { useElementEffect, useInteractable, useTarget } from '@/hooks'

export interface M3IconButtonProps extends HTMLAttributes<HTMLButtonElement> {
  ref?: Ref<M3IconButtonExposed>;
  type?: HTMLButtonElement['type'];
  appearance?: Appearance;
  toggleable?: boolean;
  selected?: boolean;
  disabled?: boolean;
}

export interface M3IconButtonExposed extends M3IconButtonMethods, ElementReference<HTMLButtonElement> {}

export interface M3IconButtonMethods extends Interactable {}

export default defineComponent(function M3IconButton({
  ref: _ref,
  type = 'button',
  appearance = 'standard',
  toggleable = false,
  selected = false,
  disabled = false,
  className = '',
  children = [],
  onKeyUp = () => {},
  ...attrs
}: M3IconButtonProps, { expose }: ComponentSetupContext<M3IconButtonExposed>) {
  const root = useRef<HTMLButtonElement | null>(null)
  const ripple = useRef<M3RippleExposed | null>(null)
  const [rippleTarget, setRippleTarget] = useTarget<HTMLButtonElement>()
  const interactable = useInteractable(root)

  expose(interactable)

  useElementEffect(root, setRippleTarget)

  return (
    <button
      ref={root}
      type={type}
      className={toClassName([className, {
        ['m3-icon-button']: true,
        ['m3-icon-button_' + appearance]: true,
        ['m3-icon-button_toggleable']: toggleable,
        ['m3-icon-button_selected']: toggleable && selected,
      }])}
      disabled={disabled}
      onKeyUp={compose(event => {
        if (event.code === 'Enter') {
          ripple.current?.activate(event.nativeEvent)
        }
      }, onKeyUp)}
      {...attrs}
    >
      <M3Ripple ref={ripple} owner={rippleTarget} />
      <span className="m3-icon-button__state" />
      <span className="m3-icon-button__content">
        <M3IconAppearance.Provider value={toggleable && selected ? 'filled' : 'outlined'}>
          {children}
        </M3IconAppearance.Provider>
      </span>
    </button>
  )
})
