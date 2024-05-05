import type {
  Dispatch,
  SetStateAction,
} from 'react'

import {
  useRef,
  useState,
} from 'react'

const useDispatch = <T>(initial: T): Dispatch<SetStateAction<T>> => {
  const [, set] = useState(initial)

  return set
}

export default <
  T extends object,
  K extends keyof T = keyof T
>(initial: T, reactive: K[] = []) => {
  const keys = Object.keys(initial) as K[]
  const ref = useRef(initial)
  const dispatchers = keys.reduce((all, k) => {
    return reactive.includes(k) ? { ...all, [k]: useDispatch(initial[k]) } : all
  }, {} as Record<K, Dispatch<SetStateAction<T[K]>>>)

  return new Proxy({} as T, {
    get (_, property) {
      return keys.includes(property as K) ? ref.current[property as K] : undefined
    },

    set (_, property, value: T[K]) {
      if (keys.includes(property as K)) {
        ref.current[property as K] = value
        if (property in dispatchers) {
          dispatchers[property](value)
        }
        return true
      }

      return false
    },
  })
}
