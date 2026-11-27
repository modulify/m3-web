import { defineComponent } from 'vue'
import { fireEvent } from '@testing-library/vue'
import { h, nextTick, ref } from 'vue'
import { render, screen } from '@testing-library/vue'
import { waitFor } from '@testing-library/vue'

import { M3BottomSheet } from '@/components/bottom-sheet'

describe('m3-vue/bottom-sheet', () => {
  beforeEach(() => vi.spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockReturnValue(700))
  afterEach(() => vi.restoreAllMocks())

  test('standard mode leaves the page interactive and has no scrim', async () => {
    render(M3BottomSheet, {
      props: { shown: true, peek: 280 },
      attrs: { 'aria-label': 'Details' },
      slots: { default: 'Details' },
    })
    await nextTick()

    const sheet = screen.getByRole('dialog', { name: 'Details' })

    expect(sheet.getAttribute('aria-modal')).toBe('false')
    expect(sheet.style.getPropertyValue('--m3-bottom-sheet-height')).toBe('280px')
    expect(document.body.querySelector('.m3-surface__scrim')).toBeNull()
  })

  test('modal mode presents a scrim and requests dismissal', async () => {
    const view = render(M3BottomSheet, {
      props: { shown: true, variant: 'modal' },
      attrs: { 'aria-label': 'Options' },
    })
    await nextTick()

    const sheet = screen.getByRole('dialog', { name: 'Options' })
    const scrim = document.body.querySelector('.m3-surface__scrim') as HTMLElement

    expect(sheet.getAttribute('aria-modal')).toBe('true')
    expect(scrim).not.toBeNull()

    await fireEvent.click(scrim)
    expect(view.emitted()['update:shown']?.[0]).toEqual([false])
    expect(view.emitted().dismiss).toHaveLength(1)
  })

  test('the handle requests a height change when activated', async () => {
    const view = render(M3BottomSheet, {
      props: { shown: true, peek: 280 },
      attrs: { 'aria-label': 'Details' },
      slots: { default: 'Details' },
    })
    await nextTick()

    await fireEvent.click(screen.getByRole('button', { name: 'Resize bottom sheet' }))

    expect(view.emitted()['update:expanded']?.[0]).toEqual([true])
  })

  test('exposes show, hide, expand, and collapse controls', async () => {
    const sheet = ref<{
      el: HTMLElement | null;
      show: () => void;
      hide: () => void;
      expand: () => void;
      collapse: () => void;
        } | null>(null)
    const onShown = vi.fn()
    const onExpanded = vi.fn()

    render(defineComponent({
      setup: () => () => h(M3BottomSheet, {
        ref: sheet,
        shown: true,
        peek: 280,
        'aria-label': 'Details',
        'onUpdate:shown': onShown,
        'onUpdate:expanded': onExpanded,
      }, () => 'Details'),
    }))
    await nextTick()

    expect(sheet.value?.el).toBe(screen.getByRole('dialog', { name: 'Details' }))
    sheet.value?.show()
    sheet.value?.hide()
    expect(onShown.mock.calls).toEqual([[true], [false]])

    sheet.value?.expand()
    expect(onExpanded).toHaveBeenLastCalledWith(true)
    sheet.value?.collapse()
    expect(onExpanded).toHaveBeenLastCalledWith(false)
  })

  test('can omit the drag handle and follow a changed expanded prop', async () => {
    const view = render(M3BottomSheet, {
      props: {
        shown: true,
        handle: false,
        peek: 280,
      },
      attrs: { 'aria-label': 'Details' },
      slots: { default: 'Details' },
    })
    await nextTick()
    expect(screen.queryByRole('button', { name: 'Resize bottom sheet' })).toBeNull()

    await view.rerender({ expanded: true })
    expect(screen.getByRole('dialog', { name: 'Details' }).style.getPropertyValue('--m3-bottom-sheet-height')).toBe('700px')
  })

  test('unmounts after closing and mounts again when reopened', async () => {
    const view = render(M3BottomSheet, {
      props: { shown: true },
      attrs: { 'aria-label': 'Details' },
      slots: { default: 'Details' },
    })
    expect(screen.getByRole('dialog', { name: 'Details' })).toBeTruthy()

    await view.rerender({ shown: false })
    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'Details' })).toBeNull()
    }, { timeout: 1000 })

    await view.rerender({ shown: true })
    expect(screen.getByRole('dialog', { name: 'Details' })).toBeTruthy()
  })
})
