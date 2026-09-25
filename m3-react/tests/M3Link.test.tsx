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
})
