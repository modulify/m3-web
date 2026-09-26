import type { ComponentSetupContext } from '@/utils/component'
import type { ElementReference } from '@modulify/m3-foundation/types/dom'
import type { Ref } from 'react'

import { useCallback, useEffect, useRef } from 'react'

import defineComponent from '@/utils/component'
import { useAnimationFrame, useRecord, useWatch } from '@/hooks'

export interface M3RippleProps {
  ref?: Ref<M3RippleExposed>;
  owner: HTMLElement | null;
  centered?: boolean;
}

export interface M3RippleExposed extends M3RippleMethods, ElementReference<HTMLSpanElement> {}

export interface M3RippleMethods {
  activate: (event: KeyboardEvent | MouseEvent) => void;
}

export default defineComponent(function M3Ripple(
  { ref: _ref, owner, centered = false }: M3RippleProps,
  { expose }: ComponentSetupContext<M3RippleExposed>
) {
  const root = useRef<HTMLSpanElement | null>(null)
  const state = useRecord({
    centered,
    owner,
  })

  useWatch(centered, centered => state.centered = centered)
  useWatch(owner, owner => state.owner = owner)

  const lastKey = useRef<string | null>(null)
  const activationFrame = useAnimationFrame()

  const activate = useCallback((event: KeyboardEvent | MouseEvent) => {
    const target = state.owner
    if (!target) {
      return
    }

    const center = state.centered || lastKey.current === 'Space'

    lastKey.current = null

    const el = root.current
    if (el) {
      const rect = target.getBoundingClientRect()
      const hide = () => {
        el.style.display = 'none'
        el.removeEventListener('animationend', hide)
      }

      hide()

      const diameter = Math.max(target.clientWidth, target.clientHeight)
      const x = 'clientX' in event && !center ? event.clientX - rect.x : target.clientWidth / 2
      const y = 'clientY' in event && !center ? event.clientY - rect.y : target.clientHeight / 2

      el.style.width = `${diameter}px`
      el.style.height = `${diameter}px`
      el.style.left = `${x - 0.5 * diameter}px`
      el.style.top = `${y - 0.5 * diameter}px`

      activationFrame.request(() => {
        el.style.display = 'inline-block'
        el.addEventListener('animationend', hide)
      })
    }
  }, [])

  expose({
    get el () { return root.current },
    activate,
  })

  useEffect(() => {
    const rememberKey = (event: KeyboardEvent) => lastKey.current = event.code

    if (owner) {
      owner.addEventListener('keyup', rememberKey, { passive: true })
      owner.addEventListener('click', activate, { passive: true })

      return () => {
        owner.removeEventListener('click', activate)
        owner.removeEventListener('keyup', rememberKey)
      }
    }

    return () => {}
  }, [owner])

  return <span
    ref={root}
    style={{ display: 'none' }}
    className="m3-ripple"
  />
})
