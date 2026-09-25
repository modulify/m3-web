import type { MaybeRefOrGetter } from 'vue'

import { onBeforeUnmount, toValue } from 'vue'

type ObserverTargetSource<T extends Node> = MaybeRefOrGetter<T | null>
type ObserverTarget<T extends Node> =
  | ObserverTargetSource<T>
  | readonly ObserverTargetSource<T>[]
  | MaybeRefOrGetter<readonly ObserverTargetSource<T>[]>

const resolveTargets = <T extends Node>(target: ObserverTarget<T>): T[] => {
  const value = toValue(target)
  const sources = Array.isArray(value) ? value : [value]
  const nodes = sources.map(source => toValue(source))

  return [...new Set(nodes.filter((node): node is T => node !== null))]
}

export function useResizeObserver(
  target: ObserverTarget<Element>,
  callback: ResizeObserverCallback,
  options?: ResizeObserverOptions
) {
  let observer: ResizeObserver | null = null
  const observedTargets = new Set<Element>()

  const observe = () => {
    const targets = resolveTargets(target)

    if (targets.length === 0 || typeof ResizeObserver === 'undefined') {
      return
    }

    observer ??= new ResizeObserver(callback)

    targets.forEach((element) => {
      if (!observedTargets.has(element)) {
        observer?.observe(element, options)
        observedTargets.add(element)
      }
    })
  }

  const unobserve = () => {
    observer?.disconnect()
    observer = null
    observedTargets.clear()
  }

  onBeforeUnmount(unobserve)

  return { observe, unobserve }
}

export function useMutationObserver(
  target: ObserverTarget<Node>,
  callback: MutationCallback,
  options: MutationObserverInit
) {
  let observer: MutationObserver | null = null
  const observedTargets = new Set<Node>()

  const observe = () => {
    const targets = resolveTargets(target)

    if (targets.length === 0 || typeof MutationObserver === 'undefined') {
      return
    }

    observer ??= new MutationObserver(callback)

    targets.forEach((node) => {
      if (!observedTargets.has(node)) {
        observer?.observe(node, options)
        observedTargets.add(node)
      }
    })
  }

  const unobserve = () => {
    observer?.disconnect()
    observer = null
    observedTargets.clear()
  }

  onBeforeUnmount(unobserve)

  return { observe, unobserve }
}
