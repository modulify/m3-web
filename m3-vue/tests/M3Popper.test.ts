import type { Component } from 'vue'

import {
  createSSRApp,
  defineComponent,
  h,
  KeepAlive,
  nextTick,
  ref,
} from 'vue'
import { render } from '@testing-library/vue'
import { renderToString } from 'vue/server-renderer'
import { waitFor } from '@testing-library/vue'
import { withDirectives } from 'vue'

import { M3Popper } from '@/components/popper'
import { useAutoUpdate } from '@/components/popper/floating'
import { vM3PopperCloser } from '@/components/popper'

type PopperHandle = {
  show: (immediately?: boolean) => void;
  hide: (immediately?: boolean) => void;
  adjust: () => Promise<void>;
}

const { computePositionMock } = vi.hoisted(() => ({
  computePositionMock: vi.fn(),
}))

vi.mock('@modulify/m3-foundation/lib/popper/floating', () => ({
  computePosition: computePositionMock,
}))

describe('m3-vue/popper lifecycle', () => {
  beforeEach(() => {
    computePositionMock.mockReset()
  })

  test('renders without a browser document during SSR', async () => {
    const browserDocument = globalThis.document

    try {
      vi.stubGlobal('document', undefined)

      const html = await renderToString(createSSRApp(M3Popper as Component, {
        target: () => null,
      }))

      expect(html).not.toContain('m3-popper-positioner')
    } finally {
      vi.stubGlobal('document', browserDocument)
    }
  })

  test('hides on a touch outside the popper', async () => {
    const target = document.createElement('button')
    document.body.append(target)
    computePositionMock.mockResolvedValue({
      placement: 'bottom',
      side: 'bottom',
    })

    const onToggle = vi.fn()
    const view = render(defineComponent({
      setup: () => () => h(M3Popper as Component, {
        target: () => target,
        shown: true,
        hideOnMissClick: true,
        'onUpdate:shown': onToggle,
      }, () => 'Popover'),
    }))

    try {
      await waitFor(() => {
        expect(document.body.querySelector('.m3-popper_shown')).not.toBeNull()
      })
      await new Promise(resolve => requestAnimationFrame(resolve))

      document.body.dispatchEvent(new Event('touchend', { bubbles: true }))

      await waitFor(() => expect(onToggle).toHaveBeenCalledWith(false))
      await new Promise(resolve => setTimeout(resolve, 320))
    } finally {
      view.unmount()
      target.remove()
    }
  })

  test('moves an open popper when its container changes', async () => {
    const target = document.createElement('button')
    const first = document.createElement('div')
    const second = document.createElement('div')
    document.body.append(target, first, second)
    computePositionMock.mockResolvedValue({
      placement: 'bottom',
      side: 'bottom',
    })

    const container = ref(first)
    const view = render(defineComponent({
      setup: () => () => h(M3Popper as Component, {
        target: () => target,
        container: container.value,
        shown: true,
      }, () => 'Popover'),
    }))

    try {
      await waitFor(() => {
        expect(first.querySelector('.m3-popper_shown')).not.toBeNull()
      })

      container.value = second
      await waitFor(() => {
        expect(second.querySelector('.m3-popper_shown')).not.toBeNull()
      })
      expect(first.querySelector('.m3-popper')).toBeNull()
    } finally {
      view.unmount()
      target.remove()
      first.remove()
      second.remove()
    }
  })

  test('restores a shown popper after KeepAlive activation', async () => {
    const target = document.createElement('button')
    document.body.append(target)
    computePositionMock.mockResolvedValue({
      placement: 'bottom',
      side: 'bottom',
    })

    const active = ref(true)
    const shown = ref(false)
    const onToggle = vi.fn()
    const view = render(defineComponent({
      setup: () => () => h(KeepAlive, null, {
        default: () => active.value
          ? h(M3Popper as Component, {
            target: () => target,
            shown: shown.value,
            'onUpdate:shown': onToggle,
          }, () => 'Popover')
          : h('span', 'Inactive'),
      }),
    }))

    try {
      expect(document.body.querySelector('.m3-popper_shown')).toBeNull()

      shown.value = true
      await waitFor(() => {
        expect(document.body.querySelector('.m3-popper_shown')).not.toBeNull()
      })

      active.value = false
      await waitFor(() => expect(onToggle).toHaveBeenCalledWith(false))

      active.value = true
      await waitFor(() => {
        expect(document.body.querySelector('.m3-popper_shown')).not.toBeNull()
      })
    } finally {
      view.unmount()
      target.remove()
    }
  })

  test('reports completed show and hide transitions', async () => {
    const target = document.createElement('button')
    document.body.append(target)
    computePositionMock.mockResolvedValue({
      placement: 'bottom',
      side: 'bottom',
    })

    const shown = ref(true)
    const onShown = vi.fn()
    const onHidden = vi.fn()
    const view = render(defineComponent({
      setup: () => () => h(M3Popper as Component, {
        target: () => target,
        shown: shown.value,
        detachTimeout: null,
        onShown,
        onHidden,
      }, () => 'Popover'),
    }))

    try {
      await waitFor(() => {
        expect(document.body.querySelector('.m3-popper_shown')).not.toBeNull()
      })
      const popper = document.body.querySelector('.m3-popper') as HTMLElement
      popper.dispatchEvent(new Event('transitionend'))
      expect(onShown).toHaveBeenCalledOnce()

      shown.value = false
      await waitFor(() => expect(popper.classList.contains('m3-popper_shown')).toBe(false))
      popper.dispatchEvent(new Event('transitionend'))
      expect(onHidden).toHaveBeenCalledOnce()
    } finally {
      view.unmount()
      target.remove()
    }
  })

  test('finishes opening after positioning resolves while mounted', async () => {
    const target = document.createElement('button')
    document.body.append(target)

    let finish!: (result: { placement: string; side: 'bottom' }) => void
    computePositionMock.mockReturnValue(new Promise(resolve => {
      finish = resolve
    }))

    const onToggle = vi.fn()
    let instance: PopperHandle | null = null
    const view = render(defineComponent({
      setup: () => () => h(M3Popper as Component, {
        ref: (value: PopperHandle | null) => {
          instance = value
        },
        target: () => target,
        shown: false,
        'onUpdate:shown': onToggle,
      }, () => 'Popover'),
    }))

    try {
      instance!.show(true)
      await waitFor(() => expect(computePositionMock).toHaveBeenCalled())
      finish({ placement: 'bottom', side: 'bottom' })
      await waitFor(() => expect(onToggle).toHaveBeenCalledWith(true))
    } finally {
      view.unmount()
      target.remove()
    }
  })

  test('does not finish opening after positioning resolves for a disposed popper', async () => {
    const target = document.createElement('button')
    document.body.append(target)

    let finish!: (result: { placement: string; side: 'bottom' }) => void
    const pending = new Promise<{ placement: string; side: 'bottom' }>(resolve => {
      finish = resolve
    })
    computePositionMock.mockReturnValue(pending)

    const onToggle = vi.fn()
    const disabled = ref(false)
    let instance: PopperHandle | null = null
    const view = render(defineComponent({
      setup: () => () => h(M3Popper as Component, {
        ref: (value: PopperHandle | null) => {
          instance = value
        },
        target: () => target,
        shown: false,
        disabled: disabled.value,
        'onUpdate:shown': onToggle,
      }, () => 'Popover'),
    }))

    try {
      instance!.show(true)
      await waitFor(() => expect(computePositionMock).toHaveBeenCalled())
      disabled.value = true
      await nextTick()
      finish({ placement: 'bottom', side: 'bottom' })
      await pending
      await new Promise(resolve => setTimeout(resolve, 0))

      expect(onToggle).not.toHaveBeenCalledWith(true)
    } finally {
      view.unmount()
      target.remove()
    }
  })

  test('does not finish opening after the external target disappears', async () => {
    const target = document.createElement('button')
    document.body.append(target)

    let finish!: (result: { placement: string; side: 'bottom' }) => void
    const pending = new Promise<{ placement: string; side: 'bottom' }>(resolve => {
      finish = resolve
    })
    computePositionMock.mockReturnValue(pending)

    const onToggle = vi.fn()
    let instance: PopperHandle | null = null
    const view = render(defineComponent({
      setup: () => () => h(M3Popper as Component, {
        ref: (value: PopperHandle | null) => {
          instance = value
        },
        target: () => target,
        shown: false,
        'onUpdate:shown': onToggle,
      }, () => 'Popover'),
    }))

    try {
      instance!.show(true)
      await waitFor(() => expect(computePositionMock).toHaveBeenCalled())
      target.remove()
      finish({ placement: 'bottom', side: 'bottom' })
      await pending
      await new Promise(resolve => setTimeout(resolve, 0))

      expect(onToggle).not.toHaveBeenCalledWith(true)
    } finally {
      view.unmount()
      target.remove()
    }
  })

  test('does not position when the target disappears before the opening frame', async () => {
    const target = document.createElement('button')
    document.body.append(target)

    const onToggle = vi.fn()
    const view = render(defineComponent({
      setup: () => () => h(M3Popper as Component, {
        target: () => target,
        shown: true,
        'onUpdate:shown': onToggle,
      }, () => 'Popover'),
    }))

    try {
      target.remove()
      await new Promise(resolve => setTimeout(resolve, 50))

      expect(computePositionMock).not.toHaveBeenCalled()
      expect(onToggle).not.toHaveBeenCalledWith(true)
    } finally {
      view.unmount()
      target.remove()
    }
  })

  test('ignores public show and adjust calls while disabled', async () => {
    const target = document.createElement('button')
    document.body.append(target)

    let instance: PopperHandle | null = null
    const onShow = vi.fn()
    const view = render(defineComponent({
      setup: () => () => h(M3Popper as Component, {
        ref: (value: PopperHandle | null) => {
          instance = value
        },
        target: () => target,
        disabled: true,
        onShow,
      }, () => 'Popover'),
    }))

    try {
      instance!.show(true)
      await instance!.adjust()

      expect(onShow).not.toHaveBeenCalled()
      expect(computePositionMock).not.toHaveBeenCalled()
      expect(document.body.querySelector('.m3-popper-positioner')).toBeNull()
    } finally {
      view.unmount()
      target.remove()
    }
  })

  test('reopens when enabled again while shown is requested', async () => {
    const target = document.createElement('button')
    document.body.append(target)
    computePositionMock.mockResolvedValue({
      placement: 'bottom',
      side: 'bottom',
    })

    const disabled = ref(true)
    const view = render(defineComponent({
      setup: () => () => h(M3Popper as Component, {
        target: () => target,
        shown: true,
        disabled: disabled.value,
      }, () => 'Popover'),
    }))

    try {
      expect(document.body.querySelector('.m3-popper')).toBeNull()

      disabled.value = false
      await waitFor(() => {
        expect(document.body.querySelector('.m3-popper_shown')).not.toBeNull()
      })

      disabled.value = true
      await waitFor(() => {
        expect(document.body.querySelector('.m3-popper')).toBeNull()
      })

      disabled.value = false
      await waitFor(() => {
        expect(document.body.querySelector('.m3-popper_shown')).not.toBeNull()
      })
    } finally {
      view.unmount()
      target.remove()
    }
  })

  test('waits for a target instead of positioning against a missing element', async () => {
    let instance: PopperHandle | null = null
    const onToggle = vi.fn()
    const view = render(defineComponent({
      setup: () => () => h(M3Popper as Component, {
        ref: (value: PopperHandle | null) => {
          instance = value
        },
        target: () => null,
        'onUpdate:shown': onToggle,
      }, () => 'Popover'),
    }))

    try {
      instance!.show(true)
      await waitFor(() => expect(document.body.querySelector('.m3-popper-positioner')).not.toBeNull())
      await instance!.adjust()
      await new Promise(resolve => setTimeout(resolve, 50))

      expect(computePositionMock).not.toHaveBeenCalled()
      expect(onToggle).not.toHaveBeenCalledWith(true)
    } finally {
      view.unmount()
    }
  })

  test('positions against a replacement target before finishing opening', async () => {
    const firstTarget = document.createElement('button')
    const replacement = document.createElement('button')
    document.body.append(firstTarget, replacement)
    const target = ref<Element>(firstTarget)

    type Position = { placement: string; side: 'bottom' }
    let finishFirst!: (result: Position) => void
    let finishSecond!: (result: Position) => void
    const first = new Promise<Position>(resolve => { finishFirst = resolve })
    const second = new Promise<Position>(resolve => { finishSecond = resolve })
    computePositionMock.mockReturnValueOnce(first).mockReturnValueOnce(second)

    const onToggle = vi.fn()
    let instance: PopperHandle | null = null
    const view = render(defineComponent({
      setup: () => () => h(M3Popper as Component, {
        ref: (value: PopperHandle | null) => {
          instance = value
        },
        target: () => target.value,
        shown: false,
        'onUpdate:shown': onToggle,
      }, () => 'Popover'),
    }))

    try {
      instance!.show(true)
      await waitFor(() => expect(computePositionMock).toHaveBeenCalledTimes(1))
      target.value = replacement
      await nextTick()

      finishFirst({ placement: 'bottom', side: 'bottom' })
      await waitFor(() => expect(computePositionMock).toHaveBeenCalledTimes(2))
      expect(computePositionMock.mock.calls[1][1]).toBe(replacement)
      expect(onToggle).not.toHaveBeenCalledWith(true)

      finishSecond({ placement: 'bottom', side: 'bottom' })
      await waitFor(() => expect(onToggle).toHaveBeenCalledWith(true))
    } finally {
      view.unmount()
      firstTarget.remove()
      replacement.remove()
    }
  })

  test('keeps an open popper mounted while its target temporarily disappears', async () => {
    const button = document.createElement('button')
    document.body.append(button)
    const target = ref<Element | null>(button)
    computePositionMock.mockResolvedValue({ placement: 'bottom', side: 'bottom' })

    const view = render(defineComponent({
      setup: () => () => h(M3Popper as Component, {
        target: () => target.value,
        shown: true,
      }, () => 'Popover'),
    }))

    try {
      await waitFor(() => expect(document.body.querySelector('.m3-popper_shown')).not.toBeNull())

      target.value = null
      await nextTick()
      expect(document.body.querySelector('.m3-popper_shown')).not.toBeNull()

      target.value = button
      await nextTick()
      await waitFor(() => expect(computePositionMock).toHaveBeenCalledWith(
        expect.any(HTMLElement),
        button,
        expect.any(Object)
      ))
    } finally {
      view.unmount()
      button.remove()
    }
  })

  test('repositions after a rapid disable and enable while dismissal is pending', async () => {
    const target = document.createElement('button')
    document.body.append(target)
    computePositionMock.mockResolvedValue({ placement: 'bottom', side: 'bottom' })
    const disabled = ref(false)

    const view = render(defineComponent({
      setup: () => () => h(M3Popper as Component, {
        target: () => target,
        shown: true,
        disabled: disabled.value,
      }, () => 'Popover'),
    }))

    try {
      await waitFor(() => expect(document.body.querySelector('.m3-popper_shown')).not.toBeNull())

      disabled.value = true
      await nextTick()
      disabled.value = false
      await nextTick()

      await waitFor(() => expect(document.body.querySelector('.m3-popper_shown')).not.toBeNull())
      expect(computePositionMock).toHaveBeenCalled()
    } finally {
      view.unmount()
      target.remove()
    }
  })

  test('ignores the first position when a newer opening request is pending', async () => {
    const target = document.createElement('button')
    document.body.append(target)

    type Position = { placement: string; side: 'left' | 'right' }
    let finishFirst!: (result: Position) => void
    let finishSecond!: (result: Position) => void
    const first = new Promise<Position>(resolve => { finishFirst = resolve })
    const second = new Promise<Position>(resolve => { finishSecond = resolve })
    computePositionMock.mockReturnValueOnce(first).mockReturnValueOnce(second)

    const onToggle = vi.fn()
    let instance: PopperHandle | null = null
    const view = render(defineComponent({
      setup: () => () => h(M3Popper as Component, {
        ref: (value: PopperHandle | null) => {
          instance = value
        },
        target: () => target,
        shown: false,
        'onUpdate:shown': onToggle,
      }, () => 'Popover'),
    }))

    try {
      instance!.show(true)
      await waitFor(() => expect(computePositionMock).toHaveBeenCalledTimes(1))
      instance!.hide(true)
      instance!.show(true)
      await waitFor(() => expect(computePositionMock).toHaveBeenCalledTimes(2))

      finishFirst({ placement: 'left', side: 'left' })
      await first
      await new Promise(resolve => setTimeout(resolve, 0))
      expect(onToggle).not.toHaveBeenCalledWith(true)

      finishSecond({ placement: 'right', side: 'right' })
      await waitFor(() => expect(onToggle).toHaveBeenCalledWith(true))
      expect(onToggle).toHaveBeenCalledTimes(1)
    } finally {
      view.unmount()
      target.remove()
    }
  })
})

