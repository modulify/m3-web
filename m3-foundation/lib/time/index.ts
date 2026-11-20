export interface TimeValue {
  hour: number;
  minute: number;
}

export interface TimeBounds {
  min?: TimeValue | null;
  max?: TimeValue | null;
  step?: number;
}

export type TimeFormat = '12h' | '24h'

const MINUTES_PER_HOUR = 60
const HOURS_PER_DAY = 24
const MINUTES_PER_DAY = HOURS_PER_DAY * MINUTES_PER_HOUR
const DEGREES_PER_HOUR = 360 / 12
const DEGREES_PER_MINUTE = 360 / MINUTES_PER_HOUR

export const isTimeValue = (value: TimeValue): boolean => (
  Number.isInteger(value.hour) &&
  Number.isInteger(value.minute) &&
  value.hour >= 0 &&
  value.hour < HOURS_PER_DAY &&
  value.minute >= 0 &&
  value.minute < MINUTES_PER_HOUR
)

export const timeToMinutes = (value: TimeValue): number => (
  value.hour * MINUTES_PER_HOUR + value.minute
)

export const resolveTimeFormat = (locale: string, format?: TimeFormat): TimeFormat => {
  if (format) return format

  const cycle = new Intl.DateTimeFormat(locale, { hour: 'numeric' }).resolvedOptions().hourCycle
  return cycle === 'h11' || cycle === 'h12' ? '12h' : '24h'
}

export const displayHour = (hour: number, format: TimeFormat): number => (
  format === '24h' ? hour : hour % 12 || 12
)

export const hourFromDisplay = (hour: number, period: 'AM' | 'PM', format: TimeFormat): number => (
  format === '24h' ? hour : hour % 12 + (period === 'PM' ? 12 : 0)
)

export const isTimeSelectable = (value: TimeValue, bounds: TimeBounds = {}): boolean => {
  if (!isTimeValue(value)) return false

  const { min, max, step = 1 } = bounds
  if (!Number.isInteger(step) || step < 1 || step > MINUTES_PER_DAY) return false
  if (min && !isTimeValue(min)) return false
  if (max && !isTimeValue(max)) return false

  const minimum = min ? timeToMinutes(min) : 0
  const maximum = max ? timeToMinutes(max) : MINUTES_PER_DAY - 1
  const minute = timeToMinutes(value)

  return minimum <= maximum &&
    minute >= minimum &&
    minute <= maximum &&
    (minute - minimum) % step === 0
}

export const closestSelectableMinute = (
  hour: number,
  minute: number,
  bounds: TimeBounds = {}
): number | null => {
  if (!Number.isInteger(hour) || hour < 0 || hour >= HOURS_PER_DAY) return null

  let closest: number | null = null

  for (let candidate = 0; candidate < MINUTES_PER_HOUR; candidate++) {
    if (!isTimeSelectable({ hour, minute: candidate }, bounds)) continue

    if (closest === null || Math.abs(candidate - minute) < Math.abs(closest - minute)) {
      closest = candidate
    }
  }

  return closest
}

export const dialHour = (angle: number, inner: boolean, format: TimeFormat): number => {
  const index = ((Math.round(angle / DEGREES_PER_HOUR) % 12) + 12) % 12
  return format === '24h' ? index + (inner ? 12 : 0) : index || 12
}

export const dialMinute = (angle: number): number => (
  ((Math.round(angle / DEGREES_PER_MINUTE) % MINUTES_PER_HOUR) + MINUTES_PER_HOUR) % MINUTES_PER_HOUR
)

export const pointAngle = (x: number, y: number, centerX: number, centerY: number): number => (
  (Math.atan2(x - centerX, centerY - y) * 180 / Math.PI + 360) % 360
)
