<template>
    <section
        ref="root"
        :class="{
            'm3-date-picker': true,
            'm3-date-picker_docked': layout === 'docked',
            'm3-date-picker_navigation-inline': navigation === 'inline',
            [`m3-date-picker_weeks-${getCalendarMonthWeeks(displayedMonth, firstDayOfWeek).filter(
                week => week.some(day => day.inSameMonth(displayedMonth))
            ).length}`]: layout === 'docked',
        }"
        role="group"
        :aria-label="label"
        v-bind="$attrs"
    >
        <header v-if="layout === 'modal'" class="m3-date-picker__header">
            <div>
                <div class="m3-date-picker__label">
                    {{ label }}
                </div>
                <div class="m3-date-picker__headline">
                    {{ type === 'range'
                        ? [
                            selectedRange[0] ? formatDay(selectedRange[0], 'd MMM yyyy') : 'Start date',
                            selectedRange[1] ? formatDay(selectedRange[1], 'd MMM yyyy') : 'End date',
                        ].join(' - ')
                        : selectedDay
                            ? formatDay(selectedDay, 'd MMM yyyy')
                            : 'No date selected'
                    }}
                </div>
            </div>
            <div v-if="'header-action' in $slots" class="m3-date-picker__header-action">
                <slot name="header-action" />
            </div>
        </header>

        <div
            v-if="navigation !== 'none'"
            v-show="navigation !== 'inline'"
            :class="{
                'm3-date-picker__month-navigation': true,
                'm3-date-picker__month-navigation_picker': isPickerView,
            }"
        >
            <div class="m3-date-picker__navigation-group">
                <M3IconButton
                    :class="{
                        'm3-date-picker__navigation-control_hidden': isPickerView,
                    }"
                    :aria-label="isPickerView ? undefined : 'Previous month'"
                    :aria-hidden="isPickerView ? true : undefined"
                    :tabindex="isPickerView ? -1 : undefined"
                    :disabled="disabled || isPickerView || !canMoveToPreviousMonth"
                    @click="startMonthSlide(-1)"
                >
                    <M3Icon name="chevron_left" />
                </M3IconButton>

                <M3Button
                    v-if="hasMonthView"
                    :aria-label="isMonthView ? 'Switch to day selection' : 'Switch to month selection'"
                    :aria-expanded="isMonthView"
                    :disabled="disabled || isYearView"
                    appearance="text"
                    class="m3-date-picker__month-button"
                    @click="switchView(isMonthView ? DATE_PICKER_VIEW.DAYS : DATE_PICKER_VIEW.MONTHS)"
                >
                    {{ formatDay(displayedMonth, 'MMM') }}
                    <M3Icon
                        name="arrow_drop_down"
                        :class="{
                            'm3-date-picker__year-button-icon': true,
                            'm3-date-picker__year-button-icon_expanded': isMonthView,
                        }"
                    />
                </M3Button>

                <div
                    v-else
                    :class="{
                        'm3-date-picker__navigation-label': true,
                        'm3-date-picker__navigation-label_disabled': isYearView,
                    }"
                    aria-live="polite"
                >
                    {{ formatDay(displayedMonth, 'MMM') }}
                </div>

                <M3IconButton
                    :class="{
                        'm3-date-picker__navigation-control_hidden': isPickerView,
                    }"
                    :aria-label="isPickerView ? undefined : 'Next month'"
                    :aria-hidden="isPickerView ? true : undefined"
                    :tabindex="isPickerView ? -1 : undefined"
                    :disabled="disabled || isPickerView || !canMoveToNextMonth"
                    @click="startMonthSlide(1)"
                >
                    <M3Icon name="chevron_right" />
                </M3IconButton>
            </div>

            <div class="m3-date-picker__navigation-group">
                <M3IconButton
                    :class="{
                        'm3-date-picker__navigation-control_hidden': isDockedPickerView,
                    }"
                    :aria-label="isDockedPickerView ? undefined : 'Previous year'"
                    :aria-hidden="isDockedPickerView || undefined"
                    :tabindex="isDockedPickerView ? -1 : undefined"
                    :disabled="disabled || isDockedPickerView || !canMoveToPreviousYear"
                    @click="moveCursorByYear(-1)"
                >
                    <M3Icon name="chevron_left" />
                </M3IconButton>

                <M3Button
                    v-if="hasYearView"
                    appearance="text"
                    class="m3-date-picker__year-button"
                    :aria-label="isYearView ? 'Switch to day selection' : 'Switch to year selection'"
                    :aria-expanded="isYearView"
                    aria-controls="m3-year-picker"
                    :disabled="disabled || (layout === 'docked' && isMonthView)"
                    @click="switchView(isYearView ? DATE_PICKER_VIEW.DAYS : DATE_PICKER_VIEW.YEARS)"
                >
                    {{ formatDay(displayedMonth, 'yyyy') }}
                    <M3Icon
                        name="arrow_drop_down"
                        :class="{
                            'm3-date-picker__year-button-icon': true,
                            'm3-date-picker__year-button-icon_expanded': isYearView,
                        }"
                    />
                </M3Button>

                <div v-else class="m3-date-picker__navigation-label" aria-live="polite">
                    {{ formatDay(displayedMonth, 'yyyy') }}
                </div>

                <M3IconButton
                    :class="{
                        'm3-date-picker__navigation-control_hidden': isDockedPickerView,
                    }"
                    :aria-label="isDockedPickerView ? undefined : 'Next year'"
                    :aria-hidden="isDockedPickerView || undefined"
                    :tabindex="isDockedPickerView ? -1 : undefined"
                    :disabled="disabled || isDockedPickerView || !canMoveToNextYear"
                    @click="moveCursorByYear(1)"
                >
                    <M3Icon name="chevron_right" />
                </M3IconButton>
            </div>
        </div>

        <M3MonthPicker
            v-if="isMonthView"
            :value="displayedMonth"
            :current="today"
            :bounds="bounds"
            :disabled="disabled"
            :locale="locale"
            label="Select month"
            :appearance="layout === 'docked' ? 'list' : 'grid'"
            :animating="viewTransitioning"
            @select="selectMonth"
        />

        <div
            v-else-if="isYearView"
            v-show="navigation === 'inline'"
            class="m3-date-picker__inline-navigation m3-date-picker__inline-navigation_year-picker"
        >
            <M3Button
                appearance="text"
                class="m3-date-picker__inline-month-button"
                aria-label="Switch to day selection"
                :aria-expanded="isYearView"
                aria-controls="m3-year-picker"
                @click="scheduleInlineViewSwitch(DATE_PICKER_VIEW.DAYS)"
            >
                {{ formatDay(displayedMonth, 'MMMM yyyy') }}
                <M3Icon
                    name="arrow_drop_down"
                    class="m3-date-picker__year-button-icon m3-date-picker__year-button-icon_expanded"
                />
            </M3Button>
        </div>

        <M3YearPicker
            v-if="isYearView"
            id="m3-year-picker"
            :years="getCalendarYears(bounds)"
            :value="displayedMonth.year"
            :current="today.year"
            :bounds="bounds"
            :availability="availability"
            :disabled="disabled"
            :appearance="navigation === 'inline' ? 'grid' : 'list'"
            :animating="viewTransitioning"
            @select="selectYear"
        />

        <div
            v-else-if="!isMonthView"
            ref="calendar"
            :class="{
                'm3-date-picker__calendar': true,
                'm3-date-picker__calendar_swipeable': true,
                'm3-date-picker__mode-enter': viewTransitioning && navigation !== 'inline',
            }"
            :style="{ '--m3-date-picker-slide-offset': `${monthDragOffset}px` }"
            @pointerdown="onPointerDown"
            @pointermove="onPointerMove"
            @pointerup="onPointerUp"
            @pointercancel="onPointerCancel"
            @click.capture="onClickCapture"
        >
            <div class="m3-date-picker__month-viewport">
                <div
                    :class="{
                        'm3-date-picker__month-track': true,
                        'm3-date-picker__month-track_animating': monthSliding,
                    }"
                >
                    <div
                        v-for="page in getMonthPages()"
                        :key="`${page.key}-${page.month.timestamp}`"
                        class="m3-date-picker__month-page"
                        :aria-hidden="!page.active"
                    >
                        <div
                            v-if="navigation === 'inline'"
                            class="m3-date-picker__inline-navigation"
                        >
                            <M3Button
                                v-if="hasYearView"
                                appearance="text"
                                class="m3-date-picker__inline-month-button"
                                :aria-label="page.active ? 'Switch to year selection' : undefined"
                                :aria-expanded="page.active ? isYearView : undefined"
                                :aria-controls="page.active ? 'm3-year-picker' : undefined"
                                :tabindex="page.active ? undefined : -1"
                                @click="page.active && scheduleInlineViewSwitch(isYearView ? DATE_PICKER_VIEW.DAYS : DATE_PICKER_VIEW.YEARS)"
                            >
                                {{ formatDay(page.month, 'MMMM yyyy') }}
                                <M3Icon name="arrow_drop_down" />
                            </M3Button>

                            <div v-else class="m3-date-picker__inline-month-label">
                                {{ formatDay(page.month, 'MMMM yyyy') }}
                            </div>

                            <div class="m3-date-picker__inline-arrows">
                                <M3IconButton
                                    :aria-label="page.active ? 'Previous month' : undefined"
                                    :disabled="disabled || !canMoveToPreviousMonthFrom(page.month)"
                                    :tabindex="page.active ? undefined : -1"
                                    @click="page.active && startMonthSlide(-1)"
                                >
                                    <M3Icon name="chevron_left" />
                                </M3IconButton>

                                <M3IconButton
                                    :aria-label="page.active ? 'Next month' : undefined"
                                    :disabled="disabled || !canMoveToNextMonthFrom(page.month)"
                                    :tabindex="page.active ? undefined : -1"
                                    @click="page.active && startMonthSlide(1)"
                                >
                                    <M3Icon name="chevron_right" />
                                </M3IconButton>
                            </div>
                        </div>

                        <M3DayPicker
                            :class="{
                                'm3-date-picker__mode-enter': viewTransitioning && navigation === 'inline',
                            }"
                            :type="type"
                            :month="page.month"
                            :today="today"
                            :value="type === 'range' ? selectedRange : selectedDay"
                            :bounds="bounds"
                            :availability="availability"
                            :active="page.active"
                            :disabled="disabled"
                            :locale="locale"
                            :first-day-of-week="firstDayOfWeek"
                            :fixed="layout !== 'docked'"
                            :label="formatDay(displayedMonth, 'MMMM yyyy')"
                            @select="selectDay"
                        />
                    </div>
                </div>
            </div>
        </div>

        <footer v-if="layout === 'docked' && !isPickerView && 'footer' in $slots" class="m3-date-picker__footer">
            <slot name="footer" />
        </footer>
    </section>
