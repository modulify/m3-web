import { defineComponent } from 'vue'
import { render } from '@testing-library/vue'

import { useAnimationFrame, useTimeout } from '@/composables'

const mountComposable = <T>(composable: () => T) => {
  let result: T | null = null
  const component = defineComponent({
    setup () {
      result = composable()

      return () => null
    },
  })
  const view = render(component)

  return {
    result: result as T,
    unmount: view.unmount,
  }
}

describe('m3-vue/scheduling composables', () => {
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

    const { result, unmount } = mountComposable(useAnimationFrame)
    const firstCallback = vi.fn()
    const secondCallback = vi.fn()

    result.request(firstCallback)
    result.request(secondCallback)

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

    const { result, unmount } = mountComposable(useAnimationFrame)

    result.request(vi.fn())
    unmount()

    expect(cancelAnimationFrame).toHaveBeenCalledWith(7)
  })

  test('timeout restarts and runs once after the latest delay', () => {
    vi.useFakeTimers()
    const callback = vi.fn<(value: string) => void>()
    const { result } = mountComposable(() => useTimeout(callback, 1000))

    result.schedule('initial')
    vi.advanceTimersByTime(500)
    result.schedule('next')
    vi.advanceTimersByTime(500)

    expect(callback).not.toHaveBeenCalled()

    vi.advanceTimersByTime(500)
    expect(callback).toHaveBeenCalledWith('next')
  })

  test('timeout can be cancelled and is cancelled on unmount', () => {
    vi.useFakeTimers()
    const callback = vi.fn()
    const { result, unmount } = mountComposable(() => useTimeout(callback, 1000))

    result.schedule()
    result.cancel()
    vi.advanceTimersByTime(1000)
    expect(callback).not.toHaveBeenCalled()

    result.schedule()
    unmount()
    vi.advanceTimersByTime(1000)
    expect(callback).not.toHaveBeenCalled()
  })
})
