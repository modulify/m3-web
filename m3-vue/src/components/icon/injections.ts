import type { Appearance } from '~types/components/icon'

import {
  computed,
  provide,
} from 'vue'

export const M3IconAppearance = Symbol('M3IconAppearance')

export const provideM3IconAppearance = (getter: () => Appearance) => provide(M3IconAppearance, computed(getter))