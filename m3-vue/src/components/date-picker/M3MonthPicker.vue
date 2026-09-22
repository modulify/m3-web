<template>
    <div
        ref="root"
        :class="{
            'm3-month-picker': true,
            [`m3-month-picker_${appearance}`]: true,
            'm3-month-picker_animating': animating,
        }"
        v-bind="$attrs"
    >
        <M3List
            v-if="appearance === 'list'"
            class="m3-date-picker-list"
            :aria-label="label"
        >
            <M3ListItem
                v-for="month in months"
                :key="month"
                :selected="value.month === month"
                :disabled="disabled || !isMonthAvailable(month)"
                @click="emit('select', month)"
            >
                <template #leading>
                    <M3Icon
                        name="check"
                        aria-hidden="true"
                        :class="{
                            'm3-date-picker-list__check': true,
                            'm3-date-picker-list__check_hidden': value.month !== month,
                        }"
                    />
                </template>
                {{ formatMonth(month) }}
            </M3ListItem>
        </M3List>
        <div
            v-else
            class="m3-month-picker__grid"
            role="grid"
            :aria-label="label"
        >
            <div
                v-for="(row, i) in rows"
                :key="i"
                class="m3-month-picker__row"
                role="row"
            >
                <M3DatePickerOption
                    v-for="month in row"
                    :key="month"
                    appearance="pill"
                    role="gridcell"
                    :current="current.year === value.year && current.month === month"
                    :selected="value.month === month"
                    :aria-pressed="value.month === month"
                    :disabled="disabled || !isMonthAvailable(month)"
                    @select="emit('select', month)"
                >
                    {{ formatMonth(month) }}
                </M3DatePickerOption>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'

import type {
  CalendarDayBounds,
} from '@modulify/m3-foundation/lib/calendar'

import {
  CalendarDay,
  isCalendarMonthAvailable,
} from '@modulify/m3-foundation/lib/calendar'

import { M3Icon } from '@/components/icon'
import { M3List, M3ListItem } from '@/components/list'
import M3DatePickerOption from './M3DatePickerOption'

import {
  nextTick,
  shallowRef,
  watch,
} from 'vue'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps({
  value: {
    type: CalendarDay,
    required: true,
  },

  current: {
    type: CalendarDay,
    required: true,
  },

  bounds: {
    type: Array as unknown as PropType<CalendarDayBounds>,
    required: true,
  },

  appearance: {
    type: String as PropType<'grid' | 'list'>,
    required: true,
  },

  locale: {
    type: String,
    required: true,
  },

  label: {
    type: String,
    required: true,
  },

  disabled: {
    type: Boolean,
    required: true,
  },

  animating: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits<{
  'select': [month: number];
}>()

const MONTHS_IN_ROW = 3
const MONTH_ROW_HEIGHT = 56
const root = shallowRef<HTMLElement | null>(null)
const months = Array.from({ length: 12 }, (_, index) => index + 1)
const rows = Array.from(
  { length: months.length / MONTHS_IN_ROW },
  (_, i) => months.slice(i * MONTHS_IN_ROW, (i + 1) * MONTHS_IN_ROW)
)
const isMonthAvailable = (month: number) => isCalendarMonthAvailable(
  new CalendarDay(props.value.year, month, 1),
  props.bounds
)
const formatMonth = (month: number) => new Intl.DateTimeFormat(props.locale, {
  month: 'long',
}).format(new Date(props.value.year, month - 1, 1))

watch([
  () => props.appearance,
  () => props.value.month,
], async () => {
  await nextTick()

  if (props.appearance === 'list' && root.value !== null) {
    root.value.scrollTop = Math.max(0, props.value.month - 2) * MONTH_ROW_HEIGHT
  }
}, { immediate: true })
</script>
