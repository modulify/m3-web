import {
  fireEvent,
  render,
  screen,
} from '@testing-library/vue'

import { M3Radio } from '@/components/radio'

describe('m3-vue/radio', () => {
  test('reflects checked state and emits selected value', async () => {
    const view = render(M3Radio, {
      props: {
        name: 'channel',
        model: 'push',
        value: 'email',
        invalid: true,
      } as Record<string, unknown>,
    })

    const input = screen.getByRole('radio') as HTMLInputElement

    expect(input.getAttribute('aria-invalid')).toBe('true')
    expect(input.checked).toBe(false)

    await fireEvent.click(input)

    expect(view.emitted().change?.[0]).toEqual(['email'])
    expect(view.emitted()['update:model']?.[0]).toEqual(['email'])
  })

  test('supports custom equality', () => {
    render(M3Radio, {
      props: {
        model: { id: 2 },
        value: { id: 2 },
        equalsFn: (a: { id: number }, b: { id: number }) => a.id === b.id,
      } as Record<string, unknown>,
    })

    expect((screen.getByRole('radio') as HTMLInputElement).checked).toBe(true)
  })
})
