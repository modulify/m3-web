import type { CarouselVariant } from '../../types/components/carousel'

export interface CarouselGeometryOptions {
  variant: CarouselVariant;
  width: number;
  height: number;
  count: number;
  preferred: number;
  aspects: number[];
  reduced: boolean;
}

export interface CarouselFrame {
  offset: number;
  size: number;
  parallax: number;
  scale: 'large' | 'medium' | 'small';
}

export interface CarouselGeometry {
  vertical: boolean;
  extent: number;
  viewport: number;
  large: number;
  positions: number[];
  frames: (offset: number) => CarouselFrame[];
}

interface DynamicLayout {
  count: number;
  viewport: number;
  gap: number;
  padding: number;
  small: number;
  medium: number;
  large: number;
  largeCount: number;
  centered: boolean;
}

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value))
const interpolate = (start: number, end: number, progress: number) => start + (end - start) * progress

function uncontainedGeometry(
  options: CarouselGeometryOptions,
  viewport: number,
  gap: number,
  padding: number,
  available: number,
  preferred: number
): CarouselGeometry {
  const { variant, count, height, aspects, reduced } = options
  const itemHeight = Math.max(1, height - 16)
  const sizes = Array.from({ length: count }, (_, index) => {
    if (variant !== 'uncontained-multi-aspect') return Math.min(preferred, available)

    const aspect = aspects[index] || 1
    return clamp(itemHeight * aspect, itemHeight * 9 / 16, itemHeight * 16 / 9)
  })

  let nextPosition = 0
  const positions = sizes.map(size => {
    const position = nextPosition
    nextPosition += size + gap
    return position
  })
  const totalSize = sizes.reduce((sum, size) => sum + size, 0)
  const extent = Math.max(viewport, padding + totalSize + gap * Math.max(0, count - 1))

  return {
    vertical: false,
    extent,
    viewport,
    large: Math.max(...sizes, 0),
    positions,
    frames: offset => sizes.map((size, index) => {
      const position = padding + positions[index] - offset
      const center = position + size / 2

      return {
        offset: position,
        size,
        parallax: reduced ? 0 : clamp((center - viewport / 2) / viewport * -20, -20, 20),
        scale: 'large',
      }
    }),
  }
}

function uniformGeometry(
  count: number,
  viewport: number,
  gap: number,
  padding: number,
  size: number,
  vertical: boolean
): CarouselGeometry {
  const step = (vertical ? viewport : size) + gap

  return {
    vertical,
    viewport,
    large: size,
    extent: viewport + Math.max(0, count - 1) * step,
    positions: Array.from({ length: count }, (_, index) => index * step),
    frames: offset => Array.from({ length: count }, (_, index) => ({
      offset: padding + index * step - offset,
      size,
      parallax: 0,
      scale: 'large',
    })),
  }
}

function dynamicLayout(
  options: CarouselGeometryOptions,
  viewport: number,
  gap: number,
  padding: number,
  available: number,
  small: number,
  preferred: number
): DynamicLayout {
  const multi = options.variant === 'multi-browse'
  const centered = options.variant === 'hero-centered'
  let largeCount: number
  let large: number

  if (centered) {
    largeCount = 1
    large = Math.min(preferred, Math.max(80, available - 2 * small - 2 * gap))
  } else if (multi) {
    largeCount = Math.max(1, Math.floor((available - small - 3 * gap) / (preferred + gap)))
    large = Math.min(preferred, Math.max(80, (available - small - gap * (largeCount + 1)) / (largeCount + .6)))
  } else {
    largeCount = Math.max(1, Math.floor((available - small - gap) / (preferred + gap)))
    large = Math.min(preferred, Math.max(80, (available - small - gap * largeCount) / largeCount))
  }

  const medium = multi
    ? Math.max(small, Math.min(large - 1, available - largeCount * large - small - gap * (largeCount + 1)))
    : small

  return {
    count: options.count,
    viewport,
    gap,
    padding,
    small,
    medium,
    large,
    largeCount,
    centered,
  }
}

function stateFrames(layout: DynamicLayout, anchor: number): CarouselFrame[] {
  const { count, viewport, gap, padding, small, medium, large, largeCount, centered } = layout
  const sizes = Array.from({ length: count }, (_, index) => {
    const relative = index - anchor
    if (centered) return relative === 0 ? large : small
    if (relative < 0) return small
    if (relative < largeCount) return large
    return relative === largeCount ? medium : small
  })

  const offsets = Array.from<number>({ length: count })
  offsets[anchor] = centered ? (viewport - large) / 2 : padding

  for (let index = anchor + 1; index < count; index++) {
    offsets[index] = offsets[index - 1] + sizes[index - 1] + gap
  }

  for (let index = anchor - 1; index >= 0; index--) {
    offsets[index] = offsets[index + 1] - sizes[index] - gap
  }

  return sizes.map((size, index) => ({
    offset: offsets[index],
    size,
    parallax: 0,
    scale: size <= small + 1 ? 'small' : size < large * .8 ? 'medium' : 'large',
  }))
}

function dynamicGeometry(layout: DynamicLayout): CarouselGeometry {
  const { count, viewport, gap, small, large } = layout
  const step = large + gap
  return {
    vertical: false,
    viewport,
    large,
    extent: viewport + Math.max(0, count - 1) * step,
    positions: Array.from({ length: count }, (_, index) => index * step),
    frames: offset => {
      const progress = clamp(offset / step, 0, Math.max(0, count - 1))
      const start = Math.floor(progress)
      const end = Math.min(count - 1, start + 1)
      const fraction = progress - start
      const before = stateFrames(layout, start)
      const after = stateFrames(layout, end)

      return before.map((frame, index) => {
        const itemOffset = interpolate(frame.offset, after[index].offset, fraction)
        const size = interpolate(frame.size, after[index].size, fraction)

        return {
          offset: itemOffset,
          size,
          parallax: clamp((itemOffset + size / 2 - viewport / 2) / viewport * -20, -20, 20),
          scale: size <= small + 1 ? 'small' : size < large * .8 ? 'medium' : 'large',
        }
      })
    },
  }
}

export function carouselGeometry(options: CarouselGeometryOptions): CarouselGeometry {
  const { variant, width, height, count, preferred, reduced } = options
  const vertical = variant === 'full-screen'
  const viewport = Math.max(1, vertical ? height : width)
  const gap = vertical ? 16 : 8
  const padding = vertical ? 0 : 16
  const available = Math.max(1, viewport - 2 * padding)
  const small = clamp(available * .14, 40, 56)
  const preferredWidth = Number.isFinite(preferred) ? Math.max(80, preferred) : 280

  if (variant === 'uncontained' || variant === 'uncontained-multi-aspect') {
    return uncontainedGeometry(options, viewport, gap, padding, available, preferredWidth)
  }
  if (vertical) return uniformGeometry(count, viewport, gap, 0, viewport, true)
  if (reduced) {
    const size = variant === 'hero' || variant === 'hero-centered'
      ? Math.min(preferredWidth, available * .8)
      : Math.min(preferredWidth, available)
    return uniformGeometry(count, viewport, gap, padding, size, false)
  }

  return dynamicGeometry(dynamicLayout(options, viewport, gap, padding, available, small, preferredWidth))
}
