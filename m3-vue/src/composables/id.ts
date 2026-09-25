import type { Ref } from 'vue'

import { computed, useId as useVueId } from 'vue'

export const useId = (name: string = 'm3-id', idRef: Ref<string | undefined> | undefined = undefined) => {
  const fallback = name + '-' + useVueId()

  return computed(() => idRef?.value ?? fallback)
}