</template>

<script lang="ts" setup>
import type {
  CalendarAvailability,
  CalendarDateRange,
  CalendarDayRange,
  CalendarYearRange,
} from '@modulify/m3-foundation/lib/calendar'
import type { ElementReference } from '@modulify/m3-foundation/types/dom'
import type { PropType } from 'vue'

import {
  CalendarDay,
  clampCalendarMonth,
  createDayFormatter,
} from '@modulify/m3-foundation/lib/calendar'

import { computed } from 'vue'
import {
  getCalendarBounds,
  getCalendarMonthWeeks,
  getCalendarYears,
  getNextCalendarDayRange,
  isNextCalendarMonthAvailable as isNextMonthAvailable,
  isNextCalendarYearAvailable,
  isPreviousCalendarMonthAvailable as isPrevMonthAvailable,
  isPreviousCalendarYearAvailable,
} from '@modulify/m3-foundation/lib/calendar'
import { setCalendarMonthYear } from '@modulify/m3-foundation/lib/calendar'
import { shallowRef } from 'vue'
import {
  shiftCalendarMonth,
  shiftCalendarYear,
} from '@modulify/m3-foundation/lib/calendar'
import {
  toCalendarDateRange,
  toCalendarDayRange,
} from '@modulify/m3-foundation/lib/calendar'
import { watch } from 'vue'

