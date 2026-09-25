import type {
  Clickable,
  ElementReference,
  Focusable,
  Interactable,
} from '@modulify/m3-foundation/types/dom'
import type { MutableRefObject } from 'react'

import { renderHook } from '@testing-library/react'

import { useClickable, useFocusable, useInteractable } from '@/hooks'

describe('m3-react/interaction hooks', () => {
  test('exposes focused capabilities with their foundation contracts', () => {
    const target: MutableRefObject<HTMLButtonElement | null> = { current: null }
    const { result } = renderHook(() => ({
      clickable: useClickable(target),
      focusable: useFocusable(target),
      interactable: useInteractable(target),
    }))

    expectTypeOf(result.current.clickable).toEqualTypeOf<Clickable & ElementReference<HTMLButtonElement>>()
    expectTypeOf(result.current.focusable).toEqualTypeOf<ElementReference<HTMLButtonElement> & Focusable>()
    expectTypeOf(result.current.interactable).toEqualTypeOf<ElementReference<HTMLButtonElement> & Interactable>()
  })

  test('delegates to the current target', () => {
    const first = document.createElement('button')
    const second = document.createElement('button')
    const firstClick = vi.spyOn(first, 'click')
    const secondClick = vi.spyOn(second, 'click')
    const secondFocus = vi.spyOn(second, 'focus')
    const secondBlur = vi.spyOn(second, 'blur')
    const rootElement = document.createElement('span')
    const root: MutableRefObject<HTMLSpanElement | null> = { current: rootElement }
    const target: MutableRefObject<HTMLButtonElement | null> = { current: first }
    const { result } = renderHook(() => useInteractable(root, target))

    expect(result.current.el).toBe(rootElement)
    result.current.click()
    target.current = second
    result.current.click()
    result.current.focus()
    result.current.blur()

    expect(firstClick).toHaveBeenCalledOnce()
    expect(secondClick).toHaveBeenCalledOnce()
    expect(secondFocus).toHaveBeenCalledOnce()
    expect(secondBlur).toHaveBeenCalledOnce()
  })
})
