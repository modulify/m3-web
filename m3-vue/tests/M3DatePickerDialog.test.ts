import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/vue'

import { M3DatePickerDialog } from '@/components/date-picker'

const getInputByLabel = (label: string): HTMLInputElement => {
  const input = screen.getAllByLabelText(label).find((element): element is HTMLInputElement => element instanceof HTMLInputElement)

  if (!input) {
    throw new Error(`Input ${label} was not found`)
  }

  return input
}

describe('m3-vue/date-picker-dialog', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  test('starts closed when opened is omitted', () => {
    render(M3DatePickerDialog)

    expect(screen.queryByRole('dialog')).toBeNull()
  })

  test('forwards calendar cursor changes and closes on Escape', async () => {
    const view = render(M3DatePickerDialog, {
      props: {
        value: new Date(2026, 6, 10),
        opened: true,
      },
    })

    await fireEvent.click(screen.getByRole('button', { name: 'Next month' }))
    await waitFor(() => {
      expect(view.emitted()['update:cursor']?.[0]).toEqual([new Date(2026, 7, 1)])
    })

    await fireEvent.keyDown(document, { key: 'Escape' })
    await waitFor(() => {
      expect(view.emitted()['update:opened']?.[0]).toEqual([false])
    })
  })

  test('commits selected date only after confirmation', async () => {
    const view = render(M3DatePickerDialog, {
      props: {
        opened: true,
        value: new Date(2026, 6, 10),
      },
    })

    await waitFor(() => {
      expect(screen.getByRole('grid', { name: 'July 2026' })).toBeTruthy()
    })

    await fireEvent.click(screen.getByRole('gridcell', { name: 'Wednesday, July 15, 2026' }))

    expect(view.emitted().change).toBeUndefined()
    expect(view.emitted()['update:value']).toBeUndefined()

    await fireEvent.click(screen.getByRole('button', { name: 'OK' }))

    expect(view.emitted().change?.[0]).toEqual([new Date(2026, 6, 15)])
    expect(view.emitted()['update:value']?.[0]).toEqual([new Date(2026, 6, 15)])
    expect(view.emitted()['update:opened']?.[0]).toEqual([false])
  })

  test('discards draft date when cancelled', async () => {
    const view = render(M3DatePickerDialog, {
      props: {
        opened: true,
        value: new Date(2026, 6, 10),
      },
    })

    await waitFor(() => {
      expect(screen.getByRole('grid', { name: 'July 2026' })).toBeTruthy()
    })

    await fireEvent.click(screen.getByRole('gridcell', { name: 'Wednesday, July 15, 2026' }))
    await fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(view.emitted().change).toBeUndefined()
    expect(view.emitted()['update:value']).toBeUndefined()
    expect(view.emitted()['update:opened']?.[0]).toEqual([false])
  })

  test('commits date entered in input mode only after confirmation', async () => {
    const view = render(M3DatePickerDialog, {
      props: {
        opened: true,
        appearance: 'input',
        value: new Date(2026, 6, 10),
      },
    })

    await fireEvent.update(getInputByLabel('Date'), '07/15/2026')

    expect(view.emitted().change).toBeUndefined()
    expect(view.emitted()['update:value']).toBeUndefined()

    await fireEvent.click(screen.getByRole('button', { name: 'OK' }))

    expect(view.emitted().change?.[0]).toEqual([new Date(2026, 6, 15)])
    expect(view.emitted()['update:value']?.[0]).toEqual([new Date(2026, 6, 15)])
  })

  test('uses modal date input layout for text entry mode', () => {
    render(M3DatePickerDialog, {
      props: {
        opened: true,
        appearance: 'input',
        type: 'range',
        value: [new Date(2026, 6, 10), new Date(2026, 6, 12)],
      },
    })

    const dialog = screen.getByRole('dialog')
    const inputPanel = screen.getByRole('group', { name: 'Select date' })

    expect(dialog.classList.contains('m3-date-picker-dialog_input')).toBe(true)
    expect(dialog.style.width).toBe('328px')
    expect(inputPanel.classList.contains('m3-date-picker_input-range')).toBe(true)
    expect(getInputByLabel('Date')).toBeTruthy()
    expect(getInputByLabel('End date')).toBeTruthy()
  })

  test('switches from input mode to calendar mode', async () => {
    const view = render(M3DatePickerDialog, {
      props: {
        opened: true,
        appearance: 'input',
        value: new Date(2026, 6, 10),
      },
    })

    await fireEvent.click(screen.getByRole('button', { name: 'Switch to calendar input' }))

    expect(view.emitted()['update:appearance']?.[0]).toEqual(['picker'])

    await waitFor(() => {
      expect(screen.getByRole('grid', { name: 'July 2026' })).toBeTruthy()
    })
  })

  test('switches from calendar mode to text input without committing its draft', async () => {
    const view = render(M3DatePickerDialog, {
      props: {
        opened: true,
        value: new Date(2026, 6, 10),
      },
    })

    await fireEvent.click(screen.getByRole('button', { name: 'Switch to text input' }))

    expect(view.emitted()['update:appearance']?.[0]).toEqual(['input'])
    expect(getInputByLabel('Date').value).toBe('07/10/2026')
    expect(view.emitted().change).toBeUndefined()
    expect(view.emitted()['update:value']).toBeUndefined()
  })

  test('follows an explicit appearance change while open', async () => {
    const view = render(M3DatePickerDialog, {
      props: {
        opened: true,
        appearance: 'picker',
        value: new Date(2026, 6, 10),
      },
    })

    expect(screen.getByRole('grid', { name: 'July 2026' })).toBeTruthy()

    await view.rerender({ appearance: 'input' })
    expect(getInputByLabel('Date').value).toBe('07/10/2026')

    await view.rerender({ appearance: undefined })
    expect(getInputByLabel('Date').value).toBe('07/10/2026')
  })

  test('blocks invalid input mode date confirmation', async () => {
    const view = render(M3DatePickerDialog, {
      props: {
        opened: true,
        appearance: 'input',
        value: new Date(2026, 6, 10),
      },
    })

    await fireEvent.update(getInputByLabel('Date'), '07/32/2026')
    await fireEvent.click(screen.getByRole('button', { name: 'OK' }))

    expect(view.emitted().change).toBeUndefined()
    expect(view.emitted()['update:value']).toBeUndefined()
    expect((screen.getByRole('button', { name: 'OK' }) as HTMLButtonElement).disabled).toBe(true)
  })

  test('commits date range entered in input mode only after confirmation', async () => {
    const view = render(M3DatePickerDialog, {
      props: {
        opened: true,
        appearance: 'input',
        type: 'range',
        value: [new Date(2026, 6, 10), new Date(2026, 6, 12)],
      },
    })

    await fireEvent.update(getInputByLabel('End date'), '07/15/2026')

    expect(view.emitted().change).toBeUndefined()
    expect(view.emitted()['update:value']).toBeUndefined()

    await fireEvent.click(screen.getByRole('button', { name: 'OK' }))

    expect(view.emitted().change?.[0]).toEqual([[
      new Date(2026, 6, 10),
      new Date(2026, 6, 15),
    ]])

    expect(view.emitted()['update:value']?.[0]).toEqual([[
      new Date(2026, 6, 10),
      new Date(2026, 6, 15),
    ]])
  })

  test('rejects a range whose end precedes its start, then accepts a corrected end', async () => {
    const view = render(M3DatePickerDialog, {
      props: {
        opened: true,
        appearance: 'input',
        type: 'range',
        value: [new Date(2026, 6, 10), new Date(2026, 6, 12)],
      },
    })

    await fireEvent.update(getInputByLabel('End date'), '07/05/2026')
    expect((screen.getByRole('button', { name: 'OK' }) as HTMLButtonElement).disabled).toBe(true)
    expect(view.emitted().change).toBeUndefined()

    await fireEvent.update(getInputByLabel('End date'), '07/15/2026')
    expect((screen.getByRole('button', { name: 'OK' }) as HTMLButtonElement).disabled).toBe(false)

    await fireEvent.click(screen.getByRole('button', { name: 'OK' }))
    expect(view.emitted().change?.[0]).toEqual([[
      new Date(2026, 6, 10),
      new Date(2026, 6, 15),
    ]])
  })

  test('keeps a valid range draft when text entry becomes invalid', async () => {
    const view = render(M3DatePickerDialog, {
      props: {
        appearance: 'input',
        type: 'range',
        value: [new Date(2026, 6, 10), new Date(2026, 6, 12)],
        opened: true,
      },
    })

    const end = getInputByLabel('End date')
    await fireEvent.update(end, 'not a date')

    expect(end.getAttribute('aria-invalid')).toBe('true')
    expect((screen.getByRole('button', { name: 'OK' }) as HTMLButtonElement).disabled).toBe(true)
    expect(view.emitted().change).toBeUndefined()
  })

  test('rejects dates outside bounds and dates excluded by availability', async () => {
    const view = render(M3DatePickerDialog, {
      props: {
        opened: true,
        appearance: 'input',
        value: new Date(2026, 6, 10),
        min: new Date(2026, 6, 5),
        max: new Date(2026, 6, 20),
        availability: {
          isDateSelectable: (date: Date) => date.getDate() !== 15,
        },
      },
    })

    const date = getInputByLabel('Date')
    await fireEvent.update(date, '07/04/2026')
    expect((screen.getByRole('button', { name: 'OK' }) as HTMLButtonElement).disabled).toBe(true)

    await fireEvent.update(date, '07/15/2026')
    expect((screen.getByRole('button', { name: 'OK' }) as HTMLButtonElement).disabled).toBe(true)

    await fireEvent.update(date, '07/16/2026')
    await fireEvent.click(screen.getByRole('button', { name: 'OK' }))
    expect(view.emitted().change?.[0]).toEqual([new Date(2026, 6, 16)])
  })

  test('hides the mode switch when text entry is fixed', () => {
    render(M3DatePickerDialog, {
      props: {
        appearance: 'input',
        switchable: false,
        value: new Date(2026, 6, 10),
        opened: true,
      },
    })

    expect(getInputByLabel('Date').value).toBe('07/10/2026')
    expect(screen.queryByRole('button', { name: 'Switch to calendar input' })).toBeNull()
  })

  test('opens an empty calendar with confirmation unavailable', async () => {
    render(M3DatePickerDialog, {
      props: {
        value: null,
        cursor: new Date(2026, 6, 1),
        opened: true,
      },
    })

    await waitFor(() => {
      expect(screen.getByRole('grid', { name: 'July 2026' })).toBeTruthy()
    })
    expect((screen.getByRole('button', { name: 'OK' }) as HTMLButtonElement).disabled).toBe(true)
  })

  test('requires both dates before confirming a range built from empty fields', async () => {
    const view = render(M3DatePickerDialog, {
      props: {
        opened: true,
        appearance: 'input',
        type: 'range',
        value: null,
      },
    })

    const start = getInputByLabel('Date')
    const end = getInputByLabel('End date')
    const confirm = screen.getByRole('button', { name: 'OK' }) as HTMLButtonElement
    expect(start.value).toBe('')
    expect(end.value).toBe('')
    expect(confirm.disabled).toBe(true)

    await fireEvent.update(start, '07/10/2026')
    expect(confirm.disabled).toBe(true)

    await fireEvent.update(end, '07/15/2026')
    expect(confirm.disabled).toBe(false)

    await fireEvent.update(start, '')
    expect(confirm.disabled).toBe(true)
    expect(view.emitted().change).toBeUndefined()

    await fireEvent.update(start, '07/10/2026')
    await fireEvent.click(confirm)
    expect(view.emitted().change?.[0]).toEqual([[
      new Date(2026, 6, 10),
      new Date(2026, 6, 15),
    ]])
  })

  test('keeps a partially selected range pending', () => {
    render(M3DatePickerDialog, {
      props: {
        appearance: 'input',
        type: 'range',
        value: [new Date(2026, 6, 10), null],
        opened: true,
      },
    })

    expect(getInputByLabel('Date').value).toBe('07/10/2026')
    expect(getInputByLabel('End date').value).toBe('')
    expect((screen.getByRole('button', { name: 'OK' }) as HTMLButtonElement).disabled).toBe(true)
  })

  test('resets unconfirmed text edits when the dialog reopens with a new value', async () => {
    const view = render(M3DatePickerDialog, {
      props: {
        opened: true,
        appearance: 'input',
        value: new Date(2026, 6, 10),
      },
    })

    await fireEvent.update(getInputByLabel('Date'), '07/15/2026')
    await view.rerender({ opened: false })
    await view.rerender({ opened: true, value: new Date(2026, 6, 12) })

    expect(getInputByLabel('Date').value).toBe('07/12/2026')
  })

  test('builds a range from two calendar selections before confirming', async () => {
    const view = render(M3DatePickerDialog, {
      props: {
        opened: true,
        type: 'range',
        value: null,
        cursor: new Date(2026, 6, 1),
        cancelText: 'Discard',
        confirmText: 'Apply',
        class: 'booking-picker',
        style: { width: '400px' },
      },
    })

    await waitFor(() => {
      expect(screen.getByRole('grid', { name: 'July 2026' })).toBeTruthy()
    })

    const apply = screen.getByRole('button', { name: 'Apply' }) as HTMLButtonElement
    const dialog = screen.getByRole('dialog')

    expect(apply.disabled).toBe(true)
    expect(dialog.classList.contains('booking-picker')).toBe(true)
    expect(dialog.style.width).toBe('400px')

    await fireEvent.click(screen.getByRole('gridcell', { name: 'Friday, July 10, 2026' }))
    expect(apply.disabled).toBe(true)

    await fireEvent.click(screen.getByRole('gridcell', { name: 'Wednesday, July 15, 2026' }))
    expect(apply.disabled).toBe(false)

    await fireEvent.click(apply)
    expect(view.emitted().change?.[0]).toEqual([[
      new Date(2026, 6, 10),
      new Date(2026, 6, 15),
    ]])
  })
})
