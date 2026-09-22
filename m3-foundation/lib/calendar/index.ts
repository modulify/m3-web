export type CalendarDateInitiator = [] | [Date] | [number, number, number?]
export interface CalendarDayData {
  readonly dayInMonth: number;
  readonly month: number;
  readonly year: number;
  readonly timestamp: number;
}
export type CalendarDayOrNull = CalendarDay | null
export type CalendarDayRange = [CalendarDayOrNull, CalendarDayOrNull]
export type CalendarDayBounds = [CalendarDayOrNull, CalendarDayOrNull]
export type CalendarYearRange = [number, number]
export interface CalendarAvailability {
  isDateSelectable?: (date: Date) => boolean;
  isYearSelectable?: (year: number) => boolean;
}

export const DEFAULT_CALENDAR_YEAR_RANGE: CalendarYearRange = [1900, 2100]
export const DEFAULT_CALENDAR_DATE_INPUT_FORMAT = 'MM/DD/YYYY'

const DAYS_IN_WEEK = 7
const WEEKS_IN_MONTH_GRID = 6
const YEARS_IN_DECADE_GRID = 12

const dateWithoutTime = (date = new Date()): Date => new Date(
  date.getFullYear(),
  date.getMonth(),
  date.getDate()
)

const createDate = (...options: CalendarDateInitiator): Date => {
  const [
    date,
  ] = options
  const [
    year,
    month,
    dayInMonth = 1,
  ] = options

  return date instanceof Date
    ? dateWithoutTime(date)
    : typeof year === 'number' && typeof month === 'number'
      ? new Date(year, month - 1, dayInMonth)
      : dateWithoutTime()
}

const normalizeDayOfWeek = (day: number): number => {
  const value = Math.trunc(day) % DAYS_IN_WEEK

  return value < 0 ? value + DAYS_IN_WEEK : value
}

const isValidDatePart = (year: number, month: number, dayInMonth: number): boolean => {
  const date = new Date(year, month - 1, dayInMonth)

  return date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === dayInMonth
}

const padDatePart = (value: number): string => String(value).padStart(2, '0')

export class CalendarDay {
  private readonly _date: Date

  constructor()
  constructor(day: CalendarDay)
  constructor(date: Date)
  constructor(year: number, month: number, dayInMonth?: number)
  constructor(...options: [CalendarDay] | CalendarDateInitiator) {
    const [
      date,
    ] = options

    this._date = date instanceof CalendarDay
      ? createDate(date.date)
      : createDate(...options as CalendarDateInitiator)
  }

  get date(): Date {
    return new Date(this._date)
  }

  get dayInMonth(): number {
    return this._date.getDate()
  }

  get dayInWeek(): number {
    return this._date.getDay()
  }

  get month(): number {
    return this._date.getMonth() + 1
  }

  get year(): number {
    return this._date.getFullYear()
  }

  get timestamp(): number {
    return this._date.getTime()
  }

  isAfter(day: unknown): boolean {
    return day instanceof CalendarDay && day.timestamp < this.timestamp
  }

  isBefore(day: unknown): boolean {
    return day instanceof CalendarDay && day.timestamp > this.timestamp
  }

  inSameDay(day: CalendarDayData): boolean {
    return day.dayInMonth === this.dayInMonth && this.inSameMonth(day)
  }

  inSameMonth(day: Pick<CalendarDayData, 'month' | 'year'>): boolean {
    return day.month === this.month && day.year === this.year
  }

  toString(): string {
    return this._date.toString()
  }
}

export function formatCalendarDateInput(day: CalendarDay | Date | null): string {
  if (day === null) {
    return ''
  }

  const calendarDay = day instanceof CalendarDay ? day : new CalendarDay(day)

  return [
    padDatePart(calendarDay.month),
    padDatePart(calendarDay.dayInMonth),
    calendarDay.year,
  ].join('/')
}

