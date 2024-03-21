import type { Directive } from 'vue'
import type { CloserEvent } from '~types/components/popper'

type CloserTarget<E extends Element = Element> = E & {
  m3PopperCloseAll?: boolean;
  m3PopperCloserTouch?: Touch;
}

const onClick = (event: CloserEvent) => {
  const el = event.currentTarget as CloserTarget

  event.m3PopperClose = true
  event.m3PopperCloseAll = el.m3PopperCloseAll ?? false
}

const onTouchEnd = ((event: CloserEvent<TouchEvent>) => {
  const el = event.currentTarget as CloserTarget
  const first = el.m3PopperCloserTouch

  delete el.m3PopperCloserTouch

  if (event.changedTouches.length === 1) {
    const touch = event.changedTouches[0]

    event.m3PopperClose = (
      Math.abs(touch.screenY - (first as Touch).screenY) < 20 &&
      Math.abs(touch.screenX - (first as Touch).screenX) < 20
    )
    event.m3PopperCloseAll = el.m3PopperCloseAll ?? false
  }
}) as EventListener

const onTouchCancel = ((event: CloserEvent<TouchEvent>) => {
  const el = event.currentTarget as CloserTarget
  delete el.m3PopperCloserTouch
}) as EventListener

const onTouchStart = ((event: CloserEvent<TouchEvent>) => {
  if (event.changedTouches.length === 1) {
    const el = event.currentTarget as CloserTarget

    el.m3PopperCloserTouch = event.changedTouches[0]
    el.addEventListener('touchend', onTouchEnd)
    el.addEventListener('touchcancel', onTouchCancel)
  }
}) as EventListener

const addCloserListeners = (el: CloserTarget) => {
  el.addEventListener('click', onClick)
  el.addEventListener('touchstart', onTouchStart, { passive: true })
}

const removeCloserListeners = (el: CloserTarget) => {
  el.removeEventListener('click', onClick)
  el.removeEventListener('touchstart', onTouchStart)
  el.removeEventListener('touchend', onTouchEnd)
  el.removeEventListener('touchcancel', onTouchCancel)
}

export default {
  beforeMount (el, { value, modifiers }) {
    el.m3PopperCloseAll = 'all' in modifiers
    if (typeof value === 'undefined' || value) {
      addCloserListeners(el)
    }
  },

  updated (el, { value, oldValue, modifiers }) {
    el.m3PopperCloseAll = 'all' in modifiers
    if (value !== oldValue) {
      if (typeof value === 'undefined' || value) {
        addCloserListeners(el)
      } else {
        removeCloserListeners(el)
      }
    }
  },

  beforeUnmount (el) {
    removeCloserListeners(el)
  },
} as Directive<CloserTarget, boolean | undefined>
