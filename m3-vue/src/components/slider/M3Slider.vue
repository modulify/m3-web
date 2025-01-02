<template>
    <div
        :class="{
            'm3-slider': true,
            'm3-slider_range': type === 'range',
            'm3-slider_stepped': steps.length > 0,
            'm3-slider_disabled': disabled,
        }"
        role="group"
        v-bind="$attrs"
        @keydown.space="keys.space = true"
        @keyup.space="keys.space = false"
    >
        <div ref="track" class="m3-slider__track">
            <div class="m3-slider__scale">
                <div
                    :ref="addNotch"
                    :aria-label="String(min)"
                    class="m3-slider__notch"
                    style="--percentage: 0%"
                    role="button"
                    @click="onNotchMinClick"
                >
                    <div class="m3-slider__notch-control" />
                </div>

                <div
                    v-for="(p, i) in steps"
                    :ref="addNotch"
                    :key="p"
                    :aria-label="String(p)"
                    :style="`--percentage: ${percentageOf(p)}%;`"
                    class="m3-slider__notch"
                    role="button"
                    @click="onNotchClick(p, i + 1)"
                >
                    <div class="m3-slider__notch-control" />
                </div>

                <div
                    :ref="addNotch"
                    :aria-label="String(max)"
                    class="m3-slider__notch"
                    style="--percentage: 100%"
                    role="button"
                    @click="onNotchMaxClick"
                >
                    <div class="m3-slider__notch-control" />
                </div>
            </div>

            <div
                v-if="type === 'range'"
                :style="{ '--percentage': `${percentage.min}%` }"
                class="m3-slider__value m3-slider__value_min"
                @transitionend="updateNotches"
            >
                <div
                    ref="handleMin"
                    :aria-valuemax="current[1]"
                    :aria-valuemin="min"
                    :aria-valuenow="current[0]"
                    :aria-disabled="disabled ? 'true' : 'false'"
                    class="m3-slider__handle"
                    role="slider"
                    tabindex="0"
                    v-bind="ariaOptionsToAttrs(ariaHandleMin)"
                    @keydown="onKeyDownForMin"
                    @mousedown.left="onStartDraggingMin"
                />
            </div>

            <div
                :style="{ '--percentage': `${percentage.max}%` }"
                class="m3-slider__value m3-slider__value_max"
                @transitionend="updateNotches"
            >
                <div
                    ref="handleMax"
                    :aria-valuemax="max"
                    :aria-valuemin="type === 'range' ? current[0] : min"
                    :aria-valuenow="current[1]"
                    :aria-disabled="disabled ? 'true' : 'false'"
                    class="m3-slider__handle"
                    role="slider"
                    tabindex="0"
                    v-bind="ariaOptionsToAttrs({
                        ...ariaHandle,
                        ...ariaHandleMax,
                    })"
                    @keydown="onKeyDownForMax"
                    @mousedown.left="onStartDraggingMax"
                />
            </div>

            <div
                v-if="type === 'range'"
                ref="fillerMin"
                :style="{ '--percentage': `${percentage.min}%` }"
                class="m3-slider__filler m3-slider__filler_min"
            />

            <div
                ref="fillerActive"
                :style="{
                    '--percentage': type === 'range'
                        ? `${percentage.max - percentage.min}%`
                        : `${percentage.max}%`,
                }"
                class="m3-slider__filler m3-slider__filler_active"
            />

            <div
                ref="fillerMax"
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
  onMounted,
  reactive,
  ref,
  watch,
} from 'vue'

type AriaOptions = {
  label?: string;
  labelledBy?: string;
}

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

  step: {
    type: Number,
    validator: (step: number) => step >= 0,
    default: 0,
  },

  disabled: {
    type: Boolean,
    default: false,
  },

  ariaHandle: {
    type: Object as PropType<AriaOptions>,
    default: () => ({}),
  },

  ariaHandleMax: {
    type: Object as PropType<AriaOptions>,
    default: () => ({}),
  },

  ariaHandleMin: {
    type: Object as PropType<AriaOptions>,
    default: () => ({}),
  },
})

const emit = defineEmits([
  'update:value',
])

const ariaOptionsToAttrs = (options: AriaOptions): {
  'aria-label'?: string;
  'aria-labelledby'?: string;
} => {
  return {
    ...(options.label ? { 'aria-label': options.label } : {}),
    ...(options.labelledBy ? { 'aria-labelledby': options.labelledBy } : {}),
  }
}

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

