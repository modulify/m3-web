import type {
  CalendarAvailability,
  CalendarDayBounds,
} from '@modulify/m3-foundation/lib/calendar'
import type { FC } from 'react'

import {
  isCalendarYearAvailable,
  isCalendarYearSelectable,
} from '@modulify/m3-foundation/lib/calendar'
import { useEffect, useRef } from 'react'

import { M3Icon } from '@/components/icon'
import { M3List, M3ListItem } from '@/components/list'

import { toClassName } from '@/utils/styling'

import M3DatePickerOption from './M3DatePickerOption'

interface M3YearPickerProps {
  value: number;
  current: number;
  years: number[];
  bounds: CalendarDayBounds;
  availability: CalendarAvailability | null;
  appearance: 'grid' | 'list';
  disabled: boolean;
  animating: boolean;
  id: string;
  onSelect: (year: number) => void;
}

const YEAR_ROW_HEIGHT = 56
const YEAR_GRID_COLUMNS = 3

const M3YearPicker: FC<M3YearPickerProps> = ({
  value,
  current,
  years,
  bounds,
  availability,
  appearance,
  disabled,
  animating,
  id,
  onSelect,
}) => {
  const root = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (root.current === null || years.length === 0) {
      return
    }

    const selectedIndex = Math.max(0, value - years[0])
    const selectedRow = appearance === 'grid' ? Math.floor(selectedIndex / YEAR_GRID_COLUMNS) : selectedIndex

    root.current.scrollTop = Math.max(0, selectedRow - 1) * YEAR_ROW_HEIGHT
  }, [value, appearance, years])

  return (
    <div
      ref={root}
      id={id}
      className={toClassName({
        'm3-year-picker': true,
        [`m3-year-picker_${appearance}`]: true,
        'm3-year-picker_animating': animating,
      })}
    >
      {appearance === 'list' ? (
        <M3List aria-label="Select year" className="m3-date-picker-list">
          {years.map(year => (
            <M3ListItem
              key={year}
              selected={value === year}
              disabled={disabled ||
                !isCalendarYearAvailable(year, bounds) ||
                !isCalendarYearSelectable(year, availability)}
              onClick={() => onSelect(year)}
            >
              <M3ListItem.Leading>
                <M3Icon
                  className={toClassName({
                    'm3-date-picker-list__check': true,
                    'm3-date-picker-list__check_hidden': value !== year,
                  })}
                  aria-hidden="true"
                  name="check"
                />
              </M3ListItem.Leading>
              {year}
            </M3ListItem>
          ))}
        </M3List>
      ) : (
        <div role="grid" aria-label="Select year" className="m3-year-picker__grid">
          {years.map(year => (
            <M3DatePickerOption
              key={year}
              aria-pressed={value === year}
              current={current === year}
              selected={value === year}
              disabled={disabled ||
                !isCalendarYearAvailable(year, bounds) ||
                !isCalendarYearSelectable(year, availability)}
              appearance="pill"
              onSelect={() => onSelect(year)}
            >
              {year}
            </M3DatePickerOption>
          ))}
        </div>
      )}
    </div>
  )
}

export default M3YearPicker
