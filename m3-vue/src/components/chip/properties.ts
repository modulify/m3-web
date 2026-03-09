import type {
  Prop,
  PropType,
} from 'vue'
import type { Variant } from '@modulify/m3-foundation/types/components/chip'

import { variants } from './values'

export const variant: Prop<Variant, 'assist'> = {
  type: String as PropType<Variant>,
  validator: (value: string) => variants.includes(value as Variant),
  default: 'assist',
}
