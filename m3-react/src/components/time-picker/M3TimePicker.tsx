import type { CSSProperties, HTMLAttributes, PointerEvent } from 'react'
import type { TimeBounds, TimeFormat, TimeValue } from '@modulify/m3-foundation/lib/time'

import {
  closestSelectableMinute,
  dialHour,
  dialMinute,
  displayHour,
  hourFromDisplay,
  isTimeSelectable,
  pointAngle,
  resolveTimeFormat,
} from '@modulify/m3-foundation/lib/time'
import { useEffect, useRef, useState } from 'react'

import { M3Button } from '@/components/button'
import { M3Dialog } from '@/components/dialog'
import { M3Icon } from '@/components/icon'

import defineComponent from '@/utils/component'
import { toClassName } from '@/utils/styling'

export type TimePickerAppearance = 'dial' | 'input'
export type TimePickerLayout = 'vertical' | 'horizontal'

type Selection = 'hour' | 'minute'
type Period = 'AM' | 'PM'

interface PickerState {
  value: TimeValue;
  appearance: TimePickerAppearance;
  selection: Selection;
  hourText: string;
  minuteText: string;
}

export interface M3TimePickerProps extends TimeBounds, Omit<HTMLAttributes<HTMLElement>, 'onChange' | 'onToggle'> {
  value?: TimeValue;
  opened?: boolean;
  appearance?: TimePickerAppearance;
  format?: TimeFormat;
  locale?: string;
  layout?: TimePickerLayout;
  onChange?: (value: TimeValue) => void;
  onToggle?: (opened: boolean) => void;
  onAppearanceChange?: (appearance: TimePickerAppearance) => void;
}

const DIAL_SIZE = 256
const OUTER_RADIUS = 104
const INNER_RADIUS = 64
const INNER_RING_THRESHOLD = 84
const DEFAULT_VALUE: TimeValue = { hour: 0, minute: 0 }
const periods: Period[] = ['AM', 'PM']

const position = (angle: number, radius: number): CSSProperties => {
  const radians = angle * Math.PI / 180

  return {
    left: `${DIAL_SIZE / 2 + Math.sin(radians) * radius}px`,
    top: `${DIAL_SIZE / 2 - Math.cos(radians) * radius}px`,
  }
}

const initialState = (value: TimeValue, appearance: TimePickerAppearance, format: TimeFormat): PickerState => ({
  value: { ...value },
  appearance,
  selection: 'hour',
  hourText: String(displayHour(value.hour, format)).padStart(2, '0'),
  minuteText: String(value.minute).padStart(2, '0'),
})

