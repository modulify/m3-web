import type {
  CSSProperties,
  FC,
  HTMLAttributes,
  KeyboardEvent as ReactKeyboardEvent,
} from 'react'

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { compose } from '@/utils/events'
import { toClassName } from '@/utils/styling'

type AriaOptions = {
  label?: string;
  labelledBy?: string;
}

type DraggingHandle = 'max' | 'min'

export type M3SliderType = 'single' | 'range'
export type M3SliderValue = number | [number, number] | null

export interface M3SliderProps extends HTMLAttributes<HTMLElement> {
  type?: M3SliderType;
  value?: M3SliderValue;
  max?: number;
  min?: number;
  step?: number;
  disabled?: boolean;
  ariaHandle?: AriaOptions;
  ariaHandleMax?: AriaOptions;
  ariaHandleMin?: AriaOptions;
  onUpdate?: (value: number | [number, number]) => void;
}

const ariaOptionsToAttrs = (options: AriaOptions): {
  'aria-label'?: string;
  'aria-labelledby'?: string;
} => {
  return {
    ...(options.label ? { 'aria-label': options.label } : {}),
    ...(options.labelledBy ? { 'aria-labelledby': options.labelledBy } : {}),
  }
}

const restrict = (value: number, [min, max]: [number, number]): number => {
  return Math.max(Math.min(max, value), min)
}

const distance = (a: number, b: number): number => Math.abs(a - b)
const inRange = (value: number, [min, max]: [number, number]): boolean => min <= value && value <= max
const toGap = ({ left, right }: DOMRect): [number, number] => [left, right]

const withPercentage = (value: number): CSSProperties => {
  return { '--percentage': `${value}%` } as CSSProperties
}

const getEventX = (event: globalThis.MouseEvent | globalThis.TouchEvent): number => {
  return 'clientX' in event ? event.clientX : event.touches[0].clientX
}

