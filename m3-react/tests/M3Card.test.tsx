import {
  render,
  screen,
} from '@testing-library/react'

import { M3Card } from '@/components/card'

describe('m3-react/card', () => {
  test('sets aria-labelledby from heading when needed', () => {
    render(
      <M3Card heading="Card title">
        Body
      </M3Card>
    )

    const card = screen.getByRole('region')
    const title = screen.getByText('Card title')

    expect(card.getAttribute('aria-labelledby')).toBe(title.id)
  })

  test('interactive card has keyboard focusability', () => {
    render(
      <M3Card interactive={true} heading="Focusable card">
        Body
      </M3Card>
    )

    const card = screen.getByRole('region')

    expect(card.getAttribute('tabindex')).toBe('0')
    expect(card.classList.contains('m3-card_interactive')).toBe(true)
  })

  test('does not force aria-labelledby when aria-label is provided', () => {
    render(
      <M3Card heading="Card title" aria-label="Custom label">
        Body
      </M3Card>
    )

    const card = screen.getByRole('region')

    expect(card.getAttribute('aria-labelledby')).toBeNull()
  })
})
