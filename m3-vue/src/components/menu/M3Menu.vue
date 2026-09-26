<template>
    <M3Popper
        ref="root"
        :target="target"
        :shown="shown"
        :target-triggers="['click']"
        :disabled="disabled"
        :delay="delay"
        :detach-timeout="detachTimeout"
        :placement="placement"
        :strategy="strategy"
        :boundary="boundary"
        :container="container"
        :overflow="overflow"
        :offset-main-axis="offsetMainAxis"
        :offset-cross-axis="offsetCrossAxis"
        class="m3-menu"
        animated
        hide-on-miss-click
        v-bind="$attrs"
        @shown="$emit('shown')"
        @hide="$emit('hide')"
        @hidden="$emit('hidden')"
        @update:shown="$emit('update:shown', $event)"
    >
        <slot />
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

import { isBoundary, isDelay } from '@modulify/m3-foundation/lib/popper/predicates'
import { isHTMLElement } from '@modulify/m3-foundation/lib/predicates'
import { isNull } from '@modulify/validator/predicates'
import { isNumeric } from '@modulify/m3-foundation/lib/predicates'
import { isPlacement } from '@modulify/m3-foundation/lib/popper/predicates'
import { isString } from '@modulify/validator/predicates'
import { Or } from '@modulify/validator/predicates'

import { ref } from 'vue'

import { M3Popper } from '@/components/popper'

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

  strategy: {
    type: String as PropType<Strategy>,
    default: 'absolute',
  },

  boundary: {
    type: null as unknown as PropType<Boundary>,
    validator: isBoundary,
    default: 'clippingAncestors',
  },

  container: {
    type: null as unknown as PropType<string | HTMLElement>,
    validator: Or(isString, isHTMLElement) as (value: unknown) => boolean,
    default: 'body',
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

  delay: {
    type: [Number, String, Object] as PropType<number | string | Delay>,
    validator: isDelay,
    default: () => ({ hide: 200 }),
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

defineEmits([
  'shown',
  'hide',
  'hidden',
  'update:shown',
])
</script>
