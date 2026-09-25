import type { ElementReference, Interactable } from '@modulify/m3-foundation/types/dom'
import type { RefObject } from 'react'

import { useMemo } from 'react'

import useClickable from './useClickable'
import useFocusable from './useFocusable'

export default <Root extends Element, Target extends HTMLElement = Root & HTMLElement>(
  root: RefObject<Root | null>,
  target: RefObject<Target | null> = root as RefObject<Target | null>
): ElementReference<Root> & Interactable => {
  const clickable = useClickable(root, target)
  const focusable = useFocusable(root, target)

  return useMemo(() => ({
    get el () {
      return clickable.el
    },
    click: clickable.click,
    focus: focusable.focus,
    blur: focusable.blur,
  }), [clickable, focusable])
}
