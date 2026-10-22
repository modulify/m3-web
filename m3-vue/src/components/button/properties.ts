import type { Appearance } from '@modulify/m3-foundation/types/components/button'
import type { Prop, PropType } from 'vue'
import type {
  Rounding,
  Size,
  Width,
} from '@modulify/m3-foundation/types/components/button'

import { appearances, roundings, sizes } from './values'

export const appearance: Prop<Appearance, 'filled'> = {
  type: String as PropType<Appearance>,
  validator: (appearance: string) => appearances.includes(appearance as Appearance),
  default: 'filled',
}

export const size: Prop<Size, undefined> = {
  type: String as PropType<Size>,
  validator: (value: string) => sizes.includes(value as Size),
  default: undefined,
}

export const rounding: Prop<Rounding, 'round'> = {
  type: String as PropType<Rounding>,
  validator: (value: string) => roundings.includes(value as Rounding),
  default: 'round',
}

export const width: Prop<Width, 'auto'> = {
  type: String as PropType<Width>,
  validator: (value: string) => ['auto', 'narrow', 'medium', 'wide'].includes(value),
  default: 'auto',
}
