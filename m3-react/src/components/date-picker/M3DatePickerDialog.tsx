import type { CSSProperties, FC } from 'react'
import type { M3DatePickerRangeProps, M3DatePickerSingleProps } from './M3DatePicker'

import {
  CalendarDay,
  clampCalendarDay,
  DEFAULT_CALENDAR_DATE_INPUT_FORMAT,
  formatCalendarDateInput,
  getCalendarBounds,
  isCalendarDaySelectable,
  parseCalendarDateInput,
} from '@modulify/m3-foundation/lib/calendar'
import { useEffect, useMemo, useState } from 'react'

import { M3Button } from '@/components/button'
import { M3Dialog } from '@/components/dialog'
import { M3Icon } from '@/components/icon'
import { M3IconButton } from '@/components/icon-button'
import { M3TextField } from '@/components/text-field'

import { toClassName } from '@/utils/styling'

import M3DatePicker from './M3DatePicker'

export type M3DatePickerDialogAppearance = 'picker' | 'input'

type DatePickerDialogBaseProps = {
  appearance?: M3DatePickerDialogAppearance;
  opened?: boolean;
  switchable?: boolean;
  cancelText?: string;
  confirmText?: string;
  onAppearanceChange?: (appearance: M3DatePickerDialogAppearance) => void;
  onToggle?: (opened: boolean) => void;
}

export interface M3DatePickerDialogSingleProps extends Omit<M3DatePickerSingleProps, 'headerAction' | 'onChange'>, DatePickerDialogBaseProps {
  type?: 'single';
  onChange?: (value: Date) => void;
}

export interface M3DatePickerDialogRangeProps extends Omit<M3DatePickerRangeProps, 'headerAction' | 'onChange'>, DatePickerDialogBaseProps {
  type: 'range';
  onChange?: (value: [Date | null, Date | null]) => void;
}

export type M3DatePickerDialogProps = M3DatePickerDialogSingleProps | M3DatePickerDialogRangeProps

const cloneDate = (value: Date | null): Date | null => value ? new Date(value) : null

const cloneValue = (value: Date | null | [Date | null, Date | null]): Date | null | [Date | null, Date | null] => Array.isArray(value)
  ? [cloneDate(value[0]), cloneDate(value[1])]
  : cloneDate(value)

const valueKey = (value: Date | null | [Date | null, Date | null]): string => Array.isArray(value)
  ? value.map(item => item?.getTime() ?? 'null').join(':')
  : String(value?.getTime() ?? 'null')

const toInputRangeValue = (value: Date | null | [Date | null, Date | null]): [string, string] => Array.isArray(value)
  ? [formatCalendarDateInput(value[0]), formatCalendarDateInput(value[1])]
  : ['', '']

