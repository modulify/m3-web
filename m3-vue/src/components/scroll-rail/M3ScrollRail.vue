<template>
    <div
        ref="root"
        :class="{
            'm3-scroll-rail': true,
            'm3-scroll-rail_horizontal': horizontal,
            'm3-scroll-rail_active': dragging,
            'm3-scroll-rail_disabled': disabled || !enabled,
        }"
        v-bind="$attrs"
    >
        <div class="m3-scroll-rail__slider" />
    </div>
</template>

<script lang="ts" setup>
import type { ScrollRail } from '@modulify/m3-foundation/lib/scroll'

import {
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from 'vue'

import { createRail } from '@modulify/m3-foundation/lib/scroll'

const props = defineProps({
  horizontal: {
    type: Boolean,
    default: false,
  },

  disabled: {
    type: Boolean,
    default: false,
  },
})

const root = ref<HTMLElement | null>(null)
const rail = ref<ScrollRail | null>(null)
const dragging = ref(false)
const enabled = ref(false)

defineExpose({
  sync: () => rail.value?.sync(),
})

watch(() => props.horizontal, horizontal => {
  if (rail.value) { rail.value.horizontal = horizontal }
})

watch(() => props.disabled, disabled => {
  if (rail.value) { rail.value.disabled = disabled }
})

onMounted(() => {
  rail.value = createRail(root.value as HTMLElement, {
    horizontal: props.horizontal,
    disabled: props.disabled,
    onDragStart: () => dragging.value = true,
    onDragEnd: () => dragging.value = false,
    onToggle: active => enabled.value = active,
  })
  rail.value.init()
})

onBeforeUnmount(() => {
  rail.value?.destroy()
  rail.value = null
})
</script>
