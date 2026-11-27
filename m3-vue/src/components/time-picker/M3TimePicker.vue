<template>
    <M3Dialog
        :opened="opened"
        :class="{
            'm3-time-picker-dialog': true,
            'm3-time-picker-dialog_horizontal': layout === 'horizontal' && state.appearance === 'dial',
        }"
        :style="{
            width: layout === 'horizontal' && state.appearance === 'dial'
                ? '560px'
                : '328px'
        }"
        aria-label="Select time"
        role="dialog"
        aria-modal="true"
        @update:opened="cancel"
    >
        <section
            :class="{
                'm3-time-picker': true,
                'm3-time-picker_input': state.appearance === 'input',
                'm3-time-picker_24h': formatActual === '24h',
                'm3-time-picker_horizontal': layout === 'horizontal' && state.appearance === 'dial',
            }"
        >
            <div class="m3-time-picker__header">
                {{ state.appearance === 'dial' ? 'Select time' : 'Enter time' }}
            </div>

            <div class="m3-time-picker__body">
                <div class="m3-time-picker__fields">
                    <template v-if="state.appearance === 'input'">
                        <label class="m3-time-picker__field">
                            <input
                                :value="state.hourText"
                                :aria-invalid="!hourValid || !inputValid"
                                aria-label="Hour"
                                inputmode="numeric"
                                autocomplete="off"
                                @input="setInput('hour', $event)"
                            />
                            <span>Hour</span>
                        </label>
                        <span class="m3-time-picker__separator">:</span>
                        <label class="m3-time-picker__field">
                            <input
                                :value="state.minuteText"
                                :aria-invalid="!minuteValid || !inputValid"
                                aria-label="Minute"
                                inputmode="numeric"
                                autocomplete="off"
                                @input="setInput('minute', $event)"
                            />
                            <span>Minute</span>
                        </label>
                    </template>
                    <template v-else>
                        <button
                            :class="{
                                'm3-time-picker__value': true,
                                'm3-time-picker__value_selected': state.selection === 'hour',
                            }"
                            :aria-pressed="state.selection === 'hour'"
                            aria-label="Select hours"
                            type="button"
                            @click="state.selection = 'hour'"
                        >
                            {{ String(displayHour(state.value.hour, formatActual)).padStart(2, '0') }}
                        </button>
                        <span class="m3-time-picker__separator">:</span>
                        <button
                            :class="{
                                'm3-time-picker__value': true,
                                'm3-time-picker__value_selected': state.selection === 'minute',
                            }"
                            :aria-pressed="state.selection === 'minute'"
                            aria-label="Select minutes"
                            type="button"
                            @click="state.selection = 'minute'"
                        >
                            {{ String(state.value.minute).padStart(2, '0') }}
                        </button>
                    </template>
                </div>

                <div
                    v-if="formatActual === '12h'"
                    class="m3-time-picker__periods"
                    role="radiogroup"
                    aria-label="Period"
                >
                    <button
                        v-for="period in periods"
                        :key="period"
                        :aria-checked="currentPeriod === period"
                        :disabled="!periodAvailable(period)"
                        :class="{
                            'm3-time-picker__period': true,
                            'm3-time-picker__period_selected': currentPeriod === period,
                        }"
                        type="button"
                        role="radio"
                        @click="setPeriod(period)"
                    >
                        {{ period }}
                    </button>
                </div>
            </div>

            <div
                v-if="state.appearance === 'dial'"
                ref="dial"
                :aria-label="state.selection === 'hour' ? 'Hours' : 'Minutes'"
                class="m3-time-picker__dial"
                role="group"
                @pointerdown="onPointerDown"
                @pointermove="onPointerMove"
                @pointerup="onPointerUp"
                @pointercancel="onPointerUp"
            >
                <span
                    :style="trackStyle"
                    class="m3-time-picker__track"
                />
                <span class="m3-time-picker__center" />
                <template v-if="state.selection === 'hour'">
                    <button
                        v-for="slot in hourSlots"
                        :key="slot.value"
                        :style="slot.style"
                        :disabled="!hourAvailable(slot.value)"
                        :aria-label="`${slot.value} hours of ${formatActual === '24h' ? 24 : 12}`"
                        :class="{
                            'm3-time-picker__slot': true,
                            'm3-time-picker__slot_selected': slot.value === displayHour(state.value.hour, formatActual),
                        }"
                        type="button"
                        @click="setHour(slot.value)"
                    >
                        {{ formatActual === '24h' && slot.value === 0 ? '00' : slot.value }}
                    </button>
                </template>
                <template v-else>
                    <button
                        v-for="slot in minuteSlots"
                        :key="slot.value"
                        :style="slot.style"
                        :disabled="!isTimeSelectable({ hour: state.value.hour, minute: slot.value }, bounds)"
                        :aria-label="`${slot.value} minutes of 60`"
                        :class="{
                            'm3-time-picker__slot': true,
                            'm3-time-picker__slot_selected': slot.value === state.value.minute,
                        }"
                        type="button"
                        @click="setMinute(slot.value)"
                    >
                        {{ String(slot.value).padStart(2, '0') }}
                    </button>
                </template>
                <span
                    v-if="state.selection === 'minute' && state.value.minute % 5 !== 0"
                    :style="handleStyle"
                    class="m3-time-picker__handle"
                >
                    {{ String(state.value.minute).padStart(2, '0') }}
                </span>
            </div>
        </section>

        <template #footer>
            <M3Button
                :aria-label="state.appearance === 'dial' ? 'Switch to text input' : 'Switch to dial input'"
                class="m3-time-picker-dialog__switch"
                appearance="standard"
                width="medium"
                @click="setAppearance(state.appearance === 'dial' ? 'input' : 'dial')"
            >
                <M3Icon :name="state.appearance === 'dial' ? 'keyboard' : 'schedule'" />
            </M3Button>
            <M3Button appearance="text" @click="cancel">
                Cancel
            </M3Button>
            <M3Button :disabled="confirmDisabled" appearance="text" @click="confirm">
                OK
            </M3Button>
        </template>
    </M3Dialog>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'
