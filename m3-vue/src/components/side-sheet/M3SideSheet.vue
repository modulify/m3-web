<template>
    <M3Surface
        v-if="surfaceMounted"
        :id="_id"
        :shown="true"
        :scrim-shown="surfaceScrimShown"
        :fill-width="false"
        :fill-height="true"
        :width="docked ? 256 : undefined"
        :min-width="docked ? 256 : 320"
        :max-width="docked ? 256 : 400"
        :z-index="DOCKED_Z_INDEX"
        :rounding-top-left="docked ? 0 : 16"
        :rounding-bottom-left="docked ? 0 : 16"
        :rounding-top-right="0"
        :rounding-bottom-right="0"
        :elevation="0"
        :class="surfaceClass"
        role="dialog"
        tag="div"
        mode="modal"
        anchor="end"
        overflow="hidden"
        variant="surface-container-low"
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
import { computed } from 'vue'
import { isId } from '@modulify/m3-foundation/lib/predicates'
import { isUndefined } from '@modulify/validator/predicates'
import { nextTick } from 'vue'
import { Or } from '@modulify/validator/predicates'
import {
  ref,
  useAttrs,
  useSlots,
  watch,
} from 'vue'

import { durations } from '@modulify/m3-foundation/lib/motion'

import { M3IconButton } from '@/components/icon-button'
import { M3ScrollRail } from '@/components/scroll-rail'
import { M3Surface } from '@/components/surface'

import { useAnimationFrame } from '@/composables/animation'
import { useId } from '@/composables/id'
import { useTimeout } from '@/composables/timing'

const DOCKED_Z_INDEX = 1000
const SIDE_SHEET_TRANSITION_MS = durations['extra-long2']

type TransitionState = 'idle' | 'pre-enter' | 'entering' | 'pre-exit' | 'exiting'

const props = defineProps({
  id: {
    type: String,
    validator: Or(isId, isUndefined) as (value: unknown) => boolean,
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
const transitionFrame = useAnimationFrame()
const enterTimeout = useTimeout(() => transitionState.value = 'idle', SIDE_SHEET_TRANSITION_MS)
const leaveTimeout = useTimeout(() => {
  surfaceMounted.value = false
  transitionState.value = 'idle'
}, SIDE_SHEET_TRANSITION_MS)

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
  transitionFrame.cancel()
  enterTimeout.cancel()
  leaveTimeout.cancel()
}

async function enterSurface() {
  clearTransitionTimer()
  surfaceMounted.value = true
  transitionState.value = 'pre-enter'

  await nextTick()
  transitionFrame.request(() => {
    transitionState.value = 'entering'
    enterTimeout.schedule()
  })
}

async function leaveSurface() {
  if (!surfaceMounted.value) {
    transitionState.value = 'idle'
    return
  }

  clearTransitionTimer()
  transitionState.value = 'pre-exit'

  await nextTick()
  transitionFrame.request(() => {
    transitionState.value = 'exiting'
    leaveTimeout.schedule()
  })
}

watch(() => props.shown, (shown) => {
  void (shown ? enterSurface() : leaveSurface())
}, {
  immediate: true,
})

</script>
