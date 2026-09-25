import type { MutableRefObject } from 'react'

import { renderHook } from '@testing-library/react'

import { useMutationObserver, useResizeObserver } from '@/hooks'

describe('m3-react/observer hooks', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  test('resize observer follows target changes and uses the latest callback', () => {
    const observe = vi.fn()
    const unobserve = vi.fn()
    const disconnect = vi.fn()
    let observerCallback: ResizeObserverCallback = () => {}
    const observer = { observe, unobserve, disconnect }

    vi.stubGlobal('ResizeObserver', vi.fn().mockImplementation(function (callback: ResizeObserverCallback) {
      observerCallback = callback
      return observer
    }))

    const first = document.createElement('div')
    const second = document.createElement('div')
    const target: MutableRefObject<Element | null> = { current: first }
    const initialCallback = vi.fn()
    const nextCallback = vi.fn()
    const { rerender, unmount } = renderHook(
      ({ callback }) => useResizeObserver([target], callback),
      { initialProps: { callback: initialCallback } }
    )

    expect(observe).toHaveBeenCalledWith(first, undefined)

    target.current = second
    rerender({ callback: nextCallback })
    observerCallback([], observer as unknown as ResizeObserver)

    expect(unobserve).toHaveBeenCalledWith(first)
    expect(observe).toHaveBeenLastCalledWith(second, undefined)
    expect(initialCallback).not.toHaveBeenCalled()
    expect(nextCallback).toHaveBeenCalledOnce()

    unmount()
    expect(disconnect).toHaveBeenCalledOnce()
  })

  test('mutation observer supports multiple targets and stable inline options', () => {
    const observe = vi.fn()
    const disconnect = vi.fn()

    vi.stubGlobal('MutationObserver', vi.fn().mockImplementation(function () {
      return {
        observe,
        disconnect,
        takeRecords: vi.fn(),
      }
    }))

    const first = document.createElement('div')
    const second = document.createElement('div')
    const firstTarget: MutableRefObject<Node | null> = { current: first }
    const secondTarget: MutableRefObject<Node | null> = { current: second }
    const { rerender, unmount } = renderHook(() => useMutationObserver(
      [firstTarget, secondTarget],
      vi.fn(),
      { attributes: true, attributeFilter: ['class'] }
    ))

    expect(MutationObserver).toHaveBeenCalledOnce()
    expect(observe).toHaveBeenNthCalledWith(1, first, {
      attributes: true,
      attributeFilter: ['class'],
    })
    expect(observe).toHaveBeenNthCalledWith(2, second, {
      attributes: true,
      attributeFilter: ['class'],
    })

    rerender()
    expect(MutationObserver).toHaveBeenCalledOnce()

    unmount()
    expect(disconnect).toHaveBeenCalledOnce()
  })

  test('does nothing when observer APIs are unavailable', () => {
    vi.stubGlobal('ResizeObserver', undefined)
    vi.stubGlobal('MutationObserver', undefined)

    expect(() => renderHook(() => {
      useResizeObserver(document.body, vi.fn())
      useMutationObserver(document.body, vi.fn(), { childList: true })
    })).not.toThrow()
  })
})
