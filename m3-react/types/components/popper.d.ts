import type {
  Boundary,
  Placement,
  Strategy,
} from '@floating-ui/dom'

export type OverflowBehavior = 'flip' | 'shift' | 'hide'

export type Delay = { show?: number; hide?: number; }

export type Trigger = 'hover' | 'focus' | 'click' | 'touch'
export type TriggerOptions = {
  show?: Trigger[],
  hide?: Trigger[],
}

export type TriggerHandler = (event: Event) => void

export type FloatingOptions = {
  placement?: Placement;
  /** number or numeric string (for templates) */
  offsetMainAxis?: number | string;
  /** number or numeric string (for templates) */
  offsetCrossAxis?: number | string;
  overflow?: OverflowBehavior[];
  strategy?: Strategy;
  boundary?: Boundary;
}

export type ListeningOptions = {
  targetTriggers?: Trigger[] | TriggerOptions;
  popperTriggers?: Trigger[] | TriggerOptions;
  hideOnMissClick?: boolean;
}

export type SchedulingOptions = {
  delay?: number | string | Delay;
  detachTimeout?: number | string | null;
}

export type ShowingOptions = {
  shown?: boolean;
  container?: Element | string;
  disabled?: boolean;
}

export type PopperOptions = FloatingOptions
  & ListeningOptions
  & SchedulingOptions
  & ShowingOptions

export type CloserEvent<E extends Event = Event> = E & {
  m3PopperClose?: boolean;
  m3PopperCloseAll?: boolean;
}