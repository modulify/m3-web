import type { FC } from 'react'

import {
  useEffect,
  useRef,
} from 'react'

import type {
  CalendarAvailability,
  CalendarDayBounds,
} from '@modulify/m3-foundation/lib/calendar'

import {
  isCalendarYearAvailable,
  isCalendarYearSelectable,
} from '@modulify/m3-foundation/lib/calendar'

import { M3Icon } from '@/components/icon'
import {
  M3List,
  M3ListItem,
} from '@/components/list'
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
        <M3List className="m3-date-picker-list" aria-label="Select year">
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
                  name="check"
                  aria-hidden="true"
                  className={toClassName({
                    'm3-date-picker-list__check': true,
                    'm3-date-picker-list__check_hidden': value !== year,
                  })}
                />
              </M3ListItem.Leading>
              {year}
            </M3ListItem>
          ))}
        </M3List>
      ) : (
        <div className="m3-year-picker__grid" role="grid" aria-label="Select year">
          {years.map(year => (
            <M3DatePickerOption
              key={year}
              appearance="pill"
              current={current === year}
              selected={value === year}
              aria-pressed={value === year}
              disabled={disabled ||
                !isCalendarYearAvailable(year, bounds) ||
                !isCalendarYearSelectable(year, availability)}
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