const percentageOf = (value: number) => {
  return 100 * Math.abs(restrict(value, [props.min, props.max]) / (props.max - props.min))
}

const percentage = computed(() => {
  const [_min, _max] = current.value

  return {
    max: dragging.max ?? percentageOf(_max),
    min: dragging.min ?? percentageOf(_min),
  }
})

const track = ref<HTMLElement | null>(null)
const fillerActive = ref<HTMLElement | null>(null)
const fillerMax = ref<HTMLElement | null>(null)
const fillerMin = ref<HTMLElement | null>(null)
const handleMax = ref<HTMLElement | null>(null)
const handleMin = ref<HTMLElement | null>(null)
const notches = ref<HTMLElement[]>([])
const keys = {
  space: false,
}

const addNotch = (el: HTMLElement) => {
  if (!notches.value.includes(el)) {
    notches.value.push(el)
  }
}

const steps = computed(() => {
  const steps: number[] = []

  if (props.step > 0) {
    let next = props.min + props.step
    while (next < props.max) {
      steps.push(next)
      next += props.step
    }
  }

  return steps
})

const distance = (a: number, b: number) => Math.abs(a - b)
const nearest = (value: number) => {
  if (props.step > 0) {
    let prev = props.min
    while (prev + props.step < value) {
      prev += props.step
    }

    const next = prev + props.step

    return distance(value, prev) < distance(value, next) ? prev : next
  }

  return value
}

const onNotchMaxClick = () => {
  if (props.disabled) {
    return
  }

  props.type === 'single'
    ? emit('update:value', props.max)
    : emit('update:value', [current.value[0], props.max])
}

const onNotchMinClick = () => {
  if (props.disabled) {
    return
  }

  props.type === 'single'
    ? emit('update:value', props.min)
    : emit('update:value', [props.min, current.value[1]])
}

const onNotchClick = (value: number, index: number) => {
  if (notches.value[index]?.classList.contains('m3-slider__notch_hidden') || props.disabled) {
    return
  }

  if (props.type === 'single') {
    emit('update:value', value)
    return
  }

  const [min, max] = current.value

  const range = distance(value, min) < distance(value, max)
    ? [value, max]
    : [min, value]

  emit('update:value', range)
}

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

const getEventValue = (event: MouseEvent | TouchEvent) => {
  return nearest(props.min + (props.max - props.min) * getEventShare(event))
}

const stepFor = (leap: boolean) => {
  const step = distance(props.min, props.max) / 100
  return props.step > 0 ? props.step : leap ? 10 * step : step
}
const nextFor = (value: number, stepOrLeap: number | boolean = false) => {
  const step = typeof stepOrLeap === 'boolean' ? stepFor(stepOrLeap) : stepOrLeap
  const next = value + step

  return distance(next, props.max) < step ? props.max : next
}

const rangeBy = (value: number, step: number): [number, number] => {
  const restricted = restrict(value, [props.min, props.max])

  if (step > 0) {
    let prev = props.min
    while (prev + step < restricted) {
      prev += step
    }

    return [prev, nextFor(prev, step)]
  }

  return [restricted, restricted]
}

const setValueMax = (value: number) => {
  if (props.type === 'range') {
    const [min] = current.value
    emit('update:value', [min, Math.max(min, value)])
  } else {
    emit('update:value', value)
  }
}

const setValueMin = (value: number) => {
  if (props.type === 'range') {
    const [, max] = current.value
    emit('update:value', [Math.min(value, max), max])
  }
}

const onKeyDownForMax = (event: KeyboardEvent) => {
  if (props.disabled) {
    return
  }

  const [, valueMax] = current.value
  const [rangeMin, rangeMax] = rangeBy(valueMax, stepFor(keys.space))

  switch (true) {
    case event.code === 'ArrowLeft':
      setValueMax(rangeMin)
      break
    case event.code === 'ArrowRight':
      setValueMax(rangeMax === valueMax ? nextFor(rangeMax, keys.space) : rangeMax)
      break
    case event.code === 'End':
      setValueMax(props.max)
      break
    case event.code === 'Home':
      setValueMax(props.min)
      break
  }
}

