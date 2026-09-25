import type { Boundary } from '@floating-ui/dom'
import type { Delay } from '@modulify/m3-foundation/types/components/popper'
import type { ElementReference } from '@modulify/m3-foundation/types/dom'
import type { HTMLAttributes } from 'react'
import type { OverflowBehavior } from '@modulify/m3-foundation/types/components/popper'
import type { Placement } from '@floating-ui/dom'
import type { Ref } from 'react'
import type { Strategy } from '@floating-ui/dom'
import type {
  Trigger,
  TriggerSchema,
} from '@modulify/m3-foundation/types/components/popper'

type HideReason = 'generic' | 'by-closer' | 'by-miss-click'

export interface M3PopperProps extends Omit<HTMLAttributes<HTMLElement>, 'onToggle'> {
  ref?: Ref<M3PopperExposed>;
  target: Element | null;
  targetTriggers?: Trigger[] | TriggerSchema;
  popperTriggers?: Trigger[] | TriggerSchema;
  shown?: boolean;
  hideOnMissClick?: boolean;
  placement?: Placement;
  strategy?: Strategy;
  boundary?: Boundary;
  container?: string | HTMLElement;
  offsetMainAxis?: number | string;
  offsetCrossAxis?: number | string;
  overflow?: OverflowBehavior[]
  delay?: number | string | Delay;
  disabled?: boolean;
  animated?: boolean;
  detachTimeout?: null | number | string;
  onShow?: () => void;
  onHide?: (reason: HideReason) => void;
  onToggle?: (shown: boolean) => void;
  onDispose?: () => void;
}

export interface M3PopperExposed extends M3PopperMethods, ElementReference<HTMLDivElement> {}

export interface M3PopperMethods {
  show (immediately?: boolean): void;
  hide (immediately?: boolean, reason?: HideReason): void;
  adjust (): Promise<void>;
  contains (el: Element | null): boolean;
}
