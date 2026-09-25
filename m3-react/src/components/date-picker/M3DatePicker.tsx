import type {
  CalendarAvailability,
  CalendarDayRange,
  CalendarYearRange,
} from '@modulify/m3-foundation/lib/calendar'
import type {
  CSSProperties,
  FC,
  HTMLAttributes,
  MouseEvent,
  PointerEvent,
  ReactNode,
} from 'react'

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
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'

import { M3Button } from '@/components/button'
import { M3Icon } from '@/components/icon'
import { M3IconButton } from '@/components/icon-button'

import { defineSlot, distinct } from '@/utils/content'
import { toClassName } from '@/utils/styling'

import M3DayPicker from './M3DayPicker'
import M3MonthPicker from './M3MonthPicker'
import M3YearPicker from './M3YearPicker'

export type M3DatePickerType = 'single' | 'range'
export type M3DatePickerNavigation = 'split' | 'inline' | 'none'
export type M3DatePickerLayout = 'modal' | 'docked'

const DATE_PICKER_VIEW = {
  DAYS: 'days',
  MONTHS: 'months',
  YEARS: 'years',
} as const

export type M3DatePickerView = typeof DATE_PICKER_VIEW[keyof typeof DATE_PICKER_VIEW]

const DEFAULT_DATE_PICKER_VIEWS: M3DatePickerView[] = Object.values(DATE_PICKER_VIEW)

const Footer: FC<{ children: ReactNode }> = defineSlot('M3DatePicker.Footer', props => <>{props.children}</>)

interface M3DatePickerBaseProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  cursor?: Date | null;
  min?: Date | null;
  max?: Date | null;
  yearRange?: CalendarYearRange;
  availability?: CalendarAvailability | null;

  layout?: M3DatePickerLayout;
  navigation?: M3DatePickerNavigation;
  views?: M3DatePickerView[];

  locale?: string;
  firstDayOfWeek?: number;

  label?: string;
  headerAction?: ReactNode;

  disabled?: boolean;
  onCursorChange?: (value: Date) => void;
}

export interface M3DatePickerSingleProps extends M3DatePickerBaseProps {
  value?: Date | null;
  type?: 'single';
  onChange?: (value: Date) => void;
}

export interface M3DatePickerRangeProps extends M3DatePickerBaseProps {
  value?: [Date | null, Date | null] | null;
  type: 'range';
  onChange?: (value: [Date | null, Date | null]) => void;
}

export type M3DatePickerProps = M3DatePickerSingleProps | M3DatePickerRangeProps

const SWIPE_ACTIVATION_THRESHOLD = 8
const SWIPE_THRESHOLD = 48
const SLIDE_DURATION_MS = 200
const MODE_TRANSITION_DURATION_MS = 180
const INLINE_MODE_SWITCH_RIPPLE_DELAY_MS = 120
const SLIDE_FALLBACK_WIDTH = 360

const monthYearFormatter = (locale: string): Intl.DateTimeFormat => new Intl.DateTimeFormat(locale, {
  month: 'long',
  year: 'numeric',
})

const monthFormatter = (locale: string): Intl.DateTimeFormat => new Intl.DateTimeFormat(locale, {
  month: 'short',
})

const yearFormatter = (locale: string): Intl.DateTimeFormat => new Intl.DateTimeFormat(locale, {
  year: 'numeric',
})

