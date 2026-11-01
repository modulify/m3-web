import { fireEvent, render, screen } from '@testing-library/vue'

import { M3Checkbox } from '@/components/checkbox'

describe('m3-vue/checkbox', () => {
  test('reflects aria state and emits scalar values', async () => {
    const view = render(M3Checkbox, {
      props: {
        model: 'no',
        trueValue: 'yes',
        falseValue: 'no',
        invalid: true,
      } as Record<string, unknown>,
    })

    const input = screen.getByRole('checkbox') as HTMLInputElement

    expect(input.getAttribute('aria-invalid')).toBe('true')
    expect(input.checked).toBe(false)

    await fireEvent.click(input)

    expect(view.emitted().change?.[0]).toEqual(['yes'])
    expect(view.emitted()['update:model']?.[0]).toEqual(['yes'])
  })

  test('emits array model updates', async () => {
    const view = render(M3Checkbox, {
      props: {
        model: ['a'],
        value: 'b',
      },
    })

    await fireEvent.click(screen.getByRole('checkbox'))

    expect(view.emitted().change?.[0]).toEqual([['a', 'b']])
  })

  test('syncs the native mixed state and forwards the form name', async () => {
    const view = render(M3Checkbox, {
      props: { name: 'topics', model: false, indeterminate: true },
    })
    const input = screen.getByRole('checkbox') as HTMLInputElement

    expect(input.name).toBe('topics')
    expect(input.indeterminate).toBe(true)
    expect(input.getAttribute('aria-checked')).toBe('mixed')

    await view.rerender({ name: 'topics', model: false, indeterminate: false })

    expect(input.indeterminate).toBe(false)
    expect(input.getAttribute('aria-checked')).toBe('false')
  })

  test('does not activate a disabled checkbox or its ripple', async () => {
    const view = render(M3Checkbox, {
      props: { model: false, disabled: true },
    })
    const input = screen.getByRole('checkbox') as HTMLInputElement

    expect(input.disabled).toBe(true)
    expect(view.container.querySelector('.m3-ripple')).toBeNull()

    await fireEvent.click(input)

    expect(view.emitted().change).toBeUndefined()
  })

  test('selects an indeterminate checkbox on activation', async () => {
    const view = render(M3Checkbox, {
      props: { model: false, indeterminate: true },
    })

    await fireEvent.click(screen.getByRole('checkbox'))

    expect(view.emitted().change?.[0]).toEqual([true])
  })
})
