import type {
  Boundary,
} from '@floating-ui/dom'

import type {
  Delay,
  OverflowBehavior,
  Placement,
  Trigger,
  TriggerSchema,
} from '../../types/components/popper'

import type { Predicate } from '../predicates'

import {
  isArrayOf,
  isElement,
  isNumeric,
  isShape,
} from '../predicates'

import {
  OneOf,
} from '@modulify/validator/assertions'

import {
  isExact,
  Or,
} from '@modulify/validator/predicates'

export const isBoundary: Predicate<Boundary> = Or(
  isExact('clippingAncestors' as const),
  isElement,
  isArrayOf(isElement)
)

export const isDelay: Predicate<number | string | Delay> = Or(isNumeric, isShape({
  show: isNumeric,
  hide: isNumeric,
}))

export const isOverflowBehavior: Predicate<OverflowBehavior[]> = isArrayOf(
  OneOf<OverflowBehavior>(['flip', 'shift', 'hide'])
)

export const isPlacement: Predicate<Placement> = OneOf<Placement>([
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

export const isTrigger: Predicate<Trigger> = OneOf<Trigger>(['hover', 'focus', 'click', 'touch'])
export const isTriggerOptions: Predicate<Trigger[] | TriggerSchema> = Or(isArrayOf(isTrigger), isShape({
  show: isArrayOf(isTrigger),
  hide: isArrayOf(isTrigger),
}))
