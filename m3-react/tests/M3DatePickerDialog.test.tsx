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
})
