import type { Trigger } from '~types/components/popper'

export const isTrigger = (value: unknown) => (['hover', 'focus', 'click', 'touch'] as Trigger[]).includes(value as Trigger)
export const isTriggerArray = (value: unknown) => Array.isArray(value) && value.every(isTrigger)
export const isTriggerOptions = (value: unknown) => typeof value === 'object' &&
  (!('show' in (value as object)) || isTriggerArray((value as { show: unknown }).show)) &&
  (!('hide' in (value as object)) || isTriggerArray((value as { hide: unknown }).hide))