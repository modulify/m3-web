import type { MutableRefObject } from 'react'

import { useEffect } from 'react'

import { isArray } from '@modulify/m3-foundation/lib/predicates'

export type ElementEffect<T extends Element> = (el: T) => () => void

const compose = <T extends Element>(el: T, effect: ElementEffect<T> | ElementEffect<T>[]) => {
  const _effects = isArray(effect) ? effect : [effect]
  const _destructors = _effects.map(e => e(el))

  return () => _destructors.forEach(d => d())
}

export default <T extends Element>(ref: MutableRefObject<T>, effect: ElementEffect<T> | ElementEffect<T>[]) => {
  return useEffect(() => {
    return ref.current
      ? compose(ref.current, effect)
      : () => {}
  }, [effect])
}