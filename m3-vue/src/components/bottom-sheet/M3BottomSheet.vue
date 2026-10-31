<template>
    <M3Surface
        v-if="surfaceMounted"
        :id="_id"
        :shown="true"
        :scrim="variant === 'modal'"
        :scrim-shown="variant === 'modal' && visible"
        :fill-height="false"
        :rounding-top-left="28"
        :rounding-top-right="28"
        :rounding-bottom-left="0"
        :rounding-bottom-right="0"
        :transition-ms="TRANSITION_MS"
        :transition-timing="easing.emphasized"
        :class="surfaceClass"
        :aria-modal="variant === 'modal' ? 'true' : 'false'"
        role="dialog"
        height="var(--m3-bottom-sheet-height, 0px)"
        tag="div"
        mode="modal"
        anchor="bottom"
        overflow="hidden"
        variant="surface-container-low"
        v-bind="$attrs"
        @update:shown="emit('update:shown', $event)"
        @dismiss="emit('dismiss')"
    >
        <button
            v-if="handle"
            ref="handleElement"
            :aria-label="label"
            :aria-controls="_id + '-content'"
            :aria-expanded="expandedActual"
            type="button"
            class="m3-bottom-sheet__handle"
        />

        <div :id="_id + '-content'" class="m3-bottom-sheet__body">
            <div ref="content" class="m3-bottom-sheet__content">
                <slot />
            </div>
        </div>
    </M3Surface>
</template>

<script lang="ts" setup>
import type { BottomSheetController } from '@modulify/m3-foundation/lib/bottomSheet'
import type {
  BottomSheetVariant,
} from '@modulify/m3-foundation/types/components/bottom-sheet'
import type { PropType } from 'vue'

import {
  computed,
  nextTick,
  ref,
  watch,
} from 'vue'

import { attachBottomSheet } from '@modulify/m3-foundation/lib/bottomSheet'
import { durations, easing } from '@modulify/m3-foundation/lib/motion'

import { M3Surface } from '@/components/surface'
import { useAnimationFrame } from '@/composables/animation'
import { useId } from '@/composables/id'
import { useTimeout } from '@/composables/timing'

defineOptions({ inheritAttrs: false })

const TRANSITION_MS = durations.long2
type TransitionState = 'idle' | 'pre-enter' | 'entering' | 'exiting'

const props = defineProps({
  id: { type: String, default: undefined },
  variant: { type: String as PropType<BottomSheetVariant>, default: 'standard' },
  shown: { type: Boolean, default: false },
  expanded: { type: Boolean, default: false },
  peek: { type: Number, default: undefined },
  handle: { type: Boolean, default: true },
  label: { type: String, default: 'Resize bottom sheet' },
})

const emit = defineEmits<{
  'update:shown': [shown: boolean];
  'update:expanded': [expanded: boolean];
  dismiss: [];
}>()

const _id = useId('m3-bottom-sheet', computed(() => props.id))
const surfaceMounted = ref(props.shown)
const transitionState = ref<TransitionState>('idle')
const expandedActual = ref(props.expanded)
const content = ref<HTMLElement | null>(null)
const handleElement = ref<HTMLButtonElement | null>(null)
const transitionFrame = useAnimationFrame()
const enterTimeout = useTimeout(() => transitionState.value = 'idle', TRANSITION_MS)
const leaveTimeout = useTimeout(() => {
  surfaceMounted.value = false
  transitionState.value = 'idle'
}, TRANSITION_MS)
let controller: BottomSheetController | null = null

const visible = computed(() => props.shown && transitionState.value !== 'pre-enter' && transitionState.value !== 'exiting')
const surfaceClass = computed(() => ({
  'm3-bottom-sheet': true,
  'm3-bottom-sheet_pre-enter': transitionState.value === 'pre-enter',
  'm3-bottom-sheet_exiting': transitionState.value === 'exiting',
}))

function updateExpanded(next: boolean) {
  expandedActual.value = next
  emit('update:expanded', next)
}

function dismiss() {
  emit('update:shown', false)
  emit('dismiss')
}

function cancelTransition() {
  transitionFrame.cancel()
  enterTimeout.cancel()
  leaveTimeout.cancel()
}

async function enterSurface() {
  cancelTransition()
  surfaceMounted.value = true
  transitionState.value = 'pre-enter'

  await nextTick()
  transitionFrame.request(() => {
    transitionState.value = 'entering'
    enterTimeout.schedule()
  })
}

async function leaveSurface() {
  if (!surfaceMounted.value) return

  cancelTransition()
  transitionState.value = 'exiting'
  leaveTimeout.schedule()
}

defineExpose({
  get el () { return document.getElementById(_id.value) },
  show: () => emit('update:shown', true),
  hide: () => emit('update:shown', false),
  expand: () => controller?.expand(),
  collapse: () => controller?.collapse(),
})

watch(() => props.shown, shown => {
  void (shown ? enterSurface() : leaveSurface())
}, { immediate: true })

watch([content, handleElement, surfaceMounted], ([node, button, mounted], _, onCleanup) => {
  if (!mounted || !node || (props.handle && !button)) return
  const panel = node.closest<HTMLElement>('.m3-bottom-sheet')
  if (!panel) return

  const active = attachBottomSheet({
    panel,
    content: node,
    handle: button,
    variant: props.variant,
    visible: visible.value,
    expanded: props.expanded,
    peek: props.peek,
    onExpand: updateExpanded,
    onDismiss: dismiss,
  })
  controller = active
  onCleanup(() => {
    active.dispose()
    if (controller === active) controller = null
  })
}, { immediate: true, flush: 'post' })

watch([() => props.variant, visible, () => props.expanded, () => props.peek], () => {
  controller?.update({
    variant: props.variant,
    visible: visible.value,
    expanded: props.expanded,
    peek: props.peek,
    onExpand: updateExpanded,
    onDismiss: dismiss,
  })
}, { flush: 'post' })

watch(() => props.expanded, expanded => expandedActual.value = expanded)
</script>
