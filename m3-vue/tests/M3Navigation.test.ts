import {
  fireEvent,
  render,
  screen,
} from '@testing-library/vue'

import { nextTick } from 'vue'

import { M3Navigation } from '@/components/navigation'

describe('m3-vue/navigation', () => {
  test('renders slots and closes by scrim click', async () => {
    const view = render(M3Navigation, {
      props: {
        expanded: true,
      },
      slots: {
        top: 'Top',
        header: 'Header',
        subheader: 'Subheader',
        default: 'Main item',
        sections: 'Extra section',
      },
    })

    await nextTick()

    expect(screen.getByText('Top')).not.toBeNull()
    expect(screen.getByText('Header')).not.toBeNull()
    expect(screen.getByText('Subheader')).not.toBeNull()
    expect(screen.getByText('Main item')).not.toBeNull()
    expect(screen.getByText('Extra section')).not.toBeNull()

    const scrim = document.body.querySelector('.m3-scrim') as HTMLElement

    await fireEvent.click(scrim)

    expect(view.emitted()['update:expanded']?.[0]).toEqual([false])
  })

  test('requests collapsing in auto mode after resize to large breakpoint', async () => {
    const initialWidth = window.innerWidth

    const view = render(M3Navigation, {
      props: {
        expanded: true,
        appearance: 'auto',
      },
      slots: {
        default: 'Main item',
      },
    })

    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      writable: true,
      value: 1700,
    })

    window.dispatchEvent(new Event('resize'))
    await nextTick()

    expect(view.emitted()['update:expanded']?.some(([value]) => value === false)).toBe(true)

    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      writable: true,
      value: initialWidth,
    })
  })
})
