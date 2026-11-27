import type { M3PopperProps } from './types'
import type { MutableRefObject } from 'react'
import type { TriggerHandler } from '@modulify/m3-foundation/types/components/popper'

import { Listener } from '@modulify/m3-foundation/lib/popper'

import { autoUpdate } from '@floating-ui/dom'
import { normalizeDelay } from '@modulify/m3-foundation/lib/popper/scheduling'
import { useMemo, useRef } from 'react'

export const useAutoAdjust = (
  targetRef: MutableRefObject<Element | null>,
  popperRef: MutableRefObject<HTMLDivElement | null>,
  adjust: () => void
) => useMemo(() => {
  let stop: (() => void) | null = null

  const off = () => {
    if (stop) {
      stop()
      stop = null
    }
  }

  off()

  return [() => {
    off()

    if (targetRef.current && popperRef.current) {
      stop = autoUpdate(targetRef.current, popperRef.current, adjust, {
        animationFrame: true,
        elementResize: typeof ResizeObserver !== 'undefined',
      })
    }
  }, off]
}, [adjust])

export const useDelay = (delay: M3PopperProps['delay']) => {
  const normalized = useMemo(() => normalizeDelay(delay ?? 0), [delay])

  return [
    useMemo(() => normalized.show, [normalized]),
    useMemo(() => normalized.hide, [normalized]),
  ]
}

export const useListening = ([onShow, onHide]: [TriggerHandler, TriggerHandler]) => {
  const handlers = useRef({ onShow, onHide })
  handlers.current = { onShow, onHide }

  return useMemo(() => ({
    target: new Listener(
      event => handlers.current.onShow(event),
      event => handlers.current.onHide(event)
    ),
    popper: new Listener(
      event => handlers.current.onShow(event),
      event => handlers.current.onHide(event)
    ),
  }), [])
}