describe('m3-vue/popper positioning', () => {
  test('ignores auto adjustment until both elements are available', () => {
    const target = ref<Element | null>(null)
    const popper = ref<HTMLElement | null>(null)
    const adjust = vi.fn()
    const { autoAdjustOn, autoAdjustOff } = useAutoUpdate(target, popper, adjust)

    autoAdjustOn()
    target.value = document.createElement('button')
    autoAdjustOn()
    autoAdjustOff()

    expect(adjust).not.toHaveBeenCalled()
  })
})

describe('m3-vue/popper closer directive', () => {
  test('updates the closer when its reactive value changes', async () => {
    const enabled = ref(false)
    const view = render(defineComponent({
      setup: () => () => withDirectives(
        h('button', { type: 'button' }, 'Close'),
        [[vM3PopperCloser, enabled.value]]
      ),
    }))
    const button = view.getByRole('button', { name: 'Close' })
    const click = () => {
      const event = new MouseEvent('click', { bubbles: true }) as MouseEvent & { m3PopperClose?: boolean }
      button.dispatchEvent(event)
      return event
    }

    expect(click().m3PopperClose).toBeUndefined()

    enabled.value = true
    await nextTick()
    expect(click().m3PopperClose).toBe(true)

    enabled.value = false
    await nextTick()
    expect(click().m3PopperClose).toBeUndefined()

    view.unmount()
  })
})
