import type {
  ForwardRefRenderFunction,
  HTMLAttributes,
} from 'react'

import type { ScrollRail } from '@modulify/m3-foundation/lib/scroll'

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react'

import {
  useRecord,
  useWatch,
} from '@/hooks'

import { createRail } from '@modulify/m3-foundation/lib/scroll'
import { toClassName } from '@/utils/styling'

export interface M3ScrollRailProps extends HTMLAttributes<HTMLElement> {
  horizontal?: boolean;
  disabled?: boolean;
}

export interface M3ScrollRailMethods {
  sync (): void;
}

const M3ScrollRail: ForwardRefRenderFunction<
  M3ScrollRailMethods,
  M3ScrollRailProps
> = ({
  horizontal,
  disabled,
  className = '',
  ...attrs
}, ref) => {
  const root = useRef<HTMLDivElement | null>(null)
  const rail = useRef<ScrollRail | null>(null)

  const state = useRecord({
    dragging: false,
    enabled: false,
  }, ['dragging', 'enabled'])

  useWatch(horizontal, horizontal => {
    if (rail.current) { rail.current.horizontal = horizontal }
  })

  useWatch(disabled, disabled => {
    if (rail.current) { rail.current.disabled = disabled }
  })

  useImperativeHandle(ref, () => ({
    sync: () => rail.current?.sync(),
  }))

  useEffect(() => {
    rail.current = createRail(root.current as HTMLElement, {
      horizontal,
      disabled,
      onDragStart: () => state.dragging = true,
      onDragEnd: () => state.dragging = false,
      onToggle: active => state.enabled = active,
    })
    rail.current.init()

    return () => {
      rail.current?.destroy()
      rail.current = null
    }
  }, [])

  return (
    <div
      ref={root}
      className={toClassName([className, {
        'm3-scroll-rail': true,
        'm3-scroll-rail_horizontal': horizontal,
        'm3-scroll-rail_active': state.dragging,
        'm3-scroll-rail_disabled': disabled || !state.enabled,
      }])}
      {...attrs}
    >
      <div className="m3-scroll-rail__slider" />
    </div>
  )
}

export default forwardRef(M3ScrollRail)
