import {
  render,
} from '@testing-library/vue'

import { nextTick } from 'vue'

import { M3ScrollRail } from '@/components/scroll-rail'

const { createRailMock } = vi.hoisted(() => ({
  createRailMock: vi.fn(),
}))

vi.mock('@modulify/m3-foundation/lib/scroll', () => ({
  createRail: createRailMock,
}))

describe('m3-vue/scroll-rail', () => {
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

    const { unmount } = render(M3ScrollRail, {
      props: { horizontal: true },
    })

    expect(createRailMock).toHaveBeenCalledTimes(1)
    expect(rail.init).toHaveBeenCalledTimes(1)

    unmount()

    expect(rail.destroy).toHaveBeenCalledTimes(1)
  })

  test('updates classes via onToggle and onDrag callbacks', async () => {
    const rail = {
      init: vi.fn(),
      destroy: vi.fn(),
      sync: vi.fn(),
      horizontal: false,
      disabled: false,
    }

    createRailMock.mockReturnValue(rail)

    const { container } = render(M3ScrollRail)

    const root = container.querySelector('.m3-scroll-rail') as HTMLElement
    const options = createRailMock.mock.calls[0][1]

    expect(root.classList.contains('m3-scroll-rail_disabled')).toBe(true)

    options.onToggle(true)
    await nextTick()

    expect(root.classList.contains('m3-scroll-rail_disabled')).toBe(false)

    options.onDragStart()
    await nextTick()

    expect(root.classList.contains('m3-scroll-rail_active')).toBe(true)

    options.onDragEnd()
    await nextTick()

    expect(root.classList.contains('m3-scroll-rail_active')).toBe(false)
  })

  test('updates rail options from reactive props', async () => {
    const rail = {
      init: vi.fn(),
      destroy: vi.fn(),
      sync: vi.fn(),
      horizontal: false,
      disabled: false,
    }

    createRailMock.mockReturnValue(rail)

    const view = render(M3ScrollRail, {
      props: {
        horizontal: false,
        disabled: false,
      },
    })

    await view.rerender({
      horizontal: true,
      disabled: true,
    })

    expect(rail.horizontal).toBe(true)
    expect(rail.disabled).toBe(true)
  })
})
