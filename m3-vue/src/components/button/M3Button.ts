import type { Interactable } from '@modulify/m3-foundation'
import type { PropType, VNode } from 'vue'
import type { RouteLocationRaw } from 'vue-router'

import { M3Link } from '@/components/link'
import { M3Ripple } from '@/components/ripple'

import {
  computed,
  defineComponent,
  h,
  ref,
} from 'vue'

import { normalize } from '@/utils/runtime'

import * as properties from '@/components/button/properties'

const wrap = (content: [VNode, boolean][]) => content.map(([node, isIcon]) => h('span', {
  class: {
    'm3-button__icon': isIcon,
    'm3-button__text': !isIcon,
  },
}, { ...node }))

export default defineComponent({
  props: {
    type: {
      type: String as PropType<HTMLButtonElement['type']>,
      default: 'button',
    },

    to: {
      type: null as unknown as PropType<RouteLocationRaw>,
      default: undefined,
    },

    href: {
      type: String,
      default: undefined,
    },

    appearance: properties.appearance,

    disabled: {
      type: Boolean,
      default: false,
    },
  },

  // eslint-disable-next-line max-lines-per-function
  setup (props, { attrs, expose, slots }) {
    const root = ref<InstanceType<(typeof M3Link)> | null>(null)
    const rootElement = computed(() => root.value?.el() ?? null)
    const ripple = ref<InstanceType<typeof M3Ripple> | null>(null)

    expose({
      click: () => root.value?.click(),
      focus: () => root.value?.focus(),
      blur: () => root.value?.blur(),
    } satisfies Interactable)

    const onKeyup = (event: KeyboardEvent) => {
      if (event.code === 'Enter') {
        ripple.value?.activate(event)
      }
    }

    return () => {
      const content = normalize('default' in slots ? slots.default?.() ?? [] : [])

      const hasText = content.some(([, isIcon]) => !isIcon)
      const [, hasLeadingIcon] = content[0] ?? [null, false]
      const [, hasTrailingIcon] = content[content.length - 1] ?? [null, false]

      return h(M3Link, {
        ref: root,
        type: props.type,
        to: props.to,
        href: props.href,
        ...attrs,
        class: [attrs.class, {
          ['m3-button']: true,
          ['m3-button_' + props.appearance]: true,
          ['m3-button_has-leading-icon']: hasText && hasLeadingIcon,
          ['m3-button_has-trailing-icon']: hasText && hasTrailingIcon,
        }],
        disabled: props.disabled,
        onKeyup,
      }, () => [
        h(M3Ripple, { ref: ripple, owner: rootElement }),
        h('span', { class: 'm3-button__state' }),
        h('span', { class: 'm3-button__content' }, wrap(content)),
      ])
    }
  },
})