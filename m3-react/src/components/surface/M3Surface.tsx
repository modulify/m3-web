import type {
  CSSProperties,
  FC,
} from 'react'

import type {
  Anchor as SurfaceAnchor,
  Length as SurfaceLength,
  Mode as SurfaceMode,
} from '@modulify/m3-foundation/types/components/surface'

import type {
  M3SurfacePanelProps,
  M3SurfacePanelVariant,
} from './shared'

import { createPortal } from 'react-dom'
import { useTransition } from 'react-transition-state'

import { useId } from '@/hooks'

import M3SurfacePanel from './M3SurfacePanel'

import { toClassName } from '@/utils/styling'
import {
  getModalAnchorStyle,
  toLength,
} from './shared'

export type M3SurfaceMode = SurfaceMode
export type M3SurfaceVariant = M3SurfacePanelVariant
export type M3SurfaceAnchor = SurfaceAnchor

export interface M3SurfaceProps extends M3SurfacePanelProps {
  shown?: boolean;
  mode?: M3SurfaceMode;
  teleportTo?: string;
  scrim?: boolean;
  scrimShown?: boolean;
  anchor?: M3SurfaceAnchor;
  insetTop?: SurfaceLength;
  insetRight?: SurfaceLength;
  insetBottom?: SurfaceLength;
  insetLeft?: SurfaceLength;
  zIndex?: number;
  onToggle?: (shown: boolean) => void;
  onDismiss?: () => void;
}

const M3Surface: FC<M3SurfaceProps> = ({
  id,
  shown = true,
  mode = 'standard',
  teleportTo = 'body',
  scrim = true,
  scrimShown,
  anchor = 'none',
  insetTop = 0,
  insetRight = 0,
  insetBottom = 0,
  insetLeft = 0,
  transitionMs = 220,
  zIndex = 400,
  onToggle = (_: boolean) => {},
  onDismiss = () => {},
  role,
  'aria-modal': ariaModal,
  className = '',
  style,
  children,
  ...panelProps
}) => {
  const isModal = mode === 'modal'
  const resolvedScrimShown = scrimShown ?? shown
  const [modalTransition, toggleModalTransition] = useTransition({
    timeout: transitionMs,
    preEnter: true,
    preExit: true,
    mountOnEnter: true,
    unmountOnExit: true,
  })

  toggleModalTransition(isModal && scrim && resolvedScrimShown)

  const modalMounted = !isModal || shown || (scrim && modalTransition.isMounted)

  const anchorStyle: CSSProperties = isModal
    ? getModalAnchorStyle(anchor, {
      top: toLength(insetTop, '0px'),
      right: toLength(insetRight, '0px'),
      bottom: toLength(insetBottom, '0px'),
      left: toLength(insetLeft, '0px'),
    })
    : {}

  const surfaceNode = (
    <M3SurfacePanel
      id={useId(id, 'm3-surface')}
      {...panelProps}
      className={toClassName([className, {
        ['m3-surface_modal']: isModal,
        [`m3-surface_anchor-${anchor}`]: true,
      }])}
      style={{
        ...anchorStyle,
        position: isModal ? 'fixed' : 'relative',
        zIndex: isModal ? zIndex : undefined,
        display: shown ? undefined : 'none',
        ...style,
      }}
      role={role ?? (isModal ? 'dialog' : 'region')}
      aria-modal={isModal ? (ariaModal ?? 'true') : ariaModal}
    >
      {children}
    </M3SurfacePanel>
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

  if (!modalMounted) {
    return null
  }

  return createPortal(
    <>
      {scrim && modalTransition.isMounted ? (
        <div
          className={toClassName(['m3-surface__scrim', {
            'm3-transition-fade-enter': modalTransition.status === 'preEnter' || modalTransition.status === 'entering',
            'm3-transition-fade-enter-active': modalTransition.status === 'entering',
            'm3-transition-fade-leave-active': modalTransition.status === 'preExit' || modalTransition.status === 'exiting',
            'm3-transition-fade-leave-to': modalTransition.status === 'exiting',
          }])}
          style={{
            zIndex: zIndex - 1,
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
