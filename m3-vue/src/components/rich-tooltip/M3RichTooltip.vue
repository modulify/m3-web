<template>
    <M3Popper
        :shown="shown"
        :target="target"
        :target-triggers="targetTriggers"
        :popper-triggers="popperTriggers"
        :hide-on-miss-click="hideOnMissClick"
        :placement="placement"
        :offset-main-axis="offsetMainAxis"
        :offset-cross-axis="offsetCrossAxis"
        :overflow="overflow"
        :boundary="boundary"
        :container="container"
        :strategy="strategy"
        :delay="delay"
        :detach-timeout="detachTimeout"
        :disabled="disabled"
        class="m3-rich-tooltip"
        role="tooltip"
    >
        <div class="m3-rich-tooltip__content">
            <h3
                v-if="'heading' in $slots"
                class="m3-rich-tooltip__heading"
            >
                <slot name="heading" />
            </h3>

            <slot />
        </div>

        <div
            v-if="'footer' in $slots"
            class="m3-rich-tooltip__footer"
        >
            <slot name="footer" />
        </div>
    </M3Popper>
</template>

<script lang="ts" setup>
import type {PropType, Ref} from 'vue'

import type {
  Boundary,
  Placement,
  Strategy,
} from '@floating-ui/dom'

import type {
  Delay,
  OverflowBehavior,
  Trigger,
  TriggerOptions,
} from '@modulify/m3-foundation/types/components/popper'

import { M3Popper } from '@/components/popper'

import {
  isHTMLElement,
  isNull,
  isNumeric,
  isString,
  oneOf,
} from '@modulify/m3-foundation/lib/predicates'

import {
  isBoundary,
  isOverflowBehavior,
  isTriggerOptions,
} from '@modulify/m3-foundation/lib/popper/predicates'

defineProps({
  target: {
    type: [Function, Object] as PropType<(() => Element | null) | Ref<Element | null>>,
    required: true,
  },

  targetTriggers: {
    type: [Array, Object] as PropType<Trigger[] | TriggerOptions>,
    validator: isTriggerOptions,
    default: () => ['click'],
  },

  popperTriggers: {
    type: [Array, Object] as PropType<Trigger[] | TriggerOptions>,
    validator: isTriggerOptions,
    default: () => [],
  },

  shown: {
    type: Boolean,
    default: false,
  },

  hideOnMissClick: {
    type: Boolean,
    default: false,
  },

  placement: {
    type: String as PropType<Placement>,
    default: 'bottom' as Placement,
  },

  offsetMainAxis: {
    type: [Number, String],
    validator: isNumeric,
    default: 8,
  },

  offsetCrossAxis: {
    type: [Number, String],
    validator: isNumeric,
    default: 0,
  },

  overflow: {
    type: Array as PropType<OverflowBehavior[]>,
    validator: isOverflowBehavior,
    default: (): OverflowBehavior[] => ['flip', 'shift', 'hide'],
  },

  boundary: {
    type: null as unknown as PropType<Boundary>,
    validator: isBoundary,
    default: 'clippingAncestors' as Boundary,
  },

  container: {
    type: null as unknown as PropType<string | HTMLElement>,
    validator: oneOf(isString, isHTMLElement),
    default: 'body',
  },

  strategy: {
    type: String as PropType<Strategy>,
    default: 'absolute' as Strategy,
  },

  delay: {
    type: [Number, String, Object] as PropType<number | string  |Delay>,
    validator: (value: number | string | Delay) => typeof value === 'object' || isNumeric(value),
    default: () => ({ hide: 150 }),
  },

  detachTimeout: {
    type: null as unknown as PropType<number | string | null>,
    validator: oneOf(isNull, isNumeric),
    default: 5000,
  },

  disabled: {
    type: Boolean,
    default: false,
  },
})
</script>