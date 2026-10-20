import { render } from '@testing-library/react'

import { M3Divider } from '@/components/divider'

describe('m3-react/divider', () => {
  test('is decorative and full width by default', () => {
    const { container } = render(<M3Divider data-testid="divider" />)
    const divider = container.querySelector('hr')

    expect(divider?.classList.contains('m3-divider')).toBe(true)
    expect(divider?.getAttribute('role')).toBe('presentation')
    expect(divider?.hasAttribute('aria-orientation')).toBe(false)
  })

  test('supports inset and semantic vertical variants', () => {
    const { container, rerender } = render(<M3Divider inset="middle" />)
    const divider = container.querySelector('hr')

    expect(divider?.classList.contains('m3-divider_inset-middle')).toBe(true)

    rerender(<M3Divider orientation="vertical" inset="start" role="separator" aria-label="Sections" />)

    expect(divider?.classList.contains('m3-divider_vertical')).toBe(true)
    expect(divider?.classList.contains('m3-divider_inset-start')).toBe(true)
    expect(divider?.classList.contains('m3-divider_inset-middle')).toBe(false)
    expect(divider?.getAttribute('role')).toBe('separator')
    expect(divider?.getAttribute('aria-orientation')).toBe('vertical')
    expect(divider?.getAttribute('aria-label')).toBe('Sections')
  })
})
