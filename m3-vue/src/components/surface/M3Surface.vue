<template>
    <Teleport v-if="isModal" :to="teleportTo">
        <Transition v-if="scrim" name="m3-transition-fade">
            <div
                v-show="resolvedScrimShown"
                :style="{ zIndex: zIndex - 1 }"
                class="m3-surface__scrim"
                @click="onScrimClick"
            />
        </Transition>

        <M3SurfacePanel
            :id="_id"
            :tag="tag"
            :elevation="elevation"
            :variant="variant"
            :fill-width="fillWidth"
            :fill-height="fillHeight"
            :width="width"
            :height="height"
            :min-width="minWidth"
            :max-width="maxWidth"
            :min-height="minHeight"
            :max-height="maxHeight"
            :rounding="rounding"
            :rounding-top-left="roundingTopLeft"
            :rounding-top-right="roundingTopRight"
            :rounding-bottom-right="roundingBottomRight"
            :rounding-bottom-left="roundingBottomLeft"
            :transition-ms="transitionMs"
            :transition-timing="transitionTiming"
            :overflow="overflow"
            :class="surfaceClass"
            :style="surfaceStyle"
            v-bind="surfaceAttrs"
        >
            <slot />
        </M3SurfacePanel>
    </Teleport>

    <M3SurfacePanel
        v-else
        :id="_id"
        :tag="tag"
        :elevation="elevation"
        :variant="variant"
        :fill-width="fillWidth"
        :fill-height="fillHeight"
        :width="width"
        :height="height"
        :min-width="minWidth"
        :max-width="maxWidth"
        :min-height="minHeight"
        :max-height="maxHeight"
        :rounding="rounding"
        :rounding-top-left="roundingTopLeft"
        :rounding-top-right="roundingTopRight"
        :rounding-bottom-right="roundingBottomRight"
        :rounding-bottom-left="roundingBottomLeft"
        :transition-ms="transitionMs"
        :transition-timing="transitionTiming"
        :overflow="overflow"
        :class="surfaceClass"
        :style="surfaceStyle"
        v-bind="surfaceAttrs"
    >
        <slot />
    </M3SurfacePanel>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'
import type {
  Anchor as SurfaceAnchor,
  Length as SurfaceLength,
  Mode as SurfaceMode,
} from '@modulify/m3-foundation/types/components/surface'

import M3SurfacePanel from './M3SurfacePanel.vue'

import {
  computed,
  useAttrs,
} from 'vue'

import useId from '@/composables/id'
import {
  getModalAnchorStyle,
  surfacePanelProps,
  toLength,
} from './shared'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps({
  ...surfacePanelProps,

  shown: {
    type: Boolean,
    default: true,
  },

  mode: {
    type: String as PropType<SurfaceMode>,
    default: 'standard',
  },

  teleportTo: {
    type: String,
    default: 'body',
  },

  scrim: {
    type: Boolean,
    default: true,
  },

  scrimShown: {
    type: Boolean,
    default: undefined,
  },

  anchor: {
    type: String as PropType<SurfaceAnchor>,
    default: 'none',
  },

  insetTop: {
    type: null as unknown as PropType<SurfaceLength>,
    default: 0,
  },

  insetRight: {
    type: null as unknown as PropType<SurfaceLength>,
    default: 0,
  },

  insetBottom: {
    type: null as unknown as PropType<SurfaceLength>,
    default: 0,
  },

  insetLeft: {
    type: null as unknown as PropType<SurfaceLength>,
    default: 0,
  },

  zIndex: {
    type: Number,
    default: 400,
  },
})

const emit = defineEmits([
  'update:shown',
  'dismiss',
])

const attrs = useAttrs()

const _id = useId('m3-surface', computed(() => props.id))

const isModal = computed(() => props.mode === 'modal')
const resolvedScrimShown = computed(() => props.scrimShown ?? props.shown)

const surfaceAttrs = computed(() => {
  return isModal.value ? {
    role: 'dialog',
    'aria-modal': 'true',
    ...attrs,
  } : {
    role: 'region',
    ...attrs,
  }
})

const surfaceClass = computed(() => ({
  ['m3-surface_modal']: isModal.value,
  [`m3-surface_anchor-${props.anchor}`]: true,
}))

const surfaceStyle = computed(() => {
  return {
    ...isModal.value && getModalAnchorStyle(props.anchor, {
      top: toLength(props.insetTop, '0px'),
      right: toLength(props.insetRight, '0px'),
      bottom: toLength(props.insetBottom, '0px'),
      left: toLength(props.insetLeft, '0px'),
    }),
    position: isModal.value ? 'fixed' : 'relative',
    zIndex: isModal.value ? props.zIndex : undefined,
    display: props.shown ? undefined : 'none',
  }
})

function onScrimClick() {
  emit('update:shown', false)
  emit('dismiss')
}
</script>
