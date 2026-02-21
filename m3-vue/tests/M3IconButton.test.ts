import {
  render,
  screen,
} from '@testing-library/vue'

import { h } from 'vue'

import { M3Icon } from '@/components/icon'
import { M3IconButton } from '@/components/icon-button'

describe('m3-vue/icon-button', () => {
  test('updates icon appearance in selected toggleable mode', () => {
    const { container } = render(M3IconButton, {
      props: {
        toggleable: true,
        selected: true,
      },
      slots: {
        default: () => h(M3Icon, { name: 'edit' }),
      },
    })

    const button = screen.getByRole('button')
    const icon = container.querySelector('.m3-icon')

    expect(button.classList.contains('m3-icon-button_selected')).toBe(true)
    expect(icon?.classList.contains('m3-icon_filled')).toBe(true)
  })
})
