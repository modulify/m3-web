<template>
    <span
        ref="root"
        :class="{
            'm3-badge': true,
            'm3-badge_labelled': 'default' in $slots || label.length,
        }"
        role="status"
    >
        <slot>{{ label }}</slot>
    </span>
</template>

<script lang="ts" setup>
import type { ElementReference } from '@modulify/m3-foundation/types/dom'

import { ref } from 'vue'

defineProps({
  label: {
    type: String,
    default: '',
  },
})

const root = ref<HTMLSpanElement | null>(null)

defineExpose({
  get el () { return root.value },
} satisfies ElementReference<HTMLSpanElement>)
</script>
