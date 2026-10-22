import type { Appearance } from '@modulify/m3-foundation/types/components/button'
import type { ElementReference, Interactable } from '@modulify/m3-foundation/types/dom'
import type { M3LinkInstance } from '@/components/link'
import type { PropType } from 'vue'
import type { Rounding } from '@modulify/m3-foundation/types/components/button'
import type { RouteLocationRaw } from 'vue-router'
import type { Size } from '@modulify/m3-foundation/types/components/button'
import type { VNode } from 'vue'
import type { Width } from '@modulify/m3-foundation/types/components/button'

import {
  computed,
  defineComponent,
  h,
  ref,
} from 'vue'

import { M3Link } from '@/components/link'
import { M3Ripple } from '@/components/ripple'

import { normalize } from '@/utils/runtime'
import { provideM3IconAppearance } from '@/components/icon/injections'
import { useM3ButtonSize } from '@/components/button/injections'

import * as properties from '@/components/button/properties'

const wrap = (content: [VNode, boolean][]) => content.map(([node, isIcon]) => h('span', {
  class: {
    'm3-button__icon': isIcon,
    'm3-button__text': !isIcon,
  },
}, { ...node }))

const classes = (props: {
  appearance?: Appearance;
  rounding?: Rounding;
  width?: Width;
  toggleable: boolean;
  selected: boolean;
}, size: Size, content: [VNode, boolean][]) => {
  const appearance = props.appearance ?? 'filled'
  const rounding = props.rounding ?? 'round'
  const width = props.width ?? 'auto'
  const fixed = width !== 'auto'
  const hasText = content.some(([, isIcon]) => !isIcon)
  const [, hasLeadingIcon] = content[0] ?? [null, false]
  const [, hasTrailingIcon] = content[content.length - 1] ?? [null, false]
  const toggle = props.toggleable && appearance !== 'text'

  return {
    'm3-button': true,
    ['m3-button_' + appearance]: true,
    ['m3-button_' + size]: size !== 'sm',
    'm3-button_fixed': fixed,
    ['m3-button_' + width]: fixed && width !== 'medium',
    'm3-button_square': rounding === 'square',
    'm3-button_toggleable': toggle,
    'm3-button_selected': toggle && props.selected,
    'm3-button_has-leading-icon': hasText && hasLeadingIcon,
    'm3-button_has-trailing-icon': hasText && hasTrailingIcon,
  }
}

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
    size: properties.size,
    rounding: properties.rounding,
    width: properties.width,

    toggleable: {
      type: Boolean,
      default: false,
    },

    selected: {
      type: Boolean,
      default: false,
    },

    disabled: {
      type: Boolean,
      default: false,
    },
  },

  setup (props, { attrs, expose, slots }) {
    provideM3IconAppearance(() => props.width !== 'auto'
      ? (!props.toggleable || props.selected ? 'filled' : 'outlined')
      : (props.toggleable && props.appearance !== 'text' && props.selected ? 'filled' : 'outlined'))
    const size = useM3ButtonSize(() => props.size)
    const root = ref<M3LinkInstance | null>(null)
    const rootElement = computed(() => root.value?.el ?? null)
    const ripple = ref<InstanceType<typeof M3Ripple> | null>(null)

    expose({
      get el () { return rootElement.value },
      click: () => root.value?.click(),
      focus: () => root.value?.focus(),
      blur: () => root.value?.blur(),
    } satisfies ElementReference & Interactable)

    const onKeyup = (event: KeyboardEvent) => { if (event.code === 'Enter') ripple.value?.activate(event) }

    return () => {
      const content = normalize('default' in slots ? slots.default?.() ?? [] : [])
      const toggle = props.toggleable && props.appearance !== 'text'

      return h(M3Link, {
        ...attrs,
        ref: root,
        href: props.href,
        to: props.to,
        type: props.type,
        disabled: props.disabled,
        class: [attrs.class, classes(props, size.value, content)],
        'aria-pressed': toggle ? props.selected : undefined,
        onKeyup,
      }, () => [
        h('span', { class: 'm3-button__ripple' }, h(M3Ripple, { ref: ripple, owner: rootElement })),
        h('span', { class: 'm3-button__state' }),
        h('span', { class: 'm3-button__content' }, wrap(content)),
      ])
    }
  },
})
