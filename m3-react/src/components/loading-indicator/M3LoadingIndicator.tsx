import type { ComponentSetupContext } from '@/utils/component'
import type { CSSProperties } from 'react'
import type { M3LoadingIndicatorExposed, M3LoadingIndicatorProps } from './types'

import { useEffect, useRef } from 'react'

import { geometryAt, normalizeSize } from '@modulify/m3-foundation/lib/loading-indicator'

import defineComponent from '@/utils/component'

import { toClassName } from '@/utils/styling'
import { useAnimationFrame, useElementReference } from '@/hooks'

export default defineComponent(function M3LoadingIndicator({
  ref: _ref,
  size = 48,
  contained = false,
  className = '',
  style,
  ...attrs
}: M3LoadingIndicatorProps, { expose }: ComponentSetupContext<M3LoadingIndicatorExposed>) {
  const root = useRef<HTMLDivElement | null>(null)
  const shape = useRef<SVGPathElement | null>(null)
  const motion = useRef<SVGGElement | null>(null)
  const frame = useAnimationFrame()

  expose(useElementReference(root))

  useEffect(() => {
    const preference = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    const listeners = new AbortController()
    let started: number | undefined

    const draw = (time: number) => {
      started ??= time

      const current = geometryAt(preference?.matches ? 0 : time - started)
      shape.current?.setAttribute('d', current.path)
      motion.current?.setAttribute('transform', `rotate(${current.rotation} 24 24)`)

      if (!preference?.matches) frame.request(draw)
    }

    const restart = () => {
      frame.cancel()
      started = undefined
      frame.request(draw)
    }

    preference?.addEventListener('change', restart, { signal: listeners.signal })
    frame.request(draw)

    return () => {
      frame.cancel()
      listeners.abort('Loading indicator disposed')
    }
  }, [frame])

  const rootAttrs = { ...attrs, role: 'progressbar' as const }

  return <div
    ref={root}
    className={toClassName([className, {
      'm3-loading-indicator': true,
      'm3-loading-indicator_contained': contained,
    }])}
    style={{
      ...style,
      '--m3-loading-indicator-size': `${normalizeSize(size)}px`,
    } as CSSProperties}
    {...rootAttrs}
  >
    <svg className="m3-loading-indicator__shape" viewBox="0 0 48 48" aria-hidden="true">
      <g ref={motion}>
        <path ref={shape} d={geometryAt(0).path} />
      </g>
    </svg>
  </div>
})
