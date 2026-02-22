import type { M3PopperMethods } from '@/components/popper'

import {
  act,
  fireEvent,
  render,
  waitFor,
} from '@testing-library/react'

import { createRef } from 'react'

import { M3Popper } from '@/components/popper'

const rect = (x: number, y: number, width: number, height: number): DOMRect => (
  DOMRect.fromRect({
    x,
    y,
    width,
    height,
  })
)

const waitForPopper = async () => {
  await waitFor(() => {
    expect(document.body.querySelector('.m3-popper-positioner')).not.toBeNull()
    expect(document.body.querySelector('.m3-popper')).not.toBeNull()
  })

  return {
    positioner: document.body.querySelector('.m3-popper-positioner') as HTMLElement,
    popper: document.body.querySelector('.m3-popper') as HTMLElement,
  }
}

describe('m3-react/popper', () => {
  const OriginalResizeObserver = globalThis.ResizeObserver

  let target: HTMLButtonElement | null = null
  let unmount: null | (() => void) = null

  beforeAll(() => {
    vi.stubGlobal('ResizeObserver', class {
      observe () {}
      unobserve () {}
      disconnect () {}
    })
  })

  afterEach(() => {
    unmount?.()
    unmount = null
    target?.remove()
    target = null
    vi.restoreAllMocks()
  })

  afterAll(() => {
    if (OriginalResizeObserver) {
      vi.stubGlobal('ResizeObserver', OriginalResizeObserver)
    } else {
      vi.unstubAllGlobals()
    }
  })

  test('shows by focus trigger and hides by blur trigger', async () => {
    target = document.createElement('button')
    document.body.append(target)

    const mounted = render(
      <M3Popper
        target={target}
        shown={false}
        targetTriggers={{
          show: ['focus'],
          hide: ['focus'],
        }}
        detachTimeout={null}
      >
        <div>Popper content</div>
      </M3Popper>
    )
    unmount = mounted.unmount

    fireEvent.focus(target)

    const { popper } = await waitForPopper()
    await waitFor(() => {
      expect(popper.classList.contains('m3-popper_shown')).toBe(true)
    })

    fireEvent.blur(target)

    await waitFor(() => {
      expect(popper.classList.contains('m3-popper_shown')).toBe(false)
    })
  })

  test('hides on miss click when option is enabled', async () => {
    target = document.createElement('button')
    document.body.append(target)

    const mounted = render(
      <M3Popper
        target={target}
        shown={true}
        hideOnMissClick={true}
        detachTimeout={null}
      >
        <div>Popper content</div>
      </M3Popper>
    )
    unmount = mounted.unmount

    const { popper } = await waitForPopper()
    await waitFor(() => {
      expect(popper.classList.contains('m3-popper_shown')).toBe(true)
    })

    document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    await waitFor(() => {
      expect(popper.classList.contains('m3-popper_shown')).toBe(false)
    })
  })

  test('hides when reference is hidden with overflow middlewares', async () => {
    target = document.createElement('button')
    document.body.append(target)

    const popperRef = createRef<M3PopperMethods>()

    const mounted = render(
      <M3Popper
        ref={popperRef}
        target={target}
        shown={true}
        placement="bottom"
        overflow={['flip', 'shift', 'hide']}
        offsetMainAxis={8}
        offsetCrossAxis={4}
        detachTimeout={null}
      >
        <div>Popper content</div>
      </M3Popper>
    )
    unmount = mounted.unmount

    const {
      popper,
      positioner,
    } = await waitForPopper()

    vi.spyOn(target, 'getBoundingClientRect').mockReturnValue(rect(-10000, -10000, 40, 20))

    await act(async () => {
      await popperRef.current?.adjust()
    })

    await waitFor(() => {
      expect(positioner.style.position).toBe('absolute')
      expect(popper.classList.contains('m3-popper_shown')).toBe(false)
    })
  })
})