import type { TimeBounds, TimeFormat, TimeValue } from '@modulify/m3-foundation/lib/time'

import { closestSelectableMinute } from '@modulify/m3-foundation/lib/time'
import { computed } from 'vue'
import {
  dialHour,
  dialMinute,
  displayHour,
  hourFromDisplay,
  isTimeSelectable,
  pointAngle,
} from '@modulify/m3-foundation/lib/time'
import { reactive, ref } from 'vue'
import { resolveTimeFormat } from '@modulify/m3-foundation/lib/time'
import { watch } from 'vue'

import { M3Button } from '@/components/button'
import { M3Dialog } from '@/components/dialog'
import { M3Icon } from '@/components/icon'

type Appearance = 'dial' | 'input'
type Selection = 'hour' | 'minute'
type Period = 'AM' | 'PM'

interface PickerState {
  value: TimeValue;
  appearance: Appearance;
  selection: Selection;
  hourText: string;
  minuteText: string;
}

const DIAL_SIZE = 256
const OUTER_RADIUS = 104
const INNER_RADIUS = 64
const INNER_RING_THRESHOLD = 84
const periods: Period[] = ['AM', 'PM']

const props = defineProps({
  value: {
    type: Object as PropType<TimeValue>,
    default: () => ({ hour: 0, minute: 0 }),
  },

  opened: {
    type: Boolean,
    default: false,
  },

  appearance: {
    type: String as PropType<Appearance>,
    default: 'dial',
  },

  format: {
    type: String as PropType<TimeFormat | undefined>,
    default: undefined,
  },

  locale: {
    type: String,
    default: 'en-US',
  },

  layout: {
    type: String as PropType<'vertical' | 'horizontal'>,
    default: 'vertical',
  },

  min: {
    type: Object as PropType<TimeValue | null>,
    default: null,
  },

  max: {
    type: Object as PropType<TimeValue | null>,
    default: null,
  },

  step: {
    type: Number,
    default: 1,
  },
})

const emit = defineEmits<{
  change: [value: TimeValue];
  'update:value': [value: TimeValue];
  'update:opened': [opened: boolean];
  'update:appearance': [appearance: Appearance];
}>()

const dial = ref<HTMLElement | null>(null)
const formatActual = computed(() => resolveTimeFormat(props.locale, props.format))
const bounds = computed<TimeBounds>(() => ({
  min: props.min,
  max: props.max,
  step: props.step,
}))

const state = reactive<PickerState>({
  value: { ...props.value },
  appearance: props.appearance,
  selection: 'hour',
  hourText: '',
  minuteText: '',
})

let dragging: Selection | null = null

const currentPeriod = computed<Period>(() => state.value.hour >= 12 ? 'PM' : 'AM')
const hourValid = computed(() => {
  const value = Number(state.hourText)
  return /^\d{1,2}$/.test(state.hourText) &&
    (formatActual.value === '12h' ? value >= 1 && value <= 12 : value >= 0 && value <= 23)
})
const minuteValid = computed(() => /^\d{1,2}$/.test(state.minuteText) && Number(state.minuteText) <= 59)
const inputValue = computed<TimeValue | null>(() => hourValid.value && minuteValid.value
  ? {
    hour: hourFromDisplay(Number(state.hourText), currentPeriod.value, formatActual.value),
    minute: Number(state.minuteText),
  }
  : null
)
const inputValid = computed(() => inputValue.value !== null && isTimeSelectable(inputValue.value, bounds.value))
const confirmDisabled = computed(() => state.appearance === 'input'
  ? !inputValid.value
  : !isTimeSelectable(state.value, bounds.value)
)

const position = (angle: number, radius: number) => {
  const radians = angle * Math.PI / 180
  return {
    left: `${DIAL_SIZE / 2 + Math.sin(radians) * radius}px`,
    top: `${DIAL_SIZE / 2 - Math.cos(radians) * radius}px`,
  }
}

