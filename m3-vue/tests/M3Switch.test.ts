import {
  fireEvent,
  render,
  screen,
} from '@testing-library/vue'

import {
  h,
  nextTick,
  ref,
} from 'vue'

import { M3Switch } from '@/components/switch'

describe('m3-vue/switch', () => {
  test('toggles by click and keeps state after drag synthetic click', async () => {
    const checked = ref(false)

    render({
      setup: () => {
        return () => h(M3Switch, {
          checked: checked.value,
          'onUpdate:checked': (value: boolean) => checked.value = value,
        })
      },
    })

    const input = screen.getByRole('switch') as HTMLInputElement

    expect(input.checked).toBe(false)

    await fireEvent.click(input)
    await nextTick()
    expect(input.checked).toBe(true)

    await fireEvent.mouseDown(input, { clientX: 0 })
    fireEvent.mouseMove(window, { clientX: 16 })
    fireEvent.mouseUp(window)
    await nextTick()
    expect(input.checked).toBe(true)

    await fireEvent.click(input)
    await nextTick()
    expect(input.checked).toBe(true)

    await fireEvent.click(input)
    await nextTick()
    expect(input.checked).toBe(false)
  })
})
