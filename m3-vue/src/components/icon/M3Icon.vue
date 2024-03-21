<template>
    <span
        :class="['m3-icon', 'm3-icon_' + appearanceActual]"
        v-bind="$attrs"
    >
        {{ name }}
    </span>
</template>

<script lang="ts" setup>
import type { PropType, Ref } from 'vue'
import type { Appearance } from '~types/components/icon'

import { M3IconAppearance } from '@/components/icon'
import {
  computed,
  inject,
  ref,
} from 'vue'

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
</script>