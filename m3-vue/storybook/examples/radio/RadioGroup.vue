<template>
    <fieldset :style="fieldsetStyle" class="d-grid gap-3">
        <legend :style="legendStyle" class="p-0 mb-2">
            {{ legend }}
        </legend>

        <label
            v-for="option in options"
            :key="option.value"
            :for="name + '-' + option.value"
            class="flex-row gap-3"
        >
            <M3Radio
                :id="name + '-' + option.value"
                :name="name"
                :model="model"
                :value="option.value"
                :invalid="invalid"
                :disabled="option.disabled"
                @update:model="model = $event"
            />

            <span>{{ option.label }}</span>
        </label>
    </fieldset>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import { M3Radio } from '@/components/radio'

import { useId } from '@/composables/id'

export interface RadioOption {
  label: string;
  value: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<{
  legend?: string;
  options: RadioOption[];
  invalid?: boolean;
}>(), {
  legend: 'Selection',
  invalid: false,
})

const name = useId('m3-radio-group')
const model = ref(props.options[0]?.value)

const fieldsetStyle = {
  margin: 0,
  border: 'none',
  minWidth: '280px',
}

const legendStyle = {
  fontSize: '14px',
  lineHeight: '20px',
  color: 'var(--m3-sys-on-surface-variant)',
}

</script>
