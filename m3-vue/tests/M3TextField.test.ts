import {
  render,
  screen,
} from '@testing-library/vue'

import { nextTick } from 'vue'

import { M3TextField } from '@/components/text-field'

describe('m3-vue/text-field', () => {
  test('sets aria-labelledby when label is provided', () => {
    render(M3TextField, {
      props: {
        label: 'Email',
      },
    })

    const root = screen.getByRole('grid')

    expect(root.getAttribute('aria-labelledby')).toContain('-label')
    expect(screen.getByText('Email')).not.toBeNull()
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
})
