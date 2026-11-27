import type { ElementReference } from '@modulify/m3-foundation/types/dom'
import type { HTMLAttributes, Ref } from 'react'

export interface M3LoadingIndicatorExposed extends ElementReference<HTMLDivElement> {}

export interface M3LoadingIndicatorProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'role' | 'aria-valuemin' | 'aria-valuemax' | 'aria-valuenow'
> {
  ref?: Ref<M3LoadingIndicatorExposed>;
  contained?: boolean;
  size?: number;
}
