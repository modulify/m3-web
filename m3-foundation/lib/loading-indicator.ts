const SHAPE_COUNT = 7
const POINT_COUNT = 80
const MORPH_INTERVAL = 650
const ROTATION_DURATION = 4666
const RADIUS = 19
const CENTER = 24

/**
 * Unit-step response of an underdamped spring. `damping` is the damping ratio,
 * `frequency` is the square root of stiffness, and `damped` is the oscillation
 * frequency after damping. Time is measured in seconds.
 */
const springResponse = (time: number): number => {
  const damping = 0.6
  const frequency = Math.sqrt(200)
  const damped = frequency * Math.sqrt(1 - damping ** 2)
  const decay = Math.exp(-damping * frequency * time)
  const phase = damped * time
  const oscillation = Math.cos(phase) + Math.sin(phase) * damping * frequency / damped

  return 1 - decay * oscillation
}

/** Reaches the next shape within one morph interval without spring overshoot. */
const spring = (time: number): number =>
  Math.min(1, Math.max(0, springResponse(time) / springResponse(MORPH_INTERVAL / 1000)))

/**
 * Solves |x / width|^n + |y / height|^n = 1 for the radius at `angle`, where
 * x = radius * cos(angle) and y = radius * sin(angle).
 */
const superellipseRadius = (angle: number, width: number, height: number, exponent: number): number =>
  (Math.abs(Math.cos(angle) / width) ** exponent +
    Math.abs(Math.sin(angle) / height) ** exponent) ** (-1 / exponent)

/**
 * Radial approximations in Material's morph order: SoftBurst, Cookie9Sided,
 * Pentagon, Pill, Sunny, Cookie4Sided, Oval. These are not the exact Android
 * RoundedPolygon contours.
 */
const shapeRadius = (shape: number, angle: number): number => {
  switch (shape) {
    case 0:
      return 0.91 + 0.07 * Math.cos(10 * angle)
    case 1:
      return 0.91 + 0.08 * Math.cos(9 * angle - Math.PI / 2)
    case 2:
      return 0.87 + 0.12 * Math.cos(5 * angle - Math.PI / 2)
    case 3:
      return superellipseRadius(angle, 0.97, 0.80, 3.5)
    case 4:
      return 0.85 + 0.14 * Math.cos(8 * angle)
    case 5:
      return 0.83 + 0.16 * Math.cos(4 * angle)
    default:
      return superellipseRadius(angle + Math.PI / 4, 0.97, 0.67, 2)
  }
}

/** Clamps the requested footprint to Material's 24–240px range. */
export const normalizeSize = (size: number): number =>
  Number.isFinite(size) ? Math.min(240, Math.max(24, size)) : 48

/** SVG geometry sampled at one point of the loading animation. */
export interface Geometry {
  /** Closed path in a 48×48 viewBox; the active shape fits within 38×38. */
  path: string;
  /** Clockwise degrees; grows across cycles to avoid a rotation jump. */
  rotation: number;
}

/**
 * Computes the shape and rotation after `elapsed` milliseconds. A spring morph
 * advances every 650ms; rotation combines a 90° turn per morph with a separate
 * 360° turn every 4666ms.
 */
export const geometryAt = (elapsed: number): Geometry => {
  const time = Number.isFinite(elapsed) ? Math.max(0, elapsed) : 0
  const stage = Math.floor(time / MORPH_INTERVAL)
  const from = stage % SHAPE_COUNT
  const to = (from + 1) % SHAPE_COUNT
  const progress = spring(time % MORPH_INTERVAL / 1000)

  const points = Array.from({ length: POINT_COUNT }, (_, index) => {
    const angle = 2 * Math.PI * index / POINT_COUNT
    const radius = RADIUS * (
      shapeRadius(from, angle) * (1 - progress) + shapeRadius(to, angle) * progress
    )
    const x = CENTER + radius * Math.cos(angle)
    const y = CENTER + radius * Math.sin(angle)

    return `${index === 0 ? 'M' : 'L'}${x.toFixed(3)} ${y.toFixed(3)}`
  })

  return {
    path: `${points.join(' ')} Z`,
    rotation: time * 360 / ROTATION_DURATION + (stage + progress) * 90,
  }
}
