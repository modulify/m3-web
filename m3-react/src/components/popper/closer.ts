import type { CloserTarget } from '@modulify/m3-foundation/types/components/popper'
import type { ElementEffect } from '@/hooks/useElementEffect'

import {
  addCloserListeners,
  removeCloserListeners,
} from '@modulify/m3-foundation/lib/popper/closer'

import { useCallback } from 'react'

export type M3PopperCloserOptions = {
  active?: boolean;
  all?: boolean;
}

export default <T extends Element>({
  active = true,
  all = false,
}: M3PopperCloserOptions = {}): ElementEffect<T> => {
  return useCallback((el: T) => {
    const _el = el as CloserTarget<T>
    _el.m3PopperCloseAll = all
    if (active) {
      addCloserListeners(_el)
    } else {
      removeCloserListeners(_el)
    }

    return () => removeCloserListeners(_el)
  }, [active, all])
}
