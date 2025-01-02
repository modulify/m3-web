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
            :aria-checked="checked ? 'true' : 'false'"
            :aria-invalid="invalid ? 'true' : 'false'"
            :name="_name"
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

<script lang="ts" setup>
import type { Interactive } from '@modulify/m3-foundation'
import type { PropType } from 'vue'

import IconCheckmark from '@modulify/m3-foundation/assets/sprites/checkbox/checkmark.svg'
import IconIndeterminate from '@modulify/m3-foundation/assets/sprites/checkbox/indeterminate.svg'
import { M3Ripple } from '@/components/ripple'

import {
  computed,
  ref,
} from 'vue'

import {
  isArray,
  isId,
  isUndefined,
  Or,
} from '@modulify/m3-foundation/lib/predicates'

import useId from '@/composables/id'

const props = defineProps({
  id: {
    type: null as unknown as PropType<string | undefined>,
    validator: Or(isId, isUndefined),
    default: undefined,
  },

  name: {
    type: null as unknown as PropType<string | undefined>,
    default: undefined,
  },

  model: {
    type: null as unknown as PropType<unknown>,
    default: undefined as unknown,
  },

  value: {
    type: null as unknown as PropType<unknown>,
    default: undefined as unknown,
  },

  indeterminate: {
    type: Boolean,
    default: false,
  },

  invalid: {
    type: Boolean,
    default: false,
  },

  disabled: {
    type: Boolean,
    default: false,
  },

  trueValue: {
    type: null as unknown as PropType<never>,
    default: true,
  },

  falseValue: {
    type: null as unknown as PropType<never>,
    default: false,
  },

  equalsFn: {
    type: Function as PropType<(a: unknown, b: unknown) => boolean>,
    default: (a: unknown, b: unknown): boolean => a === b,
  },
})

const emit = defineEmits([
  /** Переключение чекбокса */
  'change',
  /** Изменение значения модели */
  'update:model',
])

const root = ref<HTMLElement | null>(null)

const _id = useId('m3-checkbox', computed(() => props.id))
const _name = computed(() => props.name ?? _id.value)
const _input = ref<HTMLInputElement | null>(null)

defineExpose({
  click: () => _input.value?.click(),
  focus: () => _input.value?.focus(),
  blur: () => _input.value?.blur(),
} satisfies Interactive)

const equals = (a: unknown, b: unknown) => props.equalsFn.call(null, a, b)
const contains = (array: unknown[], value: unknown) => array.some(v => equals(v, value))

const checked = computed(() => {
  return isArray(props.model)
    ? contains(props.model, props.value)
    : equals(props.model, props.trueValue)
})

const calculate = (checked: boolean) => {
  if (isArray(props.model)) {
    return checked
      ? (contains(props.model, props.value) ? props.model : [...props.model, props.value])
      : [...props.model].filter(v => !equals(v, props.value))
  }

  return checked ? props.trueValue : props.falseValue
}

const onChange = (event: Event) => {
  const value = calculate((event.target as HTMLInputElement).checked)

  emit('change', value)
  emit('update:model', value)
}
</script>
