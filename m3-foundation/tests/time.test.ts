import {
  closestSelectableMinute,
  dialHour,
  dialMinute,
  displayHour,
  hourFromDisplay,
  isTimeSelectable,
  pointAngle,
  resolveTimeFormat,
} from '../lib/time'

describe('time', () => {
  test('resolves a time format from locale unless explicitly selected', () => {
    expect(resolveTimeFormat('en-US')).toBe('12h')
    expect(resolveTimeFormat('ru-RU')).toBe('24h')
    expect(resolveTimeFormat('en-US', '24h')).toBe('24h')
  })

  test('converts midnight and noon without changing the stored 24-hour value', () => {
    expect(displayHour(0, '12h')).toBe(12)
    expect(displayHour(12, '12h')).toBe(12)
    expect(hourFromDisplay(12, 'AM', '12h')).toBe(0)
    expect(hourFromDisplay(12, 'PM', '12h')).toBe(12)
    expect(hourFromDisplay(7, 'PM', '12h')).toBe(19)
  })

  test('applies inclusive bounds and minute steps anchored at min', () => {
    const bounds = {
      min: { hour: 9, minute: 10 },
      max: { hour: 10, minute: 5 },
      step: 15,
    }

    expect(isTimeSelectable({ hour: 9, minute: 10 }, bounds)).toBe(true)
    expect(isTimeSelectable({ hour: 9, minute: 25 }, bounds)).toBe(true)
    expect(isTimeSelectable({ hour: 9, minute: 15 }, bounds)).toBe(false)
    expect(isTimeSelectable({ hour: 10, minute: 0 }, bounds)).toBe(false)
    expect(isTimeSelectable({ hour: 10, minute: 10 }, bounds)).toBe(false)
    expect(closestSelectableMinute(9, 20, bounds)).toBe(25)
    expect(closestSelectableMinute(8, 30, bounds)).toBeNull()
  })

  test('does not admit invalid configuration or a wrapping range', () => {
    expect(isTimeSelectable({ hour: 8, minute: 0 }, { step: 0 })).toBe(false)
    expect(isTimeSelectable({ hour: 8, minute: 0 }, {
      min: { hour: 10, minute: 0 },
      max: { hour: 8, minute: 0 },
    })).toBe(false)
  })

  test('rejects invalid bounds and finds a minute without an explicit schedule', () => {
    expect(isTimeSelectable({ hour: 7, minute: 30 })).toBe(true)
    expect(isTimeSelectable({ hour: 24, minute: 0 })).toBe(false)
    expect(isTimeSelectable({ hour: 7, minute: 30 }, { step: 1441 })).toBe(false)
    expect(isTimeSelectable({ hour: 7, minute: 30 }, {
      min: { hour: 25, minute: 0 },
    })).toBe(false)
    expect(isTimeSelectable({ hour: 7, minute: 30 }, {
      max: { hour: 25, minute: 0 },
    })).toBe(false)
    expect(closestSelectableMinute(7, 30)).toBe(30)
    expect(closestSelectableMinute(24, 30)).toBeNull()
  })

  test('maps dial angle and ring to hours and minutes', () => {
    expect(pointAngle(0, -1, 0, 0)).toBe(0)
    expect(pointAngle(1, 0, 0, 0)).toBe(90)
    expect(dialHour(0, false, '12h')).toBe(12)
    expect(dialHour(0, false, '24h')).toBe(0)
    expect(dialHour(0, true, '24h')).toBe(12)
    expect(dialHour(240, true, '24h')).toBe(20)
    expect(dialMinute(90)).toBe(15)
    expect(dialMinute(359)).toBe(0)
  })
})
import { describe, expect, test } from 'vitest'
