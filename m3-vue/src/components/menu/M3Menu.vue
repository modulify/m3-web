<template>
    <M3Popper
        :shown="shown"
        :target="target"
        :target-triggers="['click']"
        :placement="placement"
        :overflow="overflow"
        :strategy="strategy"
        :boundary="boundary"
        :container="container"
        :offset-main-axis="offsetMainAxis"
        :offset-cross-axis="offsetCrossAxis"
        :delay="delay"
        :disabled="disabled"
        :detach-timeout="detachTimeout"
        v-bind="$attrs"
        class="m3-menu"
        hide-on-miss-click
        @shown="$emit('shown')"
        @hide="$emit('hide')"
        @hidden="$emit('hidden')"
        @update:shown="$emit('update:shown', $event)"
    >
        <slot />
    </M3Popper>
</template>

<script lang="ts" setup>
import type {
  PropType,
  Ref,
} from 'vue'

import type {
  Boundary,
  Placement,
  Strategy,
} from '@floating-ui/dom'

import type {
  Delay,
  OverflowBehavior,
} from '@modulify/m3-foundation/types/components/popper'

import { M3Popper } from '@/components/popper'

import {
  isHTMLElement,
  isNull,
  isNumeric,
  isString,
  Or,
} from '@modulify/m3-foundation/lib/predicates'

import {
  isBoundary,
  isDelay,
  isPlacement,
} from '@modulify/m3-foundation/lib/popper/predicates'

defineProps({
  target: {
    type: [Function, Object] as PropType<(() => Element | null) | Ref<Element | null>>,
    required: true,
  },

  shown: {
    type: Boolean,
    default: false,
  },

  placement: {
    type: String as PropType<Placement>,
    validator: isPlacement,
    default: 'bottom',
  },

  offsetMainAxis: {
    type: [Number, String],
    validator: isNumeric,
    default: 0,
  },

  offsetCrossAxis: {
    type: [Number, String],
    validator: isNumeric,
    default: 0,
  },

  overflow: {
    type: Array as PropType<OverflowBehavior[]>,
    default: (): OverflowBehavior[] => ['flip', 'shift', 'hide'],
  },

  boundary: {
    type: null as unknown as PropType<Boundary>,
    validator: isBoundary,
    default: 'clippingAncestors',
  },

  container: {
    type: null as unknown as PropType<string | HTMLElement>,
    validator: Or(isString, isHTMLElement),
    default: 'body',
  },

  strategy: {
    type: String as PropType<Strategy>,
    default: 'absolute',
  },

  delay: {
    type: [Number, String, Object] as PropType<number | string | Delay>,
    validator: isDelay,
    default: () => ({ hide: 200 }),
  },

  detachTimeout: {
    type: null as unknown as PropType<number | string | null>,
    validator: Or(isNull, isNumeric),
    default: 5000,
  },

  disabled: {
    type: Boolean,
    default: false,
  },
})

defineEmits([
  'shown',
  'hide',
  'hidden',
  'update:shown',
])
</script>