import type { ComputedRef, InjectionKey } from 'vue'
import type {
  Rounding,
  Selection,
  Size,
  Variant,
} from '@modulify/m3-foundation/types/components/button-group'

export interface ButtonGroupContext {
  variant: ComputedRef<Variant>;
  size: ComputedRef<Size>;
  rounding: ComputedRef<Rounding>;
  selection: ComputedRef<Selection>;
  selected: (value: string) => boolean;
  activate: (value: string) => void;
}

export const ButtonGroupKey: InjectionKey<ButtonGroupContext> = Symbol('M3ButtonGroup')
