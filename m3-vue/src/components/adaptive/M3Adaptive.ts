import type { PropType, VNodeChild } from 'vue'

import { defineComponent } from 'vue'

import { m3Adaptive } from '@/composables/adaptive'

export type AdaptiveContent = VNodeChild | (() => VNodeChild)

export default defineComponent({
  name: 'M3Adaptive',
  props: {
    regular: { type: null as unknown as PropType<AdaptiveContent>, default: undefined },
    compact: { type: null as unknown as PropType<AdaptiveContent>, default: undefined },
    medium: { type: null as unknown as PropType<AdaptiveContent>, default: undefined },
    expanded: { type: null as unknown as PropType<AdaptiveContent>, default: undefined },
    large: { type: null as unknown as PropType<AdaptiveContent>, default: undefined },
    extraLarge: { type: null as unknown as PropType<AdaptiveContent>, default: undefined },
  },

  setup (props, { slots }) {
    return () => {
      const selected = m3Adaptive<AdaptiveContent>(slots.default ?? props.regular, {
        compact: slots.compact ?? props.compact,
        medium: slots.medium ?? props.medium,
        expanded: slots.expanded ?? props.expanded,
        large: slots.large ?? props.large,
        'extra-large': slots['extra-large'] ?? props.extraLarge,
      })

      return typeof selected === 'function' ? selected() : selected
    }
  },
})
