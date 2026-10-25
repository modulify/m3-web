<template>
    <M3ProgressCircle
        v-if="variant === 'circular'"
        ref="view"
        v-bind="$attrs"
        :shape="shape"
        :value="value"
        :indeterminate="indeterminate"
        :size="size"
        :thickness="thickness"
        :track="track"
    />
    <M3ProgressLine
        v-else
        ref="view"
        v-bind="$attrs"
        :shape="shape"
        :value="value"
        :indeterminate="indeterminate"
        :thickness="thickness"
        :track="track"
        :stop="stop"
    />
</template>

<script lang="ts" setup>
import type { ElementReference } from '@modulify/m3-foundation/types/dom'
import type {
  ProgressShape,
  ProgressVariant,
} from '@modulify/m3-foundation/types/components/progress'
import type { PropType } from 'vue'

import { ref } from 'vue'

import M3ProgressCircle from './M3ProgressCircle.vue'
import M3ProgressLine from './M3ProgressLine.vue'

defineOptions({ inheritAttrs: false })

defineProps({
  variant: {
    type: String as PropType<ProgressVariant>,
    default: 'linear',
  },
  shape: {
    type: String as PropType<ProgressShape>,
    default: 'flat',
  },
  value: {
    type: Number,
    default: 0,
  },
  indeterminate: {
    type: Boolean,
    default: false,
  },
  size: {
    type: Number,
    default: undefined,
  },
  thickness: {
    type: Number,
    default: undefined,
  },
  track: {
    type: Boolean,
    default: true,
  },
  stop: {
    type: Boolean,
    default: true,
  },
})

const view = ref<ElementReference<HTMLDivElement> | null>(null)

defineExpose({ get el () { return view.value?.el ?? null } } satisfies ElementReference<HTMLDivElement>)
</script>
