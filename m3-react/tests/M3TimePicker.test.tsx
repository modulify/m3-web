import { fireEvent, render, screen } from '@testing-library/react'

import { M3TimePicker } from '@/components/time-picker'

describe('m3-react/time-picker', () => {
  test('commits a selected time only after confirmation', () => {
    const onChange = vi.fn()
    const onToggle = vi.fn()

    render(
      <M3TimePicker
        value={{ hour: 9, minute: 10 }}
        format="24h"
        opened
        onChange={onChange}
        onToggle={onToggle}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: '14 hours of 24' }))
    fireEvent.click(screen.getByRole('button', { name: '25 minutes of 60' }))

    expect(onChange).not.toHaveBeenCalled()

    fireEvent.click(screen.getByRole('button', { name: 'OK' }))

    expect(onChange).toHaveBeenCalledWith({ hour: 14, minute: 25 })
    expect(onToggle).toHaveBeenCalledWith(false)
  })

  test('discards a changed draft on cancellation', () => {
    const onChange = vi.fn()
    const onToggle = vi.fn()

    render(
      <M3TimePicker
        value={{ hour: 9, minute: 10 }}
        format="24h"
        opened
        onChange={onChange}
        onToggle={onToggle}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: '14 hours of 24' }))
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(onChange).not.toHaveBeenCalled()
    expect(onToggle).toHaveBeenCalledWith(false)
  })

  test('enforces bounds and a minute step in text input', () => {
    const onChange = vi.fn()

    render(
      <M3TimePicker
        appearance="input"
        value={{ hour: 9, minute: 10 }}
        format="24h"
        min={{ hour: 9, minute: 10 }}
        max={{ hour: 10, minute: 0 }}
        step={15}
        opened
        onChange={onChange}
      />
    )

    fireEvent.change(screen.getByRole('textbox', { name: 'Minute' }), { target: { value: '20' } })
    expect(screen.getByRole('button', { name: 'OK' }).hasAttribute('disabled')).toBe(true)

    fireEvent.change(screen.getByRole('textbox', { name: 'Minute' }), { target: { value: '25' } })
    fireEvent.click(screen.getByRole('button', { name: 'OK' }))

    expect(onChange).toHaveBeenCalledWith({ hour: 9, minute: 25 })
  })

  test('uses locale for format and allows an explicit override', () => {
    const view = render(
      <M3TimePicker locale="en-US" value={{ hour: 13, minute: 0 }} opened />
    )

    expect(screen.getByRole('radiogroup', { name: 'Period' })).toBeTruthy()

    view.rerender(
      <M3TimePicker locale="en-US" format="24h" value={{ hour: 13, minute: 0 }} opened />
    )

    expect(screen.queryByRole('radiogroup', { name: 'Period' })).toBeNull()
  })

  test('changes period and interprets twelve as midnight', () => {
    const onChange = vi.fn()

    render(
      <M3TimePicker
        value={{ hour: 23, minute: 45 }}
        format="12h"
        opened
        onChange={onChange}
      />
    )

    fireEvent.click(screen.getByRole('radio', { name: 'AM' }))
    fireEvent.click(screen.getByRole('button', { name: '12 hours of 12' }))
    fireEvent.click(screen.getByRole('button', { name: '5 minutes of 60' }))
    fireEvent.click(screen.getByRole('button', { name: 'OK' }))

    expect(onChange).toHaveBeenCalledWith({ hour: 0, minute: 5 })
  })

  test('switches between dial and text input before confirming', () => {
    const onChange = vi.fn()
    const onAppearanceChange = vi.fn()

    render(
      <M3TimePicker
        value={{ hour: 10, minute: 20 }}
        format="24h"
        opened
        onChange={onChange}
        onAppearanceChange={onAppearanceChange}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: 'Switch to text input' }))
    expect(screen.getByRole('textbox', { name: 'Hour' })).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Switch to dial input' }))
    expect(screen.getByRole('group', { name: 'Hours' })).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Switch to text input' }))
    fireEvent.change(screen.getByRole('textbox', { name: 'Hour' }), { target: { value: '16' } })
    fireEvent.change(screen.getByRole('textbox', { name: 'Minute' }), { target: { value: '35' } })
    fireEvent.click(screen.getByRole('button', { name: 'OK' }))

    expect(onChange).toHaveBeenCalledWith({ hour: 16, minute: 35 })
    expect(onAppearanceChange).toHaveBeenNthCalledWith(1, 'input')
    expect(onAppearanceChange).toHaveBeenNthCalledWith(2, 'dial')
  })

  test('uses a changed parent value and disables hours outside a schedule', () => {
    const onChange = vi.fn()
    const view = render(
      <M3TimePicker
        value={{ hour: 9, minute: 10 }}
        format="24h"
        min={{ hour: 9, minute: 10 }}
        max={{ hour: 10, minute: 5 }}
        step={15}
        opened
        onChange={onChange}
      />
    )

    expect(screen.getByRole('button', { name: '10 hours of 24' }).hasAttribute('disabled')).toBe(true)

    view.rerender(
      <M3TimePicker
        value={{ hour: 9, minute: 25 }}
        format="24h"
        min={{ hour: 9, minute: 10 }}
        max={{ hour: 10, minute: 5 }}
        step={15}
        opened
        onChange={onChange}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: 'OK' }))
    expect(onChange).toHaveBeenCalledWith({ hour: 9, minute: 25 })
  })

  test('restores the requested appearance when reopened', () => {
    const view = render(
      <M3TimePicker value={{ hour: 9, minute: 30 }} opened />
    )

    fireEvent.click(screen.getByRole('button', { name: 'Switch to text input' }))
    expect(screen.getByRole('textbox', { name: 'Hour' })).toBeTruthy()

    view.rerender(<M3TimePicker opened={false} value={{ hour: 9, minute: 30 }} />)
    view.rerender(<M3TimePicker value={{ hour: 9, minute: 30 }} opened />)

    expect(screen.getByRole('group', { name: 'Hours' })).toBeTruthy()
  })

  test('drags the clock hand through hours and minutes', () => {
    render(<M3TimePicker value={{ hour: 9, minute: 30 }} format="24h" opened />)

    const dial = screen.getByRole('group', { name: 'Hours' }) as HTMLDivElement
    dial.getBoundingClientRect = vi.fn().mockReturnValue({
      left: 0,
      top: 0,
      width: 256,
      height: 256,
    })
    dial.setPointerCapture = vi.fn()

    fireEvent.pointerDown(dial, { pointerId: 1, pointerType: 'mouse', button: 0, clientX: 24, clientY: 128 })
    fireEvent.pointerMove(dial, { pointerId: 1, clientX: 38, clientY: 76 })
    fireEvent.pointerUp(dial, { pointerId: 1 })

    expect(screen.getByRole('button', { name: 'Select hours' }).textContent?.trim()).toBe('10')
    expect(screen.getByRole('group', { name: 'Minutes' })).toBeTruthy()

    fireEvent.pointerDown(dial, { pointerId: 1, pointerType: 'mouse', button: 0, clientX: 128, clientY: 24 })
    fireEvent.pointerMove(dial, { pointerId: 1, clientX: 232, clientY: 128 })
    fireEvent.pointerUp(dial, { pointerId: 1 })

    expect(screen.getByRole('button', { name: 'Select minutes' }).textContent?.trim()).toBe('15')
  })
})
