import type { ComponentSetupContext } from '@/utils/component'
import type { M3ProgressExposed, M3ProgressProps } from './types'

import { useRef } from 'react'

import defineComponent from '@/utils/component'

import M3ProgressCircle from './M3ProgressCircle'
import M3ProgressLine from './M3ProgressLine'

export default defineComponent(function M3Progress({
  ref: _ref,
  variant = 'linear',
  shape = 'flat',
  value = 0,
  indeterminate = false,
  size,
  thickness,
  track = true,
  stop = true,
  ...attrs
}: M3ProgressProps, { expose }: ComponentSetupContext<M3ProgressExposed>) {
  const view = useRef<M3ProgressExposed | null>(null)

  expose({ get el () { return view.current?.el ?? null } })

  const shared = { shape, value, indeterminate, thickness, track, ...attrs }

  return variant === 'circular'
    ? <M3ProgressCircle ref={view} size={size} {...shared} />
    : <M3ProgressLine ref={view} stop={stop} {...shared} />
})
