<template>
    <M3Surface
        v-if="surfaceMounted"
        :id="_id"
        tag="div"
        mode="modal"
        anchor="end"
        :shown="true"
        :scrim-shown="surfaceScrimShown"
        :fill-width="false"
        :fill-height="true"
        :width="docked ? 256 : undefined"
        :min-width="docked ? 256 : 320"
        :max-width="docked ? 256 : 400"
        variant="surface-container-low"
        :elevation="0"
        :z-index="DOCKED_Z_INDEX"
        overflow="hidden"
        :rounding-top-left="docked ? 0 : 16"
        :rounding-bottom-left="docked ? 0 : 16"
        :rounding-top-right="0"
        :rounding-bottom-right="0"
        role="dialog"
        :class="surfaceClass"
        v-bind="surfaceAttrs"
        @update:shown="emit('update:shown', $event)"
    >
        <header :class="headerClass">
            <div v-if="'affordance' in $slots" class="m3-side-sheet__affordance">
                <slot name="affordance" />
            </div>

            <div :id="_id + '-title'" class="m3-side-sheet__title">
                <slot name="title" />
            </div>

            <div class="m3-side-sheet__affordance">
                <M3IconButton @click="emit('update:shown', false)">
                    <slot name="close-icon" />
                </M3IconButton>
            </div>
        </header>

        <div class="m3-side-sheet__content">
            <M3ScrollRail />
            <slot />
        </div>

        <footer
            v-if="'footer' in $slots"
            class="m3-side-sheet__footer"
        >
            <slot name="footer" />
        </footer>
    </M3Surface>
</template>

<script lang="ts" setup>
import { M3IconButton } from '@/components/icon-button'
import { M3ScrollRail } from '@/components/scroll-rail'
import { M3Surface } from '@/components/surface'
import { m3MotionDurations } from '@modulify/m3-foundation/lib/motion'

import {
  computed,
  nextTick,
  onBeforeUnmount,
  ref,
  useAttrs,
  useSlots,
  watch,
} from 'vue'

import {
  isId,
  isUndefined,
  Or,
} from '@modulify/m3-foundation/lib/predicates'

import useId from '@/composables/id'

const DOCKED_Z_INDEX = 1000
const SIDE_SHEET_TRANSITION_MS = m3MotionDurations['extra-long2']

type TransitionState = 'idle' | 'pre-enter' | 'entering' | 'pre-exit' | 'exiting'

const props = defineProps({
  id: {
    type: String,
    validator: Or(isId, isUndefined),
    default: undefined,
  },

  shown: {
    type: Boolean,
    default: false,
  },

  docked: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:shown'])
const attrs = useAttrs()
const slots = useSlots()

const _id = useId('m3-side-sheet', computed(() => props.id))
const surfaceMounted = ref(props.shown)
const transitionState = ref<TransitionState>('idle')
let transitionTimeout: number | null = null

const surfaceClass = computed(() => ({
  'm3-side-sheet': true,
  'm3-side-sheet_docked': props.docked,
  'm3-transition-slide-right-enter': transitionState.value === 'pre-enter' || transitionState.value === 'entering',
  'm3-transition-slide-right-enter-active': transitionState.value === 'entering',
  'm3-transition-slide-right-leave-active': transitionState.value === 'pre-exit' || transitionState.value === 'exiting',
  'm3-transition-slide-right-leave-to': transitionState.value === 'exiting',
}))

const headerClass = computed(() => ({
  'm3-side-sheet__header': true,
  'm3-side-sheet__header_has-leading-affordance': 'affordance' in slots,
}))

const surfaceScrimShown = computed(() => !props.docked && props.shown && transitionState.value !== 'pre-enter')

const surfaceAttrs = computed(() => ({
  ...attrs,
  ...('aria-label' in attrs || 'aria-labelledby' in attrs ? {} : {
    'aria-labelledby': _id.value + '-title',
  }),
  ...('aria-modal' in attrs || !props.docked ? {} : {
    'aria-modal': 'false',
  }),
}))

function clearTransitionTimer() {
  if (transitionTimeout === null) {
    return
  }

  clearTimeout(transitionTimeout)
  transitionTimeout = null
}

async function enterSurface() {
  clearTransitionTimer()
  surfaceMounted.value = true
  transitionState.value = 'pre-enter'

  await nextTick()
  await new Promise<void>(resolve => requestAnimationFrame(() => resolve()))

  transitionState.value = 'entering'
  transitionTimeout = window.setTimeout(() => {
    transitionState.value = 'idle'
    transitionTimeout = null
  }, SIDE_SHEET_TRANSITION_MS)
}

async function leaveSurface() {
  if (!surfaceMounted.value) {
    transitionState.value = 'idle'
    return
  }

  clearTransitionTimer()
  transitionState.value = 'pre-exit'

  await nextTick()
  await new Promise<void>(resolve => requestAnimationFrame(() => resolve()))

  transitionState.value = 'exiting'
  transitionTimeout = window.setTimeout(() => {
    surfaceMounted.value = false
    transitionState.value = 'idle'
    transitionTimeout = null
  }, SIDE_SHEET_TRANSITION_MS)
}

watch(() => props.shown, (shown) => {
  void (shown ? enterSurface() : leaveSurface())
}, {
  immediate: true,
})

onBeforeUnmount(() => {
  clearTransitionTimer()
})
</script>
