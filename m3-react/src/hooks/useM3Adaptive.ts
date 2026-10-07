import type { Breakpoint } from '@modulify/m3-foundation/types/breakpoint'

import useBreakpoint from './useBreakpoint'

export type AdaptiveValues<Value> = Partial<Record<Breakpoint, Value>>

export default function useM3Adaptive () {
  const breakpoint = useBreakpoint()

  return <Value>(regular: Value, values: AdaptiveValues<Value> = {}): Value => {
    const selected = values[breakpoint.name]

    return selected === undefined ? regular : selected
  }
}
