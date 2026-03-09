<template>
    <fieldset :style="fieldsetStyle">
        <legend :style="legendStyle">
            {{ legend }}
        </legend>

        <label
            v-for="option in options"
            :key="option.value"
            :for="name + '-' + option.value"
            :style="labelStyle"
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
import { M3Radio } from '@/components/radio'

import { ref } from 'vue'

import useId from '@/composables/id'

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
  padding: 0,
  border: 'none',
  display: 'grid',
  gap: '12px',
  minWidth: '280px',
}

const legendStyle = {
  padding: 0,
  marginBottom: '8px',
  fontSize: '14px',
  lineHeight: '20px',
  color: 'var(--m3-sys-on-surface-variant)',
}

const labelStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
}
</script>
