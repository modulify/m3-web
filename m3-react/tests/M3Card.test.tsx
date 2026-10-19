import { fireEvent, render, screen } from '@testing-library/react'

import { M3Card } from '@/components/card'

describe('m3-react/card', () => {
  test('does not create an unnamed landmark', () => {
    const { container } = render(<M3Card>Body</M3Card>)

    expect(container.querySelector('.m3-card')?.getAttribute('role')).toBeNull()
  })

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

  test('renders custom media and heading slots in a landscape card', () => {
    const onClick = vi.fn()
    const { container } = render(
      <M3Card appearance="outlined" landscape interactive onClick={onClick}>
        <M3Card.Media className="cover"><img src="cover.png" alt="Cover" /></M3Card.Media>
        <M3Card.Heading id="custom-heading">Album</M3Card.Heading>
        <M3Card.Subheading>Artist</M3Card.Subheading>
        <p>Description</p>
      </M3Card>
    )

    const card = screen.getByRole('region', { name: 'Album' })
    expect(card.getAttribute('aria-labelledby')).toBe('custom-heading')
    expect(card.classList.contains('m3-card_outlined')).toBe(true)
    expect(card.classList.contains('m3-card_landscape')).toBe(true)
    expect(container.querySelector('.m3-card__media.cover')).not.toBeNull()
    expect(screen.getByText('Artist')).not.toBeNull()
    fireEvent.click(card)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  test('allows a content slot to replace the standard card anatomy', () => {
    const { container } = render(
      <M3Card heading="Unused heading" aria-label="Custom card">
        <M3Card.Content><strong>Custom content</strong></M3Card.Content>
      </M3Card>
    )

    expect(screen.getByRole('region', { name: 'Custom card' })).not.toBeNull()
    expect(screen.getByText('Custom content')).not.toBeNull()
    expect(container.querySelector('.m3-card__head')).toBeNull()
  })
})
