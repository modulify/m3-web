<template>
    <div
        ref="root"
        :class="{
            'm3-date-picker-field': true,
            'm3-date-picker-field_expanded': expanded,
        }"
        v-bind="$attrs"
    >
        <M3TextField
            :id="id"
            :name="name"
            :value="inputValue"
            :label="label"
            :placeholder="placeholder"
            :invalid="invalid || inputInvalid"
            :disabled="disabled"
            :readonly="readonly"
            :outlined="outlined"
            @click="interactive && toggleExpanded(true)"
            @update:value="inputValue = $event"
            @change="commitInput"
        >
            <template v-if="'label' in $slots" #label>
                <slot name="label" />
            </template>

            <template v-if="'leading-icon' in $slots" #leading-icon>
                <slot name="leading-icon" />
            </template>

            <template #trailing-icon>
                <M3IconButton
                    aria-label="Choose date"
                    :disabled="!interactive"
                    @click.stop="toggleExpanded(!expanded)"
                >
                    <M3Icon name="calendar_month" />
                </M3IconButton>
            </template>
        </M3TextField>

        <div v-if="supportingText || 'supporting-text' in $slots" class="m3-date-picker-field__supporting-text">
            <slot name="supporting-text">
                {{ supportingText }}
            </slot>
        </div>

        <M3Popper
            :shown="expanded"
            :class="['m3-date-picker-field__popper', popperClass]"
            :target="ref(root)"
            :target-triggers="[]"
            :placement="placement"
            :offset-main-axis="8"
            :disabled="!interactive"
            animated
            hide-on-miss-click
            @update:shown="toggleExpanded"
        >
            <M3DatePicker
                :value="draftValue"
                :min="min"
                :max="max"
                :year-range="yearRange"
                :availability="availability"
                :locale="locale"
                :first-day-of-week="firstDayOfWeek"
                :label="label"
                layout="docked"
                navigation="split"
                @update:value="selectDate"
            >
                <template #footer>
                    <M3Button appearance="text" @click="cancel">
                        {{ cancelText }}
                    </M3Button>
                    <M3Button appearance="text" :disabled="draftValue === null" @click="confirm">
                        {{ confirmText }}
                    </M3Button>
                </template>
            </M3DatePicker>
        </M3Popper>
    </div>
</template>

<script lang="ts" setup>
import type {
  ClassValue as CssClass,
  PropType,
} from 'vue'
import type { Placement } from '@floating-ui/dom'

import type {
  CalendarAvailability,
  CalendarYearRange,
} from '@modulify/m3-foundation/lib/calendar'

import {
  CalendarDay,
  DEFAULT_CALENDAR_DATE_INPUT_FORMAT,
  clampCalendarDay,
  formatCalendarDateInput,
  getCalendarBounds,
  isCalendarDaySelectable,
  parseCalendarDateInput,
} from '@modulify/m3-foundation/lib/calendar'

import { M3Button } from '@/components/button'
import { M3Icon } from '@/components/icon'
import { M3IconButton } from '@/components/icon-button'
import { M3Popper } from '@/components/popper'
import { M3TextField } from '@/components/text-field'
import M3DatePicker from './M3DatePicker.vue'

import {
  computed,
  ref,
  shallowRef,
  watch,
} from 'vue'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps({
  id: {
    type: String,
    default: undefined,
  },

  name: {
    type: String,
    default: undefined,
  },

  value: {
    type: Date as PropType<Date | null>,
    default: null,
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

  placeholder: {
    type: String,
    default: DEFAULT_CALENDAR_DATE_INPUT_FORMAT,
  },

  supportingText: {
    type: String,
    default: DEFAULT_CALENDAR_DATE_INPUT_FORMAT,
  },

  cancelText: {
    type: String,
    default: 'Cancel',
  },

  confirmText: {
    type: String,
    default: 'OK',
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
    default: true,
  },

  placement: {
    type: String as PropType<Placement>,
    default: 'bottom-start',
  },

  popperClass: {
    type: null as unknown as PropType<CssClass>,
    default: undefined,
  },
})

const emit = defineEmits([
  'change',
  'update:value',
])

const root = shallowRef<HTMLElement | null>(null)
const expanded = ref(false)
const draftValue = ref<Date | null>(props.value)
const inputValue = ref(formatCalendarDateInput(props.value))
const inputInvalid = ref(false)
const interactive = computed(() => !props.disabled && !props.readonly)

watch(() => props.value, (value) => {
  inputValue.value = formatCalendarDateInput(value)
  inputInvalid.value = false
  draftValue.value = value
})

const commitInput = (rawValue: string) => {
  const nextValue = rawValue.trim()

  if (nextValue.length === 0) {
    inputInvalid.value = false
    inputValue.value = ''
    emit('change', null)
    emit('update:value', null)
    return
  }

  const day = parseCalendarDateInput(nextValue)
  const bounds = getCalendarBounds(
    props.yearRange,
    props.min ? new CalendarDay(props.min) : null,
    props.max ? new CalendarDay(props.max) : null
  )
  const clamped = clampCalendarDay(day, bounds)

  if (day === null || clamped === null || !clamped.inSameDay(day) || !isCalendarDaySelectable(day, props.availability)) {
    inputInvalid.value = true
    return
  }

  inputInvalid.value = false
  inputValue.value = formatCalendarDateInput(day)
  emit('change', day.date)
  emit('update:value', day.date)
}

const selectDate = (date: Date) => {
  inputInvalid.value = false
  draftValue.value = date
}

const toggleExpanded = (nextExpanded: boolean) => {
  if (nextExpanded && !expanded.value) {
    draftValue.value = props.value
  }

  expanded.value = nextExpanded
}

const cancel = () => {
  draftValue.value = props.value
  expanded.value = false
}

const confirm = () => {
  if (draftValue.value === null) {
    return
  }

  inputInvalid.value = false
  inputValue.value = formatCalendarDateInput(draftValue.value)
  expanded.value = false
  emit('change', draftValue.value)
  emit('update:value', draftValue.value)
}
</script>
