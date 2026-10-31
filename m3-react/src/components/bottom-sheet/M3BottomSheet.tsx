import type { BottomSheetController } from '@modulify/m3-foundation/lib/bottomSheet'
import type {
  BottomSheetVariant,
} from '@modulify/m3-foundation/types/components/bottom-sheet'
import type { ComponentSetupContext } from '@/utils/component'
import type { ElementReference } from '@modulify/m3-foundation/types/dom'
import type { HTMLAttributes, ReactNode, Ref } from 'react'

import { useLayoutEffect, useRef, useState } from 'react'
import { useTransition } from 'react-transition-state'

import { attachBottomSheet } from '@modulify/m3-foundation/lib/bottomSheet'
import { durations, easing } from '@modulify/m3-foundation/lib/motion'

import { M3Surface } from '@/components/surface'

import defineComponent from '@/utils/component'
import { toClassName } from '@/utils/styling'
import { useId } from '@/hooks'

export interface M3BottomSheetProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onToggle'> {
  ref?: Ref<M3BottomSheetExposed>;
  variant?: BottomSheetVariant;
  shown?: boolean;
  expanded?: boolean;
  peek?: number;
  handle?: boolean;
  label?: string;
  children?: ReactNode;
  onToggle?: (shown: boolean) => void;
  onExpand?: (expanded: boolean) => void;
  onDismiss?: () => void;
}

export interface M3BottomSheetExposed extends ElementReference<HTMLElement> {
  show(): void;
  hide(): void;
  expand(): void;
  collapse(): void;
}

const TRANSITION_MS = durations.long2

export default defineComponent(function M3BottomSheet({
  ref: _ref,
  id,
  variant = 'standard',
  shown = false,
  expanded = false,
  peek,
  handle = true,
  label = 'Resize bottom sheet',
  className = '',
  style,
  children,
  onToggle = () => {},
  onExpand = () => {},
  onDismiss = () => {},
  ...attrs
}: M3BottomSheetProps, { expose }: ComponentSetupContext<M3BottomSheetExposed>) {
  const sheetId = useId(id, 'm3-bottom-sheet')
  const content = useRef<HTMLDivElement | null>(null)
  const handleElement = useRef<HTMLButtonElement | null>(null)
  const controller = useRef<BottomSheetController | null>(null)
  const callbacks = useRef({ onToggle, onExpand, onDismiss })
  const [expandedActual, setExpandedActual] = useState(expanded)
  const [transition, toggle, endTransition] = useTransition({
    timeout: TRANSITION_MS,
    preEnter: true,
    preExit: true,
    mountOnEnter: true,
    unmountOnExit: true,
  })

  callbacks.current = { onToggle, onExpand, onDismiss }
  toggle(shown)

  const dismiss = () => {
    callbacks.current.onToggle(false)
    callbacks.current.onDismiss()
  }
  const expand = (next: boolean) => {
    setExpandedActual(next)
    callbacks.current.onExpand(next)
  }
  const visible = shown && transition.status !== 'preEnter' && transition.status !== 'exiting'

  expose({
    get el () { return typeof document === 'undefined' ? null : document.getElementById(sheetId) },
    show: () => callbacks.current.onToggle(true),
    hide: () => callbacks.current.onToggle(false),
    expand: () => controller.current?.expand(),
    collapse: () => controller.current?.collapse(),
  })

  useLayoutEffect(() => () => endTransition(), [endTransition])

  useLayoutEffect(() => {
    const panel = document.getElementById(sheetId)
    if (!transition.isMounted || !panel || !content.current) return

    const active = attachBottomSheet({
      panel,
      content: content.current,
      handle: handleElement.current,
      variant,
      visible,
      expanded,
      peek,
      onExpand: next => expand(next),
      onDismiss: () => dismiss(),
    })
    controller.current = active

    return () => {
      active.dispose()
      if (controller.current === active) controller.current = null
    }
  }, [sheetId, transition.isMounted, handle])

  useLayoutEffect(() => {
    controller.current?.update({
      variant,
      visible,
      expanded,
      peek,
      onExpand: next => expand(next),
      onDismiss: () => dismiss(),
    })
  }, [variant, visible, expanded, peek])

  useLayoutEffect(() => setExpandedActual(expanded), [expanded])

  if (typeof document === 'undefined' || !transition.isMounted) return null

  return (
    <M3Surface
      id={sheetId}
      role="dialog"
      aria-modal={variant === 'modal' ? 'true' : 'false'}
      mode="modal"
      anchor="bottom"
      scrim={variant === 'modal'}
      scrimShown={variant === 'modal' && visible}
      variant="surface-container-low"
      fillHeight={false}
      height="var(--m3-bottom-sheet-height, 0px)"
      roundingTopLeft={28}
      roundingTopRight={28}
      roundingBottomLeft={0}
      roundingBottomRight={0}
      transitionMs={TRANSITION_MS}
      transitionTiming={easing.emphasized}
      overflow="hidden"
      tag="div"
      className={toClassName(['m3-bottom-sheet', className, {
        'm3-bottom-sheet_pre-enter': transition.status === 'preEnter',
        'm3-bottom-sheet_exiting': transition.status === 'exiting',
      }])}
      style={style}
      shown
      {...attrs}
      onToggle={next => { if (!next) callbacks.current.onToggle(false) }}
      onDismiss={() => callbacks.current.onDismiss()}
    >
      {handle && <button
        ref={handleElement}
        type="button"
        className="m3-bottom-sheet__handle"
        aria-label={label}
        aria-controls={`${sheetId}-content`}
        aria-expanded={expandedActual}
      />}

      <div id={`${sheetId}-content`} className="m3-bottom-sheet__body">
        <div ref={content} className="m3-bottom-sheet__content">{children}</div>
      </div>
    </M3Surface>
  )
})
