import type { PropType } from 'vue'

import type { TabContent } from './model'

import { defineComponent, h, ref } from 'vue'

import { M3Badge } from '@/components/badge'
import { M3Ripple } from '@/components/ripple'

export default defineComponent({
  props: {
    id: { type: String, required: true },
    panelId: { type: String, required: true },
    tab: { type: Object as () => TabContent, required: true },
    active: { type: Boolean, required: true },
    focused: { type: Boolean, required: true },
    onActivate: { type: Function as PropType<() => void>, required: true },
    onFocus: { type: Function as PropType<() => void>, required: true },
  },

  setup (props) {
    const owner = ref<HTMLButtonElement | null>(null)

    return () => {
      const iconOnly = !!props.tab.slots.icon && !props.tab.label && !props.tab.slots.label

      return h('button', {
        id: props.id,
        ref: owner,
        type: 'button',
        role: 'tab',
        'aria-controls': props.panelId,
        'aria-selected': props.active,
        'aria-label': props.tab.accessibleLabel,
        disabled: props.tab.disabled,
        tabindex: props.focused ? 0 : -1,
        class: ['m3-tab-group__tab', { 'm3-tab-group__tab_icon-only': iconOnly }],
        onClick: props.onActivate,
        onFocus: props.onFocus,
      }, [
        props.tab.slots.icon && h('span', { class: 'm3-tab-group__icon', 'aria-hidden': 'true' }, [
          props.tab.slots.icon(),
          (props.tab.slots.badge || props.tab.badge !== undefined) && h(M3Badge, { class: 'm3-tab-group__badge' }, {
            default: () => props.tab.slots.badge?.() ?? String(props.tab.badge),
          }),
        ]),
        !iconOnly && h('span', { class: 'm3-tab-group__label-row' }, [
          h('span', { class: 'm3-tab-group__label' }, props.tab.slots.label?.() ?? props.tab.label),
          !props.tab.slots.icon && (props.tab.slots.badge || props.tab.badge !== undefined) && h(M3Badge, {
            class: 'm3-tab-group__badge',
            'aria-hidden': 'true',
          }, { default: () => props.tab.slots.badge?.() ?? String(props.tab.badge) }),
        ]),
        h(M3Ripple, { owner }),
      ])
    }
  },
})
