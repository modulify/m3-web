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

import {
  useId,
  useRecord,
  useWatch,
} from '@/hooks'

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

  const state = useRecord({
    checked,
    dragging: false,
  }, ['checked'])

  useWatch(checked, checked => state.checked = checked)

  const handlers = useRecord({
    onToggle,
  })

  useWatch(onToggle, onToggle => handlers.onToggle = onToggle)

  const toggle = useCallback((checked: boolean) => {
    state.checked = checked
    handlers.onToggle(checked)
  }, [])

  useEffect(() => {
    let startX = 0

    const onMove = (event: MouseEvent | TouchEvent) => {
      const shiftX = getEventX(event) - startX

      state.dragging = Math.abs(shiftX) > DRAG_THRESHOLD

      if (shiftX > DRAG_THRESHOLD && !state.checked) {
        toggle(true)
      } else if (shiftX < -1 * DRAG_THRESHOLD && state.checked) {
        toggle(false)
      }
    }

    const stopMouseListening = () => {
      state.dragging = false

      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', stopMouseListening)
    }

    const onMouseDown = (event: MouseEvent) => {
      startX = getEventX(event)

      window.addEventListener('mousemove', onMove)
      window.addEventListener('mouseup', stopMouseListening)
    }

    const onTouchCancel = () => {
      state.dragging = false
      stopTouchListening()
    }

    const stopTouchListening = () => {
      state.dragging = false

      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchcancel', onTouchCancel)
      window.removeEventListener('touchend', stopTouchListening)
    }

    const onTouchStart = (event: TouchEvent) => {
      startX = getEventX(event)

      window.addEventListener('touchmove', onMove)
      window.addEventListener('touchcancel', onTouchCancel)
      window.addEventListener('touchend', stopTouchListening)
    }

    const onClick = (event: Event) => {
      if (state.dragging) {
        event.preventDefault()
        state.dragging = false
      }
    }

    const el = input.current

    el?.addEventListener('click', onClick)
    el?.addEventListener('mousedown', onMouseDown)
    el?.addEventListener('touchstart', onTouchStart)

    return () => {
      el?.removeEventListener('click', onClick)
      el?.removeEventListener('mousedown', onMouseDown)
      el?.removeEventListener('touchstart', onTouchStart)
      stopMouseListening()
      stopTouchListening()
    }
  }, [])

  return (
    <span
      className={toClassName([className, {
        'm3-switch': true,
        'm3-switch_checked': state.checked,
        'm3-switch_disabled': disabled,
      }])}
      {...attrs}
    >
      <input
        id={useId(id, 'm3-switch')}
        ref={input}
        name={name}
        aria-checked={state.checked}
        aria-disabled={disabled}
        checked={state.checked}
        disabled={disabled}
        type="checkbox"
        role="switch"
        className="m3-switch__input"
        onChange={event => toggle(event.target.checked)}
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
          <M3SwitchScope.Provider value={{ checked: state.checked, disabled }}>
            {children}
          </M3SwitchScope.Provider>
        </span>
      </span>
    </span>
  )
}

export default forwardRef(M3Switch)
