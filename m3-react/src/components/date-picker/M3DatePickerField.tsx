import type {
  CalendarAvailability,
  CalendarYearRange,
} from '@modulify/m3-foundation/lib/calendar'
import type { ComponentSetupContext } from '@/utils/component'
import type { CssClass } from '@/utils/styling'
import type { ElementReference } from '@modulify/m3-foundation/types/dom'
import type { M3TextFieldProps } from '@/components/text-field'
import type { Placement } from '@floating-ui/dom'
import type { ReactNode, Ref } from 'react'

import {
  CalendarDay,
  clampCalendarDay,
  DEFAULT_CALENDAR_DATE_INPUT_FORMAT,
  formatCalendarDateInput,
  getCalendarBounds,
  isCalendarDaySelectable,
  parseCalendarDateInput,
} from '@modulify/m3-foundation/lib/calendar'
import { useEffect, useState } from 'react'

import { M3Button } from '@/components/button'
import { M3Icon } from '@/components/icon'
import { M3IconButton } from '@/components/icon-button'
import { M3Popper } from '@/components/popper'
import { M3TextField } from '@/components/text-field'

import defineComponent from '@/utils/component'
import { toClassName } from '@/utils/styling'

import M3DatePicker from './M3DatePicker'

type TextFieldProps = Omit<
  M3TextFieldProps,
  | 'children'
  | 'lazy'
  | 'multiline'
  | 'onChange'
  | 'onInput'
  | 'onUpdate'
  | 'ref'
  | 'type'
  | 'value'
>

export interface M3DatePickerFieldProps extends TextFieldProps {
  ref?: Ref<M3DatePickerFieldExposed>;
  value?: Date | null;
  min?: Date | null;
  max?: Date | null;
  yearRange?: CalendarYearRange;
  availability?: CalendarAvailability | null;
  locale?: string;
  firstDayOfWeek?: number;
  supportingText?: ReactNode;
  cancelText?: string;
  confirmText?: string;
  placement?: Placement;
  popperClassName?: CssClass;
  onChange?: (value: Date | null) => void;
}

export interface M3DatePickerFieldExposed extends ElementReference<HTMLDivElement> {}

export default defineComponent(function M3DatePickerField({
  ref: _ref,
  value = null,
  min = null,
  max = null,
  yearRange,
  availability = null,
  locale = 'en-US',
  firstDayOfWeek = 0,
  label = 'Select date',
  placeholder = DEFAULT_CALENDAR_DATE_INPUT_FORMAT,
  supportingText = DEFAULT_CALENDAR_DATE_INPUT_FORMAT,
  cancelText = 'Cancel',
  confirmText = 'OK',
  invalid = false,
  disabled = false,
  readonly = false,
  outlined = true,
  placement = 'bottom-start',
  popperClassName = '',
  className = '',
  onChange = () => {},
  ...fieldProps
}: M3DatePickerFieldProps, { expose }: ComponentSetupContext<M3DatePickerFieldExposed>) {
  const [root, setRoot] = useState<HTMLDivElement | null>(null)
  const [expanded, setExpanded] = useState(false)
  const [draftValue, setDraftValue] = useState(value)
  const [inputValue, setInputValue] = useState(() => formatCalendarDateInput(value))
  const [inputInvalid, setInputInvalid] = useState(false)

  expose({
    get el () { return root },
  })

  useEffect(() => {
    setInputValue(formatCalendarDateInput(value))
    setInputInvalid(false)
    setDraftValue(value)
  }, [value])

  const commitInput = (rawValue: string) => {
    const nextValue = rawValue.trim()

    if (nextValue.length === 0) {
      setInputInvalid(false)
      setInputValue('')
      onChange(null)
      return
    }

    const day = parseCalendarDateInput(nextValue)
    const bounds = getCalendarBounds(
      yearRange,
      min ? new CalendarDay(min) : null,
      max ? new CalendarDay(max) : null
    )
    const clamped = clampCalendarDay(day, bounds)

    if (day === null || clamped === null || !clamped.inSameDay(day) || !isCalendarDaySelectable(day, availability)) {
      setInputInvalid(true)
      return
    }

    setInputInvalid(false)
    setInputValue(formatCalendarDateInput(day))
    onChange(day.date)
  }

  const selectDate = (date: Date) => {
    setInputInvalid(false)
    setDraftValue(date)
  }

  const toggleExpanded = (nextExpanded: boolean) => {
    if (nextExpanded && !expanded) {
      setDraftValue(value)
    }

    setExpanded(nextExpanded)
  }

  const cancel = () => {
    setDraftValue(value)
    setExpanded(false)
  }

  const confirm = () => {
    if (draftValue === null) {
      return
    }

    setInputInvalid(false)
    setInputValue(formatCalendarDateInput(draftValue))
    setExpanded(false)
    onChange(draftValue)
  }

  const interactive = !disabled && !readonly

  return (
    <div
      ref={setRoot}
      className={toClassName(['m3-date-picker-field', className, {
        'm3-date-picker-field_expanded': expanded,
      }])}
    >
      <M3TextField
        {...fieldProps}
        value={inputValue}
        label={label}
        placeholder={placeholder}
        disabled={disabled}
        readonly={readonly}
        outlined={outlined}
        invalid={invalid || inputInvalid}
        onClick={() => interactive && toggleExpanded(true)}
        onInput={setInputValue}
        onChange={commitInput}
      >
        <M3TextField.TrailingIcon>
          <M3IconButton
            aria-label="Choose date"
            disabled={!interactive}
            onClick={(event) => {
              event.stopPropagation()
              toggleExpanded(!expanded)
            }}
          >
            <M3Icon name="calendar_month" />
          </M3IconButton>
        </M3TextField.TrailingIcon>
      </M3TextField>

      <div className="m3-date-picker-field__supporting-text">
        {supportingText}
      </div>

      <M3Popper
        shown={expanded}
        target={root}
        targetTriggers={[]}
        placement={placement}
        offsetMainAxis={8}
        animated={true}
        hideOnMissClick={true}
        disabled={!interactive}
        className={toClassName(['m3-date-picker-field__popper', popperClassName])}
        onToggle={toggleExpanded}
      >
        <M3DatePicker
          value={draftValue}
          min={min}
          max={max}
          yearRange={yearRange}
          availability={availability}
          locale={locale}
          firstDayOfWeek={firstDayOfWeek}
          label={label}
          layout="docked"
          navigation="split"
          onChange={selectDate}
        >
          <M3DatePicker.Footer>
            <M3Button appearance="text" onClick={cancel}>
              {cancelText}
            </M3Button>
            <M3Button appearance="text" disabled={draftValue === null} onClick={confirm}>
              {confirmText}
            </M3Button>
          </M3DatePicker.Footer>
        </M3DatePicker>
      </M3Popper>
    </div>
  )
})
