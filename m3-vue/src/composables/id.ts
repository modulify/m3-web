import type { MaybeRefOrGetter } from 'vue'

import { computed, toValue, useId as useVueId } from 'vue'

export const useId = (
  name: string = 'm3-id',
  source: MaybeRefOrGetter<string | undefined> | undefined = undefined
) => {
  const fallback = name + '-' + useVueId()

  return computed(() => toValue(source) ?? fallback)
}
