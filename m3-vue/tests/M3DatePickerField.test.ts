import type { Component } from 'vue'

import { defineComponent } from 'vue'
import { fireEvent } from '@testing-library/vue'
import { h, nextTick } from 'vue'
import { render, screen, waitFor } from '@testing-library/vue'

import { M3DatePickerField } from '@/components/date-picker'

describe('m3-vue/date-picker-field', () => {
  test('exposes its root and accepts a valid date without a change handler', async () => {
    const reference = { current: null as { el: HTMLElement } | null }
    const view = render(defineComponent({
      setup: () => () => h(M3DatePickerField as Component, {
        ref: (instance: { el: HTMLElement } | null) => { reference.current = instance },
        value: null,
      }),
    }))
    const input = screen.getByRole('textbox', { name: 'Select date' }) as HTMLInputElement

    expect(reference.current?.el).toBe(view.container.firstElementChild)

    await fireEvent.update(input, '07/15/2026')
    await fireEvent.change(input)
    expect(input.value).toBe('07/15/2026')
  })

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

  test('opens by clicking the field only while editable', async () => {
    const value = new Date(2026, 6, 10)
    const view = render(M3DatePickerField, {
      props: { value, readonly: true },
    })
    const input = screen.getByRole('textbox', { name: 'Select date' })

    await fireEvent.click(input)
    expect(screen.queryByRole('grid', { name: 'July 2026' })).toBeNull()

    await view.rerender({ readonly: false })
    await fireEvent.click(input)

    await waitFor(() => {
      expect(screen.getByRole('grid', { name: 'July 2026' })).toBeTruthy()
    })
  })

  test('toggles its docked picker with the trailing button', async () => {
    render(M3DatePickerField, {
      props: { value: new Date(2026, 6, 10) },
    })
    const chooseDate = screen.getByRole('button', { name: 'Choose date' })

    await fireEvent.click(chooseDate)
    await waitFor(() => {
      expect(screen.getByRole('grid', { name: 'July 2026' })).toBeTruthy()
    })

    await fireEvent.click(chooseDate)
    await waitFor(() => {
      expect(document.body.querySelector('.m3-popper_shown')).toBeNull()
    })
  })

  test('omits supporting text when explicitly empty', () => {
    const { container } = render(M3DatePickerField, {
      props: { supportingText: '' },
    })

    expect(container.querySelector('.m3-date-picker-field__supporting-text')).toBeNull()
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

  test('allows clearing the date and rejects dates outside configured availability', async () => {
    const view = render(M3DatePickerField, {
      props: {
        value: new Date(2026, 6, 10),
        min: new Date(2026, 6, 5),
        max: new Date(2026, 6, 20),
        availability: {
          isDateSelectable: (date: Date) => date.getDate() !== 15,
        },
      },
    })
    const input = screen.getByRole('textbox', { name: 'Select date' }) as HTMLInputElement

    await fireEvent.update(input, '')
    await fireEvent.change(input)
    expect(view.emitted().change?.at(-1)).toEqual([null])
    expect(input.getAttribute('aria-invalid')).toBe('false')

    await fireEvent.update(input, '07/04/2026')
    await fireEvent.change(input)
    expect(input.getAttribute('aria-invalid')).toBe('true')

    await fireEvent.update(input, '07/15/2026')
    await fireEvent.change(input)
    expect(input.getAttribute('aria-invalid')).toBe('true')

    await fireEvent.update(input, '07/16/2026')
    await fireEvent.change(input)
    expect(view.emitted().change?.at(-1)).toEqual([new Date(2026, 6, 16)])
    expect(input.getAttribute('aria-invalid')).toBe('false')
  })

  test('keeps an empty calendar draft unconfirmed', async () => {
    const view = render(M3DatePickerField)

    await fireEvent.click(screen.getByRole('button', { name: 'Choose date' }))
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'OK' }).hasAttribute('disabled')).toBe(true)
    })

    await fireEvent.click(screen.getByRole('button', { name: 'OK' }))
    expect(view.emitted().change).toBeUndefined()
  })

  test('replaces invalid text and calendar draft when the parent value changes', async () => {
    const view = render(M3DatePickerField, {
      props: { value: new Date(2026, 6, 10) },
    })
    const input = screen.getByRole('textbox', { name: 'Select date' }) as HTMLInputElement

    await fireEvent.update(input, '02/31/2026')
    await fireEvent.change(input)
    expect(input.getAttribute('aria-invalid')).toBe('true')

    await view.rerender({ value: new Date(2026, 6, 15) })
    expect(input.value).toBe('07/15/2026')
    expect(input.getAttribute('aria-invalid')).toBe('false')

    await fireEvent.click(screen.getByRole('button', { name: 'Choose date' }))
    await waitFor(() => {
      expect(screen.getByRole('gridcell', { name: 'Wednesday, July 15, 2026' }).getAttribute('aria-selected')).toBe('true')
    })
  })

  test('supports field composition classes and supporting text slot', async () => {
    const { container } = render(M3DatePickerField, {
      props: {
        value: new Date(2026, 6, 10),
        class: 'trip-date',
        popperClass: ['trip-date-popper', { 'trip-date-popper_active': true }],
      },
      slots: {
        label: '<span data-testid="field-label">Trip date</span>',
        'leading-icon': '<span data-testid="leading-icon">Calendar</span>',
        'supporting-text': '<span data-testid="supporting-text">Use local date</span>',
      },
    })

    expect(container.querySelector('.trip-date .m3-text-field')).toBeTruthy()
    expect(screen.getByTestId('field-label').textContent).toBe('Trip date')
    expect(screen.getByTestId('leading-icon').textContent).toBe('Calendar')
    expect(screen.getByTestId('supporting-text').textContent).toBe('Use local date')

    await fireEvent.click(screen.getByRole('button', { name: 'Choose date' }))

    await waitFor(() => {
      expect(document.querySelector('.m3-date-picker-field__popper.trip-date-popper.trip-date-popper_active')).toBeTruthy()
    })
  })
})
