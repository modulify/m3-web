import { render } from '@testing-library/vue'

import { M3Divider } from '@/components/divider'

describe('m3-vue/divider', () => {
  test('is decorative and full width by default', () => {
    const { container } = render(M3Divider)
    const divider = container.querySelector('hr')

    expect(divider?.classList.contains('m3-divider')).toBe(true)
    expect(divider?.getAttribute('role')).toBe('presentation')
    expect(divider?.hasAttribute('aria-orientation')).toBe(false)
  })

  test('supports inset and semantic vertical variants', async () => {
    const { container, rerender } = render(M3Divider, {
      props: { inset: 'middle' },
    })
    const divider = container.querySelector('hr')

    expect(divider?.classList.contains('m3-divider_inset-middle')).toBe(true)

    await rerender({ orientation: 'vertical', inset: 'start' })

    expect(divider?.classList.contains('m3-divider_vertical')).toBe(true)
    expect(divider?.classList.contains('m3-divider_inset-start')).toBe(true)
    expect(divider?.classList.contains('m3-divider_inset-middle')).toBe(false)
  })

  test('exposes a structural separator when requested', () => {
    const { container } = render(M3Divider, {
      props: { orientation: 'vertical' },
      attrs: { role: 'separator', 'aria-label': 'Sections' },
    })
    const divider = container.querySelector('hr')

    expect(divider?.getAttribute('role')).toBe('separator')
    expect(divider?.getAttribute('aria-orientation')).toBe('vertical')
    expect(divider?.getAttribute('aria-label')).toBe('Sections')
  })
})
