import type {
  PropType,
  Ref,
} from 'vue'

import type { Appearance } from '@modulify/m3-foundation/types/components/icon'
import type { Sprite } from '~types/components/icon'

import { M3IconAppearance } from './injections'

import {
  computed,
  defineComponent,
  h,
  inject,
  ref,
  useAttrs,
} from 'vue'

export default (name: string, appearances: Record<Appearance, Sprite>) => defineComponent({
  name,

  props: {
    appearance: {
      type: String as PropType<Appearance>,
      validator: (appearance: string) => ['filled', 'outlined'].includes(appearance),
      default: 'outlined',
    },
  },

  setup (props) {
    const inherited = inject<Ref<Appearance | null>>(M3IconAppearance, ref(null))
    const actual = computed(() => inherited.value ?? props.appearance)

    return () => {
      const $attrs = useAttrs()

      switch (actual.value) {
        case 'filled':
          return h(appearances.filled, $attrs)
        case 'outlined':
          return h(appearances.outlined, $attrs)
      }
    }
  },
})