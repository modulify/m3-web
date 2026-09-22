<template>
    <section
        :class="{
            'm3-date-picker': true,
            'm3-date-picker_docked': layout === 'docked',
            'm3-date-picker_navigation-inline': navigation === 'inline',
            [`m3-date-picker_weeks-${visibleWeeks}`]: layout === 'docked',
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
                    {{ selectedLabel }}
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
                'm3-date-picker__month-navigation_picker': monthPickerVisible || yearPickerVisible,
            }"
        >
            <div class="m3-date-picker__navigation-group">
                <M3IconButton
                    :class="{
                        'm3-date-picker__navigation-control_hidden': monthPickerVisible || yearPickerVisible,
                    }"
                    :aria-label="monthPickerVisible || yearPickerVisible ? undefined : 'Previous month'"
                    :aria-hidden="monthPickerVisible || yearPickerVisible ? true : undefined"
                    :tabindex="monthPickerVisible || yearPickerVisible ? -1 : undefined"
                    :disabled="disabled || monthPickerVisible || yearPickerVisible || !previousMonthAvailable"
                    @click="animateMonthShift(-1)"
                >
                    <M3Icon name="chevron_left" />
                </M3IconButton>

                <M3Button
                    v-if="monthPickerAvailable"
                    :aria-label="monthPickerVisible ? 'Switch to day selection' : 'Switch to month selection'"
                    :aria-expanded="monthPickerVisible"
                    :disabled="disabled || yearPickerVisible"
                    appearance="text"
                    class="m3-date-picker__month-button"
                    @click="setCalendarView(monthPickerVisible ? DATE_PICKER_VIEW.DAYS : DATE_PICKER_VIEW.MONTHS)"
                >
                    {{ monthLabel }}
                    <M3Icon
                        name="arrow_drop_down"
                        :class="{
                            'm3-date-picker__year-button-icon': true,
                            'm3-date-picker__year-button-icon_expanded': monthPickerVisible,
                        }"
                    />
                </M3Button>

                <div
                    v-else
                    :class="{
                        'm3-date-picker__navigation-label': true,
                        'm3-date-picker__navigation-label_disabled': yearPickerVisible,
                    }"
                    aria-live="polite"
                >
                    {{ monthLabel }}
                </div>

                <M3IconButton
                    :class="{
                        'm3-date-picker__navigation-control_hidden': monthPickerVisible || yearPickerVisible,
                    }"
                    :aria-label="monthPickerVisible || yearPickerVisible ? undefined : 'Next month'"
                    :aria-hidden="monthPickerVisible || yearPickerVisible ? true : undefined"
                    :tabindex="monthPickerVisible || yearPickerVisible ? -1 : undefined"
                    :disabled="disabled || monthPickerVisible || yearPickerVisible || !nextMonthAvailable"
                    @click="animateMonthShift(1)"
                >
                    <M3Icon name="chevron_right" />
                </M3IconButton>
            </div>

            <div class="m3-date-picker__navigation-group">
                <M3IconButton
                    :class="{
                        'm3-date-picker__navigation-control_hidden': dockedPickerMenuVisible,
                    }"
                    :aria-label="dockedPickerMenuVisible ? undefined : 'Previous year'"
                    :aria-hidden="dockedPickerMenuVisible || undefined"
                    :tabindex="dockedPickerMenuVisible ? -1 : undefined"
                    :disabled="disabled || dockedPickerMenuVisible || !previousYearAvailable"
                    @click="shiftYear(-1)"
                >
                    <M3Icon name="chevron_left" />
                </M3IconButton>

                <M3Button
                    v-if="yearPickerAvailable"
                    appearance="text"
                    class="m3-date-picker__year-button"
                    :aria-label="yearPickerVisible ? 'Switch to day selection' : 'Switch to year selection'"
                    :aria-expanded="yearPickerVisible"
                    aria-controls="m3-year-picker"
                    :disabled="disabled || (layout === 'docked' && monthPickerVisible)"
                    @click="setCalendarView(yearPickerVisible ? DATE_PICKER_VIEW.DAYS : DATE_PICKER_VIEW.YEARS)"
                >
                    {{ yearLabel }}
                    <M3Icon
                        name="arrow_drop_down"
                        :class="{
                            'm3-date-picker__year-button-icon': true,
                            'm3-date-picker__year-button-icon_expanded': yearPickerVisible,
                        }"
                    />
                </M3Button>

                <div v-else class="m3-date-picker__navigation-label" aria-live="polite">
                    {{ yearLabel }}
                </div>

                <M3IconButton
                    :class="{
                        'm3-date-picker__navigation-control_hidden': dockedPickerMenuVisible,
                    }"
                    :aria-label="dockedPickerMenuVisible ? undefined : 'Next year'"
                    :aria-hidden="dockedPickerMenuVisible || undefined"
                    :tabindex="dockedPickerMenuVisible ? -1 : undefined"
                    :disabled="disabled || dockedPickerMenuVisible || !nextYearAvailable"
                    @click="shiftYear(1)"
                >
                    <M3Icon name="chevron_right" />
                </M3IconButton>
            </div>
        </div>

        <M3MonthPicker
            v-if="monthPickerVisible"
            :value="position"
            :current="today"
            :bounds="bounds"
            :disabled="disabled"
            :locale="locale"
            label="Select month"
            :appearance="layout === 'docked' ? 'list' : 'grid'"
            :animating="modeAnimating"
            @select="selectMonth"
        />

        <div
            v-else-if="yearPickerVisible"
            v-show="navigation === 'inline'"
            class="m3-date-picker__inline-navigation m3-date-picker__inline-navigation_year-picker"
        >
            <M3Button
                appearance="text"
                class="m3-date-picker__inline-month-button"
                aria-label="Switch to day selection"
                :aria-expanded="yearPickerVisible"
                aria-controls="m3-year-picker"
                @click="setInlineCalendarView(DATE_PICKER_VIEW.DAYS)"
            >
                {{ calendarLabel }}
                <M3Icon
                    name="arrow_drop_down"
                    class="m3-date-picker__year-button-icon m3-date-picker__year-button-icon_expanded"
                />
            </M3Button>
        </div>

        <M3YearPicker
            v-if="yearPickerVisible"
            id="m3-year-picker"
            :years="years"
            :value="position.year"
            :current="today.year"
            :bounds="bounds"
            :availability="availability"
            :disabled="disabled"
            :appearance="navigation === 'inline' ? 'grid' : 'list'"
            :animating="modeAnimating"
            @select="selectYear"
        />

        <div
            v-else-if="!monthPickerVisible"
            ref="calendar"
            :class="{
                'm3-date-picker__calendar': true,
                'm3-date-picker__calendar_swipeable': true,
                'm3-date-picker__mode-enter': modeAnimating && navigation !== 'inline',
            }"
            :style="{ '--m3-date-picker-slide-offset': `${dragOffset}px` }"
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
                        'm3-date-picker__month-track_animating': slideAnimating,
                    }"
                >
                    <div
                        v-for="page in monthPages"
                        :key="`${page.key}-${page.month.timestamp}`"
                        class="m3-date-picker__month-page"
                        :aria-hidden="!page.active"
                    >
                        <div
                            v-if="navigation === 'inline'"
                            class="m3-date-picker__inline-navigation"
                        >
                            <M3Button
                                v-if="yearPickerAvailable"
                                appearance="text"
                                class="m3-date-picker__inline-month-button"
                                :aria-label="page.active ? 'Switch to year selection' : undefined"
                                :aria-expanded="page.active ? yearPickerVisible : undefined"
                                :aria-controls="page.active ? 'm3-year-picker' : undefined"
                                :tabindex="page.active ? undefined : -1"
                                @click="page.active && setInlineCalendarView(yearPickerVisible ? DATE_PICKER_VIEW.DAYS : DATE_PICKER_VIEW.YEARS)"
                            >
                                {{ formatMonthYear(page.month) }}
                                <M3Icon name="arrow_drop_down" />
                            </M3Button>

                            <div v-else class="m3-date-picker__inline-month-label">
                                {{ formatMonthYear(page.month) }}
                            </div>

                            <div class="m3-date-picker__inline-arrows">
                                <M3IconButton
                                    :aria-label="page.active ? 'Previous month' : undefined"
                                    :disabled="disabled || !isPreviousMonthAvailable(page.month)"
                                    :tabindex="page.active ? undefined : -1"
                                    @click="page.active && animateMonthShift(-1)"
                                >
                                    <M3Icon name="chevron_left" />
                                </M3IconButton>

                                <M3IconButton
                                    :aria-label="page.active ? 'Next month' : undefined"
                                    :disabled="disabled || !isNextMonthAvailable(page.month)"
                                    :tabindex="page.active ? undefined : -1"
                                    @click="page.active && animateMonthShift(1)"
                                >
                                    <M3Icon name="chevron_right" />
                                </M3IconButton>
                            </div>
                        </div>

                        <M3DayPicker
                            :class="{
                                'm3-date-picker__mode-enter': modeAnimating && navigation === 'inline',
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
                            :label="calendarLabel"
                            @select="selectDay"
                        />
                    </div>
                </div>
            </div>
        </div>

        <footer v-if="layout === 'docked' && !pickerMenuVisible && 'footer' in $slots" class="m3-date-picker__footer">
            <slot name="footer" />
        </footer>
    </section>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'

