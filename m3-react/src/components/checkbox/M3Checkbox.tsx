import type { Focusable } from '~types/dom'
import type { M3RippleMethods } from '@/components/ripple'

import IconCheckmark from '@modulify/m3-foundation/assets/sprites/checkbox/checkmark.svg?react'
import IconIndeterminate from '@modulify/m3-foundation/assets/sprites/checkbox/indeterminate.svg?react'

import { M3Ripple } from '@/components/ripple'

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'

import makeId from '@/utils/id'
import { toClassName } from '@/utils/styling'

export interface M3CheckboxProps extends React.HTMLAttributes<HTMLElement> {
  id?: string;
  model?: unknown;
  value?: unknown;
  indeterminate?: boolean;
  invalid?: boolean;
  disabled?: boolean;
  trueValue?: unknown;
  falseValue?: unknown;
  equalsFn?: (a: unknown, b: unknown) => boolean;
  onChange?: (value: unknown) => void;
}

export interface M3CheckboxMethods extends Focusable {
  click (): void;
}

const isArray = Array.isArray

const M3Checkbox: React.ForwardRefRenderFunction<
  M3CheckboxMethods,
  M3CheckboxProps
> = ({
  id= makeId('m3-checkbox'),
  model,
  value,
  indeterminate = false,
  invalid = false,
  disabled = false,
  trueValue = true,
  falseValue = false,
  equalsFn = (a: unknown, b: unknown): boolean => a === b,
  className = '',
  onChange = (_: unknown) => {},
  ...args
}, ref) => {
  const root = useRef<HTMLElement | null>(null)
  const input = useRef<HTMLInputElement | null>(null)
  const ripple = useRef<M3RippleMethods | null>(null)

  useImperativeHandle(ref, () => ({
    click: () => input.current?.click(),
    focus: () => input.current?.focus(),
    blur: () => input.current?.blur(),
  }))

  const [checked, setChecked] = useState(false)

  const contains = (array: unknown[], value: unknown) => array.some(v => equalsFn(v, value))
  const calculate = (checked: boolean) => {
    if (isArray(model)) {
      return checked
        ? (contains(model, value) ? model : [...model, value])
        : [...model].filter(v => !equalsFn(v, value))
    }

    return checked ? trueValue : falseValue
  }

  useEffect(() => setChecked(
    isArray(model) ? contains(model, value) : equalsFn(model, trueValue)
  ), [model, value, trueValue])

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
      <M3Ripple ref={ripple} owner={root} />

      <input
        id={id}
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

export default forwardRef(M3Checkbox)
