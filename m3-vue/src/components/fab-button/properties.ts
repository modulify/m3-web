import type { Prop, PropType } from 'vue'
import type { Size, Variant } from '@modulify/m3-foundation/types/components/fab-button'

import { sizes, variants } from '@/components/fab-button/values'

export const size = {
  type: String as PropType<Size>,
  validator: (size: string) => sizes.includes(size as Size),
  default: 'sm',
} satisfies Prop<Size, 'sm'>

export const variant = {
  type: String as PropType<Variant>,
  validator: (variant: string) => variants.includes(variant as Variant),
  default: 'primary-container',
} satisfies Prop<Variant, 'primary-container'>
