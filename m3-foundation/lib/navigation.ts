import type { Appearance, AutoAppearance } from '../types/components/navigation'
import type { Breakpoint } from '../types/breakpoint'
import type { RailCollapse, RailExpandedMode } from '../types/components/navigation'

import { oneOf } from '@modulify/validator/assertions'

export const defaultAutoAppearances = ['bar', 'bar-vertical', 'rail', 'rail-expanded'] as const

const isAutoAppearance = oneOf<AutoAppearance>([...defaultAutoAppearances]).check

export const isBarAppearance: (appearance: Appearance) => boolean = oneOf<Appearance>(['bar', 'bar-vertical']).check

export const isExpandableAppearance: (appearance: Appearance) => boolean = oneOf<Appearance>(['rail', 'drawer']).check

export const isExpandedRail = (appearance: Appearance, expanded: boolean): boolean => appearance === 'rail' && expanded

export const isHiddenRail = (appearance: Appearance, expanded: boolean, collapse: RailCollapse): boolean =>
  appearance === 'rail' && collapse === 'hidden' && !expanded

export const isModalExpansion = (
  appearance: Appearance,
  expanded: boolean,
  mode: RailExpandedMode,
  wide: boolean
): boolean => expanded && (appearance === 'drawer'
  || (appearance === 'rail' && (mode === 'modal' || (mode === 'auto' && !wide))))

export const resolveNavigationAppearance = (
  breakpoint: Breakpoint,
  allowed: readonly AutoAppearance[] = defaultAutoAppearances
): AutoAppearance => {
  if (allowed.length === 0 || allowed.some(appearance => !isAutoAppearance(appearance))) {
    throw new RangeError('appearances must contain at least one valid automatic appearance')
  }

  const preferred = breakpoint === 'compact' || breakpoint === 'medium'
    ? 'bar'
    : breakpoint === 'expanded' ? 'rail' : 'rail-expanded'
  const preferredIndex = defaultAutoAppearances.indexOf(preferred)

  if (allowed.includes(preferred)) return preferred
  if (preferred === 'bar' && allowed.includes('bar-vertical')) return 'bar-vertical'

  for (let index = preferredIndex; index < defaultAutoAppearances.length; index++) {
    if (allowed.includes(defaultAutoAppearances[index])) return defaultAutoAppearances[index]
  }

  for (let index = preferredIndex - 1; index >= 0; index--) {
    if (allowed.includes(defaultAutoAppearances[index])) return defaultAutoAppearances[index]
  }

  throw new RangeError('appearances must contain at least one valid automatic appearance')
}
