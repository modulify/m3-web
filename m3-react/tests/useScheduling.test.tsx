import { renderHook } from '@testing-library/react'

import { useAnimationFrame, useTimeout } from '@/hooks'

describe('m3-react/scheduling hooks', () => {
  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  test('animation frame request replaces the pending frame and clears after running', () => {
    const callbacks = new Map<number, FrameRequestCallback>()
    const cancelAnimationFrame = vi.fn((id: number) => callbacks.delete(id))
    let nextId = 0

    vi.stubGlobal('requestAnimationFrame', vi.fn((callback: FrameRequestCallback) => {
      const id = ++nextId
      callbacks.set(id, callback)

      return id
    }))
    vi.stubGlobal('cancelAnimationFrame', cancelAnimationFrame)

    const { result, unmount } = renderHook(useAnimationFrame)
    const firstCallback = vi.fn()
    const secondCallback = vi.fn()

    result.current.request(firstCallback)
    result.current.request(secondCallback)

    expect(cancelAnimationFrame).toHaveBeenCalledWith(1)
    expect(callbacks.has(1)).toBe(false)

    callbacks.get(2)?.(16)

    expect(firstCallback).not.toHaveBeenCalled()
    expect(secondCallback).toHaveBeenCalledWith(16)

    unmount()
    expect(cancelAnimationFrame).toHaveBeenCalledOnce()
  })

  test('animation frame is cancelled on unmount', () => {
    vi.stubGlobal('requestAnimationFrame', vi.fn(() => 7))
    vi.stubGlobal('cancelAnimationFrame', vi.fn())

    const { result, unmount } = renderHook(useAnimationFrame)

    result.current.request(vi.fn())
    unmount()

    expect(cancelAnimationFrame).toHaveBeenCalledWith(7)
  })

  test('timeout restarts and uses the latest callback and delay', () => {
    vi.useFakeTimers()
    const initialCallback = vi.fn<(value: string) => void>()
    const nextCallback = vi.fn<(value: string) => void>()
    const { result, rerender } = renderHook(
      ({ callback, delay }) => useTimeout(callback, delay),
      { initialProps: { callback: initialCallback, delay: 1000 } }
    )

    result.current.schedule('initial')
    vi.advanceTimersByTime(500)
    rerender({ callback: nextCallback, delay: 750 })
    result.current.schedule('next')
    vi.advanceTimersByTime(749)

    expect(initialCallback).not.toHaveBeenCalled()
    expect(nextCallback).not.toHaveBeenCalled()

    vi.advanceTimersByTime(1)
    expect(nextCallback).toHaveBeenCalledWith('next')
  })

  test('timeout can be cancelled and is cancelled on unmount', () => {
    vi.useFakeTimers()
    const callback = vi.fn()
    const { result, unmount } = renderHook(() => useTimeout(callback, 1000))

    result.current.schedule()
    result.current.cancel()
    vi.advanceTimersByTime(1000)
    expect(callback).not.toHaveBeenCalled()

    result.current.schedule()
    unmount()
    vi.advanceTimersByTime(1000)
    expect(callback).not.toHaveBeenCalled()
  })
})
