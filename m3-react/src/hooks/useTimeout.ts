import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react'

export default <Arguments extends unknown[]>(callback: (...args: Arguments) => void, delay: number) => {
  const callbackRef = useRef(callback)
  const delayRef = useRef(delay)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  callbackRef.current = callback
  delayRef.current = delay

  const cancel = useCallback(() => {
    if (timerRef.current === null) {
      return
    }

    clearTimeout(timerRef.current)
    timerRef.current = null
  }, [])

  const schedule = useCallback((...args: Arguments) => {
    cancel()
    timerRef.current = setTimeout(() => {
      timerRef.current = null
      callbackRef.current(...args)
    }, delayRef.current)
  }, [cancel])

  useEffect(() => cancel, [cancel])

  return useMemo(() => ({ schedule, cancel }), [schedule, cancel])
}
