<template>
    <M3Dialog
        :aria-label="label"
        :opened="opened"
        :style="{ width: dialogWidth + 'px' }"
        :class="{
            'm3-date-picker-dialog': true,
            'm3-date-picker-dialog_input': appearanceActual === 'input',
        }"
        role="dialog"
        aria-modal="true"
        @update:opened="emit('update:opened', $event)"
    >
        <M3DatePicker
            v-if="appearanceActual === 'picker'"
            :type="type"
            :value="pickerValue"
            :min="min"
            :max="max"
            :year-range="yearRange"
            :availability="availability"
            :cursor="cursor"
            :locale="locale"
            :first-day-of-week="firstDayOfWeek"
            :label="label"
            :navigation="navigation"
            :views="views"
            :disabled="disabled"
            @update:cursor="emit('update:cursor', $event)"
            @update:value="syncDraftValue"
        >
            <template v-if="switchable" #header-action>
                <M3IconButton
                    :aria-label="modeToggleLabel"
                    :disabled="disabled"
                    @click="setAppearance('input')"
                >
                    <M3Icon name="edit" />
                </M3IconButton>
            </template>
        </M3DatePicker>

        <section
            v-else
            :aria-label="label"
            :class="{
                'm3-date-picker': true,
                'm3-date-picker_input': true,
                [`m3-date-picker_input-${type}`]: true,
            }"
            role="group"
        >
            <header class="m3-date-picker__header">
                <div class="m3-date-picker__header-copy">
                    <div class="m3-date-picker__label">
                        {{ label }}
                    </div>
                    <div class="m3-date-picker__headline">
                        {{ type === 'range' ? 'Enter dates' : 'Enter date' }}
                    </div>
                </div>
                <div v-if="switchable" class="m3-date-picker__header-action">
                    <M3IconButton
                        :aria-label="modeToggleLabel"
                        :disabled="disabled"
                        @click="setAppearance('picker')"
                    >
                        <M3Icon name="calendar_today" />
                    </M3IconButton>
                </div>
            </header>

            <div class="m3-date-picker__input-content">
                <div v-if="type === 'range'" class="m3-date-picker__input-fields">
                    <M3TextField
                        :value="rangeInputValue[0]"
                        :placeholder="DEFAULT_CALENDAR_DATE_INPUT_FORMAT"
                        :disabled="disabled"
                        :invalid="rangeInputInvalid[0] || rangeOrderInvalid"
                        label="Date"
                        outlined
                        @update:value="setRangeInput(0, $event)"
                    />
                    <M3TextField
                        :value="rangeInputValue[1]"
                        :placeholder="DEFAULT_CALENDAR_DATE_INPUT_FORMAT"
                        :disabled="disabled"
                        :invalid="rangeInputInvalid[1] || rangeOrderInvalid"
                        label="End date"
                        outlined
                        @update:value="setRangeInput(1, $event)"
                    />
                </div>
                <M3TextField
                    v-else
                    :value="singleInputValue"
                    :placeholder="DEFAULT_CALENDAR_DATE_INPUT_FORMAT"
                    :disabled="disabled"
                    :invalid="singleInputInvalid"
                    label="Date"
                    outlined
                    @update:value="setSingleInput"
                />
            </div>
        </section>

        <template #footer>
            <M3Button appearance="text" @click="cancel">
                {{ cancelText }}
            </M3Button>
            <M3Button :disabled="confirmDisabled" appearance="text" @click="confirm">
                {{ confirmText }}
            </M3Button>
        </template>
    </M3Dialog>
</template>

<script lang="ts" setup>
import type {
  CalendarAvailability,
  CalendarYearRange,
} from '@modulify/m3-foundation/lib/calendar'
import type { PropType } from 'vue'

import { CalendarDay, clampCalendarDay } from '@modulify/m3-foundation/lib/calendar'
import { computed } from 'vue'
import {
  DEFAULT_CALENDAR_DATE_INPUT_FORMAT,
  formatCalendarDateInput,
  getCalendarBounds,
  isCalendarDaySelectable,
  parseCalendarDateInput,
} from '@modulify/m3-foundation/lib/calendar'
import { ref, watch } from 'vue'

import { M3Button } from '@/components/button'
import { M3Dialog } from '@/components/dialog'
import { M3Icon } from '@/components/icon'
import { M3IconButton } from '@/components/icon-button'
import { M3TextField } from '@/components/text-field'

import M3DatePicker from './M3DatePicker.vue'

const cloneDate = (value: Date | null): Date | null => value ? new Date(value) : null

const cloneValue = (value: Date | null | [Date | null, Date | null]): Date | null | [Date | null, Date | null] => Array.isArray(value)
  ? [cloneDate(value[0]), cloneDate(value[1])]
  : cloneDate(value)

const toInputRangeValue = (value: Date | null | [Date | null, Date | null]): [string, string] => Array.isArray(value)
  ? [formatCalendarDateInput(value[0]), formatCalendarDateInput(value[1])]
  : ['', '']

