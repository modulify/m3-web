import type { CalendarDayBounds } from '@modulify/m3-foundation/lib/calendar'

import { CalendarDay } from '@modulify/m3-foundation/lib/calendar'
import { render, screen } from '@testing-library/react'

import M3DayPicker from '@/components/date-picker/M3DayPicker'

describe('m3-react/day-picker', () => {
  test('renders an empty range without selected days', () => {
    const month = new CalendarDay(2026, 7, 1)
    const bounds: CalendarDayBounds = [null, null]

    const { container } = render(
      <M3DayPicker
        type="range"
        value={null}
        month={month}
        today={month}
        bounds={bounds}
        availability={null}
        locale="en-US"
        firstDayOfWeek={0}
        disabled={false}
        label="July 2026"
        className=""
        fixed
        active
        onSelect={vi.fn()}
      />
    )

    expect(screen.getByRole('grid', { name: 'July 2026' })).toBeTruthy()
    expect(container.querySelector('.m3-date-picker-option_selected')).toBeNull()
  })
})
