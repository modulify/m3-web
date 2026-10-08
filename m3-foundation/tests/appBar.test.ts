import { describe, expect, it } from 'vitest'

import { getAppBarScrollState, getFlexibleAppBarHeight } from '../lib/appBar'

describe('getAppBarScrollState', () => {
  it('separates scroll-under from hiding', () => {
    expect(getAppBarScrollState(0, 20, false, 'pinned')).toEqual({ under: true, hidden: false, collapsed: false })
    expect(getAppBarScrollState(20, 30, false, 'hide')).toEqual({ under: true, hidden: true, collapsed: false })
    expect(getAppBarScrollState(30, 20, true, 'hide')).toEqual({ under: true, hidden: false, collapsed: false })
    expect(getAppBarScrollState(20, 0, true, 'hide')).toEqual({ under: false, hidden: false, collapsed: false })
  })

  it('collapses flexible bars while the page is away from the top', () => {
    expect(getAppBarScrollState(0, 1, false, 'collapse')).toEqual({ under: true, hidden: false, collapsed: true })
    expect(getAppBarScrollState(30, 0, false, 'collapse')).toEqual({ under: false, hidden: false, collapsed: false })
  })

  it('lets multi-line flexible content grow past its nominal minimum', () => {
    expect(getFlexibleAppBarHeight('medium-flexible', false, 48)).toBe(112)
    expect(getFlexibleAppBarHeight('medium-flexible', true, 100)).toBe(156)
    expect(getFlexibleAppBarHeight('large-flexible', true, 124)).toBe(180)
  })
})
