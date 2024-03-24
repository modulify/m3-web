import type { DefineComponent, SVGAttributes } from 'vue'

export type Sprite = DefineComponent<
  NonNullable<SVGAttributes>,
  NonNullable<unknown>,
  unknown
>