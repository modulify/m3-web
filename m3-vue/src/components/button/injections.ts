import type { ComputedRef, InjectionKey } from 'vue'
import type { Size } from '@modulify/m3-foundation/types/components/button'

import { computed, inject, provide } from 'vue'

export const M3ButtonSize: InjectionKey<ComputedRef<Size>> = Symbol('M3ButtonSize')

export const provideM3ButtonSize = (getter: () => Size) => provide(M3ButtonSize, computed(getter))

export const useM3ButtonSize = (getter: () => Size | undefined) => {
  const inherited = inject(M3ButtonSize, undefined)
  return computed(() => getter() ?? inherited?.value ?? 'sm')
}
