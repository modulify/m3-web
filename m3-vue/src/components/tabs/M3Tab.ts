import type { SlotsType, VNode } from 'vue'

import { defineComponent } from 'vue'

export interface M3TabSlots {
  default?: () => VNode[];
  icon?: () => VNode[];
  label?: () => VNode[];
  badge?: () => VNode[];
}

export default defineComponent({
  name: 'M3Tab',
  props: {
    value: { type: String, required: true },
    label: { type: String, default: '' },
    badge: { type: [String, Number], default: undefined },
    disabled: { type: Boolean, default: false },
  },

  slots: Object as SlotsType<M3TabSlots>,

  setup: () => () => null,
})
