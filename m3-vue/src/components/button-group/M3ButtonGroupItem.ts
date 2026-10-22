import type { Appearance } from '@modulify/m3-foundation/types/components/button-group'
import type { ElementReference } from '@modulify/m3-foundation/types/dom'
import type { Interactable } from '@modulify/m3-foundation/types/dom'
import type { Kind } from '@modulify/m3-foundation/types/components/button-group'
import type { PropType } from 'vue'
import type { Size } from '@modulify/m3-foundation/types/components/button-group'
import type { Width } from '@modulify/m3-foundation/types/components/button'

import {
  defineComponent,
  h,
  inject,
  mergeProps,
  ref,
} from 'vue'

import { M3Button } from '@/components/button'

import { normalize } from '@/utils/runtime'

import { ButtonGroupKey } from './context'

type ItemReference = ElementReference & Interactable

const wrapperClass = (iconOnly: boolean, size: Size | undefined, groupSize: Size) => ['m3-button-group__wrapper', {
  'm3-button-group__wrapper_icon-only': iconOnly,
  [`m3-button-group__wrapper_${size}`]: size && size !== groupSize,
}]

export default defineComponent({
  inheritAttrs: false,

  props: {
    value: {
      type: String,
      required: true,
    },

    appearance: {
      type: String as PropType<Appearance>,
      default: 'tonal',
    },

    kind: {
      type: String as PropType<Kind>,
      default: 'button',
    },

    size: {
      type: String as PropType<Size>,
      default: undefined,
    },

    width: {
      type: String as PropType<Exclude<Width, 'auto'>>,
      default: 'medium',
    },

    disabled: {
      type: Boolean,
      default: false,
    },
  },

  emits: {
    click: (_event: MouseEvent) => true,
  },

  setup (props, { attrs, emit, expose, slots }) {
    const group = inject(ButtonGroupKey)
    if (!group) throw new Error('M3ButtonGroupItem must be inside M3ButtonGroup')

    const root = ref<ItemReference | null>(null)

    expose({
      get el () { return root.value?.el ?? null },
      click: () => root.value?.click(),
      focus: () => root.value?.focus(),
      blur: () => root.value?.blur(),
    } satisfies ItemReference)

    const onClick = (event: MouseEvent) => {
      emit('click', event)
      if (!event.defaultPrevented && !props.disabled) group.activate(props.value)
    }

    return () => {
      const content = normalize(slots.default?.() ?? [])
      const iconOnly = content.length === 1 && content[0]![1]
      const selected = group.selected(props.value)
      const toggleable = group.selection.value !== 'none'
      if (group.variant.value === 'connected' && props.size && props.size !== group.size.value) throw new Error('Connected M3ButtonGroup items must use the group size')
      const buttonProps = mergeProps(attrs, {
        ref: root,
        type: 'button',
        disabled: props.disabled,
        size: props.size,
        rounding: group.rounding.value,
        toggleable,
        selected,
        class: ['m3-button-group__item', { 'm3-button-group__item_icon-only': iconOnly, 'm3-button-group__item_selected': selected }],
        onClick,
      })

      const item = props.kind === 'icon'
        ? h(M3Button, { ...buttonProps, appearance: props.appearance, width: props.width }, () => slots.default?.())
        : h(M3Button, { ...buttonProps, appearance: props.appearance }, () => slots.default?.())

      return h('span', {
        class: wrapperClass(iconOnly, props.size, group.size.value),
        onClick: (event: MouseEvent) => {
          if (event.target === event.currentTarget && !props.disabled) root.value?.click()
        },
      }, [item])
    }
  },
})
