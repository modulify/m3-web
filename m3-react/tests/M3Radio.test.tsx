import {
  fireEvent,
  render,
  screen,
} from '@testing-library/react'

import { M3Radio } from '@/components/radio'

describe('m3-react/radio', () => {
  test('reflects checked state and emits selected value', () => {
    const onChange = vi.fn()

    render(
      <M3Radio
        name="channel"
        model="push"
        value="email"
        invalid={true}
        onChange={onChange}
      />
    )

    const input = screen.getByRole('radio') as HTMLInputElement

    expect(input.getAttribute('aria-invalid')).toBe('true')
    expect(input.checked).toBe(false)

    fireEvent.click(input)

    expect(onChange).toHaveBeenCalledWith('email')
  })

  test('supports custom equality', () => {
    render(
      <M3Radio
        model={{ id: 2 }}
        value={{ id: 2 }}
        equalsFn={(a, b) => (a as { id: number }).id === (b as { id: number }).id}
      />
    )

    expect((screen.getByRole('radio') as HTMLInputElement).checked).toBe(true)
  })
})
