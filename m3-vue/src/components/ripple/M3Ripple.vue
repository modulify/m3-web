<template>
    <span
        v-if="active"
        :style="{
            width: `${diameter}px`,
            height: `${diameter}px`,
            left: `${x - 0.5 * diameter}px`,
            top: `${y - 0.5 * diameter}px`,
        }"
        class="m3-ripple"
        @animationend="active = false"
    />
</template>

<script lang="ts" setup>
import type { PropType, Ref } from 'vue'

import {
  ref,
  watch,
} from 'vue'

const props = defineProps({
  owner: {
    type: null as unknown as PropType<Ref<HTMLElement | null>>,
    required: true,
  },

  centered: {
    type: Boolean,
    default: false,
  },
})

const diameter = ref(0)
const x = ref(0)
const y = ref(0)

const active = ref(false)

const activate = (event: KeyboardEvent | MouseEvent) => {
  active.value = false

  if (props.owner.value === null) {
    return
  }

  const el = props.owner.value
  const rect = el.getBoundingClientRect()

  diameter.value = Math.max(el.clientWidth, el.clientHeight)

  x.value = 'clientX' in event && !props.centered ? event.clientX - rect.x : el.clientWidth / 2
  y.value = 'clientY' in event && !props.centered ? event.clientY - rect.y : el.clientHeight / 2

  requestAnimationFrame(() => {
    active.value = true
  })
}

defineExpose({
  activate,
})

watch(() => props.owner.value, (curr, prev) => {
  if (curr && curr !== prev) {
    curr.addEventListener('click', activate, { passive: true })
  }

  if (prev && curr !== prev) {
    prev.removeEventListener('click', activate)
  }
}, { immediate: true })
</script>
