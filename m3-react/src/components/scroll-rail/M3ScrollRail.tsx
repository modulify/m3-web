import type { ComponentSetupContext } from '@/utils/component'
import type { ElementReference } from '@modulify/m3-foundation/types/dom'
import type { HTMLAttributes, Ref } from 'react'
import type { ScrollRail } from '@modulify/m3-foundation/lib/scroll'

import { createRail } from '@modulify/m3-foundation/lib/scroll'
import { useEffect, useRef } from 'react'

import defineComponent from '@/utils/component'
import { toClassName } from '@/utils/styling'
import { useRecord, useWatch } from '@/hooks'

export interface M3ScrollRailProps extends HTMLAttributes<HTMLElement> {
  ref?: Ref<M3ScrollRailExposed>;
  horizontal?: boolean;
  disabled?: boolean;
}

export interface M3ScrollRailExposed extends M3ScrollRailMethods, ElementReference<HTMLDivElement> {}

export interface M3ScrollRailMethods {
  sync (): void;
}

export default defineComponent(function M3ScrollRail({
  ref: _ref,
  horizontal = false,
  disabled = false,
  className = '',
  ...attrs
}: M3ScrollRailProps, { expose }: ComponentSetupContext<M3ScrollRailExposed>) {
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

  expose({
    get el () { return root.current },
    sync: () => rail.current?.sync(),
  })

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
})
