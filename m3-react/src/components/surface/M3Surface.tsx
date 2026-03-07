import type {
  CSSProperties,
  FC,
  HTMLAttributes,
} from 'react'
import type {
  Anchor as SurfaceAnchor,
  Length as SurfaceLength,
  Mode as SurfaceMode,
  Variant as SurfaceVariant,
} from '@modulify/m3-foundation/types/components/surface'

import { createPortal } from 'react-dom'
import { m3MotionEasings } from '@modulify/m3-foundation/lib/motion'

import {
  useId,
} from '@/hooks'

import { toClassName } from '@/utils/styling'

type Inset = {
  top: string;
  right: string;
  bottom: string;
  left: string;
}

export type M3SurfaceMode = SurfaceMode
export type M3SurfaceVariant = SurfaceVariant
export type M3SurfaceAnchor = SurfaceAnchor

export interface M3SurfaceProps extends HTMLAttributes<HTMLElement> {
  id?: string;
  tag?: keyof HTMLElementTagNameMap;
  shown?: boolean;
  mode?: M3SurfaceMode;
  teleportTo?: string;
  scrim?: boolean;
  elevation?: number;
  variant?: M3SurfaceVariant;
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
  anchor?: M3SurfaceAnchor;
  insetTop?: SurfaceLength;
  insetRight?: SurfaceLength;
  insetBottom?: SurfaceLength;
  insetLeft?: SurfaceLength;
  zIndex?: number;
  transitionMs?: number;
  transitionTiming?: string;
  overflow?: CSSProperties['overflow'];
  onToggle?: (shown: boolean) => void;
  onDismiss?: () => void;
}

type AnchorStyleFactory = (inset: Inset) => CSSProperties

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

const toLength = (value: SurfaceLength | null | undefined, fallback: string): string => {
  if (value == null) {
    return fallback
  }

  return typeof value === 'number'
    ? `${value}px`
    : value
}

const isDefined = <T,>(value: T | null | undefined): value is T => value !== null && value !== undefined

const getResolvedVariant = (variant: SurfaceVariant, elevation: number): Exclude<SurfaceVariant, 'auto'> => {
  if (variant !== 'auto') return variant

  switch (elevation) {
    case 0: return 'surface'
    case 1: return 'surface-container-low'
    case 2: return 'surface-container'
    case 3: return 'surface-container-high'
    case 4: return 'surface-container-highest'
    default: return 'surface-bright'
  }
}

const M3Surface: FC<M3SurfaceProps> = ({
  id,
  tag = 'section',
  shown = true,
  mode = 'standard',
  teleportTo = 'body',
  scrim = true,
  elevation = 0,
  variant = 'auto',
  fillWidth = true,
  fillHeight = true,
  width = null,
  height = null,
  minWidth = null,
  maxWidth = null,
  minHeight = null,
  maxHeight = null,
  rounding = 0,
  roundingTopLeft = null,
  roundingTopRight = null,
  roundingBottomRight = null,
  roundingBottomLeft = null,
  anchor = 'none',
  insetTop = 0,
  insetRight = 0,
  insetBottom = 0,
  insetLeft = 0,
  zIndex = 400,
  transitionMs = 220,
  transitionTiming = m3MotionEasings.standard,
  overflow = 'visible',
  onToggle = (_: boolean) => {},
  onDismiss = () => {},
  className = '',
  style,
  children = [],
  ...attrs
}) => {
  const _id = useId(id, 'm3-surface')
  const isModal = mode === 'modal'
  const resolvedVariant = getResolvedVariant(variant, elevation)
  const SurfaceTag = tag

  const resolvedSizeStyle: CSSProperties = {
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
  }

  const baseRounding = toLength(rounding, '0px')

  const cornerStyle: CSSProperties = {
    borderTopLeftRadius: isDefined(roundingTopLeft) ? toLength(roundingTopLeft, baseRounding) : baseRounding,
    borderTopRightRadius: isDefined(roundingTopRight) ? toLength(roundingTopRight, baseRounding) : baseRounding,
    borderBottomRightRadius: isDefined(roundingBottomRight) ? toLength(roundingBottomRight, baseRounding) : baseRounding,
    borderBottomLeftRadius: isDefined(roundingBottomLeft) ? toLength(roundingBottomLeft, baseRounding) : baseRounding,
  }

  const anchorStyle: CSSProperties = isModal
    ? MODAL_ANCHOR_STYLE[anchor]({
      top: toLength(insetTop, '0px'),
      right: toLength(insetRight, '0px'),
      bottom: toLength(insetBottom, '0px'),
      left: toLength(insetLeft, '0px'),
    })
    : {}

  const duration = `${transitionMs}ms`
  const transition = [
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

  const surfaceClassName = toClassName([className, {
    'm3-surface': true,
    'm3-surface_modal': isModal,
    [`m3-surface_role-${resolvedVariant}`]: true,
    [`m3-surface_anchor-${anchor}`]: true,
    [`m3-surface_elevation-${elevation}`]: true,
  }])

  const radiusTransitionStyle = {
    '--m3-surface-radius-transition-duration': duration,
  } as CSSProperties

  const surfaceNode = (
    <SurfaceTag
      id={_id}
      className={surfaceClassName}
      style={{
        ...resolvedSizeStyle,
        ...cornerStyle,
        ...anchorStyle,
        ...radiusTransitionStyle,
        overflow,
        transition,
        position: isModal ? 'fixed' : 'relative',
        zIndex: isModal ? zIndex : undefined,
        display: shown ? undefined : 'none',
        ...style,
      }}
      {...(isModal
        ? { role: 'dialog', 'aria-modal': 'true' as const }
        : { role: 'region' })}
      {...attrs}
    >
      {children}
    </SurfaceTag>
  )

  if (!isModal) {
    return surfaceNode
  }

  const portalTarget = typeof document === 'undefined'
    ? null
    : (teleportTo === 'body' ? document.body : (document.querySelector(teleportTo) || document.body))

  if (!portalTarget) {
    return null
  }

  return createPortal(
    <>
      {scrim ? (
        <div
          className="m3-surface__scrim"
          style={{
            zIndex: zIndex - 1,
            display: shown ? undefined : 'none',
          }}
          onClick={() => {
            onToggle(false)
            onDismiss()
          }}
        />
      ) : null}
      {surfaceNode}
    </>,
    portalTarget
  )
}

export default M3Surface
