import { render, screen } from '@testing-library/react'

import { M3Select } from '@/components/select'

describe('m3-react/select', () => {
  test('puts the combobox contract on the focusable input', () => {
    const { container } = render(<M3Select label="Status" />)

    const combobox = screen.getByRole('combobox', { name: 'Status' })
    const root = container.querySelector('.m3-select')

    expect(combobox.tagName).toBe('INPUT')
    expect(combobox.getAttribute('aria-controls')).toMatch(/-menu$/)
    expect(combobox.getAttribute('aria-expanded')).toBe('false')
    expect(root?.getAttribute('role')).toBeNull()
  })
})
