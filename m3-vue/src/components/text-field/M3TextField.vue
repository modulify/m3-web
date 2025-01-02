<template>
    <div
        :class="{
            'm3-text-field': true,
            'm3-text-field_outlined': outlined,
            'm3-text-field_multiline': multiline,
            'm3-text-field_has-leading': 'leading-icon' in $slots,
            'm3-text-field_has-trailing': 'trailing-icon' in $slots,
            'm3-text-field_filled': ('' + value).length,
            'm3-text-field_focused': focused,
            'm3-text-field_invalid': invalid,
            'm3-text-field_disabled': disabled,
            'm3-text-field_readonly': readonly,
        }"
        v-bind="{
            ...$attrs,
            ...(!(
                'aria-label' in $attrs ||
                'aria-labelledby' in $attrs
            ) && (label.length || 'label' in $slots) ? {
                'aria-labelledby': _id + '-label',
            } : {}),
        }"
        role="grid"
        @click="focus"
    >
        <div v-if="outlined" class="m3-text-field__outline">
            <div class="m3-text-field__outline-leading" />
            <div class="m3-text-field__outline-notch">
                <label
                    v-if="label.length || 'label' in $slots"
                    :id="_id + '-label'"
                    :for="_id"
                    class="m3-text-field__label"
                >
                    <slot name="label">{{ label }}</slot>
                </label>
            </div>
            <div class="m3-text-field__outline-trailing" />
        </div>

        <label
            v-else-if="label.length || 'label' in $slots"
            :id="_id + '-label'"
            :for="_id"
            class="m3-text-field__label"
        >
            <slot name="label">{{ label }}</slot>
        </label>

        <div class="m3-text-field__content">
            <div
                v-if="'leading-icon' in $slots"
                class="m3-text-field__icon"
                @click.stop
            >
                <slot name="leading-icon" />
            </div>

            <textarea
                v-if="multiline"
                :id="_id"
                ref="_input"
                :name="name"
                :value="value"
                :placeholder="placeholder"
                :disabled="disabled"
                :readonly="readonly"
                :aria-invalid="invalid ? 'true' : 'false'"
                @input="onInput"
                @change="onChange"
                @focus="onFocus"
                @blur="onBlur"
            />

            <input
                v-else
                :id="_id"
                ref="_input"
                :type="_type"
                :name="name"
                :value="value"
                :placeholder="placeholder"
                :disabled="disabled"
                :readonly="readonly"
                :aria-invalid="invalid ? 'true' : 'false'"
                @input="onInput"
                @change="onChange"
                @focus="onFocus"
                @blur="onBlur"
            />

            <div
                v-if="'trailing-icon' in $slots"
                class="m3-text-field__icon"
                @click.stop
            >
                <slot name="trailing-icon" />
            </div>
        </div>

        <div v-if="!outlined" class="m3-text-field__underline" />
    </div>
</template>

<script lang="ts" setup>
import type { Focusable } from '@modulify/m3-foundation'
import type { PropType } from 'vue'

import {
  computed,
  onMounted,
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

  type: {
    type: String,
    validator: (type: string) => [
      'email',
      'number',
      'password',
      'search',
      'tel',
      'text',
      'url',
    ].includes(type),
    default: 'text',
  },

  name: {
    type: null as unknown as PropType<string | undefined>,
    default: undefined,
  },

  value: {
    type: [String, Number],
    default: '',
  },

  label: {
    type: String,
    default: '',
  },

  placeholder: {
    type: String,
    default: '',
  },

  lazy: {
    type: Boolean,
    default: false,
  },

  multiline: {
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

  readonly: {
    type: Boolean,
    default: false,
  },

  outlined: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits([
  'input',
  'change',
  'update:value',
])

const _id = useId('m3-text-field', computed(() => props.id))
const _type = computed(() => props.type === 'number' ? 'text' : props.type)
const _input = ref<HTMLInputElement | HTMLTextAreaElement | null>(null)

const focused = ref(false)

const focus = () => _input.value?.focus()
const blur = () => _input.value?.blur()

defineExpose({
  focus,
  blur,
} satisfies Focusable)

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement
  const rawValue = target.value

  emit('input', rawValue)
  if (!props.lazy) {
    emit('update:value', rawValue)
  }
}

const onChange = (event: Event) => {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement
  const rawValue = target.value

  emit('change', rawValue)
  if (props.lazy) {
    emit('update:value', rawValue)
  }
}

const onFocus = () => {
  focused.value = true
}

const onBlur = () => {
  focused.value = false
}

onMounted(() => {
  const input = _input?.value
  if (input) {
    const value = String(props.value)
    if (value.length) {
      input.value = String(props.value)
    } else if (input.value.length) {
      emit('update:value', input.value)
    }
  }
})
</script>