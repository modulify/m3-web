import { CalendarDay } from '@modulify/m3-foundation/lib/calendar'
import { render, screen } from '@testing-library/vue'

import M3YearPicker from '@/components/date-picker/M3YearPicker.vue'

describe('m3-vue/year-picker', () => {
  test('waits for year options without scrolling an empty list', async () => {
    const view = render(M3YearPicker, {
      props: {
        value: 2026,
        current: 2026,
        years: [],
        bounds: [new CalendarDay(2026, 1, 1), new CalendarDay(2026, 12, 31)],
        availability: null,
        appearance: 'grid',
        disabled: false,
        animating: false,
        id: 'years',
      },
    })

    expect(screen.getByRole('grid', { name: 'Select year' }).children).toHaveLength(0)

    await view.rerender({ years: [2026] })
    expect(screen.getByRole('button', { name: '2026' })).toBeTruthy()
  })
})
