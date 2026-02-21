import { render } from '@testing-library/react'

import { M3Icon } from '@/components/icon'

describe('m3-react/icon', () => {
  test('uses appearance prop', () => {
    const { container } = render(
      <M3Icon name="edit" appearance="filled" />
    )

    const icon = container.querySelector('.m3-icon')

    expect(icon?.textContent).toBe('edit')
    expect(icon?.classList.contains('m3-icon_filled')).toBe(true)
  })
})