import { M3Button } from '@/components/button'
import { M3Icon } from '@/components/icon'
import { M3IconButton } from '@/components/icon-button'

import { useTimeout } from '@/composables/timing'

import M3DayPicker from './M3DayPicker.vue'
import M3MonthPicker from './M3MonthPicker.vue'
import M3YearPicker from './M3YearPicker.vue'

const MONTH_SWIPE = {
  activationThreshold: 8,
  navigationThreshold: 48,
  transitionDuration: 200,
  fallbackWidth: 360,
} as const

const VIEW_TRANSITION = {
  duration: 180,
  inlineDelay: 120,
} as const

const DATE_PICKER_VIEW = {
  DAYS: 'days',
  MONTHS: 'months',
  YEARS: 'years',
} as const

type M3DatePickerView = typeof DATE_PICKER_VIEW[keyof typeof DATE_PICKER_VIEW]

interface MonthSwipeState {
  pointerId: number;
  x: number;
  y: number;
  active: boolean;
}

interface MonthPage {
  month: CalendarDay;
  active: boolean;
  key: string;
}

const isInteractiveSwipeTarget = (target: EventTarget | null) => (
  target instanceof Element
  && target.closest('button, a, input, textarea, select, [role="button"]') !== null
)

const isCalendarDaySwipeTarget = (target: EventTarget | null) => (
  target instanceof Element
  && target.closest('.m3-date-picker-option') !== null
)

