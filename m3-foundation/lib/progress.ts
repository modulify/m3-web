export const progressValue = (value: number): number =>
  Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 0

export const progressSize = (size: number): number =>
  Number.isFinite(size) ? Math.min(240, Math.max(24, size)) : 40

export const progressThickness = (thickness: number): number =>
  Number.isFinite(thickness) ? Math.max(1, thickness) : 4

export const circularProgressThickness = (size: number, wavy: boolean, thickness?: number): number =>
  progressThickness(thickness ?? 4 * size / (wavy ? 48 : 40))

export const circularProgressWaveAmplitude = (value: number): number =>
  value <= 10 || value >= 95 ? 0 : 1

export const circularProgressWavePath = (
  size: number,
  thickness: number,
  value: number,
  amplitude = 1,
  phase = 0
): string => {
  const maximumAmplitude = 1.6 * size / 48
  const radius = Math.max(1, size / 2 - thickness / 2 - maximumAmplitude)
  const waves = Math.max(3, Math.round(2 * Math.PI * radius / (15 * size / 48)))
  const fraction = progressValue(value) / 100
  const segments = Math.max(1, Math.ceil(waves * 24 * fraction))
  const center = size / 2
  const points = Array.from({ length: segments + 1 }, (_, index) => {
    const angle = 2 * Math.PI * fraction * index / segments
    const waveRadius = radius + maximumAmplitude * amplitude * Math.sin(waves * angle + 2 * Math.PI * phase)
    const x = center + waveRadius * Math.sin(angle)
    const y = center - waveRadius * Math.cos(angle)
    return `${index === 0 ? 'M' : 'L'} ${x.toFixed(3)} ${y.toFixed(3)}`
  })

  return `${points.join(' ')}${fraction === 1 ? ' Z' : ''}`
}

export interface CircularProgressSegments {
  activeLength: number;
  trackLength: number;
  trackOffset: number;
}

export interface CircularProgressGeometry extends CircularProgressSegments {
  path: string;
  trackPath: string;
  radius: number;
  gap: number;
}

export const circularProgressSegments = (value: number, gap: number): CircularProgressSegments => {
  const progress = progressValue(value)
  const activeLength = progress === 0 ? 0 : Math.max(progress, .01)
  const trackLength = progress === 0 ? 100 : Math.max(0, 100 - activeLength - 2 * gap)
  const trackOffset = progress === 0 ? 0 : -activeLength - gap

  return { activeLength, trackLength, trackOffset }
}

export const circularProgressGeometry = (
  size: number,
  thickness: number,
  value: number,
  wavy: boolean
): CircularProgressGeometry => {
  const amplitude = wavy ? 1.6 * size / 48 : 0
  const radius = Math.max(1, size / 2 - thickness / 2 - amplitude)
  const circumference = 2 * Math.PI * radius
  const gap = (4 + thickness) / circumference * 100
  const segments = circularProgressSegments(value, gap)
  const center = size / 2
  const trackPath = `M ${center} ${center - radius} A ${radius} ${radius} 0 1 1 ${center} ${center + radius} A ${radius} ${radius} 0 1 1 ${center} ${center - radius}`

  if (!wavy) {
    return {
      path: trackPath,
      trackPath,
      radius,
      gap,
      ...segments,
    }
  }

  return {
    path: circularProgressWavePath(size, thickness, 100),
    trackPath,
    radius,
    gap,
    ...segments,
  }
}

// A single path avoids seams where repeated SVG pattern tiles meet at high pixel density.
export const linearProgressWavePath = (height: number): string => {
  const middle = height / 2
  const segments = 410 // Covers 8,200px, including the 40px animation offset.
  const commands = [`M 0 ${middle}`]

  for (let index = 0; index < segments; index++) {
    const start = index * 20
    commands.push(`Q ${start + 10} ${middle + (index % 2 ? 6 : -6)} ${start + 20} ${middle}`)
  }

  return commands.join(' ')
}

export interface ProgressInterval {
  start: number;
  end: number;
}

export interface LinearIndeterminateGeometry {
  active: ProgressInterval[];
  track: ProgressInterval[];
}

const emphasizedAccelerate = (progress: number): number => {
  let start = 0
  let end = 1

  for (let index = 0; index < 12; index++) {
    const middle = (start + end) / 2
    const inverse = 1 - middle
    const x = 3 * inverse * inverse * middle * .3 + 3 * inverse * middle * middle * .8 + middle ** 3

    if (x < progress) start = middle
    else end = middle
  }

  const position = (start + end) / 2
  const inverse = 1 - position
  return 3 * inverse * position * position * .15 + position ** 3
}

const linearMotionPosition = (time: number, delay: number, duration: number): number => {
  if (time <= delay) return 0
  if (time >= delay + duration) return 1
  return emphasizedAccelerate((time - delay) / duration)
}

export const linearIndeterminateGeometry = (
  width: number,
  thickness: number,
  time: number
): LinearIndeterminateGeometry => {
  const cycle = ((time % 1750) + 1750) % 1750
  const candidates = [
    { start: linearMotionPosition(cycle, 250, 1000) * width, end: linearMotionPosition(cycle, 0, 1000) * width },
    { start: linearMotionPosition(cycle, 900, 850) * width, end: linearMotionPosition(cycle, 650, 850) * width },
  ]
  const active = candidates
    .map(({ start, end }) => ({ start: Math.max(0, Math.min(width, start)), end: Math.max(0, Math.min(width, end)) }))
    .filter(({ start, end }) => end - start > .01)
    .sort((first, second) => first.start - second.start)
  const merged: ProgressInterval[] = []

  for (const segment of active) {
    const previous = merged.at(-1)
    if (previous && segment.start <= previous.end) previous.end = Math.max(previous.end, segment.end)
    else merged.push({ ...segment })
  }

  const track: ProgressInterval[] = []
  const gap = thickness + 4
  let cursor = 0

  for (const segment of merged) {
    const end = Math.max(cursor, segment.start - gap)
    if (end - cursor >= thickness) track.push({ start: cursor, end })
    cursor = Math.max(cursor, segment.end + gap)
  }

  if (width - cursor >= thickness) track.push({ start: cursor, end: width })

  return { active: merged, track }
}

export const linearProgressSegmentPath = (
  interval: ProgressInterval,
  height: number,
  wavy: boolean,
  phase = 0
): string => {
  const { start, end } = interval
  const middle = height / 2
  if (!wavy) return `M ${start.toFixed(3)} ${middle} L ${end.toFixed(3)} ${middle}`

  const steps = Math.max(1, Math.ceil((end - start) / 4))
  const points = Array.from({ length: steps + 1 }, (_, index) => {
    const x = start + (end - start) * index / steps
    const y = middle + 3 * Math.sin(2 * Math.PI * (x + phase) / 40)
    return `${index === 0 ? 'M' : 'L'} ${x.toFixed(3)} ${y.toFixed(3)}`
  })

  return points.join(' ')
}
