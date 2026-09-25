<template>
    <div
        class="m3-day-picker"
        v-bind="$attrs"
    >
        <div class="m3-day-picker__weekdays" aria-hidden="true">
            <span
                v-for="day in weekdays"
                :key="day.dayInWeek"
                class="m3-day-picker__weekday"
            >
                {{ formatWeekday(day) }}
            </span>
        </div>

        <div
            class="m3-day-picker__grid"
            :role="active ? 'grid' : undefined"
            :aria-label="active ? label : undefined"
        >
            <div
                v-for="(week, weekIndex) in weeks"
                :key="weekIndex"
                class="m3-day-picker__week"
                :role="active ? 'row' : undefined"
            >
                <span
                    v-for="day in week"
                    :key="day.timestamp"
                    :class="{
                        'm3-day-picker__day-cell': true,
                        'm3-day-picker__day-cell_in-range': active && isInRange(day),
                        'm3-day-picker__day-cell_range-start': active && isRangeStart(day),
                        'm3-day-picker__day-cell_range-end': active && isRangeEnd(day),
                    }"
                >
                    <M3DatePickerOption
                        appearance="circle"
                        role="gridcell"
                        :current="today.inSameDay(day)"
                        :selected="active && isSelected(day)"
                        :outside="!day.inSameMonth(month)"
                        :in-range="active && isInRange(day)"
                        :range-start="active && isRangeStart(day)"
                        :range-end="active && isRangeEnd(day)"
                        :aria-label="formatDay(day)"
                        :aria-selected="active && isSelected(day)"
                        :disabled="disabled || isOutOfRange(day) || !isDaySelectable(day)"
                        :tab-index="active ? undefined : -1"
                        @select="emit('select', day)"
                    >
                        {{ day.dayInMonth }}
                    </M3DatePickerOption>
                </span>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type {
  CalendarAvailability,
  CalendarDayBounds,
  CalendarDayRange,
} from '@modulify/m3-foundation/lib/calendar'
import type { PropType } from 'vue'

import { CalendarDay } from '@modulify/m3-foundation/lib/calendar'
import { computed } from 'vue'
import {
  getCalendarMonthWeeks,
  getCalendarWeekDays,
  isCalendarDayInRange,
  isCalendarDayRangeEnd,
  isCalendarDayRangeStart,
  isCalendarDaySelectable,
} from '@modulify/m3-foundation/lib/calendar'

import M3DatePickerOption from './M3DatePickerOption'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps({
  value: {
    type: [CalendarDay, Array] as PropType<CalendarDay | CalendarDayRange | null>,
    default: null,
  },

  type: {
    type: String as PropType<'single' | 'range'>,
    required: true,
  },

  month: {
    type: CalendarDay,
    required: true,
  },

  today: {
    type: CalendarDay,
    required: true,
  },

  bounds: {
    type: Array as unknown as PropType<CalendarDayBounds>,
    required: true,
  },

  availability: {
    type: Object as PropType<CalendarAvailability | null>,
    default: null,
  },

  locale: {
    type: String,
    required: true,
  },

  firstDayOfWeek: {
    type: Number,
    required: true,
  },

  fixed: {
    type: Boolean,
    required: true,
  },

  active: {
    type: Boolean,
    required: true,
  },

  disabled: {
    type: Boolean,
    required: true,
  },

  label: {
    type: String,
    required: true,
  },
})

const emit = defineEmits<{
  'select': [day: CalendarDay];
}>()

const weekdays = computed(() => getCalendarWeekDays(new CalendarDay(2024, 1, 7), props.firstDayOfWeek))
const weeks = computed(() => getCalendarMonthWeeks(props.month, props.firstDayOfWeek).filter(
  week => props.fixed || week.some(day => day.inSameMonth(props.month))
))
const weekdayFormatter = computed(() => new Intl.DateTimeFormat(props.locale, {
  weekday: 'narrow',
}))
const dayFormatter = computed(() => new Intl.DateTimeFormat(props.locale, {
  day: 'numeric',
  month: 'long',
  weekday: 'long',
  year: 'numeric',
}))
const selectedDay = computed(() => props.value instanceof CalendarDay ? props.value : null)
const selectedRange = computed<CalendarDayRange>(() => Array.isArray(props.value) ? props.value : [null, null])

const isOutOfRange = (day: CalendarDay) => (
  props.bounds[0] !== null && day.isBefore(props.bounds[0])
) || (
  props.bounds[1] !== null && day.isAfter(props.bounds[1])
)

const isRangeStart = (day: CalendarDay) => props.type === 'range' && isCalendarDayRangeStart(day, selectedRange.value)
const isRangeEnd = (day: CalendarDay) => props.type === 'range' && isCalendarDayRangeEnd(day, selectedRange.value)
const isInRange = (day: CalendarDay) => props.type === 'range' && isCalendarDayInRange(day, selectedRange.value)
const isDaySelectable = (day: CalendarDay) => isCalendarDaySelectable(day, props.availability)
const isSelected = (day: CalendarDay) => props.type === 'range'
  ? isRangeStart(day) || isRangeEnd(day)
  : selectedDay.value?.inSameDay(day) ?? false
const formatWeekday = (day: CalendarDay) => weekdayFormatter.value.format(day.date)
const formatDay = (day: CalendarDay) => dayFormatter.value.format(day.date)
</script>
