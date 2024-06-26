import type { Prop, PropType } from 'vue'

import type { Appearance } from '@modulify/m3-foundation/types/components/button'

import { appearances } from './values'

export const appearance: Prop<Appearance, 'filled'> = {
  type: String as PropType<Appearance>,
  validator: (appearance: string) => appearances.includes(appearance as Appearance),
  default: 'filled',
}