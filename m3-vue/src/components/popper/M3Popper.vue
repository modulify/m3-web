<template>
    <Teleport
        v-if="state.attached"
        :to="container"
    >
        <div
            ref="positioner"
            class="m3-popper-positioner"
        >
            <div
                ref="popper"
                :class="{
                    'm3-popper': true,
                    'm3-popper_animated': animated,
                    'm3-popper_shown': state.shown,
                }"
                v-bind="$attrs"
                @transitionend="state.shown ? $emit('shown') : $emit('hidden')"
            >
                <slot />
            </div>
        </div>
    </Teleport>
</template>

<script lang="ts" setup>
import type {
  PropType,
  Ref,
} from 'vue'

import type {
  Boundary,
  Placement,
  Strategy,
} from '@floating-ui/dom'

import type {
  CloserEvent,
  Delay,
  OverflowBehavior,
  Trigger,
  TriggerSchema,
} from '@modulify/m3-foundation/types/components/popper'

import { Listener } from '@modulify/m3-foundation/lib/popper'
import Scheduler from '@modulify/m3-foundation/lib/Scheduler'

import {
  computed,
  nextTick,
  onActivated,
  onBeforeUnmount,
  onDeactivated,
  onMounted,
  reactive,
  ref,
  watch,
} from 'vue'

import isEqual from 'lodash.isequal'

import { computePosition } from '@modulify/m3-foundation/lib/popper/floating'
import { useAutoUpdate } from './floating'

import { normalizeDelay } from '@modulify/m3-foundation/lib/popper/scheduling'

import {
  isHTMLElement,
  isNull,
  isNumeric,
  isString,
  Or,
} from '@modulify/m3-foundation/lib/predicates'

import {
  isBoundary,
  isDelay,
  isOverflowBehavior,
  isTriggerOptions,
} from '@modulify/m3-foundation/lib/popper/predicates'

import * as globalEvents from '@modulify/m3-foundation/lib/popper/globalEvents'

const props = defineProps({
  target: {
    type: [Function, Object] as PropType<(() => Element | null) | Ref<Element | null>>,
    required: true,
  },

  targetTriggers: {
    type: [Array, Object] as PropType<Trigger[] | TriggerSchema>,
    validator: isTriggerOptions,
    default: (): Trigger[] => ['click'],
  },

  popperTriggers: {
    type: [Array, Object] as PropType<Trigger[] | TriggerSchema>,
    validator: isTriggerOptions,
    default: (): Trigger[] => [],
  },

  shown: {
    type: Boolean,
    default: false,
  },

  hideOnMissClick: {
    type: Boolean,
    default: false,
  },

  placement: {
    type: String as PropType<Placement>,
    default: 'bottom' as Placement,
  },

  strategy: {
    type: String as PropType<Strategy>,
    default: 'absolute' as Strategy,
  },

  boundary: {
    type: null as unknown as PropType<Boundary>,
    validator: isBoundary,
    default: 'clippingAncestors' as Boundary,
  },

  container: {
    type: null as unknown as PropType<string | HTMLElement>,
    validator: Or(isString, isHTMLElement),
    default: 'body',
  },

  offsetMainAxis: {
    type: [Number, String],
    validator: isNumeric,
    default: 8,
  },

  offsetCrossAxis: {
    type: [Number, String],
    validator: isNumeric,
    default: 0,
  },

  overflow: {
    type: Array as PropType<OverflowBehavior[]>,
    validator: isOverflowBehavior,
    default: (): OverflowBehavior[] => ['flip', 'shift', 'hide'],
  },

  delay: {
    type: [Number, String, Object] as PropType<number | string | Delay>,
    validator: isDelay,
    default: 0,
  },

  disabled: {
    type: Boolean,
    default: false,
  },

  animated: {
    type: Boolean,
    default: false,
  },

  detachTimeout: {
    type: null as unknown as PropType<null | number | string>,
    validator: Or(isNull, isNumeric),
    default: 5000,
  },
})

