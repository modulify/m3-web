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

import { ref } from 'vue'
import useId from '@/composables/id'

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

const id = useId('m3-switch')
const checked = ref(false)
</script>
