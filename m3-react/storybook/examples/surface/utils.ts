import {
  useRef,
  useState,
} from 'react'

import type {
  MutableRefObject,
  SetStateAction,
} from 'react'

export function wait (ms: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), ms)
  })
}

export function raf (): Promise<void> {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve())
  })
}

export function clamp (value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export function useLatest<T> (value: T): MutableRefObject<T> {
  const ref = useRef(value)
  ref.current = value
  return ref
}

export function useStateRef<T> (
  initial: T
): [T, (next: SetStateAction<T>) => void, MutableRefObject<T>] {
  const [state, setState] = useState<T>(initial)
  const ref = useRef(state)

  const set = (next: SetStateAction<T>) => {
    setState((prev) => {
      const resolved = typeof next === 'function'
        ? (next as (previous: T) => T)(prev)
        : next

      ref.current = resolved
      return resolved
    })
  }

  return [state, set, ref]
}
