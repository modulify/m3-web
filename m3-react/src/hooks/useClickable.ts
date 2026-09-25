import type { Clickable, ElementReference } from '@modulify/m3-foundation/types/dom'
import type { RefObject } from 'react'

import { useMemo } from 'react'

import useElementReference from './useElementReference'

export default <Root extends Element, Target extends HTMLElement = Root & HTMLElement>(
  root: RefObject<Root | null>,
  target: RefObject<Target | null> = root as RefObject<Target | null>
): Clickable & ElementReference<Root> => {
  const elementReference = useElementReference(root)

  return useMemo(() => ({
    get el () {
      return elementReference.el
    },
    click: () => target.current?.click(),
  }), [elementReference, target])
}
