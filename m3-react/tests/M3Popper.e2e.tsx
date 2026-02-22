import type {
  M3PopperMethods,
} from '@/components/popper'

import {
  act,
  render,
  waitFor,
} from '@testing-library/react'

import { createRef } from 'react'

import { M3Popper } from '@/components/popper'

type PopperSide = 'top' | 'bottom' | 'left' | 'right'

const rect = (x: number, y: number, width: number, height: number): DOMRect => (
  DOMRect.fromRect({
    x,
    y,
    width,
    height,
  })
)

const expectedX = (popper: HTMLElement, offsetCrossAxis = 0) => {
  const { width } = popper.getBoundingClientRect()
  return Math.round(100 + 20 - width / 2 + offsetCrossAxis)
}

const expectTransform = (positioner: HTMLElement, x: number, y: number) => {
  expect(positioner.style.transform).toMatch(new RegExp(`^translate3d\\(${x}px,\\s*${y}px,\\s*0px\\)$`))
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

const waitForPopper = async () => {
  await waitFor(() => {
    expect(document.body.querySelector('.m3-popper-positioner')).not.toBeNull()
    expect(document.body.querySelector('.m3-popper')).not.toBeNull()
  })

  return {
    positioner: document.body.querySelector('.m3-popper-positioner') as HTMLElement,
    popper: document.body.querySelector('.m3-popper') as HTMLElement,
  }
}

describe('m3-react/popper e2e', () => {
  let target: HTMLButtonElement | null = null
  let unmount: null | (() => void) = null

  afterEach(() => {
    unmount?.()
    unmount = null
    target?.remove()
    target = null
    vi.restoreAllMocks()
  })

  test('applies bottom placement geometry with main axis offset', async () => {
    target = document.createElement('button')
    document.body.append(target)

    const popperRef = createRef<M3PopperMethods>()

    const mounted = render(
      <M3Popper
        ref={popperRef}
        target={target}
        shown={true}
        placement="bottom"
        overflow={[]}
        offsetMainAxis={10}
        offsetCrossAxis={0}
        detachTimeout={null}
      >
        <div>
          Popper content
        </div>
      </M3Popper>
    )
    unmount = mounted.unmount

    const { positioner, popper } = await waitForPopper()

    vi.spyOn(target, 'getBoundingClientRect').mockReturnValue(rect(100, 50, 40, 20))
    const x = expectedX(popper)

    await act(async () => {
      await popperRef.current?.adjust()
    })

    await waitFor(() => {
      expectTransform(positioner, x, 80)
      expect(positioner.style.position).toBe('absolute')
      expect(popper.classList.contains('m3-popper_animated')).toBe(false)
      expect(popper.style.getPropertyValue('--m3-popper-enter-x')).toBe('')
      expect(popper.style.getPropertyValue('--m3-popper-enter-y')).toBe('')
      expect(popper.style.getPropertyValue('--m3-popper-scale-x-hidden')).toBe('')
      expect(popper.style.getPropertyValue('--m3-popper-scale-y-hidden')).toBe('')
    })
  })

  test('applies cross axis offset for bottom placement', async () => {
    target = document.createElement('button')
    document.body.append(target)

    const popperRef = createRef<M3PopperMethods>()

    const mounted = render(
      <M3Popper
        ref={popperRef}
        target={target}
        shown={true}
        placement="bottom"
        overflow={[]}
        offsetMainAxis={0}
        offsetCrossAxis={7}
        detachTimeout={null}
      >
        <div>
          Popper content
        </div>
      </M3Popper>
    )
    unmount = mounted.unmount

    const { positioner, popper } = await waitForPopper()

    vi.spyOn(target, 'getBoundingClientRect').mockReturnValue(rect(100, 50, 40, 20))
    const x = expectedX(popper, 7)

    await act(async () => {
      await popperRef.current?.adjust()
    })

    await waitFor(() => {
      expectTransform(positioner, x, 70)
      expect(positioner.style.position).toBe('absolute')
    })
  })

  test('changes geometry when placement switches from bottom to right', async () => {
    target = document.createElement('button')
    document.body.append(target)

    const popperRef = createRef<M3PopperMethods>()

    const mounted = render(
      <M3Popper
        ref={popperRef}
        target={target}
        shown={true}
        placement="bottom"
        overflow={[]}
        offsetMainAxis={0}
        offsetCrossAxis={0}
        animated={true}
        detachTimeout={null}
      >
        <div>
          Popper content
        </div>
      </M3Popper>
    )
    unmount = mounted.unmount

    const { positioner, popper } = await waitForPopper()

    vi.spyOn(target, 'getBoundingClientRect').mockReturnValue(rect(100, 50, 40, 20))

    await act(async () => {
      await popperRef.current?.adjust()
    })

    let bottomX = 0
    let bottomY = 0
    await waitFor(() => {
      const point = parseTransform(positioner)
      bottomX = point.x
      bottomY = point.y
      expectAnimationSide(popper, 'bottom')
    })

    mounted.rerender(
      <M3Popper
        ref={popperRef}
        target={target}
        shown={true}
        placement="right"
        overflow={[]}
        offsetMainAxis={0}
        offsetCrossAxis={0}
        animated={true}
        detachTimeout={null}
      >
        <div>
          Popper content
        </div>
      </M3Popper>
    )

    await waitFor(() => {
      const point = parseTransform(positioner)
      expect(point.x).toBeGreaterThan(bottomX)
      expect(point.y).not.toBe(bottomY)
      expectAnimationSide(popper, 'right')
    })
  })

  test('applies main axis offset delta for top placement', async () => {
    target = document.createElement('button')
    document.body.append(target)

    const popperRef = createRef<M3PopperMethods>()

    const mounted = render(
      <M3Popper
        ref={popperRef}
        target={target}
        shown={true}
        placement="top"
        overflow={[]}
        offsetMainAxis={0}
        offsetCrossAxis={0}
        animated={true}
        detachTimeout={null}
      >
        <div>
          Popper content
        </div>
      </M3Popper>
    )
    unmount = mounted.unmount

    const { positioner, popper } = await waitForPopper()

    vi.spyOn(target, 'getBoundingClientRect').mockReturnValue(rect(100, 50, 40, 20))

    await act(async () => {
      await popperRef.current?.adjust()
    })

    let y0 = 0
    await waitFor(() => {
      y0 = parseTransform(positioner).y
    })

    mounted.rerender(
      <M3Popper
        ref={popperRef}
        target={target}
        shown={true}
        placement="top"
        overflow={[]}
        offsetMainAxis={10}
        offsetCrossAxis={0}
        animated={true}
        detachTimeout={null}
      >
        <div>
          Popper content
        </div>
      </M3Popper>
    )

    await waitFor(() => {
      const y1 = parseTransform(positioner).y
      expect(Math.round(Math.abs(y1 - y0))).toBe(10)
      expectAnimationSide(popper, 'top')
    })
  })

  test('updates animation direction after flip when bottom placement has no space', async () => {
    target = document.createElement('button')
    document.body.append(target)

    const popperRef = createRef<M3PopperMethods>()

    const mounted = render(
      <M3Popper
        ref={popperRef}
        target={target}
        shown={true}
        placement="bottom"
        overflow={['flip']}
        offsetMainAxis={0}
        offsetCrossAxis={0}
        animated={true}
        detachTimeout={null}
      >
        <div>
          Popper content
        </div>
      </M3Popper>
    )
    unmount = mounted.unmount

    const { popper } = await waitForPopper()
    const y = window.innerHeight - 12
    vi.spyOn(target, 'getBoundingClientRect').mockReturnValue(rect(100, y, 40, 20))

    await act(async () => {
      await popperRef.current?.adjust()
    })

    await waitFor(() => {
      expectAnimationSide(popper, 'top')
    })
  })

  test('applies animation vectors for left placement', async () => {
    target = document.createElement('button')
    document.body.append(target)

    const popperRef = createRef<M3PopperMethods>()

    const mounted = render(
      <M3Popper
        ref={popperRef}
        target={target}
        shown={true}
        placement="left"
        overflow={[]}
        offsetMainAxis={0}
        offsetCrossAxis={0}
        animated={true}
        detachTimeout={null}
      >
        <div>
          Popper content
        </div>
      </M3Popper>
    )
    unmount = mounted.unmount

    const { popper } = await waitForPopper()
    vi.spyOn(target, 'getBoundingClientRect').mockReturnValue(rect(100, 50, 40, 20))

    await act(async () => {
      await popperRef.current?.adjust()
    })

    await waitFor(() => {
      expectAnimationSide(popper, 'left')
    })
  })
})
