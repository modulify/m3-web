import type {
  FC,
  FormEvent,
  ForwardRefRenderFunction,
  HTMLAttributes,
  ReactNode,
} from 'react'

import type { Focusable } from '@modulify/m3-foundation'

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'

import {
  useId,
} from '@/hooks'

import { compose } from '@/utils/events'
import {
  defineSlot,
  distinct,
} from '@/utils/content'
import { toClassName } from '@/utils/styling'

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
  id?: string;
  type?: TextFieldType;
  name?: string;
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

export interface M3TextFieldMethods extends Focusable {}

const Label: FC<{ children: ReactNode }> = defineSlot('M3TextField.Label', props => <>{props.children}</>)
const LeadingIcon: FC<{ children: ReactNode }> = defineSlot('M3TextField.LeadingIcon', props => <>{props.children}</>)
const TrailingIcon: FC<{ children: ReactNode }> = defineSlot('M3TextField.TrailingIcon', props => <>{props.children}</>)

const M3TextField: ForwardRefRenderFunction<
  M3TextFieldMethods,
  M3TextFieldProps
> = ({
  id,
  type = 'text',
  name,
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
}, ref) => {
  const [focused, setFocused] = useState(false)

  const _id = useId(id, 'm3-text-field')
  const _type = type === 'number' ? 'text' : type

  const input = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null)
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

  useImperativeHandle(ref, () => ({
    focus,
    blur: () => input.current?.blur(),
  }))

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
      role="grid"
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
      onClick={compose(focus, onClick)}
      {...{
        ...aria,
        ...attrs,
      }}
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
            id={_id}
            ref={setTextAreaRef}
            name={name}
            value={value}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readonly}
            aria-invalid={invalid}
            onInput={handleInput}
            onChange={handleChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
        ) : (
          <input
            id={_id}
            ref={setInputRef}
            type={_type}
            name={name}
            value={value}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readonly}
            aria-invalid={invalid}
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
}

export default Object.assign(forwardRef(M3TextField), {
  Label,
  LeadingIcon,
  TrailingIcon,
})
