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
})
