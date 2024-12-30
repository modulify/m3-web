import type {
  CloserEvent,
  CloserTarget,
} from '../../types/components/popper'

export const onClick = (event: CloserEvent) => {
  const el = event.currentTarget as CloserTarget

  event.m3PopperClose = true
  event.m3PopperCloseAll = el.m3PopperCloseAll ?? false
}

export const onTouchEnd = ((event: CloserEvent<TouchEvent>) => {
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

export const onTouchCancel = ((event: CloserEvent<TouchEvent>) => {
  const el = event.currentTarget as CloserTarget
  delete el.m3PopperCloserTouch
}) as EventListener

export const onTouchStart = ((event: CloserEvent<TouchEvent>) => {
  if (event.changedTouches.length === 1) {
    const el = event.currentTarget as CloserTarget

    el.m3PopperCloserTouch = event.changedTouches[0]
    el.addEventListener('touchend', onTouchEnd)
    el.addEventListener('touchcancel', onTouchCancel)
  }
}) as EventListener

export const addCloserListeners = (el: CloserTarget) => {
  el.addEventListener('click', onClick)
  el.addEventListener('touchstart', onTouchStart, { passive: true })
}

export const removeCloserListeners = (el: CloserTarget) => {
  el.removeEventListener('click', onClick)
  el.removeEventListener('touchstart', onTouchStart)
  el.removeEventListener('touchend', onTouchEnd)
  el.removeEventListener('touchcancel', onTouchCancel)
}