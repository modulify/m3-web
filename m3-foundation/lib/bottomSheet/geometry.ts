import type {
  BottomSheetPosition,
  BottomSheetVariant,
} from '../../types/components/bottom-sheet'

export interface BottomSheetHeights {
  collapsed: number;
  expanded: number;
}

const HANDLE_HEIGHT = 48

export function bottomSheetHeights(
  contentHeight: number,
  viewportWidth: number,
  viewportHeight: number,
  variant: BottomSheetVariant,
  handle: boolean,
  peek?: number
): BottomSheetHeights {
  const available = Math.max(0, viewportHeight - (viewportWidth > 640 ? 56 : 72))
  const natural = Math.max(0, contentHeight) + (handle ? HANDLE_HEIGHT : 0)
  const expanded = Math.min(natural, available)
  const modalLimit = variant === 'modal' ? viewportHeight / 2 : expanded
  const requested = typeof peek === 'number' && Number.isFinite(peek) ? Math.max(0, peek) : expanded

  return {
    collapsed: Math.min(expanded, modalLimit, requested),
    expanded,
  }
}

export function bottomSheetPosition(
  height: number,
  { collapsed, expanded }: BottomSheetHeights
): BottomSheetPosition {
  if (height < collapsed - Math.max(80, collapsed / 4)) return 'closed'
  if (expanded - collapsed < 1) return 'collapsed'

  return height > (collapsed + expanded) / 2 ? 'expanded' : 'collapsed'
}
