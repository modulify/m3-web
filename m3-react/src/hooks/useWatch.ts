import {
  useEffect,
  useRef,
} from 'react'

import isEqual from 'lodash.isequal'

export type WatchHandler<T> = (current: T, previous: T) => void
export type WatchOptions = {
  deep?: boolean;
  instant?: boolean;
}

const equal = <T>(a: T, b: T, options: WatchOptions) => {
  return options.deep ? isEqual(a, b) : a === b
}

export default <T, O extends WatchOptions>(
  value: T,
  handler: WatchHandler<T>,
  options: O = { deep: false } as O
) => {
  const stash = useRef<T>(value)
  const called = useRef(false)

  useEffect(() => {
    if (options.instant && !called || !equal(stash.current, value, options)) {
      handler(value, stash.current)
      stash.current = value
      called.current = true
    }
  }, [value])
}
