import {
  CalendarDay,
  clampCalendarDay,
  clampCalendarMonth,
  createDayFormatter,
  formatCalendarDateInput,
  getCalendarBounds,
  getCalendarDecade,
  getCalendarMonthWeeks,
  getCalendarWeekDays,
  getCalendarYears,
  getNextCalendarDayRange,
  isCalendarDayInRange,
  isCalendarDayRangeEnd,
  isCalendarDayRangeStart,
  isCalendarMonthAvailable,
  isCalendarYearAvailable,
  isNextCalendarMonthAvailable,
  isNextCalendarYearAvailable,
  isPreviousCalendarMonthAvailable,
  isPreviousCalendarYearAvailable,
  maxCalendarDay,
  minCalendarDay,
  normalizeCalendarYearRange,
  parseCalendarDateInput,
  setCalendarMonthYear,
  shiftCalendarMonth,
  shiftCalendarYear,
  toCalendarDateRange,
  toCalendarDayRange,
} from '../lib/calendar'

const formatDay = (day: CalendarDay): string => [
  day.year,
  String(day.month).padStart(2, '0'),
  String(day.dayInMonth).padStart(2, '0'),
].join('-')

const formatWeek = (week: CalendarDay[]): string[] => week.map(formatDay)

describe('calendar', () => {
  test('normalizes calendar days to local dates without time', () => {
    const source = new Date(2026, 6, 1, 18, 45, 32)
    const day = new CalendarDay(source)

    source.setFullYear(2020)

    expect(day.year).toBe(2026)
    expect(day.month).toBe(7)
    expect(day.dayInMonth).toBe(1)
    expect(day.date.getHours()).toBe(0)
    expect(day.date.getMinutes()).toBe(0)
    expect(day.date.getSeconds()).toBe(0)
  })

  test('builds week days from the requested first weekday', () => {
    expect(formatWeek(getCalendarWeekDays(new CalendarDay(2000, 1, 1), 1))).toEqual([
      '1999-12-27',
      '1999-12-28',
      '1999-12-29',
      '1999-12-30',
      '1999-12-31',
      '2000-01-01',
      '2000-01-02',
    ])

    expect(formatWeek(getCalendarWeekDays(new CalendarDay(2000, 1, 1), 0))).toEqual([
      '1999-12-26',
      '1999-12-27',
      '1999-12-28',
      '1999-12-29',
      '1999-12-30',
      '1999-12-31',
      '2000-01-01',
    ])
  })

  test('builds a stable six-week month grid', () => {
    const grid = getCalendarMonthWeeks(new CalendarDay(2000, 2), 1)

    expect(grid).toHaveLength(6)
    expect(grid.every(week => week.length === 7)).toBe(true)
    expect(formatWeek(grid[0])).toEqual([
      '2000-01-31',
      '2000-02-01',
      '2000-02-02',
      '2000-02-03',
      '2000-02-04',
      '2000-02-05',
      '2000-02-06',
    ])
    expect(formatWeek(grid[5])).toEqual([
      '2000-03-06',
      '2000-03-07',
      '2000-03-08',
      '2000-03-09',
      '2000-03-10',
      '2000-03-11',
      '2000-03-12',
    ])
  })

  test('compares calendar days by date', () => {
    const start = new CalendarDay(2000, 1, 1)
    const end = new CalendarDay(2000, 1, 30)

    expect(end.isAfter(start)).toBe(true)
    expect(start.isBefore(end)).toBe(true)
    expect(start.inSameDay(new CalendarDay(2000, 1, 1))).toBe(true)
    expect(start.inSameMonth(end)).toBe(true)
    expect(start.inSameMonth(new CalendarDay(2000, 2, 1))).toBe(false)
  })

  test('formats and parses date input values', () => {
    expect(formatCalendarDateInput(new CalendarDay(2026, 7, 5))).toBe('07/05/2026')
    expect(formatCalendarDateInput(null)).toBe('')

    expect(parseCalendarDateInput('07/05/2026')?.inSameDay(new CalendarDay(2026, 7, 5))).toBe(true)
    expect(parseCalendarDateInput('7-5-2026')?.inSameDay(new CalendarDay(2026, 7, 5))).toBe(true)
    expect(parseCalendarDateInput('2026-07-05')?.inSameDay(new CalendarDay(2026, 7, 5))).toBe(true)
    expect(parseCalendarDateInput('2026 7 5')?.inSameDay(new CalendarDay(2026, 7, 5))).toBe(true)
    expect(parseCalendarDateInput('02/31/2026')).toBeNull()
    expect(parseCalendarDateInput('not a date')).toBeNull()
  })

  test('formats calendar days with the supported locale-aware patterns', () => {
    const formatCalendarDay = createDayFormatter('en-US')
    const day = new CalendarDay(2026, 7, 5)

    expect(formatCalendarDay(day, 'MMMM yyyy')).toBe('July 2026')
    expect(formatCalendarDay(day, 'MMM')).toBe('Jul')
    expect(formatCalendarDay(day, 'yyyy')).toBe('2026')
    expect(formatCalendarDay(day, 'd MMM yyyy')).toBe('Jul 5, 2026')
  })

  test('converts between date and calendar day ranges', () => {
    const start = new Date(2026, 6, 5)
    const end = new Date(2026, 6, 12)
    const range = toCalendarDayRange([start, end])

    expect(range[0]?.inSameDay(new CalendarDay(start))).toBe(true)
    expect(range[1]?.inSameDay(new CalendarDay(end))).toBe(true)
    expect(toCalendarDateRange(range)).toEqual([start, end])
    expect(toCalendarDayRange(null)).toEqual([null, null])
  })

  test('resolves min, max, and clamped calendar days', () => {
    const min = new CalendarDay(2000, 1, 10)
    const max = new CalendarDay(2000, 1, 20)
    const before = new CalendarDay(2000, 1, 1)
    const inside = new CalendarDay(2000, 1, 15)
    const after = new CalendarDay(2000, 1, 30)

    expect(maxCalendarDay(before, after)?.inSameDay(after)).toBe(true)
    expect(minCalendarDay(before, after)?.inSameDay(before)).toBe(true)
    expect(clampCalendarDay(before, [min, max])?.inSameDay(min)).toBe(true)
    expect(clampCalendarDay(inside, [min, max])?.inSameDay(inside)).toBe(true)
    expect(clampCalendarDay(after, [min, max])?.inSameDay(max)).toBe(true)
    expect(clampCalendarDay(null, [min, max])).toBeNull()
  })

  test('resolves next selected calendar day range', () => {
    const start = new CalendarDay(2026, 7, 17)
    const end = new CalendarDay(2026, 7, 23)
    const earlier = new CalendarDay(2026, 7, 10)

    expect(getNextCalendarDayRange([null, null], start)).toEqual([start, null])
    expect(getNextCalendarDayRange([start, null], end)).toEqual([start, end])
    expect(getNextCalendarDayRange([start, end], earlier)).toEqual([earlier, null])
    expect(getNextCalendarDayRange([start, null], earlier)).toEqual([earlier, null])
    expect(getNextCalendarDayRange([start, null], start)).toEqual([start, start])
  })

  test('checks selected calendar day range membership', () => {
    const start = new CalendarDay(2026, 7, 17)
    const middle = new CalendarDay(2026, 7, 20)
    const end = new CalendarDay(2026, 7, 23)

    expect(isCalendarDayRangeStart(start, [start, end])).toBe(true)
    expect(isCalendarDayRangeEnd(end, [start, end])).toBe(true)
    expect(isCalendarDayInRange(start, [start, end])).toBe(true)
    expect(isCalendarDayInRange(middle, [start, end])).toBe(true)
    expect(isCalendarDayInRange(end, [start, end])).toBe(true)
    expect(isCalendarDayInRange(middle, [start, null])).toBe(false)
  })

  test('builds a twelve-year decade grid', () => {
    expect(getCalendarDecade(2026)).toEqual([
      2019,
      2020,
      2021,
      2022,
      2023,
      2024,
      2025,
      2026,
      2027,
      2028,
      2029,
      2030,
    ])
  })

  test('normalizes calendar year ranges', () => {
    expect(normalizeCalendarYearRange([2030, 2020])).toEqual([2020, 2030])
    expect(normalizeCalendarYearRange(['bad', 2020])).toEqual([1900, 2020])
  })

  test('resolves effective calendar bounds from years and date bounds', () => {
    const bounds = getCalendarBounds(
      [2020, 2030],
      new CalendarDay(2026, 7, 3),
      new CalendarDay(2026, 9, 24)
    )

    expect(bounds[0]?.inSameDay(new CalendarDay(2026, 7, 3))).toBe(true)
    expect(bounds[1]?.inSameDay(new CalendarDay(2026, 9, 24))).toBe(true)
  })

  test('checks and clamps calendar month navigation', () => {
    const bounds = getCalendarBounds(
      [2026, 2026],
      new CalendarDay(2026, 7, 3),
      new CalendarDay(2026, 9, 24)
    )
    const july = new CalendarDay(2026, 7)
    const august = new CalendarDay(2026, 8)
    const september = new CalendarDay(2026, 9)

    expect(isCalendarMonthAvailable(july, bounds)).toBe(true)
    expect(isPreviousCalendarMonthAvailable(july, bounds)).toBe(false)
    expect(isNextCalendarMonthAvailable(july, bounds)).toBe(true)
    expect(shiftCalendarMonth(july, 1, bounds).inSameMonth(august)).toBe(true)
    expect(isNextCalendarMonthAvailable(september, bounds)).toBe(false)
    expect(shiftCalendarMonth(september, 1, bounds).inSameMonth(september)).toBe(true)
    expect(clampCalendarMonth(new CalendarDay(2027, 1), bounds).inSameMonth(september)).toBe(true)
  })

  test('builds and checks available years', () => {
    const bounds = getCalendarBounds(
      [2025, 2027],
      new CalendarDay(2026, 7, 3),
      new CalendarDay(2027, 1, 24)
    )

    expect(getCalendarYears(bounds)).toEqual([2026, 2027])
    expect(isCalendarYearAvailable(2025, bounds)).toBe(false)
    expect(isCalendarYearAvailable(2026, bounds)).toBe(true)
    expect(isCalendarYearAvailable(2027, bounds)).toBe(true)
  })

  test('changes displayed year while preserving the month when possible', () => {
    const bounds = getCalendarBounds(
      [2026, 2027],
      new CalendarDay(2026, 7, 3),
      new CalendarDay(2027, 9, 24)
    )

    expect(setCalendarMonthYear(new CalendarDay(2026, 8), 2027, bounds).inSameMonth(new CalendarDay(2027, 8))).toBe(true)
    expect(setCalendarMonthYear(new CalendarDay(2026, 8), 2025, bounds).inSameMonth(new CalendarDay(2026, 7))).toBe(true)
    expect(isPreviousCalendarYearAvailable(new CalendarDay(2027, 8), bounds)).toBe(true)
    expect(isNextCalendarYearAvailable(new CalendarDay(2027, 8), bounds)).toBe(false)
    expect(shiftCalendarYear(new CalendarDay(2027, 8), -1, bounds).inSameMonth(new CalendarDay(2026, 8))).toBe(true)
  })
})