const M3Slider: FC<M3SliderProps> = ({
  type = 'single',
  value = null,
  max = 100,
  min = 0,
  step = 0,
  disabled = false,
  ariaHandle = {},
  ariaHandleMax = {},
  ariaHandleMin = {},
  className = '',
  onKeyDown = () => {},
  onKeyUp = () => {},
  onUpdate = (_value) => {},
  ...attrs
}) => {
  const [dragging, setDragging] = useState<{
    max: number | null;
    min: number | null;
  }>({
    max: null,
    min: null,
  })
  const [draggingHandle, setDraggingHandle] = useState<DraggingHandle | null>(null)

  const keys = useRef({
    space: false,
  })

  const track = useRef<HTMLDivElement | null>(null)
  const fillerActive = useRef<HTMLDivElement | null>(null)
  const handleMax = useRef<HTMLDivElement | null>(null)
  const handleMin = useRef<HTMLDivElement | null>(null)
  const notches = useRef<Array<HTMLDivElement | null>>([])
  const draggingResetId = useRef<number | null>(null)

  const safeStep = Math.max(step, 0)

  const current = useMemo<[number, number]>(() => {
    if (Array.isArray(value)) {
      return value
    }

    return value === null ? [min, max] : [value, value]
  }, [
    max,
    min,
    value,
  ])

  const percentageOf = useCallback((value: number): number => {
    const denominator = max - min

    if (denominator === 0) {
      return 0
    }

    return 100 * Math.abs(restrict(value, [min, max]) / denominator)
  }, [
    max,
    min,
  ])

  const percentage = useMemo(() => {
    const [valueMin, valueMax] = current

    return {
      max: dragging.max ?? percentageOf(valueMax),
      min: dragging.min ?? percentageOf(valueMin),
    }
  }, [
    current,
    dragging.max,
    dragging.min,
    percentageOf,
  ])

  const steps = useMemo(() => {
    const steps: number[] = []

    if (safeStep > 0) {
      let next = min + safeStep

      while (next < max) {
        steps.push(next)
        next += safeStep
      }
    }

    return steps
  }, [
    max,
    min,
    safeStep,
  ])

  const nearest = useCallback((value: number) => {
    if (safeStep > 0) {
      let prev = min

      while (prev + safeStep < value) {
        prev += safeStep
      }

      const next = prev + safeStep

      return distance(value, prev) < distance(value, next) ? prev : next
    }

    return value
  }, [
    min,
    safeStep,
  ])

  const getEventShare = useCallback((event: globalThis.MouseEvent | globalThis.TouchEvent): number | null => {
    const _track = track.current

    if (!_track) {
      return null
    }

    const width = _track.offsetWidth
    const { left, right } = _track.getBoundingClientRect()

    return width > 0
      ? (restrict(getEventX(event), [left, right]) - left) / width
      : null
  }, [])

  const getEventValue = useCallback((event: globalThis.MouseEvent | globalThis.TouchEvent): number | null => {
    const share = getEventShare(event)

    if (share === null) {
      return null
    }

    return nearest(min + (max - min) * share)
  }, [
    getEventShare,
    max,
    min,
    nearest,
  ])

  const stepFor = useCallback((leap: boolean): number => {
    const step = distance(min, max) / 100

    return safeStep > 0 ? safeStep : leap ? 10 * step : step
  }, [
    max,
    min,
    safeStep,
  ])

  const nextFor = useCallback((value: number, stepOrLeap: number | boolean = false): number => {
    const step = typeof stepOrLeap === 'boolean' ? stepFor(stepOrLeap) : stepOrLeap
    const next = value + step

    return distance(next, max) < step ? max : next
  }, [
    max,
    stepFor,
  ])

  const rangeBy = useCallback((value: number, step: number): [number, number] => {
    const restricted = restrict(value, [min, max])

    if (step > 0) {
      let prev = min

      while (prev + step < restricted) {
        prev += step
      }

      return [prev, nextFor(prev, step)]
    }

    return [restricted, restricted]
  }, [
    max,
    min,
    nextFor,
  ])

  const resetDragging = useCallback((handle: DraggingHandle) => {
    if (draggingResetId.current !== null) {
      cancelAnimationFrame(draggingResetId.current)
    }

    draggingResetId.current = requestAnimationFrame(() => {
      setDragging(current => ({
        ...current,
        [handle]: null,
      }))
      draggingResetId.current = null
    })
  }, [])

  const setValueMax = useCallback((value: number) => {
    if (type === 'range') {
      const [valueMin] = current

      onUpdate([valueMin, Math.max(valueMin, value)])

      return
    }

    onUpdate(value)
  }, [
    current,
    onUpdate,
    type,
  ])

  const setValueMin = useCallback((value: number) => {
    if (type === 'range') {
      const [, valueMax] = current

      onUpdate([Math.min(value, valueMax), valueMax])
    }
  }, [
    current,
    onUpdate,
    type,
  ])

  const onNotchMaxClick = useCallback(() => {
    if (disabled) {
      return
    }

    if (type === 'single') {
      onUpdate(max)
      return
    }

    onUpdate([current[0], max])
  }, [
    current,
    disabled,
    max,
    onUpdate,
    type,
  ])

  const onNotchMinClick = useCallback(() => {
    if (disabled) {
      return
    }

    if (type === 'single') {
      onUpdate(min)
      return
    }

    onUpdate([min, current[1]])
  }, [
    current,
    disabled,
    min,
    onUpdate,
    type,
  ])

  const onNotchClick = useCallback((value: number, index: number) => {
    if (disabled || notches.current[index]?.classList.contains('m3-slider__notch_hidden')) {
      return
    }

    if (type === 'single') {
      onUpdate(value)
      return
    }

    const [valueMin, valueMax] = current

    onUpdate(distance(value, valueMin) < distance(value, valueMax)
      ? [value, valueMax]
      : [valueMin, value])
  }, [
    current,
    disabled,
    onUpdate,
    type,
  ])

  const onKeyDownForMax = useCallback((event: ReactKeyboardEvent<HTMLElement>) => {
    if (disabled) {
      return
    }

    const [, valueMax] = current
    const [rangeMin, rangeMax] = rangeBy(valueMax, stepFor(keys.current.space))

    switch (event.code) {
      case 'ArrowLeft':
        setValueMax(rangeMin)
        break
      case 'ArrowRight':
        setValueMax(rangeMax === valueMax ? nextFor(rangeMax, keys.current.space) : rangeMax)
        break
      case 'End':
        setValueMax(max)
        break
      case 'Home':
        setValueMax(min)
        break
      default:
        break
    }
  }, [
    current,
    disabled,
    max,
    min,
    nextFor,
    rangeBy,
    setValueMax,
    stepFor,
  ])

  const onKeyDownForMin = useCallback((event: ReactKeyboardEvent<HTMLElement>) => {
    if (disabled) {
      return
    }

    const [valueMin] = current
    const [rangeMin, rangeMax] = rangeBy(valueMin, stepFor(keys.current.space))

    switch (event.code) {
      case 'ArrowLeft':
        setValueMin(rangeMin)
        break
      case 'ArrowRight':
        setValueMin(rangeMax === valueMin ? nextFor(rangeMax, keys.current.space) : rangeMax)
        break
      case 'End':
        setValueMin(max)
        break
      case 'Home':
        setValueMin(min)
        break
      default:
        break
    }
  }, [
    current,
    disabled,
    max,
    min,
    nextFor,
    rangeBy,
    setValueMin,
    stepFor,
  ])

  const onMoveMax = useCallback((event: globalThis.MouseEvent | globalThis.TouchEvent) => {
    const value = getEventValue(event)
    const [valueMin] = current

    if (value === null) {
      return
    }

    if (type === 'single') {
      setDragging(current => ({
        ...current,
        max: percentageOf(value),
      }))
      setValueMax(value)
    } else {
      setDragging(current => ({
        ...current,
        max: percentageOf(Math.max(valueMin, value)),
      }))
      setValueMax(value)
    }

    resetDragging('max')
  }, [
    current,
    getEventValue,
    percentageOf,
    resetDragging,
    setValueMax,
    type,
  ])

  const onMoveMin = useCallback((event: globalThis.MouseEvent | globalThis.TouchEvent) => {
    if (type === 'single') {
      return
    }

    const value = getEventValue(event)
    const [, valueMax] = current

    if (value === null) {
      return
    }

    setDragging(current => ({
      ...current,
      min: percentageOf(Math.min(value, valueMax)),
    }))
    setValueMin(value)
    resetDragging('min')
  }, [
    current,
    getEventValue,
    percentageOf,
    resetDragging,
    setValueMin,
    type,
  ])

  const updateNotches = useCallback(() => {
    const _active = fillerActive.current?.getBoundingClientRect()
    const _max = handleMax.current?.getBoundingClientRect()
    const _min = handleMin.current?.getBoundingClientRect()

    notches.current.forEach((notch) => {
      if (!notch) {
        return
      }

      const { left: x } = notch.getBoundingClientRect()

      const hidden = _max && (inRange(x - 2, toGap(_max)) || inRange(x + 2, toGap(_max))) ||
        _min && (inRange(x - 2, toGap(_min)) || inRange(x + 2, toGap(_min)))

      notch.classList.toggle('m3-slider__notch_active', !!_active && inRange(x, toGap(_active)))
      notch.classList.toggle('m3-slider__notch_hidden', !!hidden)

      notch.setAttribute('aria-hidden', hidden ? 'true' : 'false')
    })
  }, [])

  const setNotchAt = useCallback((index: number, notch: HTMLDivElement | null) => {
    notches.current[index] = notch
  }, [])

  useEffect(() => {
    if (!draggingHandle || disabled) {
      return
    }

    const onMove = (event: globalThis.MouseEvent | globalThis.TouchEvent) => {
      draggingHandle === 'max' ? onMoveMax(event) : onMoveMin(event)
    }

    const stop = () => setDraggingHandle(null)

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', stop)
    window.addEventListener('touchmove', onMove)
    window.addEventListener('touchcancel', stop)
    window.addEventListener('touchend', stop)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', stop)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchcancel', stop)
      window.removeEventListener('touchend', stop)
    }
  }, [
    disabled,
    draggingHandle,
    onMoveMax,
    onMoveMin,
  ])

  useEffect(() => {
    if (disabled) {
      setDraggingHandle(null)
    }
  }, [disabled])

  useEffect(() => {
    const updateId = requestAnimationFrame(updateNotches)

    return () => cancelAnimationFrame(updateId)
  }, [
    current,
    dragging.max,
    dragging.min,
    steps,
    updateNotches,
  ])

  useEffect(() => {
    const observer = new ResizeObserver(() => requestAnimationFrame(updateNotches))

    if (fillerActive.current) {
      observer.observe(fillerActive.current)
    }

    if (handleMax.current) {
      observer.observe(handleMax.current)
    }

    if (handleMin.current) {
      observer.observe(handleMin.current)
    }

    return () => observer.disconnect()
  }, [
    type,
    updateNotches,
  ])

  useEffect(() => {
    return () => {
      if (draggingResetId.current !== null) {
        cancelAnimationFrame(draggingResetId.current)
      }
    }
  }, [])

  return (
    <div
      className={toClassName([className, {
        'm3-slider': true,
        'm3-slider_range': type === 'range',
        'm3-slider_stepped': steps.length > 0,
        'm3-slider_disabled': disabled,
      }])}
      role="group"
      onKeyDown={compose((event) => {
        if (event.code === 'Space') {
          keys.current.space = true
        }
      }, onKeyDown)}
      onKeyUp={compose((event) => {
        if (event.code === 'Space') {
          keys.current.space = false
        }
      }, onKeyUp)}
      {...attrs}
    >
      <div ref={track} className="m3-slider__track">
        <div className="m3-slider__scale">
          <div
            ref={(el) => setNotchAt(0, el)}
            aria-label={String(min)}
            className="m3-slider__notch"
            style={withPercentage(0)}
            role="button"
            onClick={onNotchMinClick}
          >
            <div className="m3-slider__notch-control" />
          </div>

          {steps.map((p, i) => (
            <div
              key={p}
              ref={(el) => setNotchAt(i + 1, el)}
              aria-label={String(p)}
              className="m3-slider__notch"
              style={withPercentage(percentageOf(p))}
              role="button"
              onClick={() => onNotchClick(p, i + 1)}
            >
              <div className="m3-slider__notch-control" />
            </div>
          ))}

          <div
            ref={(el) => setNotchAt(steps.length + 1, el)}
            aria-label={String(max)}
            className="m3-slider__notch"
            style={withPercentage(100)}
            role="button"
            onClick={onNotchMaxClick}
          >
            <div className="m3-slider__notch-control" />
          </div>
        </div>

        {type === 'range' ? (
          <div
            className="m3-slider__value m3-slider__value_min"
            style={withPercentage(percentage.min)}
            onTransitionEnd={updateNotches}
          >
            <div
              ref={handleMin}
              aria-valuemax={current[1]}
              aria-valuemin={min}
              aria-valuenow={current[0]}
              aria-disabled={disabled ? 'true' : 'false'}
              className="m3-slider__handle"
              role="slider"
              tabIndex={0}
              {...ariaOptionsToAttrs(ariaHandleMin)}
              onKeyDown={onKeyDownForMin}
              onMouseDown={(event) => {
                if (!disabled && event.button === 0) {
                  setDraggingHandle('min')
                }
              }}
            />
          </div>
        ) : null}

        <div
          className="m3-slider__value m3-slider__value_max"
          style={withPercentage(percentage.max)}
          onTransitionEnd={updateNotches}
        >
          <div
            ref={handleMax}
            aria-valuemax={max}
            aria-valuemin={type === 'range' ? current[0] : min}
            aria-valuenow={current[1]}
            aria-disabled={disabled ? 'true' : 'false'}
            className="m3-slider__handle"
            role="slider"
            tabIndex={0}
            {...ariaOptionsToAttrs({
              ...ariaHandle,
              ...ariaHandleMax,
            })}
            onKeyDown={onKeyDownForMax}
            onMouseDown={(event) => {
              if (!disabled && event.button === 0) {
                setDraggingHandle('max')
              }
            }}
          />
        </div>

        {type === 'range' ? (
          <div
            style={withPercentage(percentage.min)}
            className="m3-slider__filler m3-slider__filler_min"
          />
        ) : null}

        <div
          ref={fillerActive}
          style={withPercentage(type === 'range'
            ? percentage.max - percentage.min
            : percentage.max)}
          className="m3-slider__filler m3-slider__filler_active"
        />

        <div
          style={withPercentage(100 - percentage.max)}
          className="m3-slider__filler m3-slider__filler_max"
        />
      </div>
    </div>
  )
}

export default M3Slider
