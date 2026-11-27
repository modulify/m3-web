import {
  describe,
  expect,
  test,
  vi,
} from 'vitest'

import { addCloserListeners } from '../lib/popper/closer'
import {
  isDelay,
  isOverflowBehavior,
  isPlacement,
  isTriggerOptions,
} from '../lib/popper/predicates'
import Listener from '../lib/popper/Listener'
import { normalizeDelay } from '../lib/popper/scheduling'
import { removeCloserListeners } from '../lib/popper/closer'

describe('popper predicates', () => {
  test('accepts partial delay objects', () => {
    expect(isDelay({})).toBe(true)
    expect(isDelay({ show: 100 })).toBe(true)
    expect(isDelay({ hide: '200' })).toBe(true)
    expect(isDelay({ show: 'not-a-number' })).toBe(false)
  })

  test('accepts partial trigger schemas', () => {
    expect(isTriggerOptions({})).toBe(true)
    expect(isTriggerOptions({ show: ['hover'] })).toBe(true)
    expect(isTriggerOptions({ hide: ['click'] })).toBe(true)
    expect(isTriggerOptions({ show: ['invalid'] })).toBe(false)
  })

  test('checks finite sets of popper values', () => {
    expect(isPlacement('bottom-start')).toBe(true)
    expect(isPlacement('center')).toBe(false)
    expect(isOverflowBehavior(['flip', 'shift'])).toBe(true)
    expect(isOverflowBehavior(['flip', 'invalid'])).toBe(false)
  })
})

describe('popper trigger listener', () => {
  test('subscribes to show and hide triggers, then moves to a new target', () => {
    const first = new EventTarget()
    const second = new EventTarget()
    const show = vi.fn()
    const hide = vi.fn()
    const listener = new Listener(show, hide)

    listener.start(first, { show: ['focus'], hide: ['focus'] })
    first.dispatchEvent(new Event('focus'))
    first.dispatchEvent(new Event('blur'))

    expect(show).toHaveBeenCalledOnce()
    expect(hide).toHaveBeenCalledOnce()

    listener.target = second
    first.dispatchEvent(new Event('focus'))
    second.dispatchEvent(new Event('focus'))

    expect(listener.target).toBe(second)
    expect(show).toHaveBeenCalledTimes(2)

    listener.stop()
    second.dispatchEvent(new Event('focus'))
    expect(show).toHaveBeenCalledTimes(2)
  })

  test('updates triggers on an existing target and accepts a partial schema', () => {
    const target = new EventTarget()
    const show = vi.fn()
    const hide = vi.fn()
    const listener = new Listener(show, hide)

    listener.start(target, ['click'])
    target.dispatchEvent(new Event('click'))
    expect(show).toHaveBeenCalledOnce()
    expect(hide).toHaveBeenCalledOnce()

    listener.triggers = { show: ['hover'] }
    target.dispatchEvent(new Event('click'))
    target.dispatchEvent(new Event('mouseenter'))

    expect(listener.triggers).toEqual({ show: ['hover'], hide: [] })
    expect(show).toHaveBeenCalledTimes(2)
    expect(hide).toHaveBeenCalledOnce()

    listener.target = null
    target.dispatchEvent(new Event('mouseenter'))
    expect(show).toHaveBeenCalledTimes(2)
  })

  test('does not resubscribe for an unchanged target or trigger schema', () => {
    const target = new EventTarget()
    const add = vi.spyOn(target, 'addEventListener')
    const listener = new Listener(vi.fn(), vi.fn())

    listener.start(target, { show: ['click'] })
    listener.target = target
    listener.triggers = { show: ['click'], hide: [] }

    expect(add).toHaveBeenCalledTimes(1)
    listener.stop()
    listener.target = null
    listener.triggers = { show: ['focus'] }
    expect(add).toHaveBeenCalledTimes(1)
  })

  test('accepts a hide-only schema before a target is available', () => {
    const listener = new Listener(vi.fn(), vi.fn())
    listener.triggers = { hide: ['focus'] }

    expect(listener.triggers).toEqual({ show: [], hide: ['focus'] })
    expect(listener.target).toBeNull()
  })
})

