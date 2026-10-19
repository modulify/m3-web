import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'

import { M3DatePickerDialog } from '@/components/date-picker'

const getInputByLabel = (label: string): HTMLInputElement => {
  const input = screen.getAllByLabelText(label).find((element): element is HTMLInputElement => element instanceof HTMLInputElement)

  if (!input) {
    throw new Error(`Input ${label} was not found`)
  }

  return input
}

describe('m3-react/date-picker-dialog', () => {
  test('commits selected date only after confirmation', async () => {
    const onChange = vi.fn()
    const onToggle = vi.fn()

    render(
      <M3DatePickerDialog
        opened={true}
        value={new Date(2026, 6, 10)}
        onChange={onChange}
        onToggle={onToggle}
      />
    )

    await waitFor(() => {
      expect(screen.getByRole('grid', { name: 'July 2026' })).toBeTruthy()
    })

    fireEvent.click(screen.getByRole('gridcell', { name: 'Wednesday, July 15, 2026' }))

    expect(onChange).not.toHaveBeenCalled()

    fireEvent.click(screen.getByRole('button', { name: 'OK' }))

    expect(onChange).toHaveBeenCalledWith(new Date(2026, 6, 15))
    expect(onToggle).toHaveBeenCalledWith(false)
  })

  test('discards draft date when cancelled', async () => {
    const onChange = vi.fn()
    const onToggle = vi.fn()

    render(
      <M3DatePickerDialog
        opened={true}
        value={new Date(2026, 6, 10)}
        onChange={onChange}
        onToggle={onToggle}
      />
    )

    await waitFor(() => {
      expect(screen.getByRole('grid', { name: 'July 2026' })).toBeTruthy()
    })

    fireEvent.click(screen.getByRole('gridcell', { name: 'Wednesday, July 15, 2026' }))
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(onChange).not.toHaveBeenCalled()
    expect(onToggle).toHaveBeenCalledWith(false)
  })

  test('commits date entered in input mode only after confirmation', () => {
    const onChange = vi.fn()

    render(
      <M3DatePickerDialog
        opened={true}
        appearance="input"
        value={new Date(2026, 6, 10)}
        onChange={onChange}
      />
    )

    fireEvent.input(getInputByLabel('Date'), {
      target: {
        value: '07/15/2026',
      },
    })

    expect(onChange).not.toHaveBeenCalled()

    fireEvent.click(screen.getByRole('button', { name: 'OK' }))

    expect(onChange).toHaveBeenCalledWith(new Date(2026, 6, 15))
  })

  test('uses modal date input layout for text entry mode', () => {
    render(
      <M3DatePickerDialog
        opened={true}
        appearance="input"
        type="range"
        value={[
          new Date(2026, 6, 10),
          new Date(2026, 6, 12),
        ]}
      />
    )

    const dialog = screen.getByRole('dialog')
    const inputPanel = screen.getByRole('group', { name: 'Select date' })

    expect(dialog.classList.contains('m3-date-picker-dialog_input')).toBe(true)
    expect(dialog.style.width).toBe('328px')
    expect(inputPanel.classList.contains('m3-date-picker_input-range')).toBe(true)
    expect(getInputByLabel('Date')).toBeTruthy()
    expect(getInputByLabel('End date')).toBeTruthy()
  })

  test('switches from input mode to calendar mode', async () => {
    const onAppearanceChange = vi.fn()

    render(
      <M3DatePickerDialog
        opened={true}
        appearance="input"
        value={new Date(2026, 6, 10)}
        onAppearanceChange={onAppearanceChange}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: 'Switch to calendar input' }))

    expect(onAppearanceChange).toHaveBeenCalledWith('picker')

    await waitFor(() => {
      expect(screen.getByRole('grid', { name: 'July 2026' })).toBeTruthy()
    })
  })

  test('blocks invalid input mode date confirmation', () => {
    const onChange = vi.fn()

    render(
      <M3DatePickerDialog
        opened={true}
        appearance="input"
        value={new Date(2026, 6, 10)}
        onChange={onChange}
      />
    )

    fireEvent.input(getInputByLabel('Date'), {
      target: {
        value: '07/32/2026',
      },
    })
    fireEvent.click(screen.getByRole('button', { name: 'OK' }))

    expect(onChange).not.toHaveBeenCalled()
    expect((screen.getByRole('button', { name: 'OK' }) as HTMLButtonElement).disabled).toBe(true)
  })

  test('commits date range entered in input mode only after confirmation', () => {
    const onChange = vi.fn()

    render(
      <M3DatePickerDialog
        opened={true}
        appearance="input"
        type="range"
        value={[
          new Date(2026, 6, 10),
          new Date(2026, 6, 12),
        ]}
        onChange={onChange}
      />
    )

    fireEvent.input(getInputByLabel('End date'), {
      target: {
        value: '07/15/2026',
      },
    })

    expect(onChange).not.toHaveBeenCalled()

    fireEvent.click(screen.getByRole('button', { name: 'OK' }))

    expect(onChange).toHaveBeenCalledWith([
      new Date(2026, 6, 10),
      new Date(2026, 6, 15),
    ])
  })

  test('rejects a range whose end precedes its start, then accepts a corrected end', () => {
    const onChange = vi.fn()
    render(
      <M3DatePickerDialog
        appearance="input"
        type="range"
        value={[new Date(2026, 6, 10), new Date(2026, 6, 12)]}
        opened
        onChange={onChange}
      />
    )

    const confirm = screen.getByRole('button', { name: 'OK' }) as HTMLButtonElement
    fireEvent.input(getInputByLabel('End date'), { target: { value: '07/09/2026' } })
    expect(confirm.disabled).toBe(true)
    expect(getInputByLabel('End date').getAttribute('aria-invalid')).toBe('true')

    fireEvent.input(getInputByLabel('End date'), { target: { value: '07/15/2026' } })
    expect(confirm.disabled).toBe(false)
    fireEvent.click(confirm)
    expect(onChange).toHaveBeenCalledWith([new Date(2026, 6, 10), new Date(2026, 6, 15)])
  })

  test('respects date bounds in text mode and recovers after invalid input', () => {
    const onChange = vi.fn()
    render(
      <M3DatePickerDialog
        appearance="input"
        value={new Date(2026, 6, 10)}
        min={new Date(2026, 6, 5)}
        max={new Date(2026, 6, 20)}
        opened
        onChange={onChange}
      />
    )

    const input = getInputByLabel('Date')
    const confirm = screen.getByRole('button', { name: 'OK' }) as HTMLButtonElement
    fireEvent.input(input, { target: { value: '07/25/2026' } })
    expect(confirm.disabled).toBe(true)
    fireEvent.input(input, { target: { value: '07/18/2026' } })
    expect(confirm.disabled).toBe(false)
    fireEvent.click(confirm)
    expect(onChange).toHaveBeenCalledWith(new Date(2026, 6, 18))
  })

  test('keeps confirmation unavailable for an empty date and hides the mode toggle when disabled', () => {
    render(<M3DatePickerDialog appearance="input" value={null} switchable={false} label="Travel date" opened />)

    expect(screen.getByRole('dialog', { name: 'Travel date' })).toBeTruthy()
    expect(screen.queryByRole('button', { name: 'Switch to calendar input' })).toBeNull()
    expect((screen.getByRole('button', { name: 'OK' }) as HTMLButtonElement).disabled).toBe(true)
    fireEvent.input(getInputByLabel('Date'), { target: { value: '07/15/2026' } })
    expect((screen.getByRole('button', { name: 'OK' }) as HTMLButtonElement).disabled).toBe(false)
    fireEvent.input(getInputByLabel('Date'), { target: { value: '' } })
    expect((screen.getByRole('button', { name: 'OK' }) as HTMLButtonElement).disabled).toBe(true)
  })

  test('resets unconfirmed text edits when the dialog reopens with a new value', () => {
    const view = render(<M3DatePickerDialog appearance="input" value={new Date(2026, 6, 10)} opened />)
    fireEvent.input(getInputByLabel('Date'), { target: { value: '07/15/2026' } })
    view.rerender(<M3DatePickerDialog opened={false} appearance="input" value={new Date(2026, 6, 10)} />)
    view.rerender(<M3DatePickerDialog appearance="input" value={new Date(2026, 6, 12)} opened />)
    expect(getInputByLabel('Date').value).toBe('07/12/2026')
  })

  test('builds a range from two calendar selections before confirming', async () => {
    const onChange = vi.fn()
    render(
      <M3DatePickerDialog
        type="range"
        value={null}
        cursor={new Date(2026, 6, 1)}
        cancelText="Discard"
        confirmText="Apply"
        className="booking-picker"
        style={{ width: 400 }}
        opened
        onChange={onChange}
      />
    )
    await waitFor(() => expect(screen.getByRole('grid', { name: 'July 2026' })).toBeTruthy())
    const apply = screen.getByRole('button', { name: 'Apply' }) as HTMLButtonElement
    expect(apply.disabled).toBe(true)
    expect(screen.getByRole('dialog').classList.contains('booking-picker')).toBe(true)
    expect(screen.getByRole('dialog').style.width).toBe('400px')

    fireEvent.click(screen.getByRole('gridcell', { name: 'Friday, July 10, 2026' }))
    expect(apply.disabled).toBe(true)
    fireEvent.click(screen.getByRole('gridcell', { name: 'Wednesday, July 15, 2026' }))
    expect(apply.disabled).toBe(false)
    fireEvent.click(apply)
    expect(onChange).toHaveBeenCalledWith([new Date(2026, 6, 10), new Date(2026, 6, 15)])
  })

  test('switches from calendar to text entry while keeping its selected date', async () => {
    const onAppearanceChange = vi.fn()
    render(
      <M3DatePickerDialog
        value={new Date(2026, 6, 10)}
        opened
        onAppearanceChange={onAppearanceChange}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: 'Switch to text input' }))
    expect(onAppearanceChange).toHaveBeenCalledWith('input')
    await waitFor(() => expect(getInputByLabel('Date').value).toBe('07/10/2026'))
  })
})
