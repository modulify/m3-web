import { createRef } from 'react'

import {
  act,
  render,
} from '@testing-library/react'

import { M3ScrollRail } from '@/components/scroll-rail'

const { createRailMock } = vi.hoisted(() => ({
  createRailMock: vi.fn(),
}))

vi.mock('@modulify/m3-foundation/lib/scroll', () => ({
  createRail: createRailMock,
}))

describe('m3-react/scroll-rail', () => {
  beforeEach(() => {
    createRailMock.mockReset()
  })

  test('initializes and destroys rail instance', () => {
    const rail = {
      init: vi.fn(),
      destroy: vi.fn(),
      sync: vi.fn(),
      horizontal: false,
      disabled: false,
    }

    createRailMock.mockReturnValue(rail)

    const { unmount } = render(<M3ScrollRail horizontal={true} />)

    expect(createRailMock).toHaveBeenCalledTimes(1)
    expect(rail.init).toHaveBeenCalledTimes(1)

    unmount()

    expect(rail.destroy).toHaveBeenCalledTimes(1)
  })

  test('updates classes via onToggle and onDrag callbacks', () => {
    const rail = {
      init: vi.fn(),
      destroy: vi.fn(),
      sync: vi.fn(),
      horizontal: false,
      disabled: false,
    }

    createRailMock.mockReturnValue(rail)

    const { container } = render(<M3ScrollRail />)

    const root = container.querySelector('.m3-scroll-rail') as HTMLElement
    const options = createRailMock.mock.calls[0][1]

    expect(root.classList.contains('m3-scroll-rail_disabled')).toBe(true)

    act(() => {
      options.onToggle(true)
    })

    expect(root.classList.contains('m3-scroll-rail_disabled')).toBe(false)

    act(() => {
      options.onDragStart()
    })

    expect(root.classList.contains('m3-scroll-rail_active')).toBe(true)

    act(() => {
      options.onDragEnd()
    })

    expect(root.classList.contains('m3-scroll-rail_active')).toBe(false)
  })

  test('sync method delegates to rail instance', () => {
    const rail = {
      init: vi.fn(),
      destroy: vi.fn(),
      sync: vi.fn(),
      horizontal: false,
      disabled: false,
    }

    createRailMock.mockReturnValue(rail)

    const ref = createRef<{ sync: () => void }>()

    render(<M3ScrollRail ref={ref} />)

    act(() => {
      ref.current?.sync()
    })

    expect(rail.sync).toHaveBeenCalledTimes(1)
  })
})
