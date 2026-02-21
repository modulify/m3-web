import {
  render,
  screen,
} from '@testing-library/vue'

import { M3Card } from '@/components/card'

describe('m3-vue/card', () => {
  test('sets aria-labelledby from heading when needed', () => {
    render(M3Card, {
      props: { heading: 'Card title' },
      slots: { default: 'Body' },
    })

    const card = screen.getByRole('region')
    const title = screen.getByText('Card title')

    expect(card.getAttribute('aria-labelledby')).toBe(title.id)
  })

  test('interactive card has keyboard focusability', () => {
    render(M3Card, {
      props: {
        heading: 'Focusable card',
        interactive: true,
      },
      slots: { default: 'Body' },
    })

    const card = screen.getByRole('region')

    expect(card.getAttribute('tabindex')).toBe('0')
    expect(card.classList.contains('m3-card_interactive')).toBe(true)
  })
})
