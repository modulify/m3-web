import type {
  ForwardRefRenderFunction,
  HTMLAttributes,
} from 'react'

import type { Appearance } from '@modulify/m3-foundation/types/components/icon-button'
import type {
  Clickable,
  Focusable,
} from '@modulify/m3-foundation'

import type { M3RippleMethods } from '@/components/ripple'

import { M3IconAppearance } from '@/components/icon'
import { M3Ripple } from '@/components/ripple'

import {
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react'

import { compose } from '@/utils/events'
import { toClassName } from '@/utils/styling'

export interface M3IconButtonProps extends HTMLAttributes<HTMLButtonElement> {
  type?: HTMLButtonElement['type'];
  appearance?: Appearance;
  toggleable?: boolean;
  selected?: boolean;
  disabled?: boolean;
}

export interface M3IconButtonMethods extends Clickable, Focusable {}

const M3IconButton: ForwardRefRenderFunction<
  M3IconButtonMethods,
  M3IconButtonProps
> = ({
  type = 'button',
  appearance = 'standard',
  toggleable = false,
  selected = false,
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
          ripple.current?.activate(event)
        }
      }, onKeyUp)}
      {...attrs}
    >
      <M3Ripple ref={ripple} owner={root}/>
      <span className="m3-icon-button__state">
        <M3IconAppearance.Provider value={toggleable && selected ? 'filled' : 'outlined'}>
          {children}
        </M3IconAppearance.Provider>
      </span>
    </button>
  )
}

export default forwardRef(M3IconButton)