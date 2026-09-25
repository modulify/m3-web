import type { ComponentSetupContext } from '@/utils/component'
import type { ElementReference } from '@modulify/m3-foundation/types/dom'
import type { M3SurfacePanelOptions, M3SurfacePanelVariant } from './shared'
import type { Ref } from 'react'

import { useRef } from 'react'

import defineComponent from '@/utils/component'
import { useElementReference } from '@/hooks'

import { getSurfacePanelClassName, getSurfacePanelStyle } from './shared'

export type {
  M3SurfacePanelVariant,
}

export interface M3SurfacePanelProps extends M3SurfacePanelOptions {
  ref?: Ref<M3SurfacePanelExposed>;
}

export interface M3SurfacePanelExposed extends ElementReference<HTMLElement> {}

export default defineComponent(function M3SurfacePanel({
  ref: _ref,
  id,
  tag = 'section',
  elevation = 0,
  variant = 'auto',
  fillWidth = true,
  fillHeight = true,
  width = null,
  height = null,
  minWidth = null,
  maxWidth = null,
  minHeight = null,
  maxHeight = null,
  rounding = 0,
  roundingTopLeft = null,
  roundingTopRight = null,
  roundingBottomRight = null,
  roundingBottomLeft = null,
  transitionMs = 220,
  transitionTiming,
  overflow = 'visible',
  className = '',
  style,
  children,
  ...attrs
}: M3SurfacePanelProps, { expose }: ComponentSetupContext<M3SurfacePanelExposed>) {
  const SurfaceTag = tag as 'div'
  const root = useRef<HTMLElement | null>(null)
  expose(useElementReference(root))

  return (
    <SurfaceTag
      ref={(element) => {
        root.current = element
      }}
      id={id}
      className={getSurfacePanelClassName({
        className,
        elevation,
        variant,
      })}
      style={getSurfacePanelStyle({
        fillWidth,
        fillHeight,
        width,
        height,
        minWidth,
        maxWidth,
        minHeight,
        maxHeight,
        rounding,
        roundingTopLeft,
        roundingTopRight,
        roundingBottomRight,
        roundingBottomLeft,
        transitionMs,
        transitionTiming,
        overflow,
        style,
      })}
      {...attrs}
    >
      {children}
    </SurfaceTag>
  )
})
