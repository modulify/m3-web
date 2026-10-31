import { fireEvent } from '@testing-library/vue'
import { nextTick } from 'vue'
import { render, screen } from '@testing-library/vue'

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
})
