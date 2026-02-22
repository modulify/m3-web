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

const expectTransform = (popper: HTMLElement, x: number, y: number) => {
  expect(popper.style.transform).toMatch(new RegExp(`^translate3d\\(${x}px,\\s*${y}px,\\s*0px\\)$`))
}

const waitForPopper = async () => {
  await waitFor(() => {
    expect(document.body.querySelector('.m3-popper')).not.toBeNull()
  })

  return document.body.querySelector('.m3-popper') as HTMLElement
}

describe('m3-react/popper e2e', () => {
  let target: HTMLButtonElement | null = null

  afterEach(() => {
    target?.remove()
    target = null
    vi.restoreAllMocks()
  })

  test('applies bottom placement geometry with main axis offset', async () => {
    target = document.createElement('button')
    document.body.append(target)

    const popperRef = createRef<M3PopperMethods>()

    render(
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

    const popper = await waitForPopper()

    vi.spyOn(target, 'getBoundingClientRect').mockReturnValue(rect(100, 50, 40, 20))
    const x = expectedX(popper)

    await act(async () => {
      await popperRef.current?.adjust()
    })

    await waitFor(() => {
      expectTransform(popper, x, 80)
      expect(popper.style.position).toBe('absolute')
    })
  })

  test('applies cross axis offset for bottom placement', async () => {
    target = document.createElement('button')
    document.body.append(target)

    const popperRef = createRef<M3PopperMethods>()

    render(
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

    const popper = await waitForPopper()

    vi.spyOn(target, 'getBoundingClientRect').mockReturnValue(rect(100, 50, 40, 20))
    const x = expectedX(popper, 7)

    await act(async () => {
      await popperRef.current?.adjust()
    })

    await waitFor(() => {
      expectTransform(popper, x, 70)
      expect(popper.style.position).toBe('absolute')
    })
  })
})