import {
  CalendarDay,
  clampCalendarMonth,
  getCalendarBounds,
  getCalendarMonthWeeks,
  getCalendarYears,
  getNextCalendarDayRange,
  isNextCalendarMonthAvailable,
  isNextCalendarYearAvailable,
  isPreviousCalendarMonthAvailable,
  isPreviousCalendarYearAvailable,
  setCalendarMonthYear,
  shiftCalendarMonth,
  shiftCalendarYear,
} from '@modulify/m3-foundation/lib/calendar'

import type {
  CalendarDayRange,
  CalendarAvailability,
  CalendarYearRange,
} from '@modulify/m3-foundation/lib/calendar'

import { M3Button } from '@/components/button'
import { M3Icon } from '@/components/icon'
import { M3IconButton } from '@/components/icon-button'
import M3YearPicker from './M3YearPicker.vue'
import M3DayPicker from './M3DayPicker.vue'
import M3MonthPicker from './M3MonthPicker.vue'

import {
  computed,
  onBeforeUnmount,
  shallowRef,
  watch,
} from 'vue'

const SWIPE_ACTIVATION_THRESHOLD = 8
const SWIPE_THRESHOLD = 48
const SLIDE_DURATION_MS = 200
const MODE_TRANSITION_DURATION_MS = 180
const INLINE_MODE_SWITCH_RIPPLE_DELAY_MS = 120
const SLIDE_FALLBACK_WIDTH = 360

