import type { Component } from 'vue'

import { defineComponent } from 'vue'
import { fireEvent } from '@testing-library/vue'
import { h } from 'vue'
import { render, screen, waitFor } from '@testing-library/vue'

import { M3DatePicker } from '@/components/date-picker'

describe('m3-vue/date-picker', () => {
  test('renders an empty month from the requested cursor', () => {
    const reference = { current: null as { el: HTMLElement } | null }
    const view = render(defineComponent({
      setup: () => () => h(M3DatePicker as Component, {
        ref: (instance: { el: HTMLElement } | null) => { reference.current = instance },
        cursor: new Date(2026, 6, 1),
      }),
    }))

    expect(reference.current?.el).toBe(view.container.firstElementChild)
    expect(screen.getByRole('grid', { name: 'July 2026' })).toBeTruthy()
    expect(view.container.querySelector('.m3-date-picker-option_selected')).toBeNull()
  })

  test('renders stable calendar grid and selected date', () => {
    const { container } = render(M3DatePicker, {
      props: {
        value: new Date(2026, 6, 10),
      },
    })

    const activePage = container.querySelector('.m3-date-picker__month-page:not([aria-hidden="true"])')
    const days = activePage?.querySelectorAll('.m3-date-picker-option')
    const selected = activePage?.querySelector('[aria-label="Friday, July 10, 2026"]')

    expect(days).toHaveLength(42)
    expect(selected?.getAttribute('role')).toBe('gridcell')
    expect(selected?.getAttribute('aria-selected')).toBe('true')
  })

  test('emits selected date and disables dates outside range', async () => {
    const view = render(M3DatePicker, {
      props: {
        value: new Date(2026, 6, 10),
        min: new Date(2026, 6, 3),
        max: new Date(2026, 6, 24),
      },
    })

    expect((screen.getByRole('gridcell', { name: 'Thursday, July 2, 2026' }) as HTMLButtonElement).disabled).toBe(true)

    await fireEvent.click(screen.getByRole('gridcell', { name: 'Wednesday, July 15, 2026' }))

    expect(view.emitted().change?.[0]).toEqual([new Date(2026, 6, 15)])
    expect(view.emitted()['update:value']?.[0]).toEqual([new Date(2026, 6, 15)])
  })

  test('reflects updated value after selection', async () => {
    const view = render(M3DatePicker, {
      props: {
        value: new Date(2026, 6, 10),
        'onUpdate:value': async (value: Date) => {
          await view.rerender({ value })
        },
      },
    })

    await fireEvent.click(screen.getByRole('gridcell', { name: 'Wednesday, July 15, 2026' }))

    expect(screen.getByRole('gridcell', { name: 'Friday, July 10, 2026' }).getAttribute('aria-selected')).toBe('false')
    expect(screen.getByRole('gridcell', { name: 'Wednesday, July 15, 2026' }).getAttribute('aria-selected')).toBe('true')
  })

  test('follows dates supplied after mount when the cursor is uncontrolled', async () => {
    const view = render(M3DatePicker, {
      props: { value: null },
    })

    await view.rerender({ value: new Date(2026, 6, 10) })
    expect(screen.getByRole('grid', { name: 'July 2026' })).toBeTruthy()

    await view.rerender({ value: null })
    expect(screen.getByRole('grid', { name: 'July 2026' })).toBeTruthy()

    await view.rerender({
      type: 'range',
      value: [null, new Date(2027, 7, 15)],
    })
    expect(screen.getByRole('grid', { name: 'August 2027' })).toBeTruthy()

    await view.rerender({ value: [null, null] })
    expect(screen.getByRole('grid', { name: 'August 2027' })).toBeTruthy()
  })

  test('emits and renders selected date range', async () => {
    const view = render(M3DatePicker, {
      props: {
        type: 'range',
        value: [new Date(2026, 6, 17), null],
      },
    })

    const start = screen.getByRole('gridcell', { name: 'Friday, July 17, 2026' })
    const end = screen.getByRole('gridcell', { name: 'Thursday, July 23, 2026' })

    expect(start.getAttribute('aria-selected')).toBe('true')

    await fireEvent.click(end)

    expect(view.emitted().change?.[0]).toEqual([[new Date(2026, 6, 17), new Date(2026, 6, 23)]])
    expect(view.emitted()['update:value']?.[0]).toEqual([[new Date(2026, 6, 17), new Date(2026, 6, 23)]])
  })

  test('marks completed date range days', () => {
    render(M3DatePicker, {
      props: {
        type: 'range',
        value: [new Date(2026, 6, 17), new Date(2026, 6, 23)],
      },
    })

    const start = screen.getByRole('gridcell', { name: 'Friday, July 17, 2026' })
    const middle = screen.getByRole('gridcell', { name: 'Monday, July 20, 2026' })
    const end = screen.getByRole('gridcell', { name: 'Thursday, July 23, 2026' })

    expect(start.classList.contains('m3-date-picker-option_range-start')).toBe(true)
    expect(middle.classList.contains('m3-date-picker-option_in-range')).toBe(true)
    expect(end.classList.contains('m3-date-picker-option_range-end')).toBe(true)
  })

  test('restarts selected date range when choosing a date before start', async () => {
    const view = render(M3DatePicker, {
      props: {
        type: 'range',
        value: [new Date(2026, 6, 17), null],
      },
    })

    await fireEvent.click(screen.getByRole('gridcell', { name: 'Friday, July 10, 2026' }))

    expect(view.emitted().change?.[0]).toEqual([[new Date(2026, 6, 10), null]])
  })

  test('moves cursor by month with navigation buttons', async () => {
    render(M3DatePicker, {
      props: {
        value: new Date(2026, 6, 10),
      },
    })

    await fireEvent.click(screen.getByRole('button', { name: 'Next month' }))

    await waitFor(() => {
      expect(screen.getByRole('grid', { name: 'August 2026' })).toBeTruthy()
    })

    await fireEvent.click(screen.getByRole('button', { name: 'Previous month' }))

    await waitFor(() => {
      expect(screen.getByRole('grid', { name: 'July 2026' })).toBeTruthy()
    })
  })

  test('ignores repeated month navigation while the first slide is running', async () => {
    const view = render(M3DatePicker, {
      props: {
        value: new Date(2026, 6, 10),
      },
    })

    const next = screen.getByRole('button', { name: 'Next month' })
    await fireEvent.click(next)
    await fireEvent.click(next)

    await waitFor(() => {
      expect(screen.getByRole('grid', { name: 'August 2026' })).toBeTruthy()
    })
    expect(view.emitted()['update:cursor']).toHaveLength(1)
  })

  test('disables month navigation outside effective range', () => {
    render(M3DatePicker, {
      props: {
        value: new Date(2026, 6, 10),
        min: new Date(2026, 6, 3),
        max: new Date(2026, 6, 24),
      },
    })

    expect((screen.getByRole('button', { name: 'Previous month' }) as HTMLButtonElement).disabled).toBe(true)
    expect((screen.getByRole('button', { name: 'Next month' }) as HTMLButtonElement).disabled).toBe(true)
  })

  test('moves cursor through year selection without changing selected date', async () => {
    const view = render(M3DatePicker, {
      props: {
        value: new Date(2026, 6, 10),
      },
    })

    await fireEvent.click(screen.getByRole('button', { name: 'Switch to year selection' }))

    expect(view.container.querySelector('.m3-year-picker')?.classList.contains('m3-year-picker_animating')).toBe(true)

    await fireEvent.click(screen.getByRole('button', { name: '2027' }))

    expect(screen.getByRole('grid', { name: 'July 2027' })).toBeTruthy()
    expect(view.container.querySelector('.m3-date-picker__calendar')?.classList.contains('m3-date-picker__mode-enter')).toBe(true)
    expect(view.emitted().change).toBeUndefined()
    expect(view.emitted()['update:value']).toBeUndefined()
  })

  test('moves cursor by year with navigation buttons', async () => {
    const view = render(M3DatePicker, {
      props: {
        value: new Date(2026, 6, 10),
      },
    })

    await fireEvent.click(screen.getByRole('button', { name: 'Next year' }))

    expect(screen.getByRole('grid', { name: 'July 2027' })).toBeTruthy()
    expect(view.emitted().change).toBeUndefined()
    expect(view.emitted()['update:value']).toBeUndefined()

    await fireEvent.click(screen.getByRole('button', { name: 'Previous year' }))

    expect(screen.getByRole('grid', { name: 'July 2026' })).toBeTruthy()
  })

  test('supports inline swipable navigation controls', async () => {
    render(M3DatePicker, {
      props: {
        value: new Date(2026, 6, 10),
        navigation: 'inline',
      },
    })

    expect(screen.getByRole('button', { name: 'Switch to year selection' }).textContent).toContain('July 2026')

    await fireEvent.click(screen.getByRole('button', { name: 'Next month' }))

    await waitFor(() => {
      expect(screen.getByRole('grid', { name: 'August 2026' })).toBeTruthy()
      expect(screen.getByRole('button', { name: 'Switch to year selection' }).textContent).toContain('August 2026')
    })
  })

  test('ignores inactive inline controls and navigates with the active page', async () => {
    const { container } = render(M3DatePicker, {
      props: {
        value: new Date(2026, 6, 10),
        navigation: 'inline',
      },
    })

    const inactive = container.querySelector(
      '.m3-date-picker__month-page[aria-hidden="true"] .m3-date-picker__inline-arrows button'
    ) as HTMLButtonElement
    await fireEvent.click(inactive)
    expect(screen.getByRole('grid', { name: 'July 2026' })).toBeTruthy()

    await fireEvent.click(screen.getByRole('button', { name: 'Previous month' }))
    await waitFor(() => {
      expect(screen.getByRole('grid', { name: 'June 2026' })).toBeTruthy()
    })
  })

  test('uses inline month-year button and year grid for inline year selection', async () => {
    const { container, emitted } = render(M3DatePicker, {
      props: {
        value: new Date(2026, 6, 10),
        navigation: 'inline',
      },
    })

    await fireEvent.click(screen.getByRole('button', { name: 'Switch to year selection' }))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Switch to day selection' }).textContent).toContain('July 2026')
      expect(screen.queryByRole('button', { name: 'Previous year' })).toBeNull()
      expect(screen.queryByRole('button', { name: 'Next year' })).toBeNull()
      expect(container.querySelector('.m3-year-picker_grid')).toBeTruthy()
    })

    await fireEvent.click(screen.getByRole('button', { name: '2027' }))

    expect(screen.getByRole('grid', { name: 'July 2027' })).toBeTruthy()
    expect(emitted().change).toBeUndefined()
    expect(emitted()['update:value']).toBeUndefined()
  })

  test('returns from inline year selection through the month heading', async () => {
    render(M3DatePicker, {
      props: {
        value: new Date(2026, 6, 10),
        navigation: 'inline',
      },
    })

    await fireEvent.click(screen.getByRole('button', { name: 'Switch to year selection' }))
    await waitFor(() => {
      expect(screen.getByRole('button', { name: '2027' })).toBeTruthy()
    })

    await fireEvent.click(screen.getByRole('button', { name: 'Switch to day selection' }))

    await waitFor(() => {
      expect(screen.getByRole('grid', { name: 'July 2026' })).toBeTruthy()
    })
  })

  test('keeps the selected year when a pending inline view switch finishes', async () => {
    render(M3DatePicker, {
      props: {
        value: new Date(2026, 6, 10),
        navigation: 'inline',
      },
    })

    await fireEvent.click(screen.getByRole('button', { name: 'Switch to year selection' }))
    await waitFor(() => expect(screen.getByRole('button', { name: '2027' })).toBeTruthy())

    await fireEvent.click(screen.getByRole('button', { name: 'Switch to day selection' }))
    await fireEvent.click(screen.getByRole('button', { name: '2027' }))

    await new Promise(resolve => setTimeout(resolve, 150))
    expect(screen.getByRole('grid', { name: 'July 2027' })).toBeTruthy()
  })

  test('keeps inline navigation stable while animating back to calendar grid', async () => {
    const { container } = render(M3DatePicker, {
      props: {
        value: new Date(2026, 6, 10),
        navigation: 'inline',
      },
    })

    await fireEvent.click(screen.getByRole('button', { name: 'Switch to year selection' }))
    await waitFor(() => {
      expect(screen.getByRole('button', { name: '2027' })).toBeTruthy()
    })

    await fireEvent.click(screen.getByRole('button', { name: '2027' }))

    expect(container.querySelector('.m3-date-picker__calendar')?.classList.contains('m3-date-picker__mode-enter')).toBe(false)
    expect(container.querySelector('.m3-day-picker')?.classList.contains('m3-date-picker__mode-enter')).toBe(true)
  })

  test('activates day ripple on date click', async () => {
    render(M3DatePicker, {
      props: {
        value: new Date(2026, 6, 10),
      },
    })

    const day = screen.getByRole('gridcell', { name: 'Wednesday, July 15, 2026' })

    await fireEvent.click(day)

    await waitFor(() => {
      expect(day.querySelector('.m3-ripple')).toBeTruthy()
    })
  })

  test('hides optional navigation controls', () => {
    render(M3DatePicker, {
      props: {
        value: new Date(2026, 6, 10),
        navigation: 'none',
      },
    })

    expect(screen.queryByRole('button', { name: 'Previous month' })).toBeNull()
    expect(screen.queryByRole('button', { name: 'Switch to year selection' })).toBeNull()
  })

  test('limits selector controls to configured views', () => {
    render(M3DatePicker, {
      props: {
        value: new Date(2026, 6, 10),
        views: ['days', 'months'],
      },
    })

    expect(screen.getByRole('button', { name: 'Switch to month selection' })).toBeTruthy()
    expect(screen.queryByRole('button', { name: 'Switch to year selection' })).toBeNull()
  })

  test('uses a fixed month label when month selection is unavailable', () => {
    const { container } = render(M3DatePicker, {
      props: {
        value: new Date(2026, 6, 10),
        views: ['days', 'years'],
      },
    })

    expect(container.querySelector('.m3-date-picker__navigation-label')?.textContent).toContain('Jul')
    expect(screen.queryByRole('button', { name: 'Switch to month selection' })).toBeNull()
    expect(screen.getByRole('button', { name: 'Switch to year selection' })).toBeTruthy()
  })

  test('returns from month selection through the month heading', async () => {
    render(M3DatePicker, {
      props: { value: new Date(2026, 6, 10) },
    })

    await fireEvent.click(screen.getByRole('button', { name: 'Switch to month selection' }))
    expect(screen.getByRole('grid', { name: 'Select month' })).toBeTruthy()

    await fireEvent.click(screen.getByRole('button', { name: 'Switch to day selection' }))
    expect(screen.getByRole('grid', { name: 'July 2026' })).toBeTruthy()
  })

  test('shows a month label in inline navigation when only day view is available', () => {
    const { container } = render(M3DatePicker, {
      props: {
        value: new Date(2026, 6, 10),
        navigation: 'inline',
        views: ['days'],
      },
    })

    const activePage = container.querySelector('.m3-date-picker__month-page:not([aria-hidden="true"])')
    expect(activePage?.querySelector('.m3-date-picker__inline-month-label')?.textContent).toContain('July 2026')
    expect(screen.queryByRole('button', { name: 'Switch to month selection' })).toBeNull()
    expect(screen.queryByRole('button', { name: 'Switch to year selection' })).toBeNull()
    expect(screen.getByRole('button', { name: 'Next month' })).toBeTruthy()
  })

  test('supports controlled cursor navigation', async () => {
    const view = render(M3DatePicker, {
      props: {
        value: new Date(2026, 6, 10),
        cursor: new Date(2026, 8, 1),
      },
    })

    expect(screen.getByRole('grid', { name: 'September 2026' })).toBeTruthy()

    await fireEvent.click(screen.getByRole('button', { name: 'Previous month' }))

    await waitFor(() => {
      expect(view.emitted()['update:cursor']?.[0]).toEqual([new Date(2026, 7, 1)])
    })
  })

  test('clamps a controlled cursor to changed bounds without replacing it', async () => {
    const cursor = new Date(2026, 6, 1)
    const view = render(M3DatePicker, {
      props: { cursor },
    })

    await view.rerender({ min: new Date(2026, 7, 1) })
    expect(screen.getByRole('grid', { name: 'August 2026' })).toBeTruthy()

    await view.rerender({ min: null })
    expect(screen.getByRole('grid', { name: 'July 2026' })).toBeTruthy()
  })

  test('cancels animated navigation when controlled cursor changes externally', async () => {
    const view = render(M3DatePicker, {
      props: {
        value: new Date(2026, 6, 10),
        cursor: new Date(2026, 8, 1),
      },
    })

    await fireEvent.click(screen.getByRole('button', { name: 'Previous month' }))
    await view.rerender({
      value: new Date(2026, 6, 10),
      cursor: new Date(2026, 11, 1),
    })

    await waitFor(() => {
      expect(screen.getByRole('grid', { name: 'December 2026' })).toBeTruthy()
    })

    await new Promise(resolve => window.setTimeout(resolve, 250))

    expect(screen.getByRole('grid', { name: 'December 2026' })).toBeTruthy()
  })

  test('follows external date and range changes when the cursor is uncontrolled', async () => {
    const view = render(M3DatePicker, {
      props: { value: new Date(2026, 6, 10) },
    })

    await view.rerender({ value: new Date(2026, 10, 10) })
    await waitFor(() => expect(screen.getByRole('grid', { name: 'November 2026' })).toBeTruthy())

    await view.rerender({ type: 'range', value: [new Date(2027, 1, 3), null] })
    await waitFor(() => expect(screen.getByRole('grid', { name: 'February 2027' })).toBeTruthy())
  })

  test('clamps the uncontrolled cursor after date bounds change', async () => {
    const view = render(M3DatePicker, {
      props: { value: new Date(2026, 6, 10) },
    })

    await view.rerender({ min: new Date(2027, 0, 1) })

    await waitFor(() => expect(screen.getByRole('grid', { name: 'January 2027' })).toBeTruthy())
  })

  test('disables non-selectable dates and years', async () => {
    const view = render(M3DatePicker, {
      props: {
        value: new Date(2026, 6, 10),
        availability: {
          isDateSelectable: (date: Date) => date.getDate() !== 15,
          isYearSelectable: (year: number) => year !== 2027,
        },
      },
    })

    const blockedDay = screen.getByRole('gridcell', { name: 'Wednesday, July 15, 2026' }) as HTMLButtonElement

    expect(blockedDay.disabled).toBe(true)

    await fireEvent.click(blockedDay)

    expect(view.emitted().change).toBeUndefined()
    expect(view.emitted()['update:value']).toBeUndefined()

    await fireEvent.click(screen.getByRole('button', { name: 'Switch to year selection' }))

    expect((screen.getByRole('button', { name: '2027' }) as HTMLButtonElement).disabled).toBe(true)
  })

  test('moves cursor through month selection without changing selected date', async () => {
    const view = render(M3DatePicker, {
      props: {
        value: new Date(2026, 6, 10),
      },
    })

    await fireEvent.click(screen.getByRole('button', { name: 'Switch to month selection' }))

    expect(screen.getByRole('grid', { name: 'Select month' }).closest('.m3-month-picker')).toBeTruthy()

    await fireEvent.click(screen.getByRole('gridcell', { name: 'August' }))

    expect(screen.getByRole('grid', { name: 'August 2026' })).toBeTruthy()
    expect(view.emitted()['update:cursor']?.[0]).toEqual([new Date(2026, 7, 1)])
    expect(view.emitted().change).toBeUndefined()
    expect(view.emitted()['update:value']).toBeUndefined()
  })

  test('outlines current grid options and selects the current year list item', async () => {
    const today = new Date()
    const calendarLabel = new Intl.DateTimeFormat('en-US', {
      month: 'long',
      year: 'numeric',
    }).format(today)
    const monthLabel = new Intl.DateTimeFormat('en-US', {
      month: 'long',
    }).format(today)

    render(M3DatePicker, {
      props: {
        value: today,
      },
    })

    const currentDay = screen.getByRole('grid', { name: calendarLabel })
      .querySelector('.m3-date-picker-option_current')

    expect(currentDay?.classList.contains('m3-date-picker-option_circle')).toBe(true)
    expect(currentDay?.textContent).toBe(String(today.getDate()))

    await fireEvent.click(screen.getByRole('button', { name: 'Switch to month selection' }))

    const currentMonth = screen.getByRole('gridcell', { name: monthLabel })

    expect(currentMonth.classList.contains('m3-date-picker-option_current')).toBe(true)
    expect(currentMonth.classList.contains('m3-date-picker-option_pill')).toBe(true)

    await fireEvent.click(currentMonth)
    await fireEvent.click(screen.getByRole('button', { name: 'Switch to year selection' }))

    const currentYear = screen.getByRole('button', { name: String(today.getFullYear()) })

    expect(currentYear.closest('.m3-list-item')?.classList.contains('m3-list-item_selected')).toBe(true)
    expect(currentYear.querySelector('.m3-date-picker-list__check_hidden')).toBeNull()
    expect(screen.getByRole('list', { name: 'Select year' })
      .querySelector('.m3-date-picker-option_current')).toBeNull()
  })

  test('keeps calendar view transitions mutually exclusive', async () => {
    const { container } = render(M3DatePicker, {
      props: {
        value: new Date(2026, 6, 10),
      },
    })

    await fireEvent.click(screen.getByRole('button', { name: 'Switch to month selection' }))

    expect(screen.getByRole('grid', { name: 'Select month' })).toBeTruthy()
    expect(screen.queryByRole('list', { name: 'Select year' })).toBeNull()
    expect(screen.queryByRole('grid', { name: 'July 2026' })).toBeNull()

    await fireEvent.click(screen.getByRole('button', { name: 'Switch to year selection' }))

    expect(screen.getByRole('list', { name: 'Select year' })).toBeTruthy()
    expect(screen.queryByRole('grid', { name: 'Select month' })).toBeNull()
    expect(screen.queryByRole('grid', { name: 'July 2026' })).toBeNull()

    await fireEvent.click(screen.getByRole('button', { name: 'Switch to day selection' }))

    expect(screen.getByRole('grid', { name: 'July 2026' })).toBeTruthy()
    expect(screen.queryByRole('list', { name: 'Select year' })).toBeNull()
    expect(screen.queryByRole('grid', { name: 'Select month' })).toBeNull()
    await waitFor(() => {
      expect(container.querySelector('.m3-date-picker__mode-enter')).toBeNull()
    })
  })

  test('moves cursor by month with swipe navigation', async () => {
    render(M3DatePicker, {
      props: {
        value: new Date(2026, 6, 10),
      },
    })

    const calendar = screen.getByRole('grid', { name: 'July 2026' }).parentElement as HTMLElement

    await fireEvent.pointerDown(calendar, {
      button: 0,
      clientX: 200,
      clientY: 20,
      pointerId: 1,
    })
    await fireEvent.pointerUp(calendar, {
      clientX: 100,
      clientY: 22,
      pointerId: 1,
    })

    await waitFor(() => {
      expect(screen.getByRole('grid', { name: 'August 2026' })).toBeTruthy()
    })
  })

  test('ignores swipe toward unavailable month', async () => {
    const { container } = render(M3DatePicker, {
      props: {
        value: new Date(2026, 6, 10),
        min: new Date(2026, 6, 1),
        max: new Date(2026, 6, 31),
      },
    })
    const calendar = container.querySelector('.m3-date-picker__calendar') as HTMLElement

    await fireEvent.pointerDown(calendar, {
      button: 0,
      clientX: 100,
      clientY: 20,
      pointerId: 1,
    })
    await fireEvent.pointerMove(calendar, {
      clientX: 180,
      clientY: 22,
      pointerId: 1,
    })

    expect(calendar.style.getPropertyValue('--m3-date-picker-slide-offset')).toBe('0px')
    await fireEvent.pointerUp(calendar, {
      clientX: 180,
      clientY: 22,
      pointerId: 1,
    })

    expect(screen.getByRole('grid', { name: 'July 2026' })).toBeTruthy()
  })

  test('suppresses the click after swiping a day button and restores selection afterward', async () => {
    const { container, emitted } = render(M3DatePicker, {
      props: {
        value: new Date(2026, 6, 10),
      },
    })
    const calendar = container.querySelector('.m3-date-picker__calendar') as HTMLElement
    const day = screen.getByRole('gridcell', { name: 'Wednesday, July 15, 2026' })

    await fireEvent.pointerDown(day, {
      button: 0,
      clientX: 100,
      clientY: 20,
      pointerId: 1,
    })
    await fireEvent.pointerMove(calendar, {
      clientX: 80,
      clientY: 22,
      pointerId: 1,
    })
    await fireEvent.pointerUp(calendar, {
      clientX: 80,
      clientY: 22,
      pointerId: 1,
    })
    await fireEvent.click(day)

    expect(emitted().change).toBeUndefined()
    expect(emitted()['update:value']).toBeUndefined()

    await new Promise(resolve => setTimeout(resolve, 250))
    await fireEvent.click(day)
    expect(emitted().change?.[0]).toEqual([new Date(2026, 6, 15)])
  })

  test('does not start swipe from navigation buttons', async () => {
    const { container } = render(M3DatePicker, {
      props: {
        value: new Date(2026, 6, 10),
        navigation: 'inline',
      },
    })
    const calendar = container.querySelector('.m3-date-picker__calendar') as HTMLElement
    const navigation = screen.getByRole('button', { name: 'Switch to year selection' })

    await fireEvent.pointerDown(navigation, {
      button: 0,
      clientX: 100,
      clientY: 20,
      pointerId: 1,
    })
    await fireEvent.pointerMove(calendar, {
      clientX: 20,
      clientY: 22,
      pointerId: 1,
    })
    await fireEvent.pointerUp(calendar, {
      clientX: 20,
      clientY: 22,
      pointerId: 1,
    })

    expect(calendar.style.getPropertyValue('--m3-date-picker-slide-offset')).toBe('0px')
  })

  test('preserves a day click after a small pointer move', async () => {
    const { container, emitted } = render(M3DatePicker, {
      props: { value: new Date(2026, 6, 10) },
    })
    const calendar = container.querySelector('.m3-date-picker__calendar') as HTMLElement
    const day = screen.getByRole('gridcell', { name: 'Wednesday, July 15, 2026' })

    await fireEvent.pointerDown(day, { button: 0, clientX: 100, clientY: 20, pointerId: 1 })
    await fireEvent.pointerMove(calendar, { clientX: 95, clientY: 20, pointerId: 1 })
    await fireEvent.pointerUp(calendar, { clientX: 95, clientY: 20, pointerId: 1 })
    await fireEvent.click(day)

    expect(emitted().change?.[0]).toEqual([new Date(2026, 6, 15)])
  })

  test('restores day clicks after an interrupted drag times out', async () => {
    const { container, emitted } = render(M3DatePicker, {
      props: { value: new Date(2026, 6, 10) },
    })
    const calendar = container.querySelector('.m3-date-picker__calendar') as HTMLElement
    const day = screen.getByRole('gridcell', { name: 'Wednesday, July 15, 2026' })

    await fireEvent.pointerDown(day, { button: 0, clientX: 100, clientY: 20, pointerId: 1 })
    await fireEvent.pointerMove(calendar, { clientX: 80, clientY: 20, pointerId: 1 })
    await fireEvent.pointerUp(calendar, { clientX: 80, clientY: 20, pointerId: 1 })

    await new Promise(resolve => setTimeout(resolve, 250))
    await fireEvent.click(day)

    expect(emitted().change?.[0]).toEqual([new Date(2026, 6, 15)])
  })

  test('cancels an incomplete month drag without moving the calendar', async () => {
    const { container } = render(M3DatePicker, {
      props: { value: new Date(2026, 6, 10) },
    })
    const calendar = container.querySelector('.m3-date-picker__calendar') as HTMLElement

    await fireEvent.pointerDown(calendar, {
      button: 0,
      clientX: 200,
      clientY: 20,
      pointerId: 1,
    })
    await fireEvent.pointerMove(calendar, {
      clientX: 170,
      clientY: 22,
      pointerId: 1,
    })
    expect(calendar.style.getPropertyValue('--m3-date-picker-slide-offset')).toBe('-30px')

    await fireEvent.pointerCancel(calendar, { pointerId: 1 })
    await waitFor(() => {
      expect(calendar.style.getPropertyValue('--m3-date-picker-slide-offset')).toBe('0px')
    })
    await waitFor(() => {
      expect(container.querySelector('.m3-date-picker__month-track_animating')).toBeNull()
    })
    expect(screen.getByRole('grid', { name: 'July 2026' })).toBeTruthy()
  })

  test('ignores vertical movement and a different pointer during a month drag', async () => {
    const { container } = render(M3DatePicker, {
      props: { value: new Date(2026, 6, 10) },
    })
    const calendar = container.querySelector('.m3-date-picker__calendar') as HTMLElement

    await fireEvent.pointerDown(calendar, {
      button: 0,
      clientX: 200,
      clientY: 20,
      pointerId: 1,
    })
    await fireEvent.pointerMove(calendar, {
      clientX: 100,
      clientY: 22,
      pointerId: 2,
    })
    await fireEvent.pointerMove(calendar, {
      clientX: 180,
      clientY: 100,
      pointerId: 1,
    })
    await fireEvent.pointerUp(calendar, {
      clientX: 100,
      clientY: 22,
      pointerId: 2,
    })

    expect(calendar.style.getPropertyValue('--m3-date-picker-slide-offset')).toBe('0px')
    expect(screen.getByRole('grid', { name: 'July 2026' })).toBeTruthy()

    await fireEvent.pointerUp(calendar, {
      clientX: 180,
      clientY: 100,
      pointerId: 1,
    })
    expect(screen.getByRole('grid', { name: 'July 2026' })).toBeTruthy()
  })

  test('keeps a day click available when pointer movement stays below the swipe threshold', async () => {
    const { container, emitted } = render(M3DatePicker, {
      props: { value: new Date(2026, 6, 10) },
    })
    const calendar = container.querySelector('.m3-date-picker__calendar') as HTMLElement
    const day = screen.getByRole('gridcell', { name: 'Wednesday, July 15, 2026' })

    await fireEvent.pointerDown(day, {
      button: 0,
      clientX: 100,
      clientY: 20,
      pointerId: 1,
    })
    await fireEvent.pointerMove(calendar, {
      clientX: 98,
      clientY: 20,
      pointerId: 1,
    })
    await fireEvent.pointerUp(calendar, {
      clientX: 98,
      clientY: 20,
      pointerId: 1,
    })
    await fireEvent.click(day)

    expect(emitted().change?.[0]).toEqual([new Date(2026, 6, 15)])
    expect(screen.getByRole('grid', { name: 'July 2026' })).toBeTruthy()
  })

  test('swipes back to the previous month', async () => {
    const { container } = render(M3DatePicker, {
      props: { value: new Date(2026, 6, 10) },
    })
    const calendar = container.querySelector('.m3-date-picker__calendar') as HTMLElement

    await fireEvent.pointerDown(calendar, {
      button: 0,
      clientX: 100,
      clientY: 20,
      pointerId: 1,
    })
    await fireEvent.pointerUp(calendar, {
      clientX: 200,
      clientY: 22,
      pointerId: 1,
    })

    await waitFor(() => {
      expect(screen.getByRole('grid', { name: 'June 2026' })).toBeTruthy()
    })
  })

  test('does not start a month swipe when disabled or using a secondary pointer button', async () => {
    const view = render(M3DatePicker, {
      props: { value: new Date(2026, 6, 10), disabled: true },
    })
    const calendar = view.container.querySelector('.m3-date-picker__calendar') as HTMLElement

    await fireEvent.pointerDown(calendar, {
      button: 0,
      clientX: 200,
      clientY: 20,
      pointerId: 1,
    })
    await fireEvent.pointerUp(calendar, {
      clientX: 100,
      clientY: 22,
      pointerId: 1,
    })
    expect(screen.getByRole('grid', { name: 'July 2026' })).toBeTruthy()

    await view.rerender({ disabled: false })
    await fireEvent.pointerDown(calendar, {
      button: 2,
      clientX: 200,
      clientY: 20,
      pointerId: 2,
    })
    await fireEvent.pointerUp(calendar, {
      clientX: 100,
      clientY: 22,
      pointerId: 2,
    })
    expect(screen.getByRole('grid', { name: 'July 2026' })).toBeTruthy()
  })
})
