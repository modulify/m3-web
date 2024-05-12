import type { CloserTarget } from '@modulify/m3-foundation/types/components/popper'
import type { ElementEffect } from '@/hooks/useElementEffect'

import {
  addCloserListeners,
  removeCloserListeners,
} from '@modulify/m3-foundation/lib/popper/closer'

import { useCallback } from 'react'

export type CloserOptions = {
  active?: boolean;
  all?: boolean;
}

export const createM3PopperCloserEffect = <T extends Element>({
  active = true,
  all = false,
}: CloserOptions = {}): ElementEffect<T> => {
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
