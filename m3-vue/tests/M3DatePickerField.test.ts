import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/vue'

import { nextTick } from 'vue'

import { M3DatePickerField } from '@/components/date-picker'

describe('m3-vue/date-picker-field', () => {
  const OriginalResizeObserver = globalThis.ResizeObserver

  beforeAll(() => {
    vi.stubGlobal('ResizeObserver', class {
      observe () {}
      unobserve () {}
      disconnect () {}
    })
  })

  afterAll(() => {
    if (OriginalResizeObserver) {
      vi.stubGlobal('ResizeObserver', OriginalResizeObserver)
    } else {
      vi.unstubAllGlobals()
    }
  })

  test('commits a docked calendar draft only after confirmation', async () => {
    const view = render(M3DatePickerField, {
      props: {
        value: new Date(2026, 6, 10),
      },
    })

    const input = screen.getByRole('textbox', { name: 'Select date' }) as HTMLInputElement

    expect(input.value).toBe('07/10/2026')

    await fireEvent.click(screen.getByRole('button', { name: 'Choose date' }))

    await waitFor(() => {
      expect(screen.getByRole('grid', { name: 'July 2026' })).toBeTruthy()
    })

    const calendar = screen.getByRole('grid', { name: 'July 2026' })
    const picker = calendar.closest('.m3-date-picker')

    expect(picker?.classList.contains('m3-date-picker_docked')).toBe(true)
    expect(picker?.querySelector('.m3-date-picker__header')).toBeNull()
    expect(calendar.children).toHaveLength(5)

    await fireEvent.click(screen.getByRole('gridcell', { name: 'Wednesday, July 15, 2026' }))

    expect(view.emitted().change).toBeUndefined()
    expect(input.value).toBe('07/10/2026')

    await fireEvent.click(screen.getByRole('button', { name: 'OK' }))

    expect(view.emitted().change?.[0]).toEqual([new Date(2026, 6, 15)])
    expect(view.emitted()['update:value']?.[0]).toEqual([new Date(2026, 6, 15)])
    expect(input.value).toBe('07/15/2026')
  })

  test('uses month and year lists and discards a cancelled draft', async () => {
    const view = render(M3DatePickerField, {
      props: {
        value: new Date(2026, 6, 10),
      },
    })

    await fireEvent.click(screen.getByRole('button', { name: 'Choose date' }))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Switch to month selection' })).toBeTruthy()
    })

    await fireEvent.click(screen.getByRole('button', { name: 'Switch to month selection' }))

    const monthList = screen.getByRole('list', { name: 'Select month' })
    expect(monthList.closest('.m3-month-picker_list')).toBeTruthy()
    expect(monthList.querySelector('.m3-list-item_selected')?.textContent).toContain('July')
    expect(monthList.querySelector('.m3-date-picker-option_current')).toBeNull()
    expect(screen.getByRole('button', { name: 'Switch to year selection' }).hasAttribute('disabled')).toBe(true)
    expect(screen.queryByRole('button', { name: 'Previous year' })).toBeNull()
    expect(screen.queryByRole('button', { name: 'Cancel' })).toBeNull()

    await fireEvent.click(screen.getByRole('button', { name: 'January' }))
    await fireEvent.click(screen.getByRole('button', { name: 'Switch to year selection' }))

    const yearList = screen.getByRole('list', { name: 'Select year' })
    expect(yearList.closest('.m3-year-picker_list')).toBeTruthy()
    expect(yearList.querySelector('.m3-list-item_selected')?.textContent).toContain('2026')
    expect(yearList.querySelector('.m3-date-picker-option_current')).toBeNull()
    expect(screen.getByRole('button', { name: 'Switch to month selection' }).hasAttribute('disabled')).toBe(true)
    expect(screen.queryByRole('button', { name: 'Previous year' })).toBeNull()
    expect(screen.queryByRole('button', { name: 'Cancel' })).toBeNull()

    await fireEvent.click(screen.getByRole('button', { name: '2026' }))
    await fireEvent.click(screen.getByRole('gridcell', { name: 'Thursday, January 15, 2026' }))
    await fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(view.emitted().change).toBeUndefined()
    expect((screen.getByRole('textbox', { name: 'Select date' }) as HTMLInputElement).value).toBe('07/10/2026')
  })

  test('normalizes typed date input and rejects invalid dates', async () => {
    const view = render(M3DatePickerField, {
      props: {
        value: null,
      },
    })

    const input = screen.getByRole('textbox', { name: 'Select date' }) as HTMLInputElement

    input.value = '7-5-2026'
    input.dispatchEvent(new Event('input'))
    await nextTick()
    input.dispatchEvent(new Event('change'))
    await nextTick()

    expect(view.emitted().change?.[0]).toEqual([new Date(2026, 6, 5)])
    expect(view.emitted()['update:value']?.[0]).toEqual([new Date(2026, 6, 5)])
    expect(input.value).toBe('07/05/2026')
    expect(input.getAttribute('aria-invalid')).toBe('false')

    input.value = '02/31/2026'
    input.dispatchEvent(new Event('input'))
    await nextTick()
    input.dispatchEvent(new Event('change'))
    await nextTick()

    expect(view.emitted().change).toHaveLength(1)
    expect(input.getAttribute('aria-invalid')).toBe('true')
  })

  test('supports field composition classes and supporting text slot', async () => {
    const { container } = render(M3DatePickerField, {
      props: {
        value: new Date(2026, 6, 10),
        class: 'trip-date',
        popperClass: ['trip-date-popper', { 'trip-date-popper_active': true }],
      },
      slots: {
        'supporting-text': '<span data-testid="supporting-text">Use local date</span>',
      },
    })

    expect(container.querySelector('.trip-date .m3-text-field')).toBeTruthy()
    expect(screen.getByTestId('supporting-text').textContent).toBe('Use local date')

    await fireEvent.click(screen.getByRole('button', { name: 'Choose date' }))

    await waitFor(() => {
      expect(document.querySelector('.m3-date-picker-field__popper.trip-date-popper.trip-date-popper_active')).toBeTruthy()
    })
  })
})
