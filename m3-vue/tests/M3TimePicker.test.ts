import { fireEvent, render, screen } from '@testing-library/vue'

import { M3TimePicker } from '@/components/time-picker'

describe('m3-vue/time-picker', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  test('commits a selected time only after confirmation', async () => {
    const view = render(M3TimePicker, {
      props: {
        opened: true,
        value: { hour: 9, minute: 10 },
        format: '24h',
      },
    })

    await fireEvent.click(screen.getByRole('button', { name: '14 hours of 24' }))
    await fireEvent.click(screen.getByRole('button', { name: '25 minutes of 60' }))

    expect(view.emitted().change).toBeUndefined()

    await fireEvent.click(screen.getByRole('button', { name: 'OK' }))

    expect(view.emitted().change?.[0]).toEqual([{ hour: 14, minute: 25 }])
    expect(view.emitted()['update:value']?.[0]).toEqual([{ hour: 14, minute: 25 }])
    expect(view.emitted()['update:opened']?.[0]).toEqual([false])
  })

  test('discards a changed draft on cancellation', async () => {
    const view = render(M3TimePicker, {
      props: {
        opened: true,
        value: { hour: 9, minute: 10 },
        format: '24h',
      },
    })

    await fireEvent.click(screen.getByRole('button', { name: '14 hours of 24' }))
    await fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(view.emitted().change).toBeUndefined()
    expect(view.emitted()['update:value']).toBeUndefined()
    expect(view.emitted()['update:opened']?.[0]).toEqual([false])
  })

  test('enforces bounds and a minute step in text input', async () => {
    const view = render(M3TimePicker, {
      props: {
        opened: true,
        appearance: 'input',
        value: { hour: 9, minute: 10 },
        format: '24h',
        min: { hour: 9, minute: 10 },
        max: { hour: 10, minute: 0 },
        step: 15,
      },
    })

    await fireEvent.update(screen.getByRole('textbox', { name: 'Minute' }), '20')
    expect(screen.getByRole('button', { name: 'OK' }).hasAttribute('disabled')).toBe(true)

    await fireEvent.update(screen.getByRole('textbox', { name: 'Minute' }), '25')
    await fireEvent.click(screen.getByRole('button', { name: 'OK' }))

    expect(view.emitted().change?.[0]).toEqual([{ hour: 9, minute: 25 }])
  })

  test('uses locale for format and allows an explicit override', async () => {
    const view = render(M3TimePicker, {
      props: {
        opened: true,
        locale: 'en-US',
        value: { hour: 13, minute: 0 },
      },
    })

    expect(screen.getByRole('radiogroup', { name: 'Period' })).toBeTruthy()

    await view.rerender({ format: '24h' })
    expect(screen.queryByRole('radiogroup', { name: 'Period' })).toBeNull()
  })

  test('changes period and interprets twelve as midnight', async () => {
    const view = render(M3TimePicker, {
      props: {
        opened: true,
        value: { hour: 23, minute: 45 },
        format: '12h',
      },
    })

    await fireEvent.click(screen.getByRole('radio', { name: 'AM' }))
    await fireEvent.click(screen.getByRole('button', { name: '12 hours of 12' }))
    await fireEvent.click(screen.getByRole('button', { name: '5 minutes of 60' }))
    await fireEvent.click(screen.getByRole('button', { name: 'OK' }))

    expect(view.emitted().change?.[0]).toEqual([{ hour: 0, minute: 5 }])
  })

  test('switches between dial and text input before confirming', async () => {
    const view = render(M3TimePicker, {
      props: {
        opened: true,
        value: { hour: 10, minute: 20 },
        format: '24h',
      },
    })

    await fireEvent.click(screen.getByRole('button', { name: 'Switch to text input' }))
    expect(screen.getByRole('textbox', { name: 'Hour' })).toBeTruthy()

    await fireEvent.click(screen.getByRole('button', { name: 'Switch to dial input' }))
    expect(screen.getByRole('group', { name: 'Hours' })).toBeTruthy()

    await fireEvent.click(screen.getByRole('button', { name: 'Switch to text input' }))
    await fireEvent.update(screen.getByRole('textbox', { name: 'Hour' }), '16')
    await fireEvent.update(screen.getByRole('textbox', { name: 'Minute' }), '35')
    await fireEvent.click(screen.getByRole('button', { name: 'OK' }))

    expect(view.emitted().change?.[0]).toEqual([{ hour: 16, minute: 35 }])
    expect(view.emitted()['update:appearance']?.slice(0, 2)).toEqual([['input'], ['dial']])
  })

  test('uses a changed parent value and disables hours outside a schedule', async () => {
    const view = render(M3TimePicker, {
      props: {
        opened: true,
        value: { hour: 9, minute: 10 },
        format: '24h',
        min: { hour: 9, minute: 10 },
        max: { hour: 10, minute: 5 },
        step: 15,
      },
    })

    expect(screen.getByRole('button', { name: '10 hours of 24' }).hasAttribute('disabled')).toBe(true)

    await view.rerender({ value: { hour: 9, minute: 25 } })
    await fireEvent.click(screen.getByRole('button', { name: 'OK' }))

    expect(view.emitted().change?.[0]).toEqual([{ hour: 9, minute: 25 }])
  })

  test('restores the requested appearance when reopened', async () => {
    const view = render(M3TimePicker, {
      props: {
        opened: true,
        value: { hour: 9, minute: 30 },
      },
    })

    await fireEvent.click(screen.getByRole('button', { name: 'Switch to text input' }))
    expect(screen.getByRole('textbox', { name: 'Hour' })).toBeTruthy()

    await view.rerender({ opened: false })
    await view.rerender({ opened: true })

    expect(screen.getByRole('group', { name: 'Hours' })).toBeTruthy()
  })

  test('drags the clock hand through hours and minutes', async () => {
    render(M3TimePicker, {
      props: {
        opened: true,
        value: { hour: 9, minute: 30 },
        format: '24h',
      },
    })

    const dial = screen.getByRole('group', { name: 'Hours' }) as HTMLDivElement
    dial.getBoundingClientRect = vi.fn().mockReturnValue({
      left: 0,
      top: 0,
      width: 256,
      height: 256,
    })
    dial.setPointerCapture = vi.fn()

    await fireEvent.pointerDown(dial, { pointerId: 1, pointerType: 'mouse', button: 0, clientX: 24, clientY: 128 })
    await fireEvent.pointerMove(dial, { pointerId: 1, clientX: 38, clientY: 76 })
    await fireEvent.pointerUp(dial, { pointerId: 1 })

    expect(screen.getByRole('button', { name: 'Select hours' }).textContent?.trim()).toBe('10')
    expect(screen.getByRole('group', { name: 'Minutes' })).toBeTruthy()

    await fireEvent.pointerDown(dial, { pointerId: 1, pointerType: 'mouse', button: 0, clientX: 128, clientY: 24 })
    await fireEvent.pointerMove(dial, { pointerId: 1, clientX: 232, clientY: 128 })
    await fireEvent.pointerUp(dial, { pointerId: 1 })

    expect(screen.getByRole('button', { name: 'Select minutes' }).textContent?.trim()).toBe('15')
  })
})
