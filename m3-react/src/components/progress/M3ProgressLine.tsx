import type { ComponentSetupContext } from '@/utils/component'
import type { CSSProperties } from 'react'
import type { M3ProgressExposed, M3ProgressLineProps } from './types'

import { useEffect, useMemo, useRef } from 'react'

import {
  linearIndeterminateGeometry,
  linearProgressSegmentPath,
  linearProgressWavePath,
  progressThickness,
  progressValue,
} from '@modulify/m3-foundation/lib/progress'

import defineComponent from '@/utils/component'
import { toClassName } from '@/utils/styling'
import { useAnimationFrame, useElementReference, useResizeObserver } from '@/hooks'

export default defineComponent(function M3ProgressLine({
  ref: _ref,
  value = 0,
  indeterminate = false,

  shape = 'flat',

  thickness,

  track = true,

  stop = true,

  className = '',
  style,
  ...attrs
}: M3ProgressLineProps, { expose }: ComponentSetupContext<M3ProgressExposed>) {
  const root = useRef<HTMLDivElement | null>(null)

  expose(useElementReference(root))

  const motion = useRef<SVGSVGElement | null>(null)

  const progress = progressValue(value)
  const stroke = progressThickness(thickness ?? 4)

  const waveHeight = stroke + 6
  const wavePath = useMemo(() => linearProgressWavePath(waveHeight), [waveHeight])

  const refreshMotion = useRef<() => void>(() => {})
  const frame = useAnimationFrame()
  useResizeObserver(root, () => refreshMotion.current())

  useEffect(() => {
    if (!indeterminate || !root.current || !motion.current) return

    const container = root.current
    const svg = motion.current
    const tracks = [...svg.querySelectorAll<SVGPathElement>('.m3-progress__linear-motion-track')]
    const active = [...svg.querySelectorAll<SVGPathElement>('.m3-progress__linear-motion-active')]
    const preference = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    const height = shape === 'wavy' ? waveHeight : stroke
    const started = performance.now()

    let width = 0

    const listeners = new AbortController()

    const draw = (time: number) => {
      const reduced = preference?.matches ?? false
      const elapsed = reduced ? 875 : time - started
      const geometry = linearIndeterminateGeometry(width, stroke, elapsed)
      const phase = reduced ? 0 : elapsed / 1000 * 40

      tracks.forEach((path, index) => {
        path.setAttribute('d', geometry.track[index]
          ? linearProgressSegmentPath(geometry.track[index], height, false)
          : '')
      })
      active.forEach((path, index) => {
        path.setAttribute('d', geometry.active[index]
          ? linearProgressSegmentPath(geometry.active[index], height, shape === 'wavy', phase)
          : '')
      })

      if (!reduced) frame.request(draw)
    }

    const refresh = () => {
      width = Math.max(1, container.getBoundingClientRect().width)
      svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
      frame.request(draw)
    }

    refreshMotion.current = refresh
    preference?.addEventListener('change', refresh, { signal: listeners.signal })
    refresh()

    return () => {
      frame.cancel()
      refreshMotion.current = () => {}
      listeners.abort('Progress line disposed')
    }
  }, [indeterminate, stroke, shape, waveHeight, frame])

  const rootAttrs = {
    ...attrs,
    role: 'progressbar',
    'aria-valuemin': indeterminate ? undefined : 0,
    'aria-valuemax': indeterminate ? undefined : 100,
    'aria-valuenow': indeterminate ? undefined : progress,
  } as const

  return (
    <div
      ref={root}
      className={toClassName([className, {
        'm3-progress': true,
        'm3-progress_linear': true,
        'm3-progress_wavy': shape === 'wavy',
        'm3-progress_indeterminate': indeterminate,
        'm3-progress_empty': !indeterminate && progress === 0,
        'm3-progress_complete': !indeterminate && progress === 100,
        'm3-progress_no-track': !track,
        'm3-progress_no-stop': !stop,
      }])}
      style={{
        ...style,
        '--m3-progress-container-size': `${shape === 'wavy' ? waveHeight : stroke}px`,
        '--m3-progress-thickness': `${stroke}px`,
        '--m3-progress-end': `${progress}%`,
      } as CSSProperties}
      {...rootAttrs}
    >
      {indeterminate ? (
        <svg ref={motion} className="m3-progress__linear-motion" aria-hidden="true">
          {[0, 1, 2].map(index => (
            <path
              key={index}
              className="m3-progress__linear-motion-track"
              strokeWidth={stroke}
              strokeLinecap="round"
            />
          ))}
          {[0, 1].map(index => (
            <path
              key={index}
              className="m3-progress__linear-motion-active"
              strokeWidth={stroke}
              strokeLinecap="round"
            />
          ))}
        </svg>
      ) : (
        <>
          <span className="m3-progress__track" aria-hidden="true" />
          <span className="m3-progress__active" aria-hidden="true">
            {shape === 'wavy' && (
              <svg className="m3-progress__wave" width="8200" height={waveHeight} aria-hidden="true">
                <path d={wavePath} fill="none" stroke="currentColor" strokeWidth={stroke} />
              </svg>
            )}
          </span>
          <span className="m3-progress__stop" aria-hidden="true" />
        </>
      )}
    </div>
  )
})
