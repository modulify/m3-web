import { defineComponent, ref } from 'vue'
import { render } from '@testing-library/vue'

import { useMutationObserver, useResizeObserver } from '@/composables'

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

describe('m3-vue/observer composables', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  test('resize observer adds current targets and disconnects on unmount', () => {
    const observe = vi.fn()
    const disconnect = vi.fn()

    vi.stubGlobal('ResizeObserver', vi.fn().mockImplementation(function () {
      return {
        observe,
        unobserve: vi.fn(),
        disconnect,
      }
    }))

    const first = document.createElement('div')
    const second = document.createElement('div')
    const firstTarget = ref<Element | null>(first)
    const secondTarget = ref<Element | null>(null)
    const { result, unmount } = mountComposable(() => useResizeObserver(
      [firstTarget, secondTarget],
      vi.fn(),
      { box: 'border-box' }
    ))

    result.observe()
    secondTarget.value = second
    result.observe()

    expect(ResizeObserver).toHaveBeenCalledOnce()
    expect(observe).toHaveBeenNthCalledWith(1, first, { box: 'border-box' })
    expect(observe).toHaveBeenNthCalledWith(2, second, { box: 'border-box' })

    unmount()
    expect(disconnect).toHaveBeenCalledOnce()
  })

  test('mutation observer can be stopped and restarted', () => {
    const observe = vi.fn()
    const disconnect = vi.fn()

    vi.stubGlobal('MutationObserver', vi.fn().mockImplementation(function () {
      return {
        observe,
        disconnect,
        takeRecords: vi.fn(),
      }
    }))

    const target = document.createElement('div')
    const { result } = mountComposable(() => useMutationObserver(
      target,
      vi.fn(),
      { attributes: true }
    ))

    result.observe()
    result.unobserve()
    result.observe()

    expect(MutationObserver).toHaveBeenCalledTimes(2)
    expect(observe).toHaveBeenCalledTimes(2)
    expect(disconnect).toHaveBeenCalledOnce()
  })

  test('does nothing when observer APIs are unavailable', () => {
    vi.stubGlobal('ResizeObserver', undefined)
    vi.stubGlobal('MutationObserver', undefined)

    const resize = mountComposable(() => useResizeObserver(document.body, vi.fn()))
    const mutation = mountComposable(() => useMutationObserver(document.body, vi.fn(), { childList: true }))

    expect(() => {
      resize.result.observe()
      mutation.result.observe()
    }).not.toThrow()
  })
})
