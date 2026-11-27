import type { ElementReference, Interactable } from '@modulify/m3-foundation/types/dom'

import { defineComponent } from 'vue'
import { fireEvent } from '@testing-library/vue'
import { h, ref } from 'vue'
import { render, screen } from '@testing-library/vue'

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

  test('removes an existing array value using custom equality', async () => {
    const view = render(M3Checkbox, {
      props: {
        model: [{ id: 1 }, { id: 2 }],
        value: { id: 2 },
        equalsFn: (left: { id: number }, right: { id: number }) => left.id === right.id,
      } as Record<string, unknown>,
    })

    const input = screen.getByRole('checkbox') as HTMLInputElement
    expect(input.checked).toBe(true)

    await fireEvent.click(input)
    expect(view.emitted().change?.[0]).toEqual([[{ id: 1 }]])
  })

  test('exposes click and focus controls through the native input', () => {
    const checkbox = ref<(ElementReference & Interactable) | null>(null)
    const onChange = vi.fn()
    const Harness = defineComponent({
      setup: () => () => h(M3Checkbox, { ref: checkbox, model: false, onChange }),
    })
    render(Harness)

    const input = screen.getByRole('checkbox') as HTMLInputElement
    expect(checkbox.value?.el?.contains(input)).toBe(true)
    checkbox.value?.focus()
    expect(document.activeElement).toBe(input)
    checkbox.value?.blur()
    expect(document.activeElement).not.toBe(input)
    checkbox.value?.click()
    expect(onChange).toHaveBeenCalledWith(true)
  })
})
