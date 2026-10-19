import { fireEvent, render, screen } from '@testing-library/react'

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

  test('removes equivalent objects from an array model using a custom comparator', () => {
    const onChange = vi.fn()
    const equalsFn = (left: unknown, right: unknown) => (
      (left as { id?: string } | undefined)?.id === (right as { id?: string } | undefined)?.id
    )
    const items = [{ id: 'a' }, { id: 'b' }]
    render(<M3Checkbox model={items} value={{ id: 'b' }} equalsFn={equalsFn} onChange={onChange} />)
    const input = screen.getByRole('checkbox') as HTMLInputElement
    expect(input.checked).toBe(true)
    fireEvent.click(input)
    expect(onChange).toHaveBeenCalledWith([{ id: 'a' }])
  })

  test('keeps a disabled indeterminate checkbox non-interactive', () => {
    const onChange = vi.fn()
    const { container } = render(<M3Checkbox model={false} indeterminate disabled onChange={onChange} />)
    const input = screen.getByRole('checkbox') as HTMLInputElement
    expect(input.disabled).toBe(true)
    expect(container.querySelector('.m3-checkbox_indeterminate')).not.toBeNull()
    input.click()
    expect(onChange).not.toHaveBeenCalled()
  })
})
