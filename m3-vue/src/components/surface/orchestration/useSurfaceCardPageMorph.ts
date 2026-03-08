/* eslint-disable max-lines-per-function */
import {
  computed,
  onBeforeUnmount,
  nextTick,
  onMounted,
  ref,
} from 'vue'

import {
  measureContainerRect,
  measureRelativeRect,
  raf,
  toMotionStyle,
  type SurfaceMotionRect,
  wait,
} from '@modulify/m3-foundation/lib/surface/orchestration'

export function useSurfaceCardPageMorph(transitionMs: number) {
  const expanded = ref(false)
  const busy = ref(false)
  const backgroundCollapsed = ref(false)
  const originHeight = ref(220)
  const canvas = ref<HTMLElement | null>(null)
  const originSlot = ref<HTMLElement | null>(null)
  let observer: ResizeObserver | null = null
  const syncFrame = ref<number | null>(null)
  const motion = ref<SurfaceMotionRect>({
    top: 16,
    left: 16,
    width: 320,
    height: 220,
  })

  const overlayStyle = computed(() => toMotionStyle(motion.value))

  function measureOrigin() {
    return measureRelativeRect(canvas.value, originSlot.value)
  }

  function measureExpanded() {
    return measureContainerRect(canvas.value)
  }

  function syncMotionToLayout() {
    const origin = measureOrigin()

    if (origin) {
      originHeight.value = origin.height
    }

    if (expanded.value) {
      const full = measureExpanded()

      if (full) {
        motion.value = full
      }

      return
    }

    if (!origin || backgroundCollapsed.value) {
      return
    }

    motion.value = origin
  }

  function scheduleSyncMotion() {
    if (syncFrame.value !== null) {
      cancelAnimationFrame(syncFrame.value)
    }

    syncFrame.value = requestAnimationFrame(() => {
      syncFrame.value = null
      syncMotionToLayout()
    })
  }

  async function initMotion() {
    await nextTick()
    await raf()

    const origin = measureOrigin()
    if (!origin) {
      return
    }

    motion.value = origin
    originHeight.value = origin.height
  }

  async function expandCard() {
    backgroundCollapsed.value = false

    const origin = measureOrigin()
    if (origin) {
      motion.value = origin
      originHeight.value = origin.height
    }

    expanded.value = true
    await nextTick()
    await raf()

    const full = measureExpanded()
    if (!full) {
      return
    }

    motion.value = full
    await wait(transitionMs)
    backgroundCollapsed.value = true
  }

  async function collapseCard() {
    if (backgroundCollapsed.value) {
      backgroundCollapsed.value = false
      await nextTick()
      await raf()
    }

    const full = measureExpanded()
    if (full) {
      motion.value = full
    }

    const origin = measureOrigin()
    if (origin) {
      originHeight.value = origin.height
    }

    expanded.value = false
    await nextTick()
    await raf()

    if (!origin) {
      return
    }

    motion.value = origin
    await wait(transitionMs)
  }

  async function toggleCardMode() {
    if (busy.value) {
      return
    }

    busy.value = true

    if (expanded.value) {
      await collapseCard()
      busy.value = false
      return
    }

    await expandCard()
    busy.value = false
  }

  onMounted(() => {
    initMotion()

    if (typeof ResizeObserver === 'undefined') {
      return
    }

    observer = new ResizeObserver(() => {
      scheduleSyncMotion()
    })

    if (canvas.value && observer) {
      observer.observe(canvas.value)
    }

    if (originSlot.value && observer) {
      observer.observe(originSlot.value)
    }
  })

  onBeforeUnmount(() => {
    observer?.disconnect()

    if (syncFrame.value !== null) {
      cancelAnimationFrame(syncFrame.value)
      syncFrame.value = null
    }
  })

  return {
    expanded,
    busy,
    backgroundCollapsed,
    originHeight,
    overlayStyle,
    canvas,
    originSlot,
    toggleCardMode,
  }
}
