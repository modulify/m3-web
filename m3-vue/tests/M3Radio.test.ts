import type { ElementReference, Interactable } from '@modulify/m3-foundation/types/dom'

import { defineComponent } from 'vue'
import { fireEvent } from '@testing-library/vue'
import { h, ref } from 'vue'
import { render, screen } from '@testing-library/vue'

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

  test('does not activate a disabled radio or its ripple', async () => {
    const view = render(M3Radio, {
      props: { model: true, disabled: true },
    })
    const input = screen.getByRole('radio') as HTMLInputElement

    expect(input.disabled).toBe(true)
    expect(view.container.querySelector('.m3-ripple')).toBeNull()

    await fireEvent.click(input)

    expect(view.emitted().change).toBeUndefined()
  })

  test('uses true as the default value and exposes native input controls', () => {
    const radio = ref<(ElementReference & Interactable) | null>(null)
    const onChange = vi.fn()
    const Harness = defineComponent({
      setup: () => () => h(M3Radio, { ref: radio, model: false, onChange }),
    })
    render(Harness)

    const input = screen.getByRole('radio') as HTMLInputElement
    expect(radio.value?.el?.contains(input)).toBe(true)
    expect(input.checked).toBe(false)

    radio.value?.focus()
    expect(document.activeElement).toBe(input)
    radio.value?.blur()
    expect(document.activeElement).not.toBe(input)
    radio.value?.click()
    expect(onChange).toHaveBeenCalledWith(true)
  })
})
