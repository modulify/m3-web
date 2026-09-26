import type { ComponentSetupContext } from '@/utils/component'
import type { ElementReference } from '@modulify/m3-foundation/types/dom'
import type { HTMLAttributes } from 'react'
import type { Interactable } from '@modulify/m3-foundation/types/dom'
import type { Ref } from 'react'

import {
  Children,
  useCallback,
  useEffect,
  useRef,
} from 'react'

import defineComponent from '@/utils/component'
import { toClassName } from '@/utils/styling'
import {
  useId,
  useInteractable,
  useRecord,
  useWatch,
} from '@/hooks'

import M3SwitchScope from './M3SwitchScope'

export interface M3SwitchProps extends Omit<HTMLAttributes<HTMLElement>, 'onToggle'> {
  ref?: Ref<M3SwitchExposed>;
  name?: string;
  checked?: boolean;
  disabled?: boolean;
  onToggle?: (value: boolean) => void;
}

export interface M3SwitchExposed extends M3SwitchMethods, ElementReference<HTMLSpanElement> {}

export interface M3SwitchMethods extends Interactable {}

const getEventX = (event: MouseEvent | TouchEvent) => 'clientX' in event
  ? event.clientX
  : event.touches[0].clientX

const DRAG_THRESHOLD = 4

export default defineComponent(function M3Switch({
  ref: _ref,
  id,
  name,
  checked = false,
  disabled = false,
  className = '',
  children ,
  onToggle = (_: boolean) => {},
  ...attrs
}: M3SwitchProps, { expose }: ComponentSetupContext<M3SwitchExposed>) {
  const root = useRef<HTMLSpanElement | null>(null)
  const input = useRef<HTMLInputElement | null>(null)
  const interactable = useInteractable(root, input)

  expose(interactable)

  const state = useRecord({
    checked,
    dragging: false,
    clickSuppressed: false,
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

      if (state.dragging) {
        state.clickSuppressed = true
      }

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
      state.dragging = false
      state.clickSuppressed = false
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
      state.dragging = false
      state.clickSuppressed = false
      startX = getEventX(event)

      window.addEventListener('touchmove', onMove)
      window.addEventListener('touchcancel', onTouchCancel)
      window.addEventListener('touchend', stopTouchListening)
    }

    const onClick = (event: Event) => {
      if (state.clickSuppressed) {
        event.preventDefault()
        event.stopPropagation()
        state.clickSuppressed = false
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
      ref={root}
      className={toClassName([className, {
        'm3-switch': true,
        'm3-switch_checked': state.checked,
        'm3-switch_disabled': disabled,
      }])}
      {...attrs}
    >
      <input
        ref={input}
        id={useId(id, 'm3-switch')}
        name={name}
        aria-checked={state.checked}
        aria-disabled={disabled}
        checked={state.checked}
        disabled={disabled}
        role="switch"
        type="checkbox"
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
})
