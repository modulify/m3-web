import type {
  Trigger,
  TriggerHandler,
  TriggerSchema,
} from '../../types/components/popper'

import isEqual from 'lodash.isequal'

const isArray = Array.isArray
const normalize = (triggers: Trigger[] | TriggerSchema): Required<TriggerSchema> => {
  const show = isArray(triggers) ? triggers : triggers.show ?? []
  const hide = isArray(triggers) ? triggers : triggers.hide ?? []

  return {
    show: [...show],
    hide: [...hide],
  }
}

export default class Listener {
  private _target: EventTarget | null = null
  private _triggers: Required<TriggerSchema> = {
    show: [],
    hide: [],
  }

  private _listeners: Array<{
    type: string;
    handler: TriggerHandler;
  }> = []

  private readonly _onShow: TriggerHandler
  private readonly _onHide: TriggerHandler

  constructor (onShow: TriggerHandler, onHide: TriggerHandler) {
    this._onShow = onShow
    this._onHide = onHide
  }

  get target (): EventTarget | null {
    return this._target
  }

  set target (target: EventTarget | null) {
    if (target !== this._target) {
      this._unsubscribe()
      this._target = target
      if (target) {
        this._listeners.forEach(({ type, handler }) => {
          target.addEventListener(type, handler)
        })
      }
    }
  }

  get triggers (): Required<TriggerSchema> {
    return this._triggers
  }

  set triggers (triggers: Trigger[] | TriggerSchema) {
    if (!isEqual(triggers, this._triggers)) {
      this.stop()
      this._triggers = normalize(triggers)
      if (this._target) {
        this._subscribe()
      }
    }
  }

  start (target: EventTarget, triggers: Trigger[] | TriggerSchema) {
    this._target = target
    this._triggers = normalize(triggers)
    this._subscribe()
  }

  stop (): void {
    this._unsubscribe()
    this._listeners = []
  }

  _add (type: string, handler: TriggerHandler) {
    if (this._target) {
      this._listeners.push({ type, handler })
      this._target.addEventListener(type, handler, { passive: true })
    }
  }

  _subscribe () {
    this._triggers.show.forEach(t => this._add({
      hover: 'mouseenter',
      focus: 'focus',
      click: 'click',
      touch: 'touchstart',
    }[t], this._onShow))

    this._triggers.hide.forEach(t => this._add({
      hover: 'mouseleave',
      focus: 'blur',
      click: 'click',
      touch: 'touchend',
    }[t], this._onHide))
  }

  _unsubscribe () {
    const target = this._target
    if (target) {
      this._listeners.forEach(({ type, handler }) => {
        target.removeEventListener(type, handler)
      })
    }
  }
}
