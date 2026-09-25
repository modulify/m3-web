import type {
  CalendarAvailability,
  CalendarDateRange,
  CalendarDayRange,
  CalendarYearRange,
} from '@modulify/m3-foundation/lib/calendar'
import type { ComponentSetupContext } from '@/utils/component'
import type { CSSProperties } from 'react'
import type { ElementReference } from '@modulify/m3-foundation/types/dom'
import type {
  HTMLAttributes,
  MouseEvent,
  PointerEvent,
  ReactNode,
  Ref,
} from 'react'

import {
  CalendarDay,
  clampCalendarMonth,
  createDayFormatter,
  getCalendarBounds,
  getCalendarMonthWeeks,
  getCalendarYears,
  getNextCalendarDayRange,
  isNextCalendarMonthAvailable as isNextMonthAvailable,
  isNextCalendarYearAvailable,
  isPreviousCalendarMonthAvailable as isPrevMonthAvailable,
  isPreviousCalendarYearAvailable,
  setCalendarMonthYear,
  shiftCalendarMonth,
  shiftCalendarYear,
  toCalendarDateRange,
  toCalendarDayRange,
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

import defineComponent from '@/utils/component'
import { defineSlot, distinct } from '@/utils/content'
import { toClassName } from '@/utils/styling'
import { useElementReference, useTimeout } from '@/hooks'

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

const Footer = defineSlot('M3DatePicker.Footer')

interface M3DatePickerBaseProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  ref?: Ref<M3DatePickerExposed>;
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
  value?: CalendarDateRange | null;
  type: 'range';
  onChange?: (value: CalendarDateRange) => void;
}

export type M3DatePickerProps = M3DatePickerSingleProps | M3DatePickerRangeProps

export interface M3DatePickerExposed extends ElementReference<HTMLElement> {}

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

const isInteractiveSwipeTarget = (target: EventTarget | null): boolean => (
  target instanceof Element
  && target.closest('button, a, input, textarea, select, [role="button"]') !== null
)

const isCalendarDaySwipeTarget = (target: EventTarget | null): boolean => (
  target instanceof Element
  && target.closest('.m3-date-picker-option') !== null
)

