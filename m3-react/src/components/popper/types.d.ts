import type { HTMLAttributes } from 'react'

import type {
  Delay,
  OverflowBehavior,
  Trigger,
  TriggerOptions,
} from '@modulify/m3-foundation/types/components/popper'

import type {
  Boundary,
  Placement,
  Strategy,
} from '@floating-ui/dom'

type HideReason = 'generic' | 'by-closer' | 'by-miss-click'

export interface M3PopperProps extends HTMLAttributes<HTMLElement> {
  target: Element | null;
  targetTriggers?: Trigger[] | TriggerOptions;
  popperTriggers?: Trigger[] | TriggerOptions;
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
  detachTimeout?: null | number | string;
  onShow?: () => void;
  onHide?: (reason: HideReason) => void;
  onToggle?: (shown: boolean) => void;
  onDispose?: () => void;
}

export interface M3PopperMethods {
  adjust (): Promise<void>;
  contains (el: Element | null): boolean;
  show (immediately?: boolean): void;
  hide (immediately?: boolean, reason?: HideReason): void;
}