import type {
  App,
  VNode,
} from 'vue'

import {
  createApp,
  h,
  nextTick,
  ref,
  withDirectives,
} from 'vue'

import {
  M3Popper,
  vM3PopperCloser,
} from '@/components/popper'

type PopperSide = 'top' | 'bottom' | 'left' | 'right'

const rect = (x: number, y: number, width: number, height: number): DOMRect => (
  DOMRect.fromRect({
    x,
    y,
    width,
    height,
  })
)

const parseTransform = (positioner: HTMLElement) => {
  const match = positioner.style.transform.match(/translate3d\(([-\d.]+)px,\s*([-\d.]+)px,\s*0px\)/)
  if (!match) {
    throw new Error(`Unexpected transform: ${positioner.style.transform}`)
  }

  return {
    x: Number(match[1]),
    y: Number(match[2]),
  }
}

const expectY = (positioner: HTMLElement, expectedY: number) => {
  const { y } = parseTransform(positioner)
  expect(y).toBe(expectedY)
}

const expectAnimationSide = (popper: HTMLElement, side: PopperSide) => {
  const expected = {
    top: {
      originX: 'center',
      originY: 'bottom',
      enterX: '0px',
      enterY: '-2px',
      scaleX: '0.995',
      scaleY: '0.72',
    },
    bottom: {
      originX: 'center',
      originY: 'top',
      enterX: '0px',
      enterY: '2px',
      scaleX: '0.995',
      scaleY: '0.72',
    },
    left: {
      originX: 'right',
      originY: 'center',
      enterX: '-2px',
      enterY: '0px',
      scaleX: '0.72',
      scaleY: '0.995',
    },
    right: {
      originX: 'left',
      originY: 'center',
      enterX: '2px',
      enterY: '0px',
      scaleX: '0.72',
      scaleY: '0.995',
    },
  }[side]

  expect(popper.classList.contains('m3-popper_animated')).toBe(true)
  expect(popper.style.getPropertyValue('--m3-popper-origin-x')).toBe(expected.originX)
  expect(popper.style.getPropertyValue('--m3-popper-origin-y')).toBe(expected.originY)
  expect(popper.style.getPropertyValue('--m3-popper-enter-x')).toBe(expected.enterX)
  expect(popper.style.getPropertyValue('--m3-popper-enter-y')).toBe(expected.enterY)
  expect(popper.style.getPropertyValue('--m3-popper-scale-x-hidden')).toBe(expected.scaleX)
  expect(popper.style.getPropertyValue('--m3-popper-scale-y-hidden')).toBe(expected.scaleY)
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const waitFor = async (assertion: () => void, timeoutMs = 1200) => {
  const startedAt = Date.now()
  let lastError: unknown

  while (Date.now() - startedAt < timeoutMs) {
    try {
      assertion()
      return
    } catch (error) {
      lastError = error
      await delay(10)
    }
  }

  throw lastError ?? new Error('waitFor timeout')
}

const waitForPopper = async () => {
  let positioner: HTMLElement | null = null
  let popper: HTMLElement | null = null

  await waitFor(() => {
    positioner = document.body.querySelector('.m3-popper-positioner') as HTMLElement | null
    popper = document.body.querySelector('.m3-popper') as HTMLElement | null
    expect(positioner).not.toBeNull()
    expect(popper).not.toBeNull()
  })

  const getElement = (element: HTMLElement | null): HTMLElement => {
    expect(element).not.toBeNull()

    return element as HTMLElement
  }

  return {
    positioner: getElement(positioner),
    popper: getElement(popper),
  }
}

type MountResult = {
  app: App;
  mountPoint: HTMLDivElement;
  setProps: (nextProps: Record<string, unknown>) => Promise<void>;
}

type MountOptions = {
  defaultSlot?: () => VNode | VNode[];
}

type VueComponentLike = Parameters<typeof h>[0]

const createProps = (target: HTMLElement) => ref<Record<string, unknown>>({
  target: () => target,
  shown: true,
  placement: 'bottom',
  overflow: [],
  offsetMainAxis: 0,
  offsetCrossAxis: 0,
  detachTimeout: null,
})

const createSetProps = (props: ReturnType<typeof createProps>) => {
  return async (nextProps: Record<string, unknown>) => {
    props.value = {
      ...props.value,
      ...nextProps,
    }

    await nextTick()
    await delay(0)
  }
}

const mountPopper = (target: HTMLElement, options: MountOptions = {}): MountResult => {
  const mountPoint = document.createElement('div')
  document.body.append(mountPoint)

  const props = createProps(target)
  const setProps = createSetProps(props)

  const app = createApp({
    setup () {
      const defaultSlot = options.defaultSlot ?? (() => h('div', 'Popper content'))

      return () => h(M3Popper as VueComponentLike, props.value, {
        default: defaultSlot,
      })
    },
  })

  app.mount(mountPoint)

  return {
    app,
    mountPoint,
    setProps,
  }
}

const createTarget = () => {
  const target = document.createElement('button')
  document.body.append(target)
  return target
}

const setupGeometryCase = async (target: HTMLButtonElement) => {
  const elements = await waitForPopper()

  vi.spyOn(target, 'getBoundingClientRect').mockReturnValue(rect(100, 50, 40, 20))
  return elements
}

const waitForShown = async (popper: HTMLElement, shown: boolean) => {
  await waitFor(() => {
    expect(popper.classList.contains('m3-popper_shown')).toBe(shown)
  })
}

describe('m3-vue/popper e2e', () => {
  let target: HTMLButtonElement | null = null
  let mounted: MountResult | null = null

  const remountPopper = (options: MountOptions = {}) => {
    mounted?.app.unmount()
    mounted?.mountPoint.remove()
    mounted = null

    target?.remove()
    target = createTarget()
    mounted = mountPopper(target, options)
  }

  beforeEach(() => {
    remountPopper()
  })
  afterEach(() => {
    mounted?.app.unmount()
    mounted?.mountPoint.remove()
    mounted = null
    target?.remove()
    target = null
    vi.restoreAllMocks()
  })
  test('applies bottom placement geometry with main axis offset', async () => {
    const {
      popper,
      positioner,
    } = await setupGeometryCase(target as HTMLButtonElement)

    await (mounted as MountResult).setProps({
      offsetMainAxis: 10,
    })

    await waitFor(() => {
      expectY(positioner, 80)
      expect(positioner.style.position).toBe('absolute')
      expect(popper.classList.contains('m3-popper_animated')).toBe(false)
      expect(popper.style.getPropertyValue('--m3-popper-enter-x')).toBe('')
      expect(popper.style.getPropertyValue('--m3-popper-enter-y')).toBe('')
      expect(popper.style.getPropertyValue('--m3-popper-scale-x-hidden')).toBe('')
      expect(popper.style.getPropertyValue('--m3-popper-scale-y-hidden')).toBe('')
    })
  })
  test('applies cross axis offset for bottom placement', async () => {
    const {
      popper,
      positioner,
    } = await setupGeometryCase(target as HTMLButtonElement)

    await (mounted as MountResult).setProps({
      offsetCrossAxis: 0,
    })

    let x0 = 0
    await waitFor(() => {
      x0 = parseTransform(positioner).x
      expectY(positioner, 70)
    })

    await (mounted as MountResult).setProps({
      offsetCrossAxis: 7,
    })

    await waitFor(() => {
      const { x, y } = parseTransform(positioner)
      expect(y).toBe(70)
      expect(Math.round(x - x0)).toBe(7)
      expect(positioner.style.position).toBe('absolute')
    })
  })

  test('does not capture pointer events after hiding while still attached', async () => {
    const { positioner, popper } = await waitForPopper()

    await waitFor(() => {
      expect(popper.classList.contains('m3-popper_shown')).toBe(true)
      expect(getComputedStyle(positioner).pointerEvents).toBe('none')
      expect(getComputedStyle(popper).pointerEvents).toBe('auto')
    })

    await (mounted as MountResult).setProps({
      shown: false,
    })

    await waitFor(() => {
      expect(document.body.contains(positioner)).toBe(true)
      expect(popper.classList.contains('m3-popper_shown')).toBe(false)
      expect(getComputedStyle(positioner).pointerEvents).toBe('none')
      expect(getComputedStyle(popper).pointerEvents).toBe('none')
    })
  })

  test('changes geometry when placement switches from bottom to right', async () => {
    const {
      popper,
      positioner,
    } = await setupGeometryCase(target as HTMLButtonElement)

    await (mounted as MountResult).setProps({
      placement: 'bottom',
      offsetMainAxis: 0,
      offsetCrossAxis: 0,
      animated: true,
    })

    let bottomX = 0
    let bottomY = 0
    await waitFor(() => {
      const point = parseTransform(positioner)
      bottomX = point.x
      bottomY = point.y
      expectAnimationSide(popper, 'bottom')
    })

    await (mounted as MountResult).setProps({
      placement: 'right',
      offsetMainAxis: 0,
      offsetCrossAxis: 0,
      animated: true,
    })

    await waitFor(() => {
      const point = parseTransform(positioner)
      expect(point.x).toBeGreaterThan(bottomX)
      expect(point.y).not.toBe(bottomY)
      expectAnimationSide(popper, 'right')
    })
  })

  test('applies main axis offset delta for top placement', async () => {
    const {
      popper,
      positioner,
    } = await setupGeometryCase(target as HTMLButtonElement)

    await (mounted as MountResult).setProps({
      placement: 'top',
      offsetMainAxis: 0,
      offsetCrossAxis: 0,
      animated: true,
    })

    let y0 = 0
    await waitFor(() => {
      y0 = parseTransform(positioner).y
    })

    await (mounted as MountResult).setProps({
      placement: 'top',
      offsetMainAxis: 10,
      offsetCrossAxis: 0,
    })

    await waitFor(() => {
      const { y } = parseTransform(positioner)
      expect(Math.round(Math.abs(y - y0))).toBe(10)
      expect(positioner.style.position).toBe('absolute')
      expectAnimationSide(popper, 'top')
    })
  })

  test('updates animation direction after flip when bottom placement has no space', async () => {
    const { popper } = await setupGeometryCase(target as HTMLButtonElement)

    await (mounted as MountResult).setProps({
      placement: 'bottom',
      overflow: ['flip'],
      offsetMainAxis: 0,
      offsetCrossAxis: 0,
      animated: true,
    })

    vi.spyOn(target as HTMLButtonElement, 'getBoundingClientRect').mockReturnValue(rect(100, window.innerHeight - 12, 40, 20))

    await (mounted as MountResult).setProps({
      placement: 'bottom',
      overflow: ['flip'],
      offsetMainAxis: 0,
      offsetCrossAxis: 0,
      animated: true,
    })

    await waitFor(() => {
      expectAnimationSide(popper, 'top')
    })
  })

  test('applies animation vectors for left placement', async () => {
    const { popper } = await setupGeometryCase(target as HTMLButtonElement)

    await (mounted as MountResult).setProps({
      placement: 'left',
      overflow: [],
      offsetMainAxis: 0,
      offsetCrossAxis: 0,
      animated: true,
    })

    await waitFor(() => {
      expectAnimationSide(popper, 'left')
    })
  })

  test('closes when closer directive is used on a button inside popper', async () => {
    remountPopper({
      defaultSlot: () => withDirectives(h('button', {
        type: 'button',
        'data-testid': 'closer-button',
      }, 'Close'), [[vM3PopperCloser]]),
    })

    const { popper } = await waitForPopper()
    await waitForShown(popper, true)

    const button = document.body.querySelector('[data-testid="closer-button"]') as HTMLButtonElement

    button.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    button.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    await waitForShown(popper, false)
  })

  test('closes when closer directive is used on a menu item inside popper', async () => {
    remountPopper({
      defaultSlot: () => withDirectives(h('div', {
        role: 'menuitem',
        tabindex: 0,
        'data-testid': 'menu-item-closer',
      }, 'Menu item'), [[vM3PopperCloser, true, undefined, { all: true }]]),
    })

    const { popper } = await waitForPopper()
    await waitForShown(popper, true)

    const menuItem = document.body.querySelector('[data-testid="menu-item-closer"]') as HTMLDivElement

    menuItem.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    menuItem.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    await waitForShown(popper, false)
  })

  test('does not close when closer directive is explicitly disabled', async () => {
    remountPopper({
      defaultSlot: () => withDirectives(h('button', {
        type: 'button',
        'data-testid': 'disabled-closer-button',
      }, 'No close'), [[vM3PopperCloser, false]]),
    })

    const { popper } = await waitForPopper()
    await waitForShown(popper, true)

    const button = document.body.querySelector('[data-testid="disabled-closer-button"]') as HTMLButtonElement

    button.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    button.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    await delay(80)
    await waitForShown(popper, true)
  })
})
