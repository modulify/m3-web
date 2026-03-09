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

<script lang="ts" setup>
import type { Interactive } from '@modulify/m3-foundation'
import type { PropType } from 'vue'

import { M3Ripple } from '@/components/ripple'

import {
  computed,
  ref,
} from 'vue'

import {
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
    default: true as unknown,
  },

  invalid: {
    type: Boolean,
    default: false,
  },

  disabled: {
    type: Boolean,
    default: false,
  },

  equalsFn: {
    type: Function as PropType<(a: unknown, b: unknown) => boolean>,
    default: (a: unknown, b: unknown): boolean => a === b,
  },
})

const emit = defineEmits([
  'change',
  'update:model',
])

const root = ref<HTMLElement | null>(null)

const _id = useId('m3-radio', computed(() => props.id))
const _input = ref<HTMLInputElement | null>(null)

defineExpose({
  click: () => _input.value?.click(),
  focus: () => _input.value?.focus(),
  blur: () => _input.value?.blur(),
} satisfies Interactive)

const equals = (a: unknown, b: unknown) => props.equalsFn.call(null, a, b)
const checked = computed(() => equals(props.model, props.value))

const onChange = (event: Event) => {
  if (!(event.target as HTMLInputElement).checked) {
    return
  }

  emit('change', props.value)
  emit('update:model', props.value)
}
</script>
