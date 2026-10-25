<template>
    <div
        ref="root"
        v-bind="$attrs"
        :aria-valuemin="indeterminate ? undefined : 0"
        :aria-valuemax="indeterminate ? undefined : 100"
        :aria-valuenow="indeterminate ? undefined : progress"
        :class="{
            'm3-progress': true,
            'm3-progress_circular': true,
            'm3-progress_wavy': circularWave,
            'm3-progress_wave-flat': circularWave && !indeterminate && waveAmplitude === 0,
            'm3-progress_indeterminate': indeterminate,
            'm3-progress_empty': !indeterminate && progress === 0,
            'm3-progress_complete': !indeterminate && progress === 100,
            'm3-progress_no-track': !track,
        }"
        :style="{
            '--m3-progress-container-size': `${circularSize}px`,
            '--m3-progress-thickness': `${stroke}px`,
            '--m3-progress-circular-gap': geometry.gap,
        }"
        role="progressbar"
    >
        <svg
            :viewBox="`0 0 ${circularSize} ${circularSize}`"
            class="m3-progress__circular"
            aria-hidden="true"
        >
            <g class="m3-progress__circular-motion">
                <path
                    ref="circularTrack"
                    :d="geometry.trackPath"
                    :stroke-width="stroke"
                    :stroke-dasharray="`${initialGeometry.trackLength} ${100 - initialGeometry.trackLength}`"
                    :stroke-dashoffset="initialGeometry.trackOffset"
                    class="m3-progress__circular-track"
                    pathLength="100"
                    stroke-linecap="round"
                />
                <path
                    ref="activePath"
                    :d="circularWave ? activeWavePath : geometry.path"
                    :stroke-width="stroke"
                    :stroke-dasharray="initialActiveDasharray"
                    :style="!indeterminate && progress === 0 ? { display: 'none' } : undefined"
                    class="m3-progress__circular-active"
                    pathLength="100"
                    stroke-linecap="round"
                />
            </g>
        </svg>
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
  circularProgressGeometry,
  circularProgressSegments,
  circularProgressThickness,
  circularProgressWaveAmplitude,
  circularProgressWavePath,
  progressSize,
  progressValue,
} from '@modulify/m3-foundation/lib/progress'

import { useAnimationFrame } from '@/composables/animation'

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

  size: {
    type: Number,
    default: undefined,
  },

  thickness: {
    type: Number,
    default: undefined,
  },

  track: {
    type: Boolean,
    default: true,
  },
})

const root = ref<HTMLDivElement | null>(null)

defineExpose({ get el () { return root.value } } satisfies ElementReference<HTMLDivElement>)

const activePath = ref<SVGPathElement | null>(null)

const circularTrack = ref<SVGPathElement | null>(null)
const circularSize = computed(() => progressSize(props.size ?? (props.shape === 'wavy' ? 48 : 40)))
const circularWave = computed(() => props.shape === 'wavy')

const progress = computed(() => progressValue(props.value))
const stroke = computed(() => circularProgressThickness(circularSize.value, props.shape === 'wavy', props.thickness))

const waveAmplitude = computed(() => circularProgressWaveAmplitude(progress.value))
const geometry = computed(() => circularProgressGeometry(
  circularSize.value,
  stroke.value,
  progress.value,
  circularWave.value
))
const initialGeometry = computed(() => props.indeterminate
  ? circularProgressGeometry(circularSize.value, stroke.value, 10, circularWave.value)
  : geometry.value)
const initialActiveDasharray = computed(() => circularWave.value
  ? undefined
  : `${initialGeometry.value.activeLength} ${100 - initialGeometry.value.activeLength}`)

let amplitude = waveAmplitude.value

const activeWavePath = computed(() => circularProgressWavePath(
  circularSize.value,
  stroke.value,
  props.indeterminate ? 10 : progress.value,
  props.indeterminate ? 1 : amplitude
))

const frame = useAnimationFrame()
let listeners: AbortController | undefined

const stopMotion = () => {
  frame.cancel()
  listeners?.abort('Progress circle disposed')
  listeners = undefined
}

const startMotion = () => {
  stopMotion()

  if (!root.value || !activePath.value || !circularTrack.value) return

  const container = root.value
  const path = activePath.value
  const trackPath = circularTrack.value
  const svg = path.ownerSVGElement!
  const preference = window.matchMedia?.('(prefers-reduced-motion: reduce)')

  listeners = new AbortController()

  const draw = (time: number) => {
    const reduced = preference?.matches ?? false
    const sweep = props.indeterminate
      ? Number(getComputedStyle(svg).getPropertyValue('--m3-progress-circular-sweep'))
      : progress.value
    const segments = circularProgressSegments(sweep, geometry.value.gap)
    trackPath.setAttribute('stroke-dasharray', `${segments.trackLength} ${100 - segments.trackLength}`)
    trackPath.setAttribute('stroke-dashoffset', String(segments.trackOffset))
    trackPath.setAttribute('opacity', props.indeterminate ? String(Math.min(1, segments.trackLength)) : '1')

    if (circularWave.value) {
      const cssAmplitude = props.indeterminate
        ? ''
        : getComputedStyle(container).getPropertyValue('--m3-progress-wave-amplitude').trim()
      const currentAmplitude = cssAmplitude ? Number(cssAmplitude) : waveAmplitude.value
      amplitude = props.indeterminate ? 1 : reduced ? waveAmplitude.value : currentAmplitude
      path.setAttribute('d', circularProgressWavePath(
        circularSize.value,
        stroke.value,
        sweep,
        amplitude,
        props.indeterminate || reduced ? 0 : time / 1000 % 1
      ))
    } else {
      path.setAttribute('stroke-dasharray', `${segments.activeLength} ${100 - segments.activeLength}`)
    }

    if (!reduced && (props.indeterminate || circularWave.value && (amplitude !== 0 || waveAmplitude.value !== 0))) {
      frame.request(draw)
    }
  }

  preference?.addEventListener('change', () => frame.request(draw), { signal: listeners.signal })
  frame.request(draw)
}

watch([
  circularSize,
  stroke,
  progress,
  circularWave,
  () => props.indeterminate,
], startMotion, { flush: 'post' })

onMounted(startMotion)

onBeforeUnmount(stopMotion)
</script>
