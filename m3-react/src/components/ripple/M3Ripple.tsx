import type {
  ForwardRefRenderFunction,
} from 'react'

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react'

import {
  useRecord,
  useWatch,
} from '@/hooks'

export interface M3RippleProps {
  owner: HTMLElement | null;
  centered?: boolean;
}

export interface M3RippleMethods {
  activate: (event: KeyboardEvent | MouseEvent) => void;
}

const M3Ripple: ForwardRefRenderFunction<
  M3RippleMethods,
  M3RippleProps
> = ({ owner, centered = false }, ref) => {
  const root = useRef<HTMLSpanElement | null>(null)

  const state = useRecord({
    centered,
    owner,
  })

  useWatch(centered, centered => state.centered = centered)
  useWatch(owner, owner => state.owner = owner)

  const lastKey = useRef<string | null>(null)

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

      requestAnimationFrame(() => {
        el.style.display = 'inline-block'
        el.addEventListener('animationend', hide)
      })
    }
  }, [])

  useImperativeHandle(ref, () => ({
    activate,
  }))

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
    className="m3-ripple"
    style={{ display: 'none' }}
  />
}

export default forwardRef(M3Ripple)