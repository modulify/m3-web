import type {
  AppBarAppearance,
  AppBarScroll,
  AppBarScrollState,
} from '../types/components/app-bar'

export const getFlexibleAppBarHeight = (
  appearance: AppBarAppearance,
  subtitle: boolean,
  contentHeight: number
): number => {
  const minimum = appearance === 'large-flexible'
    ? subtitle ? 152 : 120
    : subtitle ? 136 : 112

  return Math.max(minimum, 56 + contentHeight)
}

export const getAppBarScrollState = (
  previous: number,
  current: number,
  hidden: boolean,
  behavior: AppBarScroll
): AppBarScrollState => ({
  under: current > 0,
  hidden: behavior === 'hide' && current > 0 && (current > previous + 1 || hidden && current >= previous - 1),
  collapsed: behavior === 'collapse' && current > 0,
})
