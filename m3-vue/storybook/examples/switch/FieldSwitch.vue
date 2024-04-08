<template>
    <div class="flex-row">
        <label v-if="label.length" :for="id" class="mr-2">
            {{ label }}
        </label>

        <M3Switch
            :id="id"
            v-model:checked="checked"
            :disabled="disabled"
            class="ml-auto"
        />
    </div>
</template>

<script lang="ts" setup>
import { M3Switch } from '@/components/switch'

import makeId from '@/utils/id'
import { ref } from 'vue'

defineProps({
  label: {
    type: String,
    default: '',
  },

  disabled: {
    type: Boolean,
    default: false,
  },
})

const id = makeId('m3-switch')
const checked = ref(false)
</script>
