import type {
  ForwardRefRenderFunction,
  HTMLAttributes,
} from 'react'

import type {
  Clickable,
  Focusable,
} from '@modulify/m3-foundation'

import M3SwitchScope from './M3SwitchScope'

import {
  Children,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react'

import useId from '@/hooks/useId'

import { toClassName } from '@/utils/styling'

export interface M3SwitchProps extends HTMLAttributes<HTMLElement> {
  name?: string;
  checked?: boolean;
  disabled?: boolean;
  onToggle?: (value: boolean) => void;
}

export interface M3SwitchMethods extends Clickable, Focusable {}

const getEventX = (event: MouseEvent | TouchEvent) => 'clientX' in event
  ? event.clientX
  : event.touches[0].clientX

const DRAG_THRESHOLD = 4

const M3Switch: ForwardRefRenderFunction<
  M3SwitchMethods,
  M3SwitchProps
> = ({
  id,
  name,
  checked = false,
  disabled = false,
  className = '',
  children ,
  onToggle = (_: boolean) => {},
  ...attrs
}, ref) => {
  const input = useRef<HTMLInputElement | null>(null)

  useImperativeHandle(ref, () => ({
    click: () => input.current?.click(),
    focus: () => input.current?.focus(),
    blur: () => input.current?.blur(),
  }))

  const internals = {
    checked: useRef(checked),
    dragging: useRef(false),
    startX: useRef(0),
  }

  const toggle = useCallback((checked: boolean) => {
    internals.checked.current = checked
    onToggle(checked)
  }, [onToggle])

  useEffect(() => {
    if (internals.checked.current !== checked) {
      internals.checked.current = checked
    }
  }, [checked])

  useEffect(() => {
    const onMove = (event: MouseEvent | TouchEvent) => {
      const shiftX = getEventX(event) - internals.startX.current

      internals.dragging.current = Math.abs(shiftX) > DRAG_THRESHOLD

      if (shiftX > DRAG_THRESHOLD && !internals.checked.current) {
        toggle(true)
      } else if (shiftX < -1 * DRAG_THRESHOLD && internals.checked.current) {
        toggle(false)
      }
    }

    const stopMouseListening = () => {
      internals.dragging.current = false

      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', stopMouseListening)
    }

    const onMouseDown = (event: MouseEvent) => {
      internals.startX.current = getEventX(event)

      window.addEventListener('mousemove', onMove)
      window.addEventListener('mouseup', stopMouseListening)
    }

    const onTouchCancel = () => {
      internals.dragging.current = false
      stopTouchListening()
    }

    const stopTouchListening = () => {
      internals.dragging.current = false

      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchcancel', onTouchCancel)
      window.removeEventListener('touchend', stopTouchListening)
    }

    const onTouchStart = (event: TouchEvent) => {
      internals.startX.current = getEventX(event)

      window.addEventListener('touchmove', onMove)
      window.addEventListener('touchcancel', onTouchCancel)
      window.addEventListener('touchend', stopTouchListening)
    }

    const el = input.current

    el?.addEventListener('mousedown', onMouseDown)
    el?.addEventListener('touchstart', onTouchStart)

    return () => {
      el?.removeEventListener('mousedown', onMouseDown)
      el?.removeEventListener('touchstart', onTouchStart)
      stopMouseListening()
      stopTouchListening()
    }
  }, [toggle])

  return (
    <span
      className={toClassName([className, {
        'm3-switch': true,
        'm3-switch_checked': internals.checked.current,
        'm3-switch_disabled': disabled,
      }])}
      {...attrs}
    >
      <input
        id={useId(id, 'm3-switch')}
        ref={input}
        name={name}
        aria-checked={internals.checked.current}
        aria-disabled={disabled}
        checked={internals.checked.current}
        disabled={disabled}
        type="checkbox"
        role="switch"
        className="m3-switch__input"
        onClick={event => {
          if (internals.dragging.current) {
            event.preventDefault()
            internals.dragging.current = false
          }
        }}
        onChange={event => {
          toggle(event.target.checked)
        }}
        onKeyDown={event => {
          if (event.code === 'Enter') {
            input.current?.click()
          }
        }}
      />

      <span
        aria-hidden={true}
        className={toClassName({
          'm3-switch__handle': true,
          'm3-switch__handle_has-icon': Children.count(children) > 0,
        })}
      >
        <span className="m3-switch__state" />
        <span className="m3-switch__checkmark">
          <M3SwitchScope.Provider
            value={{
              checked: internals.checked.current,
              disabled,
            }}
          >
            {children}
          </M3SwitchScope.Provider>
        </span>
      </span>
    </span>
  )
}

export default forwardRef(M3Switch)
