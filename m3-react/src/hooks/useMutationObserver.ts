import type { RefObject } from 'react'

import { useEffect, useRef } from 'react'

type MutationObserverTargetSource = Node | RefObject<Node | null> | (() => Node | null) | null
type MutationObserverTargetValue = MutationObserverTargetSource | readonly MutationObserverTargetSource[]

export type MutationObserverTarget =
  | MutationObserverTargetValue
  | RefObject<MutationObserverTargetValue>
  | (() => MutationObserverTargetValue)

const isRefObject = (value: unknown): value is RefObject<MutationObserverTargetValue> => {
  return typeof value === 'object' && value !== null && 'current' in value
}

const resolveTargets = (target: MutationObserverTarget): Node[] => {
  const value = typeof target === 'function'
    ? target()
    : isRefObject(target)
      ? target.current
      : target
  const sources = Array.isArray(value) ? value : [value]
  const nodes = sources.map((source) => {
    if (typeof source === 'function') {
      return source()
    }

    return isRefObject(source) ? source.current : source
  })

  return [...new Set(nodes.filter((node): node is Node => node !== null))]
}

const equalTargets = (a: readonly Node[], b: readonly Node[]) => {
  return a.length === b.length && a.every((node, index) => node === b[index])
}

const equalFilters = (a?: string[], b?: string[]) => {
  return a === b || !!a && !!b && a.length === b.length && a.every((value, index) => value === b[index])
}

const equalOptions = (a: MutationObserverInit | null, b: MutationObserverInit) => {
  return !!a
    && a.attributes === b.attributes
    && a.attributeOldValue === b.attributeOldValue
    && a.characterData === b.characterData
    && a.characterDataOldValue === b.characterDataOldValue
    && a.childList === b.childList
    && a.subtree === b.subtree
    && equalFilters(a.attributeFilter, b.attributeFilter)
}

const copyOptions = (options: MutationObserverInit): MutationObserverInit => ({
  ...options,
  attributeFilter: options.attributeFilter ? [...options.attributeFilter] : undefined,
})

export default (
  target: MutationObserverTarget,
  callback: MutationCallback,
  options: MutationObserverInit
) => {
  const callbackRef = useRef(callback)
  const observerRef = useRef<MutationObserver | null>(null)
  const observedTargetsRef = useRef<readonly Node[]>([])
  const optionsRef = useRef<MutationObserverInit | null>(null)

  callbackRef.current = callback

  useEffect(() => {
    const targets = resolveTargets(target)

    if (typeof MutationObserver === 'undefined' || targets.length === 0) {
      observerRef.current?.disconnect()
      observerRef.current = null
      observedTargetsRef.current = []
      optionsRef.current = null
      return
    }

    if (
      observerRef.current
      && equalTargets(observedTargetsRef.current, targets)
      && equalOptions(optionsRef.current, options)
    ) {
      return
    }

    observerRef.current?.disconnect()
    observerRef.current = new MutationObserver((records, observer) => {
      callbackRef.current(records, observer)
    })

    targets.forEach(node => observerRef.current?.observe(node, options))
    observedTargetsRef.current = targets
    optionsRef.current = copyOptions(options)
  })

  useEffect(() => {
    return () => {
      observerRef.current?.disconnect()
      observerRef.current = null
      observedTargetsRef.current = []
      optionsRef.current = null
    }
  }, [])
}
