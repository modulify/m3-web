import type {
  ForwardRefRenderFunction,
} from 'react'

import type {
  CloserEvent,
} from '@modulify/m3-foundation/types/components/popper'

import type {
  M3PopperMethods,
  M3PopperProps,
} from './types'

import Scheduler from '@modulify/m3-foundation/lib/Scheduler'

import { createPortal } from 'react-dom'

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react'

import {
  useAutoAdjust,
  useDelay,
  useListening,
} from './hooks'

import {
  useRecord,
  useWatch,
} from '@/hooks'

import { computePosition } from '@modulify/m3-foundation/lib/popper/floating'
import { toClassName } from '@/utils/styling'

import * as globalEvents from '@modulify/m3-foundation/lib/popper/globalEvents'

type HideReason = 'generic' | 'by-closer' | 'by-miss-click'

const M3Popper: ForwardRefRenderFunction<M3PopperMethods, M3PopperProps> = ({
  target,
  targetTriggers = ['click'],
  popperTriggers = [],
  shown = false,
  hideOnMissClick = false,
  className = '',
  children = [],
  placement = 'bottom',
  strategy = 'absolute',
  boundary= 'clippingAncestors',
  container,
  offsetMainAxis = 0,
  offsetCrossAxis = 0,
  overflow = [],
  delay = 0,
  disabled = false,
  detachTimeout = 5000,
  onShow = () => {},
  onHide = (_: HideReason) => {},
  onToggle = (_: boolean) => {},
  onDispose = () => {},
  ...attrs
}, ref) => {
  const [
    showDelay,
    hideDelay,
  ] = useDelay(delay)

  const state = useRecord({
    attached: false,
    showDelay,
    showing: false,
    shown,
    hideDelay,
    hideOnMissClick,
    hiding: false,
    clicked: false,
    touched: false,
    disposed: false,
    detachTimeout,
  }, ['attached', 'shown'])

  useWatch(showDelay, showDelay => state.showDelay = showDelay)
  useWatch(hideDelay, hideDelay => state.hideDelay = hideDelay)
  useWatch(hideOnMissClick, hideOnMissClick => state.hideOnMissClick = hideOnMissClick)
  useWatch(detachTimeout, detachTimeout => state.detachTimeout = detachTimeout)

  const handlers = useRecord({
    onShow,
    onHide,
    onToggle,
    onDispose,
  })

  useWatch(onShow, onShow => handlers.onShow = onShow)
  useWatch(onHide, onHide => handlers.onHide = onHide)
  useWatch(onToggle, onToggle => handlers.onToggle = onToggle)
  useWatch(onDispose, onDispose => handlers.onDispose = onDispose)

  const targetRef = useRef(target)
  const popperRef = useRef<HTMLDivElement | null>(null)

  const positioning = useMemo(() => ({
    placement,
    strategy,
    boundary,
    overflow,
    offsetMainAxis: Number(offsetMainAxis),
    offsetCrossAxis: Number(offsetCrossAxis),
  }), [
    placement,
    strategy,
    boundary,
    overflow,
    offsetMainAxis,
    offsetCrossAxis,
  ])

  const adjustDo = useCallback(async () => {
    if (targetRef.current && popperRef.current && !state.disposed) {
      await computePosition(popperRef.current, targetRef.current, {
        ...positioning,
        onReferenceHidden: hide,
      })
    }
  }, [positioning])

  const [
    adjustOn,
    adjustOff,
  ] = useAutoAdjust(targetRef, popperRef, adjustDo)

  const adjust = useRecord({
    do: adjustDo,
    on: adjustOn,
    off: adjustOff,
  })

  useWatch(adjustDo, adjustDo => adjust.do = adjustDo)
  useWatch(adjustOn, adjustOn => adjust.on = adjustOn)
  useWatch(adjustOff, adjustOff => adjust.off = adjustOff)

  const scheduler = useMemo(() => ({
    showing: new Scheduler(),
    detach: new Scheduler(),
  }), [])

  const doShow = useCallback(async () => {
    scheduler.detach.abort()
    scheduler.showing.abort()

    if (!state.shown) {
      await new Promise(resolve => requestAnimationFrame(resolve))

      if (!state.hiding) {
        await adjust.do()
        adjust.on()

        state.shown = true
        handlers.onToggle(true)
      }
    }
  }, [])

  const doHide = useCallback(async () => {
    scheduler.showing.abort()

    if (!state.shown) {
      return
    }

    adjust.off()

    state.shown = false
    handlers.onToggle(false)

    scheduler.detach.abort()
    if (state.detachTimeout !== null) {
      scheduler.detach.schedule(() => state.attached = false, Number(state.detachTimeout))
    }
  }, [])

  const contains = useCallback((el: Element | null): boolean => popperRef.current?.contains(el) ?? false, [])

  const show = useCallback((immediately = false) => {
    if (state.disposed) {
      return
    }

    state.hiding = false
    state.attached = true

    scheduler.showing.schedule(doShow, immediately ? 0 : state.showDelay)

    handlers.onShow()
    state.showing = true
    requestAnimationFrame(() => setTimeout(() => state.showing = false))
  }, [])

  const hide = useCallback((immediately = false, reason: HideReason = 'generic'): void => {
    state.hiding = true

    scheduler.showing.schedule(doHide, immediately ? 0 : state.hideDelay)

    handlers.onHide(reason)
  }, [])

  const onGlobalTap = useCallback(async (event: CloserEvent, touch = false) => {
    const captures = state.clicked || contains(event.target as Element)
    await new Promise(resolve => requestAnimationFrame(resolve))

    if (!state.showing && state.shown && (
      state.hideOnMissClick && !captures ||
      event.m3PopperClose && captures ||
      event.m3PopperCloseAll
    )) {
      hide()

      if (touch) {
        state.touched = true
        setTimeout(() => state.touched = false, 300)
      }
    }
  }, [])

  useImperativeHandle(ref, () => ({
    adjust: () => adjust.do(),
    contains,
    show,
    hide,
  }))

  const listening = useListening([
    event => {
      if (!state.shown || state.hiding) {
        event.processedByM3Popper = true
        !state.touched && show()
      }
    },
    event => !event.processedByM3Popper && hide(),
  ])

  const initialize = useCallback((disposed = false): void => {
    if (!disposed) {
      state.disposed = false

      if (targetRef.current) {
        listening.target.start(targetRef.current, targetTriggers)
      }

      if (popperRef.current) {
        listening.popper.start(popperRef.current, popperTriggers)
      }
    } else {
      state.disposed = true
    }
  }, [])

  const dispose = useCallback(() => {
    if (state.disposed) {
      return
    }

    state.disposed = true

    listening.target.stop()
    listening.popper.stop()

    hide(true)

    state.attached = false

    handlers.onDispose()
  }, [])

  useWatch(shown, shown => shown ? show() : hide())

  useWatch(target, async target => {
    if (targetRef.current) {
      targetRef.current = target

      if (state.shown) {
        adjust.on()
        await adjust.do()
      }
    } else {
      targetRef.current = target

      initialize(disabled)

      if (shown && !disabled) {
        show()
      }
    }
  })

  useWatch(targetTriggers, t => listening.target.triggers = t)
  useWatch(popperTriggers, t => listening.popper.triggers = t)

  useWatch(positioning, () => adjust.do(), { deep: true })

  useWatch(state.attached, (isAttached, wasAttached) => {
    if (isAttached && !wasAttached) {
      setTimeout(async () => {
        if (state.shown) {
          adjust.off()
          await adjust.do()
          adjust.on()
        }
      }, 0)
    }
  })

  useWatch(disabled, disabled => {
    if (disabled) {
      dispose()
    } else if (state.disposed) {
      initialize()

      if (shown) {
        show()
      }
    }
  })

  useEffect(() => {
    const onGlobalClick = (event: CloserEvent) => onGlobalTap(event)
    const onGlobalTouch = (event: CloserEvent) => onGlobalTap(event, true)
    const onGlobalMousedown = (event: Event) => {
      state.clicked = contains(event.target as Element)
    }

    globalEvents.on('click', onGlobalClick)
    globalEvents.on('mousedown', onGlobalMousedown)
    globalEvents.on('touchend', onGlobalTouch)

    initialize(disabled)

    if (shown && !disabled) {
      show()
    }

    return () => {
      adjust.off()

      globalEvents.off('click', onGlobalClick)
      globalEvents.off('mousedown', onGlobalMousedown)
      globalEvents.off('touchend', onGlobalTouch)

      dispose()
    }
  }, [])

  return state.attached ? createPortal(
    <div
      ref={popperRef}
      className={toClassName([className, {
        'm3-popper': true,
        'm3-popper_shown': state.shown,
      }])}
      {...attrs}
    >
      {children}
    </div>,
    (typeof container === 'string' ? document.querySelector(container) : container) ?? document.body
  ) : null
}

export default forwardRef(M3Popper)