defineOptions({
  inheritAttrs: false,
})

const props = defineProps({
  value: {
    type: [Date, Array] as PropType<Date | CalendarDateRange | null>,
    default: null,
  },

  type: {
    type: String as PropType<'single' | 'range'>,
    validator: (mode: string) => ['single', 'range'].includes(mode),
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

  layout: {
    type: String as PropType<'modal' | 'docked'>,
    validator: (layout: string) => ['modal', 'docked'].includes(layout),
    default: 'modal',
  },

  navigation: {
    type: String as PropType<'split' | 'inline' | 'none'>,
    validator: (variant: string) => ['split', 'inline', 'none'].includes(variant),
    default: 'split',
  },

  views: {
    type: Array as PropType<M3DatePickerView[]>,
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

  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits([
  'change',
  'update:cursor',
  'update:value',
])

const root = shallowRef<HTMLElement | null>(null)
const calendar = shallowRef<HTMLElement | null>(null)

const today = new CalendarDay()

const formatDay = computed(() => createDayFormatter(props.locale))

const selectedDay = computed(() => props.type !== 'range' && props.value instanceof Date ? new CalendarDay(props.value) : null)
const selectedRange = computed(() => props.type === 'range' ? toCalendarDayRange(props.value) : [null, null] as CalendarDayRange)

const bounds = computed(() => getCalendarBounds(
  props.yearRange,
  props.min ? new CalendarDay(props.min) : null,
  props.max ? new CalendarDay(props.max) : null
))

const uncontrolledCursor = shallowRef(selectedDay.value ?? selectedRange.value[0] ?? selectedRange.value[1] ?? today)
const isCursorControlled = computed(() => props.cursor !== undefined)
const displayedMonth = computed(() => clampCalendarMonth(
  props.cursor instanceof Date ? new CalendarDay(props.cursor) : uncontrolledCursor.value,
  bounds.value
))

const canMoveToPreviousMonthFrom = (month: CalendarDay) => isPrevMonthAvailable(month, bounds.value)
const canMoveToNextMonthFrom = (month: CalendarDay) => isNextMonthAvailable(month, bounds.value)

const canMoveToPreviousMonth = computed(() => canMoveToPreviousMonthFrom(displayedMonth.value))
const canMoveToNextMonth = computed(() => canMoveToNextMonthFrom(displayedMonth.value))
const canMoveToPreviousYear = computed(() => isPreviousCalendarYearAvailable(displayedMonth.value, bounds.value))
const canMoveToNextYear = computed(() => isNextCalendarYearAvailable(displayedMonth.value, bounds.value))

const activeView = shallowRef<M3DatePickerView>(DATE_PICKER_VIEW.DAYS)
const isMonthView = computed(() => activeView.value === DATE_PICKER_VIEW.MONTHS)
const isYearView = computed(() => activeView.value === DATE_PICKER_VIEW.YEARS)
const hasMonthView = computed(() => props.views.includes(DATE_PICKER_VIEW.MONTHS))
const hasYearView = computed(() => props.views.includes(DATE_PICKER_VIEW.YEARS))
const isPickerView = computed(() => isMonthView.value || isYearView.value)
const isDockedPickerView = computed(() => props.layout === 'docked' && isPickerView.value)
const viewTransitioning = shallowRef(false)
const viewTransitionEnd = useTimeout(
  () => viewTransitioning.value = false,
  VIEW_TRANSITION.duration
)
const inlineViewSwitchTimeout = useTimeout(
  (view: M3DatePickerView) => switchView(view),
  VIEW_TRANSITION.inlineDelay
)

const monthSwipe = shallowRef<MonthSwipeState | null>(null)
const monthDragOffset = shallowRef(0)
const monthSliding = shallowRef(false)
const monthSlideEnd = useTimeout((offset: number) => {
  monthSliding.value = false
  monthDragOffset.value = 0
  moveCursorByMonth(offset)
}, MONTH_SWIPE.transitionDuration)
const monthSlideReset = useTimeout(
  () => monthSliding.value = false,
  MONTH_SWIPE.transitionDuration
)

const clickSuppressed = shallowRef(false)
const clickSuppressionEnd = useTimeout(
  () => clickSuppressed.value = false,
  MONTH_SWIPE.transitionDuration
)

defineExpose({
  get el () { return root.value },
} satisfies ElementReference<HTMLElement>)

const getMonthPages = (): MonthPage[] => {
  return [
    {
      month: canMoveToPreviousMonth.value
        ? shiftCalendarMonth(displayedMonth.value, -1, bounds.value)
        : displayedMonth.value,
      active: false,
      key: 'previous',
    },
    {
      month: displayedMonth.value,
      active: true,
      key: 'current',
    },
    {
      month: canMoveToNextMonth.value
        ? shiftCalendarMonth(displayedMonth.value, 1, bounds.value)
        : displayedMonth.value,
      active: false,
      key: 'next',
    },
  ]
}

const updateCursor = (month: CalendarDay) => {
  const nextMonth = clampCalendarMonth(month, bounds.value)

  if (!isCursorControlled.value) {
    uncontrolledCursor.value = nextMonth
  }

  emit('update:cursor', nextMonth.date)
}

const moveCursorByMonth = (offset: number) => {
  updateCursor(shiftCalendarMonth(displayedMonth.value, offset, bounds.value))
}

const moveCursorByYear = (offset: number) => {
  updateCursor(shiftCalendarYear(displayedMonth.value, offset, bounds.value))
}

const switchView = (view: M3DatePickerView) => {
  if (view === activeView.value) {
    return
  }

  activeView.value = view
  viewTransitioning.value = true
  viewTransitionEnd.schedule()
}

const scheduleInlineViewSwitch = (view: M3DatePickerView) => {
  inlineViewSwitchTimeout.schedule(view)
}

const startMonthSlide = (offset: number) => {
  if (monthSliding.value) return

  const canMove = offset > 0 ? canMoveToNextMonth.value : canMoveToPreviousMonth.value
  const width = calendar.value?.getBoundingClientRect().width || MONTH_SWIPE.fallbackWidth

  if (!canMove) {
    monthDragOffset.value = 0
    return
  }

  monthDragOffset.value = offset > 0 ? -width : width
  monthSliding.value = true
  monthSlideEnd.schedule(offset)
}

const selectMonth = (month: number) => {
  updateCursor(new CalendarDay(displayedMonth.value.year, month, 1))
  switchView(DATE_PICKER_VIEW.DAYS)
}

const selectYear = (year: number) => {
  updateCursor(setCalendarMonthYear(displayedMonth.value, year, bounds.value))
  switchView(DATE_PICKER_VIEW.DAYS)
}

const selectDay = (day: CalendarDay) => {
  const value = props.type === 'range'
    ? toCalendarDateRange(getNextCalendarDayRange(selectedRange.value, day))
    : day.date

  emit('change', value)
  emit('update:value', value)
}

const suppressClickAfterSwipe = () => {
  clickSuppressed.value = true

  clickSuppressionEnd.schedule()
}

const onPointerDown = (event: PointerEvent) => {
  const interactiveTarget = isInteractiveSwipeTarget(event.target)

  if (
    props.disabled
    || isMonthView.value
    || isYearView.value
    || monthSliding.value
    || event.button !== 0
    || (interactiveTarget && !isCalendarDaySwipeTarget(event.target))
  ) {
    return
  }

  monthSwipe.value = {
    pointerId: event.pointerId,
    x: event.clientX,
    y: event.clientY,
    active: !interactiveTarget,
  }

  const currentTarget = event.currentTarget
  if (!interactiveTarget && currentTarget instanceof HTMLElement) {
    currentTarget.setPointerCapture?.(event.pointerId)
  }
}

const onPointerUp = (event: PointerEvent) => {
  const activeSwipe = monthSwipe.value
  if (activeSwipe === null || activeSwipe.pointerId !== event.pointerId) return

  monthSwipe.value = null

  const deltaX = event.clientX - activeSwipe.x
  const deltaY = event.clientY - activeSwipe.y

  if (!activeSwipe.active) {
    monthSwipe.value = null
    return
  }

  if (Math.abs(deltaX) >= MONTH_SWIPE.navigationThreshold && Math.abs(deltaX) > Math.abs(deltaY)) {
    const offset = deltaX < 0 ? 1 : -1
    const canMove = offset > 0 ? canMoveToNextMonth.value : canMoveToPreviousMonth.value

    if (canMove) {
      startMonthSlide(offset)
    } else {
      monthDragOffset.value = 0
    }

    return
  }

  monthSliding.value = true
  monthDragOffset.value = 0
  monthSlideReset.schedule()
}

const onPointerMove = (event: PointerEvent) => {
  const activeSwipe = monthSwipe.value
  if (activeSwipe === null || activeSwipe.pointerId !== event.pointerId) return

  const deltaX = event.clientX - activeSwipe.x
  const deltaY = event.clientY - activeSwipe.y

  if (Math.abs(deltaX) <= Math.abs(deltaY)) return

  if (!activeSwipe.active) {
    if (Math.abs(deltaX) < MONTH_SWIPE.activationThreshold) {
      return
    }

    activeSwipe.active = true
    suppressClickAfterSwipe()

    const currentTarget = event.currentTarget

    if (currentTarget instanceof HTMLElement) {
      currentTarget.setPointerCapture?.(event.pointerId)
    }
  }

  const canMove = deltaX < 0 ? canMoveToNextMonth.value : canMoveToPreviousMonth.value
  const width = calendar.value?.getBoundingClientRect().width || MONTH_SWIPE.fallbackWidth

  monthDragOffset.value = canMove ? Math.max(-width, Math.min(width, deltaX)) : 0
}

const onPointerCancel = () => {
  monthSwipe.value = null
  monthDragOffset.value = 0
  monthSliding.value = true
  monthSlideReset.schedule()
}

const onClickCapture = (event: MouseEvent) => {
  if (clickSuppressed.value) {
    clickSuppressed.value = false
    clickSuppressionEnd.cancel()
    event.preventDefault()
    event.stopPropagation()
  }
}

watch(selectedDay, (day) => {
  if (isCursorControlled.value) return

  const selected = day ?? selectedRange.value[0] ?? selectedRange.value[1]
  if (selected !== null) {
    uncontrolledCursor.value = clampCalendarMonth(selected, bounds.value)
  }
})

watch(selectedRange, (range) => {
  if (isCursorControlled.value) return

  const selected = selectedDay.value ?? range[0] ?? range[1]
  if (selected !== null) {
    uncontrolledCursor.value = clampCalendarMonth(selected, bounds.value)
  }
})

watch(bounds, (range) => {
  if (!isCursorControlled.value) {
    uncontrolledCursor.value = clampCalendarMonth(displayedMonth.value, range)
  }
})
</script>
