import type { Clickable, Focusable } from '@modulify/m3-foundation/types/dom'
import type { ForwardedRef, HTMLAttributes } from 'react'
import type { M3RippleMethods } from '@/components/ripple'
import type { ReactElement, RefAttributes } from 'react'

import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react'

import { M3Ripple } from '@/components/ripple'

import { toClassName } from '@/utils/styling'
import { useElementEffect, useId, useTarget } from '@/hooks'

export interface M3RadioProps<Value = boolean>
  extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  id?: string;
  name?: string;
  model?: Value;
  value?: Value;
  invalid?: boolean;
  disabled?: boolean;
  equalsFn?: (a: Value | undefined, b: Value) => boolean;
  onChange?: (value: Value) => void;
}

export interface M3RadioMethods extends Clickable, Focusable {}

type M3RadioComponent = <Value = boolean>(
  props: M3RadioProps<Value> & RefAttributes<M3RadioMethods>
) => ReactElement | null

const M3Radio = <Value,>({
  id,
  name,
  model,
  value = true as Value,
  invalid = false,
  disabled = false,
  equalsFn = (a: Value | undefined, b: Value): boolean => a === b,
  className = '',
  onChange = (_: Value) => {},
  ...args
}: M3RadioProps<Value>, ref: ForwardedRef<M3RadioMethods>) => {
  const root = useRef<HTMLElement | null>(null)
  const input = useRef<HTMLInputElement | null>(null)
  const ripple = useRef<M3RippleMethods | null>(null)
  const [rippleTarget, setRippleTarget] = useTarget<HTMLElement>()

  useImperativeHandle(ref, () => ({
    click: () => input.current?.click(),
    focus: () => input.current?.focus(),
    blur: () => input.current?.blur(),
  }))

  useElementEffect(root, setRippleTarget)

  const checked = useMemo(() => equalsFn(model, value), [equalsFn, model, value])
  const inputId = useId(id, 'm3-radio')

  const handleChange = useCallback((nextChecked: boolean) => {
    if (nextChecked) {
      onChange(value)
    }
  }, [onChange, value])

  return (
    <span
      ref={root}
      className={toClassName([className, {
        'm3-radio': true,
        'm3-radio_checked': checked,
        'm3-radio_invalid': invalid,
        'm3-radio_disabled': disabled,
      }])}
      {...args}
    >
      <M3Ripple ref={ripple} owner={rippleTarget} />

      <input
        ref={input}
        id={inputId}
        type="radio"
        name={name}
        aria-checked={checked}
        aria-invalid={invalid}
        aria-disabled={disabled}
        className="m3-radio__input"
        checked={checked}
        disabled={disabled}
        onChange={event => handleChange(event.currentTarget.checked)}
      />

      <span aria-hidden={true} className="m3-radio__state" />
      <span aria-hidden={true} className="m3-radio__icon" />
    </span>
  )
}

export default forwardRef(M3Radio) as M3RadioComponent
