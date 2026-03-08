import type {
  CSSProperties,
  PropType,
} from 'vue'
import type {
  Length as SurfaceLength,
  Variant as SurfaceVariant,
} from '@modulify/m3-foundation/types/components/surface'

import {
  DEFAULT_SURFACE_TRANSITION_TIMING,
  getSurfacePanelClassRecord,
  getSurfacePanelStyle as getFoundationSurfacePanelStyle,
} from '@modulify/m3-foundation/lib/surface/style'

export {
  getModalAnchorStyle,
  getResolvedVariant,
  getSurfaceTransition,
  getVariantClassName,
  isDefined,
  toLength,
} from '@modulify/m3-foundation/lib/surface/style'
import {
  isId,
  isUndefined,
  Or,
} from '@modulify/m3-foundation/lib/predicates'

export const surfacePanelProps = {
  id: {
    type: null as unknown as PropType<string | undefined>,
    validator: Or(isId, isUndefined),
    default: undefined,
  },

  tag: {
    type: String,
    default: 'section',
  },

  elevation: {
    type: Number,
    default: 0,
    validator: (value: number) => Number.isInteger(value) && value >= 0 && value <= 5,
  },

  variant: {
    type: String as PropType<SurfaceVariant>,
    default: 'auto',
  },

  fillWidth: {
    type: Boolean,
    default: true,
  },

  fillHeight: {
    type: Boolean,
    default: true,
  },

  width: {
    type: null as unknown as PropType<SurfaceLength | null>,
    default: null,
  },

  height: {
    type: null as unknown as PropType<SurfaceLength | null>,
    default: null,
  },

  minWidth: {
    type: null as unknown as PropType<SurfaceLength | null>,
    default: null,
  },

  maxWidth: {
    type: null as unknown as PropType<SurfaceLength | null>,
    default: null,
  },

  minHeight: {
    type: null as unknown as PropType<SurfaceLength | null>,
    default: null,
  },

  maxHeight: {
    type: null as unknown as PropType<SurfaceLength | null>,
    default: null,
  },

  rounding: {
    type: null as unknown as PropType<SurfaceLength>,
    default: 0,
  },

  roundingTopLeft: {
    type: null as unknown as PropType<SurfaceLength | null>,
    default: null,
  },

  roundingTopRight: {
    type: null as unknown as PropType<SurfaceLength | null>,
    default: null,
  },

  roundingBottomRight: {
    type: null as unknown as PropType<SurfaceLength | null>,
    default: null,
  },

  roundingBottomLeft: {
    type: null as unknown as PropType<SurfaceLength | null>,
    default: null,
  },

  transitionMs: {
    type: Number,
    default: 220,
  },

  transitionTiming: {
    type: String,
    default: DEFAULT_SURFACE_TRANSITION_TIMING,
  },

  overflow: {
    type: String,
    default: 'visible',
  },
} as const

export function getSurfacePanelClass(elevation: number, variant: SurfaceVariant) {
  return getSurfacePanelClassRecord(elevation, variant)
}

type SurfacePanelStyleInput = {
  fillWidth: boolean,
  fillHeight: boolean,
  width: SurfaceLength | null,
  height: SurfaceLength | null,
  minWidth: SurfaceLength | null,
  maxWidth: SurfaceLength | null,
  minHeight: SurfaceLength | null,
  maxHeight: SurfaceLength | null,
  rounding: SurfaceLength,
  roundingTopLeft: SurfaceLength | null,
  roundingTopRight: SurfaceLength | null,
  roundingBottomRight: SurfaceLength | null,
  roundingBottomLeft: SurfaceLength | null,
  transitionMs: number,
  transitionTiming: string,
  overflow: CSSProperties['overflow'],
  style?: CSSProperties,
}

export const getSurfacePanelStyle = (
  options: SurfacePanelStyleInput
): CSSProperties => getFoundationSurfacePanelStyle({
  ...options,
  style: options.style as object | undefined,
}) as CSSProperties
