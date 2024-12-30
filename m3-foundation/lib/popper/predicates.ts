import type {
  OverflowBehavior,
  Placement,
  Trigger,
} from '../../types/components/popper'

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

export const isBoundary = Or(isExact('clippingAncestors' as const), isElement, isArrayOf(isElement))

export const isDelay = Or(isNumeric, isShape({
  show: isNumeric,
  hide: isNumeric,
}))

export const isOverflowBehavior = isArrayOf(OneOf<OverflowBehavior>(['flip', 'shift', 'hide']))

export const isPlacement = OneOf<Placement>([
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

export const isTrigger = OneOf<Trigger>(['hover', 'focus', 'click', 'touch'])
export const isTriggerOptions = Or(isArrayOf(isTrigger), isShape({
  show: isArrayOf(isTrigger),
  hide: isArrayOf(isTrigger),
}))
