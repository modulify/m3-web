<template>
    <M3Button :appearance="appearance">
        <M3Icon v-if="icon.length" :name="icon" />

        <template v-if="label.length">
            {{ label }}
        </template>
    </M3Button>
</template>

<script lang="ts" setup>
import { M3Button } from '@/components/button'
import { M3Icon } from '@/components/icon'

import * as properties from '@/components/button/properties'

defineProps({
  appearance: properties.appearance,

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
