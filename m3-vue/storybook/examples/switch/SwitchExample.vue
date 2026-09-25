<template>
    <div class="flex-row">
        <label v-if="label.length" :for="uid" class="mr-2">
            {{ label }}
        </label>

        <M3Switch
            :id="uid"
            v-model:checked="checked"
            :disabled="disabled"
            class="ml-auto"
        />
    </div>
</template>

<script lang="ts" setup>
import { ref, useId } from 'vue'

import { M3Switch } from '@/components/switch'

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

const uid = useId()
const checked = ref(false)
</script>
