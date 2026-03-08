import type {
  CSSProperties,
  HTMLAttributes,
} from 'react'
import type {
  Length as SurfaceLength,
  Variant as SurfaceVariant,
} from '@modulify/m3-foundation/types/components/surface'

import {
  getSurfacePanelClassRecord,
  getSurfacePanelStyle as getFoundationSurfacePanelStyle,
} from '@modulify/m3-foundation/lib/surface/style'

export {
  DEFAULT_SURFACE_TRANSITION_TIMING,
  getModalAnchorStyle,
  getResolvedVariant,
  getSurfaceTransition,
  getVariantClassName,
  isDefined,
  toLength,
} from '@modulify/m3-foundation/lib/surface/style'

import { toClassName } from '@/utils/styling'

export type M3SurfacePanelVariant = SurfaceVariant

export interface M3SurfacePanelProps extends HTMLAttributes<HTMLElement> {
  id?: string;
  tag?: keyof HTMLElementTagNameMap;
  elevation?: number;
  variant?: M3SurfacePanelVariant;
  fillWidth?: boolean;
  fillHeight?: boolean;
  width?: SurfaceLength | null;
  height?: SurfaceLength | null;
  minWidth?: SurfaceLength | null;
  maxWidth?: SurfaceLength | null;
  minHeight?: SurfaceLength | null;
  maxHeight?: SurfaceLength | null;
  rounding?: SurfaceLength;
  roundingTopLeft?: SurfaceLength | null;
  roundingTopRight?: SurfaceLength | null;
  roundingBottomRight?: SurfaceLength | null;
  roundingBottomLeft?: SurfaceLength | null;
  transitionMs?: number;
  transitionTiming?: string;
  overflow?: CSSProperties['overflow'];
}

export const getSurfacePanelClassName = ({
  className = '',
  elevation = 0,
  variant = 'auto',
}: Pick<M3SurfacePanelProps, 'className' | 'elevation' | 'variant'>): string => {
  return toClassName([className, getSurfacePanelClassRecord(elevation, variant)])
}

export const getSurfacePanelStyle = (options: Pick<
  M3SurfacePanelProps,
  | 'fillWidth'
  | 'fillHeight'
  | 'width'
  | 'height'
  | 'minWidth'
  | 'maxWidth'
  | 'minHeight'
  | 'maxHeight'
  | 'rounding'
  | 'roundingTopLeft'
  | 'roundingTopRight'
  | 'roundingBottomRight'
  | 'roundingBottomLeft'
  | 'transitionMs'
  | 'transitionTiming'
  | 'overflow'
  | 'style'
>): CSSProperties => getFoundationSurfacePanelStyle({
  ...options,
  style: options.style as object | undefined,
}) as CSSProperties
