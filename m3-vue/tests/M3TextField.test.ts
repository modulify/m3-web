import type { Focusable } from '@modulify/m3-foundation/types/dom'

import { defineComponent } from 'vue'
import { fireEvent } from '@testing-library/vue'
import { h, nextTick, ref } from 'vue'
import { render, screen } from '@testing-library/vue'

import { M3TextField } from '@/components/text-field'

describe('m3-vue/text-field', () => {
  test('labels the input and keeps the visual wrapper semantically neutral', () => {
    const { container } = render(M3TextField, {
      props: {
        label: 'Email',
      },
    })

    const input = screen.getByRole('textbox', { name: 'Email' })
    const root = container.querySelector('.m3-text-field')

    expect(input).not.toBeNull()
    expect(root?.getAttribute('role')).toBeNull()
  })

  test('combines an external accessible name with the visible label', () => {
    render(M3TextField, {
      props: {
        label: 'Email',
      },
      attrs: {
        'aria-labelledby': 'section-heading',
      },
    })

    const input = screen.getByRole('textbox', { name: 'Email' })

    expect(input.getAttribute('aria-labelledby')).toMatch(/^section-heading .+-label$/)
  })

  test('emits input and update:value on input when not lazy', async () => {
    const view = render(M3TextField, {
      props: {
        value: '',
      },
    })

    const input = screen.getByRole('textbox') as HTMLInputElement

    input.value = 'Kirill'
    input.dispatchEvent(new Event('input'))
    await nextTick()

    expect(view.emitted().input?.[0]).toEqual(['Kirill'])
    expect(view.emitted()['update:value']?.[0]).toEqual(['Kirill'])
  })

  test('emits update:value only on change when lazy', async () => {
    const view = render(M3TextField, {
      props: {
        value: '',
        lazy: true,
      },
    })

    const input = screen.getByRole('textbox') as HTMLInputElement

    input.value = 'Kirill'
    input.dispatchEvent(new Event('input'))
    await nextTick()

    expect(view.emitted()['update:value']).toBeUndefined()

    input.dispatchEvent(new Event('change'))
    await nextTick()

    expect(view.emitted().change?.[0]).toEqual(['Kirill'])
    expect(view.emitted()['update:value']?.[0]).toEqual(['Kirill'])
  })

  test('renders textarea in multiline mode', () => {
    const { container } = render(M3TextField, {
      props: {
        multiline: true,
      },
    })

    expect(container.querySelector('textarea')).not.toBeNull()
    expect(container.querySelector('input')).toBeNull()
  })

  test('focuses input on root click', async () => {
    const { container } = render(M3TextField)

    const root = container.querySelector('.m3-text-field') as HTMLElement
    const input = screen.getByRole('textbox') as HTMLInputElement

    root.click()
    await nextTick()

    expect(document.activeElement).toBe(input)
  })

  test('keeps icon clicks separate from field focus and exposes focus controls', async () => {
    const field = ref<Focusable | null>(null)
    const { container } = render(defineComponent({
      setup: () => () => h(M3TextField, { ref: field, label: 'Search' }, {
        'leading-icon': () => h('span', 'Leading'),
        'trailing-icon': () => h('span', 'Trailing'),
      }),
    }))
    const input = screen.getByRole('textbox', { name: 'Search' })
    const icons = container.querySelectorAll('.m3-text-field__icon')

    await fireEvent.click(icons[0])
    await fireEvent.click(icons[1])
    expect(document.activeElement).not.toBe(input)

    field.value?.focus()
    expect(document.activeElement).toBe(input)
    field.value?.blur()
    expect(document.activeElement).not.toBe(input)
  })

  test('renders a numeric value as editable text with outlined and invalid states', async () => {
    const { container } = render(M3TextField, {
      props: {
        type: 'number',
        value: 42,
        label: 'Quantity',
        outlined: true,
        invalid: true,
      },
    })

    const input = screen.getByRole('textbox', { name: 'Quantity' }) as HTMLInputElement
    const root = container.querySelector('.m3-text-field')!
    expect(input.type).toBe('text')
    expect(input.value).toBe('42')
    expect(input.getAttribute('aria-invalid')).toBe('true')
    expect(root.classList.contains('m3-text-field_filled')).toBe(true)
    expect(root.classList.contains('m3-text-field_outlined')).toBe(true)

    await fireEvent.focus(input)
    expect(root.classList.contains('m3-text-field_focused')).toBe(true)
    await fireEvent.blur(input)
    expect(root.classList.contains('m3-text-field_focused')).toBe(false)
  })

  test('keeps an external accessible name without adding an absent visible label', () => {
    const { container } = render(M3TextField, {
      attrs: { 'aria-labelledby': 'section-heading' },
      slots: {
        'leading-icon': () => h('span', { 'aria-hidden': 'true' }, '@'),
        'trailing-icon': () => h('span', { 'aria-hidden': 'true' }, '✓'),
      },
    })

    const input = screen.getByRole('textbox')
    expect(input.getAttribute('aria-labelledby')).toBe('section-heading')
    expect(container.querySelector('.m3-text-field_has-leading')).not.toBeNull()
    expect(container.querySelector('.m3-text-field_has-trailing')).not.toBeNull()
  })
})
