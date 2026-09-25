import type { CalendarDayBounds } from '@modulify/m3-foundation/lib/calendar'
import type { FC } from 'react'

import {
  CalendarDay,
  isCalendarMonthAvailable,
} from '@modulify/m3-foundation/lib/calendar'
import { useEffect, useRef } from 'react'

import { M3Icon } from '@/components/icon'
import { M3List, M3ListItem } from '@/components/list'

import { toClassName } from '@/utils/styling'

import M3DatePickerOption from './M3DatePickerOption'

export interface M3MonthPickerProps {
  value: CalendarDay;
  current: CalendarDay;
  bounds: CalendarDayBounds;
  appearance: 'grid' | 'list';
  locale: string;
  label: string;
  disabled: boolean;
  animating: boolean;
  className?: string;
  onSelect: (month: number) => void;
}

const MONTHS_IN_ROW = 3
const MONTH_ROW_HEIGHT = 56
const months = Array.from({ length: 12 }, (_, month) => month + 1)
const rows = Array.from({ length: 4 }, (_, i) => months.slice(
  i * MONTHS_IN_ROW,
  (i + 1) * MONTHS_IN_ROW
))

const monthFormatter = (locale: string): Intl.DateTimeFormat => new Intl.DateTimeFormat(locale, {
  month: 'long',
})

const M3MonthPicker: FC<M3MonthPickerProps> = ({
  value,
  current,
  bounds,
  appearance,
  locale,
  label,
  disabled,
  animating,
  className = '',
  onSelect,
}) => {
  const root = useRef<HTMLDivElement | null>(null)
  const formatMonth = monthFormatter(locale)

  useEffect(() => {
    if (appearance === 'list' && root.current !== null) {
      root.current.scrollTop = Math.max(0, value.month - 2) * MONTH_ROW_HEIGHT
    }
  }, [appearance, value.month])

  const isMonthDisabled = (month: number) => disabled || !isCalendarMonthAvailable(
    new CalendarDay(value.year, month, 1),
    bounds
  )

  const format = (month: number) => formatMonth.format(new Date(value.year, month - 1, 1))

  return (
    <div
      ref={root}
      className={toClassName(['m3-month-picker', className, {
        [`m3-month-picker_${appearance}`]: true,
        'm3-month-picker_animating': animating,
      }])}
    >
      {appearance === 'list' ? (
        <M3List className="m3-date-picker-list" aria-label={label}>
          {months.map(month => (
            <M3ListItem
              key={month}
              selected={value.month === month}
              disabled={isMonthDisabled(month)}
              onClick={() => onSelect(month)}
            >
              <M3ListItem.Leading>
                <M3Icon
                  name="check"
                  aria-hidden="true"
                  className={toClassName({
                    'm3-date-picker-list__check': true,
                    'm3-date-picker-list__check_hidden': value.month !== month,
                  })}
                />
              </M3ListItem.Leading>
              {format(month)}
            </M3ListItem>
          ))}
        </M3List>
      ) : (
        <div className="m3-month-picker__grid" role="grid" aria-label={label}>
          {rows.map((row, i) => (
            <div key={i} className="m3-month-picker__row" role="row">
              {row.map(month => (
                <M3DatePickerOption
                  key={month}
                  appearance="pill"
                  role="gridcell"
                  current={current.year === value.year && current.month === month}
                  selected={value.month === month}
                  aria-pressed={value.month === month}
                  disabled={isMonthDisabled(month)}
                  onSelect={() => onSelect(month)}
                >
                  {format(month)}
                </M3DatePickerOption>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default M3MonthPicker
