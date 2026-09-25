<template>
    <component
        :is="tag"
        :id="id"
        ref="root"
        :class="surfaceClass"
        :style="surfaceStyle"
        v-bind="attrs"
    >
        <slot />
    </component>
</template>

<script lang="ts" setup>
import type { ElementReference } from '@modulify/m3-foundation/types/dom'

import { computed, ref, useAttrs } from 'vue'

import { getSurfacePanelClass, getSurfacePanelStyle, surfacePanelProps } from './shared'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps(surfacePanelProps)

const attrs = useAttrs()
const root = ref<HTMLElement | null>(null)

defineExpose({
  get el () { return root.value },
} satisfies ElementReference<HTMLElement>)

const surfaceClass = computed(() => getSurfacePanelClass(props.elevation, props.variant))
const surfaceStyle = computed(() => getSurfacePanelStyle({
  fillWidth: props.fillWidth,
  fillHeight: props.fillHeight,
  width: props.width,
  height: props.height,
  minWidth: props.minWidth,
  maxWidth: props.maxWidth,
  minHeight: props.minHeight,
  maxHeight: props.maxHeight,
  rounding: props.rounding,
  roundingTopLeft: props.roundingTopLeft,
  roundingTopRight: props.roundingTopRight,
  roundingBottomRight: props.roundingBottomRight,
  roundingBottomLeft: props.roundingBottomLeft,
  transitionMs: props.transitionMs,
  transitionTiming: props.transitionTiming,
  overflow: props.overflow,
}))
</script>
