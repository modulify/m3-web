import type { App } from 'vue'

import {
  createApp,
  h,
  nextTick,
  ref,
} from 'vue'

import { M3Popper } from '@/components/popper'

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

const mountPopper = (target: HTMLElement): MountResult => {
  const mountPoint = document.createElement('div')
  document.body.append(mountPoint)

  const props = createProps(target)
  const setProps = createSetProps(props)

  const app = createApp({
    setup () {
      return () => h(M3Popper as VueComponentLike, props.value, {
        default: () => h('div', 'Popper content'),
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

const setupGeometryCase = async (mounted: MountResult, target: HTMLButtonElement) => {
  const popper = await waitForPopper()

  vi.spyOn(target, 'getBoundingClientRect').mockReturnValue(rect(100, 50, 40, 20))
  return popper
}

// eslint-disable-next-line max-lines-per-function
describe('m3-vue/popper e2e', () => {
  let target: HTMLButtonElement | null = null
  let mounted: MountResult | null = null
  beforeEach(() => {
    target = createTarget()
    mounted = mountPopper(target)
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
    const popper = await setupGeometryCase(mounted as MountResult, target as HTMLButtonElement)

    await (mounted as MountResult).setProps({
      offsetMainAxis: 10,
    })

    await waitFor(() => {
      expectY(popper, 80)
      expect(popper.style.position).toBe('absolute')
    })
  })
  test('applies cross axis offset for bottom placement', async () => {
    const popper = await setupGeometryCase(mounted as MountResult, target as HTMLButtonElement)

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
})
