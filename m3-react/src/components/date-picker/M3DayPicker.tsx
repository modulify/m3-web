import type {
  FC,
} from 'react'

import {
  useMemo,
} from 'react'

import type {
  CalendarAvailability,
  CalendarDayBounds,
  CalendarDayRange,
} from '@modulify/m3-foundation/lib/calendar'

import {
  CalendarDay,
  getCalendarMonthWeeks,
  getCalendarWeekDays,
  isCalendarDayInRange,
  isCalendarDayRangeEnd,
  isCalendarDayRangeStart,
  isCalendarDaySelectable,
} from '@modulify/m3-foundation/lib/calendar'

import { toClassName } from '@/utils/styling'
import M3DatePickerOption from './M3DatePickerOption'

export interface M3DayPickerProps {
  value: CalendarDay | CalendarDayRange | null;
  type: 'single' | 'range';
  month: CalendarDay;
  today: CalendarDay;
  bounds: CalendarDayBounds;
  availability?: CalendarAvailability | null;
  locale: string;
  firstDayOfWeek: number;
  fixed: boolean;
  active: boolean;
  disabled: boolean;
  label: string;
  className?: string;
  onSelect: (day: CalendarDay) => void;
}

const weekdayFormatter = (locale: string): Intl.DateTimeFormat => new Intl.DateTimeFormat(locale, {
  weekday: 'narrow',
})

const dayFormatter = (locale: string): Intl.DateTimeFormat => new Intl.DateTimeFormat(locale, {
  day: 'numeric',
  month: 'long',
  weekday: 'long',
  year: 'numeric',
})

const isDayOutOfRange = (
  day: CalendarDay,
  min: CalendarDay | null,
  max: CalendarDay | null
): boolean => (min !== null && day.isBefore(min)) || (max !== null && day.isAfter(max))

const M3DayPicker: FC<M3DayPickerProps> = ({
  value,
  type,
  month,
  today,
  bounds,
  availability = null,
  locale,
  firstDayOfWeek,
  fixed,
  active,
  disabled,
  label,
  className = '',
  onSelect,
}) => {
  const selectedDay = value instanceof CalendarDay ? value : null
  const selectedRange = Array.isArray(value) ? value : [null, null] as CalendarDayRange
  const weekdays = useMemo(
    () => getCalendarWeekDays(new CalendarDay(2024, 1, 7), firstDayOfWeek),
    [firstDayOfWeek]
  )
  const formatWeekday = weekdayFormatter(locale)
  const formatDay = dayFormatter(locale)
  const weeks = getCalendarMonthWeeks(month, firstDayOfWeek).filter(
    week => fixed || week.some(day => day.inSameMonth(month))
  )

  return (
    <div
      className={toClassName(['m3-day-picker', className])}
    >
      <div className="m3-day-picker__weekdays" aria-hidden={true}>
        {weekdays.map(day => (
          <span key={day.dayInWeek} className="m3-day-picker__weekday">
            {formatWeekday.format(day.date)}
          </span>
        ))}
      </div>

      <div
        className="m3-day-picker__grid"
        role={active ? 'grid' : undefined}
        aria-label={active ? label : undefined}
      >
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="m3-day-picker__week" role={active ? 'row' : undefined}>
            {week.map(day => {
              const isRangeStart = type === 'range' && isCalendarDayRangeStart(day, selectedRange)
              const isRangeEnd = type === 'range' && isCalendarDayRangeEnd(day, selectedRange)
              const isInRange = type === 'range' && isCalendarDayInRange(day, selectedRange)
              const isSelected = type === 'range'
                ? isRangeStart || isRangeEnd
                : selectedDay?.inSameDay(day) ?? false
              const isDisabled = disabled ||
                isDayOutOfRange(day, bounds[0], bounds[1]) ||
                !isCalendarDaySelectable(day, availability)
              const rangeStart = active && isRangeStart
              const rangeEnd = active && isRangeEnd
              const inRange = active && isInRange

              return (
                <span
                  key={day.timestamp}
                  className={toClassName({
                    'm3-day-picker__day-cell': true,
                    'm3-day-picker__day-cell_in-range': inRange,
                    'm3-day-picker__day-cell_range-start': rangeStart,
                    'm3-day-picker__day-cell_range-end': rangeEnd,
                  })}
                >
                  <M3DatePickerOption
                    appearance="circle"
                    role="gridcell"
                    current={today.inSameDay(day)}
                    selected={active && isSelected}
                    outside={!day.inSameMonth(month)}
                    inRange={inRange}
                    rangeStart={rangeStart}
                    rangeEnd={rangeEnd}
                    aria-label={formatDay.format(day.date)}
                    aria-selected={active && isSelected}
                    disabled={isDisabled}
                    tabIndex={active ? undefined : -1}
                    onSelect={() => onSelect(day)}
                  >
                    {day.dayInMonth}
                  </M3DatePickerOption>
                </span>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

export default M3DayPicker