const hourSlots = computed(() => Array.from({ length: formatActual.value === '24h' ? 24 : 12 }, (_, index) => {
  const inner = formatActual.value === '24h' && index >= 12
  const value = formatActual.value === '12h' && index === 0 ? 12 : index

  return {
    value,
    style: position(index % 12 * 30, inner ? INNER_RADIUS : OUTER_RADIUS),
  }
}))

const minuteSlots = Array.from({ length: 12 }, (_, index) => ({
  value: index * 5,
  style: position(index * 30, OUTER_RADIUS),
}))

const handleAngle = computed(() => state.selection === 'hour'
  ? state.value.hour % 12 * 30
  : state.value.minute * 6
)
const handleRadius = computed(() => formatActual.value === '24h' && state.selection === 'hour' && state.value.hour >= 12
  ? INNER_RADIUS
  : OUTER_RADIUS
)
const handleStyle = computed(() => position(handleAngle.value, handleRadius.value))
const trackStyle = computed(() => ({
  width: `${handleRadius.value}px`,
  transform: `rotate(${handleAngle.value - 90}deg)`,
}))

function syncInput() {
  state.hourText = String(displayHour(state.value.hour, formatActual.value)).padStart(2, '0')
  state.minuteText = String(state.value.minute).padStart(2, '0')
}

function syncValue() {
  state.value = { ...props.value }
  state.appearance = props.appearance
  state.selection = 'hour'
  syncInput()
}

watch(() => props.opened, (opened) => {
  if (opened) syncValue()
}, { immediate: true })

watch(() => [props.value.hour, props.value.minute], () => {
  if (props.opened) syncValue()
})

watch(() => props.appearance, (appearance) => {
  state.appearance = appearance
})

watch(formatActual, syncInput)

function setAppearance(appearance: Appearance) {
  state.appearance = appearance
  emit('update:appearance', appearance)
}

function setInput(field: 'hour' | 'minute', event: Event) {
  const value = (event.target as HTMLInputElement).value
  if (field === 'hour') state.hourText = value
  else state.minuteText = value

  if (inputValue.value && isTimeSelectable(inputValue.value, bounds.value)) {
    state.value = inputValue.value
  }
}

function hourAvailable(hour: number): boolean {
  const actual = formatActual.value === '12h'
    ? hourFromDisplay(hour, currentPeriod.value, formatActual.value)
    : hour
  return closestSelectableMinute(actual, state.value.minute, bounds.value) !== null
}

function periodAvailable(period: Period): boolean {
  const hour = hourFromDisplay(displayHour(state.value.hour, '12h'), period, '12h')
  return closestSelectableMinute(hour, state.value.minute, bounds.value) !== null
}

function setHour(hour: number, advance = true) {
  const actual = formatActual.value === '12h'
    ? hourFromDisplay(hour, currentPeriod.value, formatActual.value)
    : hour
  const minute = closestSelectableMinute(actual, state.value.minute, bounds.value)
  if (minute === null) return

  state.value = { hour: actual, minute }
  if (advance) state.selection = 'minute'
  syncInput()
}

function setMinute(minute: number) {
  if (!isTimeSelectable({ hour: state.value.hour, minute }, bounds.value)) return

  state.value = { ...state.value, minute }
  syncInput()
}

function setPeriod(period: Period) {
  const hour = hourFromDisplay(displayHour(state.value.hour, '12h'), period, '12h')
  const minute = closestSelectableMinute(hour, state.value.minute, bounds.value)
  if (minute === null) return

  state.value = { hour, minute }
  syncInput()
}

function selectPoint(event: PointerEvent) {
  const rect = dial.value?.getBoundingClientRect()
  if (!rect) return

  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2
  const angle = pointAngle(event.clientX, event.clientY, centerX, centerY)

  if (dragging === 'hour') {
    const radius = Math.hypot(event.clientX - centerX, event.clientY - centerY)
    setHour(dialHour(angle, formatActual.value === '24h' && radius < INNER_RING_THRESHOLD, formatActual.value), false)
    return
  }

  const minute = closestSelectableMinute(state.value.hour, dialMinute(angle), bounds.value)
  if (minute !== null) setMinute(minute)
}

function onPointerDown(event: PointerEvent) {
  if (event.pointerType === 'mouse' && event.button !== 0) return
  dragging = state.selection
  dial.value?.setPointerCapture(event.pointerId)
  selectPoint(event)
}

function onPointerMove(event: PointerEvent) {
  if (dragging) selectPoint(event)
}

function onPointerUp() {
  if (dragging === 'hour') state.selection = 'minute'
  dragging = null
}

function cancel() {
  syncValue()
  emit('update:opened', false)
}

function confirm() {
  if (confirmDisabled.value) return

  const value = { ...(state.appearance === 'input' && inputValue.value ? inputValue.value : state.value) }
  emit('change', value)
  emit('update:value', value)
  emit('update:opened', false)
}
</script>
