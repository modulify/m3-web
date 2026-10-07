import type { Breakpoint } from '@modulify/m3-foundation/types/breakpoint'

import { useBreakpoint } from './breakpoint'

export type AdaptiveValues<Value> = Partial<Record<Breakpoint, Value>>

const breakpoint = useBreakpoint()

export const m3Adaptive = <Value>(regular: Value, values: AdaptiveValues<Value> = {}): Value => {
  const selected = values[breakpoint.value.name]

  return selected === undefined ? regular : selected
}