const props = defineProps({
  value: {
    type: null as unknown as PropType<Date | null | [Date | null, Date | null]>,
    default: null,
  },

  type: {
    type: String as PropType<'single' | 'range'>,
    default: 'single',
  },

  cursor: {
    type: Date as PropType<Date | null>,
    default: undefined,
  },

  min: {
    type: Date as PropType<Date | null>,
    default: null,
  },

  max: {
    type: Date as PropType<Date | null>,
    default: null,
  },

  yearRange: {
    type: Array as unknown as PropType<CalendarYearRange>,
    default: undefined,
  },

  availability: {
    type: Object as PropType<CalendarAvailability | null>,
    default: null,
  },

  appearance: {
    type: String as PropType<'picker' | 'input' | undefined>,
    validator: (appearance: string) => ['picker', 'input'].includes(appearance),
    default: undefined,
  },

  opened: {
    type: Boolean,
    default: false,
  },

  switchable: {
    type: Boolean,
    default: true,
  },

  navigation: {
    type: String as PropType<'split' | 'inline' | 'none'>,
    default: 'split',
  },

  views: {
    type: Array as PropType<Array<'days' | 'months' | 'years'>>,
    default: () => ['days', 'months', 'years'],
  },

  locale: {
    type: String,
    default: 'en-US',
  },

  firstDayOfWeek: {
    type: Number,
    default: 0,
  },

  label: {
    type: String,
    default: 'Select date',
  },

  cancelText: {
    type: String,
    default: 'Cancel',
  },

  confirmText: {
    type: String,
    default: 'OK',
  },

  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits([
  'change',
  'update:appearance',
  'update:cursor',
  'update:opened',
  'update:value',
])

const draftValue = ref<Date | null | [Date | null, Date | null]>(cloneValue(props.value))
const appearanceInternal = ref<'picker' | 'input'>(props.appearance ?? 'picker')
const singleInputValue = ref(props.value instanceof Date ? formatCalendarDateInput(props.value) : '')
const singleInputInvalid = ref(false)
const rangeInputValue = ref<[string, string]>(toInputRangeValue(props.value))
const rangeInputInvalid = ref<[boolean, boolean]>([false, false])
const minDay = computed(() => props.min ? new CalendarDay(props.min) : null)
const maxDay = computed(() => props.max ? new CalendarDay(props.max) : null)
const bounds = computed(() => getCalendarBounds(props.yearRange, minDay.value, maxDay.value))
const appearanceActual = computed(() => appearanceInternal.value)
const dialogWidth = computed(() => appearanceActual.value === 'input' ? 328 : 360)

watch(() => props.appearance, (appearance) => {
  if (appearance !== undefined) {
    appearanceInternal.value = appearance
  }
})

watch([
  () => props.opened,
  () => props.value,
], ([opened]) => {
  if (opened) {
    syncDraftValue(cloneValue(props.value))
  }
})

const pickerValue = computed(() => {
  if (props.type === 'range') {
    return Array.isArray(draftValue.value) ? draftValue.value : null
  }

  return draftValue.value instanceof Date ? draftValue.value : null
})

const rangeOrderInvalid = computed(() => Array.isArray(draftValue.value) &&
  draftValue.value[0] instanceof Date &&
  draftValue.value[1] instanceof Date &&
  draftValue.value[0].getTime() > draftValue.value[1].getTime()
)

const inputInvalid = computed(() => props.type === 'range'
  ? rangeInputInvalid.value[0] || rangeInputInvalid.value[1] || rangeOrderInvalid.value
  : singleInputInvalid.value
)

const confirmDisabled = computed(() => props.type === 'range'
  ? inputInvalid.value || !(Array.isArray(draftValue.value) && draftValue.value[0] instanceof Date && draftValue.value[1] instanceof Date)
  : inputInvalid.value || !(draftValue.value instanceof Date)
)

const modeToggleLabel = computed(() => appearanceActual.value === 'picker'
  ? 'Switch to text input'
  : 'Switch to calendar input'
)

const isDateAvailable = (day: CalendarDay): boolean => (
  clampCalendarDay(day, bounds.value)?.inSameDay(day) ?? false
) && isCalendarDaySelectable(day, props.availability)

const parseInputValue = (value: string): {
  invalid: boolean;
  date: Date | null;
} => {
  if (!value.trim()) {
    return {
      invalid: false,
      date: null,
    }
  }

  const day = parseCalendarDateInput(value)

  if (!day || !isDateAvailable(day)) {
    return {
      invalid: true,
      date: null,
    }
  }

  return {
    invalid: false,
    date: day.date,
  }
}

function syncDraftValue(value: Date | null | [Date | null, Date | null]) {
  const nextValue = cloneValue(value)

  draftValue.value = nextValue
  singleInputValue.value = nextValue instanceof Date ? formatCalendarDateInput(nextValue) : ''
  singleInputInvalid.value = false
  rangeInputValue.value = toInputRangeValue(nextValue)
  rangeInputInvalid.value = [false, false]
}

const setAppearance = (value: 'picker' | 'input') => {
  appearanceInternal.value = value
  emit('update:appearance', value)
}

const setSingleInput = (value: string) => {
  const result = parseInputValue(value)

  singleInputValue.value = value
  singleInputInvalid.value = result.invalid

  if (!result.invalid) {
    draftValue.value = result.date
  }
}

const setRangeInput = (index: 0 | 1, value: string) => {
  const result = parseInputValue(value)
  const nextInputValue: [string, string] = [...rangeInputValue.value]
  const nextInvalid: [boolean, boolean] = [...rangeInputInvalid.value]
  const currentRange: [Date | null, Date | null] = Array.isArray(draftValue.value)
    ? [draftValue.value[0], draftValue.value[1]]
    : [null, null]

  nextInputValue[index] = value
  nextInvalid[index] = result.invalid

  rangeInputValue.value = nextInputValue
  rangeInputInvalid.value = nextInvalid

  if (!result.invalid) {
    currentRange[index] = result.date
    draftValue.value = currentRange
  }
}

const cancel = () => {
  syncDraftValue(cloneValue(props.value))
  emit('update:opened', false)
}

const confirm = () => {
  if (confirmDisabled.value) {
    return
  }

  const value = cloneValue(draftValue.value)

  emit('change', value)
  emit('update:value', value)
  emit('update:opened', false)
}
</script>