export function parseCalendarDateInput(value: string): CalendarDayOrNull {
  const normalized = value.trim()

  if (!normalized) {
    return null
  }

  const iso = normalized.match(/^(\d{4})[-./\s](\d{1,2})[-./\s](\d{1,2})$/)
  const local = normalized.match(/^(\d{1,2})[-./\s](\d{1,2})[-./\s](\d{4})$/)

  const [
    ,
    first,
    second,
    third,
  ] = iso ?? local ?? []

  if (!first || !second || !third) {
    return null
  }

  const year = iso ? Number(first) : Number(third)
  const month = iso ? Number(second) : Number(first)
  const dayInMonth = Number(iso ? third : second)

  return isValidDatePart(year, month, dayInMonth)
    ? new CalendarDay(year, month, dayInMonth)
    : null
}

export function getCalendarWeekDays(
  date: CalendarDay,
  firstDayOfWeek = 0
): CalendarDay[] {
  const firstDay = normalizeDayOfWeek(firstDayOfWeek)
  const offset = date.dayInWeek === 0 && firstDay > 0 ? DAYS_IN_WEEK : 0

  return Array.from({ length: DAYS_IN_WEEK }, (_, index) => new CalendarDay(
    date.year,
    date.month,
    date.dayInMonth - date.dayInWeek + index + firstDay - offset
  ))
}

export function getCalendarMonthWeeks(
  date: CalendarDay,
  firstDayOfWeek = 0
): CalendarDay[][] {
  return Array.from({ length: WEEKS_IN_MONTH_GRID }, (_, index) => getCalendarWeekDays(
    new CalendarDay(date.year, date.month, 1 + index * DAYS_IN_WEEK),
    firstDayOfWeek
  ))
}

export function getCalendarDecade(year: number): number[] {
  const first = year - (year % 10) - 1

  return Array.from({ length: YEARS_IN_DECADE_GRID }, (_, index) => index + first)
}

export function maxCalendarDay(a: unknown, b: unknown): CalendarDayOrNull {
  return a instanceof CalendarDay
    ? b instanceof CalendarDay
      ? a.isAfter(b)
        ? a
        : b
      : a
    : b instanceof CalendarDay
      ? b
      : null
}

export function minCalendarDay(a: unknown, b: unknown): CalendarDayOrNull {
  return a instanceof CalendarDay
    ? b instanceof CalendarDay
      ? a.isBefore(b)
        ? a
        : b
      : a
    : b instanceof CalendarDay
      ? b
      : null
}

export function clampCalendarDay(
  day: unknown,
  [
    min,
    max,
  ]: CalendarDayBounds
): CalendarDayOrNull {
  return day ? maxCalendarDay(minCalendarDay(day, max), min) : null
}

export function getNextCalendarDayRange(
  [
    start,
    end,
  ]: CalendarDayRange,
  day: CalendarDay
): CalendarDayRange {
  if ((start === null && end === null) || (start !== null && end !== null)) {
    return [day, null]
  }

  if (start !== null && (day.inSameDay(start) || day.isAfter(start))) {
    return [start, day]
  }

  return [day, null]
}

export function isCalendarDayInRange(
  day: CalendarDay,
  [
    start,
    end,
  ]: CalendarDayRange
): boolean {
  return start !== null &&
    end !== null &&
    (day.inSameDay(start) || day.isAfter(start)) &&
    (day.inSameDay(end) || day.isBefore(end))
}

export function isCalendarDayRangeStart(
  day: CalendarDay,
  [
    start,
  ]: CalendarDayRange
): boolean {
  return start?.inSameDay(day) ?? false
}

export function isCalendarDayRangeEnd(
  day: CalendarDay,
  [
    ,
    end,
  ]: CalendarDayRange
): boolean {
  return end?.inSameDay(day) ?? false
}

const monthTimestamp = (day: CalendarDay): number => new CalendarDay(day.year, day.month).timestamp

export function normalizeCalendarYearRange(
  range: unknown,
  fallback: CalendarYearRange = DEFAULT_CALENDAR_YEAR_RANGE
): CalendarYearRange {
  const [
    min,
    max,
  ] = Array.isArray(range) ? range : fallback

  const minYear = typeof min === 'number' && Number.isFinite(min)
    ? Math.trunc(min)
    : fallback[0]
  const maxYear = typeof max === 'number' && Number.isFinite(max)
    ? Math.trunc(max)
    : fallback[1]

  return minYear <= maxYear
    ? [minYear, maxYear]
    : [maxYear, minYear]
}

