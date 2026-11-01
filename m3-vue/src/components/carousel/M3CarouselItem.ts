import type { SlotsType, VNode } from 'vue'

import { defineComponent } from 'vue'

export interface M3CarouselItemSlots {
  default?: () => VNode[];
  media?: () => VNode[];
}

export default defineComponent({
  name: 'M3CarouselItem',

  props: {
    aspect: {
      type: Number,
      default: 1,
    },

    interactive: {
      type: Boolean,
      default: false,
    },

    disabled: {
      type: Boolean,
      default: false,
    },
  },

  slots: Object as SlotsType<M3CarouselItemSlots>,

  setup: () => () => null,
})
