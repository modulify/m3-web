import {
  act,
  fireEvent,
  render,
  screen,
} from '@testing-library/react'
import { useState } from 'react'
import { waitFor } from '@testing-library/react'

import { M3DatePicker } from '@/components/date-picker'

describe('m3-react/date-picker', () => {
  test('renders stable calendar grid and selected date', () => {
    const { container } = render(<M3DatePicker value={new Date(2026, 6, 10)} />)

    const activePage = container.querySelector('.m3-date-picker__month-page:not([aria-hidden="true"])')
    const days = activePage?.querySelectorAll('.m3-date-picker-option')
    const selected = activePage?.querySelector('[aria-label="Friday, July 10, 2026"]')

    expect(days).toHaveLength(42)
    expect(selected?.getAttribute('role')).toBe('gridcell')
    expect(selected?.getAttribute('aria-selected')).toBe('true')
  })

  test('renders the docked footer slot outside picker menus', () => {
    const { container } = render(
      <M3DatePicker layout="docked" value={new Date(2026, 6, 10)}>
        <M3DatePicker.Footer>
          <button type="button">Apply date</button>
        </M3DatePicker.Footer>
      </M3DatePicker>
    )

    const footer = container.querySelector('.m3-date-picker__footer')

    expect(screen.getByRole('button', { name: 'Apply date' }).closest('footer')).toBe(footer)

    fireEvent.click(screen.getByRole('button', { name: 'Switch to month selection' }))

    expect(screen.queryByRole('button', { name: 'Apply date' })).toBeNull()
  })

  test('emits selected date and disables dates outside range', () => {
    const onChange = vi.fn()

    render(
      <M3DatePicker
        value={new Date(2026, 6, 10)}
        min={new Date(2026, 6, 3)}
        max={new Date(2026, 6, 24)}
        onChange={onChange}
      />
    )

    expect((screen.getByRole('gridcell', { name: 'Thursday, July 2, 2026' }) as HTMLButtonElement).disabled).toBe(true)

    fireEvent.click(screen.getByRole('gridcell', { name: 'Wednesday, July 15, 2026' }))

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange.mock.calls[0][0]).toEqual(new Date(2026, 6, 15))
  })

  test('reflects updated value after selection', () => {
    const DatePickerHarness = () => {
      const [value, setValue] = useState<Date | null>(new Date(2026, 6, 10))

      return <M3DatePicker value={value} onChange={setValue} />
    }

    render(<DatePickerHarness />)

    fireEvent.click(screen.getByRole('gridcell', { name: 'Wednesday, July 15, 2026' }))

    expect(screen.getByRole('gridcell', { name: 'Friday, July 10, 2026' }).getAttribute('aria-selected')).toBe('false')
    expect(screen.getByRole('gridcell', { name: 'Wednesday, July 15, 2026' }).getAttribute('aria-selected')).toBe('true')
  })

  test('emits and renders selected date range', () => {
    const onChange = vi.fn()

    render(
      <M3DatePicker
        type="range"
        value={[new Date(2026, 6, 17), null]}
        onChange={onChange}
      />
    )

    const start = screen.getByRole('gridcell', { name: 'Friday, July 17, 2026' })
    const end = screen.getByRole('gridcell', { name: 'Thursday, July 23, 2026' })

    expect(start.getAttribute('aria-selected')).toBe('true')

    fireEvent.click(end)

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange.mock.calls[0][0]).toEqual([new Date(2026, 6, 17), new Date(2026, 6, 23)])
  })

  test('marks completed date range days', () => {
    render(
      <M3DatePicker
        type="range"
        value={[new Date(2026, 6, 17), new Date(2026, 6, 23)]}
      />
    )

    const start = screen.getByRole('gridcell', { name: 'Friday, July 17, 2026' })
    const middle = screen.getByRole('gridcell', { name: 'Monday, July 20, 2026' })
    const end = screen.getByRole('gridcell', { name: 'Thursday, July 23, 2026' })

    expect(start.classList.contains('m3-date-picker-option_range-start')).toBe(true)
    expect(middle.classList.contains('m3-date-picker-option_in-range')).toBe(true)
    expect(end.classList.contains('m3-date-picker-option_range-end')).toBe(true)
  })

  test('restarts selected date range when choosing a date before start', () => {
    const onChange = vi.fn()

    render(
      <M3DatePicker
        type="range"
        value={[new Date(2026, 6, 17), null]}
        onChange={onChange}
      />
    )

    fireEvent.click(screen.getByRole('gridcell', { name: 'Friday, July 10, 2026' }))

    expect(onChange).toHaveBeenCalledWith([new Date(2026, 6, 10), null])
  })

  test('moves cursor by month with navigation buttons', async () => {
    render(<M3DatePicker value={new Date(2026, 6, 10)} />)

    fireEvent.click(screen.getByRole('button', { name: 'Next month' }))

    await waitFor(() => {
      expect(screen.getByRole('grid', { name: 'August 2026' })).toBeTruthy()
    })

    fireEvent.click(screen.getByRole('button', { name: 'Previous month' }))

    await waitFor(() => {
      expect(screen.getByRole('grid', { name: 'July 2026' })).toBeTruthy()
    })
  })

  test('disables month navigation outside effective range', () => {
    render(
      <M3DatePicker
        value={new Date(2026, 6, 10)}
        min={new Date(2026, 6, 3)}
        max={new Date(2026, 6, 24)}
      />
    )

    expect((screen.getByRole('button', { name: 'Previous month' }) as HTMLButtonElement).disabled).toBe(true)
    expect((screen.getByRole('button', { name: 'Next month' }) as HTMLButtonElement).disabled).toBe(true)
  })

  test('moves cursor through year selection without changing selected date', () => {
    const onChange = vi.fn()
    const { container } = render(<M3DatePicker value={new Date(2026, 6, 10)} onChange={onChange} />)

    fireEvent.click(screen.getByRole('button', { name: 'Switch to year selection' }))

    expect(container.querySelector('.m3-year-picker')?.classList.contains('m3-year-picker_animating')).toBe(true)

    fireEvent.click(screen.getByRole('button', { name: '2027' }))

    expect(screen.getByRole('grid', { name: 'July 2027' })).toBeTruthy()
    expect(container.querySelector('.m3-date-picker__calendar')?.classList.contains('m3-date-picker__mode-enter')).toBe(true)
    expect(onChange).not.toHaveBeenCalled()
  })

  test('moves cursor by year with navigation buttons', () => {
    const onChange = vi.fn()

    render(<M3DatePicker value={new Date(2026, 6, 10)} onChange={onChange} />)

    fireEvent.click(screen.getByRole('button', { name: 'Next year' }))

    expect(screen.getByRole('grid', { name: 'July 2027' })).toBeTruthy()
    expect(onChange).not.toHaveBeenCalled()

    fireEvent.click(screen.getByRole('button', { name: 'Previous year' }))

    expect(screen.getByRole('grid', { name: 'July 2026' })).toBeTruthy()
  })

  test('supports inline swipable navigation controls', async () => {
    render(<M3DatePicker value={new Date(2026, 6, 10)} navigation="inline" />)

    expect(screen.getByRole('button', { name: 'Switch to year selection' }).textContent).toContain('July 2026')

    fireEvent.click(screen.getByRole('button', { name: 'Next month' }))

    await waitFor(() => {
      expect(screen.getByRole('grid', { name: 'August 2026' })).toBeTruthy()
      expect(screen.getByRole('button', { name: 'Switch to year selection' }).textContent).toContain('August 2026')
    })
  })

  test('uses inline month-year button and year grid for inline year selection', async () => {
    const onChange = vi.fn()
    const { container } = render(
      <M3DatePicker
        value={new Date(2026, 6, 10)}
        navigation="inline"
        onChange={onChange}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: 'Switch to year selection' }))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Switch to day selection' }).textContent).toContain('July 2026')
      expect(screen.queryByRole('button', { name: 'Previous year' })).toBeNull()
      expect(screen.queryByRole('button', { name: 'Next year' })).toBeNull()
      expect(container.querySelector('.m3-year-picker_grid')).toBeTruthy()
    })

    fireEvent.click(screen.getByRole('button', { name: '2027' }))

    expect(screen.getByRole('grid', { name: 'July 2027' })).toBeTruthy()
    expect(onChange).not.toHaveBeenCalled()
  })

  test('keeps inline navigation stable while animating back to calendar grid', async () => {
    const { container } = render(
      <M3DatePicker
        value={new Date(2026, 6, 10)}
        navigation="inline"
      />
    )

    fireEvent.click(screen.getByRole('button', { name: 'Switch to year selection' }))
    await waitFor(() => {
      expect(screen.getByRole('button', { name: '2027' })).toBeTruthy()
    })

    fireEvent.click(screen.getByRole('button', { name: '2027' }))

    expect(container.querySelector('.m3-date-picker__calendar')?.classList.contains('m3-date-picker__mode-enter')).toBe(false)
    expect(container.querySelector('.m3-day-picker')?.classList.contains('m3-date-picker__mode-enter')).toBe(true)
  })

  test('activates day ripple on date click', async () => {
    render(<M3DatePicker value={new Date(2026, 6, 10)} />)

    const day = screen.getByRole('gridcell', { name: 'Wednesday, July 15, 2026' })

    fireEvent.click(day)

    await waitFor(() => {
      expect(day.querySelector('.m3-ripple')?.getAttribute('style')).toContain('display: inline-block')
    })
  })

  test('hides optional navigation controls', () => {
    render(<M3DatePicker value={new Date(2026, 6, 10)} navigation="none" />)

    expect(screen.queryByRole('button', { name: 'Previous month' })).toBeNull()
    expect(screen.queryByRole('button', { name: 'Switch to year selection' })).toBeNull()
  })

  test('limits selector controls to configured views', () => {
    render(<M3DatePicker value={new Date(2026, 6, 10)} views={['days', 'months']} />)

    expect(screen.getByRole('button', { name: 'Switch to month selection' })).toBeTruthy()
    expect(screen.queryByRole('button', { name: 'Switch to year selection' })).toBeNull()
  })

  test('supports controlled cursor navigation', async () => {
    const DatePickerHarness = () => {
      const [cursor, setCursor] = useState(new Date(2026, 8, 1))

      return (
        <M3DatePicker
          value={new Date(2026, 6, 10)}
          cursor={cursor}
          onCursorChange={setCursor}
        />
      )
    }

    render(<DatePickerHarness />)

    expect(screen.getByRole('grid', { name: 'September 2026' })).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Previous month' }))

    await waitFor(() => {
      expect(screen.getByRole('grid', { name: 'August 2026' })).toBeTruthy()
    })
  })

  test('cancels animated navigation when controlled cursor changes externally', async () => {
    const DatePickerHarness = () => {
      const [cursor, setCursor] = useState(new Date(2026, 8, 1))

      return (
        <>
          <button type="button" onClick={() => setCursor(new Date(2026, 11, 1))}>
            Show December
          </button>
          <M3DatePicker
            value={new Date(2026, 6, 10)}
            cursor={cursor}
            onCursorChange={setCursor}
          />
        </>
      )
    }

    render(<DatePickerHarness />)

    fireEvent.click(screen.getByRole('button', { name: 'Previous month' }))
    fireEvent.click(screen.getByRole('button', { name: 'Show December' }))

    await waitFor(() => {
      expect(screen.getByRole('grid', { name: 'December 2026' })).toBeTruthy()
    })

    await act(async () => {
      await new Promise(resolve => window.setTimeout(resolve, 250))
    })

    expect(screen.getByRole('grid', { name: 'December 2026' })).toBeTruthy()
  })

  test('disables non-selectable dates and years', () => {
    const onChange = vi.fn()

    render(
      <M3DatePicker
        value={new Date(2026, 6, 10)}
        availability={{
          isDateSelectable: date => date.getDate() !== 15,
          isYearSelectable: year => year !== 2027,
        }}
        onChange={onChange}
      />
    )

    const blockedDay = screen.getByRole('gridcell', { name: 'Wednesday, July 15, 2026' }) as HTMLButtonElement

    expect(blockedDay.disabled).toBe(true)

    fireEvent.click(blockedDay)

    expect(onChange).not.toHaveBeenCalled()

    fireEvent.click(screen.getByRole('button', { name: 'Switch to year selection' }))

    expect((screen.getByRole('button', { name: '2027' }) as HTMLButtonElement).disabled).toBe(true)
  })

  test('moves cursor through month selection without changing selected date', () => {
    const onChange = vi.fn()
    const onCursorChange = vi.fn()

    render(
      <M3DatePicker
        value={new Date(2026, 6, 10)}
        onChange={onChange}
        onCursorChange={onCursorChange}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: 'Switch to month selection' }))

    expect(screen.getByRole('grid', { name: 'Select month' }).closest('.m3-month-picker')).toBeTruthy()

    fireEvent.click(screen.getByRole('gridcell', { name: 'August' }))

    expect(screen.getByRole('grid', { name: 'August 2026' })).toBeTruthy()
    expect(onCursorChange).toHaveBeenCalledWith(new Date(2026, 7, 1))
    expect(onChange).not.toHaveBeenCalled()
  })

  test('outlines current grid options and selects the current year list item', () => {
    const today = new Date()
    const calendarLabel = new Intl.DateTimeFormat('en-US', {
      month: 'long',
      year: 'numeric',
    }).format(today)
    const monthLabel = new Intl.DateTimeFormat('en-US', {
      month: 'long',
    }).format(today)

    render(<M3DatePicker value={today} />)

    const currentDay = screen.getByRole('grid', { name: calendarLabel })
      .querySelector('.m3-date-picker-option_current')

    expect(currentDay?.classList.contains('m3-date-picker-option_circle')).toBe(true)
    expect(currentDay?.textContent).toBe(String(today.getDate()))

    fireEvent.click(screen.getByRole('button', { name: 'Switch to month selection' }))

    const currentMonth = screen.getByRole('gridcell', { name: monthLabel })

    expect(currentMonth.classList.contains('m3-date-picker-option_current')).toBe(true)
    expect(currentMonth.classList.contains('m3-date-picker-option_pill')).toBe(true)

    fireEvent.click(currentMonth)
    fireEvent.click(screen.getByRole('button', { name: 'Switch to year selection' }))

    const currentYear = screen.getByRole('button', { name: String(today.getFullYear()) })

    expect(currentYear.closest('.m3-list-item')?.classList.contains('m3-list-item_selected')).toBe(true)
    expect(currentYear.querySelector('.m3-date-picker-list__check_hidden')).toBeNull()
    expect(screen.getByRole('list', { name: 'Select year' })
      .querySelector('.m3-date-picker-option_current')).toBeNull()
  })

  test('keeps calendar view transitions mutually exclusive', () => {
    render(<M3DatePicker value={new Date(2026, 6, 10)} />)

    fireEvent.click(screen.getByRole('button', { name: 'Switch to month selection' }))

    expect(screen.getByRole('grid', { name: 'Select month' })).toBeTruthy()
    expect(screen.queryByRole('list', { name: 'Select year' })).toBeNull()
    expect(screen.queryByRole('grid', { name: 'July 2026' })).toBeNull()

    fireEvent.click(screen.getByRole('button', { name: 'Switch to year selection' }))

    expect(screen.getByRole('list', { name: 'Select year' })).toBeTruthy()
    expect(screen.queryByRole('grid', { name: 'Select month' })).toBeNull()
    expect(screen.queryByRole('grid', { name: 'July 2026' })).toBeNull()

    fireEvent.click(screen.getByRole('button', { name: 'Switch to day selection' }))

    expect(screen.getByRole('grid', { name: 'July 2026' })).toBeTruthy()
    expect(screen.queryByRole('list', { name: 'Select year' })).toBeNull()
    expect(screen.queryByRole('grid', { name: 'Select month' })).toBeNull()
  })

  test('moves cursor by month with swipe navigation', async () => {
    render(<M3DatePicker value={new Date(2026, 6, 10)} />)

    const calendar = screen.getByRole('grid', { name: 'July 2026' }).parentElement as HTMLElement

    fireEvent.pointerDown(calendar, {
      button: 0,
      clientX: 200,
      clientY: 20,
      pointerId: 1,
    })
    fireEvent.pointerUp(calendar, {
      clientX: 100,
      clientY: 22,
      pointerId: 1,
    })

    await waitFor(() => {
      expect(screen.getByRole('grid', { name: 'August 2026' })).toBeTruthy()
    })
  })

  test('ignores swipe toward unavailable month', () => {
    const { container } = render(
      <M3DatePicker
        value={new Date(2026, 6, 10)}
        min={new Date(2026, 6, 1)}
        max={new Date(2026, 6, 31)}
      />
    )
    const calendar = container.querySelector('.m3-date-picker__calendar') as HTMLElement

    fireEvent.pointerDown(calendar, {
      button: 0,
      clientX: 100,
      clientY: 20,
      pointerId: 1,
    })
    fireEvent.pointerMove(calendar, {
      clientX: 180,
      clientY: 22,
      pointerId: 1,
    })

    expect(calendar.style.getPropertyValue('--m3-date-picker-slide-offset')).toBe('0px')
  })

  test('starts swipe from calendar day buttons without selecting the date', () => {
    const onChange = vi.fn()
    const { container } = render(<M3DatePicker value={new Date(2026, 6, 10)} onChange={onChange} />)
    const calendar = container.querySelector('.m3-date-picker__calendar') as HTMLElement
    const day = screen.getByRole('gridcell', { name: 'Friday, July 10, 2026' })

    fireEvent.pointerDown(day, {
      button: 0,
      clientX: 100,
      clientY: 20,
      pointerId: 1,
    })
    fireEvent.pointerMove(calendar, {
      clientX: 80,
      clientY: 22,
      pointerId: 1,
    })
    fireEvent.pointerUp(calendar, {
      clientX: 80,
      clientY: 22,
      pointerId: 1,
    })
    fireEvent.click(day)

    expect(onChange).not.toHaveBeenCalled()
  })

  test('does not start swipe from navigation buttons', () => {
    const { container } = render(
      <M3DatePicker
        value={new Date(2026, 6, 10)}
        navigation="inline"
      />
    )
    const calendar = container.querySelector('.m3-date-picker__calendar') as HTMLElement
    const navigation = screen.getByRole('button', { name: 'Switch to year selection' })

    fireEvent.pointerDown(navigation, {
      button: 0,
      clientX: 100,
      clientY: 20,
      pointerId: 1,
    })
    fireEvent.pointerMove(calendar, {
      clientX: 20,
      clientY: 22,
      pointerId: 1,
    })

    expect(calendar.style.getPropertyValue('--m3-date-picker-slide-offset')).toBe('0px')
  })
})
