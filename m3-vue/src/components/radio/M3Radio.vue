<template>
    <span
        ref="root"
        :class="{
            'm3-radio': true,
            'm3-radio_checked': checked,
            'm3-radio_invalid': invalid,
            'm3-radio_disabled': disabled,
        }"
        v-bind="$attrs"
    >
        <M3Ripple :owner="ref(root)" />

        <input
            :id="_id"
            ref="_input"
            :name="name"
            :aria-checked="checked ? 'true' : 'false'"
            :aria-invalid="invalid ? 'true' : 'false'"
            :aria-disabled="disabled ? 'true' : 'false'"
            :checked="checked"
            :disabled="disabled"
            type="radio"
            class="m3-radio__input"
            @change="onChange"
        />

        <span aria-hidden="true" class="m3-radio__state" />
        <span aria-hidden="true" class="m3-radio__icon" />
    </span>
</template>

<script lang="ts" setup generic="Value = boolean">
import type { ElementReference, Interactable } from '@modulify/m3-foundation/types/dom'
import type { M3RadioProps } from './types'

import { computed } from 'vue'
import { ref } from 'vue'

import { M3Ripple } from '@/components/ripple'

import { useId } from '@/composables/id'

const props = defineProps<M3RadioProps<Value>>()

const emit = defineEmits<{
  change: [value: Value];
  'update:model': [value: Value];
}>()

const root = ref<HTMLElement | null>(null)

const _id = useId('m3-radio', computed(() => props.id))
const _input = ref<HTMLInputElement | null>(null)
const value = computed((): Value => props.value === undefined ? true as Value : props.value)

defineExpose({
  get el () { return root.value },
  click: () => _input.value?.click(),
  focus: () => _input.value?.focus(),
  blur: () => _input.value?.blur(),
} satisfies ElementReference<HTMLElement> & Interactable)

const equals = (a: Value | undefined, b: Value) => props.equalsFn?.call(null, a, b) ?? a === b
const checked = computed(() => equals(props.model, value.value))

const onChange = (event: Event) => {
  if (!(event.target as HTMLInputElement).checked) {
    return
  }

  emit('change', value.value)
  emit('update:model', value.value)
}
</script>
