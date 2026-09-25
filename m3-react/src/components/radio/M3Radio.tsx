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

export interface M3RadioProps<Value = boolean>
  extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  ref?: Ref<M3RadioExposed>;
  id?: string;
  name?: string;
  model?: Value;
  value?: Value;
  invalid?: boolean;
  disabled?: boolean;
  equalsFn?: (a: Value | undefined, b: Value) => boolean;
  onChange?: (value: Value) => void;
}

export interface M3RadioExposed extends M3RadioMethods, ElementReference<HTMLElement> {}

export interface M3RadioMethods extends Interactable {}

export default defineComponent(function M3Radio<Value = boolean>({
  ref: _ref,
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
}: M3RadioProps<Value>, context?: ComponentSetupContext<M3RadioExposed>) {
  const { expose } = requireComponentSetupContext(context)
  const root = useRef<HTMLElement | null>(null)
  const input = useRef<HTMLInputElement | null>(null)
  const ripple = useRef<M3RippleExposed | null>(null)
  const [rippleTarget, setRippleTarget] = useTarget<HTMLElement>()
  const interactable = useInteractable(root, input)

  expose(interactable)

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
}, { generic: true })
