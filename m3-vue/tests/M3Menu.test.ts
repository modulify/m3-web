import {
  fireEvent,
  render,
  screen,
} from '@testing-library/vue'

import {
  defineComponent,
  h,
} from 'vue'

import { M3Menu } from '@/components/menu'

vi.mock('@/components/popper', () => ({
  M3Popper: defineComponent({
    name: 'M3Popper',
    props: {
      targetTriggers: {
        type: Array,
        default: () => [],
      },

      hideOnMissClick: {
        type: Boolean,
        default: false,
      },
    },

    emits: [
      'shown',
      'hide',
      'hidden',
      'update:shown',
    ],

    setup: (props, { attrs, emit, slots }) => {
      return () => h('div', {
        'data-testid': 'menu-popper',
        class: attrs.class,
        'data-target-triggers': JSON.stringify(props.targetTriggers),
        'data-hide-on-miss-click': String(props.hideOnMissClick),
      }, [
        h('button', {
          type: 'button',
          'data-testid': 'emit-shown',
          onClick: () => emit('shown'),
        }),
        h('button', {
          type: 'button',
          'data-testid': 'emit-hide',
          onClick: () => emit('hide'),
        }),
        h('button', {
          type: 'button',
          'data-testid': 'emit-hidden',
          onClick: () => emit('hidden'),
        }),
        h('button', {
          type: 'button',
          'data-testid': 'emit-update-shown',
          onClick: () => emit('update:shown', false),
        }),
        slots.default?.(),
      ])
    },
  }),
}))

describe('m3-vue/menu', () => {
  test('passes key public props to popper and keeps m3-menu class', () => {
    render(M3Menu, {
      props: {
        target: () => document.body,
      },
      slots: {
        default: 'Menu body',
      },
    })

    const popper = screen.getByTestId('menu-popper')

    expect(popper.classList.contains('m3-menu')).toBe(true)
    expect(popper.getAttribute('data-target-triggers')).toBe('["click"]')
    expect(popper.getAttribute('data-hide-on-miss-click')).toBe('true')
    expect(screen.getByText('Menu body')).not.toBeNull()
  })

  test('re-emits popper events', async () => {
    const view = render(M3Menu, {
      props: {
        target: () => document.body,
      },
    })

    await fireEvent.click(screen.getByTestId('emit-shown'))
    await fireEvent.click(screen.getByTestId('emit-hide'))
    await fireEvent.click(screen.getByTestId('emit-hidden'))
    await fireEvent.click(screen.getByTestId('emit-update-shown'))

    expect(view.emitted().shown).toHaveLength(1)
    expect(view.emitted().hide).toHaveLength(1)
    expect(view.emitted().hidden).toHaveLength(1)
    expect(view.emitted()['update:shown']?.[0]).toEqual([false])
  })
})
