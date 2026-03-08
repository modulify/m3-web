import type { FC } from 'react'

import type {
  M3SurfacePanelProps,
  M3SurfacePanelVariant,
} from './shared'

import {
  getSurfacePanelClassName,
  getSurfacePanelStyle,
} from './shared'

export type {
  M3SurfacePanelProps,
  M3SurfacePanelVariant,
}

const M3SurfacePanel: FC<M3SurfacePanelProps> = ({
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
}) => {
  const SurfaceTag = tag

  return (
    <SurfaceTag
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
}

export default M3SurfacePanel
