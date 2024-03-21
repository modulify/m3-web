<template>
    <span
        ref="root"
        :aria-checked="checked ? 'true' : 'false'"
        :aria-disabled="disabled ? 'true' : 'false'"
        :class="{
            'm3-checkbox': true,
            'm3-checkbox_checked': checked,
            'm3-checkbox_focused': focused,
            'm3-checkbox_indeterminate': indeterminate,
            'm3-checkbox_invalid': invalid,
            'm3-checkbox_disabled': disabled,
        }"
        role="checkbox"
        tabindex="0"
        @click="onClick"
        @focus="focus"
        @keydown.space="click"
    >
        <M3Ripple :owner="ref(root)" />

        <span class="m3-checkbox__state" />

        <input
            :id="id"
            ref="input"
            :name="name"
            :value="value"
            :checked="checked"
            :disabled="disabled"
            v-bind="$attrs"
            type="checkbox"
            class="m3-checkbox__input"
            @change="onChange"
            @focus="focused = true"
            @blur="focused = false"
        />

        <span class="m3-checkbox__checkmark">
            <IconIndeterminate v-if="indeterminate" />
            <IconCheckmark v-else-if="checked" />
        </span>
    </span>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'

import IconCheckmark from './checkmark.svg'
import IconIndeterminate from './indeterminate.svg'
import { M3Ripple } from '@/components/ripple'

import {
  computed,
  ref,
} from 'vue'

import makeId from '@/utils/id'

const isArray = Array.isArray

const props = defineProps({
  id: {
    type: null as unknown as PropType<string | undefined>,
    validator: (id: unknown) => id === undefined || typeof id === 'string' && id.length > 0 && /^[A-Za-z]/.test(id),
    default: undefined,
  },

  name: {
    type: String,
    default: () => makeId('m3-checkbox'),
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
const input = ref<HTMLInputElement | null>(null)
const focused = ref(false)

const click = () => input.value?.click()
const focus = () => input.value?.focus()
const blur = () => input.value?.blur()

defineExpose({
  click,
  focus,
  blur,
})

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

const onChange = (event: InputEvent) => {
  const input = event.target as HTMLInputElement
  const value = calculate(input.checked)

  emit('change', value)
  emit('update:model', value)
}

const onClick = () => {
  click()
  focus()
}
</script>
