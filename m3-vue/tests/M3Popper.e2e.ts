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

const rect = (x: number, y: number, width: number, height: number): DOMRect => (
  DOMRect.fromRect({
    x,
    y,
    width,
    height,
  })
)

const parseTransform = (popper: HTMLElement) => {
  const match = popper.style.transform.match(/translate3d\(([-\d.]+)px,\s*([-\d.]+)px,\s*0px\)/)
  if (!match) {
    throw new Error(`Unexpected transform: ${popper.style.transform}`)
  }

  return {
    x: Number(match[1]),
    y: Number(match[2]),
  }
}

const expectY = (popper: HTMLElement, expectedY: number) => {
  const { y } = parseTransform(popper)
  expect(y).toBe(expectedY)
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
  let popper: HTMLElement | null = null

  await waitFor(() => {
    popper = document.body.querySelector('.m3-popper') as HTMLElement | null
    expect(popper).not.toBeNull()
  })

  return popper as HTMLElement
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
  const popper = await waitForPopper()

  vi.spyOn(target, 'getBoundingClientRect').mockReturnValue(rect(100, 50, 40, 20))
  return popper
}

const waitForShown = async (popper: HTMLElement, shown: boolean) => {
  await waitFor(() => {
    expect(popper.classList.contains('m3-popper_shown')).toBe(shown)
  })
}

// eslint-disable-next-line max-lines-per-function
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
    const popper = await setupGeometryCase(target as HTMLButtonElement)

    await (mounted as MountResult).setProps({
      offsetMainAxis: 10,
    })

    await waitFor(() => {
      expectY(popper, 80)
      expect(popper.style.position).toBe('absolute')
    })
  })
  test('applies cross axis offset for bottom placement', async () => {
    const popper = await setupGeometryCase(target as HTMLButtonElement)

    await (mounted as MountResult).setProps({
      offsetCrossAxis: 0,
    })

    let x0 = 0
    await waitFor(() => {
      x0 = parseTransform(popper).x
      expectY(popper, 70)
    })

    await (mounted as MountResult).setProps({
      offsetCrossAxis: 7,
    })

    await waitFor(() => {
      const { x, y } = parseTransform(popper)
      expect(y).toBe(70)
      expect(Math.round(x - x0)).toBe(7)
      expect(popper.style.position).toBe('absolute')
    })
  })

  test('changes geometry when placement switches from bottom to right', async () => {
    const popper = await setupGeometryCase(target as HTMLButtonElement)

    await (mounted as MountResult).setProps({
      placement: 'bottom',
      offsetMainAxis: 0,
      offsetCrossAxis: 0,
    })

    let bottomX = 0
    let bottomY = 0
    await waitFor(() => {
      const point = parseTransform(popper)
      bottomX = point.x
      bottomY = point.y
    })

    await (mounted as MountResult).setProps({
      placement: 'right',
      offsetMainAxis: 0,
      offsetCrossAxis: 0,
    })

    await waitFor(() => {
      const point = parseTransform(popper)
      expect(point.x).toBeGreaterThan(bottomX)
      expect(point.y).not.toBe(bottomY)
      expect(popper.style.position).toBe('absolute')
    })
  })

  test('applies main axis offset delta for top placement', async () => {
    const popper = await setupGeometryCase(target as HTMLButtonElement)

    await (mounted as MountResult).setProps({
      placement: 'top',
      offsetMainAxis: 0,
      offsetCrossAxis: 0,
    })

    let y0 = 0
    await waitFor(() => {
      y0 = parseTransform(popper).y
    })

    await (mounted as MountResult).setProps({
      placement: 'top',
      offsetMainAxis: 10,
      offsetCrossAxis: 0,
    })

    await waitFor(() => {
      const { y } = parseTransform(popper)
      expect(Math.round(Math.abs(y - y0))).toBe(10)
      expect(popper.style.position).toBe('absolute')
    })
  })

  test('closes when closer directive is used on a button inside popper', async () => {
    remountPopper({
      defaultSlot: () => withDirectives(h('button', {
        type: 'button',
        'data-testid': 'closer-button',
      }, 'Close'), [[vM3PopperCloser]]),
    })

    const popper = await waitForPopper()
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

    const popper = await waitForPopper()
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

    const popper = await waitForPopper()
    await waitForShown(popper, true)

    const button = document.body.querySelector('[data-testid="disabled-closer-button"]') as HTMLButtonElement

    button.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    button.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    await delay(80)
    await waitForShown(popper, true)
  })
})
