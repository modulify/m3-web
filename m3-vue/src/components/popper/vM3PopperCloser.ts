import type { CloserTarget } from '@modulify/m3-foundation/types/components/popper'
import type { Directive } from 'vue'

import {
  addCloserListeners,
  removeCloserListeners,
} from '@modulify/m3-foundation/lib/popper/closer'

export default {
  beforeMount (el, { value, modifiers }) {
    el.m3PopperCloseAll = 'all' in modifiers
    if (typeof value === 'undefined' || value) {
      addCloserListeners(el)
    }
  },

  updated (el, { value, oldValue, modifiers }) {
    el.m3PopperCloseAll = 'all' in modifiers
    if (value !== oldValue) {
      if (typeof value === 'undefined' || value) {
        addCloserListeners(el)
      } else {
        removeCloserListeners(el)
      }
    }
  },

  beforeUnmount (el) {
    removeCloserListeners(el)
  },
} as Directive<CloserTarget, boolean | undefined>