export default defineComponent(function M3TimePicker({
  value = DEFAULT_VALUE,
  opened = false,
  appearance = 'dial',
  format,
  locale = 'en-US',
  layout = 'vertical',
  min,
  max,
  step = 1,
  className = '',
  style,
  onChange = () => {},
  onToggle = () => {},
  onAppearanceChange = () => {},
  ...attrs
}: M3TimePickerProps) {
  const formatActual = resolveTimeFormat(locale, format)
  const bounds: TimeBounds = { min, max, step }
  const [state, setState] = useState(() => initialState(value, appearance, formatActual))
  const dial = useRef<HTMLDivElement>(null)
  const dragging = useRef<Selection | null>(null)

  useEffect(() => {
    if (opened) setState(initialState(value, appearance, formatActual))
  }, [opened, value.hour, value.minute])

  useEffect(() => {
    setState(current => ({ ...current, appearance }))
  }, [appearance])

  useEffect(() => {
    setState(current => ({
      ...current,
      hourText: String(displayHour(current.value.hour, formatActual)).padStart(2, '0'),
    }))
  }, [formatActual])

  const currentPeriod: Period = state.value.hour >= 12 ? 'PM' : 'AM'
  const hourNumber = Number(state.hourText)
  const minuteNumber = Number(state.minuteText)
  const hourValid = /^\d{1,2}$/.test(state.hourText) &&
    (formatActual === '12h' ? hourNumber >= 1 && hourNumber <= 12 : hourNumber >= 0 && hourNumber <= 23)
  const minuteValid = /^\d{1,2}$/.test(state.minuteText) && minuteNumber <= 59
  const inputValue: TimeValue | null = hourValid && minuteValid
    ? { hour: hourFromDisplay(hourNumber, currentPeriod, formatActual), minute: minuteNumber }
    : null
  const inputValid = inputValue !== null && isTimeSelectable(inputValue, bounds)
  const confirmDisabled = state.appearance === 'input'
    ? !inputValid
    : !isTimeSelectable(state.value, bounds)

  const syncValue = (next: TimeValue) => {
    setState(current => ({
      ...current,
      value: next,
      hourText: String(displayHour(next.hour, formatActual)).padStart(2, '0'),
      minuteText: String(next.minute).padStart(2, '0'),
    }))
  }

  const setAppearance = (next: TimePickerAppearance) => {
    setState(current => ({ ...current, appearance: next }))
    onAppearanceChange(next)
  }

  const setInput = (field: 'hour' | 'minute', text: string) => {
    const next = { ...state, [field === 'hour' ? 'hourText' : 'minuteText']: text }
    const nextHour = Number(next.hourText)
    const nextMinute = Number(next.minuteText)
    const validHour = /^\d{1,2}$/.test(next.hourText) &&
      (formatActual === '12h' ? nextHour >= 1 && nextHour <= 12 : nextHour >= 0 && nextHour <= 23)
    const validMinute = /^\d{1,2}$/.test(next.minuteText) && nextMinute <= 59
    const nextValue = {
      hour: hourFromDisplay(nextHour, next.value.hour >= 12 ? 'PM' : 'AM', formatActual),
      minute: nextMinute,
    }

    if (validHour && validMinute && isTimeSelectable(nextValue, bounds)) {
      next.value = nextValue
    }

    setState(next)
  }

  const hourAvailable = (hour: number): boolean => {
    const actual = formatActual === '12h'
      ? hourFromDisplay(hour, currentPeriod, formatActual)
      : hour
    return closestSelectableMinute(actual, state.value.minute, bounds) !== null
  }

  const periodAvailable = (period: Period): boolean => {
    const hour = hourFromDisplay(displayHour(state.value.hour, '12h'), period, '12h')
    return closestSelectableMinute(hour, state.value.minute, bounds) !== null
  }

  const setHour = (hour: number, advance = true) => {
    const actual = formatActual === '12h'
      ? hourFromDisplay(hour, currentPeriod, formatActual)
      : hour
    const minute = closestSelectableMinute(actual, state.value.minute, bounds)
    if (minute === null) return

    const next = { hour: actual, minute }
    syncValue(next)
    if (advance) setState(current => ({ ...current, selection: 'minute' }))
  }

  const setMinute = (minute: number) => {
    const next = { ...state.value, minute }
    if (isTimeSelectable(next, bounds)) syncValue(next)
  }

  const setPeriod = (period: Period) => {
    const hour = hourFromDisplay(displayHour(state.value.hour, '12h'), period, '12h')
    const minute = closestSelectableMinute(hour, state.value.minute, bounds)
    if (minute !== null) syncValue({ hour, minute })
  }

  const selectPoint = (event: PointerEvent<HTMLDivElement>) => {
    const rect = dial.current?.getBoundingClientRect()
    if (!rect) return

    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const angle = pointAngle(event.clientX, event.clientY, centerX, centerY)

    if (dragging.current === 'hour') {
      const radius = Math.hypot(event.clientX - centerX, event.clientY - centerY)
      setHour(dialHour(angle, formatActual === '24h' && radius < INNER_RING_THRESHOLD, formatActual), false)
      return
    }

    const minute = closestSelectableMinute(state.value.hour, dialMinute(angle), bounds)
    if (minute !== null) setMinute(minute)
  }

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    dragging.current = state.selection
    event.currentTarget.setPointerCapture(event.pointerId)
    selectPoint(event)
  }

  const onPointerUp = () => {
    if (dragging.current === 'hour') {
      setState(current => ({ ...current, selection: 'minute' }))
    }
    dragging.current = null
  }

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (dragging.current) selectPoint(event)
  }

  const cancel = () => {
    setState(initialState(value, appearance, formatActual))
    onToggle(false)
  }

  const confirm = () => {
    if (confirmDisabled) return
    onChange({ ...(state.appearance === 'input' && inputValue ? inputValue : state.value) })
    onToggle(false)
  }

  const hourSlots = Array.from({ length: formatActual === '24h' ? 24 : 12 }, (_, index) => ({
    value: formatActual === '12h' && index === 0 ? 12 : index,
    style: position(index % 12 * 30, formatActual === '24h' && index >= 12 ? INNER_RADIUS : OUTER_RADIUS),
  }))
  const minuteSlots = Array.from({ length: 12 }, (_, index) => ({
    value: index * 5,
    style: position(index * 30, OUTER_RADIUS),
  }))
  const handleAngle = state.selection === 'hour' ? state.value.hour % 12 * 30 : state.value.minute * 6
  const handleRadius = formatActual === '24h' && state.selection === 'hour' && state.value.hour >= 12
    ? INNER_RADIUS
    : OUTER_RADIUS
  const trackStyle: CSSProperties = {
    width: `${handleRadius}px`,
    transform: `rotate(${handleAngle - 90}deg)`,
  }

  return (
    <M3Dialog
      opened={opened}
      style={{ width: layout === 'horizontal' && state.appearance === 'dial' ? 560 : 328, ...style }}
      className={toClassName([
        {
          'm3-time-picker-dialog': true,
          'm3-time-picker-dialog_horizontal': layout === 'horizontal' && state.appearance === 'dial',
        },
        className,
      ])}
      aria-label="Select time"
      role="dialog"
      aria-modal="true"
      {...attrs}
      onToggle={cancel}
    >
      <section className={toClassName({
        'm3-time-picker': true,
        'm3-time-picker_input': state.appearance === 'input',
        'm3-time-picker_24h': formatActual === '24h',
        'm3-time-picker_horizontal': layout === 'horizontal' && state.appearance === 'dial',
      })}>
        <div className="m3-time-picker__header">
          {state.appearance === 'dial' ? 'Select time' : 'Enter time'}
        </div>

        <div className="m3-time-picker__body">
          <div className="m3-time-picker__fields">
            {state.appearance === 'input' ? (
              <>
                <label className="m3-time-picker__field">
                  <input
                    value={state.hourText}
                    aria-invalid={!hourValid || !inputValid}
                    aria-label="Hour"
                    inputMode="numeric"
                    autoComplete="off"
                    onChange={event => setInput('hour', event.target.value)}
                  />
                  <span>Hour</span>
                </label>
                <span className="m3-time-picker__separator">:</span>
                <label className="m3-time-picker__field">
                  <input
                    value={state.minuteText}
                    aria-invalid={!minuteValid || !inputValid}
                    aria-label="Minute"
                    inputMode="numeric"
                    autoComplete="off"
                    onChange={event => setInput('minute', event.target.value)}
                  />
                  <span>Minute</span>
                </label>
              </>
            ) : (
              <>
                <button
                  className={toClassName({
                    'm3-time-picker__value': true,
                    'm3-time-picker__value_selected': state.selection === 'hour',
                  })}
                  aria-pressed={state.selection === 'hour'}
                  aria-label="Select hours"
                  type="button"
                  onClick={() => setState(current => ({ ...current, selection: 'hour' }))}
                >
                  {String(displayHour(state.value.hour, formatActual)).padStart(2, '0')}
                </button>
                <span className="m3-time-picker__separator">:</span>
                <button
                  className={toClassName({
                    'm3-time-picker__value': true,
                    'm3-time-picker__value_selected': state.selection === 'minute',
                  })}
                  aria-pressed={state.selection === 'minute'}
                  aria-label="Select minutes"
                  type="button"
                  onClick={() => setState(current => ({ ...current, selection: 'minute' }))}
                >
                  {String(state.value.minute).padStart(2, '0')}
                </button>
              </>
            )}
          </div>

          {formatActual === '12h' && (
            <div className="m3-time-picker__periods" role="radiogroup" aria-label="Period">
              {periods.map(period => (
                <button
                  key={period}
                  className={toClassName({
                    'm3-time-picker__period': true,
                    'm3-time-picker__period_selected': currentPeriod === period,
                  })}
                  aria-checked={currentPeriod === period}
                  disabled={!periodAvailable(period)}
                  type="button"
                  role="radio"
                  onClick={() => setPeriod(period)}
                >
                  {period}
                </button>
              ))}
            </div>
          )}
        </div>

        {state.appearance === 'dial' && (
          <div
            ref={dial}
            className="m3-time-picker__dial"
            aria-label={state.selection === 'hour' ? 'Hours' : 'Minutes'}
            role="group"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            <span className="m3-time-picker__track" style={trackStyle} />
            <span className="m3-time-picker__center" />
            {state.selection === 'hour' ? hourSlots.map(slot => (
              <button
                key={slot.value}
                className={toClassName({
                  'm3-time-picker__slot': true,
                  'm3-time-picker__slot_selected': slot.value === displayHour(state.value.hour, formatActual),
                })}
                style={slot.style}
                disabled={!hourAvailable(slot.value)}
                aria-label={`${slot.value} hours of ${formatActual === '24h' ? 24 : 12}`}
                type="button"
                onClick={() => setHour(slot.value)}
              >
                {formatActual === '24h' && slot.value === 0 ? '00' : slot.value}
              </button>
            )) : minuteSlots.map(slot => (
              <button
                key={slot.value}
                className={toClassName({
                  'm3-time-picker__slot': true,
                  'm3-time-picker__slot_selected': slot.value === state.value.minute,
                })}
                style={slot.style}
                disabled={!isTimeSelectable({ hour: state.value.hour, minute: slot.value }, bounds)}
                aria-label={`${slot.value} minutes of 60`}
                type="button"
                onClick={() => setMinute(slot.value)}
              >
                {String(slot.value).padStart(2, '0')}
              </button>
            ))}
            {state.selection === 'minute' && state.value.minute % 5 !== 0 && (
              <span className="m3-time-picker__handle" style={position(handleAngle, handleRadius)}>
                {String(state.value.minute).padStart(2, '0')}
              </span>
            )}
          </div>
        )}
      </section>

      <M3Dialog.Footer>
        <M3Button
          className="m3-time-picker-dialog__switch"
          aria-label={state.appearance === 'dial' ? 'Switch to text input' : 'Switch to dial input'}
          appearance="standard"
          width="medium"
          onClick={() => setAppearance(state.appearance === 'dial' ? 'input' : 'dial')}
        >
          <M3Icon name={state.appearance === 'dial' ? 'keyboard' : 'schedule'} />
        </M3Button>
        <M3Button appearance="text" onClick={cancel}>
          Cancel
        </M3Button>
        <M3Button appearance="text" disabled={confirmDisabled} onClick={confirm}>
          OK
        </M3Button>
      </M3Dialog.Footer>
    </M3Dialog>
  )
})
