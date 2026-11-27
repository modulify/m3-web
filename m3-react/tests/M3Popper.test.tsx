import type { M3PopperExposed } from '@/components/popper'

import { act } from '@testing-library/react'
import { afterAll, afterEach, beforeAll } from 'vitest'
import { createRef } from 'react'
import { describe, expect } from 'vitest'
import { fireEvent } from '@testing-library/react'
import * as floating from '@modulify/m3-foundation/lib/popper/floating'
import { render, renderHook } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { test, vi } from 'vitest'
import { waitFor } from '@testing-library/react'

import { M3Popper } from '@/components/popper'
import { useAutoAdjust, useDelay, useListening } from '@/components/popper/hooks'

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

  test('renders without a browser document or children during SSR', () => {
    const browserDocument = globalThis.document

    try {
      vi.stubGlobal('document', undefined)

      expect(renderToString(<M3Popper target={null} />)).toBe('')
    } finally {
      vi.stubGlobal('document', browserDocument)
    }
  })

  test('handles missing positioning elements and an omitted delay', () => {
    const adjust = vi.fn()
    const { result } = renderHook(() => ({
      update: useAutoAdjust({ current: null }, { current: null }, adjust),
      delay: useDelay(undefined),
    }))

    result.current.update[0]()

    expect(adjust).not.toHaveBeenCalled()
    expect(result.current.delay).toEqual([0, 0])
  })

  test('forwards a popper hide trigger to the latest handler', () => {
    const firstHide = vi.fn()
    const nextHide = vi.fn()
    const show = vi.fn()
    const { result, rerender } = renderHook(
      ({ onHide }: { onHide: (event: Event) => void }) => useListening([show, onHide]),
      { initialProps: { onHide: firstHide } }
    )
    const target = new EventTarget()

    result.current.popper.start(target, {
      show: ['hover'],
      hide: ['focus'],
    })
    rerender({ onHide: nextHide })
    target.dispatchEvent(new Event('mouseenter'))
    target.dispatchEvent(new Event('blur'))

    expect(show).toHaveBeenCalledOnce()
    expect(firstHide).not.toHaveBeenCalled()
    expect(nextHide).toHaveBeenCalledOnce()
    result.current.popper.stop()
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

  test('starts listening when a target appears after mount', async () => {
    target = document.createElement('button')
    document.body.append(target)

    const mounted = render(
      <M3Popper target={null} detachTimeout={null}>
        <div>Popper content</div>
      </M3Popper>
    )
    unmount = mounted.unmount
    expect(document.body.querySelector('.m3-popper_shown')).toBeNull()

    mounted.rerender(
      <M3Popper target={target} detachTimeout={null}>
        <div>Popper content</div>
      </M3Popper>
    )
    fireEvent.click(target)

    const { popper } = await waitForPopper()
    await waitFor(() => expect(popper.classList.contains('m3-popper_shown')).toBe(true))
  })

  test('updates popper hover triggers after the popper is attached', async () => {
    target = document.createElement('button')
    document.body.append(target)

    const mounted = render(
      <M3Popper target={target} detachTimeout={null} popperTriggers={[]} shown>
        <div>Popper content</div>
      </M3Popper>
    )
    unmount = mounted.unmount

    const { popper, positioner } = await waitForPopper()
    await waitFor(() => expect(popper.classList.contains('m3-popper_shown')).toBe(true))

    fireEvent.mouseLeave(positioner)
    expect(popper.classList.contains('m3-popper_shown')).toBe(true)

    mounted.rerender(
      <M3Popper target={target} detachTimeout={null} popperTriggers={{ hide: ['hover'] }} shown>
        <div>Popper content</div>
      </M3Popper>
    )
    fireEvent.mouseLeave(positioner)

    await waitFor(() => expect(popper.classList.contains('m3-popper_shown')).toBe(false))
  })

  test('replaces target triggers without retaining the old event', async () => {
    target = document.createElement('button')
    document.body.append(target)
    const onShow = vi.fn()

    const mounted = render(
      <M3Popper target={target} targetTriggers={{ show: ['focus'] }} onShow={onShow}>
        <div>Popper content</div>
      </M3Popper>
    )
    unmount = mounted.unmount

    fireEvent.click(target)
    expect(onShow).not.toHaveBeenCalled()

    mounted.rerender(
      <M3Popper target={target} targetTriggers={{ show: ['click'] }} onShow={onShow}>
        <div>Popper content</div>
      </M3Popper>
    )
    fireEvent.focus(target)
    expect(onShow).not.toHaveBeenCalled()

    fireEvent.click(target)
    expect(onShow).toHaveBeenCalledOnce()
    const { popper } = await waitForPopper()
    await waitFor(() => expect(popper.classList.contains('m3-popper_shown')).toBe(true))
  })

  test('moves the show trigger when the target element changes', async () => {
    target = document.createElement('button')
    document.body.append(target)
    const first = target
    const second = document.createElement('button')
    document.body.append(second)
    const onShow = vi.fn()

    try {
      const mounted = render(
        <M3Popper target={first} onShow={onShow}>
          <div>Popper content</div>
        </M3Popper>
      )
      unmount = mounted.unmount

      mounted.rerender(
        <M3Popper target={second} onShow={onShow}>
          <div>Popper content</div>
        </M3Popper>
      )

      fireEvent.click(first)
      expect(onShow).not.toHaveBeenCalled()

      fireEvent.click(second)
      expect(onShow).toHaveBeenCalledOnce()
      const { popper } = await waitForPopper()
      await waitFor(() => expect(popper.classList.contains('m3-popper_shown')).toBe(true))
    } finally {
      second.remove()
    }
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

  test('hides on a touch outside the popper', async () => {
    target = document.createElement('button')
    document.body.append(target)

    const mounted = render(
      <M3Popper target={target} detachTimeout={null} shown hideOnMissClick>
        <div>Popper content</div>
      </M3Popper>
    )
    unmount = mounted.unmount

    const { popper } = await waitForPopper()
    await waitFor(() => expect(popper.classList.contains('m3-popper_shown')).toBe(true))
    await act(async () => {
      await new Promise(resolve => requestAnimationFrame(resolve))
    })

    fireEvent(document.body, new Event('touchend', { bubbles: true }))

    await waitFor(() => expect(popper.classList.contains('m3-popper_shown')).toBe(false))
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 320))
    })
  })

  test('detaches after hiding and mounts again when shown', async () => {
    target = document.createElement('button')
    document.body.append(target)

    const mounted = render(
      <M3Popper target={target} detachTimeout={10} shown>
        <div>Popper content</div>
      </M3Popper>
    )
    unmount = mounted.unmount

    const { popper } = await waitForPopper()
    await waitFor(() => expect(popper.classList.contains('m3-popper_shown')).toBe(true))

    mounted.rerender(
      <M3Popper target={target} shown={false} detachTimeout={10}>
        <div>Popper content</div>
      </M3Popper>
    )
    await waitFor(() => expect(document.body.contains(popper)).toBe(false))

    mounted.rerender(
      <M3Popper target={target} detachTimeout={10} shown>
        <div>Popper content</div>
      </M3Popper>
    )
    const reopened = await waitForPopper()
    await waitFor(() => expect(reopened.popper.classList.contains('m3-popper_shown')).toBe(true))
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

  test('uses updated hide and toggle callbacks without remounting', async () => {
    target = document.createElement('button')
    document.body.append(target)
    const firstHide = vi.fn()
    const nextHide = vi.fn()
    const firstToggle = vi.fn()
    const nextToggle = vi.fn()
    const reference = createRef<M3PopperExposed>()

    const mounted = render(
      <M3Popper
        ref={reference}
        target={target}
        shown
        onHide={firstHide}
        onToggle={firstToggle}
      >
        <span>Popover</span>
      </M3Popper>
    )
    unmount = mounted.unmount
    const { popper } = await waitForPopper()
    await waitFor(() => expect(popper.classList.contains('m3-popper_shown')).toBe(true))

    mounted.rerender(
      <M3Popper
        ref={reference}
        target={target}
        shown
        onHide={nextHide}
        onToggle={nextToggle}
      >
        <span>Popover</span>
      </M3Popper>
    )
    act(() => reference.current!.hide(true))

    await waitFor(() => expect(popper.classList.contains('m3-popper_shown')).toBe(false))
    expect(firstHide).not.toHaveBeenCalled()
    expect(nextHide).toHaveBeenCalledWith('generic')
    expect(nextToggle).toHaveBeenCalledWith(false)
  })

  test('moves an open popper when its container changes', async () => {
    target = document.createElement('button')
    const first = document.createElement('div')
    const second = document.createElement('div')
    document.body.append(target, first, second)

    const mounted = render(
      <M3Popper target={target} container={first} shown>
        <span>Popover</span>
      </M3Popper>
    )
    unmount = () => {
      mounted.unmount()
      first.remove()
      second.remove()
    }

    const { popper } = await waitForPopper()
    await waitFor(() => expect(first.contains(popper)).toBe(true))

    mounted.rerender(
      <M3Popper target={target} container={second} shown>
        <span>Popover</span>
      </M3Popper>
    )

    await waitFor(() => expect(second.contains(popper)).toBe(true))
    expect(first.contains(popper)).toBe(false)
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

    mounted.rerender(
      <M3Popper ref={popperRef} target={target} shown onDispose={onDispose}>
        <span>Details</span>
      </M3Popper>
    )

    const reopened = await waitForPopper()
    await waitFor(() => {
      expect(reopened.popper.classList.contains('m3-popper_shown')).toBe(true)
    })
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

    mounted.rerender(
      <M3Popper ref={popperRef} target={target} animated shown>
        <span>Popover</span>
      </M3Popper>
    )
    position.mockResolvedValue(result('left'))
    await act(async () => {
      await popperRef.current!.adjust()
    })

    expect(popper.style.getPropertyValue('--m3-popper-origin-x')).toBe('right')
  })

  test('ignores an animation position that resolves after the popper unmounts', async () => {
    target = document.createElement('button')
    document.body.append(target)

    const popperRef = createRef<M3PopperExposed>()
    const mounted = render(
      <M3Popper ref={popperRef} target={target} shown animated>
        <span>Popover</span>
      </M3Popper>
    )
    unmount = mounted.unmount

    const { popper } = await waitForPopper()
    await waitFor(() => expect(popper.classList.contains('m3-popper_shown')).toBe(true))
    const originalOrigin = popper.style.getPropertyValue('--m3-popper-origin-x')

    let finish!: (result: Awaited<ReturnType<typeof floating.computePosition>>) => void
    const pending = new Promise<Awaited<ReturnType<typeof floating.computePosition>>>(resolve => {
      finish = resolve
    })
    const position = vi.spyOn(floating, 'computePosition').mockReturnValueOnce(pending)

    const adjustment = popperRef.current!.adjust()
    expect(position).toHaveBeenCalledOnce()

    mounted.unmount()
    unmount = null
    finish({ side: 'left' } as Awaited<ReturnType<typeof floating.computePosition>>)

    await expect(adjustment).resolves.toBeUndefined()
    expect(popper.style.getPropertyValue('--m3-popper-origin-x')).toBe(originalOrigin)
  })

  test('does not finish opening after positioning resolves for a disposed popper', async () => {
    target = document.createElement('button')
    document.body.append(target)

    let finish!: (result: Awaited<ReturnType<typeof floating.computePosition>>) => void
    const pending = new Promise<Awaited<ReturnType<typeof floating.computePosition>>>(resolve => {
      finish = resolve
    })
    const position = vi.spyOn(floating, 'computePosition').mockReturnValue(pending)
    const onToggle = vi.fn()
    const mounted = render(
      <M3Popper target={target} shown onToggle={onToggle}>
        <span>Popover</span>
      </M3Popper>
    )
    unmount = mounted.unmount

    await waitFor(() => expect(position).toHaveBeenCalled())
    mounted.unmount()
    unmount = null
    finish({ side: 'bottom' } as Awaited<ReturnType<typeof floating.computePosition>>)
    await act(async () => { await pending })

    expect(onToggle).not.toHaveBeenCalledWith(true)
  })

  test('does not finish opening after the external target disappears', async () => {
    target = document.createElement('button')
    document.body.append(target)

    type Position = Awaited<ReturnType<typeof floating.computePosition>>
    let finish!: (result: Position) => void
    const pending = new Promise<Position>(resolve => {
      finish = resolve
    })
    const position = vi.spyOn(floating, 'computePosition').mockReturnValue(pending)
    const onToggle = vi.fn()
    const mounted = render(
      <M3Popper target={target} shown onToggle={onToggle}>
        <span>Popover</span>
      </M3Popper>
    )
    unmount = mounted.unmount

    await waitFor(() => expect(position).toHaveBeenCalled())
    target.remove()
    finish({ side: 'bottom' } as Position)
    await act(async () => { await pending })

    expect(onToggle).not.toHaveBeenCalledWith(true)
  })

  test('does not position when the target disappears before the opening frame', async () => {
    target = document.createElement('button')
    document.body.append(target)

    const position = vi.spyOn(floating, 'computePosition')
    const onToggle = vi.fn()
    const mounted = render(
      <M3Popper target={target} shown onToggle={onToggle}>
        <span>Popover</span>
      </M3Popper>
    )
    unmount = mounted.unmount

    target.remove()
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 50))
    })

    expect(position).not.toHaveBeenCalled()
    expect(onToggle).not.toHaveBeenCalledWith(true)
  })

  test('ignores public show and adjust calls while disabled', async () => {
    target = document.createElement('button')
    document.body.append(target)

    const position = vi.spyOn(floating, 'computePosition')
    const popperRef = createRef<M3PopperExposed>()
    const onShow = vi.fn()
    const mounted = render(
      <M3Popper ref={popperRef} target={target} disabled onShow={onShow}>
        <span>Popover</span>
      </M3Popper>
    )
    unmount = mounted.unmount

    act(() => popperRef.current!.show(true))
    await act(async () => { await popperRef.current!.adjust() })

    expect(onShow).not.toHaveBeenCalled()
    expect(position).not.toHaveBeenCalled()
    expect(document.body.querySelector('.m3-popper-positioner')).toBeNull()
  })

  test('waits for a target instead of positioning against a missing element', async () => {
    const position = vi.spyOn(floating, 'computePosition')
    const popperRef = createRef<M3PopperExposed>()
    const onToggle = vi.fn()
    const mounted = render(
      <M3Popper ref={popperRef} target={null} onToggle={onToggle}>
        <span>Popover</span>
      </M3Popper>
    )
    unmount = mounted.unmount

    act(() => popperRef.current!.show(true))
    await waitForPopper()
    await act(async () => { await popperRef.current!.adjust() })
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 50))
    })

    expect(position).not.toHaveBeenCalled()
    expect(onToggle).not.toHaveBeenCalledWith(true)
  })

  test('positions against a replacement target before finishing opening', async () => {
    target = document.createElement('button')
    const replacement = document.createElement('button')
    document.body.append(target, replacement)

    type Position = Awaited<ReturnType<typeof floating.computePosition>>
    let finishFirst!: (result: Position) => void
    let finishSecond!: (result: Position) => void
    const first = new Promise<Position>(resolve => { finishFirst = resolve })
    const second = new Promise<Position>(resolve => { finishSecond = resolve })
    const position = vi.spyOn(floating, 'computePosition')
      .mockReturnValueOnce(first)
      .mockReturnValueOnce(second)
    const onToggle = vi.fn()
    const mounted = render(
      <M3Popper target={target} shown onToggle={onToggle}>
        <span>Popover</span>
      </M3Popper>
    )
    unmount = mounted.unmount

    try {
      await waitFor(() => expect(position).toHaveBeenCalledTimes(1))
      mounted.rerender(
        <M3Popper target={replacement} shown onToggle={onToggle}>
          <span>Popover</span>
        </M3Popper>
      )

      finishFirst({ side: 'bottom' } as Position)
      await waitFor(() => expect(position).toHaveBeenCalledTimes(2))
      expect(position.mock.calls[1][1]).toBe(replacement)
      expect(onToggle).not.toHaveBeenCalledWith(true)

      finishSecond({ side: 'bottom' } as Position)
      await waitFor(() => expect(onToggle).toHaveBeenCalledWith(true))
    } finally {
      replacement.remove()
    }
  })

  test('ignores the first position when a newer opening request is pending', async () => {
    target = document.createElement('button')
    document.body.append(target)

    type Position = Awaited<ReturnType<typeof floating.computePosition>>
    let finishFirst!: (result: Position) => void
    let finishSecond!: (result: Position) => void
    const first = new Promise<Position>(resolve => { finishFirst = resolve })
    const second = new Promise<Position>(resolve => { finishSecond = resolve })
    const position = vi.spyOn(floating, 'computePosition')
      .mockReturnValueOnce(first)
      .mockReturnValueOnce(second)

    const popperRef = createRef<M3PopperExposed>()
    const onToggle = vi.fn()
    const mounted = render(
      <M3Popper ref={popperRef} target={target} onToggle={onToggle}>
        <span>Popover</span>
      </M3Popper>
    )
    unmount = mounted.unmount

    act(() => popperRef.current!.show(true))
    await waitFor(() => expect(position).toHaveBeenCalledTimes(1))
    act(() => popperRef.current!.hide(true))
    act(() => popperRef.current!.show(true))
    await waitFor(() => expect(position).toHaveBeenCalledTimes(2))

    finishFirst({ side: 'left' } as Position)
    await act(async () => { await first })
    expect(onToggle).not.toHaveBeenCalledWith(true)

    finishSecond({ side: 'right' } as Position)
    await waitFor(() => expect(onToggle).toHaveBeenCalledTimes(1))
    expect(onToggle).toHaveBeenCalledWith(true)
  })

  test('applies changed target and dismissal options while shown', async () => {
    target = document.createElement('button')
    const nextTarget = document.createElement('button')
    document.body.append(target, nextTarget)
    const popperRef = createRef<M3PopperExposed>()
    const mounted = render(
      <M3Popper ref={popperRef} target={target} delay={50} hideOnMissClick={false} detachTimeout={null} shown>
        <span>Details</span>
      </M3Popper>
    )
    unmount = () => {
      mounted.unmount()
      nextTarget.remove()
    }

    const { popper } = await waitForPopper()
    await waitFor(() => expect(popper.classList.contains('m3-popper_shown')).toBe(true))

    mounted.rerender(
      <M3Popper ref={popperRef} target={nextTarget} delay={{ show: 5, hide: 5 }} detachTimeout={10} shown hideOnMissClick>
        <span>Details</span>
      </M3Popper>
    )
    await act(async () => { await popperRef.current!.adjust() })

    await act(async () => {
      await new Promise(resolve => requestAnimationFrame(() => setTimeout(resolve, 0)))
    })
    fireEvent.mouseDown(document.body)
    fireEvent.click(document.body)

    await waitFor(() => expect(popper.classList.contains('m3-popper_shown')).toBe(false))
    await waitFor(() => expect(document.body.contains(popper)).toBe(false))
  })
})
