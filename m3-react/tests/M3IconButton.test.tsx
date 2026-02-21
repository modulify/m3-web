import {
  render,
  screen,
} from '@testing-library/react'

import { M3Icon } from '@/components/icon'
import { M3IconButton } from '@/components/icon-button'

describe('m3-react/icon-button', () => {
  test('updates icon appearance in selected toggleable mode', () => {
    const { container } = render(
      <M3IconButton toggleable={true} selected={true}>
        <M3Icon name="edit" />
      </M3IconButton>
    )

    const button = screen.getByRole('button')
    const icon = container.querySelector('.m3-icon')

    expect(button.classList.contains('m3-icon-button_selected')).toBe(true)
    expect(icon?.classList.contains('m3-icon_filled')).toBe(true)
  })
})
