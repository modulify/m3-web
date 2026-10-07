import type {
  ResolvedSearchLayout,
  SearchAnchorRect,
  SearchBreakpoint,
  SearchDockedPosition,
  SearchLayout,
  SearchRevealOrigin,
  SearchViewport,
} from '../types/components/search'

const DOCKED_MARGIN = 12
const DOCKED_MIN_WIDTH = 360
const DOCKED_MAX_WIDTH = 720
const DOCKED_MIN_HEIGHT = 240

export const resolveSearchLayout = (layout: SearchLayout, breakpoint: SearchBreakpoint): ResolvedSearchLayout => layout === 'auto'
  ? breakpoint === 'compact' ? 'full-screen' : 'docked'
  : layout

export const getSearchDockedPosition = (
  anchor: SearchAnchorRect,
  viewport: SearchViewport
): SearchDockedPosition => {
  const availableWidth = Math.max(0, viewport.width - 2 * DOCKED_MARGIN)
  const width = Math.min(availableWidth, DOCKED_MAX_WIDTH, Math.max(DOCKED_MIN_WIDTH, anchor.width + 2 * DOCKED_MARGIN))
  const left = Math.min(
    Math.max(DOCKED_MARGIN, anchor.left - (width - anchor.width) / 2),
    Math.max(DOCKED_MARGIN, viewport.width - width - DOCKED_MARGIN)
  )
  const top = Math.min(
    Math.max(DOCKED_MARGIN, anchor.top),
    Math.max(DOCKED_MARGIN, viewport.height - DOCKED_MIN_HEIGHT - DOCKED_MARGIN)
  )

  return { left, top, width }
}

export const getSearchRevealOrigin = (
  anchor: SearchAnchorRect,
  viewport: SearchViewport,
  position: SearchDockedPosition,
  layout: ResolvedSearchLayout
): SearchRevealOrigin => {
  const viewLeft = layout === 'docked' ? position.left : 0
  const viewTop = layout === 'docked' ? position.top : 0
  const viewWidth = layout === 'docked' ? position.width : viewport.width
  const headerInset = layout === 'full-screen' ? 12 : 0
  const left = anchor.left - viewLeft

  return {
    left,
    right: viewWidth - left - anchor.width,
    offsetY: anchor.top - viewTop - headerInset,
  }
}