const DATE_PICKER_VIEW = {
  DAYS: 'days',
  MONTHS: 'months',
  YEARS: 'years',
} as const

type M3DatePickerView = typeof DATE_PICKER_VIEW[keyof typeof DATE_PICKER_VIEW]

interface SwipeState {
  pointerId: number;
  x: number;
  y: number;
  active: boolean;
}

interface CalendarMonthPage {
  month: CalendarDay;
  active: boolean;
  key: string;
}

defineOptions({
  inheritAttrs: false,
})

const props = defineProps({
  value: {
    type: [Date, Array] as PropType<Date | [Date | null, Date | null] | null>,
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

const isRangeValue = (value: unknown): value is [Date | null, Date | null] => Array.isArray(value)
const toSelectedRange = (value: unknown): CalendarDayRange => {
  if (!isRangeValue(value)) {
    return [null, null]
  }

  const [
    start,
    end,
  ] = value

  return [
    start instanceof Date ? new CalendarDay(start) : null,
    end instanceof Date ? new CalendarDay(end) : null,
  ]
}
const toRangeValue = (range: CalendarDayRange): [Date | null, Date | null] => [
  range[0]?.date ?? null,
  range[1]?.date ?? null,
]
const selectedDay = computed(() => props.type !== 'range' && props.value instanceof Date ? new CalendarDay(props.value) : null)
const selectedRange = computed(() => props.type === 'range' ? toSelectedRange(props.value) : [null, null] as CalendarDayRange)
const today = new CalendarDay()
const cursorInternal = shallowRef(selectedDay.value ?? selectedRange.value[0] ?? selectedRange.value[1] ?? today)
const minDay = computed(() => props.min ? new CalendarDay(props.min) : null)
const maxDay = computed(() => props.max ? new CalendarDay(props.max) : null)
const bounds = computed(() => getCalendarBounds(props.yearRange, minDay.value, maxDay.value))
const cursorControlled = computed(() => props.cursor !== undefined)
const cursorSource = computed(() => props.cursor instanceof Date
  ? new CalendarDay(props.cursor)
  : cursorInternal.value
)
const position = computed(() => clampCalendarMonth(cursorSource.value, bounds.value))
const years = computed(() => getCalendarYears(bounds.value))
const previousMonthAvailable = computed(() => isPreviousCalendarMonthAvailable(position.value, bounds.value))
const nextMonthAvailable = computed(() => isNextCalendarMonthAvailable(position.value, bounds.value))
const previousYearAvailable = computed(() => isPreviousCalendarYearAvailable(position.value, bounds.value))
const nextYearAvailable = computed(() => isNextCalendarYearAvailable(position.value, bounds.value))
const monthPages = computed<CalendarMonthPage[]>(() => [
  {
    month: previousMonthAvailable.value
      ? shiftCalendarMonth(position.value, -1, bounds.value)
      : position.value,
    active: false,
    key: 'previous',
  },
  {
    month: position.value,
    active: true,
    key: 'current',
  },
  {
    month: nextMonthAvailable.value
      ? shiftCalendarMonth(position.value, 1, bounds.value)
      : position.value,
    active: false,
    key: 'next',
  },
])
const calendarView = shallowRef<M3DatePickerView>(DATE_PICKER_VIEW.DAYS)
const monthPickerVisible = computed(() => calendarView.value === DATE_PICKER_VIEW.MONTHS)
const yearPickerVisible = computed(() => calendarView.value === DATE_PICKER_VIEW.YEARS)
const monthPickerAvailable = computed(() => props.views.includes(DATE_PICKER_VIEW.MONTHS))
const yearPickerAvailable = computed(() => props.views.includes(DATE_PICKER_VIEW.YEARS))
const pickerMenuVisible = computed(() => monthPickerVisible.value || yearPickerVisible.value)
const dockedPickerMenuVisible = computed(() => props.layout === 'docked' && pickerMenuVisible.value)
const visibleWeeks = computed(() => getCalendarMonthWeeks(position.value, props.firstDayOfWeek).filter(
  week => week.some(day => day.inSameMonth(position.value))
).length)
const modeAnimating = shallowRef(false)
const calendar = shallowRef<HTMLElement | null>(null)
const dragOffset = shallowRef(0)
const slideAnimating = shallowRef(false)
const swipe = shallowRef<SwipeState | null>(null)
const suppressClick = shallowRef(false)
let modeTimer: number | null = null
let inlineModeSwitchTimer: number | null = null
let slideTimer: number | null = null
let suppressClickTimer: number | null = null
const calendarLabel = computed(() => new Intl.DateTimeFormat(props.locale, {
  month: 'long',
  year: 'numeric',
}).format(position.value.date))
const monthLabel = computed(() => new Intl.DateTimeFormat(props.locale, {
  month: 'short',
}).format(position.value.date))
const yearLabel = computed(() => new Intl.DateTimeFormat(props.locale, {
  year: 'numeric',
}).format(position.value.date))
const selectedLabel = computed(() => {
  const formatter = new Intl.DateTimeFormat(props.locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  if (props.type === 'range') {
    return [
      selectedRange.value[0] ? formatter.format(selectedRange.value[0].date) : 'Start date',
      selectedRange.value[1] ? formatter.format(selectedRange.value[1].date) : 'End date',
    ].join(' - ')
  }

  return selectedDay.value ? formatter.format(selectedDay.value.date) : 'No date selected'
})

const setCursor = (month: CalendarDay) => {
  const nextMonth = clampCalendarMonth(month, bounds.value)

  if (!cursorControlled.value) {
    cursorInternal.value = nextMonth
  }

  emit('update:cursor', nextMonth.date)
}

watch(selectedDay, (day) => {
  if (cursorControlled.value) {
    return
  }

  const selected = day ?? selectedRange.value[0] ?? selectedRange.value[1]

  if (selected !== null) {
    cursorInternal.value = clampCalendarMonth(selected, bounds.value)
  }
})

watch(selectedRange, (range) => {
  if (cursorControlled.value) {
    return
  }

  const selected = selectedDay.value ?? range[0] ?? range[1]

  if (selected !== null) {
    cursorInternal.value = clampCalendarMonth(selected, bounds.value)
  }
})

watch(bounds, (range) => {
  if (!cursorControlled.value) {
    cursorInternal.value = clampCalendarMonth(position.value, range)
  }
})

onBeforeUnmount(() => {
  if (slideTimer !== null) {
    window.clearTimeout(slideTimer)
  }

  if (modeTimer !== null) {
    window.clearTimeout(modeTimer)
  }

  if (suppressClickTimer !== null) {
    window.clearTimeout(suppressClickTimer)
  }

  if (inlineModeSwitchTimer !== null) {
    window.clearTimeout(inlineModeSwitchTimer)
  }
})

const isInteractiveSwipeTarget = (target: EventTarget | null) => (
  target instanceof Element
  && target.closest('button, a, input, textarea, select, [role="button"]') !== null
)
const isCalendarDaySwipeTarget = (target: EventTarget | null) => (
  target instanceof Element
  && target.closest('.m3-date-picker-option') !== null
)
const isPreviousMonthAvailable = (month: CalendarDay) => isPreviousCalendarMonthAvailable(month, bounds.value)
const isNextMonthAvailable = (month: CalendarDay) => isNextCalendarMonthAvailable(month, bounds.value)
const formatMonthYear = (day: CalendarDay) => new Intl.DateTimeFormat(props.locale, {
  month: 'long',
  year: 'numeric',
}).format(day.date)
const shiftMonth = (offset: number) => {
  setCursor(shiftCalendarMonth(position.value, offset, bounds.value))
}

const shiftYear = (offset: number) => {
  setCursor(shiftCalendarYear(position.value, offset, bounds.value))
}

const setCalendarView = (view: M3DatePickerView) => {
  if (view === calendarView.value) {
    return
  }

  if (modeTimer !== null) {
    window.clearTimeout(modeTimer)
  }

  modeAnimating.value = true
  calendarView.value = view

  modeTimer = window.setTimeout(() => {
    modeTimer = null
    modeAnimating.value = false
  }, MODE_TRANSITION_DURATION_MS)
}

const setInlineCalendarView = (view: M3DatePickerView) => {
  if (inlineModeSwitchTimer !== null) {
    window.clearTimeout(inlineModeSwitchTimer)
  }

  inlineModeSwitchTimer = window.setTimeout(() => {
    inlineModeSwitchTimer = null
    setCalendarView(view)
  }, INLINE_MODE_SWITCH_RIPPLE_DELAY_MS)
}

const animateMonthShift = (offset: number) => {
  if (slideAnimating.value) {
    return
  }

  const available = offset > 0 ? nextMonthAvailable.value : previousMonthAvailable.value
  const width = calendar.value?.getBoundingClientRect().width || SLIDE_FALLBACK_WIDTH

  if (!available) {
    dragOffset.value = 0
    return
  }

  slideAnimating.value = true
  dragOffset.value = offset > 0 ? -width : width

  if (slideTimer !== null) {
    window.clearTimeout(slideTimer)
  }

  slideTimer = window.setTimeout(() => {
    slideTimer = null
    slideAnimating.value = false
    dragOffset.value = 0
    shiftMonth(offset)
  }, SLIDE_DURATION_MS)
}

const selectMonth = (month: number) => {
  setCursor(new CalendarDay(position.value.year, month, 1))
  setCalendarView(DATE_PICKER_VIEW.DAYS)
}

const selectYear = (year: number) => {
  setCursor(setCalendarMonthYear(position.value, year, bounds.value))
  setCalendarView(DATE_PICKER_VIEW.DAYS)
}

const selectDay = (day: CalendarDay) => {
  const value = props.type === 'range'
    ? toRangeValue(getNextCalendarDayRange(selectedRange.value, day))
    : day.date

  emit('change', value)
  emit('update:value', value)
}

const suppressNextClick = () => {
  suppressClick.value = true

  if (suppressClickTimer !== null) {
    window.clearTimeout(suppressClickTimer)
  }

  suppressClickTimer = window.setTimeout(() => {
    suppressClickTimer = null
    suppressClick.value = false
  }, SLIDE_DURATION_MS)
}

const onPointerDown = (event: PointerEvent) => {
  const interactiveTarget = isInteractiveSwipeTarget(event.target)

  if (
    props.disabled
    || monthPickerVisible.value
    || yearPickerVisible.value
    || slideAnimating.value
    || event.button !== 0
    || (interactiveTarget && !isCalendarDaySwipeTarget(event.target))
  ) {
    return
  }

  swipe.value = {
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
  const activeSwipe = swipe.value

  if (activeSwipe === null || activeSwipe.pointerId !== event.pointerId) {
    return
  }

  swipe.value = null

  const deltaX = event.clientX - activeSwipe.x
  const deltaY = event.clientY - activeSwipe.y

  if (!activeSwipe.active) {
    swipe.value = null
    return
  }

  if (Math.abs(deltaX) >= SWIPE_THRESHOLD && Math.abs(deltaX) > Math.abs(deltaY)) {
    const offset = deltaX < 0 ? 1 : -1
    const available = offset > 0 ? nextMonthAvailable.value : previousMonthAvailable.value

    if (available) {
      animateMonthShift(offset)
    } else {
      dragOffset.value = 0
    }

    return
  }

  slideAnimating.value = true
  dragOffset.value = 0
  window.setTimeout(() => {
    slideAnimating.value = false
  }, SLIDE_DURATION_MS)
}

const onPointerMove = (event: PointerEvent) => {
  const activeSwipe = swipe.value

  if (activeSwipe === null || activeSwipe.pointerId !== event.pointerId) {
    return
  }

  const deltaX = event.clientX - activeSwipe.x
  const deltaY = event.clientY - activeSwipe.y

  if (Math.abs(deltaX) <= Math.abs(deltaY)) {
    return
  }

  if (!activeSwipe.active) {
    if (Math.abs(deltaX) < SWIPE_ACTIVATION_THRESHOLD) {
      return
    }

    activeSwipe.active = true
    suppressNextClick()

    const currentTarget = event.currentTarget

    if (currentTarget instanceof HTMLElement) {
      currentTarget.setPointerCapture?.(event.pointerId)
    }
  }

  const canDrag = deltaX < 0 ? nextMonthAvailable.value : previousMonthAvailable.value
  const width = calendar.value?.getBoundingClientRect().width || SLIDE_FALLBACK_WIDTH

  dragOffset.value = canDrag ? Math.max(-width, Math.min(width, deltaX)) : 0
}

const onPointerCancel = () => {
  swipe.value = null
  slideAnimating.value = true
  dragOffset.value = 0
  window.setTimeout(() => {
    slideAnimating.value = false
  }, SLIDE_DURATION_MS)
}

const onClickCapture = (event: MouseEvent) => {
  if (!suppressClick.value) {
    return
  }

  suppressClick.value = false

  if (suppressClickTimer !== null) {
    window.clearTimeout(suppressClickTimer)
    suppressClickTimer = null
  }

  event.preventDefault()
  event.stopPropagation()
}
</script>
