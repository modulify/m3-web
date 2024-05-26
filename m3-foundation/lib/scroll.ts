export const getScrollRatioX = (box: HTMLElement | null) => box && box.scrollWidth > 0
  ? box.clientWidth / box.scrollWidth
  : 0

export const getScrollRatioY = (box: HTMLElement | null) => box && box.scrollHeight
  ? box.clientHeight / box.scrollHeight
  : 0

export const getScrollRatio = (box: HTMLElement | null, horizontal: boolean) => horizontal
  ? getScrollRatioX(box)
  : getScrollRatioY(box)

export const getScrollDistanceX = (box: HTMLElement | null) => box ? box.scrollWidth - box.clientWidth : 0
export const getScrollDistanceY = (box: HTMLElement | null) => box ? box.scrollHeight - box.clientHeight : 0
export const getScrollDistance = (box: HTMLElement | null, horizontal: boolean) => horizontal
  ? getScrollDistanceX(box)
  : getScrollDistanceY(box)

export const getClientWidth = (box: HTMLElement | null) => box ? box.clientWidth : 0
export const getClientHeight = (box: HTMLElement | null) => box ? box.clientHeight : 0
export const getClientSize = (box: HTMLElement | null, horizontal: boolean) => horizontal
  ? getClientWidth(box)
  : getClientHeight(box)

export const getSliderWidth = (slider: HTMLElement | null) => slider ? parseFloat(slider.style.width) : 0
export const getSliderHeight = (slider: HTMLElement | null) => slider ? parseFloat(slider.style.height) : 0
export const getSliderSize = (slider: HTMLElement | null, horizontal: boolean) => horizontal
  ? getSliderWidth(slider)
  : getSliderHeight(slider)

export const syncSlider = (
  box: HTMLElement,
  slider: HTMLElement,
  horizontal: boolean
) => {
  const scrollDistance = getScrollDistance(box, horizontal)
  const enabled = scrollDistance > 0

  if (enabled) {
    const sliderLength = getClientSize(box, horizontal) * getScrollRatio(box, horizontal)
    const sliderDistance = getClientSize(box, horizontal) - sliderLength

    if (horizontal) {
      slider.style.width = sliderLength + 'px'
      slider.style.height = ''
      slider.style.left = box.scrollLeft * sliderDistance / scrollDistance + 'px'
      slider.style.top = ''
    } else {
      slider.style.width = ''
      slider.style.height = sliderLength + 'px'
      slider.style.left = ''
      slider.style.top = box.scrollTop * sliderDistance / scrollDistance + 'px'
    }
  }

  return enabled
}

export const createRail = (el: HTMLElement, options: {
  horizontal?: boolean
  disabled?: boolean
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onToggle?: (active: boolean) => void;
}) => {
  let box: HTMLElement | null = null
  let observer: ResizeObserver | null = null

  let dragging = false
  let horizontal = options.horizontal ?? false
  let disabled = options.disabled ?? false

  const slider = el.querySelector<HTMLElement>('.m3-scroll-rail__slider')
  if (!slider) {
    throw new Error('[@modulify/m3-foundation::M3ScrollRail] Slider element not found')
  }

  let lastPageX = 0
  let lastPageY = 0

  const getPointerOffsetX = (event: MouseEvent) => event.pageX - lastPageX
  const getPointerOffsetY = (event: MouseEvent) => event.pageY - lastPageY
  const getPointerOffset = (event: MouseEvent) => horizontal
    ? getPointerOffsetX(event)
    : getPointerOffsetY(event)

  const onMousedown = (event: MouseEvent) => {
    dragging = true
    options.onDragStart?.()
    lastPageY = event.pageY
    lastPageX = event.pageX
  }

  const onMousemove = (event: MouseEvent) => {
    if (!box || !dragging) {
      return
    }

    const scrollDistance = getScrollDistance(box, horizontal)
    const sliderDistance = getClientSize(box, horizontal) - getSliderSize(slider, horizontal)

    if (scrollDistance > 0 && sliderDistance > 0) {
      const pointerOffset = getPointerOffset(event)
      if (horizontal) {
        box.scrollLeft = (slider.offsetLeft + pointerOffset) * scrollDistance / sliderDistance
        slider.style.left = (box.scrollLeft * sliderDistance / scrollDistance) + 'px'
        slider.style.top = ''
      } else {
        box.scrollTop = (slider.offsetTop + pointerOffset) * scrollDistance / sliderDistance
        slider.style.left = ''
        slider.style.top = (box.scrollTop * sliderDistance / scrollDistance) + 'px'
      }
    }

    lastPageX = event.pageX
    lastPageY = event.pageY
  }

  const onMouseup = () => {
    dragging = false
    options.onDragEnd?.()
  }

  const subscribe = (el: HTMLElement) => {
    observer = new ResizeObserver(() => sync())
    observer.observe(el)

    el.addEventListener('scroll', sync, { passive: true })
  }

  const unsubscribe = () => {
    observer?.disconnect()
    observer = null

    box?.removeEventListener('scroll', sync)
    box = null
  }

  const connect = () => {
    const parent = el.parentElement ?? null

    if (parent === box) return
    if (box) { unsubscribe() }
    if (parent) { subscribe(parent) }

    box = parent
  }

  const sync = () => {
    connect()

    if (box && !disabled) {
      const enabled = syncSlider(box, slider, horizontal)
      options.onToggle?.(enabled)
    } else {
      options.onToggle?.(false)
    }
  }

  return {
    get horizontal () { return horizontal },
    set horizontal (isHorizontal: boolean) {
      const wasHorizontal = horizontal

      horizontal = isHorizontal

      if (!disabled && isHorizontal !== wasHorizontal) {
        sync()
      }
    },

    get disabled () { return disabled },
    set disabled (disable: boolean) {
      if (!disable && disabled) {
        sync()
      }
    },

    init () {
      slider.addEventListener('mousedown', onMousedown)
      window.addEventListener('mousemove', onMousemove)
      window.addEventListener('mouseup', onMouseup)
      sync()
    },

    sync,

    destroy () {
      slider.removeEventListener('mousedown', onMousedown)
      window.removeEventListener('mousemove', onMousemove)
      window.removeEventListener('mouseup', onMouseup)
      unsubscribe()
    },
  }
}

export type ScrollRail = ReturnType<typeof createRail>
