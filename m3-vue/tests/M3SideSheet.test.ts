import {
  fireEvent,
  render,
  screen,
} from '@testing-library/vue'

import {
  defineComponent,
  h,
  nextTick,
} from 'vue'

import { M3SideSheet } from '@/components/side-sheet'

vi.mock('@/components/scroll-rail', () => ({
  M3ScrollRail: defineComponent({
    name: 'M3ScrollRail',
    setup: () => () => h('div', { 'data-testid': 'scroll-rail-mock' }),
  }),
}))

describe('m3-vue/side-sheet', () => {
  test('renders dialog and default aria-labelledby', async () => {
    render(M3SideSheet, {
      props: {
        shown: true,
      },
      slots: {
        title: 'Panel title',
        default: 'Panel content',
      },
    })

    await nextTick()

    const dialog = screen.getByRole('dialog')
    const labelId = dialog.getAttribute('aria-labelledby') as string

    expect(screen.getByText('Panel content')).not.toBeNull()
    expect(document.getElementById(labelId)?.textContent?.trim()).toBe('Panel title')
  })

  test('emits close request on scrim click when not docked', async () => {
    const view = render(M3SideSheet, {
      props: {
        shown: true,
        docked: false,
      },
      slots: {
        title: 'Panel title',
      },
    })

    await nextTick()

    const scrim = document.body.querySelector('.m3-scrim') as HTMLElement

    await fireEvent.click(scrim)

    expect(view.emitted()['update:shown']?.[0]).toEqual([false])
  })

  test('emits close request on close button click', async () => {
    const view = render(M3SideSheet, {
      props: {
        shown: true,
      },
      slots: {
        title: 'Panel title',
      },
    })

    await nextTick()

    await fireEvent.click(screen.getByRole('button'))

    expect(view.emitted()['update:shown']?.[0]).toEqual([false])
  })
})
