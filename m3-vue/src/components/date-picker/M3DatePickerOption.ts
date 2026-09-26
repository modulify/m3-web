import type { PropType, VNodeRef } from 'vue'

import { defineComponent, h, shallowRef } from 'vue'

import { M3Ripple } from '@/components/ripple'

export type M3DatePickerOptionAppearance = 'circle' | 'pill'

export default defineComponent({
  inheritAttrs: false,

  props: {
    appearance: {
      type: String as PropType<M3DatePickerOptionAppearance>,
      required: true,
    },

    current: {
      type: Boolean,
      default: false,
    },

    selected: {
      type: Boolean,
      default: false,
    },

    outside: {
      type: Boolean,
      default: false,
    },

    inRange: {
      type: Boolean,
      default: false,
    },

    rangeStart: {
      type: Boolean,
      default: false,
    },

    rangeEnd: {
      type: Boolean,
      default: false,
    },

    disabled: {
      type: Boolean,
      default: false,
    },
  },

  emits: [
    'select',
  ],

  setup (props, { attrs, emit, slots }) {
    const root = shallowRef<HTMLElement | null>(null)
    const setRoot: VNodeRef = (element) => {
      root.value = element instanceof HTMLElement ? element : null
    }

    return () => h('button', {
      ...attrs,
      ref: setRoot,
      'aria-current': props.current ? 'date' : attrs['aria-current'],
      type: 'button',
      disabled: props.disabled,
      class: {
        'm3-date-picker-option': true,
        [`m3-date-picker-option_${props.appearance}`]: true,
        'm3-date-picker-option_current': props.current,
        'm3-date-picker-option_selected': props.selected,
        'm3-date-picker-option_outside': props.outside,
        'm3-date-picker-option_in-range': props.inRange,
        'm3-date-picker-option_range-start': props.rangeStart,
        'm3-date-picker-option_range-end': props.rangeEnd,
      },
      onClick: props.disabled ? undefined : () => emit('select'),
    }, [
      h(M3Ripple, { owner: root }),
      h('span', { class: 'm3-date-picker-option__content' }, slots.default?.()),
    ])
  },
})
