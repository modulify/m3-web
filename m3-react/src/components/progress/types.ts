import type { ElementReference } from '@modulify/m3-foundation/types/dom'
import type { HTMLAttributes } from 'react'
import type {
  ProgressShape,
  ProgressVariant,
} from '@modulify/m3-foundation/types/components/progress'
import type { Ref } from 'react'

export interface M3ProgressExposed extends ElementReference<HTMLDivElement> {}

export interface ProgressBaseProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'role' | 'aria-valuemin' | 'aria-valuemax' | 'aria-valuenow'
> {
  ref?: Ref<M3ProgressExposed>;
  value?: number;
  indeterminate?: boolean;
  shape?: ProgressShape;
  thickness?: number;
  track?: boolean;
}

export interface M3ProgressLineProps extends ProgressBaseProps {
  stop?: boolean;
}

export interface M3ProgressCircleProps extends ProgressBaseProps {
  size?: number;
}

export interface M3ProgressProps extends M3ProgressLineProps {
  variant?: ProgressVariant;
  size?: number;
}