describe('popper closer', () => {
  const touchEvent = (type: string, touches: Array<{ screenX: number; screenY: number }>) => {
    const event = new Event(type) as Event & {
      changedTouches: typeof touches;
      m3PopperClose?: boolean;
      m3PopperCloseAll?: boolean;
    }
    event.changedTouches = touches
    return event
  }

  test('keeps a multi-touch gesture from becoming a closer', () => {
    const target = new EventTarget() as EventTarget & { m3PopperCloseAll?: boolean }
    addCloserListeners(target as Parameters<typeof addCloserListeners>[0])

    const start = touchEvent('touchstart', [
      { screenX: 0, screenY: 0 },
      { screenX: 10, screenY: 0 },
    ])
    const end = touchEvent('touchend', [{ screenX: 0, screenY: 0 }])
    target.dispatchEvent(start)
    target.dispatchEvent(end)

    expect(end.m3PopperClose).toBeUndefined()
    removeCloserListeners(target as Parameters<typeof removeCloserListeners>[0])
  })

  test('ignores a multi-touch ending and propagates the close-all option', () => {
    const target = new EventTarget() as EventTarget & { m3PopperCloseAll?: boolean }
    target.m3PopperCloseAll = true
    addCloserListeners(target as Parameters<typeof addCloserListeners>[0])

    const start = touchEvent('touchstart', [{ screenX: 0, screenY: 0 }])
    const end = touchEvent('touchend', [
      { screenX: 0, screenY: 0 },
      { screenX: 10, screenY: 0 },
    ])
    target.dispatchEvent(start)
    target.dispatchEvent(end)
    expect(end.m3PopperClose).toBeUndefined()

    const click = new Event('click') as typeof end
    target.dispatchEvent(click)
    expect(click.m3PopperCloseAll).toBe(true)
    removeCloserListeners(target as Parameters<typeof removeCloserListeners>[0])
  })

  test('defaults touch closing to the current popper only', () => {
    const target = new EventTarget()
    addCloserListeners(target as Parameters<typeof addCloserListeners>[0])

    target.dispatchEvent(touchEvent('touchstart', [{ screenX: 5, screenY: 5 }]))
    const end = touchEvent('touchend', [{ screenX: 6, screenY: 5 }])
    target.dispatchEvent(end)

    expect(end.m3PopperClose).toBe(true)
    expect(end.m3PopperCloseAll).toBe(false)

    const click = new Event('click') as typeof end
    target.dispatchEvent(click)
    expect(click.m3PopperCloseAll).toBe(false)
    removeCloserListeners(target as Parameters<typeof removeCloserListeners>[0])
  })

  test('uses no hide delay when only the show delay is supplied', () => {
    expect(normalizeDelay({ show: 75 })).toEqual({ show: 75, hide: 0 })
  })
})

describe('global popper events', () => {
  test('deduplicates subscriptions and tolerates repeated removal', async () => {
    vi.resetModules()
    const document = new EventTarget()
    const window = new EventTarget()
    vi.stubGlobal('document', document)
    vi.stubGlobal('window', window)
    vi.stubGlobal('navigator', { userAgent: 'Desktop' })

    try {
      const events = await import('../lib/popper/globalEvents')
      const handler = vi.fn()

      events.on('click', handler)
      events.on('click', handler)
      window.dispatchEvent(new Event('click'))
      expect(handler).toHaveBeenCalledOnce()

      events.on('touchend', handler)
      window.dispatchEvent(new Event('touchend'))
      expect(handler).toHaveBeenCalledTimes(2)
      events.off('touchend', handler)

      events.off('click', vi.fn())
      events.off('click', handler)
      events.off('click', handler)
      window.dispatchEvent(new Event('click'))
      expect(handler).toHaveBeenCalledTimes(2)
    } finally {
      vi.unstubAllGlobals()
      vi.resetModules()
    }
  })

  test('can load without browser globals', async () => {
    vi.resetModules()
    vi.stubGlobal('document', undefined)
    vi.stubGlobal('window', undefined)

    try {
      await expect(import('../lib/popper/globalEvents')).resolves.toHaveProperty('on')
    } finally {
      vi.unstubAllGlobals()
      vi.resetModules()
    }
  })

  test('registers touch listeners in an iOS environment', async () => {
    vi.resetModules()
    const document = new EventTarget()
    const window = new EventTarget()
    const add = vi.spyOn(document, 'addEventListener')

    vi.stubGlobal('document', document)
    vi.stubGlobal('window', window)
    vi.stubGlobal('navigator', { userAgent: 'iPhone' })

    try {
      const events = await import('../lib/popper/globalEvents')
      const mousedown = vi.fn()
      events.on('mousedown', mousedown)
      document.dispatchEvent(new Event('touchstart'))

      expect(add).toHaveBeenCalledWith('touchstart', expect.any(Function), { passive: true, capture: true })
      expect(add).toHaveBeenCalledWith('touchend', expect.any(Function), { passive: true, capture: true })
      expect(mousedown).toHaveBeenCalledOnce()
    } finally {
      vi.unstubAllGlobals()
      vi.resetModules()
    }
  })
})
