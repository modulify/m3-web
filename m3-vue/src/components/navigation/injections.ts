import type { Appearance } from '@modulify/m3-foundation/types/components/navigation'

import {
  computed,
  provide,
} from 'vue'

export const M3NavigationAppearance = Symbol('M3NavigationAppearance')

export const provideM3NavigationAppearance = (getter: () => Appearance) => {
  provide(M3NavigationAppearance, computed(getter))
}