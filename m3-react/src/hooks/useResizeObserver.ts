import type { RefObject } from 'react'

import { hasProperty } from '@modulify/validator/predicates'
import { useEffect, useRef } from 'react'

type ResizeObserverTargetSource = Element | RefObject<Element | null> | (() => Element | null) | null
type ResizeObserverTargetValue = ResizeObserverTargetSource | readonly ResizeObserverTargetSource[]

export type ResizeObserverTarget =
  | ResizeObserverTargetValue
  | RefObject<ResizeObserverTargetValue>
  | (() => ResizeObserverTargetValue)

const isRefObject = (value: unknown): value is RefObject<ResizeObserverTargetValue> => {
  return hasProperty('current')(value)
}

const resolveTargets = (target: ResizeObserverTarget): Element[] => {
  const value = typeof target === 'function'
    ? target()
    : isRefObject(target)
      ? target.current
      : target
  const sources = Array.isArray(value) ? value : [value]
  const elements = sources.map((source) => {
    if (typeof source === 'function') {
      return source()
    }

    return isRefObject(source) ? source.current : source
  })

  return [...new Set(elements.filter((element): element is Element => element !== null))]
}

const syncTargets = (
  observer: ResizeObserver,
  previousTargets: readonly Element[],
  targets: readonly Element[],
  options?: ResizeObserverOptions
) => {
  const nextTargets = new Set(targets)

  previousTargets
    .filter(element => !nextTargets.has(element))
    .forEach(element => observer.unobserve(element))

  const previous = new Set(previousTargets)

  targets
    .filter(element => !previous.has(element))
    .forEach(element => observer.observe(element, options))
}

export default (
  target: ResizeObserverTarget,
  callback: ResizeObserverCallback,
  options?: ResizeObserverOptions
) => {
  const callbackRef = useRef(callback)
  const observerRef = useRef<ResizeObserver | null>(null)
  const observedTargetsRef = useRef<readonly Element[]>([])
  const observedBoxRef = useRef<ResizeObserverBoxOptions | undefined>(options?.box)

  callbackRef.current = callback

  useEffect(() => {
    const targets = resolveTargets(target)

    if (typeof ResizeObserver === 'undefined' || targets.length === 0) {
      observerRef.current?.disconnect()
      observerRef.current = null
      observedTargetsRef.current = []
      observedBoxRef.current = options?.box
      return
    }

    if (!observerRef.current || observedBoxRef.current !== options?.box) {
      observerRef.current?.disconnect()
      observerRef.current = new ResizeObserver((entries, observer) => {
        callbackRef.current(entries, observer)
      })
      observedTargetsRef.current = []
      observedBoxRef.current = options?.box
    }

    syncTargets(observerRef.current, observedTargetsRef.current, targets, options)

    observedTargetsRef.current = targets
  })

  useEffect(() => {
    return () => {
      observerRef.current?.disconnect()
      observerRef.current = null
      observedTargetsRef.current = []
    }
  }, [])
}
