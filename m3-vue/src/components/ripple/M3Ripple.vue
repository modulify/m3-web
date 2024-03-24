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
  onBeforeUnmount,
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

let lastKey: string | null = null

const rememberKey = (event: KeyboardEvent) => {
  lastKey = event.code
}

const activate = (event: KeyboardEvent | MouseEvent) => {
  active.value = false

  if (props.owner.value === null) {
    return
  }

  const el = props.owner.value
  const rect = el.getBoundingClientRect()
  const center = props.centered || lastKey === 'Space'

  diameter.value = Math.max(el.clientWidth, el.clientHeight)

  x.value = 'clientX' in event && !center ? event.clientX - rect.x : el.clientWidth / 2
  y.value = 'clientY' in event && !center ? event.clientY - rect.y : el.clientHeight / 2

  requestAnimationFrame(() => {
    active.value = true
  })
}

defineExpose({
  activate,
})

watch(() => props.owner.value, (curr, prev) => {
  if (curr && curr !== prev) {
    curr.addEventListener('keyup', rememberKey, { passive: true })
    curr.addEventListener('click', activate, { passive: true })
  }

  if (prev && curr !== prev) {
    prev.removeEventListener('click', activate)
    prev.removeEventListener('keyup', rememberKey)
  }
}, { immediate: true })

onBeforeUnmount(() => {
  const el = props.owner.value

  el.removeEventListener('click', activate)
  el.removeEventListener('keyup', rememberKey)
})
</script>
