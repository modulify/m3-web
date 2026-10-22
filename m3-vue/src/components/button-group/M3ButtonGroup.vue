<template>
    <div
        ref="root"
        :class="[
            'm3-button-group',
            'm3-button-group_' + variant,
            'm3-button-group_' + size,
            'm3-button-group_' + rounding,
        ]"
        role="group"
        @focusin="onFocusin"
        @keydown="onKeydown"
    >
        <slot />
    </div>
</template>

<script lang="ts" setup>
import type { ElementReference } from '@modulify/m3-foundation/types/dom'
import type { PropType } from 'vue'
import type {
  Rounding,
  Selection,
  Size,
  Value,
  Variant,
} from '@modulify/m3-foundation/types/components/button-group'

import {
  computed,
  onMounted,
  onUpdated,
  provide,
  ref,
} from 'vue'

import { provideM3ButtonSize } from '@/components/button/injections'

import { ButtonGroupKey } from './context'

const props = defineProps({
  variant: {
    type: String as PropType<Variant>,
    default: 'standard',
  },
  size: {
    type: String as PropType<Size>,
    default: 'sm',
  },
  rounding: {
    type: String as PropType<Rounding>,
    default: 'round',
  },
  selection: {
    type: String as PropType<Selection>,
    default: undefined,
  },
  required: {
    type: Boolean,
    default: false,
  },
  value: {
    type: [String, Array, null] as unknown as PropType<Value | undefined>,
    default: undefined,
  },
  defaultValue: {
    type: [String, Array, null] as unknown as PropType<Value>,
    default: null,
  },
})

const emit = defineEmits<{
  'update:value': [value: Value];
  'change': [value: Value];
}>()

const root = ref<HTMLDivElement | null>(null)
const internalValue = ref<Value>(props.defaultValue)
const selection = computed<Selection>(() => props.selection ?? (props.variant === 'connected' ? 'single' : 'none'))
const currentValue = computed<Value>(() => props.value === undefined ? internalValue.value : props.value)

defineExpose({
  get el () { return root.value },
} satisfies ElementReference<HTMLDivElement>)

const selected = (itemValue: string) => selection.value === 'multiple'
  ? Array.isArray(currentValue.value) && currentValue.value.includes(itemValue)
  : selection.value === 'single' && currentValue.value === itemValue

const activate = (itemValue: string) => {
  if (selection.value === 'none') return

  let nextValue: Value

  if (selection.value === 'multiple') {
    const previous = Array.isArray(currentValue.value) ? currentValue.value : []
    nextValue = previous.includes(itemValue)
      ? previous.filter(item => item !== itemValue)
      : [...previous, itemValue]
    if (props.required && nextValue.length === 0) return
  } else {
    nextValue = currentValue.value === itemValue ? null : itemValue
    if (props.required && nextValue === null) return
  }

  if (props.value === undefined) internalValue.value = nextValue
  emit('update:value', nextValue)
  emit('change', nextValue)
}

provide(ButtonGroupKey, { variant: computed(() => props.variant), size: computed(() => props.size), rounding: computed(() => props.rounding), selection, selected, activate })
provideM3ButtonSize(() => props.size)

onMounted(() => {
  const buttons = Array.from(root.value?.querySelectorAll<HTMLButtonElement>(':scope > .m3-button-group__wrapper > .m3-button-group__item:not(:disabled)') ?? [])
  const focused = buttons.find(button => button === document.activeElement)
  const selectedButton = buttons.find(button => button.getAttribute('aria-pressed') === 'true')
  const tabStop = focused ?? selectedButton ?? buttons[0]
  buttons.forEach(button => button.tabIndex = button === tabStop ? 0 : -1)
})

onUpdated(() => {
  const buttons = Array.from(root.value?.querySelectorAll<HTMLButtonElement>(':scope > .m3-button-group__wrapper > .m3-button-group__item:not(:disabled)') ?? [])
  const focused = buttons.find(button => button === document.activeElement)
  const selectedButton = buttons.find(button => button.getAttribute('aria-pressed') === 'true')
  const tabStop = focused ?? selectedButton ?? buttons[0]
  buttons.forEach(button => button.tabIndex = button === tabStop ? 0 : -1)
})

const onFocusin = (event: FocusEvent) => {
  const button = event.target as HTMLButtonElement
  if (!button.matches('.m3-button-group__item:not(:disabled)')) return
  root.value?.querySelectorAll<HTMLButtonElement>('.m3-button-group__item:not(:disabled)').forEach(item => item.tabIndex = item === button ? 0 : -1)
}

const onKeydown = (event: KeyboardEvent) => {
  const { key } = event
  if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(key)) return

  const buttons = Array.from(root.value?.querySelectorAll<HTMLButtonElement>(':scope > .m3-button-group__wrapper > .m3-button-group__item:not(:disabled)') ?? [])
  const index = buttons.indexOf(event.target as HTMLButtonElement)
  if (index < 0 || buttons.length === 0) return

  const rtl = getComputedStyle(root.value!).direction === 'rtl'
  const previous = key === 'ArrowUp' || (key === 'ArrowLeft' && !rtl) || (key === 'ArrowRight' && rtl)
  const next = (index + (previous ? -1 : 1) + buttons.length) % buttons.length
  buttons.forEach(button => button.tabIndex = button === buttons[next] ? 0 : -1)
  buttons[next]?.focus()
  event.preventDefault()
}
</script>
