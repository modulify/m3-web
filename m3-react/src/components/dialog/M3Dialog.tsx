import type {
  CSSProperties,
  FC,
  HTMLAttributes,
} from 'react'

import { useEffect, useMemo, useRef, useState } from 'react'

import {
  m3MotionDurations,
  m3MotionEasings,
} from '@modulify/m3-foundation/lib/motion'
import { M3Surface } from '@/components/surface'
import {
  defineSlot,
  distinct,
} from '@/utils/content'
import { toClassName } from '@/utils/styling'

export interface M3DialogProps extends HTMLAttributes<HTMLElement> {
  opened?: boolean;
  fullscreen?: boolean;
  onToggle?: (expanded: boolean) => void;
}

const DIALOG_WIDTH = 312
const DIALOG_MIN_WIDTH = 280
const DIALOG_MAX_WIDTH = 560
const DIALOG_ROUNDING = 28
const DIALOG_ENTRY_OFFSET_PX = 24
const DIALOG_ELEVATION = 0
const DIALOG_Z_INDEX = 1000
const DIALOG_TRANSITION_MS = m3MotionDurations.medium2
const DIALOG_TRANSITION_TIMING = m3MotionEasings.standard

const Icon: FC<HTMLAttributes<HTMLElement>> = defineSlot('M3Dialog.Icon', ({
  className = '',
  children = [],
  ...attrs
}) => (
  <div className={toClassName(['m3-dialog__icon', className])} {...attrs}>
    {children}
  </div>
))

const Header: FC<HTMLAttributes<HTMLElement>> = defineSlot('M3Dialog.Header', ({
  className = '',
  children = [],
  ...attrs
}) => (
  <header className={toClassName(['m3-dialog__header', className])} {...attrs}>
    {children}
  </header>
))

const Footer: FC<HTMLAttributes<HTMLElement>> = defineSlot('M3Dialog.Footer', ({
  className = '',
  children = [],
  ...attrs
}) => (
  <footer className={toClassName(['m3-dialog__footer', className])} {...attrs}>
    {children}
  </footer>
))

const M3Dialog: FC<M3DialogProps> = ({
  opened = false,
  fullscreen = false,
  className = '',
  style,
  children = [],
  onToggle = (_: boolean) => {},
  ...attrs
}) => {
  const [slots, content] = useMemo(() => distinct(children, {
    icon: Icon,
    header: Header,
    footer: Footer,
  }), [children])
  const [dialogMounted, setDialogMounted] = useState(opened)
  const [dialogVisible, setDialogVisible] = useState(false)
  const frameRef = useRef<number | null>(null)
  const timeoutRef = useRef<number | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') {
      setDialogMounted(opened)
      setDialogVisible(opened)
      return
    }

    if (frameRef.current !== null) {
      window.cancelAnimationFrame(frameRef.current)
      frameRef.current = null
    }

    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    if (opened) {
      setDialogMounted(true)
      setDialogVisible(false)

      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = null
        setDialogVisible(true)
      })

      return () => {
        if (frameRef.current !== null) {
          window.cancelAnimationFrame(frameRef.current)
          frameRef.current = null
        }
      }
    }

    setDialogVisible(false)

    if (dialogMounted) {
      timeoutRef.current = window.setTimeout(() => {
        timeoutRef.current = null
        setDialogMounted(false)
      }, DIALOG_TRANSITION_MS)
    }

    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current)
        frameRef.current = null
      }

      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [opened])

  const dialogStyle: CSSProperties = {
    opacity: dialogVisible ? 1 : 0,
    transform: fullscreen
      ? 'translate3d(0, 0, 0)'
      : (dialogVisible
        ? 'translate(-50%, -50%)'
        : `translate(-50%, calc(-50% + ${DIALOG_ENTRY_OFFSET_PX}px))`),
    transition: `opacity ${DIALOG_TRANSITION_MS}ms ${DIALOG_TRANSITION_TIMING}, transform ${DIALOG_TRANSITION_MS}ms ${DIALOG_TRANSITION_TIMING}`,
    pointerEvents: dialogVisible ? 'auto' : 'none',
    ...style,
  }

  return (
    <M3Surface
      tag="section"
      mode="modal"
      shown={dialogMounted}
      scrimShown={opened}
      teleportTo="body"
      scrim={!fullscreen}
      anchor={fullscreen ? 'none' : 'center'}
      fillWidth={fullscreen}
      fillHeight={fullscreen}
      width={fullscreen ? '100vw' : DIALOG_WIDTH}
      height={fullscreen ? '100vh' : null}
      minWidth={fullscreen ? 0 : DIALOG_MIN_WIDTH}
      maxWidth={fullscreen ? '100vw' : DIALOG_MAX_WIDTH}
      maxHeight={fullscreen ? '100vh' : null}
      rounding={fullscreen ? 0 : DIALOG_ROUNDING}
      variant="surface-container-high"
      elevation={DIALOG_ELEVATION}
      zIndex={DIALOG_Z_INDEX}
      transitionMs={DIALOG_TRANSITION_MS}
      transitionTiming={DIALOG_TRANSITION_TIMING}
      className={toClassName(['m3-dialog', className])}
      style={dialogStyle}
      onDismiss={() => onToggle(false)}
      {...attrs}
    >
      {slots.icon}
      {slots.header}
      {content.length ? (
        <div className="m3-dialog__content">
          {content}
        </div>
      ) : null}
      {slots.footer}
    </M3Surface>
  )
}

export default Object.assign(M3Dialog, {
  Icon,
  Header,
  Footer,
})
