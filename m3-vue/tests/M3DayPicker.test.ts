import { CalendarDay } from '@modulify/m3-foundation/lib/calendar'
import { render, screen } from '@testing-library/vue'

import M3DayPicker from '@/components/date-picker/M3DayPicker.vue'

describe('m3-vue/day-picker', () => {
  test('renders an empty range without selected days', () => {
    const month = new CalendarDay(2026, 7, 1)

    const { container } = render(M3DayPicker, {
      props: {
        type: 'range',
        value: null,
        month,
        today: month,
        bounds: [null, null],
        locale: 'en-US',
        firstDayOfWeek: 0,
        fixed: true,
        active: true,
        disabled: false,
        label: 'July 2026',
      },
    })

    expect(screen.getByRole('grid', { name: 'July 2026' })).toBeTruthy()
    expect(container.querySelector('.m3-date-picker-option_selected')).toBeNull()
  })
})
