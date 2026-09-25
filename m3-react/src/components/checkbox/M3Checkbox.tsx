import type { ComponentSetupContext } from '@/utils/component'
import type { ElementReference } from '@modulify/m3-foundation/types/dom'
import type { HTMLAttributes } from 'react'
import type { Interactable } from '@modulify/m3-foundation/types/dom'
import type { M3RippleExposed } from '@/components/ripple'
import type { Ref } from 'react'

import { useCallback, useMemo, useRef } from 'react'

import { M3Ripple } from '@/components/ripple'

import defineComponent, { requireComponentSetupContext } from '@/utils/component'
import { toClassName } from '@/utils/styling'
import {
  useElementEffect,
  useId,
  useInteractable,
  useTarget,
} from '@/hooks'

import IconCheckmark from './assets/checkmark.svg?react'
import IconIndeterminate from './assets/indeterminate.svg?react'

export interface M3CheckboxProps<Model = boolean, Value = unknown>
  extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  ref?: Ref<M3CheckboxExposed>;
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

export interface M3CheckboxExposed extends M3CheckboxMethods, ElementReference<HTMLElement> {}

export interface M3CheckboxMethods extends Interactable {}

const isArray = Array.isArray

export default defineComponent(function M3Checkbox<Model = boolean, Value = unknown>({
  ref: _ref,
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
}: M3CheckboxProps<Model, Value>, context?: ComponentSetupContext<M3CheckboxExposed>) {
  const { expose } = requireComponentSetupContext(context)
  const root = useRef<HTMLElement | null>(null)
  const input = useRef<HTMLInputElement | null>(null)
  const ripple = useRef<M3RippleExposed | null>(null)
  const [rippleTarget, setRippleTarget] = useTarget<HTMLElement>()
  const interactable = useInteractable(root, input)

  expose(interactable)

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
        ref={input}
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
}, { generic: true })
