<template>
    <Teleport v-if="isModal" :to="teleportTo">
        <Transition v-if="scrim" name="m3-transition-fade">
            <div
                v-show="shown"
                :style="{ zIndex: zIndex - 1 }"
                class="m3-surface__scrim"
                @click="onScrimClick"
            />
        </Transition>

        <component
            :is="tag"
            v-show="shown"
            :id="_id"
            :class="surfaceClass"
            :style="surfaceStyle"
            v-bind="surfaceAttrs"
        >
            <slot />
        </component>
    </Teleport>

    <component
        :is="tag"
        v-else
        v-show="shown"
        :id="_id"
        :class="surfaceClass"
        :style="surfaceStyle"
        v-bind="surfaceAttrs"
    >
        <slot />
    </component>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'
import type {
  Anchor as SurfaceAnchor,
  Length as SurfaceLength,
  Mode as SurfaceMode,
  Variant as SurfaceVariant,
} from '@modulify/m3-foundation/types/components/surface'

import {
  computed,
  useAttrs,
} from 'vue'

import {
  isId,
  isUndefined,
  Or,
} from '@modulify/m3-foundation/lib/predicates'
import { m3MotionEasings } from '@modulify/m3-foundation/lib/motion'

import useId from '@/composables/id'

defineOptions({
  inheritAttrs: false,
})

type AnchorStyleFactory = (inset: {
  top: string,
  right: string,
  bottom: string,
  left: string,
}) => Record<string, string>

const MODAL_ANCHOR_STYLE: Record<SurfaceAnchor, AnchorStyleFactory> = {
  none: ({ top, right, bottom, left }) => ({ top, right, bottom, left }),
  center: () => ({
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-50%, -50%)',
  }),
  start: ({ top, bottom, left }) => ({ top, bottom, left, right: 'auto' }),
  end: ({ top, right, bottom }) => ({ top, right, bottom, left: 'auto' }),
  top: ({ top, left, right }) => ({ top, left, right, bottom: 'auto' }),
  bottom: ({ bottom, left, right }) => ({ bottom, left, right, top: 'auto' }),
  'top-start': ({ top, left }) => ({ top, left, right: 'auto', bottom: 'auto' }),
  'top-end': ({ top, right }) => ({ top, right, left: 'auto', bottom: 'auto' }),
  'bottom-start': ({ bottom, left }) => ({ bottom, left, right: 'auto', top: 'auto' }),
  'bottom-end': ({ bottom, right }) => ({ bottom, right, left: 'auto', top: 'auto' }),
}

const props = defineProps({
  id: {
    type: null as unknown as PropType<string | undefined>,
    validator: Or(isId, isUndefined),
    default: undefined,
  },

  tag: {
    type: String,
    default: 'section',
  },

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

  elevation: {
    type: Number,
    default: 0,
    validator: (value: number) => Number.isInteger(value) && value >= 0 && value <= 5,
  },

  variant: {
    type: String as PropType<SurfaceVariant>,
    default: 'auto',
  },

  fillWidth: {
    type: Boolean,
    default: true,
  },

  fillHeight: {
    type: Boolean,
    default: true,
  },

  width: {
    type: null as unknown as PropType<SurfaceLength | null>,
    default: null,
  },

  height: {
    type: null as unknown as PropType<SurfaceLength | null>,
    default: null,
  },

  minWidth: {
    type: null as unknown as PropType<SurfaceLength | null>,
    default: null,
  },

  maxWidth: {
    type: null as unknown as PropType<SurfaceLength | null>,
    default: null,
  },

  minHeight: {
    type: null as unknown as PropType<SurfaceLength | null>,
    default: null,
  },

  maxHeight: {
    type: null as unknown as PropType<SurfaceLength | null>,
    default: null,
  },

  rounding: {
    type: null as unknown as PropType<SurfaceLength>,
    default: 0,
  },

  roundingTopLeft: {
    type: null as unknown as PropType<SurfaceLength | null>,
    default: null,
  },

  roundingTopRight: {
    type: null as unknown as PropType<SurfaceLength | null>,
    default: null,
  },

  roundingBottomRight: {
    type: null as unknown as PropType<SurfaceLength | null>,
    default: null,
  },

  roundingBottomLeft: {
    type: null as unknown as PropType<SurfaceLength | null>,
    default: null,
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

  transitionMs: {
    type: Number,
    default: 220,
  },

  transitionTiming: {
    type: String,
    default: m3MotionEasings.standard,
  },

  overflow: {
    type: String,
    default: 'visible',
  },
})

const emit = defineEmits([
  'update:shown',
  'dismiss',
])

const attrs = useAttrs()

function toLength(value: SurfaceLength | null | undefined, fallback: string): string {
  if (value == null) {
    return fallback
  }

  return typeof value === 'number'
    ? `${value}px`
    : value
}

function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined
}