export default defineComponent(function M3DatePicker({
  ref: _ref,
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
}: M3DatePickerProps, { expose }: ComponentSetupContext<M3DatePickerExposed>) {
  const root = useRef<HTMLElement | null>(null)
  const calendar = useRef<HTMLDivElement | null>(null)
  const yearPickerId = useId()
  expose(useElementReference(root))

  const [slots] = useMemo(() => distinct(children, {
    footer: Footer,
  }), [children])

  const today = useMemo(() => new CalendarDay(), [])
  const formatDay = useMemo(() => createDayFormatter(locale), [locale])

  const selectedDay = useMemo(() => type !== 'range' && value instanceof Date ? new CalendarDay(value) : null, [type, value])
  const selectedRange = useMemo(() => type === 'range' ? toCalendarDayRange(value) : [null, null] as CalendarDayRange, [type, value])

  const bounds = useMemo(
    () => getCalendarBounds(
      yearRange,
      min ? new CalendarDay(min) : null,
      max ? new CalendarDay(max) : null
    ),
    [yearRange?.[0], yearRange?.[1], min?.getTime(), max?.getTime()]
  )

  const [uncontrolledCursor, setUncontrolledCursor] = useState(
    () => selectedDay ?? selectedRange[0] ?? selectedRange[1] ?? today
  )
  const isCursorControlled = cursorProp !== undefined
  const displayedMonth = useMemo(
    () => clampCalendarMonth(
      cursorProp instanceof Date ? new CalendarDay(cursorProp) : uncontrolledCursor,
      bounds
    ),
    [cursorProp?.getTime(), uncontrolledCursor.timestamp, bounds[0]?.timestamp, bounds[1]?.timestamp]
  )

  const canMoveToPreviousMonthFrom = (month: CalendarDay) => isPrevMonthAvailable(month, bounds)
  const canMoveToNextMonthFrom = (month: CalendarDay) => isNextMonthAvailable(month, bounds)

  const canMoveToPreviousMonth = canMoveToPreviousMonthFrom(displayedMonth)
  const canMoveToNextMonth = canMoveToNextMonthFrom(displayedMonth)
  const canMoveToPreviousYear = isPreviousCalendarYearAvailable(displayedMonth, bounds)
  const canMoveToNextYear = isNextCalendarYearAvailable(displayedMonth, bounds)

  const [activeView, setActiveView] = useState<M3DatePickerView>(DATE_PICKER_VIEW.DAYS)
  const isMonthView = activeView === DATE_PICKER_VIEW.MONTHS
  const isYearView = activeView === DATE_PICKER_VIEW.YEARS
  const hasMonthView = views.includes(DATE_PICKER_VIEW.MONTHS)
  const hasYearView = views.includes(DATE_PICKER_VIEW.YEARS)
  const isPickerView = isMonthView || isYearView
  const isDockedPickerView = layout === 'docked' && isPickerView
  const [viewTransitioning, setViewTransitioning] = useState(false)
  const viewTransitionEnd = useTimeout(
    () => setViewTransitioning(false),
    VIEW_TRANSITION.duration
  )
  const inlineViewSwitchTimeout = useTimeout(
    (view: M3DatePickerView) => switchView(view),
    VIEW_TRANSITION.inlineDelay
  )

  const monthSwipe = useRef<MonthSwipeState | null>(null)
  const [monthDragOffset, setMonthDragOffset] = useState(0)
  const [monthSliding, setMonthSliding] = useState(false)
  const monthSlideEnd = useTimeout((offset: number) => {
    setMonthSliding(false)
    setMonthDragOffset(0)
    moveCursorByMonth(offset)
  }, MONTH_SWIPE.transitionDuration)
  const monthSlideReset = useTimeout(
    () => setMonthSliding(false),
    MONTH_SWIPE.transitionDuration
  )

  const clickSuppressed = useRef(false)
  const clickSuppressionEnd = useTimeout(
    () => clickSuppressed.current = false,
    MONTH_SWIPE.transitionDuration
  )

  const getMonthPages = (): MonthPage[] => {
    return [
      {
        month: canMoveToPreviousMonth
          ? shiftCalendarMonth(displayedMonth, -1, bounds)
          : displayedMonth,
        active: false,
        key: 'previous',
      },
      {
        month: displayedMonth,
        active: true,
        key: 'current',
      },
      {
        month: canMoveToNextMonth
          ? shiftCalendarMonth(displayedMonth, 1, bounds)
          : displayedMonth,
        active: false,
        key: 'next',
      },
    ]
  }

  const updateCursor = (month: CalendarDay) => {
    const nextMonth = clampCalendarMonth(month, bounds)

    if (!isCursorControlled) {
      setUncontrolledCursor(nextMonth)
    }

    onCursorChange(nextMonth.date)
  }

  const moveCursorByMonth = (offset: number) => {
    updateCursor(shiftCalendarMonth(displayedMonth, offset, bounds))
  }

  const moveCursorByYear = (offset: number) => {
    updateCursor(shiftCalendarYear(displayedMonth, offset, bounds))
  }

  const switchView = (view: M3DatePickerView) => {
    if (view === activeView) {
      return
    }

    setActiveView(view)
    setViewTransitioning(true)
    viewTransitionEnd.schedule()
  }

  const scheduleInlineViewSwitch = (view: M3DatePickerView) => {
    inlineViewSwitchTimeout.schedule(view)
  }

  const startMonthSlide = (offset: number) => {
    if (monthSliding) return

    const canMove = offset > 0 ? canMoveToNextMonth : canMoveToPreviousMonth
    const width = calendar.current?.getBoundingClientRect().width || MONTH_SWIPE.fallbackWidth

    if (!canMove) {
      setMonthDragOffset(0)
      return
    }

    setMonthDragOffset(offset > 0 ? -width : width)
    setMonthSliding(true)
    monthSlideEnd.schedule(offset)
  }

  const selectMonth = (month: number) => {
    updateCursor(new CalendarDay(displayedMonth.year, month, 1))
    switchView(DATE_PICKER_VIEW.DAYS)
  }

  const selectYear = (year: number) => {
    updateCursor(setCalendarMonthYear(displayedMonth, year, bounds))
    switchView(DATE_PICKER_VIEW.DAYS)
  }

  const selectDay = (day: CalendarDay) => {
    if (type === 'range') {
      (onChange as M3DatePickerRangeProps['onChange'] | undefined)?.(
        toCalendarDateRange(getNextCalendarDayRange(selectedRange, day))
      )

      return
    }

    (onChange as M3DatePickerSingleProps['onChange'] | undefined)?.(day.date)
  }

  const suppressClickAfterSwipe = () => {
    clickSuppressed.current = true

    clickSuppressionEnd.schedule()
  }

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const interactiveTarget = isInteractiveSwipeTarget(event.target)

    if (
      disabled
      || isMonthView
      || isYearView
      || monthSliding
      || event.button !== 0
      || (interactiveTarget && !isCalendarDaySwipeTarget(event.target))
    ) {
      return
    }

    monthSwipe.current = {
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
    const activeSwipe = monthSwipe.current
    if (activeSwipe === null || activeSwipe.pointerId !== event.pointerId) return

    monthSwipe.current = null

    const deltaX = event.clientX - activeSwipe.x
    const deltaY = event.clientY - activeSwipe.y

    if (!activeSwipe.active) {
      monthSwipe.current = null
      return
    }

    if (Math.abs(deltaX) >= MONTH_SWIPE.navigationThreshold && Math.abs(deltaX) > Math.abs(deltaY)) {
      const offset = deltaX < 0 ? 1 : -1
      const canMove = offset > 0 ? canMoveToNextMonth : canMoveToPreviousMonth

      if (canMove) {
        startMonthSlide(offset)
      } else {
        setMonthDragOffset(0)
      }

      return
    }

    setMonthSliding(true)
    setMonthDragOffset(0)
    monthSlideReset.schedule()
  }

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const activeSwipe = monthSwipe.current
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
      event.currentTarget.setPointerCapture?.(event.pointerId)
    }

    const canMove = deltaX < 0 ? canMoveToNextMonth : canMoveToPreviousMonth
    const width = calendar.current?.getBoundingClientRect().width || MONTH_SWIPE.fallbackWidth

    setMonthDragOffset(canMove ? Math.max(-width, Math.min(width, deltaX)) : 0)
  }

  const onPointerCancel = () => {
    monthSwipe.current = null
    setMonthDragOffset(0)
    setMonthSliding(true)
    monthSlideReset.schedule()
  }

  const onClickCapture = (event: MouseEvent<HTMLDivElement>) => {
    if (clickSuppressed.current) {
      clickSuppressed.current = false
      clickSuppressionEnd.cancel()
      event.preventDefault()
      event.stopPropagation()
    }
  }

  useEffect(() => {
    if (isCursorControlled) return

    const selected = selectedDay ?? selectedRange[0] ?? selectedRange[1]
    if (selected !== null) {
      setUncontrolledCursor(clampCalendarMonth(selected, bounds))
    }
  }, [
    isCursorControlled,
    selectedDay?.timestamp,
    selectedRange[0]?.timestamp,
    selectedRange[1]?.timestamp,
    bounds[0]?.timestamp,
    bounds[1]?.timestamp,
  ])

  useEffect(() => {
    if (!isCursorControlled) {
      setUncontrolledCursor(month => clampCalendarMonth(month, bounds))
    }
  }, [isCursorControlled, bounds[0]?.timestamp, bounds[1]?.timestamp])

  useEffect(() => {
    monthSlideEnd.cancel()
    setMonthSliding(false)
    setMonthDragOffset(0)
  }, [displayedMonth.timestamp, bounds[0]?.timestamp, bounds[1]?.timestamp])

  return (
    <section
      ref={root}
      className={toClassName(['m3-date-picker', className, {
        'm3-date-picker_docked': layout === 'docked',
        'm3-date-picker_navigation-inline': navigation === 'inline',
        [`m3-date-picker_weeks-${getCalendarMonthWeeks(displayedMonth, firstDayOfWeek).filter(
          week => week.some(day => day.inSameMonth(displayedMonth))
        ).length}`]: layout === 'docked',
      }])}
      role="group"
      aria-label={label}
      {...attrs}
    >
      {layout === 'modal' && (
        <header className="m3-date-picker__header">
          <div>
            <div className="m3-date-picker__label">{label}</div>
            <div className="m3-date-picker__headline">
              {type === 'range'
                ? [
                  selectedRange[0] ? formatDay(selectedRange[0], 'd MMM yyyy') : 'Start date',
                  selectedRange[1] ? formatDay(selectedRange[1], 'd MMM yyyy') : 'End date',
                ].join(' - ')
                : selectedDay
                  ? formatDay(selectedDay, 'd MMM yyyy')
                  : 'No date selected'}
            </div>
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
            'm3-date-picker__month-navigation_picker': isPickerView,
          })}
        >
          <div className="m3-date-picker__navigation-group">
            <M3IconButton
              className={toClassName({
                'm3-date-picker__navigation-control_hidden': isPickerView,
              })}
              aria-label={isPickerView ? undefined : 'Previous month'}
              aria-hidden={isPickerView}
              tabIndex={isPickerView ? -1 : undefined}
              disabled={disabled || isPickerView || !canMoveToPreviousMonth}
              onClick={() => startMonthSlide(-1)}
            >
              <M3Icon name="chevron_left" />
            </M3IconButton>

            {hasMonthView ? (
              <M3Button
                appearance="text"
                className="m3-date-picker__month-button"
                aria-label={isMonthView ? 'Switch to day selection' : 'Switch to month selection'}
                aria-expanded={isMonthView}
                disabled={disabled || isYearView}
                onClick={() => switchView(isMonthView ? DATE_PICKER_VIEW.DAYS : DATE_PICKER_VIEW.MONTHS)}
              >
                {formatDay(displayedMonth, 'MMM')}
                <M3Icon
                  name="arrow_drop_down"
                  className={toClassName({
                    'm3-date-picker__year-button-icon': true,
                    'm3-date-picker__year-button-icon_expanded': isMonthView,
                  })}
                />
              </M3Button>
            ) : (
              <div
                className={toClassName({
                  'm3-date-picker__navigation-label': true,
                  'm3-date-picker__navigation-label_disabled': isYearView,
                })}
                aria-live="polite"
              >
                {formatDay(displayedMonth, 'MMM')}
              </div>
            )}

            <M3IconButton
              className={toClassName({
                'm3-date-picker__navigation-control_hidden': isPickerView,
              })}
              aria-label={isPickerView ? undefined : 'Next month'}
              aria-hidden={isPickerView}
              tabIndex={isPickerView ? -1 : undefined}
              disabled={disabled || isPickerView || !canMoveToNextMonth}
              onClick={() => startMonthSlide(1)}
            >
              <M3Icon name="chevron_right" />
            </M3IconButton>
          </div>

          <div className="m3-date-picker__navigation-group">
            <M3IconButton
              className={toClassName({
                'm3-date-picker__navigation-control_hidden': isDockedPickerView,
              })}
              aria-label={isDockedPickerView ? undefined : 'Previous year'}
              aria-hidden={isDockedPickerView || undefined}
              tabIndex={isDockedPickerView ? -1 : undefined}
              disabled={disabled || isDockedPickerView || !canMoveToPreviousYear}
              onClick={() => moveCursorByYear(-1)}
            >
              <M3Icon name="chevron_left" />
            </M3IconButton>

            {hasYearView ? (
              <M3Button
                appearance="text"
                className="m3-date-picker__year-button"
                aria-label={isYearView ? 'Switch to day selection' : 'Switch to year selection'}
                aria-expanded={isYearView}
                aria-controls={yearPickerId}
                disabled={disabled || (layout === 'docked' && isMonthView)}
                onClick={() => switchView(isYearView ? DATE_PICKER_VIEW.DAYS : DATE_PICKER_VIEW.YEARS)}
              >
                {formatDay(displayedMonth, 'yyyy')}
                <M3Icon
                  name="arrow_drop_down"
                  className={toClassName({
                    'm3-date-picker__year-button-icon': true,
                    'm3-date-picker__year-button-icon_expanded': isYearView,
                  })}
                />
              </M3Button>
            ) : (
              <div className="m3-date-picker__navigation-label" aria-live="polite">
                {formatDay(displayedMonth, 'yyyy')}
              </div>
            )}

            <M3IconButton
              className={toClassName({
                'm3-date-picker__navigation-control_hidden': isDockedPickerView,
              })}
              aria-label={isDockedPickerView ? undefined : 'Next year'}
              aria-hidden={isDockedPickerView || undefined}
              tabIndex={isDockedPickerView ? -1 : undefined}
              disabled={disabled || isDockedPickerView || !canMoveToNextYear}
              onClick={() => moveCursorByYear(1)}
            >
              <M3Icon name="chevron_right" />
            </M3IconButton>
          </div>
        </div>
      )}

      {isMonthView ? (
        <M3MonthPicker
          value={displayedMonth}
          current={today}
          bounds={bounds}
          disabled={disabled}
          locale={locale}
          label="Select month"
          appearance={layout === 'docked' ? 'list' : 'grid'}
          animating={viewTransitioning}
          onSelect={selectMonth}
        />
      ) : isYearView ? (
        <>
          {navigation === 'inline' && (
            <div className="m3-date-picker__inline-navigation m3-date-picker__inline-navigation_year-picker">
              <M3Button
                appearance="text"
                className="m3-date-picker__inline-month-button"
                aria-label="Switch to day selection"
                aria-expanded={isYearView}
                aria-controls={yearPickerId}
                onClick={() => scheduleInlineViewSwitch(DATE_PICKER_VIEW.DAYS)}
              >
                {formatDay(displayedMonth, 'MMMM yyyy')}
                <M3Icon
                  name="arrow_drop_down"
                  className="m3-date-picker__year-button-icon m3-date-picker__year-button-icon_expanded"
                />
              </M3Button>
            </div>
          )}

          <M3YearPicker
            id={yearPickerId}
            years={getCalendarYears(bounds)}
            value={displayedMonth.year}
            current={today.year}
            bounds={bounds}
            availability={availability}
            disabled={disabled}
            appearance={navigation === 'inline' ? 'grid' : 'list'}
            animating={viewTransitioning}
            onSelect={selectYear}
          />
        </>
      ) : (
        <div
          ref={calendar}
          className={toClassName({
            'm3-date-picker__calendar': true,
            'm3-date-picker__calendar_swipeable': true,
            'm3-date-picker__mode-enter': viewTransitioning && navigation !== 'inline',
          })}
          style={{ '--m3-date-picker-slide-offset': `${monthDragOffset}px` } as CSSProperties}
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
                'm3-date-picker__month-track_animating': monthSliding,
              })}
            >
              {getMonthPages().map(page => (
                <div
                  key={`${page.key}-${page.month.timestamp}`}
                  className="m3-date-picker__month-page"
                  aria-hidden={!page.active}
                >
                  {navigation === 'inline' && (
                    <div className="m3-date-picker__inline-navigation">
                      {hasYearView ? (
                        <M3Button
                          appearance="text"
                          className="m3-date-picker__inline-month-button"
                          aria-label={page.active ? 'Switch to year selection' : undefined}
                          aria-expanded={page.active ? isYearView : undefined}
                          aria-controls={page.active ? yearPickerId : undefined}
                          tabIndex={page.active ? undefined : -1}
                          onClick={page.active
                            ? () => scheduleInlineViewSwitch(isYearView ? DATE_PICKER_VIEW.DAYS : DATE_PICKER_VIEW.YEARS)
                            : undefined}
                        >
                          {formatDay(page.month, 'MMMM yyyy')}
                          <M3Icon name="arrow_drop_down" />
                        </M3Button>
                      ) : (
                        <div className="m3-date-picker__inline-month-label">
                          {formatDay(page.month, 'MMMM yyyy')}
                        </div>
                      )}

                      <div className="m3-date-picker__inline-arrows">
                        <M3IconButton
                          aria-label={page.active ? 'Previous month' : undefined}
                          disabled={disabled || !canMoveToPreviousMonthFrom(page.month)}
                          tabIndex={page.active ? undefined : -1}
                          onClick={page.active ? () => startMonthSlide(-1) : undefined}
                        >
                          <M3Icon name="chevron_left" />
                        </M3IconButton>

                        <M3IconButton
                          aria-label={page.active ? 'Next month' : undefined}
                          disabled={disabled || !canMoveToNextMonthFrom(page.month)}
                          tabIndex={page.active ? undefined : -1}
                          onClick={page.active ? () => startMonthSlide(1) : undefined}
                        >
                          <M3Icon name="chevron_right" />
                        </M3IconButton>
                      </div>
                    </div>
                  )}

                  <M3DayPicker
                    className={toClassName({
                      'm3-date-picker__mode-enter': viewTransitioning && navigation === 'inline',
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
                    label={formatDay(displayedMonth, 'MMMM yyyy')}
                    onSelect={selectDay}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {layout === 'docked' && !isPickerView && slots.footer ? (
        <footer className="m3-date-picker__footer">
          {slots.footer}
        </footer>
      ) : null}
    </section>
  )
}, {
  slots: { Footer },
})
