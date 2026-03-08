import type {
  Anchor as SurfaceAnchor,
  Length as SurfaceLength,
  Variant as SurfaceVariant,
} from '../../types/components/surface'

import { m3MotionEasings } from '../motion'

export type SurfaceStyleValue = string | number | undefined
export type SurfaceStyleObject = Record<string, SurfaceStyleValue>

export type SurfaceInset = {
  top: string;
  right: string;
  bottom: string;
  left: string;
}

type AnchorStyleFactory = (inset: SurfaceInset) => SurfaceStyleObject

export type SurfacePanelStyleOptions = {
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
  overflow?: string;
  style?: object;
}

export const DEFAULT_SURFACE_TRANSITION_TIMING = m3MotionEasings.standard

const MODAL_ANCHOR_STYLE: Record<SurfaceAnchor, AnchorStyleFactory> = {
  none: ({ top, right, bottom, left }) => ({ top, right, bottom, left }),
  center: () => ({
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-50%, -50%)',
  }),
  start: ({ top, bottom, left }) => ({ top, bottom, left, right: 'auto' }),
  end: ({ top, right, bottom }) => ({ top, right, bottom, left: 'auto' }),
  top: ({ top, left, right }) => ({ top, left, right, bottom: 'auto' }),
  bottom: ({ bottom, left, right }) => ({ bottom, left, right, top: 'auto' }),
  'top-start': ({ top, left }) => ({ top, left, right: 'auto', bottom: 'auto' }),
  'top-end': ({ top, right }) => ({ top, right, left: 'auto', bottom: 'auto' }),
  'bottom-start': ({ bottom, left }) => ({ bottom, left, right: 'auto', top: 'auto' }),
  'bottom-end': ({ bottom, right }) => ({ bottom, right, left: 'auto', top: 'auto' }),
}

export const toLength = (value: SurfaceLength | null | undefined, fallback: string): string => {
  if (value == null) {
    return fallback
  }

  return typeof value === 'number'
    ? `${value}px`
    : value
}

export const isDefined = <T,>(value: T | null | undefined): value is T => value !== null && value !== undefined

export const getResolvedVariant = (
  variant: SurfaceVariant,
  elevation: number
): Exclude<SurfaceVariant, 'auto'> => {
  if (variant !== 'auto') {
    return variant
  }

  switch (elevation) {
    case 0: return 'surface'
    case 1: return 'surface-container-low'
    case 2: return 'surface-container'
    case 3: return 'surface-container-high'
    case 4: return 'surface-container-highest'
    default: return 'surface-bright'
  }
}

export const getVariantClassName = (
  variant: Exclude<SurfaceVariant, 'auto'>
): string | null => {
  if (variant === 'surface') {
    return null
  }

  return `m3-surface_${variant.replace(/^surface-/, '')}`
}

export const getSurfaceTransition = (
  transitionMs: number,
  transitionTiming: string
): string => {
  const duration = `${transitionMs}ms`

  return [
    `width ${duration} ${transitionTiming}`,
    `height ${duration} ${transitionTiming}`,
    `min-width ${duration} ${transitionTiming}`,
    `max-width ${duration} ${transitionTiming}`,
    `min-height ${duration} ${transitionTiming}`,
    `max-height ${duration} ${transitionTiming}`,
    `top ${duration} ${transitionTiming}`,
    `right ${duration} ${transitionTiming}`,
    `bottom ${duration} ${transitionTiming}`,
    `left ${duration} ${transitionTiming}`,
    `transform ${duration} ${transitionTiming}`,
    `opacity ${duration} ${transitionTiming}`,
    `background-color ${duration} ${transitionTiming}`,
    `box-shadow ${duration} ${transitionTiming}`,
  ].join(', ')
}

export const getSurfacePanelClassRecord = (
  elevation: number,
  variant: SurfaceVariant
): Record<string, boolean> => {
  const resolvedVariant = getResolvedVariant(variant, elevation)
  const variantClassName = getVariantClassName(resolvedVariant)

  return {
    'm3-surface': true,
    [variantClassName || '']: Boolean(variantClassName),
    [`m3-surface_elevation-${elevation}`]: true,
  }
}

const getSurfaceSizeStyle = ({
  fillWidth = true,
  fillHeight = true,
  width = null,
  height = null,
  minWidth = null,
  maxWidth = null,
  minHeight = null,
  maxHeight = null,
}: SurfacePanelStyleOptions): SurfaceStyleObject => ({
  width: isDefined(width)
    ? toLength(width, 'auto')
    : (fillWidth ? '100%' : 'auto'),
  height: isDefined(height)
    ? toLength(height, 'auto')
    : (fillHeight ? '100%' : 'auto'),
  minWidth: isDefined(minWidth) ? toLength(minWidth, '0px') : undefined,
  maxWidth: isDefined(maxWidth) ? toLength(maxWidth, 'none') : undefined,
  minHeight: isDefined(minHeight) ? toLength(minHeight, '0px') : undefined,
  maxHeight: isDefined(maxHeight) ? toLength(maxHeight, 'none') : undefined,
})

const getSurfaceCornerStyle = ({
  rounding = 0,
  roundingTopLeft = null,
  roundingTopRight = null,
  roundingBottomRight = null,
  roundingBottomLeft = null,
}: SurfacePanelStyleOptions): SurfaceStyleObject => {
  const baseRounding = toLength(rounding, '0px')

  return {
    borderTopLeftRadius: isDefined(roundingTopLeft) ? toLength(roundingTopLeft, baseRounding) : baseRounding,
    borderTopRightRadius: isDefined(roundingTopRight) ? toLength(roundingTopRight, baseRounding) : baseRounding,
    borderBottomRightRadius: isDefined(roundingBottomRight) ? toLength(roundingBottomRight, baseRounding) : baseRounding,
    borderBottomLeftRadius: isDefined(roundingBottomLeft) ? toLength(roundingBottomLeft, baseRounding) : baseRounding,
  }
}

export const getSurfacePanelStyle = ({
  transitionMs = 220,
  transitionTiming = DEFAULT_SURFACE_TRANSITION_TIMING,
  overflow = 'visible',
  style,
  ...options
}: SurfacePanelStyleOptions): SurfaceStyleObject => {
  const duration = `${transitionMs}ms`

  return {
    ...getSurfaceSizeStyle(options),
    ...getSurfaceCornerStyle(options),
    '--m3-surface-radius-transition-duration': duration,
    overflow,
    transition: getSurfaceTransition(transitionMs, transitionTiming),
    ...(style as SurfaceStyleObject | undefined),
  }
}

export const getModalAnchorStyle = (
  anchor: SurfaceAnchor,
  inset: SurfaceInset
): SurfaceStyleObject => MODAL_ANCHOR_STYLE[anchor](inset)
