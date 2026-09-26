<template>
    <M3Popper
        ref="root"
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
import type { Boundary } from '@floating-ui/dom'
import type { Delay } from '@modulify/m3-foundation/types/components/popper'
import type { ElementReference } from '@modulify/m3-foundation/types/dom'
import type { M3PopperInstance } from '@/components/popper'
import type { OverflowBehavior } from '@modulify/m3-foundation/types/components/popper'
import type { Placement } from '@floating-ui/dom'
import type { PropType, Ref } from 'vue'
import type { Strategy } from '@floating-ui/dom'
import type {
  Trigger,
  TriggerSchema,
} from '@modulify/m3-foundation/types/components/popper'

import { isBoundary, isDelay } from '@modulify/m3-foundation/lib/popper/predicates'
import { isHTMLElement } from '@modulify/m3-foundation/lib/predicates'
import { isNull } from '@modulify/validator/predicates'
import { isNumeric } from '@modulify/m3-foundation/lib/predicates'
import {
  isOverflowBehavior,
  isPlacement,
} from '@modulify/m3-foundation/lib/popper/predicates'
import { isString } from '@modulify/validator/predicates'
import { isTriggerOptions } from '@modulify/m3-foundation/lib/popper/predicates'
import { Or } from '@modulify/validator/predicates'

import { ref } from 'vue'

import { M3Popper } from '@/components/popper'

defineProps({
  target: {
    type: [Function, Object] as PropType<(() => Element | null) | Ref<Element | null>>,
    required: true,
  },

  targetTriggers: {
    type: [Array, Object] as PropType<Trigger[] | TriggerSchema>,
    validator: isTriggerOptions,
    default: (): Trigger[] => ['click'],
  },

  popperTriggers: {
    type: [Array, Object] as PropType<Trigger[] | TriggerSchema>,
    validator: isTriggerOptions,
    default: (): Trigger[] => [],
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
    validator: isPlacement,
    default: 'bottom' as Placement,
  },

  strategy: {
    type: String as PropType<Strategy>,
    default: 'absolute' as Strategy,
  },

  boundary: {
    type: null as unknown as PropType<Boundary>,
    validator: isBoundary,
    default: 'clippingAncestors' as Boundary,
  },

  container: {
    type: null as unknown as PropType<string | HTMLElement>,
    validator: Or(isString, isHTMLElement) as (value: unknown) => boolean,
    default: 'body',
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

  delay: {
    type: [Number, String, Object] as PropType<number | string | Delay>,
    validator: isDelay,
    default: () => ({ hide: 150 }),
  },

  disabled: {
    type: Boolean,
    default: false,
  },

  detachTimeout: {
    type: null as unknown as PropType<number | string | null>,
    validator: Or(isNull, isNumeric) as (value: unknown) => boolean,
    default: 5000,
  },
})

const root = ref<M3PopperInstance | null>(null)

defineExpose({
  get el () { return root.value?.el ?? null },
} satisfies ElementReference<HTMLElement>)
</script>
