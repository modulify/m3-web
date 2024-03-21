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
                v-if="'subheading' in $slots"
                class="m3-rich-tooltip__subheading"
            >
                <slot name="subheading" />
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
import type { PropType } from 'vue'

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
} from '~types/components/popper'

import { M3Popper } from '@/components/popper'

import {
  isTriggerArray,
  isTriggerOptions,
} from '@/components/popper/validators'

defineProps({
  shown: {
    type: Boolean,
    default: false,
  },

  target: {
    type: Function as PropType<() => Element>,
    required: true,
  },

  targetTriggers: {
    type: [Array, Object] as PropType<Trigger[] | TriggerOptions>,
    validator: (triggers: unknown) => isTriggerArray(triggers) || isTriggerOptions(triggers),
    default: () => ['click'],
  },

  popperTriggers: {
    type: [Array, Object] as PropType<Trigger[] | TriggerOptions>,
    validator: (triggers: unknown) => isTriggerArray(triggers) || isTriggerOptions(triggers),
    default: () => [],
  },

  hideOnMissClick: {
    type: Boolean,
    default: false,
  },

  placement: {
    type: String as PropType<Placement>,
    default: 'bottom',
  },

  offsetMainAxis: {
    type: [Number, String],
    validator: (value: number|string) => !isNaN(Number(value)),
    default: 8,
  },

  offsetCrossAxis: {
    type: [Number, String],
    validator: (value: number|string) => !isNaN(Number(value)),
    default: 0,
  },

  overflow: {
    type: Array as PropType<OverflowBehavior[]>,
    default: (): OverflowBehavior[] => ['flip', 'shift', 'hide'],
  },

  boundary: {
    type: null as unknown as PropType<Boundary>,
    validator: (boundary: unknown) => {
      return boundary === 'clippingAncestors' ||
        boundary instanceof Element ||
        Array.isArray(boundary) && boundary.every(b => b instanceof Element)
    },
    default: 'clippingAncestors',
  },

  container: {
    type: null as unknown as PropType<string | HTMLElement>,
    validator: (container: unknown) => typeof container === 'string' || container instanceof HTMLElement,
    default: 'body',
  },

  strategy: {
    type: String as PropType<Strategy>,
    default: 'absolute',
  },

  delay: {
    type: [Number, String, Object] as PropType<number|string|Delay>,
    validator: (value: number|string|Delay) => typeof value === 'object' || !isNaN(Number(value)),
    default: () => ({ hide: 150 }),
  },

  detachTimeout: {
    type: null as unknown as PropType<number|string|null>,
    default: 5000,
  },

  disabled: {
    type: Boolean,
    default: false,
  },
})
</script>