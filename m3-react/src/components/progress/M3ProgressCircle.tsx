import type { ComponentSetupContext } from '@/utils/component'
import type { CSSProperties } from 'react'
import type { M3ProgressCircleProps, M3ProgressExposed } from './types'

import { useEffect, useMemo, useRef } from 'react'

import {
  circularProgressGeometry,
  circularProgressSegments,
  circularProgressThickness,
  circularProgressWaveAmplitude,
  circularProgressWavePath,
  progressSize,
  progressValue,
} from '@modulify/m3-foundation/lib/progress'

import defineComponent from '@/utils/component'
import { toClassName } from '@/utils/styling'
import { useAnimationFrame, useElementReference } from '@/hooks'

export default defineComponent(function M3ProgressCircle({
  ref: _ref,
  value = 0,
  indeterminate = false,

  shape = 'flat',

  size,

  thickness,

  track = true,

  className = '',
  style,
  ...attrs
}: M3ProgressCircleProps, { expose }: ComponentSetupContext<M3ProgressExposed>) {
  const root = useRef<HTMLDivElement | null>(null)

  expose(useElementReference(root))

  const activePath = useRef<SVGPathElement | null>(null)

  const trackPath = useRef<SVGPathElement | null>(null)
  const circularSize = progressSize(size ?? (shape === 'wavy' ? 48 : 40))
  const circularWave = shape === 'wavy'

  const progress = progressValue(value)
  const stroke = circularProgressThickness(circularSize, circularWave, thickness)

  const waveAmplitude = circularProgressWaveAmplitude(progress)
  const geometry = useMemo(
    () => circularProgressGeometry(circularSize, stroke, progress, circularWave),
    [circularSize, stroke, progress, circularWave]
  )
  const initialGeometry = indeterminate
    ? circularProgressGeometry(circularSize, stroke, 10, circularWave)
    : geometry
  const initialActiveDasharray = circularWave
    ? undefined
    : `${initialGeometry.activeLength} ${100 - initialGeometry.activeLength}`

  const amplitude = useRef(waveAmplitude)

  const initialActivePath = circularWave
    ? circularProgressWavePath(
      circularSize,
      stroke,
      indeterminate ? 10 : progress,
      indeterminate ? 1 : amplitude.current
    )
    : geometry.path

  const frame = useAnimationFrame()

  useEffect(() => {
    if (!root.current || !activePath.current || !trackPath.current) return

    const container = root.current
    const path = activePath.current
    const track = trackPath.current
    const svg = path.ownerSVGElement!
    const preference = window.matchMedia?.('(prefers-reduced-motion: reduce)')

    const listeners = new AbortController()

    const draw = (time: number) => {
      const reduced = preference?.matches ?? false
      const sweep = indeterminate
        ? Number(getComputedStyle(svg).getPropertyValue('--m3-progress-circular-sweep'))
        : progress
      const segments = circularProgressSegments(sweep, geometry.gap)
      track.setAttribute('stroke-dasharray', `${segments.trackLength} ${100 - segments.trackLength}`)
      track.setAttribute('stroke-dashoffset', String(segments.trackOffset))
      track.setAttribute('opacity', indeterminate ? String(Math.min(1, segments.trackLength)) : '1')

      if (circularWave) {
        const cssAmplitude = indeterminate
          ? ''
          : getComputedStyle(container).getPropertyValue('--m3-progress-wave-amplitude').trim()
        const currentAmplitude = cssAmplitude ? Number(cssAmplitude) : waveAmplitude
        amplitude.current = indeterminate ? 1 : reduced ? waveAmplitude : currentAmplitude
        path.setAttribute('d', circularProgressWavePath(
          circularSize,
          stroke,
          sweep,
          amplitude.current,
          indeterminate || reduced ? 0 : time / 1000 % 1
        ))
      } else {
        path.setAttribute('stroke-dasharray', `${segments.activeLength} ${100 - segments.activeLength}`)
      }

      if (!reduced && (indeterminate || circularWave && (amplitude.current !== 0 || waveAmplitude !== 0))) {
        frame.request(draw)
      }
    }

    preference?.addEventListener('change', () => frame.request(draw), { signal: listeners.signal })
    frame.request(draw)

    return () => {
      frame.cancel()
      listeners.abort('Progress circle disposed')
    }
  }, [circularWave, circularSize, stroke, progress, indeterminate, geometry.gap, waveAmplitude, frame])

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
        'm3-progress_circular': true,
        'm3-progress_wavy': circularWave,
        'm3-progress_wave-flat': circularWave && !indeterminate && waveAmplitude === 0,
        'm3-progress_indeterminate': indeterminate,
        'm3-progress_empty': !indeterminate && progress === 0,
        'm3-progress_complete': !indeterminate && progress === 100,
        'm3-progress_no-track': !track,
      }])}
      style={{
        ...style,
        '--m3-progress-container-size': `${circularSize}px`,
        '--m3-progress-thickness': `${stroke}px`,
        '--m3-progress-circular-gap': geometry.gap,
      } as CSSProperties}
      {...rootAttrs}
    >
      <svg
        className="m3-progress__circular"
        viewBox={`0 0 ${circularSize} ${circularSize}`}
        aria-hidden="true"
      >
        <g className="m3-progress__circular-motion">
          <path
            ref={trackPath}
            className="m3-progress__circular-track"
            d={geometry.trackPath}
            pathLength="100"
            strokeWidth={stroke}
            strokeDasharray={`${initialGeometry.trackLength} ${100 - initialGeometry.trackLength}`}
            strokeDashoffset={initialGeometry.trackOffset}
            strokeLinecap="round"
          />
          <path
            ref={activePath}
            className="m3-progress__circular-active"
            d={initialActivePath}
            pathLength="100"
            strokeWidth={stroke}
            strokeDasharray={initialActiveDasharray}
            strokeLinecap="round"
            style={!indeterminate && progress === 0 ? { display: 'none' } : undefined}
          />
        </g>
      </svg>
    </div>
  )
})
