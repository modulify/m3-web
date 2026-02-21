import {
  fireEvent,
  render,
  screen,
} from '@testing-library/vue'

import { nextTick } from 'vue'

import { M3Dialog } from '@/components/dialog'

describe('m3-vue/dialog', () => {
  test('opens by prop and emits close request on scrim click', async () => {
    const view = render(M3Dialog, {
      props: {
        opened: false,
      },
      slots: {
        default: 'Dialog body',
      },
    })

    expect(screen.queryByText('Dialog body')).toBeNull()

    await view.rerender({ opened: true })
    await nextTick()

    expect(screen.getByText('Dialog body')).not.toBeNull()

    const scrim = document.body.querySelector('.m3-scrim') as HTMLElement

    await fireEvent.click(scrim)

    expect(view.emitted()['update:opened']?.[0]).toEqual([false])
  })
})