const M3DatePickerDialog: FC<M3DatePickerDialogProps> = (props) => {
  const {
    appearance: appearanceProp,
    opened = false,
    switchable = true,
    cancelText = 'Cancel',
    confirmText = 'OK',
    className = '',
    style,
    onAppearanceChange = () => {},
    onToggle = () => {},
  } = props
  const type = props.type ?? 'single'
  const [draftValue, setDraftValue] = useState<Date | null | [Date | null, Date | null]>(() => cloneValue(props.value ?? null))
  const [appearanceInternal, setAppearanceInternal] = useState<M3DatePickerDialogAppearance>(() => appearanceProp ?? 'picker')
  const [singleInputValue, setSingleInputValue] = useState(() => formatCalendarDateInput(props.value instanceof Date ? props.value : null))
  const [singleInputInvalid, setSingleInputInvalid] = useState(false)
  const [rangeInputValue, setRangeInputValue] = useState<[string, string]>(() => toInputRangeValue(props.value ?? null))
  const [rangeInputInvalid, setRangeInputInvalid] = useState<[boolean, boolean]>([false, false])
  const sourceValueKey = valueKey(props.value ?? null)
  const minDay = useMemo(() => props.min ? new CalendarDay(props.min) : null, [props.min])
  const maxDay = useMemo(() => props.max ? new CalendarDay(props.max) : null, [props.max])
  const bounds = useMemo(
    () => getCalendarBounds(props.yearRange, minDay, maxDay),
    [props.yearRange?.[0], props.yearRange?.[1], minDay?.timestamp, maxDay?.timestamp]
  )
  const appearance = appearanceInternal

  useEffect(() => {
    if (appearanceProp !== undefined) {
      setAppearanceInternal(appearanceProp)
    }
  }, [appearanceProp])

  useEffect(() => {
    if (opened) {
      syncDraftValue(cloneValue(props.value ?? null))
    }
  }, [
    opened,
    sourceValueKey,
  ])

  const isDateAvailable = (day: CalendarDay): boolean => (
    clampCalendarDay(day, bounds)?.inSameDay(day) ?? false
  ) && isCalendarDaySelectable(day, props.availability)

  const parseInputValue = (value: string): {
    invalid: boolean;
    date: Date | null;
  } => {
    if (!value.trim()) {
      return {
        invalid: false,
        date: null,
      }
    }

    const day = parseCalendarDateInput(value)

    if (!day || !isDateAvailable(day)) {
      return {
        invalid: true,
        date: null,
      }
    }

    return {
      invalid: false,
      date: day.date,
    }
  }

  function syncDraftValue(value: Date | null | [Date | null, Date | null]) {
    setDraftValue(value)
    setSingleInputValue(value instanceof Date ? formatCalendarDateInput(value) : '')
    setSingleInputInvalid(false)
    setRangeInputValue(toInputRangeValue(value))
    setRangeInputInvalid([false, false])
  }

  const resetDraftValue = () => {
    syncDraftValue(cloneValue(props.value ?? null))
  }

  const close = () => {
    resetDraftValue()
    onToggle(false)
  }

  const setAppearance = (value: M3DatePickerDialogAppearance) => {
    setAppearanceInternal(value)
    onAppearanceChange(value)
  }

  const setSingleInput = (value: string) => {
    const result = parseInputValue(value)

    setSingleInputValue(value)
    setSingleInputInvalid(result.invalid)

    if (!result.invalid) {
      setDraftValue(result.date)
    }
  }

  const setRangeInput = (index: 0 | 1, value: string) => {
    const result = parseInputValue(value)
    const nextInputValue: [string, string] = [...rangeInputValue]
    const nextInvalid: [boolean, boolean] = [...rangeInputInvalid]
    const currentRange: [Date | null, Date | null] = Array.isArray(draftValue)
      ? [draftValue[0], draftValue[1]]
      : [null, null]

    nextInputValue[index] = value
    nextInvalid[index] = result.invalid

    setRangeInputValue(nextInputValue)
    setRangeInputInvalid(nextInvalid)

    if (!result.invalid) {
      currentRange[index] = result.date
      setDraftValue(currentRange)
    }
  }

  const rangeOrderInvalid = Array.isArray(draftValue) &&
    draftValue[0] instanceof Date &&
    draftValue[1] instanceof Date &&
    draftValue[0].getTime() > draftValue[1].getTime()

  const inputInvalid = type === 'range'
    ? rangeInputInvalid[0] || rangeInputInvalid[1] || rangeOrderInvalid
    : singleInputInvalid

  const confirm = () => {
    if (inputInvalid) {
      return
    }

    if (type === 'range') {
      if (!Array.isArray(draftValue)) {
        return
      }

      const onChange = props.onChange as M3DatePickerDialogRangeProps['onChange']

      onChange?.(cloneValue(draftValue) as [Date | null, Date | null])
      onToggle(false)
      return
    }

    if (!(draftValue instanceof Date)) {
      return
    }

    const onChange = props.onChange as M3DatePickerDialogSingleProps['onChange']

    onChange?.(new Date(draftValue))
    onToggle(false)
  }

  const confirmDisabled = type === 'range'
    ? inputInvalid || !(Array.isArray(draftValue) && draftValue[0] instanceof Date && draftValue[1] instanceof Date)
    : inputInvalid || !(draftValue instanceof Date)

  const dialogStyle: CSSProperties = {
    width: appearance === 'input' ? 328 : 360,
    ...style,
  }

  const commonDatePickerProps = {
    cursor: props.cursor,
    min: props.min,
    max: props.max,
    yearRange: props.yearRange,
    availability: props.availability,
    navigation: props.navigation,
    views: props.views,
    locale: props.locale,
    firstDayOfWeek: props.firstDayOfWeek,
    label: props.label,
    disabled: props.disabled,
    onCursorChange: props.onCursorChange,
  }

  const modeToggle = switchable ? (
    <M3IconButton
      aria-label={appearance === 'picker' ? 'Switch to text input' : 'Switch to calendar input'}
      disabled={props.disabled}
      onClick={() => setAppearance(appearance === 'picker' ? 'input' : 'picker')}
    >
      <M3Icon name={appearance === 'picker' ? 'edit' : 'calendar_today'} />
    </M3IconButton>
  ) : null

  const inputPanel = (
    <section
      className={toClassName([
        'm3-date-picker',
        'm3-date-picker_input',
        `m3-date-picker_input-${type}`,
      ])}
      role="group"
      aria-label={props.label ?? 'Select date'}
    >
      <header className="m3-date-picker__header">
        <div className="m3-date-picker__header-copy">
          <div className="m3-date-picker__label">{props.label ?? 'Select date'}</div>
          <div className="m3-date-picker__headline">
            {type === 'range' ? 'Enter dates' : 'Enter date'}
          </div>
        </div>
        {modeToggle ? (
          <div className="m3-date-picker__header-action">
            {modeToggle}
          </div>
        ) : null}
      </header>

      <div className="m3-date-picker__input-content">
        {type === 'range' ? (
          <div className="m3-date-picker__input-fields">
            <M3TextField
              outlined={true}
              label="Date"
              placeholder={DEFAULT_CALENDAR_DATE_INPUT_FORMAT}
              value={rangeInputValue[0]}
              invalid={rangeInputInvalid[0] || rangeOrderInvalid}
              disabled={props.disabled}
              onUpdate={value => setRangeInput(0, value)}
            />
            <M3TextField
              outlined={true}
              label="End date"
              placeholder={DEFAULT_CALENDAR_DATE_INPUT_FORMAT}
              value={rangeInputValue[1]}
              invalid={rangeInputInvalid[1] || rangeOrderInvalid}
              disabled={props.disabled}
              onUpdate={value => setRangeInput(1, value)}
            />
          </div>
        ) : (
          <M3TextField
            outlined={true}
            label="Date"
            placeholder={DEFAULT_CALENDAR_DATE_INPUT_FORMAT}
            value={singleInputValue}
            invalid={singleInputInvalid}
            disabled={props.disabled}
            onUpdate={setSingleInput}
          />
        )}
      </div>
    </section>
  )

  return (
    <M3Dialog
      opened={opened}
      className={toClassName([
        'm3-date-picker-dialog',
        appearance === 'input' && 'm3-date-picker-dialog_input',
        className,
      ])}
      style={dialogStyle}
      role="dialog"
      aria-modal="true"
      aria-label={props.label ?? 'Select date'}
      onToggle={onToggle}
    >
      {appearance === 'input' ? inputPanel : type === 'range' ? (
        <M3DatePicker
          {...commonDatePickerProps}
          type="range"
          value={Array.isArray(draftValue) ? draftValue : null}
          headerAction={modeToggle}
          onChange={syncDraftValue}
        />
      ) : (
        <M3DatePicker
          {...commonDatePickerProps}
          type="single"
          value={draftValue instanceof Date ? draftValue : null}
          headerAction={modeToggle}
          onChange={syncDraftValue}
        />
      )}

      <M3Dialog.Footer>
        <M3Button appearance="text" onClick={close}>
          {cancelText}
        </M3Button>
        <M3Button appearance="text" disabled={confirmDisabled} onClick={confirm}>
          {confirmText}
        </M3Button>
      </M3Dialog.Footer>
    </M3Dialog>
  )
}

export default M3DatePickerDialog
