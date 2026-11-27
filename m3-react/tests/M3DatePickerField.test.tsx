import type { M3DatePickerFieldExposed } from '@/components/date-picker'

import { createRef } from 'react'
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'

import { M3DatePickerField } from '@/components/date-picker'

describe('m3-react/date-picker-field', () => {
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

  test('exposes its root and accepts a valid date without a change handler', () => {
    const reference = createRef<M3DatePickerFieldExposed>()
    const { container } = render(<M3DatePickerField ref={reference} value={null} />)
    const input = screen.getByRole('textbox', { name: 'Select date' }) as HTMLInputElement

    expect(reference.current?.el).toBe(container.firstElementChild)

    fireEvent.change(input, { target: { value: '07/15/2026' } })
    expect(input.value).toBe('07/15/2026')
  })

  test('commits a docked calendar draft only after confirmation', async () => {
    const onChange = vi.fn()

    render(
      <M3DatePickerField
        value={new Date(2026, 6, 10)}
        onChange={onChange}
      />
    )

    const input = screen.getByRole('textbox', { name: 'Select date' }) as HTMLInputElement

    expect(input.value).toBe('07/10/2026')

    fireEvent.click(screen.getByRole('button', { name: 'Choose date' }))

    await waitFor(() => {
      expect(screen.getByRole('grid', { name: 'July 2026' })).toBeTruthy()
    })

    const calendar = screen.getByRole('grid', { name: 'July 2026' })
    const picker = calendar.closest('.m3-date-picker')

    expect(picker?.classList.contains('m3-date-picker_docked')).toBe(true)
    expect(picker?.querySelector('.m3-date-picker__header')).toBeNull()
    expect(calendar.children).toHaveLength(5)

    fireEvent.click(screen.getByRole('gridcell', { name: 'Wednesday, July 15, 2026' }))

    expect(onChange).not.toHaveBeenCalled()
    expect(input.value).toBe('07/10/2026')

    fireEvent.click(screen.getByRole('button', { name: 'OK' }))

    expect(onChange).toHaveBeenCalledWith(new Date(2026, 6, 15))
    expect(input.value).toBe('07/15/2026')
  })

  test('opens by clicking the field only while editable', async () => {
    const value = new Date(2026, 6, 10)
    const view = render(<M3DatePickerField value={value} readonly />)
    const input = screen.getByRole('textbox', { name: 'Select date' })

    fireEvent.click(input)
    expect(screen.queryByRole('grid', { name: 'July 2026' })).toBeNull()

    view.rerender(<M3DatePickerField value={value} />)
    fireEvent.click(input)

    await waitFor(() => {
      expect(screen.getByRole('grid', { name: 'July 2026' })).toBeTruthy()
    })
  })

  test('toggles its docked picker with the trailing button', async () => {
    render(<M3DatePickerField value={new Date(2026, 6, 10)} />)
    const chooseDate = screen.getByRole('button', { name: 'Choose date' })

    fireEvent.click(chooseDate)
    await waitFor(() => {
      expect(screen.getByRole('grid', { name: 'July 2026' })).toBeTruthy()
    })

    fireEvent.click(chooseDate)
    await waitFor(() => {
      expect(document.body.querySelector('.m3-popper_shown')).toBeNull()
    })
  })

  test('omits supporting text when explicitly empty', () => {
    const { container } = render(<M3DatePickerField supportingText="" />)

    expect(container.querySelector('.m3-date-picker-field__supporting-text')).toBeNull()
  })

  test('uses month and year lists and discards a cancelled draft', async () => {
    const onChange = vi.fn()

    render(
      <M3DatePickerField
        value={new Date(2026, 6, 10)}
        onChange={onChange}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: 'Choose date' }))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Switch to month selection' })).toBeTruthy()
    })

    fireEvent.click(screen.getByRole('button', { name: 'Switch to month selection' }))

    const monthList = screen.getByRole('list', { name: 'Select month' })
    expect(monthList.closest('.m3-month-picker_list')).toBeTruthy()
    expect(monthList.querySelector('.m3-list-item_selected')?.textContent).toContain('July')
    expect(monthList.querySelector('.m3-date-picker-option_current')).toBeNull()
    expect(screen.getByRole('button', { name: 'Switch to year selection' }).hasAttribute('disabled')).toBe(true)
    expect(screen.queryByRole('button', { name: 'Previous year' })).toBeNull()
    expect(screen.queryByRole('button', { name: 'Cancel' })).toBeNull()

    fireEvent.click(screen.getByRole('button', { name: 'January' }))
    fireEvent.click(screen.getByRole('button', { name: 'Switch to year selection' }))

    const yearList = screen.getByRole('list', { name: 'Select year' })
    expect(yearList.closest('.m3-year-picker_list')).toBeTruthy()
    expect(yearList.querySelector('.m3-list-item_selected')?.textContent).toContain('2026')
    expect(yearList.querySelector('.m3-date-picker-option_current')).toBeNull()
    expect(screen.getByRole('button', { name: 'Switch to month selection' }).hasAttribute('disabled')).toBe(true)
    expect(screen.queryByRole('button', { name: 'Previous year' })).toBeNull()
    expect(screen.queryByRole('button', { name: 'Cancel' })).toBeNull()

    fireEvent.click(screen.getByRole('button', { name: '2026' }))
    fireEvent.click(screen.getByRole('gridcell', { name: 'Thursday, January 15, 2026' }))
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(onChange).not.toHaveBeenCalled()
    expect((screen.getByRole('textbox', { name: 'Select date' }) as HTMLInputElement).value).toBe('07/10/2026')
  })

  test('normalizes typed date input and rejects invalid dates', () => {
    const onChange = vi.fn()

    render(
      <M3DatePickerField
        value={null}
        onChange={onChange}
      />
    )

    const input = screen.getByRole('textbox', { name: 'Select date' }) as HTMLInputElement

    fireEvent.input(input, { target: { value: '7-5-2026' } })
    fireEvent.change(input, { target: { value: '7-5-2026' } })

    expect(onChange).toHaveBeenCalledWith(new Date(2026, 6, 5))
    expect(input.value).toBe('07/05/2026')
    expect(input.getAttribute('aria-invalid')).toBe('false')

    const callsAfterValidInput = onChange.mock.calls.length

    fireEvent.input(input, { target: { value: '02/31/2026' } })
    fireEvent.change(input, { target: { value: '02/31/2026' } })

    expect(onChange).toHaveBeenCalledTimes(callsAfterValidInput)
    expect(input.getAttribute('aria-invalid')).toBe('true')
  })

  test('clears a typed date and rejects dates outside its bounds or availability', () => {
    const onChange = vi.fn()

    render(
      <M3DatePickerField
        value={new Date(2026, 6, 10)}
        min={new Date(2026, 6, 5)}
        max={new Date(2026, 6, 20)}
        availability={{ isDateSelectable: (date) => date.getDate() !== 15 }}
        onChange={onChange}
      />
    )

    const input = screen.getByRole('textbox', { name: 'Select date' }) as HTMLInputElement

    fireEvent.input(input, { target: { value: '' } })
    fireEvent.change(input, { target: { value: '' } })
    expect(onChange).toHaveBeenLastCalledWith(null)
    expect(input.getAttribute('aria-invalid')).toBe('false')

    for (const date of ['07/25/2026', '07/15/2026']) {
      fireEvent.input(input, { target: { value: date } })
      fireEvent.change(input, { target: { value: date } })
      expect(input.getAttribute('aria-invalid')).toBe('true')
    }

    expect(onChange).toHaveBeenCalledTimes(1)

    fireEvent.input(input, { target: { value: '07/18/2026' } })
    fireEvent.change(input, { target: { value: '07/18/2026' } })
    expect(onChange).toHaveBeenLastCalledWith(new Date(2026, 6, 18))
    expect(input.getAttribute('aria-invalid')).toBe('false')
  })

  test('keeps an empty calendar draft unconfirmed', async () => {
    const onChange = vi.fn()

    render(<M3DatePickerField onChange={onChange} />)

    fireEvent.click(screen.getByRole('button', { name: 'Choose date' }))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'OK' }).hasAttribute('disabled')).toBe(true)
    })

    fireEvent.click(screen.getByRole('button', { name: 'OK' }))
    expect(onChange).not.toHaveBeenCalled()
  })

  test('replaces invalid text and calendar draft when the parent value changes', async () => {
    const view = render(<M3DatePickerField value={new Date(2026, 6, 10)} />)
    const input = screen.getByRole('textbox', { name: 'Select date' }) as HTMLInputElement

    fireEvent.input(input, { target: { value: '02/31/2026' } })
    fireEvent.change(input, { target: { value: '02/31/2026' } })
    expect(input.getAttribute('aria-invalid')).toBe('true')

    view.rerender(<M3DatePickerField value={new Date(2026, 6, 15)} />)
    expect(input.value).toBe('07/15/2026')
    expect(input.getAttribute('aria-invalid')).toBe('false')

    fireEvent.click(screen.getByRole('button', { name: 'Choose date' }))
    await waitFor(() => {
      expect(screen.getByRole('gridcell', { name: 'Wednesday, July 15, 2026' }).getAttribute('aria-selected')).toBe('true')
    })
  })

  test('supports field composition classes and rich supporting text', async () => {
    const { container } = render(
      <M3DatePickerField
        value={new Date(2026, 6, 10)}
        className="trip-date"
        popperClassName={['trip-date-popper', { 'trip-date-popper_active': true }]}
        supportingText={<span data-testid="supporting-text">Use local date</span>}
      />
    )

    expect(container.querySelector('.trip-date .m3-text-field')).toBeTruthy()
    expect(screen.getByTestId('supporting-text').textContent).toBe('Use local date')

    fireEvent.click(screen.getByRole('button', { name: 'Choose date' }))

    await waitFor(() => {
      expect(document.querySelector('.m3-date-picker-field__popper.trip-date-popper.trip-date-popper_active')).toBeTruthy()
    })
  })
})
