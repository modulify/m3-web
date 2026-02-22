/* eslint-disable vue/one-component-per-file */

import { render } from '@testing-library/vue'

import {
  defineComponent,
  h,
  provide,
  ref,
} from 'vue'

import defineM3Icon from '@/components/icon/defineM3Icon'
import { M3IconAppearance } from '@/components/icon/injections'
import type { Sprite } from '~types/components/icon'

const FilledSprite = defineComponent({
  name: 'FilledSprite',
  setup (_, { attrs }) {
    return () => h('span', {
      ...attrs,
      'data-testid': 'filled-sprite',
    }, 'filled')
  },
})

const OutlinedSprite = defineComponent({
  name: 'OutlinedSprite',
  setup (_, { attrs }) {
    return () => h('span', {
      ...attrs,
      'data-testid': 'outlined-sprite',
    }, 'outlined')
  },
})

const TestIcon = defineM3Icon('TestIcon', {
  filled: FilledSprite as unknown as Sprite,
  outlined: OutlinedSprite as unknown as Sprite,
})

describe('m3-vue/icon defineM3Icon', () => {
  test('renders outlined sprite by default', () => {
    const { queryByTestId } = render(TestIcon)

    expect(queryByTestId('outlined-sprite')).not.toBeNull()
    expect(queryByTestId('filled-sprite')).toBeNull()
  })

  test('renders filled sprite from appearance prop', () => {
    const { queryByTestId } = render(TestIcon, {
      props: {
        appearance: 'filled',
      },
    })

    expect(queryByTestId('filled-sprite')).not.toBeNull()
    expect(queryByTestId('outlined-sprite')).toBeNull()
  })

  test('prefers provided appearance over local prop and forwards attrs', () => {
    const Parent = defineComponent({
      setup () {
        provide(M3IconAppearance, ref('filled'))

        return () => h(TestIcon, {
          appearance: 'outlined',
          'data-marker': 'from-parent',
        })
      },
    })

    const { getByTestId } = render(Parent)
    const icon = getByTestId('filled-sprite')

    expect(icon.getAttribute('data-marker')).toBe('from-parent')
  })
})
