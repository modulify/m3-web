<template>
    <Teleport v-if="isModal" :to="teleportTo">
        <Transition name="m3-transition-fade">
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

import {
  computed,
  useAttrs,
} from 'vue'

import {
  isId,
  isUndefined,
  Or,
} from '@modulify/m3-foundation/lib/predicates'

import useId from '@/composables/id'

defineOptions({
  inheritAttrs: false,
})

type Length = string | number

type SurfaceMode = 'standard' | 'modal'

type SurfaceRole =
  | 'auto'
  | 'surface'
  | 'surface-dim'
  | 'surface-bright'
  | 'surface-container-lowest'
  | 'surface-container-low'
  | 'surface-container'
  | 'surface-container-high'
  | 'surface-container-highest'

type Anchor =
  | 'none'
  | 'center'
  | 'start'
  | 'end'
  | 'top'
  | 'bottom'
  | 'top-start'
  | 'top-end'
  | 'bottom-start'
  | 'bottom-end'

type AnchorStyleFactory = (inset: {
  top: string,
  right: string,
  bottom: string,
  left: string,
}) => Record<string, string>

const MODAL_ANCHOR_STYLE: Record<Anchor, AnchorStyleFactory> = {
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

  elevation: {
    type: Number,
    default: 0,
    validator: (value: number) => Number.isInteger(value) && value >= 0 && value <= 5,
  },

  surfaceRole: {
    type: String as PropType<SurfaceRole>,
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
    type: null as unknown as PropType<Length | null>,
    default: null,
  },

  height: {
    type: null as unknown as PropType<Length | null>,
    default: null,
  },

  minWidth: {
    type: null as unknown as PropType<Length | null>,
    default: null,
  },

  maxWidth: {
    type: null as unknown as PropType<Length | null>,
    default: null,
  },

  minHeight: {
    type: null as unknown as PropType<Length | null>,
    default: null,
  },

  maxHeight: {
    type: null as unknown as PropType<Length | null>,
    default: null,
  },

  rounding: {
    type: null as unknown as PropType<Length>,
    default: 0,
  },

  roundingTopLeft: {
    type: null as unknown as PropType<Length | null>,
    default: null,
  },

  roundingTopRight: {
    type: null as unknown as PropType<Length | null>,
    default: null,
  },

  roundingBottomRight: {
    type: null as unknown as PropType<Length | null>,
    default: null,
  },

  roundingBottomLeft: {
    type: null as unknown as PropType<Length | null>,
    default: null,
  },

  anchor: {
    type: String as PropType<Anchor>,
    default: 'none',
  },

  insetTop: {
    type: null as unknown as PropType<Length>,
    default: 0,
  },

  insetRight: {
    type: null as unknown as PropType<Length>,
    default: 0,
  },

  insetBottom: {
    type: null as unknown as PropType<Length>,
    default: 0,
  },

  insetLeft: {
    type: null as unknown as PropType<Length>,
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
    default: 'cubic-bezier(0.2, 0, 0, 1)',
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

function toLength(value: Length | null | undefined, fallback: string): string {
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

const resolvedRole = computed<Exclude<SurfaceRole, 'auto'>>(() => {
  if (props.surfaceRole !== 'auto') return props.surfaceRole

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
    `border-radius ${duration} ${props.transitionTiming}`,
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
  [`m3-surface_role-${resolvedRole.value}`]: true,
  [`m3-surface_anchor-${props.anchor}`]: true,
  [`m3-surface_elevation-${props.elevation}`]: true,
}))

const surfaceStyle = computed(() => {
  return {
    ...resolvedSizeStyle.value,
    ...cornerRadiusStyle.value,
    ...anchorStyle.value,
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

<style scoped lang="scss">
@use '../../../m3-foundation/assets/stylesheets/basics/palette' as palette;
@use '../../../m3-foundation/assets/stylesheets/themes/dark' as dark;
@use '../../../m3-foundation/assets/stylesheets/themes/light' as light;

.m3-surface {
  --m3-surface-role-surface-bg: var(--m3-sys-surface, #{light.$m3-sys-light-surface});
  --m3-surface-role-surface-dim-bg: var(--m3-sys-surface-container-highest, #{light.$m3-sys-light-surface-container-highest});
  --m3-surface-role-surface-bright-bg: var(--m3-sys-surface-container-low, #{light.$m3-sys-light-surface-container-low});
  --m3-surface-role-container-lowest-bg: var(--m3-sys-surface, #{palette.$m3-palette-neutral-100});
  --m3-surface-role-container-low-bg: var(--m3-sys-surface-container-low, #{light.$m3-sys-light-surface-container-low});
  --m3-surface-role-container-bg: var(--m3-sys-surface-container, #{light.$m3-sys-light-surface-container});
  --m3-surface-role-container-high-bg: var(--m3-sys-surface-container-high, #{light.$m3-sys-light-surface-container-high});
  --m3-surface-role-container-highest-bg: var(--m3-sys-surface-container-highest, #{light.$m3-sys-light-surface-container-highest});
  --m3-surface-elevation-1: var(--m3-elevation-1, #{light.$m3-elevation-light-1});
  --m3-surface-elevation-2: var(--m3-elevation-2, #{light.$m3-elevation-light-2});
  --m3-surface-elevation-3: var(--m3-elevation-3, #{light.$m3-elevation-light-3});
  --m3-surface-elevation-4: var(--m3-elevation-4, #{light.$m3-elevation-light-4});
  --m3-surface-elevation-5: var(--m3-elevation-5, #{light.$m3-elevation-light-5});

  display: block;
  isolation: isolate;
  box-sizing: border-box;

  &_modal {
    max-width: 100vw;
    max-height: 100vh;
  }

  &_role-surface {
    background-color: var(--m3-surface-role-surface-bg);
  }

  &_role-surface-dim               { background-color: var(--m3-surface-role-surface-dim-bg); }
  &_role-surface-bright            { background-color: var(--m3-surface-role-surface-bright-bg); }
  &_role-surface-container-lowest  { background-color: var(--m3-surface-role-container-lowest-bg); }
  &_role-surface-container-low     { background-color: var(--m3-surface-role-container-low-bg); }
  &_role-surface-container         { background-color: var(--m3-surface-role-container-bg); }
  &_role-surface-container-high    { background-color: var(--m3-surface-role-container-high-bg); }
  &_role-surface-container-highest { background-color: var(--m3-surface-role-container-highest-bg); }

  &_elevation-0 { box-shadow: none; }
  &_elevation-1 { box-shadow: var(--m3-surface-elevation-1); }
  &_elevation-2 { box-shadow: var(--m3-surface-elevation-2); }
  &_elevation-3 { box-shadow: var(--m3-surface-elevation-3); }
  &_elevation-4 { box-shadow: var(--m3-surface-elevation-4); }
  &_elevation-5 { box-shadow: var(--m3-surface-elevation-5); }

  &__scrim {
    position: fixed;
    inset: 0;
    background: color-mix(in srgb, var(--m3-sys-shadow, #{palette.$m3-palette-neutral-0}) 38%, transparent);
  }
}

:global(html.m3-theme-dark) .m3-surface {
  --m3-surface-role-surface-bg: var(--m3-sys-surface, #{dark.$m3-sys-dark-surface});
  --m3-surface-role-surface-dim-bg: var(--m3-sys-surface-container-highest, #{dark.$m3-sys-dark-surface-container-highest});
  --m3-surface-role-surface-bright-bg: var(--m3-sys-surface-container-low, #{dark.$m3-sys-dark-surface-container-low});
  --m3-surface-role-container-lowest-bg: var(--m3-sys-surface, #{dark.$m3-sys-dark-surface});
  --m3-surface-role-container-low-bg: var(--m3-sys-surface-container-low, #{dark.$m3-sys-dark-surface-container-low});
  --m3-surface-role-container-bg: var(--m3-sys-surface-container, #{dark.$m3-sys-dark-surface-container});
  --m3-surface-role-container-high-bg: var(--m3-sys-surface-container-high, #{dark.$m3-sys-dark-surface-container-high});
  --m3-surface-role-container-highest-bg: var(--m3-sys-surface-container-highest, #{dark.$m3-sys-dark-surface-container-highest});
  --m3-surface-elevation-1: var(--m3-elevation-1, #{dark.$m3-elevation-dark-1});
  --m3-surface-elevation-2: var(--m3-elevation-2, #{dark.$m3-elevation-dark-2});
  --m3-surface-elevation-3: var(--m3-elevation-3, #{dark.$m3-elevation-dark-3});
  --m3-surface-elevation-4: var(--m3-elevation-4, #{dark.$m3-elevation-dark-4});
  --m3-surface-elevation-5: var(--m3-elevation-5, #{dark.$m3-elevation-dark-5});
}
</style>
