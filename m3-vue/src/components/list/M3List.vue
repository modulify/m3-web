<template>
    <ul
        ref="root"
        :class="{
            'm3-list': true,
            'm3-list_divided': divided,
        }"
    >
        <slot />
    </ul>
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

const root = ref<HTMLUListElement | null>(null)

defineExpose({
  get el () { return root.value },
} satisfies ElementReference<HTMLUListElement>)
</script>