const emit = defineEmits([
  'show',
  'hide',
  'shown',
  'showing',
  'hiding',
  'hidden',
  'dispose',
  'update:shown',
])

const target = computed(() => typeof props.target === 'function' ? props.target() : props.target?.value)
const positioner = ref<HTMLElement | null>(null)
const popper = ref<HTMLElement | null>(null)

const positioning = computed(() => ({
  placement: props.placement,
  strategy: props.strategy,
  boundary: props.boundary,
  overflow: props.overflow,
  offsetMainAxis: Number(props.offsetMainAxis),
  offsetCrossAxis: Number(props.offsetCrossAxis),
}))

const state = reactive({
  attached: false,
  showing: false,
  shown: false,
  hiding: false,
  clicked: false,
  touched: false,
  disposed: true,
})

const delay = computed(() => normalizeDelay(props.delay))

const animationBySide = {
  top: {
    originX: 'center',
    originY: 'bottom',
    enterX: '0px',
    enterY: '-2px',
    scaleX: '0.995',
    scaleY: '0.72',
  },
  bottom: {
    originX: 'center',
    originY: 'top',
    enterX: '0px',
    enterY: '2px',
    scaleX: '0.995',
    scaleY: '0.72',
  },
  left: {
    originX: 'right',
    originY: 'center',
    enterX: '-2px',
    enterY: '0px',
    scaleX: '0.72',
    scaleY: '0.995',
  },
  right: {
    originX: 'left',
    originY: 'center',
    enterX: '2px',
    enterY: '0px',
    scaleX: '0.72',
    scaleY: '0.995',
  },
} as const

const applyAnimationSide = (side: 'top' | 'bottom' | 'left' | 'right') => {
  const style = popper.value?.style
  if (!style) {
    return
  }

  const preset = animationBySide[side]
  style.setProperty('--m3-popper-origin-x', preset.originX)
  style.setProperty('--m3-popper-origin-y', preset.originY)
  style.setProperty('--m3-popper-enter-x', preset.enterX)
  style.setProperty('--m3-popper-enter-y', preset.enterY)
  style.setProperty('--m3-popper-scale-x-hidden', preset.scaleX)
  style.setProperty('--m3-popper-scale-y-hidden', preset.scaleY)
}

const adjust = async () => {
  if (target.value && positioner.value && !state.disposed) {
    const result = await computePosition(positioner.value, target.value, {
      ...positioning.value,
      onReferenceHidden: hide,
    })

    if (props.animated) {
      applyAnimationSide(result.side)
    }
  }
}

const contains = (el: Element | null): boolean => positioner.value?.contains(el) ?? false

const {
  autoAdjustOn,
  autoAdjustOff,
} = useAutoUpdate(target, positioner, adjust)

const showingScheduler = new Scheduler()
const detachScheduler = new Scheduler()

const detach = () => state.attached = false

const doShow = async () => {
  detachScheduler.abort()
  showingScheduler.abort()

  if (!state.shown) {
    await new Promise(resolve => requestAnimationFrame(resolve))

    if (!state.hiding) {
      await adjust()
      autoAdjustOn()

      state.shown = true
      emit('update:shown', true)
    }
  }
}

const doHide = async () => {
  showingScheduler.abort()

  if (!state.shown) {
    return
  }

  autoAdjustOff()

  state.shown = false
  emit('update:shown', false)

  detachScheduler.abort()
  if (props.detachTimeout !== null) {
    detachScheduler.schedule(detach, Number(props.detachTimeout))
  }
}

const show = (immediately = false) => {
  if (state.disposed) {
    return
  }

  state.hiding = false
  state.attached = true

  showingScheduler.schedule(doShow, immediately ? 0 : delay.value.show)

  emit('show')

  state.showing = true
  requestAnimationFrame(() => setTimeout(() => state.showing = false))
}

const hide = (immediately = false, reason: 'generic' | 'by-closer' | 'by-miss-click' = 'generic'): void => {
  state.hiding = true

  showingScheduler.schedule(doHide, immediately ? 0 : delay.value.hide)

  emit('hide', reason)
}