const onMoveMax = (event: MouseEvent | TouchEvent) => {
  const value = getEventValue(event)
  const [min] = current.value

  if (props.type === 'single') {
    dragging.max = percentageOf(value)
    setValueMax(value)
  } else {
    dragging.max = percentageOf(Math.max(min, value))
    setValueMax(value)
  }

  nextTick(() => dragging.max = null)
}

const stopMouseListeningForMax = () => {
  window.removeEventListener('mousemove', onMoveMax)
  window.removeEventListener('mouseup', stopMouseListeningForMax)
}

const onStartDraggingMax = () => {
  if (!props.disabled) {
    window.addEventListener('mousemove', onMoveMax)
    window.addEventListener('mouseup', stopMouseListeningForMax)
  }
}

const onKeyDownForMin = (event: KeyboardEvent) => {
  if (props.disabled) {
    return
  }

  const [valueMin] = current.value
  const [rangeMin, rangeMax] = rangeBy(valueMin, stepFor(keys.space))

  switch (true) {
    case event.code === 'ArrowLeft':
      setValueMin(rangeMin)
      break
    case event.code === 'ArrowRight':
      setValueMin(rangeMax === valueMin ? nextFor(rangeMax, keys.space) : rangeMax)
      break
    case event.code === 'End':
      setValueMin(props.max)
      break
    case event.code === 'Home':
      setValueMin(props.min)
      break
  }
}

const onMoveMin = (event: MouseEvent | TouchEvent) => {
  if (props.type === 'single') {
    return
  }

  const value = getEventValue(event)
  const [, max] = current.value

  dragging.min = percentageOf(Math.min(value, max))

  setValueMin(value)

  nextTick(() => dragging.min = null)
}

const stopMouseListeningForMin = () => {
  window.removeEventListener('mousemove', onMoveMin)
  window.removeEventListener('mouseup', stopMouseListeningForMin)
}

const onStartDraggingMin = () => {
  if (!props.disabled) {
    window.addEventListener('mousemove', onMoveMin)
    window.addEventListener('mouseup', stopMouseListeningForMin)
  }
}

const inRange = (value: number, [min, max]: [number, number]) => {
  return min <= value && value <= max
}

const toGap = ({ left, right }: DOMRect): [number, number] => [left, right]

const updateNotches = () => {
  const _active = fillerActive.value?.getBoundingClientRect()
  const _max = handleMax.value?.getBoundingClientRect()
  const _min = handleMin.value?.getBoundingClientRect()

  notches.value.forEach((notch) => {
    if (!notch) {
      return
    }

    const { left: x } = notch.getBoundingClientRect()

    const hidden = !!_max && (inRange(x - 2, toGap(_max)) || inRange(x + 2, toGap(_max))) ||
      !!_min && (inRange(x - 2, toGap(_min)) || inRange(x + 2, toGap(_min)))

    notch.classList.toggle('m3-slider__notch_active', _active && inRange(x, toGap(_active)))
    notch.classList.toggle('m3-slider__notch_hidden', hidden)

    notch.setAttribute('aria-hidden', hidden ? 'true' : 'false')
  })
}

watch(steps, () => {
  notches.value = []
  nextTick(() => updateNotches())
})

watch([
  () => dragging.max,
  () => dragging.min,
], () => updateNotches())

watch(() => props.disabled, (disabled) => {
  if (disabled) {
    stopMouseListeningForMax()
    stopMouseListeningForMin()
  }
})

onMounted(() => {
  updateNotches()

  const fillerActiveObserver = new ResizeObserver(() => requestAnimationFrame(updateNotches))
  const handleMaxObserver = new ResizeObserver(() => requestAnimationFrame(updateNotches))
  const handleMinObserver = new ResizeObserver(() => requestAnimationFrame(updateNotches))

  fillerActiveObserver.observe(fillerActive.value as HTMLElement)
  handleMaxObserver.observe(handleMax.value as HTMLElement)

  watch(handleMin, (curr, prev) => {
    if (curr && curr !== prev) {
      handleMinObserver.observe(curr)
    }
  }, { immediate: true })

  onBeforeUnmount(() => {
    fillerActiveObserver.disconnect()
    handleMaxObserver.disconnect()
    handleMinObserver.disconnect()
  })
})

onBeforeUnmount(() => {
  stopMouseListeningForMax()
  stopMouseListeningForMin()
})
</script>
