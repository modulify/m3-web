import { render } from '@testing-library/react'

import { M3Badge } from '@/components/badge'

describe('m3-react/badge', () => {
  test('renders label and labelled modifier', () => {
    const { container } = render(<M3Badge label="7" />)

    const badge = container.querySelector('.m3-badge')

    expect(badge?.textContent).toBe('7')
    expect(badge?.classList.contains('m3-badge_labelled')).toBe(true)
  })

  test('prefers children over label', () => {
    const { container } = render(
      <M3Badge label="7">
        9
      </M3Badge>
    )

    const badge = container.querySelector('.m3-badge')

    expect(badge?.textContent?.trim()).toBe('9')
  })
})
