import {
  fireEvent,
  render,
  screen,
} from '@testing-library/react'

import { M3Checkbox } from '@/components/checkbox'

describe('m3-react/checkbox', () => {
  test('reflects aria state and emits scalar values', () => {
    const onChange = vi.fn()

    render(
      <M3Checkbox
        model={false}
        trueValue="yes"
        falseValue="no"
        invalid={true}
        onChange={onChange}
      />
    )

    const input = screen.getByRole('checkbox') as HTMLInputElement

    expect(input.getAttribute('aria-invalid')).toBe('true')
    expect(input.checked).toBe(false)

    fireEvent.click(input)

    expect(onChange).toHaveBeenCalledWith('yes')
  })

  test('emits array model updates', () => {
    const onChange = vi.fn()

    render(
      <M3Checkbox
        model={['a']}
        value="b"
        onChange={onChange}
      />
    )

    const input = screen.getByRole('checkbox')

    fireEvent.click(input)

    expect(onChange).toHaveBeenCalledWith(['a', 'b'])
  })
})
