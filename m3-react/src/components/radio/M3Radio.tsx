import type {
  ForwardRefRenderFunction,
  HTMLAttributes,
} from 'react'

import type {
  Clickable,
  Focusable,
} from '@modulify/m3-foundation'

import type { M3RippleMethods } from '@/components/ripple'

import { M3Ripple } from '@/components/ripple'

import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react'

import {
  useElementEffect,
  useId,
  useTarget,
} from '@/hooks'

import { toClassName } from '@/utils/styling'

export interface M3RadioProps extends HTMLAttributes<HTMLElement> {
  id?: string;
  name?: string;
  model?: unknown;
  value?: unknown;
  invalid?: boolean;
  disabled?: boolean;
  equalsFn?: (a: unknown, b: unknown) => boolean;
  onChange?: (value: unknown) => void;
}

export interface M3RadioMethods extends Clickable, Focusable {}

const M3Radio: ForwardRefRenderFunction<
  M3RadioMethods,
  M3RadioProps
> = ({
  id,
  name,
  model,
  value = true,
  invalid = false,
  disabled = false,
  equalsFn = (a: unknown, b: unknown): boolean => a === b,
  className = '',
  onChange = (_: unknown) => {},
  ...args
}, ref) => {
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

export default forwardRef(M3Radio)
