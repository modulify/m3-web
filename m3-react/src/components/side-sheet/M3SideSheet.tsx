import type {
  FC,
  ReactNode,
} from 'react'
import type { M3SurfaceProps } from '@/components/surface'

import { M3IconButton } from '@/components/icon-button'
import { M3ScrollRail } from '@/components/scroll-rail'
import { M3Surface } from '@/components/surface'
import { m3MotionDurations } from '@modulify/m3-foundation/lib/motion'

import {
  useId,
} from '@/hooks'

import { useMemo } from 'react'
import { useTransition } from 'react-transition-state'

import {
  defineSlot,
  distinct,
} from '@/utils/content'
import { toClassName } from '@/utils/styling'

export interface M3SideSheetProps extends Omit<
  M3SurfaceProps,
  | 'anchor'
  | 'children'
  | 'mode'
  | 'onDismiss'
  | 'onToggle'
  | 'scrim'
  | 'shown'
  | 'tag'
> {
  id?: string;
  shown?: boolean;
  docked?: boolean;
  children?: ReactNode | ReactNode[];
  onToggle?: (shown: boolean) => void;
  onDismiss?: () => void;
}

const Affordance: FC<{ children: ReactNode }> = defineSlot('M3SideSheet.Affordance', props => <>{props.children}</>)
const Title: FC<{ children: ReactNode }> = defineSlot('M3SideSheet.Title', props => <>{props.children}</>)
const CloseIcon: FC<{ children: ReactNode }> = defineSlot('M3SideSheet.CloseIcon', props => <>{props.children}</>)
const Footer: FC<{ children: ReactNode }> = defineSlot('M3SideSheet.Footer', props => <>{props.children}</>)

const DOCKED_WIDTH = 256
const MODAL_MIN_WIDTH = 320
const MODAL_MAX_WIDTH = 400
const MODAL_RADIUS = 16
const SIDE_SHEET_Z_INDEX = 1000
const SIDE_SHEET_TRANSITION_MS = m3MotionDurations['extra-long2']

const M3SideSheet: FC<M3SideSheetProps> = ({
  id,
  shown = false,
  docked = false,
  className = '',
  style,
  fillWidth = false,
  fillHeight = true,
  width = null,
  minWidth = null,
  maxWidth = null,
  minHeight = null,
  maxHeight = null,
  rounding = 0,
  roundingTopLeft = null,
  roundingTopRight = 0,
  roundingBottomRight = 0,
  roundingBottomLeft = null,
  transitionMs = 220,
  transitionTiming,
  overflow = 'hidden',
  elevation = 0,
  variant = 'surface-container-low',
  role = 'dialog',
  zIndex = SIDE_SHEET_Z_INDEX,
  children = [],
  onToggle = (_: boolean) => {},
  onDismiss = () => {},
  ...attrs
}) => {
  const _id = useId(id, 'm3-side-sheet')

  const [slots, content] = useMemo(() => distinct(children, {
    affordance: Affordance,
    title: Title,
    closeIcon: CloseIcon,
    footer: Footer,
  }), [children])

  const aria = 'aria-label' in attrs || 'aria-labelledby' in attrs
    ? {}
    : { 'aria-labelledby': _id + '-title' }

  const surfaceWidth = width ?? (docked ? DOCKED_WIDTH : null)
  const surfaceMinWidth = minWidth ?? (docked ? DOCKED_WIDTH : MODAL_MIN_WIDTH)
  const surfaceMaxWidth = maxWidth ?? (docked ? DOCKED_WIDTH : MODAL_MAX_WIDTH)
  const surfaceTopLeft = roundingTopLeft ?? (docked ? 0 : MODAL_RADIUS)
  const surfaceBottomLeft = roundingBottomLeft ?? (docked ? 0 : MODAL_RADIUS)

  const [transition, toggle] = useTransition({
    timeout: SIDE_SHEET_TRANSITION_MS,
    preEnter: true,
    preExit: true,
    mountOnEnter: true,
    unmountOnExit: true,
  })

  toggle(shown)

  const surfaceScrimShown = !docked && shown && transition.status !== 'preEnter'
  const ariaModal = 'aria-modal' in attrs ? attrs['aria-modal'] : (docked ? 'false' : undefined)

  if (typeof document === 'undefined') {
    return null
  }

  const surfaceNode = (
    <M3Surface
      id={_id}
      tag="div"
      shown={true}
      mode="modal"
      scrim={true}
      scrimShown={surfaceScrimShown}
      anchor="end"
      fillWidth={fillWidth}
      fillHeight={fillHeight}
      width={surfaceWidth}
      minWidth={surfaceMinWidth}
      maxWidth={surfaceMaxWidth}
      minHeight={minHeight}
      maxHeight={maxHeight}
      rounding={rounding}
      roundingTopLeft={surfaceTopLeft}
      roundingTopRight={roundingTopRight}
      roundingBottomRight={roundingBottomRight}
      roundingBottomLeft={surfaceBottomLeft}
      transitionMs={transitionMs}
      transitionTiming={transitionTiming}
      overflow={overflow}
      elevation={elevation}
      variant={variant}
      role={role}
      aria-modal={ariaModal}
      zIndex={zIndex}
      className={toClassName([className, {
        'm3-side-sheet': true,
        'm3-side-sheet_docked': docked,
        'm3-transition-slide-right-enter': transition.status === 'preEnter' || transition.status === 'entering',
        'm3-transition-slide-right-enter-active': transition.status === 'entering',
        'm3-transition-slide-right-leave-active': transition.status === 'preExit' || transition.status === 'exiting',
        'm3-transition-slide-right-leave-to': transition.status === 'exiting',
      }])}
      style={style}
      onToggle={onToggle}
      onDismiss={onDismiss}
      {...{
        ...aria,
        ...attrs,
      }}
    >
      <header
        className={toClassName({
          'm3-side-sheet__header': true,
          'm3-side-sheet__header_has-leading-affordance': !!slots.affordance,
        })}
      >
        {slots.affordance ? (
          <div className="m3-side-sheet__affordance">
            {slots.affordance}
          </div>
        ) : null}

        <div
          id={_id + '-title'}
          className="m3-side-sheet__title"
        >
          {slots.title}
        </div>

        <div className="m3-side-sheet__affordance">
          <M3IconButton onClick={() => onToggle(false)}>
            {slots.closeIcon}
          </M3IconButton>
        </div>
      </header>

      <div className="m3-side-sheet__content">
        <M3ScrollRail />
        {content}
      </div>

      {slots.footer ? (
        <footer className="m3-side-sheet__footer">
          {slots.footer}
        </footer>
      ) : null}
    </M3Surface>
  )

  if (!transition.isMounted) {
    return null
  }

  return surfaceNode
}

export default Object.assign(M3SideSheet, {
  Affordance,
  Title,
  CloseIcon,
  Footer,
})
