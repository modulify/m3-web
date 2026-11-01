import { defineComponent, h, ref } from 'vue'

import { M3Ripple } from '@/components/ripple'

export default defineComponent({
  name: 'M3CarouselSlide',

  inheritAttrs: false,

  props: {
    label: {
      type: String,
      required: true,
    },

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

  setup (props, { attrs, slots }) {
    const root = ref<HTMLElement | null>(null)

    return () => {
      const media = slots.media && h('div', { class: 'm3-carousel__media' }, slots.media())
      const state = props.interactive && !props.disabled && h('div', { class: 'm3-carousel__state' },
        h(M3Ripple, { owner: root }))
      const content = h('div', { class: 'm3-carousel__content' }, slots.default?.() ?? [])

      return h('div', {
        ...attrs,
        ref: root,
        class: [{
          'm3-carousel__item': true,
          'm3-carousel__item_interactive': props.interactive,
          'm3-carousel__item_disabled': props.disabled,
        }, attrs.class],
        role: props.interactive ? 'button' : 'group',
        'aria-roledescription': props.interactive ? undefined : 'slide',
        'aria-disabled': props.disabled || undefined,
        tabindex: props.disabled ? -1 : 0,
        'data-aspect': props.aspect,
        'aria-label': props.label,
        onClick: props.disabled ? undefined : attrs.onClick,
      }, [media, state, content])
    }
  },
})
