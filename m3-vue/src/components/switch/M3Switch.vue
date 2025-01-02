<template>
    <span
        :class="{
            'm3-switch': true,
            'm3-switch_checked': checked,
            'm3-switch_disabled': disabled,
        }"
        v-bind="$attrs"
    >
        <input
            :id="_id"
            ref="_input"
            :name="name"
            :aria-checked="checked ? 'true' : 'false'"
            :aria-disabled="disabled ? 'true' : 'false'"
            :checked="checked"
            :disabled="disabled"
            type="checkbox"
            role="switch"
            class="m3-switch__input"
            @click="onClick"
            @change="onChange"
            @keydown.enter="click"
            @mousedown="onMouseDown"
            @touchstart="onTouchStart"
        />

        <span
            :class="{
                'm3-switch__handle': true,
                'm3-switch__handle_has-icon': 'default' in $slots,
            }"
            aria-hidden="true"
        >
            <span class="m3-switch__state" />
            <span class="m3-switch__checkmark">
                <slot :checked="checked" :disabled="disabled" />
            </span>
        </span>
    </span>
</template>

<script lang="ts" setup>
import type { Interactive } from '@modulify/m3-foundation'
import type { PropType } from 'vue'

import {
  computed,
  onBeforeUnmount,
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

  checked: {
    type: Boolean,
    default: false,
  },

  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits([
  'change',
  'update:checked',
])

const emitUpdate = (value: boolean) => {
  emit('change', value)
  emit('update:checked', value)
}

const _id = useId('m3-switch', computed(() => props.id))
const _input = ref<HTMLInputElement | null>(null)

const click = () => _input.value?.click()

defineExpose({
  click,
  focus: () => _input.value?.focus(),
  blur: () => _input.value?.blur(),
} satisfies Interactive)

let dragging = false
let startX = 0

const getEventX = (event: MouseEvent | TouchEvent) => {
  return 'clientX' in event ? event.clientX : event.touches[0].clientX
}

const DRAG_THRESHOLD = 4

const onMove = (event: MouseEvent | TouchEvent) => {
  const shiftX = getEventX(event) - startX

  dragging = Math.abs(shiftX) > DRAG_THRESHOLD

  if (shiftX > DRAG_THRESHOLD && !props.checked) {
    emitUpdate(true)
  } else if (shiftX < -1 * DRAG_THRESHOLD && props.checked) {
    emitUpdate(false)
  }
}

const stopMouseListening = () => {
  window.removeEventListener('mousemove', onMove)
  window.removeEventListener('mouseup', stopMouseListening)
}

const onMouseDown = (event: MouseEvent) => {
  startX = getEventX(event)

  window.addEventListener('mousemove', onMove)
  window.addEventListener('mouseup', stopMouseListening)
}

const onTouchCancel = () => {
  dragging = false
  stopTouchListening()
}

const stopTouchListening = () => {
  dragging = false

  window.removeEventListener('touchmove', onMove)
  window.removeEventListener('touchcancel', onTouchCancel)
  window.removeEventListener('touchend', stopTouchListening)
}

const onTouchStart = (event: TouchEvent) => {
  startX = getEventX(event)

  window.addEventListener('touchmove', onMove)
  window.addEventListener('touchcancel', onTouchCancel)
  window.addEventListener('touchend', stopTouchListening)
}

const onClick = (event: Event) => {
  if (dragging) {
    event.preventDefault()
    dragging = false
  }
}

const onChange = (event: Event) => {
  emitUpdate((event.target as HTMLInputElement).checked)
}

onBeforeUnmount(() => {
  stopMouseListening()
  stopTouchListening()
})
</script>