defineExpose({
  adjust,
  contains,
  show,
  hide,
})

const onGlobalTap = async (event: CloserEvent, touch = false) => {
  const captures = state.clicked || contains(event.target as Element)
  await new Promise(resolve => requestAnimationFrame(resolve))

  if (!state.showing && state.shown && (
    props.hideOnMissClick && !captures ||
    event.m3PopperClose && captures ||
    event.m3PopperCloseAll
  )) {
    hide()

    if (touch) {
      state.touched = true
      setTimeout(() => state.touched = false, 300)
    }
  }
}

const onGlobalClick = (event: CloserEvent) => onGlobalTap(event)
const onGlobalTouch = (event: CloserEvent) => onGlobalTap(event, true)
const onGlobalMousedown = (event: Event) => {
  state.clicked = contains(event.target as Element)
}

const onShowTriggered = (event: Event & { processedByM3Popper?: boolean }) => {
  if (!state.shown || state.hiding) {
    event.processedByM3Popper = true
    !state.touched && show()
  }
}

const onHideTriggered = (event: Event & { processedByM3Popper?: boolean }) => {
  if (!event.processedByM3Popper) {
    hide()
  }
}

const targetListener = new Listener(onShowTriggered, onHideTriggered)
const popperListener = new Listener(onShowTriggered, onHideTriggered)

const initialize = (disposed = false): void => {
  if (!disposed) {
    state.disposed = false

    if (target.value) {
      targetListener.start(target.value, props.targetTriggers)
    }

    if (positioner.value) {
      popperListener.start(positioner.value, props.popperTriggers)
    }
  } else {
    state.disposed = true
  }
}

const dispose = () => {
  if (state.disposed) {
    return
  }

  state.disposed = true

  targetListener.stop()
  popperListener.stop()

  hide(true)

  detach()

  emit('dispose')
}

watch(() => props.shown, shown => shown ? show() : hide())
watch(() => target.value, async (newTarget, oldTarget) => {
  if (newTarget !== oldTarget) {
    targetListener.target = newTarget

    if (state.shown) {
      autoAdjustOn()
      await adjust()
    }
  }
})
watch(() => props.targetTriggers, () => targetListener.triggers = props.targetTriggers)
watch(() => props.popperTriggers, () => popperListener.triggers = props.popperTriggers)
watch(() => positioning.value, async (newOptions, oldOptions) => {
  if (!isEqual(newOptions, oldOptions)) {
    await adjust()
  }
})

watch(() => state.attached, (isAttached, wasAttached) => {
  if (isAttached && !wasAttached) {
    nextTick(async () => {
      if (state.shown) {
        autoAdjustOff()
        await adjust()
        autoAdjustOn()
      }
    })
  }
})

watch(() => props.disabled, disabled => {
  if (disabled) {
    dispose()
  } else if (state.disposed) {
    initialize()

    if (props.shown) {
      show()
    }
  }
})

watch(() => props.animated, animated => {
  if (!animated && popper.value) {
    popper.value.style.removeProperty('--m3-popper-origin-x')
    popper.value.style.removeProperty('--m3-popper-origin-y')
    popper.value.style.removeProperty('--m3-popper-enter-x')
    popper.value.style.removeProperty('--m3-popper-enter-y')
    popper.value.style.removeProperty('--m3-popper-scale-x-hidden')
    popper.value.style.removeProperty('--m3-popper-scale-y-hidden')
  }
})

onMounted(() => {
  globalEvents.on('click', onGlobalClick)
  globalEvents.on('mousedown', onGlobalMousedown)
  globalEvents.on('touchend', onGlobalTouch)

  initialize(props.disabled)

  if (props.shown && !props.disabled) {
    show()
  }
})

onActivated(() => props.shown ? show() : hide())

onDeactivated(() => hide())

onBeforeUnmount(() => {
  autoAdjustOff()

  globalEvents.off('click', onGlobalClick)
  globalEvents.off('mousedown', onGlobalMousedown)
  globalEvents.off('touchend', onGlobalTouch)

  dispose()
})
</script>
