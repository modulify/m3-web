export const durations = {
  short1: 50,
  short2: 100,
  short3: 150,
  short4: 200,
  medium1: 250,
  medium2: 300,
  medium3: 350,
  medium4: 400,
  long1: 450,
  long2: 500,
  long3: 550,
  long4: 600,
  'extra-long1': 700,
  'extra-long2': 800,
  'extra-long3': 900,
  'extra-long4': 1000,
} as const

export type M3MotionDuration = keyof typeof durations

export const easing = {
  emphasized: 'cubic-bezier(0.2, 0.0, 0, 1.0)',
  'emphasized-accelerate': 'cubic-bezier(0.3, 0.0, 0.8, 0.15)',
  'emphasized-decelerate': 'cubic-bezier(0.05, 0.7, 0.1, 1.0)',
  standard: 'cubic-bezier(0.2, 0.0, 0, 1.0)',
  'standard-accelerate': 'cubic-bezier(0.3, 0, 1, 1)',
  'standard-decelerate': 'cubic-bezier(0, 0, 0, 1)',
} as const

export type M3MotionEasing = keyof typeof easing

export const timing = {
  emphasized: {
    duration: 'long2',
    easing: 'emphasized',
  },
  'emphasized-accelerate': {
    duration: 'short4',
    easing: 'emphasized-accelerate',
  },
  'emphasized-decelerate': {
    duration: 'medium4',
    easing: 'emphasized-decelerate',
  },
  standard: {
    duration: 'medium2',
    easing: 'standard',
  },
  'standard-accelerate': {
    duration: 'short4',
    easing: 'standard-accelerate',
  },
  'standard-decelerate': {
    duration: 'medium1',
    easing: 'standard-decelerate',
  },
} as const satisfies Record<M3MotionEasing, {
  duration: M3MotionDuration;
  easing: M3MotionEasing;
}>
