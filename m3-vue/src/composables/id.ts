import type { Ref } from 'vue'

import { computed, useId } from 'vue'

export default (name: string = 'm3-id', idRef: Ref<string | undefined> | undefined = undefined) => {
  const fallback = name + '-' + useId()

  return computed(() => idRef?.value ?? fallback)
}