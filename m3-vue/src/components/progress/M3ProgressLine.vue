<template>
    <div
        ref="root"
        v-bind="$attrs"
        :aria-valuemin="indeterminate ? undefined : 0"
        :aria-valuemax="indeterminate ? undefined : 100"
        :aria-valuenow="indeterminate ? undefined : progress"
        :class="{
            'm3-progress': true,
            'm3-progress_linear': true,
            'm3-progress_wavy': shape === 'wavy',
            'm3-progress_indeterminate': indeterminate,
            'm3-progress_empty': !indeterminate && progress === 0,
            'm3-progress_complete': !indeterminate && progress === 100,
            'm3-progress_no-track': !track,
            'm3-progress_no-stop': !stop,
        }"
        :style="{
            '--m3-progress-container-size': `${shape === 'wavy' ? waveHeight : stroke}px`,
            '--m3-progress-thickness': `${stroke}px`,
            '--m3-progress-end': `${progress}%`,
        }"
        role="progressbar"
    >
        <svg
            v-if="indeterminate"
            ref="motion"
            class="m3-progress__linear-motion"
            aria-hidden="true"
        >
            <path
                v-for="index in 3"
                :key="`track-${index}`"
                :stroke-width="stroke"
                class="m3-progress__linear-motion-track"
                stroke-linecap="round"
            />
            <path
                v-for="index in 2"
                :key="`active-${index}`"
                :stroke-width="stroke"
                class="m3-progress__linear-motion-active"
                stroke-linecap="round"
            />
        </svg>

        <template v-else>
            <span class="m3-progress__track" aria-hidden="true" />
            <span class="m3-progress__active" aria-hidden="true">
                <svg
                    v-if="shape === 'wavy'"
                    :height="waveHeight"
                    class="m3-progress__wave"
                    width="8200"
                    aria-hidden="true"
                >
                    <path :d="wavePath" :stroke-width="stroke" fill="none" stroke="currentColor" />
                </svg>
            </span>
            <span class="m3-progress__stop" aria-hidden="true" />
        </template>
    </div>
</template>

<script lang="ts" setup>
import type { ElementReference } from '@modulify/m3-foundation/types/dom'
import type { ProgressShape } from '@modulify/m3-foundation/types/components/progress'
import type { PropType } from 'vue'

import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from 'vue'

import {
  linearIndeterminateGeometry,
  linearProgressSegmentPath,
  linearProgressWavePath,
  progressThickness,
  progressValue,
} from '@modulify/m3-foundation/lib/progress'

import { useAnimationFrame } from '@/composables/animation'
import { useResizeObserver } from '@/composables/observer'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  value: {
    type: Number,
    default: 0,
  },

  indeterminate: {
    type: Boolean,
    default: false,
  },

  shape: {
    type: String as PropType<ProgressShape>,
    default: 'flat',
  },

  thickness: {
    type: Number,
    default: undefined,
  },

  track: {
    type: Boolean,
    default: true,
  },

  stop: {
    type: Boolean,
    default: true,
  },
})

const root = ref<HTMLDivElement | null>(null)
const motion = ref<SVGSVGElement | null>(null)

defineExpose({ get el () { return root.value } } satisfies ElementReference<HTMLDivElement>)

const progress = computed(() => progressValue(props.value))
const stroke = computed(() => progressThickness(props.thickness ?? 4))

const waveHeight = computed(() => stroke.value + 6)
const wavePath = computed(() => linearProgressWavePath(waveHeight.value))

let listeners: AbortController | undefined
let refreshMotion = () => {}

const frame = useAnimationFrame()
const observer = useResizeObserver(root, () => refreshMotion())

const stopMotion = () => {
  frame.cancel()
  observer.unobserve()
  listeners?.abort('Progress line disposed')
  refreshMotion = () => {}
  listeners = undefined
}

const startMotion = () => {
  stopMotion()

  if (!props.indeterminate || !root.value || !motion.value) return

  const container = root.value
  const svg = motion.value
  const tracks = [...svg.querySelectorAll<SVGPathElement>('.m3-progress__linear-motion-track')]
  const active = [...svg.querySelectorAll<SVGPathElement>('.m3-progress__linear-motion-active')]
  const preference = window.matchMedia?.('(prefers-reduced-motion: reduce)')
  const height = props.shape === 'wavy' ? waveHeight.value : stroke.value
  const started = performance.now()

  let width = 0

  listeners = new AbortController()

  const draw = (time: number) => {
    const reduced = preference?.matches ?? false
    const elapsed = reduced ? 875 : time - started
    const geometry = linearIndeterminateGeometry(width, stroke.value, elapsed)
    const phase = reduced ? 0 : elapsed / 1000 * 40

    tracks.forEach((path, index) => {
      path.setAttribute('d', geometry.track[index]
        ? linearProgressSegmentPath(geometry.track[index], height, false)
        : '')
    })
    active.forEach((path, index) => {
      path.setAttribute('d', geometry.active[index]
        ? linearProgressSegmentPath(geometry.active[index], height, props.shape === 'wavy', phase)
        : '')
    })

    if (!reduced) frame.request(draw)
  }

  const refresh = () => {
    width = Math.max(1, container.getBoundingClientRect().width)
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
    frame.request(draw)
  }

  refreshMotion = refresh
  observer.observe()
  preference?.addEventListener('change', refresh, { signal: listeners.signal })
  refresh()
}

watch([
  () => props.indeterminate,
  () => props.shape,
  stroke,
], startMotion, { flush: 'post' })

onMounted(startMotion)

onBeforeUnmount(stopMotion)
</script>
