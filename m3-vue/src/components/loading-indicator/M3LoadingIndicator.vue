<template>
    <div
        ref="root"
        v-bind="$attrs"
        :class="{
            'm3-loading-indicator': true,
            'm3-loading-indicator_contained': contained,
        }"
        :style="{ '--m3-loading-indicator-size': `${normalizeSize(size)}px` }"
        role="progressbar"
    >
        <svg class="m3-loading-indicator__shape" viewBox="0 0 48 48" aria-hidden="true">
            <g ref="motion">
                <path ref="shape" :d="geometry.path" />
            </g>
        </svg>
    </div>
</template>

<script lang="ts" setup>
import type { ElementReference } from '@modulify/m3-foundation/types/dom'

import { onBeforeUnmount, onMounted, ref } from 'vue'

import { geometryAt, normalizeSize } from '@modulify/m3-foundation/lib/loading-indicator'

import { useAnimationFrame } from '@/composables/animation'

defineOptions({ inheritAttrs: false })

defineProps({
  size: {
    type: Number,
    default: 48,
  },

  contained: {
    type: Boolean,
    default: false,
  },
})

const root = ref<HTMLDivElement | null>(null)
const shape = ref<SVGPathElement | null>(null)
const motion = ref<SVGGElement | null>(null)
const geometry = geometryAt(0)
const frame = useAnimationFrame()

defineExpose({ get el () { return root.value } } satisfies ElementReference<HTMLDivElement>)

let listeners: AbortController | undefined

onMounted(() => {
  const preference = window.matchMedia?.('(prefers-reduced-motion: reduce)')
  listeners = new AbortController()
  let started: number | undefined

  const draw = (time: number) => {
    started ??= time

    const current = geometryAt(preference?.matches ? 0 : time - started)
    shape.value?.setAttribute('d', current.path)
    motion.value?.setAttribute('transform', `rotate(${current.rotation} 24 24)`)

    if (!preference?.matches) frame.request(draw)
  }

  const restart = () => {
    frame.cancel()
    started = undefined
    frame.request(draw)
  }

  preference?.addEventListener('change', restart, { signal: listeners.signal })
  frame.request(draw)
})

onBeforeUnmount(() => {
  frame.cancel()
  listeners?.abort('Loading indicator disposed')
})
</script>
