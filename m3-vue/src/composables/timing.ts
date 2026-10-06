import { onScopeDispose } from 'vue'

export function useTimeout<Arguments extends unknown[]> (
  callback: (...args: Arguments) => void,
  delay: number
) {
  let timer: ReturnType<typeof setTimeout> | null = null

  const cancel = () => {
    if (timer === null) {
      return
    }

    clearTimeout(timer)
    timer = null
  }

  const scheduleWithDelay = (nextDelay: number, ...args: Arguments) => {
    cancel()
    timer = setTimeout(() => {
      timer = null
      callback(...args)
    }, nextDelay)
  }

  const schedule = (...args: Arguments) => scheduleWithDelay(delay, ...args)

  onScopeDispose(cancel)

  return { schedule, scheduleWithDelay, cancel }
}
