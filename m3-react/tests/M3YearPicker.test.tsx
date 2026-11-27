import type { CalendarDayBounds } from '@modulify/m3-foundation/lib/calendar'

import { CalendarDay } from '@modulify/m3-foundation/lib/calendar'
import { render, screen } from '@testing-library/react'

import M3YearPicker from '@/components/date-picker/M3YearPicker'

describe('m3-react/year-picker', () => {
  test('waits for year options without scrolling an empty list', () => {
    const bounds: CalendarDayBounds = [
      new CalendarDay(2026, 1, 1),
      new CalendarDay(2026, 12, 31),
    ]
    const props = {
      value: 2026,
      current: 2026,
      years: [],
      bounds,
      availability: null,
      appearance: 'grid' as const,
      disabled: false,
      animating: false,
      id: 'years',
      onSelect: vi.fn(),
    }
    const view = render(<M3YearPicker {...props} />)

    expect(screen.getByRole('grid', { name: 'Select year' }).children).toHaveLength(0)

    const nextProps = { ...props, years: [2026] }
    view.rerender(<M3YearPicker {...nextProps} />)
    expect(screen.getByRole('button', { name: '2026' })).toBeTruthy()
  })
})
