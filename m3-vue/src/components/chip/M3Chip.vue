<template>
    <span
        :class="rootClass"
        :style="rootStyle"
    >
        <button
            ref="action"
            :type="type"
            class="m3-chip__action"
            :disabled="disabled"
            :aria-pressed="variant === 'filter' ? selected : undefined"
            v-bind="actionAttrs"
            @click="onActionClick"
            @keyup="onActionKeyup"
        >
            <M3Ripple
                ref="actionRipple"
                :owner="ref(action)"
            />

            <span class="m3-chip__state" />
            <span class="m3-chip__content">
                <span v-if="hasCheckmark" class="m3-chip__icon m3-chip__icon_selection">
                    <M3Icon name="check" />
                </span>

                <M3ChipContent />
            </span>
        </button>

        <button
            v-if="dismissible"
            ref="dismiss"
            type="button"
            class="m3-chip__dismiss"
            :disabled="disabled"
            :aria-label="dismissLabel"
            @click="onDismissClick"
            @keyup="onDismissKeyup"
        >
            <M3Ripple
                ref="dismissRipple"
                :owner="ref(dismiss)"
                centered
            />

            <span class="m3-chip__state" />
            <span class="m3-chip__content">
                <span class="m3-chip__icon">
                    <M3Icon name="close" />
                </span>
            </span>
        </button>
    </span>
</template>

<script lang="ts" setup>
import type { Interactive } from '@modulify/m3-foundation'
import type {
  PropType,
  StyleValue,
} from 'vue'

import { M3Icon } from '@/components/icon'
import { M3Ripple } from '@/components/ripple'

import {
  computed,
  h,
  ref,
  useAttrs,
  useSlots,
} from 'vue'

import { normalize } from '@/utils/runtime'

import * as properties from './properties'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps({
  type: {
    type: String as PropType<HTMLButtonElement['type']>,
    default: 'button',
  },

  variant: properties.variant,

  selected: {
    type: Boolean,
    default: false,
  },

  showCheckmark: {
    type: Boolean,
    default: true,
  },

  dismissible: {
    type: Boolean,
    default: false,
  },

  disabled: {
    type: Boolean,
    default: false,
  },

  dismissLabel: {
    type: String,
    default: 'Remove',
  },
})

const emit = defineEmits([
  'click',
  'dismiss',
  'toggle',
  'update:selected',
])

const attrs = useAttrs() as Record<string, unknown>
const slots = useSlots()

const content = computed(() => normalize(slots.default?.() ?? []))

const hasCheckmark = computed(() => {
  const [, hasLeadingIcon] = content.value[0] ?? [null, false]

  return props.variant === 'filter'
    && props.selected
    && props.showCheckmark
    && !hasLeadingIcon
})

const rootClass = computed(() => {
  const hasText = content.value.some(([, isIcon]) => !isIcon)
  const [, hasLeadingIcon] = content.value[0] ?? [null, false]
  const [, hasTrailingIcon] = content.value[content.value.length - 1] ?? [null, false]

  return [attrs.class, {
    'm3-chip': true,
    ['m3-chip_' + props.variant]: true,
    'm3-chip_selected': props.selected,
    'm3-chip_disabled': props.disabled,
    'm3-chip_dismissible': props.dismissible,
    'm3-chip_has-leading-icon': hasText && hasLeadingIcon,
    'm3-chip_has-trailing-icon': hasText && hasTrailingIcon,
    'm3-chip_has-checkmark': hasCheckmark.value,
  }]
})
const rootStyle = computed(() => attrs.style as StyleValue | undefined)

const action = ref<HTMLButtonElement | null>(null)
const actionAttrs = computed(() => {
  const {
    class: _class,
    style: _style,
    ...rest
  } = attrs

  return rest
})
const actionRipple = ref<InstanceType<typeof M3Ripple> | null>(null)

const onActionClick = (event: MouseEvent) => {
  emit('click', event)

  if (!event.defaultPrevented && props.variant === 'filter') {
    emit('toggle', !props.selected)
    emit('update:selected', !props.selected)
  }
}

const onActionKeyup = (event: KeyboardEvent) => {
  if (event.code === 'Enter') {
    actionRipple.value?.activate(event)
  }
}

const dismiss = ref<HTMLButtonElement | null>(null)
const dismissRipple = ref<InstanceType<typeof M3Ripple> | null>(null)

const onDismissClick = (event: MouseEvent) => {
  event.stopPropagation()
  emit('dismiss')
}

const onDismissKeyup = (event: KeyboardEvent) => {
  if (event.code === 'Enter') {
    dismissRipple.value?.activate(event)
  }
}

const M3ChipContent = () => content.value.map(([node, isIcon], index) => h('span', {
  class: {
    'm3-chip__icon': isIcon,
    'm3-chip__label': !isIcon,
  },
  key: `chip-content-${index}`,
}, { ...node }))

defineExpose({
  click: () => action.value?.click(),
  focus: () => action.value?.focus(),
  blur: () => action.value?.blur(),
} satisfies Interactive)
</script>
