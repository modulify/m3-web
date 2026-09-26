<template>
    <div
        :id="id"
        ref="root"
        :class="{
            'm3-year-picker': true,
            [`m3-year-picker_${appearance}`]: true,
            'm3-year-picker_animating': animating,
        }"
    >
        <M3List
            v-if="appearance === 'list'"
            aria-label="Select year"
            class="m3-date-picker-list"
        >
            <M3ListItem
                v-for="year in years"
                :key="year"
                :selected="value === year"
                :disabled="disabled || !isYearSelectable(year)"
                @click="emit('select', year)"
            >
                <template #leading>
                    <M3Icon
                        :class="{
                            'm3-date-picker-list__check': true,
                            'm3-date-picker-list__check_hidden': value !== year,
                        }"
                        aria-hidden="true"
                        name="check"
                    />
                </template>
                {{ year }}
            </M3ListItem>
        </M3List>
        <div
            v-else
            role="grid"
            aria-label="Select year"
            class="m3-year-picker__grid"
        >
            <M3DatePickerOption
                v-for="year in years"
                :key="year"
                :aria-pressed="value === year"
                :current="current === year"
                :selected="value === year"
                :disabled="disabled || !isYearSelectable(year)"
                appearance="pill"
                @select="emit('select', year)"
            >
                {{ year }}
            </M3DatePickerOption>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type {
  CalendarAvailability,
  CalendarDayBounds,
} from '@modulify/m3-foundation/lib/calendar'
import type { PropType } from 'vue'

import {
  isCalendarYearAvailable,
  isCalendarYearSelectable,
} from '@modulify/m3-foundation/lib/calendar'
import { nextTick, shallowRef, watch } from 'vue'

import { M3Icon } from '@/components/icon'
import { M3List, M3ListItem } from '@/components/list'

import M3DatePickerOption from './M3DatePickerOption'

const YEAR_ROW_HEIGHT = 56
const YEAR_GRID_COLUMNS = 3

const props = defineProps({
  value: {
    type: Number,
    required: true,
  },

  current: {
    type: Number,
    required: true,
  },

  years: {
    type: Array as PropType<number[]>,
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

  appearance: {
    type: String as PropType<'grid' | 'list'>,
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

  id: {
    type: String,
    required: true,
  },
})

const emit = defineEmits<{
  'select': [year: number];
}>()

const root = shallowRef<HTMLElement | null>(null)
const isYearSelectable = (year: number) => isCalendarYearAvailable(year, props.bounds) &&
  isCalendarYearSelectable(year, props.availability)

watch([
  () => props.value,
  () => props.appearance,
  () => props.years,
], async () => {
  await nextTick()

  if (root.value === null || props.years.length === 0) {
    return
  }

  const selectedIndex = Math.max(0, props.value - props.years[0])
  const selectedRow = props.appearance === 'grid' ? Math.floor(selectedIndex / YEAR_GRID_COLUMNS) : selectedIndex

  root.value.scrollTop = Math.max(0, selectedRow - 1) * YEAR_ROW_HEIGHT
}, { immediate: true })
</script>
