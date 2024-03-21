<template>
    <M3FabButton :variant="variant" :size="size">
        <M3Icon v-if="icon.length" :name="icon" />

        <template v-if="label.length">
            {{ label }}
        </template>
    </M3FabButton>
</template>

<script lang="ts" setup>
import { M3FabButton } from '@/components/fab-button'
import { M3Icon } from '@/components/icon'

import * as properties from '@/components/fab-button/properties'

defineProps({
  variant: properties.variant,

  size: properties.size,

  icon: {
    type: String,
    default: '',
  },

  label: {
    type: String,
    default: '',
  },
})
</script>