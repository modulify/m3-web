import {
  fireEvent,
  render,
  screen,
} from '@testing-library/vue'

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
})
