import { isIOS } from '../platform'

export type GlobalEventType = 'click' | 'mousedown' | 'touchend'
export type GlobalEventHandler = (event: Event) => void

const listeners: Record<GlobalEventType, GlobalEventHandler[]> = {
  click: [],
  mousedown: [],
  touchend: [],
}

const on = (eventType: GlobalEventType, handler: GlobalEventHandler) => {
  if (!listeners[eventType].includes(handler)) {
    listeners[eventType].push(handler)
  }
}

const off = (eventType: GlobalEventType, handler: GlobalEventHandler) => {
  const index = listeners[eventType].indexOf(handler)
  if (index !== -1) {
    listeners[eventType].splice(index, 1)
  }
}

const makeListener = (type: GlobalEventType) => (event: Event) => listeners[type].forEach(fn => fn(event))

if (typeof document !== 'undefined' && typeof window !== 'undefined') {
  if (isIOS()) {
    document.addEventListener('touchstart', makeListener('mousedown'), { passive: true, capture: true })
    document.addEventListener('touchend', makeListener('touchend'), { passive: true, capture: true })
  } else {
    window.addEventListener('mousedown', makeListener('mousedown'), true)
    window.addEventListener('click', makeListener('click'), true)
  }
}

export {
  on,
  off,
}
