<template>
    <M3Surface
        v-if="dialogMounted"
        :shown="dialogMounted"
        :scrim-shown="opened"
        :scrim="!fullscreen"
        :transition-ms="DIALOG_TRANSITION_MS"
        :transition-timing="DIALOG_TRANSITION_TIMING"
        :anchor="fullscreen ? 'none' : 'center'"
        :fill-width="fullscreen"
        :fill-height="fullscreen"
        :width="fullscreen ? '100vw' : DIALOG_WIDTH"
        :height="fullscreen ? '100vh' : null"
        :min-width="fullscreen ? 0 : DIALOG_MIN_WIDTH"
        :max-width="fullscreen ? '100vw' : DIALOG_MAX_WIDTH"
        :max-height="fullscreen ? '100vh' : null"
        :rounding="fullscreen ? 0 : DIALOG_ROUNDING"
        :z-index="DIALOG_Z_INDEX"
        :elevation="DIALOG_ELEVATION"
        :style="dialogStyle"
        tag="section"
        mode="modal"
        teleport-to="body"
        variant="surface-container-high"
        class="m3-dialog"
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
import {
  computed,
  nextTick,
  ref,
  watch,
} from 'vue'

import { durations, easing } from '@modulify/m3-foundation/lib/motion'

import { M3Surface } from '@/components/surface'

import { useAnimationFrame } from '@/composables/animation'
import { useTimeout } from '@/composables/timing'

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
const DIALOG_TRANSITION_MS = durations.medium2
const DIALOG_TRANSITION_TIMING = easing.standard

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
const enterFrame = useAnimationFrame()
const leaveTimeout = useTimeout(() => dialogMounted.value = false, DIALOG_TRANSITION_MS)

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
  enterFrame.cancel()
  leaveTimeout.cancel()
}

watch(() => props.opened, async (opened) => {
  clearAnimationHandles()

  if (opened) {
    dialogMounted.value = true
    dialogVisible.value = false
    await nextTick()

    enterFrame.request(() => {
      dialogVisible.value = true
    })

    return
  }

  dialogVisible.value = false

  if (!dialogMounted.value) {
    return
  }

  leaveTimeout.schedule()
}, {
  immediate: true,
})

</script>
