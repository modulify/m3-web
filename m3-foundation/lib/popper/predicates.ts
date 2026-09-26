import type { Boundary } from '@floating-ui/dom'
import type { Delay, OverflowBehavior, Placement } from '../../types/components/popper'
import type { Predicate } from '../predicates'
import type { Trigger, TriggerSchema } from '../../types/components/popper'

import { isExact, isShape, Or } from '@modulify/validator/predicates'

import { isArrayOf, isElement, isNumeric } from '../predicates'

const isOneOf = <T>(values: readonly T[]): Predicate<T> => Or(
  ...values.map(value => isExact(value))
)

export const isBoundary: Predicate<Boundary> = Or(
  isExact('clippingAncestors' as const),
  isElement,
  isArrayOf(isElement)
)

export const isDelay: Predicate<number | string | Delay> = Or(isNumeric, isShape({
  show: [isNumeric, false],
  hide: [isNumeric, false],
}))

export const isOverflowBehavior: Predicate<OverflowBehavior[]> = isArrayOf(
  isOneOf<OverflowBehavior>(['flip', 'shift', 'hide'])
)

export const isPlacement: Predicate<Placement> = isOneOf<Placement>([
  'left',
  'left-start',
  'left-end',
  'top',
  'top-start',
  'top-end',
  'right',
  'right-start',
  'right-end',
  'bottom',
  'bottom-start',
  'bottom-end',
])

export const isTrigger: Predicate<Trigger> = isOneOf<Trigger>(['hover', 'focus', 'click', 'touch'])
export const isTriggerOptions: Predicate<Trigger[] | TriggerSchema> = Or(isArrayOf(isTrigger), isShape({
  show: [isArrayOf(isTrigger), false],
  hide: [isArrayOf(isTrigger), false],
}))
