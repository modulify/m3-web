import type { Appearance } from '~types/components/icon-button'
import type { Focusable } from '~types/dom'

import type { M3RippleMethods } from '@/components/ripple'

import { M3IconAppearance } from '@/components/icon'
import { M3Ripple } from '@/components/ripple'

import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react'

import { compose } from '@/utils/events'
import { toClassName } from '@/utils/styling'

export interface M3IconButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  type?: HTMLButtonElement['type'];
  appearance?: Appearance;
  toggleable?: boolean;
  selected?: boolean;
  disabled?: boolean;
}

export interface M3IconButtonMethods extends Focusable {}

const M3IconButton: React.ForwardRefRenderFunction<
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