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

import IconCheckmark from './assets/checkmark.svg?react'
import IconIndeterminate from './assets/indeterminate.svg?react'

export interface M3CheckboxProps<Model = boolean, Value = unknown>
  extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  id?: string;
  model?: Model;
  value?: Value;
  indeterminate?: boolean;
  invalid?: boolean;
  disabled?: boolean;
  trueValue?: Model;
  falseValue?: Model;
  equalsFn?: (a: unknown, b: unknown) => boolean;
  onChange?: (value: Model) => void;
}

export interface M3CheckboxMethods extends Clickable, Focusable {}

const isArray = Array.isArray

type M3CheckboxComponent = <Model = boolean, Value = unknown>(
  props: M3CheckboxProps<Model, Value> & RefAttributes<M3CheckboxMethods>
) => ReactElement | null

const M3Checkbox = <Model, Value>({
  id,
  model,
  value,
  indeterminate = false,
  invalid = false,
  disabled = false,
  trueValue = true as Model,
  falseValue = false as Model,
  equalsFn = (a: unknown, b: unknown): boolean => a === b,
  className = '',
  onChange = (_: Model) => {},
  ...args
}: M3CheckboxProps<Model, Value>, ref: ForwardedRef<M3CheckboxMethods>) => {
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

  const contains = useCallback((array: unknown[], value: unknown) => {
    return array.some(v => equalsFn(v, value))
  }, [equalsFn])

  const checked = useMemo(() => {
    return isArray(model) ? contains(model, value) : equalsFn(model, trueValue)
  }, [model, value, trueValue])

  const calculate = useCallback((checked: boolean): Model => {
    if (isArray(model)) {
      return (checked
        ? (contains(model, value) ? model : [...model, value])
        : [...model].filter(v => !equalsFn(v, value))) as Model
    }

    return checked ? trueValue : falseValue
  }, [model, contains, checked, trueValue, falseValue])

  return (
    <span
      ref={root}
      className={toClassName([className, {
        'm3-checkbox': true,
        'm3-checkbox_checked': checked,
        'm3-checkbox_indeterminate': indeterminate,
        'm3-checkbox_invalid': invalid,
        'm3-checkbox_disabled': disabled,
      }])}
      {...args}
    >
      <M3Ripple ref={ripple} owner={rippleTarget} />

      <input
        id={useId(id, 'm3-checkbox')}
        type="checkbox"
        aria-checked={checked}
        aria-invalid={invalid}
        aria-disabled={disabled}
        className="m3-checkbox__input"
        checked={checked}
        disabled={disabled}
        onChange={() => onChange(calculate(!checked))}
      />

      <span aria-hidden={true} className="m3-checkbox__state" />
      <span aria-hidden={true} className="m3-checkbox__checkmark">
        {indeterminate
          ? <IconIndeterminate />
          : checked
            ? <IconCheckmark />
            : null
        }
      </span>
    </span>
  )
}

export default forwardRef(M3Checkbox) as M3CheckboxComponent
