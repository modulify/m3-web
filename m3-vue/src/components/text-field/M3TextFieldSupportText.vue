<template>
    <div
        ref="root"
        :class="{
            'm3-text-field-support-text': true,
            'm3-text-field-support-text_danger': danger,
            'm3-text-field-support-text_muted': muted,
        }"
    >
        <slot>{{ text }}</slot>
    </div>
</template>

<script lang="ts" setup>
import type { ElementReference } from '@modulify/m3-foundation/types/dom'

import { ref } from 'vue'

defineProps({
  text: {
    type: String,
    default: '',
  },

  danger: {
    type: Boolean,
    default: false,
  },

  muted: {
    type: Boolean,
    default: false,
  },
})

const root = ref<HTMLDivElement | null>(null)

defineExpose({
  get el () { return root.value },
} satisfies ElementReference<HTMLDivElement>)
</script>
