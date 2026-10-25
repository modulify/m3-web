import { expect, test } from 'vitest'

import {
  circularProgressGeometry,
  circularProgressSegments,
  circularProgressThickness,
  circularProgressWaveAmplitude,
  circularProgressWavePath,
  linearIndeterminateGeometry,
  linearProgressSegmentPath,
  progressSize,
  progressThickness,
  progressValue,
} from '../lib/progress'

test('progress inputs are constrained to visible and accessible ranges', () => {
  expect(progressValue(-12)).toBe(0)
  expect(progressValue(41.5)).toBe(41.5)
  expect(progressValue(180)).toBe(100)
  expect(progressValue(Number.NaN)).toBe(0)
  expect(progressSize(10)).toBe(24)
  expect(progressSize(300)).toBe(240)
  expect(progressThickness(0)).toBe(1)
})

test('circular track opens around active progress and disappears when complete', () => {
  const empty = circularProgressGeometry(40, 4, 0, false)
  const partial = circularProgressGeometry(40, 4, 1, false)
  const complete = circularProgressGeometry(40, 4, 100, false)

  expect(empty.activeLength).toBe(0)
  expect(empty.trackLength).toBe(100)
  expect(partial.activeLength).toBe(1)
  expect(partial.trackLength).toBeLessThan(100)
  expect(partial.trackOffset).toBeLessThan(-partial.activeLength)
  expect(partial.trackPath).toBe(partial.path)
  expect(partial.trackPath).toMatch(/^M 20 2 A /)
  expect(complete.activeLength).toBe(100)
  expect(complete.trackLength).toBe(0)
  expect(circularProgressSegments(87, partial.gap)).toMatchObject({
    activeLength: 87,
    trackLength: 0,
    trackOffset: -87 - partial.gap,
  })
})

test('wavy circular geometry keeps a closed wave inside its container', () => {
  const flat = circularProgressGeometry(48, 4, 50, false)
  const wavy = circularProgressGeometry(48, 4, 50, true)

  expect(wavy.path).not.toBe(flat.path)
  expect(wavy.trackPath).toMatch(/^M 24 3\.6/)
  expect(wavy.path.endsWith(' Z')).toBe(true)
  expect(wavy.radius + 1.6 + 2).toBeLessThanOrEqual(24)
})

test('circular geometry scales with its container unless thickness is explicit', () => {
  expect(circularProgressThickness(48, true)).toBe(4)
  expect(circularProgressThickness(96, true)).toBe(8)
  expect(circularProgressThickness(96, true, 4)).toBe(4)
  expect(circularProgressThickness(40, false)).toBe(4)
  expect(circularProgressThickness(80, false)).toBe(8)

  const small = circularProgressGeometry(48, 4, 50, true)
  const large = circularProgressGeometry(96, 8, 50, true)
  expect(large.radius).toBeCloseTo(small.radius * 2)
  expect(large.path.match(/ L /g)?.length).toBe(small.path.match(/ L /g)?.length)
})

test('determinate circular wave has a moving open arc and a flat endpoint', () => {
  const initial = circularProgressWavePath(48, 4, 40, 1, 0)
  const shifted = circularProgressWavePath(48, 4, 40, 1, .25)
  const completed = circularProgressWavePath(48, 4, 100, circularProgressWaveAmplitude(100))

  expect(initial).not.toBe(shifted)
  expect(initial.endsWith(' Z')).toBe(false)
  expect(completed.endsWith(' Z')).toBe(true)
  expect(circularProgressWaveAmplitude(40)).toBe(1)
  expect(circularProgressWaveAmplitude(10)).toBe(0)
  expect(circularProgressWaveAmplitude(95)).toBe(0)
})

test('indeterminate linear progress has two moving strokes and separate track segments', () => {
  const initial = linearIndeterminateGeometry(360, 4, 0)
  const middle = linearIndeterminateGeometry(360, 4, 875)

  expect(initial.active).toHaveLength(0)
  expect(initial.track).toEqual([{ start: 0, end: 360 }])
  expect(middle.active).toHaveLength(2)
  expect(middle.track.every(track => middle.active.every(active =>
    track.end <= active.start - 8 || track.start >= active.end + 8
  ))).toBe(true)

  const flat = linearProgressSegmentPath(middle.active[0], 4, false)
  const wave = linearProgressSegmentPath(middle.active[0], 10, true)
  const shifted = linearProgressSegmentPath(middle.active[0], 10, true, 10)
  expect(flat).toContain(' L ')
  expect(wave).not.toBe(shifted)
})
