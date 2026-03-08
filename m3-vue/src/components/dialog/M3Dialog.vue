<template>
    <M3Surface
        v-if="dialogMounted"
        tag="section"
        mode="modal"
        :shown="dialogMounted"
        :scrim-shown="opened"
        teleport-to="body"
        :scrim="!fullscreen"
        :anchor="fullscreen ? 'none' : 'center'"
        :fill-width="fullscreen"
        :fill-height="fullscreen"
        :width="fullscreen ? '100vw' : DIALOG_WIDTH"
        :height="fullscreen ? '100vh' : null"
        :min-width="fullscreen ? 0 : DIALOG_MIN_WIDTH"
        :max-width="fullscreen ? '100vw' : DIALOG_MAX_WIDTH"
        :max-height="fullscreen ? '100vh' : null"
        :rounding="fullscreen ? 0 : DIALOG_ROUNDING"
        variant="surface-container-high"
        :elevation="DIALOG_ELEVATION"
        :z-index="DIALOG_Z_INDEX"
        :transition-ms="DIALOG_TRANSITION_MS"
        :transition-timing="DIALOG_TRANSITION_TIMING"
        class="m3-dialog"
        :style="dialogStyle"
        v-bind="$attrs"
        @dismiss="emit('update:opened', false)"
    >
        <div
            v-if="'icon' in $slots"
            class="m3-dialog__icon"
        >
            <slot name="icon" />
        </div>

        <header
            v-if="'header' in $slots"
            class="m3-dialog__header"
        >
            <slot name="header" />
        </header>

        <div class="m3-dialog__content">
            <slot />
        </div>

        <footer
            v-if="'footer' in $slots"
            class="m3-dialog__footer"
        >
            <slot name="footer" />
        </footer>
    </M3Surface>
</template>

<script lang="ts" setup>
import { M3Surface } from '@/components/surface'
import {
  m3MotionDurations,
  m3MotionEasings,
} from '@modulify/m3-foundation/lib/motion'
import {
  computed,
  nextTick,
  onBeforeUnmount,
  ref,
  watch,
} from 'vue'

defineOptions({
  inheritAttrs: false,
})

const DIALOG_WIDTH = 312
const DIALOG_MIN_WIDTH = 280
const DIALOG_MAX_WIDTH = 560
const DIALOG_ROUNDING = 28
const DIALOG_ENTRY_OFFSET_PX = 24
const DIALOG_ELEVATION = 0
const DIALOG_Z_INDEX = 1000
const DIALOG_TRANSITION_MS = m3MotionDurations.medium2
const DIALOG_TRANSITION_TIMING = m3MotionEasings.standard

const props = defineProps({
  opened: {
    type: Boolean,
    default: false,
  },

  fullscreen: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits([
  'update:opened',
])

const dialogMounted = ref(props.opened)
const dialogVisible = ref(false)
let enterFrame: number | null = null
let leaveTimer: number | null = null

const dialogStyle = computed(() => ({
  opacity: dialogVisible.value ? 1 : 0,
  transform: props.fullscreen
    ? 'translate3d(0, 0, 0)'
    : (dialogVisible.value
      ? 'translate(-50%, -50%)'
      : `translate(-50%, calc(-50% + ${DIALOG_ENTRY_OFFSET_PX}px))`),
  transition: `opacity ${DIALOG_TRANSITION_MS}ms ${DIALOG_TRANSITION_TIMING}, transform ${DIALOG_TRANSITION_MS}ms ${DIALOG_TRANSITION_TIMING}`,
  pointerEvents: dialogVisible.value ? 'auto' : 'none',
}))

const clearAnimationHandles = () => {
  if (enterFrame !== null) {
    window.cancelAnimationFrame(enterFrame)
    enterFrame = null
  }

  if (leaveTimer !== null) {
    window.clearTimeout(leaveTimer)
    leaveTimer = null
  }
}

watch(() => props.opened, async (opened) => {
  clearAnimationHandles()

  if (opened) {
    dialogMounted.value = true
    dialogVisible.value = false
    await nextTick()

    enterFrame = window.requestAnimationFrame(() => {
      enterFrame = null
      dialogVisible.value = true
    })

    return
  }

  dialogVisible.value = false

  if (!dialogMounted.value) {
    return
  }

  leaveTimer = window.setTimeout(() => {
    leaveTimer = null
    dialogMounted.value = false
  }, DIALOG_TRANSITION_MS)
}, {
  immediate: true,
})

onBeforeUnmount(() => {
  clearAnimationHandles()
})
</script>
