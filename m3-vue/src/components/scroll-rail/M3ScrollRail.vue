<template>
    <div
        ref="rail"
        :class="{
            'm3-scroll-rail': true,
            'm3-scroll-rail_horizontal': horizontal,
            'm3-scroll-rail_active': dragging,
            'm3-scroll-rail_disabled': disabled || !enabled,
        }"
    >
        <div
            ref="slider"
            class="m3-scroll-rail__slider"
            @mousedown="onMousedown"
        />
    </div>
</template>

<script lang="ts" setup>
import {
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from 'vue'

const props = defineProps({
  horizontal: {
    type: Boolean,
    default: false,
  },

  disabled: {
    type: Boolean,
    default: false,
  },
})

const box = ref<HTMLElement | null>(null)
const rail = ref<HTMLElement | null>(null)
const slider = ref<HTMLElement | null>(null)

const enabled = ref(false)
const dragging = ref(false)

let lastPageX = 0
let lastPageY = 0

const getPointerOffsetX = (event: MouseEvent) => event.pageX - lastPageX
const getPointerOffsetY = (event: MouseEvent) => event.pageY - lastPageY
const getPointerOffset = (event: MouseEvent) => props.horizontal
  ? getPointerOffsetX(event)
  : getPointerOffsetY(event)

const getScrollRatioX = () => box.value ? box.value.clientWidth / box.value.scrollWidth : 0
const getScrollRatioY = () => box.value ? box.value.clientHeight / box.value.scrollHeight : 0
const getScrollRatio = () => props.horizontal
  ? getScrollRatioX()
  : getScrollRatioY()

const getScrollDistanceX = () => box.value ?  box.value.scrollWidth - box.value.clientWidth : 0
const getScrollDistanceY = () => box.value ?  box.value.scrollHeight - box.value.clientHeight : 0
const getScrollDistance = () => props.horizontal
  ? getScrollDistanceX()
  : getScrollDistanceY()

const getClientWidth = () => box.value ? box.value.clientWidth : 0
const getClientHeight = () => box.value ? box.value.clientHeight : 0
const getClientSize = () => props.horizontal ? getClientWidth() : getClientHeight()

const getSliderWidth = () => slider.value ? parseFloat(slider.value.style.width) : 0
const getSliderHeight = () => slider.value ? parseFloat(slider.value.style.height) : 0
const getSliderSize = () => props.horizontal ? getSliderWidth() : getSliderHeight()

const sync = () => {
  const _box = rail.value?.parentElement
  const _slider = slider.value
  if (!_box || !_slider || props.disabled) {
    return
  }

  const scrollDistance = getScrollDistance()

  enabled.value = scrollDistance > 0

  if (enabled.value) {
    const sliderLength = getClientSize() * getScrollRatio()
    const sliderDistance = getClientSize() - sliderLength

    if (props.horizontal) {
      _slider.style.width = sliderLength + 'px'
      _slider.style.height = ''
      _slider.style.left = _box.scrollLeft * sliderDistance / scrollDistance + 'px'
      _slider.style.top = ''
    } else {
      _slider.style.width = ''
      _slider.style.height = sliderLength + 'px'
      _slider.style.left = ''
      _slider.style.top = _box.scrollTop * sliderDistance / scrollDistance + 'px'
    }
  }
}

defineExpose({
  sync,
})

watch(() => props.horizontal, (isHorizontal, wasHorizontal) => {
  if (!props.disabled && isHorizontal !== wasHorizontal) {
    sync()
  }
})

watch(() => props.disabled, (isDisabled, wasDisabled) => {
  if (!isDisabled && wasDisabled) {
    sync()
  }
})

const onMousedown = (event: MouseEvent) => {
  dragging.value = true
  lastPageY = event.pageY
  lastPageX = event.pageX
}

const onMousemove = (event: MouseEvent) => {
  const _box = box.value
  const _slider = slider.value

  if (!_box || !_slider || !dragging.value) {
    return
  }

  const scrollDistance = getScrollDistance()
  const sliderDistance = getClientSize() - getSliderSize()

  if (scrollDistance > 0 && sliderDistance > 0) {
    const pointerOffset = getPointerOffset(event)
    if (props.horizontal) {
      _box.scrollLeft = (_slider.offsetLeft + pointerOffset) * scrollDistance / sliderDistance
      _slider.style.left = (_box.scrollLeft * sliderDistance / scrollDistance) + 'px'
      _slider.style.top = ''
    } else {
      _box.scrollTop = (_slider.offsetTop + pointerOffset) * scrollDistance / sliderDistance
      _slider.style.left = ''
      _slider.style.top = (_box.scrollTop * sliderDistance / scrollDistance) + 'px'
    }
  }

  lastPageX = event.pageX
  lastPageY = event.pageY
}

const onMouseup = () => dragging.value = false
const onScroll = () => sync()

let observer: ResizeObserver | null = null

onMounted(() => {
  const _box = rail.value?.parentElement ?? null

  box.value = _box

  sync()

  if (_box) {
    observer = new ResizeObserver(() => sync())
    observer.observe(_box)

    _box.addEventListener('scroll', onScroll)
  }

  window.addEventListener('mousemove', onMousemove)
  window.addEventListener('mouseup', onMouseup)
})

onBeforeUnmount(() => {
  window.removeEventListener('mousemove', onMousemove)
  window.removeEventListener('mouseup', onMouseup)

  observer?.disconnect()
  observer = null

  box.value?.removeEventListener('scroll', onScroll)
  box.value = null
})
</script>
