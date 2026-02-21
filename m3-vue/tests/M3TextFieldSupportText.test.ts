import { render } from '@testing-library/vue'

import { M3TextFieldSupportText } from '@/components/text-field'

describe('m3-vue/text-field-support-text', () => {
  test('renders text and modifiers', () => {
    const { container } = render(M3TextFieldSupportText, {
      props: {
        text: 'Helper text',
        danger: true,
        muted: true,
      },
    })

    const root = container.querySelector('.m3-text-field-support-text') as HTMLElement

    expect(root.textContent).toContain('Helper text')
    expect(root.classList.contains('m3-text-field-support-text_danger')).toBe(true)
    expect(root.classList.contains('m3-text-field-support-text_muted')).toBe(true)
  })
})
