<template>
    <div
        ref="root"
        :class="{
            'm3-list': true,
            [`m3-list_${appearance}`]: appearance !== 'standard',
        }"
        role="list"
    >
        <slot />
    </div>
</template>

<script lang="ts" setup>
import type { Appearance } from '@modulify/m3-foundation/types/components/list'
import type { ElementReference } from '@modulify/m3-foundation/types/dom'
import type { PropType } from 'vue'

import { ref } from 'vue'

defineProps({
  appearance: {
    type: String as PropType<Appearance>,
    validator: (value: string) => ['standard', 'segmented'].includes(value),
    default: 'standard',
  },
})

const root = ref<HTMLDivElement | null>(null)

defineExpose({
  get el () { return root.value },
} satisfies ElementReference<HTMLDivElement>)
</script>
