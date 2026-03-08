import type {
  MutableRefObject,
  SetStateAction,
} from 'react'

import {
  useRef,
  useState,
} from 'react'

export function useStateRef<T>(
  initial: T
): [T, (next: SetStateAction<T>) => void, MutableRefObject<T>] {
  const [state, setState] = useState<T>(initial)
  const ref = useRef(state)

  const set = (next: SetStateAction<T>) => {
    setState((previous) => {
      const resolved = typeof next === 'function'
        ? (next as (value: T) => T)(previous)
        : next

      ref.current = resolved
      return resolved
    })
  }

  return [state, set, ref]
}
