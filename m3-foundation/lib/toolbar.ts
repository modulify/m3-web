import type { ToolbarScroll } from '../types/components/toolbar'

/** Number of 48px actions that fit while reserving a 48px overflow trigger. */
export const getToolbarVisibleCount = (
  available: number,
  count: number,
  occupied = 0,
  gap = 4
): number => {
  const item = 48
  const room = Math.max(0, available - occupied)
  if (count * item + Math.max(0, count - 1) * gap <= room) return count
  return Math.min(count - 1, Math.max(0, Math.floor((room - item) / (item + gap))))
}

export const getToolbarScrollState = (
  previous: number,
  current: number,
  active: boolean,
  scroll: ToolbarScroll
): boolean => {
  if (scroll === 'pinned' || current <= 0) return false
  if (current > previous + 1) return true
  if (current < previous - 1) return false
  return active
}
