import { defineComponent } from 'vue'
import { fireEvent } from '@testing-library/vue'
import { h, nextTick, ref } from 'vue'
import { render, screen } from '@testing-library/vue'

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

  test('supports touch drag in both directions without treating the following click as a toggle', async () => {
    const checked = ref(false)
    const onChange = vi.fn()

    render({
      setup: () => () => h(M3Switch, {
        checked: checked.value,
        onChange,
        'onUpdate:checked': (value: boolean) => checked.value = value,
      }),
    })

    const input = screen.getByRole('switch') as HTMLInputElement

    await fireEvent.touchStart(input, { touches: [{ clientX: 10 }] })
    await fireEvent.touchMove(window, { touches: [{ clientX: 30 }] })
    await fireEvent.touchEnd(window)
    await nextTick()
    expect(input.checked).toBe(true)

    await fireEvent.click(input)
    expect(input.checked).toBe(true)

    await fireEvent.touchStart(input, { touches: [{ clientX: 30 }] })
    await fireEvent.touchMove(window, { touches: [{ clientX: 10 }] })
    await fireEvent.touchEnd(window)
    await nextTick()
    expect(input.checked).toBe(false)
    expect(onChange.mock.calls.map(([value]) => value)).toEqual([true, false])
  })

  test('supports Enter activation and preserves disabled semantics', async () => {
    const checked = ref(false)
    const disabled = ref(false)
    const onChange = vi.fn()

    render({
      setup: () => () => h('label', ['Wi-Fi', h(M3Switch, {
        checked: checked.value,
        disabled: disabled.value,
        onChange,
        'onUpdate:checked': (value: boolean) => checked.value = value,
      })]),
    })

    const input = screen.getByRole('switch', { name: 'Wi-Fi' }) as HTMLInputElement

    await fireEvent.keyDown(input, { key: 'Enter' })
    await nextTick()
    expect(input.checked).toBe(true)
    expect(onChange).toHaveBeenCalledWith(true)

    disabled.value = true
    await nextTick()
    expect(input.disabled).toBe(true)
    expect(input.getAttribute('aria-checked')).toBe('true')

    input.click()
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  test('exposes programmatic focus, blur, and click', async () => {
    const switchRef = ref<{
      el: HTMLElement | null;
      click(): void;
      focus(): void;
      blur(): void;
        } | null>(null)
    const onChange = vi.fn()

    render(defineComponent({
      render: () => h(M3Switch, { ref: switchRef, onChange }),
    }))

    const input = screen.getByRole('switch')
    expect(switchRef.value?.el).toBe(input.closest('.m3-switch'))

    switchRef.value?.focus()
    expect(document.activeElement).toBe(input)
    switchRef.value?.blur()
    expect(document.activeElement).not.toBe(input)

    switchRef.value?.click()
    await nextTick()
    expect(onChange).toHaveBeenCalledWith(true)
  })

  test('stops listening to touch movement after cancellation', async () => {
    const onChange = vi.fn()
    render(M3Switch, { props: { onChange } })
    const input = screen.getByRole('switch')

    await fireEvent.touchStart(input, { touches: [{ clientX: 10 }] })
    await fireEvent.touchCancel(window)
    await fireEvent.touchMove(window, { touches: [{ clientX: 30 }] })

    expect(onChange).not.toHaveBeenCalled()
  })
})
