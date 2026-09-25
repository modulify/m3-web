<template>
    <span
        ref="root"
        :class="['m3-icon', 'm3-icon_' + appearanceActual]"
        v-bind="$attrs"
    >
        {{ name }}
    </span>
</template>

<script lang="ts" setup>
import type { Appearance } from '@modulify/m3-foundation/types/components/icon'
import type { ElementReference } from '@modulify/m3-foundation/types/dom'
import type { PropType, Ref } from 'vue'

import { computed, inject, ref } from 'vue'

import { M3IconAppearance } from '@/components/icon'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },

  appearance: {
    type: String as PropType<Appearance>,
    default: 'outlined',
  },
})

const appearanceInherited = inject<Ref<Appearance | null>>(M3IconAppearance, ref(null))
const appearanceActual = computed(() => appearanceInherited.value ?? props.appearance)
const root = ref<HTMLSpanElement | null>(null)

defineExpose({
  get el () { return root.value },
} satisfies ElementReference<HTMLSpanElement>)
</script>
