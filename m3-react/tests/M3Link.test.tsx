import type { M3LinkExposed } from '@/components/link'

import { createRef } from 'react'
import { render } from '@testing-library/react'

import { M3Link } from '@/components/link'

describe('m3-react/link', () => {
  test('exposes its root element through a getter', () => {
    const ref = createRef<M3LinkExposed>()
    const { container } = render(<M3Link ref={ref}>Action</M3Link>)

    expect(ref.current?.el).toBe(container.querySelector('button'))
  })

  test('renders a disabled destination as a disabled button', () => {
    const { container } = render(<M3Link href="/next" disabled>Next</M3Link>)

    const button = container.querySelector('button')
    expect(button?.disabled).toBe(true)
    expect(container.querySelector('a')).toBeNull()
  })
})
