import type { M3PopperExposed } from '@/components/popper'

import { act } from '@testing-library/react'
import { afterAll, afterEach, beforeAll } from 'vitest'
import { createRef } from 'react'
import { describe, expect } from 'vitest'
import { fireEvent } from '@testing-library/react'
import * as floating from '@modulify/m3-foundation/lib/popper/floating'
import { render } from '@testing-library/react'
import { test, vi } from 'vitest'
import { waitFor } from '@testing-library/react'

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
  const originalResizeObserver = globalThis.ResizeObserver

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
    if (originalResizeObserver) {
      vi.stubGlobal('ResizeObserver', originalResizeObserver)
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

    await act(async () => {
      await new Promise(resolve => requestAnimationFrame(() => setTimeout(resolve, 0)))
    })

    fireEvent.mouseDown(document.body)
    fireEvent.click(document.body)

    await waitFor(() => {
      expect(popper.classList.contains('m3-popper_shown')).toBe(false)
    })
  })

  test('honors a closer inside the popper', async () => {
    target = document.createElement('button')
    document.body.append(target)
    const popperRef = createRef<M3PopperExposed>()
    const mounted = render(
      <M3Popper ref={popperRef} target={target} detachTimeout={null} hideOnMissClick>
        <button type="button">Close details</button>
      </M3Popper>
    )
    unmount = mounted.unmount

    act(() => popperRef.current!.show(true))
    const { popper } = await waitForPopper()
    await waitFor(() => expect(popper.classList.contains('m3-popper_shown')).toBe(true))
    await act(async () => {
      await new Promise(resolve => requestAnimationFrame(() => setTimeout(resolve, 0)))
    })

    const close = popper.querySelector('button') as HTMLButtonElement
    const click = new MouseEvent('click', { bubbles: true })
    Object.assign(click, { m3PopperClose: true })

    fireEvent(close, click)

    await waitFor(() => {
      expect(popper.classList.contains('m3-popper_shown')).toBe(false)
    })
  })

  test('hides when reference is hidden with overflow middlewares', async () => {
    target = document.createElement('button')
    document.body.append(target)

    const popperRef = createRef<M3PopperExposed>()

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

    const { popper, positioner } = await waitForPopper()

    vi.spyOn(target, 'getBoundingClientRect').mockReturnValue(rect(-10000, -10000, 40, 20))

    await act(async () => {
      await popperRef.current?.adjust()
    })

    await waitFor(() => {
      expect(positioner.style.position).toBe('absolute')
      expect(popper.classList.contains('m3-popper_shown')).toBe(false)
    })
  })

  test('exposes show and hide controls and mounts into a custom container', async () => {
    target = document.createElement('button')
    document.body.append(target)
    const destination = document.createElement('div')
    document.body.append(destination)

    const onShow = vi.fn()
    const onHide = vi.fn()
    const onToggle = vi.fn()
    const popperRef = createRef<M3PopperExposed>()
    const mounted = render(
      <M3Popper
        ref={popperRef}
        target={target}
        container={destination}
        targetTriggers={[]}
        detachTimeout={null}
        onShow={onShow}
        onHide={onHide}
        onToggle={onToggle}
      >
        <span>Details</span>
      </M3Popper>
    )
    unmount = () => {
      mounted.unmount()
      destination.remove()
    }

    act(() => popperRef.current!.show(true))
    const { popper } = await waitForPopper()

    await waitFor(() => {
      expect(popper.classList.contains('m3-popper_shown')).toBe(true)
    })

    expect(destination.contains(popper)).toBe(true)
    expect(popperRef.current!.contains(popper)).toBe(true)
    expect(onShow).toHaveBeenCalledTimes(1)
    expect(onToggle).toHaveBeenCalledWith(true)

    act(() => popperRef.current!.hide(true, 'by-closer'))

    await waitFor(() => {
      expect(popper.classList.contains('m3-popper_shown')).toBe(false)
    })

    expect(onHide).toHaveBeenCalledWith('by-closer')
    expect(onToggle).toHaveBeenCalledWith(false)
  })

  test('disposes while disabled and can show again after enabling', async () => {
    target = document.createElement('button')
    document.body.append(target)
    const onDispose = vi.fn()
    const popperRef = createRef<M3PopperExposed>()
    const mounted = render(
      <M3Popper ref={popperRef} target={target} shown disabled onDispose={onDispose}>
        <span>Details</span>
      </M3Popper>
    )
    unmount = mounted.unmount
    expect(document.body.querySelector('.m3-popper')).toBeNull()

    mounted.rerender(
      <M3Popper ref={popperRef} target={target} shown onDispose={onDispose}>
        <span>Details</span>
      </M3Popper>
    )
    const { popper } = await waitForPopper()

    await waitFor(() => {
      expect(popper.classList.contains('m3-popper_shown')).toBe(true)
    })

    mounted.rerender(
      <M3Popper ref={popperRef} target={target} shown disabled onDispose={onDispose}>
        <span>Details</span>
      </M3Popper>
    )

    await waitFor(() => {
      expect(document.body.querySelector('.m3-popper')).toBeNull()
    })

    expect(onDispose).toHaveBeenCalledTimes(1)
  })

  test('moves the animation origin to the resolved placement side and clears it when disabled', async () => {
    target = document.createElement('button')
    document.body.append(target)

    const popperRef = createRef<M3PopperExposed>()
    const position = vi.spyOn(floating, 'computePosition')
    const mounted = render(
      <M3Popper ref={popperRef} target={target} shown animated>
        <span>Popover</span>
      </M3Popper>
    )
    unmount = mounted.unmount

    const { popper } = await waitForPopper()
    const result = (side: 'top' | 'left' | 'right' | 'bottom') => ({ side }) as Awaited<ReturnType<typeof floating.computePosition>>

    for (const [side, originX, originY] of [
      ['top', 'center', 'bottom'],
      ['left', 'right', 'center'],
      ['right', 'left', 'center'],
      ['bottom', 'center', 'top'],
    ] as const) {
      position.mockResolvedValue(result(side))
      await act(async () => {
        await popperRef.current!.adjust()
      })

      expect(popper.style.getPropertyValue('--m3-popper-origin-x')).toBe(originX)
      expect(popper.style.getPropertyValue('--m3-popper-origin-y')).toBe(originY)
    }

    mounted.rerender(
      <M3Popper ref={popperRef} target={target} animated={false} shown>
        <span>Popover</span>
      </M3Popper>
    )

    expect(popper.style.getPropertyValue('--m3-popper-origin-x')).toBe('')
    expect(popper.style.getPropertyValue('--m3-popper-origin-y')).toBe('')
  })
})