export function getCalendarBounds(
  yearRange: CalendarYearRange = DEFAULT_CALENDAR_YEAR_RANGE,
  min: CalendarDayOrNull = null,
  max: CalendarDayOrNull = null
): CalendarDayBounds {
  const [
    startYear,
    endYear,
  ] = normalizeCalendarYearRange(yearRange)
  const yearStart = new CalendarDay(startYear, 1, 1)
  const yearEnd = new CalendarDay(endYear, 12, 31)
  const start = maxCalendarDay(yearStart, min)
  const end = minCalendarDay(yearEnd, max)

  return start !== null && end !== null && start.isAfter(end)
    ? [end, end]
    : [start, end]
}

export function isCalendarMonthAvailable(
  month: CalendarDay,
  [
    min,
    max,
  ]: CalendarDayBounds
): boolean {
  const timestamp = monthTimestamp(month)

  return (min === null || timestamp >= monthTimestamp(min)) &&
    (max === null || timestamp <= monthTimestamp(max))
}

export function clampCalendarMonth(
  month: CalendarDay,
  bounds: CalendarDayBounds
): CalendarDay {
  const [
    min,
    max,
  ] = bounds

  if (min !== null && monthTimestamp(month) < monthTimestamp(min)) {
    return new CalendarDay(min.year, min.month, 1)
  }

  if (max !== null && monthTimestamp(month) > monthTimestamp(max)) {
    return new CalendarDay(max.year, max.month, 1)
  }

  return new CalendarDay(month.year, month.month, 1)
}

export function shiftCalendarMonth(
  month: CalendarDay,
  offset: number,
  bounds: CalendarDayBounds
): CalendarDay {
  return clampCalendarMonth(
    new CalendarDay(month.year, month.month + Math.trunc(offset), 1),
    bounds
  )
}

export function isPreviousCalendarMonthAvailable(
  month: CalendarDay,
  bounds: CalendarDayBounds
): boolean {
  return isCalendarMonthAvailable(new CalendarDay(month.year, month.month - 1, 1), bounds)
}

export function isNextCalendarMonthAvailable(
  month: CalendarDay,
  bounds: CalendarDayBounds
): boolean {
  return isCalendarMonthAvailable(new CalendarDay(month.year, month.month + 1, 1), bounds)
}

export function shiftCalendarYear(
  month: CalendarDay,
  offset: number,
  bounds: CalendarDayBounds
): CalendarDay {
  return setCalendarMonthYear(month, month.year + Math.trunc(offset), bounds)
}

export function isPreviousCalendarYearAvailable(
  month: CalendarDay,
  bounds: CalendarDayBounds
): boolean {
  return isCalendarMonthAvailable(new CalendarDay(month.year - 1, month.month, 1), bounds)
}

export function isNextCalendarYearAvailable(
  month: CalendarDay,
  bounds: CalendarDayBounds
): boolean {
  return isCalendarMonthAvailable(new CalendarDay(month.year + 1, month.month, 1), bounds)
}

export function getCalendarYears([
  min,
  max,
]: CalendarDayBounds): number[] {
  const start = min?.year ?? DEFAULT_CALENDAR_YEAR_RANGE[0]
  const end = max?.year ?? DEFAULT_CALENDAR_YEAR_RANGE[1]

  return Array.from({ length: end - start + 1 }, (_, index) => start + index)
}

export function isCalendarYearAvailable(
  year: number,
  [
    min,
    max,
  ]: CalendarDayBounds
): boolean {
  const start = new CalendarDay(year, 1, 1)
  const end = new CalendarDay(year, 12, 31)

  return (min === null || !end.isBefore(min)) && (max === null || !start.isAfter(max))
}

export function isCalendarDaySelectable(
  day: CalendarDay,
  availability: CalendarAvailability | null | undefined
): boolean {
  return availability?.isDateSelectable?.(day.date) ?? true
}

export function isCalendarYearSelectable(
  year: number,
  availability: CalendarAvailability | null | undefined
): boolean {
  return availability?.isYearSelectable?.(year) ?? true
}

export function setCalendarMonthYear(
  month: CalendarDay,
  year: number,
  bounds: CalendarDayBounds
): CalendarDay {
  return clampCalendarMonth(new CalendarDay(Math.trunc(year), month.month, 1), bounds)
}
