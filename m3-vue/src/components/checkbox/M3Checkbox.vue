<template>
    <span
        ref="root"
        :class="{
            'm3-checkbox': true,
            'm3-checkbox_checked': checked,
            'm3-checkbox_indeterminate': indeterminate,
            'm3-checkbox_invalid': invalid,
            'm3-checkbox_disabled': disabled,
        }"
        v-bind="$attrs"
    >
        <M3Ripple :owner="ref(root)" />

        <input
            :id="_id"
            ref="_input"
            :name="_name"
            :aria-checked="checked ? 'true' : 'false'"
            :aria-invalid="invalid ? 'true' : 'false'"
            :value="value"
            :checked="checked"
            :disabled="disabled"
            type="checkbox"
            class="m3-checkbox__input"
            @change="onChange"
        />

        <span aria-hidden="true" class="m3-checkbox__state" />
        <span aria-hidden="true" class="m3-checkbox__checkmark">
            <IconIndeterminate v-if="indeterminate" />
            <IconCheckmark v-else-if="checked" />
        </span>
    </span>
</template>

<script lang="ts" setup generic="Model = boolean, Value = unknown">
import type { ElementReference, Interactable } from '@modulify/m3-foundation/types/dom'
import type { M3CheckboxProps } from './types'

import { computed } from 'vue'
import { isArray } from '@modulify/validator/predicates'
import { ref } from 'vue'

import { M3Ripple } from '@/components/ripple'

import { useId } from '@/composables/id'

import IconCheckmark from './assets/checkmark.svg'
import IconIndeterminate from './assets/indeterminate.svg'

const props = defineProps<M3CheckboxProps<Model, Value>>()

const emit = defineEmits<{
  /** Переключение чекбокса */
  change: [value: Model];
  /** Изменение значения модели */
  'update:model': [value: Model];
}>()

const root = ref<HTMLElement | null>(null)

const _id = useId('m3-checkbox', computed(() => props.id))
const _name = computed(() => props.name ?? _id.value)
const _input = ref<HTMLInputElement | null>(null)
const trueValue = computed((): Model => props.trueValue === undefined ? true as Model : props.trueValue)
const falseValue = computed((): Model => props.falseValue === undefined ? false as Model : props.falseValue)

defineExpose({
  get el () { return root.value },
  click: () => _input.value?.click(),
  focus: () => _input.value?.focus(),
  blur: () => _input.value?.blur(),
} satisfies ElementReference<HTMLElement> & Interactable)

const equals = (a: unknown, b: unknown) => props.equalsFn?.call(null, a, b) ?? a === b
const contains = (array: unknown[], value: unknown) => array.some(v => equals(v, value))

const checked = computed(() => {
  return isArray(props.model)
    ? contains(props.model, props.value)
    : equals(props.model, trueValue.value)
})

const calculate = (checked: boolean): Model => {
  if (isArray(props.model)) {
    return (checked
      ? (contains(props.model, props.value) ? props.model : [...props.model, props.value])
      : [...props.model].filter(v => !equals(v, props.value))) as Model
  }

  return checked ? trueValue.value : falseValue.value
}

const onChange = (event: Event) => {
  const value = calculate((event.target as HTMLInputElement).checked)

  emit('change', value)
  emit('update:model', value)
}
</script>
