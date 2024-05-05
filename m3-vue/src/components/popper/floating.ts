import type { Ref } from 'vue'

import { autoUpdate } from '@floating-ui/dom'

export const useAutoUpdate = (
  target: Ref<Element | null>,
  popper: Ref<HTMLElement | null>,
  adjust: () => void
) => {
  let stop: (() => void) | null = null

  const autoAdjustOff = () => {
    if (stop) {
      stop()
      stop = null
    }
  }

  return {
    autoAdjustOn: () => {
      autoAdjustOff()

      if (target.value && popper.value) {
        stop = autoUpdate(target.value, popper.value, adjust, {
          animationFrame: true,
          elementResize: true,
        })
      }
    },
    autoAdjustOff,
  }
}