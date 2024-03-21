import type { Delay } from '~types/components/popper'

export const normalizeDelay = (delay: number | string | Delay): Required<Delay> => ({
  show: 0,
  hide: 0,
  ...(typeof delay === 'object' ? delay : {
    show: Number(delay),
    hide: Number(delay),
  }),
})

export class Scheduler {
  private _timer: number | undefined = undefined

  schedule (operation: () => void, delay: number) {
    clearTimeout(this._timer)
    if (delay > 0) {
      this._timer = setTimeout(() => operation(), delay) as unknown as number
    } else {
      operation()
    }
  }

  abort () {
    clearTimeout(this._timer)
  }
}