import type { Ref } from 'vue'
import type { FloatingOptions } from '~types/components/popper'
import type { Middleware } from '@floating-ui/dom'

import {
  autoUpdate,
  computePosition as _compute,
  flip,
  hide,
  offset,
  shift,
} from '@floating-ui/dom'

const computeMiddleware = (options: Required<FloatingOptions>) => {
  const middleware: Middleware[] = []

  if (options.offsetMainAxis || options.offsetCrossAxis) {
    middleware.push(offset({
      mainAxis: Number(options.offsetMainAxis),
      crossAxis: Number(options.offsetCrossAxis),
    }))
  }

  if (options.overflow.includes('flip')) {
    middleware.push(flip({ boundary: options.boundary }))
  }

  if (options.overflow.includes('shift')) {
    middleware.push(shift({ boundary: options.boundary, padding: 12 }))
  }

  if (options.overflow.includes('hide')) {
    middleware.push(hide({ strategy: 'referenceHidden' }))
  }

  return middleware
}

export const computePosition = async (el: HTMLElement, target: Element, options: Required<FloatingOptions> & {
  onReferenceHidden: () => void
}) => {
  const { strategy, x, y, middlewareData } = await _compute(target, el, {
    middleware: computeMiddleware(options),
    placement: options.placement,
    strategy: options.strategy,
  })

  el.style.position = strategy
  el.style.transform = `translate3d(${Math.round(x)}px,${Math.round(y)}px,0)`

  if (middlewareData.hide) {
    const { referenceHidden } = middlewareData.hide
    if (referenceHidden) {
      options.onReferenceHidden()
    }
  }
}

export const useAutoUpdate = (
  target: Ref<Element | null>,
  popper: Ref<HTMLElement | null>,
  update: () => void
) => {
  let stopAutoUpdate: (() => void) | null = null

  const autoUpdateOff = () => {
    if (stopAutoUpdate) {
      stopAutoUpdate()
      stopAutoUpdate = null
    }
  }

  return {
    autoUpdateOn: () => {
      autoUpdateOff()

      if (target.value && popper.value) {
        stopAutoUpdate = autoUpdate(target.value, popper.value, update, {
          animationFrame: true,
          elementResize: true,
        })
      }
    },
    autoUpdateOff,
  }
}