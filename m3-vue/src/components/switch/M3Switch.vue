<template>
    <span
        ref="root"
        :aria-checked="checked ? 'true' : 'false'"
        :aria-disabled="disabled ? 'true' : 'false'"
        :class="{
            'm3-switch': true,
            'm3-switch_checked': checked,
            'm3-switch_focused': focused,
            'm3-switch_disabled': disabled,
        }"
        role="switch"
        tabindex="0"
        @click="onClick"
        @focus="focus"
        @keydown.enter="click"
        @keydown.space="click"
    >
        <span
            :class="{
                'm3-switch__handle': true,
                'm3-switch__handle_has-icon': 'icon' in $slots,
            }"
            @mousedown="onMousedown"
            @touchstart="onTouchstart"
        >
            <span class="m3-switch__state" />
            <span class="m3-switch__checkmark">
                <slot
                    name="icon"
                    :checked="checked"
                    :focused="focused"
                    :disabled="disabled"
                />
            </span>
        </span>

        <input
            :id="id"
            ref="input"
            :name="name"
            :checked="checked"
            :disabled="disabled"
            type="checkbox"
            aria-hidden="true"
            class="m3-switch__input"
            tabindex="-1"
            @change="onChange"
            @focus="focused = true"
            @blur="focused = false"
        />
    </span>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'

import {
  onBeforeUnmount,
  ref,
} from 'vue'

import makeId from '@/utils/id'

const props = defineProps({
  id: {
    type: null as unknown as PropType<string | undefined>,
    validator: (id: unknown) => id === undefined || typeof id === 'string' && id.length > 0 && /^[A-Za-z]/.test(id),
    default: undefined,
  },

  name: {
    type: String,
    default: () => makeId('m3-switch'),
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

let dragged = false
let startX = 0

const getEventX = (event: MouseEvent | TouchEvent) => {
  if ('clientX' in event) {
    return event.clientX
  }

  return event.touches[0].clientX
}

const onMove = (event: MouseEvent | TouchEvent) => {
  const shiftX = getEventX(event) - startX

  dragged = Math.abs(shiftX) > 4

  if (shiftX > 4 && !props.checked) {
    emitUpdate(true)
  } else if (shiftX < -4 && props.checked) {
    emitUpdate(false)
  }
}

const stopMouseListening = () => {
  window.removeEventListener('mousemove', onMove)
  window.removeEventListener('mouseup', stopMouseListening)
}

const onMousedown = (event: MouseEvent) => {
  startX = getEventX(event)

  window.addEventListener('mousemove', onMove)
  window.addEventListener('mouseup', stopMouseListening)
}

const onTouchcancel = () => {
  dragged = false
}

const stopTouchListening = () => {
  dragged = false

  window.removeEventListener('touchmove', onMove)
  window.removeEventListener('touchcancel', onTouchcancel)
  window.removeEventListener('touchend', stopTouchListening)
}

const onTouchstart = (event: TouchEvent) => {
  startX = getEventX(event)

  window.addEventListener('touchmove', onMove)
  window.addEventListener('touchcancel', onTouchcancel)
  window.addEventListener('touchend', stopTouchListening)
}

const onClick = () => {
  if (!dragged) {
    click()
    focus()
  } else {
    dragged = false
  }
}

const onChange = (event: InputEvent) => {
  emitUpdate((event.target as HTMLInputElement).checked)
}

onBeforeUnmount(() => {
  stopMouseListening()
  stopTouchListening()
})
</script>