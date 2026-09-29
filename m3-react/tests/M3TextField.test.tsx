import { render, screen } from '@testing-library/react'

import { M3TextField } from '@/components/text-field'

describe('m3-react/text-field', () => {
  test('labels the input and keeps the visual wrapper semantically neutral', () => {
    const { container } = render(<M3TextField label="Email" />)

    const input = screen.getByRole('textbox', { name: 'Email' })
    const root = container.querySelector('.m3-text-field')

    expect(input).not.toBeNull()
    expect(root?.getAttribute('role')).toBeNull()
  })

  test('combines an external accessible name with the visible label', () => {
    render(
      <>
        <span id="section-heading">Account</span>
        <M3TextField label="Email" aria-labelledby="section-heading" />
      </>
    )

    const input = screen.getByRole('textbox', { name: 'Account Email' })

    expect(input.getAttribute('aria-labelledby')).toMatch(/^section-heading .+-label$/)
  })
})
