import type {
  OverflowBehavior,
  Trigger,
} from '../../types/components/popper'

import {
  arrayOf,
  isElement,
  isExactly,
  isShape,
  oneOf,
} from '../predicates'

export const isBoundary = oneOf(isExactly('clippingAncestors'), isElement, arrayOf(isElement))

export const isOverflowBehavior = arrayOf((value: unknown) => {
  return (['flip', 'shift', 'hide'] as OverflowBehavior[]).includes(value as OverflowBehavior)
})

export const isTrigger = (value: unknown) => (['hover', 'focus', 'click', 'touch'] as Trigger[]).includes(value as Trigger)
export const isTriggerOptions = oneOf(arrayOf(isTrigger), isShape({
  show: arrayOf(isTrigger),
  hide: arrayOf(isTrigger),
}))