const selectedDateFormatter = (locale: string): Intl.DateTimeFormat => new Intl.DateTimeFormat(locale, {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

const isDateRangeValue = (value: unknown): value is [Date | null, Date | null] => Array.isArray(value)

const toSelectedRange = (value: unknown): CalendarDayRange => {
  if (!isDateRangeValue(value)) {
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

const isInteractiveSwipeTarget = (target: EventTarget | null): boolean => (
  target instanceof Element
  && target.closest('button, a, input, textarea, select, [role="button"]') !== null
)

const isCalendarDaySwipeTarget = (target: EventTarget | null): boolean => (
  target instanceof Element
  && target.closest('.m3-date-picker-option') !== null
)

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

const M3DatePicker: FC<M3DatePickerProps> = ({
  value = null,
  type = 'single',

  cursor: cursorProp,
  min = null,
  max = null,
  yearRange,
  availability = null,

  layout = 'modal',
  navigation = 'split',
  views = DEFAULT_DATE_PICKER_VIEWS,

  locale = 'en-US',
  firstDayOfWeek = 0,

  label = 'Select date',
  headerAction = null,
  children = [],

  disabled = false,
  className = '',
  onChange,
  onCursorChange = () => {},
  ...attrs
}) => {
  const [slots] = useMemo(() => distinct(children, {
    footer: Footer,
  }), [children])
  const selectedDay = useMemo(() => type !== 'range' && value instanceof Date ? new CalendarDay(value) : null, [type, value])
  const selectedRange = useMemo(() => type === 'range' ? toSelectedRange(value) : [null, null] as CalendarDayRange, [type, value])
  const today = useMemo(() => new CalendarDay(), [])
  const [cursorInternal, setCursorInternal] = useState(() => selectedDay ?? today)
  const minDay = useMemo(() => min ? new CalendarDay(min) : null, [min])
  const maxDay = useMemo(() => max ? new CalendarDay(max) : null, [max])
  const bounds = useMemo(
    () => getCalendarBounds(yearRange, minDay, maxDay),
    [yearRange?.[0], yearRange?.[1], minDay?.timestamp, maxDay?.timestamp]
  )
  const cursorControlled = cursorProp !== undefined
  const cursorSource = useMemo(
    () => cursorProp instanceof Date ? new CalendarDay(cursorProp) : cursorInternal,
    [cursorProp, cursorInternal.timestamp]
  )
  const cursor = useMemo(
    () => clampCalendarMonth(cursorSource, bounds),
    [cursorSource.timestamp, bounds[0]?.timestamp, bounds[1]?.timestamp]
  )
  const years = useMemo(
    () => getCalendarYears(bounds),
    [bounds[0]?.timestamp, bounds[1]?.timestamp]
  )
  const previousMonthAvailable = isPreviousCalendarMonthAvailable(cursor, bounds)
  const nextMonthAvailable = isNextCalendarMonthAvailable(cursor, bounds)
  const previousYearAvailable = isPreviousCalendarYearAvailable(cursor, bounds)
  const nextYearAvailable = isNextCalendarYearAvailable(cursor, bounds)
  const monthPages: CalendarMonthPage[] = useMemo(() => [
    {
      month: previousMonthAvailable
        ? shiftCalendarMonth(cursor, -1, bounds)
        : cursor,
      active: false,
      key: 'previous',
    },
    {
      month: cursor,
      active: true,
      key: 'current',
    },
    {
      month: nextMonthAvailable
        ? shiftCalendarMonth(cursor, 1, bounds)
        : cursor,
      active: false,
      key: 'next',
    },
  ], [
    cursor.timestamp,
    bounds[0]?.timestamp,
    bounds[1]?.timestamp,
    nextMonthAvailable,
    previousMonthAvailable,
  ])
  const [calendarView, setCalendarViewState] = useState<M3DatePickerView>(DATE_PICKER_VIEW.DAYS)
  const [modeAnimating, setModeAnimating] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)
  const [slideAnimating, setSlideAnimating] = useState(false)
  const yearPickerId = useId()
  const calendar = useRef<HTMLDivElement | null>(null)
  const swipe = useRef<SwipeState | null>(null)
  const suppressClick = useRef(false)
  const suppressClickTimer = useRef<number | null>(null)
  const slideTimer = useRef<number | null>(null)
  const modeTimer = useRef<number | null>(null)
  const inlineModeSwitchTimer = useRef<number | null>(null)
  const formatMonthYear = monthYearFormatter(locale)
  const formatSelectedDate = selectedDateFormatter(locale)
  const calendarLabel = formatMonthYear.format(cursor.date)
  const monthLabel = monthFormatter(locale).format(cursor.date)
  const yearLabel = yearFormatter(locale).format(cursor.date)
  const monthPickerVisible = calendarView === DATE_PICKER_VIEW.MONTHS
  const yearPickerVisible = calendarView === DATE_PICKER_VIEW.YEARS
  const monthPickerAvailable = views.includes(DATE_PICKER_VIEW.MONTHS)
  const yearPickerAvailable = views.includes(DATE_PICKER_VIEW.YEARS)
  const pickerMenuVisible = monthPickerVisible || yearPickerVisible
  const dockedPickerMenuVisible = layout === 'docked' && pickerMenuVisible
  const visibleWeeks = getCalendarMonthWeeks(cursor, firstDayOfWeek).filter(
    week => week.some(day => day.inSameMonth(cursor))
  ).length
  const selectedLabel = type === 'range'
    ? [
      selectedRange[0] ? formatSelectedDate.format(selectedRange[0].date) : 'Start date',
      selectedRange[1] ? formatSelectedDate.format(selectedRange[1].date) : 'End date',
    ].join(' - ')
    : selectedDay
      ? formatSelectedDate.format(selectedDay.date)
      : 'No date selected'

  const setCursor = (month: CalendarDay) => {
    const nextMonth = clampCalendarMonth(month, bounds)

    if (!cursorControlled) {
      setCursorInternal(nextMonth)
    }

    onCursorChange(nextMonth.date)
  }

  useEffect(() => {
    if (cursorControlled) {
      return
    }

    const selected = selectedDay ?? selectedRange[0] ?? selectedRange[1]

    if (selected !== null) {
      setCursorInternal(clampCalendarMonth(selected, bounds))
    }
  }, [
    cursorControlled,
    selectedDay?.timestamp,
    selectedRange[0]?.timestamp,
    selectedRange[1]?.timestamp,
    bounds[0]?.timestamp,
    bounds[1]?.timestamp,
  ])

  useEffect(() => {
    if (!cursorControlled) {
      setCursorInternal(month => clampCalendarMonth(month, bounds))
    }
  }, [cursorControlled, bounds[0]?.timestamp, bounds[1]?.timestamp])

  useEffect(() => {
    if (slideTimer.current === null) {
      return
    }

    window.clearTimeout(slideTimer.current)
    slideTimer.current = null
    setSlideAnimating(false)
    setDragOffset(0)
  }, [cursor.timestamp, bounds[0]?.timestamp, bounds[1]?.timestamp])

  useEffect(() => () => {
    if (slideTimer.current !== null) {
      window.clearTimeout(slideTimer.current)
    }

    if (modeTimer.current !== null) {
      window.clearTimeout(modeTimer.current)
    }

    if (suppressClickTimer.current !== null) {
      window.clearTimeout(suppressClickTimer.current)
    }

    if (inlineModeSwitchTimer.current !== null) {
      window.clearTimeout(inlineModeSwitchTimer.current)
    }
  }, [])

  const shiftMonth = (offset: number) => {
    setCursor(shiftCalendarMonth(cursor, offset, bounds))
  }

  const shiftYear = (offset: number) => {
    setCursor(shiftCalendarYear(cursor, offset, bounds))
  }

  const setCalendarView = (view: M3DatePickerView) => {
    if (view === calendarView) {
      return
    }

    if (modeTimer.current !== null) {
      window.clearTimeout(modeTimer.current)
    }

    setModeAnimating(true)
    setCalendarViewState(view)

    modeTimer.current = window.setTimeout(() => {
      modeTimer.current = null
      setModeAnimating(false)
    }, MODE_TRANSITION_DURATION_MS)
  }

  const setInlineCalendarView = (view: M3DatePickerView) => {
    if (inlineModeSwitchTimer.current !== null) {
      window.clearTimeout(inlineModeSwitchTimer.current)
    }

    inlineModeSwitchTimer.current = window.setTimeout(() => {
      inlineModeSwitchTimer.current = null
      setCalendarView(view)
    }, INLINE_MODE_SWITCH_RIPPLE_DELAY_MS)
  }

  const animateMonthShift = (offset: number) => {
    if (slideAnimating) {
      return
    }

    const available = offset > 0 ? nextMonthAvailable : previousMonthAvailable
    const width = calendar.current?.getBoundingClientRect().width || SLIDE_FALLBACK_WIDTH

    if (!available) {
      setDragOffset(0)
      return
    }

    setSlideAnimating(true)
    setDragOffset(offset > 0 ? -width : width)

    if (slideTimer.current !== null) {
      window.clearTimeout(slideTimer.current)
    }

    slideTimer.current = window.setTimeout(() => {
      slideTimer.current = null
      setSlideAnimating(false)
      setDragOffset(0)
      shiftMonth(offset)
    }, SLIDE_DURATION_MS)
  }

  const selectMonth = (month: number) => {
    setCursor(new CalendarDay(cursor.year, month, 1))
    setCalendarView(DATE_PICKER_VIEW.DAYS)
  }

  const selectYear = (year: number) => {
    setCursor(setCalendarMonthYear(cursor, year, bounds))
    setCalendarView(DATE_PICKER_VIEW.DAYS)
  }

  const selectDay = (day: CalendarDay) => {
    if (type === 'range') {
      (onChange as M3DatePickerRangeProps['onChange'] | undefined)?.(
        toRangeValue(getNextCalendarDayRange(selectedRange, day))
      )

      return
    }

    (onChange as M3DatePickerSingleProps['onChange'] | undefined)?.(day.date)
  }

  const suppressNextClick = () => {
    suppressClick.current = true

    if (suppressClickTimer.current !== null) {
      window.clearTimeout(suppressClickTimer.current)
    }

    suppressClickTimer.current = window.setTimeout(() => {
      suppressClickTimer.current = null
      suppressClick.current = false
    }, SLIDE_DURATION_MS)
  }

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const interactiveTarget = isInteractiveSwipeTarget(event.target)

    if (
      disabled
      || monthPickerVisible
      || yearPickerVisible
      || slideAnimating
      || event.button !== 0
      || (interactiveTarget && !isCalendarDaySwipeTarget(event.target))
    ) {
      return
    }

    swipe.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      active: !interactiveTarget,
    }

    if (!interactiveTarget) {
      event.currentTarget.setPointerCapture?.(event.pointerId)
    }
  }

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const activeSwipe = swipe.current

    if (activeSwipe === null || activeSwipe.pointerId !== event.pointerId) {
      return
    }

    swipe.current = null

    const deltaX = event.clientX - activeSwipe.x
    const deltaY = event.clientY - activeSwipe.y

    if (!activeSwipe.active) {
      swipe.current = null
      return
    }

    if (Math.abs(deltaX) >= SWIPE_THRESHOLD && Math.abs(deltaX) > Math.abs(deltaY)) {
      const offset = deltaX < 0 ? 1 : -1
      const available = offset > 0 ? nextMonthAvailable : previousMonthAvailable

      if (available) {
        animateMonthShift(offset)
      } else {
        setDragOffset(0)
      }

      return
    }

    setSlideAnimating(true)
    setDragOffset(0)
    window.setTimeout(() => setSlideAnimating(false), SLIDE_DURATION_MS)
  }

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const activeSwipe = swipe.current

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
      event.currentTarget.setPointerCapture?.(event.pointerId)
    }

    const canDrag = deltaX < 0 ? nextMonthAvailable : previousMonthAvailable
    const width = calendar.current?.getBoundingClientRect().width || SLIDE_FALLBACK_WIDTH

    setDragOffset(canDrag ? Math.max(-width, Math.min(width, deltaX)) : 0)
  }

  const onPointerCancel = () => {
    swipe.current = null
    setSlideAnimating(true)
    setDragOffset(0)
    window.setTimeout(() => setSlideAnimating(false), SLIDE_DURATION_MS)
  }

  const onClickCapture = (event: MouseEvent<HTMLDivElement>) => {
    if (!suppressClick.current) {
      return
    }

    suppressClick.current = false

    if (suppressClickTimer.current !== null) {
      window.clearTimeout(suppressClickTimer.current)
      suppressClickTimer.current = null
    }

    event.preventDefault()
    event.stopPropagation()
  }

  return (
    <section
      className={toClassName(['m3-date-picker', className, {
        'm3-date-picker_docked': layout === 'docked',
        'm3-date-picker_navigation-inline': navigation === 'inline',
        [`m3-date-picker_weeks-${visibleWeeks}`]: layout === 'docked',
      }])}
      role="group"
      aria-label={label}
      {...attrs}
    >
      {layout === 'modal' && (
        <header className="m3-date-picker__header">
          <div>
            <div className="m3-date-picker__label">{label}</div>
            <div className="m3-date-picker__headline">{selectedLabel}</div>
          </div>
          {headerAction ? (
            <div className="m3-date-picker__header-action">
              {headerAction}
            </div>
          ) : null}
        </header>
      )}

      {navigation !== 'none' && navigation !== 'inline' && (
        <div
          className={toClassName({
            'm3-date-picker__month-navigation': true,
            'm3-date-picker__month-navigation_picker': monthPickerVisible || yearPickerVisible,
          })}
        >
          <div className="m3-date-picker__navigation-group">
            <M3IconButton
              className={toClassName({
                'm3-date-picker__navigation-control_hidden': monthPickerVisible || yearPickerVisible,
              })}
              aria-label={monthPickerVisible || yearPickerVisible ? undefined : 'Previous month'}
              aria-hidden={monthPickerVisible || yearPickerVisible}
              tabIndex={monthPickerVisible || yearPickerVisible ? -1 : undefined}
              disabled={disabled || monthPickerVisible || yearPickerVisible || !previousMonthAvailable}
              onClick={() => animateMonthShift(-1)}
            >
              <M3Icon name="chevron_left" />
            </M3IconButton>

            {monthPickerAvailable ? (
              <M3Button
                appearance="text"
                className="m3-date-picker__month-button"
                aria-label={monthPickerVisible ? 'Switch to day selection' : 'Switch to month selection'}
                aria-expanded={monthPickerVisible}
                disabled={disabled || yearPickerVisible}
                onClick={() => setCalendarView(monthPickerVisible ? DATE_PICKER_VIEW.DAYS : DATE_PICKER_VIEW.MONTHS)}
              >
                {monthLabel}
                <M3Icon
                  name="arrow_drop_down"
                  className={toClassName({
                    'm3-date-picker__year-button-icon': true,
                    'm3-date-picker__year-button-icon_expanded': monthPickerVisible,
                  })}
                />
              </M3Button>
            ) : (
              <div
                className={toClassName({
                  'm3-date-picker__navigation-label': true,
                  'm3-date-picker__navigation-label_disabled': yearPickerVisible,
                })}
                aria-live="polite"
              >
                {monthLabel}
              </div>
            )}

            <M3IconButton
              className={toClassName({
                'm3-date-picker__navigation-control_hidden': monthPickerVisible || yearPickerVisible,
              })}
              aria-label={monthPickerVisible || yearPickerVisible ? undefined : 'Next month'}
              aria-hidden={monthPickerVisible || yearPickerVisible}
              tabIndex={monthPickerVisible || yearPickerVisible ? -1 : undefined}
              disabled={disabled || monthPickerVisible || yearPickerVisible || !nextMonthAvailable}
              onClick={() => animateMonthShift(1)}
            >
              <M3Icon name="chevron_right" />
            </M3IconButton>
          </div>

          <div className="m3-date-picker__navigation-group">
            <M3IconButton
              className={toClassName({
                'm3-date-picker__navigation-control_hidden': dockedPickerMenuVisible,
              })}
              aria-label={dockedPickerMenuVisible ? undefined : 'Previous year'}
              aria-hidden={dockedPickerMenuVisible || undefined}
              tabIndex={dockedPickerMenuVisible ? -1 : undefined}
              disabled={disabled || dockedPickerMenuVisible || !previousYearAvailable}
              onClick={() => shiftYear(-1)}
            >
              <M3Icon name="chevron_left" />
            </M3IconButton>

            {yearPickerAvailable ? (
              <M3Button
                appearance="text"
                className="m3-date-picker__year-button"
                aria-label={yearPickerVisible ? 'Switch to day selection' : 'Switch to year selection'}
                aria-expanded={yearPickerVisible}
                aria-controls={yearPickerId}
                disabled={disabled || (layout === 'docked' && monthPickerVisible)}
                onClick={() => setCalendarView(yearPickerVisible ? DATE_PICKER_VIEW.DAYS : DATE_PICKER_VIEW.YEARS)}
              >
                {yearLabel}
                <M3Icon
                  name="arrow_drop_down"
                  className={toClassName({
                    'm3-date-picker__year-button-icon': true,
                    'm3-date-picker__year-button-icon_expanded': yearPickerVisible,
                  })}
                />
              </M3Button>
            ) : (
              <div className="m3-date-picker__navigation-label" aria-live="polite">
                {yearLabel}
              </div>
            )}

            <M3IconButton
              className={toClassName({
                'm3-date-picker__navigation-control_hidden': dockedPickerMenuVisible,
              })}
              aria-label={dockedPickerMenuVisible ? undefined : 'Next year'}
              aria-hidden={dockedPickerMenuVisible || undefined}
              tabIndex={dockedPickerMenuVisible ? -1 : undefined}
              disabled={disabled || dockedPickerMenuVisible || !nextYearAvailable}
              onClick={() => shiftYear(1)}
            >
              <M3Icon name="chevron_right" />
            </M3IconButton>
          </div>
        </div>
      )}

      {monthPickerVisible ? (
        <M3MonthPicker
          value={cursor}
          current={today}
          bounds={bounds}
          disabled={disabled}
          locale={locale}
          label="Select month"
          appearance={layout === 'docked' ? 'list' : 'grid'}
          animating={modeAnimating}
          onSelect={selectMonth}
        />
      ) : yearPickerVisible ? (
        <>
          {navigation === 'inline' && (
            <div className="m3-date-picker__inline-navigation m3-date-picker__inline-navigation_year-picker">
              <M3Button
                appearance="text"
                className="m3-date-picker__inline-month-button"
                aria-label="Switch to day selection"
                aria-expanded={yearPickerVisible}
                aria-controls={yearPickerId}
                onClick={() => setInlineCalendarView(DATE_PICKER_VIEW.DAYS)}
              >
                {calendarLabel}
                <M3Icon
                  name="arrow_drop_down"
                  className="m3-date-picker__year-button-icon m3-date-picker__year-button-icon_expanded"
                />
              </M3Button>
            </div>
          )}

          <M3YearPicker
            id={yearPickerId}
            years={years}
            value={cursor.year}
            current={today.year}
            bounds={bounds}
            availability={availability}
            disabled={disabled}
            appearance={navigation === 'inline' ? 'grid' : 'list'}
            animating={modeAnimating}
            onSelect={selectYear}
          />
        </>
      ) : (
        <div
          ref={calendar}
          className={toClassName({
            'm3-date-picker__calendar': true,
            'm3-date-picker__calendar_swipeable': true,
            'm3-date-picker__mode-enter': modeAnimating && navigation !== 'inline',
          })}
          style={{
            '--m3-date-picker-slide-offset': `${dragOffset}px`,
          } as CSSProperties}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerCancel}
          onClickCapture={onClickCapture}
        >
          <div className="m3-date-picker__month-viewport">
            <div
              className={toClassName({
                'm3-date-picker__month-track': true,
                'm3-date-picker__month-track_animating': slideAnimating,
              })}
            >
              {monthPages.map(page => (
                <div
                  key={`${page.key}-${page.month.timestamp}`}
                  className="m3-date-picker__month-page"
                  aria-hidden={!page.active}
                >
                  {navigation === 'inline' && (
                    <div className="m3-date-picker__inline-navigation">
                      {yearPickerAvailable ? (
                        <M3Button
                          appearance="text"
                          className="m3-date-picker__inline-month-button"
                          aria-label={page.active ? 'Switch to year selection' : undefined}
                          aria-expanded={page.active ? yearPickerVisible : undefined}
                          aria-controls={page.active ? yearPickerId : undefined}
                          tabIndex={page.active ? undefined : -1}
                          onClick={page.active
                            ? () => setInlineCalendarView(yearPickerVisible ? DATE_PICKER_VIEW.DAYS : DATE_PICKER_VIEW.YEARS)
                            : undefined}
                        >
                          {formatMonthYear.format(page.month.date)}
                          <M3Icon name="arrow_drop_down" />
                        </M3Button>
                      ) : (
                        <div className="m3-date-picker__inline-month-label">
                          {formatMonthYear.format(page.month.date)}
                        </div>
                      )}

                      <div className="m3-date-picker__inline-arrows">
                        <M3IconButton
                          aria-label={page.active ? 'Previous month' : undefined}
                          disabled={disabled || !isPreviousCalendarMonthAvailable(page.month, bounds)}
                          tabIndex={page.active ? undefined : -1}
                          onClick={page.active ? () => animateMonthShift(-1) : undefined}
                        >
                          <M3Icon name="chevron_left" />
                        </M3IconButton>

                        <M3IconButton
                          aria-label={page.active ? 'Next month' : undefined}
                          disabled={disabled || !isNextCalendarMonthAvailable(page.month, bounds)}
                          tabIndex={page.active ? undefined : -1}
                          onClick={page.active ? () => animateMonthShift(1) : undefined}
                        >
                          <M3Icon name="chevron_right" />
                        </M3IconButton>
                      </div>
                    </div>
                  )}

                  <M3DayPicker
                    className={toClassName({
                      'm3-date-picker__mode-enter': modeAnimating && navigation === 'inline',
                    })}
                    type={type}
                    month={page.month}
                    today={today}
                    value={type === 'range' ? selectedRange : selectedDay}
                    bounds={bounds}
                    availability={availability}
                    active={page.active}
                    disabled={disabled}
                    locale={locale}
                    firstDayOfWeek={firstDayOfWeek}
                    fixed={layout !== 'docked'}
                    label={calendarLabel}
                    onSelect={selectDay}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {layout === 'docked' && !pickerMenuVisible && slots.footer ? (
        <footer className="m3-date-picker__footer">
          {slots.footer}
        </footer>
      ) : null}
    </section>
  )
}

export default Object.assign(M3DatePicker, {
  Footer,
})
