import type { ElementEffect } from '@/hooks/useElementEffect'

import {
  useCallback,
  useState,
} from 'react'

export default <T extends Element>(): [T | null, ElementEffect<T>] => {
  const [target, setTarget] = useState<T | null>(null)

  return [target, useCallback((el: T) => {
    setTarget(el)
    return () => {}
  }, [setTarget])]
}