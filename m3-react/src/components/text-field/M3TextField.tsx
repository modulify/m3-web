import type { ComponentSetupContext } from '@/utils/component'
import type { ElementReference, Focusable } from '@modulify/m3-foundation/types/dom'
import type { FormEvent, HTMLAttributes, Ref } from 'react'

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { compose } from '@/utils/events'
import defineComponent from '@/utils/component'
import { defineSlot, distinct } from '@/utils/content'
import { toClassName } from '@/utils/styling'
import { useFocusable, useId } from '@/hooks'

type TextFieldType =
  | 'email'
  | 'number'
  | 'password'
  | 'search'
  | 'tel'
  | 'text'
  | 'url'

type RootAttrs = Omit<HTMLAttributes<HTMLElement>, 'onInput' | 'onChange'>

export interface M3TextFieldProps extends RootAttrs {
  ref?: Ref<M3TextFieldExposed>;
  id?: string;
  name?: string;
  type?: TextFieldType;
  value?: string | number;
  label?: string;
  placeholder?: string;
  lazy?: boolean;
  multiline?: boolean;
  invalid?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  outlined?: boolean;
  onInput?: (value: string) => void;
  onChange?: (value: string) => void;
  onUpdate?: (value: string) => void;
}

export interface M3TextFieldExposed extends M3TextFieldMethods, ElementReference<HTMLDivElement> {}

export interface M3TextFieldMethods extends Focusable {}

const Label = defineSlot('M3TextField.Label')
const LeadingIcon = defineSlot('M3TextField.LeadingIcon')
const TrailingIcon = defineSlot('M3TextField.TrailingIcon')

export default defineComponent(function M3TextField({
  ref: _ref,
  id,
  name,
  type = 'text',
  value = '',
  label = '',
  placeholder = '',
  lazy = false,
  multiline = false,
  invalid = false,
  disabled = false,
  readonly = false,
  outlined = false,
  className = '',
  children = [],
  onInput = (_: string) => {},
  onChange = (_: string) => {},
  onUpdate = (_: string) => {},
  onClick = () => {},
  ...attrs
}: M3TextFieldProps, { expose }: ComponentSetupContext<M3TextFieldExposed>) {
  const [focused, setFocused] = useState(false)

  const _id = useId(id, 'm3-text-field')
  const _type = type === 'number' ? 'text' : type

  const root = useRef<HTMLDivElement | null>(null)
  const input = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null)
  const focusable = useFocusable(root, input)
  const setTextAreaRef = (el: HTMLTextAreaElement | null) => {
    input.current = el
  }
  const setInputRef = (el: HTMLInputElement | null) => {
    input.current = el
  }

  const [slots] = useMemo(() => distinct(children, {
    label: Label,
    leadingIcon: LeadingIcon,
    trailingIcon: TrailingIcon,
  }), [children])

  const hasLabel = !!slots.label || label.length > 0

  const focus = () => input.current?.focus()

  expose(focusable)

  useEffect(() => {
    const el = input.current

    if (el) {
      const actual = String(value)

      if (actual.length > 0) {
        el.value = actual
      } else if (el.value.length) {
        onUpdate(el.value)
      }
    }
  }, [])

  const aria = !('aria-label' in attrs) && !('aria-labelledby' in attrs) && hasLabel
    ? { 'aria-labelledby': _id + '-label' }
    : {}

  const handleInput = (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const rawValue = event.currentTarget.value

    onInput(rawValue)

    if (!lazy) {
      onUpdate(rawValue)
    }
  }

  const handleChange = (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const rawValue = event.currentTarget.value

    onChange(rawValue)

    if (lazy) {
      onUpdate(rawValue)
    }
  }

  return (
    <div
      ref={root}
      className={toClassName([className, {
        'm3-text-field': true,
        'm3-text-field_outlined': outlined,
        'm3-text-field_multiline': multiline,
        'm3-text-field_has-leading': !!slots.leadingIcon,
        'm3-text-field_has-trailing': !!slots.trailingIcon,
        'm3-text-field_filled': String(value).length > 0,
        'm3-text-field_focused': focused,
        'm3-text-field_invalid': invalid,
        'm3-text-field_disabled': disabled,
        'm3-text-field_readonly': readonly,
      }])}
      role="grid"
      {...{
        ...aria,
        ...attrs,
      }}
      onClick={compose(focus, onClick)}
    >
      {outlined ? (
        <div className="m3-text-field__outline">
          <div className="m3-text-field__outline-leading" />
          <div className="m3-text-field__outline-notch">
            {hasLabel ? (
              <label
                id={_id + '-label'}
                htmlFor={_id}
                className="m3-text-field__label"
              >
                {slots.label ?? label}
              </label>
            ) : null}
          </div>
          <div className="m3-text-field__outline-trailing" />
        </div>
      ) : hasLabel ? (
        <label
          id={_id + '-label'}
          htmlFor={_id}
          className="m3-text-field__label"
        >
          {slots.label ?? label}
        </label>
      ) : null}

      <div className="m3-text-field__content">
        {slots.leadingIcon ? (
          <div
            className="m3-text-field__icon"
            onClick={event => event.stopPropagation()}
          >
            {slots.leadingIcon}
          </div>
        ) : null}

        {multiline ? (
          <textarea
            ref={setTextAreaRef}
            id={_id}
            name={name}
            aria-invalid={invalid}
            value={value}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readonly}
            onInput={handleInput}
            onChange={handleChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
        ) : (
          <input
            ref={setInputRef}
            id={_id}
            name={name}
            aria-invalid={invalid}
            type={_type}
            value={value}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readonly}
            onInput={handleInput}
            onChange={handleChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
        )}

        {slots.trailingIcon ? (
          <div
            className="m3-text-field__icon"
            onClick={event => event.stopPropagation()}
          >
            {slots.trailingIcon}
          </div>
        ) : null}
      </div>

      {outlined ? null : <div className="m3-text-field__underline" />}
    </div>
  )
}, {
  slots: { Label, LeadingIcon, TrailingIcon },
})
