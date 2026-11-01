import type { ComponentSetupContext } from '@/utils/component'
import type { ElementReference } from '@modulify/m3-foundation/types/dom'
import type { HTMLAttributes } from 'react'
import type { Interactable } from '@modulify/m3-foundation/types/dom'
import type { Ref } from 'react'

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react'

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
  name?: string;
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

export interface M3CheckboxExposed extends M3CheckboxMethods, ElementReference {}

export interface M3CheckboxMethods extends Interactable {}

const isArray = Array.isArray

export default defineComponent(function M3Checkbox<Model = boolean, Value = unknown>({
  ref: _ref,
  id,
  name,
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
  const rippleElement = useRef<HTMLElement | null>(null)
  const [rippleTarget, setRippleTarget] = useTarget<HTMLElement>()
  const [rippleSurface, setRippleSurface] = useTarget<HTMLElement>()
  const interactable = useInteractable(root, input)

  expose(interactable)

  useElementEffect(root, setRippleTarget)
  useElementEffect(rippleElement, setRippleSurface)

  const contains = useCallback((array: unknown[], value: unknown) => {
    return array.some(v => equalsFn(v, value))
  }, [equalsFn])

  const checked = useMemo(() => {
    return isArray(model) ? contains(model, value) : equalsFn(model, trueValue)
  }, [model, value, trueValue, contains, equalsFn])

  useEffect(() => {
    if (input.current) input.current.indeterminate = indeterminate
  }, [indeterminate])

  const calculate = useCallback((checked: boolean): Model => {
    if (isArray(model)) {
      return (checked
        ? (contains(model, value) ? model : [...model, value])
        : [...model].filter(v => !equalsFn(v, value))) as Model
    }

    return checked ? trueValue : falseValue
  }, [model, contains, value, equalsFn, trueValue, falseValue])

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
      <input
        ref={input}
        id={useId(id, 'm3-checkbox')}
        name={name}
        aria-checked={indeterminate ? 'mixed' : checked}
        aria-disabled={disabled}
        aria-invalid={invalid}
        checked={checked}
        disabled={disabled}
        type="checkbox"
        className="m3-checkbox__input"
        onChange={() => !disabled && onChange(calculate(!checked))}
      />

      <span aria-hidden={true} className="m3-checkbox__state" />
      <span ref={rippleElement} aria-hidden={true} className="m3-checkbox__ripple">
        {!disabled && <M3Ripple owner={rippleTarget} surface={rippleSurface} />}
      </span>
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
