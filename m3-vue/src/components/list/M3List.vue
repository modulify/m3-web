<template>
    <div
        ref="root"
        :class="{
            'm3-list': true,
            'm3-list_divided': divided,
        }"
        role="list"
    >
        <slot />
    </div>
</template>

<script lang="ts" setup>
import type { ElementReference } from '@modulify/m3-foundation/types/dom'

import { ref } from 'vue'

defineProps({
  divided: {
    type: Boolean,
    default: false,
  },
})

const root = ref<HTMLDivElement | null>(null)

defineExpose({
  get el () { return root.value },
} satisfies ElementReference<HTMLDivElement>)
</script>
