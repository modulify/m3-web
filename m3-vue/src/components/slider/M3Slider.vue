<template>
    <div
        :class="{
            'm3-slider': true,
            'm3-slider_range': type === 'range',
            'm3-slider_disabled': disabled,
        }"
        v-bind="$attrs"
    >
        <div ref="track" class="m3-slider__track">
            <div class="m3-slider__scale">
                <div class="m3-slider__notch" />
                <div class="m3-slider__notch" />
                <div class="m3-slider__notch m3-slider__notch_active" />
                <div class="m3-slider__notch m3-slider__notch_active" />
                <div class="m3-slider__notch" />
                <div class="m3-slider__notch" />
            </div>

            <div
                v-if="type === 'range'"
                :style="{ '--percentage': `${percentage.min}%` }"
                class="m3-slider__value m3-slider__value_min"
            >
                <div
                    ref="handleMin"
                    :aria-valuemax="current[1]"
                    :aria-valuemin="min"
                    :aria-valuenow="current[0]"
                    class="m3-slider__handle"
                    role="slider"
                    @mousedown="onStartDraggingMin"
                />
            </div>

            <div
                :style="{ '--percentage': `${percentage.max}%` }"
                class="m3-slider__value m3-slider__value_max"
            >
                <div
                    ref="handleMax"
                    :aria-valuemax="max"
                    :aria-valuemin="type === 'range' ? current[0] : min"
                    :aria-valuenow="current[1]"
                    class="m3-slider__handle"
                    role="slider"
                    @mousedown="onStartDraggingMax"
                />
            </div>

            <div
                v-if="type === 'range'"
                :style="{ '--percentage': `${percentage.min}%` }"
                class="m3-slider__filler m3-slider__filler_min"
            />

            <div
                :style="{
                    '--percentage': type === 'range'
                        ? `${percentage.max - percentage.min}%`
                        : `${percentage.max}%`,
                }"
                class="m3-slider__filler m3-slider__filler_active"
            />

            <div
                :style="{ '--percentage': `${100 - percentage.max}%` }"
                class="m3-slider__filler m3-slider__filler_max"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'

import {
  computed,
  nextTick,
  onBeforeUnmount,
  reactive,
  ref,
} from 'vue'

const props = defineProps({
  type: {
    type: String as PropType<'single' | 'range'>,
    default: 'single',
  },

  value: {
    type: null as unknown as PropType<number | [number, number] | null>,
    default: null,
  },

  max: {
    type: Number,
    default: 100,
  },

  min: {
    type: Number,
    default: 0,
  },

  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits([
  'update:value',
])

const restrict = (value: number, [min, max]) => Math.max(Math.min(max, value), min)

const current = computed(() => {
  if (Array.isArray(props.value)) {
    return props.value
  }

  return props.value === null
    ? [props.min, props.max]
    : [props.value, props.value]
})

const dragging = reactive({
  max: null as number | null,
  min: null as number | null,
})

const percentage = computed(() => {
  const [_min, _max] = current.value

  const percentage = (value: number) => {
    return 100 * Math.abs(restrict(value, [props.min, props.max]) / (props.max - props.min));
  }

  return {
    max: dragging.max ?? percentage(_max),
    min: dragging.min ?? percentage(_min),
  }
})

const track = ref<HTMLElement | null>(null)
const handleMax = ref<HTMLElement | null>(null)
const handleMin = ref<HTMLElement | null>(null)

const getEventX = (event: MouseEvent | TouchEvent) => {
  return 'clientX' in event ? event.clientX : event.touches[0].clientX
}

const getEventShare = (event: MouseEvent | TouchEvent) => {
  const _track = track.value
  if (!_track) {
    return null
  }

  const distance = _track.offsetWidth
  const { left, right } = _track.getBoundingClientRect()

  return distance > 0
    ? (restrict(getEventX(event), [left, right]) - left) / distance
    : null
}

const onMoveMax = (event: MouseEvent | TouchEvent) => {
  const share = getEventShare(event)
  const value = props.min + (props.max - props.min) * share

  dragging.max = share * 100

  emit('update:value', props.type === 'single' ? value : [current.value[0], value])

  nextTick(() => dragging.max = null)
}

const stopMouseListeningForMax = () => {
  window.removeEventListener('mousemove', onMoveMax)
  window.removeEventListener('mouseup', stopMouseListeningForMax)
}

const onStartDraggingMax = () => {
  window.addEventListener('mousemove', onMoveMax)
  window.addEventListener('mouseup', stopMouseListeningForMax)
}

const onMoveMin = (event: MouseEvent | TouchEvent) => {
  if (props.type === 'single') {
    return
  }

  const share = getEventShare(event)
  const value = props.min + (props.max - props.min) * share

  dragging.min = share * 100

  emit('update:value', [value, current.value[1]])

  nextTick(() => dragging.min = null)
}

const stopMouseListeningForMin = () => {
  window.removeEventListener('mousemove', onMoveMin)
  window.removeEventListener('mouseup', stopMouseListeningForMin)
}

const onStartDraggingMin = () => {
  window.addEventListener('mousemove', onMoveMin)
  window.addEventListener('mouseup', stopMouseListeningForMin)
}

onBeforeUnmount(() => {
  stopMouseListeningForMax()
  stopMouseListeningForMin()
})
</script>
