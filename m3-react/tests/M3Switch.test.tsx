import type { M3SwitchExposed } from '@/components/switch'

import { act } from '@testing-library/react'
import { createRef } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'

import { M3Switch } from '@/components/switch'

describe('m3-react/switch', () => {
  test('toggles by click and keeps state after drag synthetic click', () => {
    const Wrapper = () => {
      const [checked, setChecked] = useState(false)

      return (
        <M3Switch
          checked={checked}
          onToggle={setChecked}
        />
      )
    }

    render(<Wrapper />)

    const input = screen.getByRole('switch') as HTMLInputElement

    expect(input.checked).toBe(false)

    fireEvent.click(input)
    expect(input.checked).toBe(true)

    fireEvent.mouseDown(input, { clientX: 0 })
    fireEvent.mouseMove(window, { clientX: 16 })
    fireEvent.mouseUp(window)

    expect(input.checked).toBe(true)

    fireEvent.click(input)
    expect(input.checked).toBe(true)

    fireEvent.click(input)
    expect(input.checked).toBe(false)
  })

  test('supports touch drag in both directions without treating the following click as a toggle', () => {
    const onToggle = vi.fn()
    const Wrapper = () => {
      const [checked, setChecked] = useState(false)
      return <M3Switch checked={checked} onToggle={value => { onToggle(value); setChecked(value) }} />
    }
    render(<Wrapper />)
    const input = screen.getByRole('switch') as HTMLInputElement

    fireEvent.touchStart(input, { touches: [{ clientX: 10 }] })
    fireEvent.touchMove(window, { touches: [{ clientX: 30 }] })
    fireEvent.touchEnd(window)
    expect(input.checked).toBe(true)
    fireEvent.click(input)
    expect(input.checked).toBe(true)

    fireEvent.touchStart(input, { touches: [{ clientX: 30 }] })
    fireEvent.touchMove(window, { touches: [{ clientX: 10 }] })
    fireEvent.touchEnd(window)
    expect(input.checked).toBe(false)
    expect(onToggle.mock.calls.map(([value]) => value)).toEqual([true, false])
  })

  test('supports Enter activation and preserves disabled semantics', () => {
    const onToggle = vi.fn()
    const view = render(<label>Wi-Fi<M3Switch onToggle={onToggle} /></label>)
    const input = screen.getByRole('switch', { name: 'Wi-Fi' }) as HTMLInputElement
    fireEvent.keyDown(input, { code: 'Enter' })
    expect(onToggle).toHaveBeenCalledWith(true)

    view.rerender(<label>Wi-Fi<M3Switch checked disabled onToggle={onToggle} /></label>)
    expect(input.disabled).toBe(true)
    expect(input.getAttribute('aria-checked')).toBe('true')
    input.click()
    expect(onToggle).toHaveBeenCalledTimes(1)
  })

  test('exposes programmatic focus, blur, and click', () => {
    const switchRef = createRef<M3SwitchExposed>()
    const onToggle = vi.fn()
    render(<M3Switch ref={switchRef} onToggle={onToggle} />)

    const input = screen.getByRole('switch')
    expect(switchRef.current?.el).toBe(input.closest('.m3-switch'))

    switchRef.current?.focus()
    expect(document.activeElement).toBe(input)
    switchRef.current?.blur()
    expect(document.activeElement).not.toBe(input)

    act(() => switchRef.current?.click())
    expect(onToggle).toHaveBeenCalledWith(true)
  })

  test('stops listening to touch movement after cancellation', () => {
    const onToggle = vi.fn()
    render(<M3Switch onToggle={onToggle} />)
    const input = screen.getByRole('switch')

    fireEvent.touchStart(input, { touches: [{ clientX: 10 }] })
    fireEvent.touchCancel(window)
    fireEvent.touchMove(window, { touches: [{ clientX: 30 }] })

    expect(onToggle).not.toHaveBeenCalled()
  })
})
