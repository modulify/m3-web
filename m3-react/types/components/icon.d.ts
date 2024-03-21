import type { DefineComponent, SVGAttributes } from 'vue'

export type Appearance = 'filled' | 'outlined'
export type Sprite = DefineComponent<NonNullable<SVGAttributes>, NonNullable<unknown>, unknown>