const _id = useId('m3-surface', computed(() => props.id))

const isModal = computed(() => props.mode === 'modal')

const resolvedVariant = computed<Exclude<SurfaceVariant, 'auto'>>(() => {
  if (props.variant !== 'auto') return props.variant

  switch (props.elevation) {
    case 0: return 'surface'
    case 1: return 'surface-container-low'
    case 2: return 'surface-container'
    case 3: return 'surface-container-high'
    case 4: return 'surface-container-highest'
    default: return 'surface-bright'
  }
})

const resolvedSizeStyle = computed(() => {
  const width = isDefined(props.width)
    ? toLength(props.width, 'auto')
    : (props.fillWidth ? '100%' : 'auto')

  const height = isDefined(props.height)
    ? toLength(props.height, 'auto')
    : (props.fillHeight ? '100%' : 'auto')

  return {
    width,
    height,
    minWidth: isDefined(props.minWidth) ? toLength(props.minWidth, '0px') : undefined,
    maxWidth: isDefined(props.maxWidth) ? toLength(props.maxWidth, 'none') : undefined,
    minHeight: isDefined(props.minHeight) ? toLength(props.minHeight, '0px') : undefined,
    maxHeight: isDefined(props.maxHeight) ? toLength(props.maxHeight, 'none') : undefined,
  }
})

const cornerRadiusStyle = computed(() => {
  const base = toLength(props.rounding, '0px')

  return {
    borderTopLeftRadius: isDefined(props.roundingTopLeft) ? toLength(props.roundingTopLeft, base) : base,
    borderTopRightRadius: isDefined(props.roundingTopRight) ? toLength(props.roundingTopRight, base) : base,
    borderBottomRightRadius: isDefined(props.roundingBottomRight) ? toLength(props.roundingBottomRight, base) : base,
    borderBottomLeftRadius: isDefined(props.roundingBottomLeft) ? toLength(props.roundingBottomLeft, base) : base,
  }
})

const anchorStyle = computed(() => {
  if (!isModal.value) {
    return {}
  }

  const inset = {
    top: toLength(props.insetTop, '0px'),
    right: toLength(props.insetRight, '0px'),
    bottom: toLength(props.insetBottom, '0px'),
    left: toLength(props.insetLeft, '0px'),
  }

  return MODAL_ANCHOR_STYLE[props.anchor](inset)
})

const transition = computed(() => {
  const duration = `${props.transitionMs}ms`

  return [
    `width ${duration} ${props.transitionTiming}`,
    `height ${duration} ${props.transitionTiming}`,
    `min-width ${duration} ${props.transitionTiming}`,
    `max-width ${duration} ${props.transitionTiming}`,
    `min-height ${duration} ${props.transitionTiming}`,
    `max-height ${duration} ${props.transitionTiming}`,
    `top ${duration} ${props.transitionTiming}`,
    `right ${duration} ${props.transitionTiming}`,
    `bottom ${duration} ${props.transitionTiming}`,
    `left ${duration} ${props.transitionTiming}`,
    `transform ${duration} ${props.transitionTiming}`,
    `opacity ${duration} ${props.transitionTiming}`,
    `background-color ${duration} ${props.transitionTiming}`,
    `box-shadow ${duration} ${props.transitionTiming}`,
  ].join(', ')
})

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
  'm3-surface': true,
  'm3-surface_modal': isModal.value,
  [`m3-surface_role-${resolvedVariant.value}`]: true,
  [`m3-surface_anchor-${props.anchor}`]: true,
  [`m3-surface_elevation-${props.elevation}`]: true,
}))

const surfaceStyle = computed(() => {
  return {
    ...resolvedSizeStyle.value,
    ...cornerRadiusStyle.value,
    ...anchorStyle.value,
    '--m3-surface-radius-transition-duration': `${props.transitionMs}ms`,
    overflow: props.overflow,
    transition: transition.value,
    position: isModal.value ? 'fixed' : 'relative',
    zIndex: isModal.value ? props.zIndex : undefined,
  }
})

function onScrimClick() {
  emit('update:shown', false)
  emit('dismiss')
}
</script>
