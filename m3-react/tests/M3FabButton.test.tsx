import {
  render,
  screen,
} from '@testing-library/react'

import { M3FabButton } from '@/components/fab-button'
import { M3Icon } from '@/components/icon'

describe('m3-react/fab-button', () => {
  test('classifies icon and text content', () => {
    const { container } = render(
      <M3FabButton>
        <M3Icon name="add" />
        Create
      </M3FabButton>
    )

    const button = screen.getByRole('button')
    const icon = container.querySelector('.m3-fab-button__icon .m3-icon')
    const text = container.querySelector('.m3-fab-button__text')

    expect(button.classList.contains('m3-fab-button_has-leading-icon')).toBe(true)
    expect(icon?.textContent).toBe('add')
    expect(text?.textContent?.trim()).toBe('Create')
  })
})
