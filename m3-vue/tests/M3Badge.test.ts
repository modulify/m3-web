import {
  render,
  screen,
} from '@testing-library/vue'

import { M3Badge } from '@/components/badge'

describe('m3-vue/badge', () => {
  test('renders label and status role', () => {
    render(M3Badge, {
      props: { label: '7' },
    })

    const badge = screen.getByRole('status')

    expect(badge.textContent).toBe('7')
    expect(badge.classList.contains('m3-badge_labelled')).toBe(true)
  })

  test('prefers slot content over label', () => {
    render(M3Badge, {
      props: { label: '7' },
      slots: { default: '9' },
    })

    const badge = screen.getByRole('status')

    expect(badge.textContent?.trim()).toBe('9')
  })
})
