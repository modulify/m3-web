import type { ComponentSetupContext } from '@/utils/component'
import type {
  CSSProperties,
  FC,
  HTMLAttributes,
  Ref,
} from 'react'

import { durations, easing } from '@modulify/m3-foundation/lib/motion'
import { useEffect, useMemo, useState } from 'react'

import { M3Surface } from '@/components/surface'

import { useAnimationFrame, useTimeout } from '@/hooks'

import defineComponent from '@/utils/component'
import { defineSlot, distinct } from '@/utils/content'
import { toClassName } from '@/utils/styling'

export interface M3DialogProps extends Omit<HTMLAttributes<HTMLElement>, 'onToggle'> {
  ref?: Ref<M3DialogExposed>;
  opened?: boolean;
  fullscreen?: boolean;
  onToggle?: (expanded: boolean) => void;
}

export interface M3DialogExposed extends M3DialogMethods {}

export interface M3DialogMethods {
  open (): void;
  close (): void;
}

const DIALOG_WIDTH = 312
const DIALOG_MIN_WIDTH = 280
const DIALOG_MAX_WIDTH = 560
const DIALOG_ROUNDING = 28
const DIALOG_ENTRY_OFFSET_PX = 24
const DIALOG_ELEVATION = 0
const DIALOG_Z_INDEX = 1000
const DIALOG_TRANSITION_MS = durations.medium2
const DIALOG_TRANSITION_TIMING = easing.standard

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

export default defineComponent(function M3Dialog({
  ref: _ref,
  opened = false,
  fullscreen = false,
  className = '',
  style,
  children = [],
  onToggle = (_: boolean) => {},
  ...attrs
}: M3DialogProps, { expose }: ComponentSetupContext<M3DialogExposed>) {
  expose({
    open: () => onToggle(true),
    close: () => onToggle(false),
  })

  const [slots, content] = useMemo(() => distinct(children, {
    icon: Icon,
    header: Header,
    footer: Footer,
  }), [children])
  const [dialogMounted, setDialogMounted] = useState(opened)
  const [dialogVisible, setDialogVisible] = useState(false)
  const enterFrame = useAnimationFrame()
  const leaveTimeout = useTimeout(() => setDialogMounted(false), DIALOG_TRANSITION_MS)

  useEffect(() => {
    if (typeof window === 'undefined') {
      setDialogMounted(opened)
      setDialogVisible(opened)
      return
    }

    enterFrame.cancel()
    leaveTimeout.cancel()

    if (opened) {
      setDialogMounted(true)
      setDialogVisible(false)

      enterFrame.request(() => {
        setDialogVisible(true)
      })

      return enterFrame.cancel
    }

    setDialogVisible(false)

    if (dialogMounted) {
      leaveTimeout.schedule()
    }

    return () => {
      enterFrame.cancel()
      leaveTimeout.cancel()
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
      shown={dialogMounted}
      scrimShown={opened}
      scrim={!fullscreen}
      transitionMs={DIALOG_TRANSITION_MS}
      transitionTiming={DIALOG_TRANSITION_TIMING}
      anchor={fullscreen ? 'none' : 'center'}
      fillWidth={fullscreen}
      fillHeight={fullscreen}
      width={fullscreen ? '100vw' : DIALOG_WIDTH}
      height={fullscreen ? '100vh' : null}
      minWidth={fullscreen ? 0 : DIALOG_MIN_WIDTH}
      maxWidth={fullscreen ? '100vw' : DIALOG_MAX_WIDTH}
      maxHeight={fullscreen ? '100vh' : null}
      rounding={fullscreen ? 0 : DIALOG_ROUNDING}
      zIndex={DIALOG_Z_INDEX}
      elevation={DIALOG_ELEVATION}
      style={dialogStyle}
      className={toClassName(['m3-dialog', className])}
      tag="section"
      mode="modal"
      teleportTo="body"
      variant="surface-container-high"
      {...attrs}
      onDismiss={() => onToggle(false)}
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
}, {
  slots: { Icon, Header, Footer },
})
