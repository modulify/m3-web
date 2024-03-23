import type { Prop, PropType } from 'vue'

import type {
  Size,
  Variant,
} from '~types/components/fab-button'

import {
  sizes,
  variants,
} from '@/components/fab-button/values'

export const size = {
  type: String as PropType<Size>,
  validator: (size: string) => sizes.includes(size as Size),
  default: 'md',
} satisfies Prop<Size, 'md'>

export const variant = {
  type: String as PropType<Variant>,
  validator: (variant: string) => variants.includes(variant as Variant),
  default: 'primary',
} satisfies Prop<Variant, 'primary'>