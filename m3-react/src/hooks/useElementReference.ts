import type { ElementReference } from '@modulify/m3-foundation/types/dom'
import type { RefObject } from 'react'

import { useMemo } from 'react'

export default <ElementType extends Element>(
  root: RefObject<ElementType | null>
): ElementReference<ElementType> => useMemo(() => ({
  get el () {
    return root.current
  },
}), [root])
