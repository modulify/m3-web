<template>
    <div
        ref="root"
        class="m3-snackbar-host"
        v-bind="$attrs"
        @mouseenter="pause('hover')"
        @mouseleave="resume('hover')"
        @focusin="pause('focus')"
        @focusout="onFocusOut"
    >
        <span class="m3-snackbar-host__announcement" role="status" aria-live="polite" aria-atomic="true">
            {{ announcement }}
        </span>
        <M3Snackbar
            v-if="display"
            :message="display.entry.options.message"
            :layout="display.entry.options.layout"
            :closable="closable"
            :close-label="display.entry.options.closeLabel"
            :leaving="display.leaving"
            :announce="false"
            @action="finish('action')"
            @dismiss="finish('dismiss')"
        >
            <template v-if="display.entry.action" #action="actionContext">
                <RenderAction :render="display.entry.action" :context="actionContext" />
            </template>
        </M3Snackbar>
    </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'
import type {
  SnackbarActionContext,
  SnackbarActionRenderer,
  SnackbarHostMethods,
  SnackbarOptions,
} from './types'
import type { SnackbarResult } from '@modulify/m3-foundation/types/components/snackbar'

import { computed, defineComponent } from 'vue'
import { isElement, isHTMLElement } from '@modulify/m3-foundation/lib/predicates'
import {
  onBeforeUnmount,
  onMounted,
  ref,
  shallowRef,
} from 'vue'

import { useTimeout } from '@/composables/timing'

import M3Snackbar from './M3Snackbar.vue'

interface Entry {
  options: SnackbarOptions;
  action: SnackbarActionRenderer | null;
  resolve: (result: SnackbarResult) => void;

  trigger: HTMLElement | null;
  nextFocus: HTMLElement | null;

  remaining: number | null;
  startedAt: number;
}

interface Display {
  entry: Entry;
  leaving: boolean;
}

const DEFAULT_DURATION_MS = 6000
const EXIT_TRANSITION_MS = 150

const PAGE_FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')
const SNACKBAR_CONTROLS_SELECTOR = '.m3-snackbar__action, .m3-snackbar__close'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps({
  renderAction: {
    type: Function as PropType<SnackbarActionRenderer>,
    default: undefined,
  },
})

const RenderAction = defineComponent({
  props: {
    render: {
      type: Function as PropType<SnackbarActionRenderer>,
      required: true,
    },

    context: {
      type: Object as PropType<SnackbarActionContext>,
      required: true,
    },
  },

  setup: props => () => props.render(props.context),
})

const root = ref<HTMLDivElement | null>(null)
const display = shallowRef<Display | null>(null)
const announcement = ref('')

const queue: Entry[] = []
let active: Entry | null = null
let leaving: Entry | null = null

let timerRunning = false
const paused = { hover: false, focus: false }
let disposed = false

const durationTimeout = useTimeout(() => {
  timerRunning = false
  finish('timeout')
}, DEFAULT_DURATION_MS)
const exitTimeout = useTimeout((entry: Entry) => {
  restoreFocus(entry)
  leaving = null
  const next = queue.shift()
  if (next) begin(next)
  else {
    display.value = null
    announcement.value = ''
  }
}, EXIT_TRANSITION_MS)

const getNextFocusable = (trigger: HTMLElement | null): HTMLElement | null => {
  if (!trigger) return null
  const elements = Array.from(document.querySelectorAll<HTMLElement>(PAGE_FOCUSABLE_SELECTOR))
  return elements[elements.indexOf(trigger) + 1] ?? null
}

const isFocusable = (element: HTMLElement | null): element is HTMLElement => Boolean(
  element?.isConnected && !element.closest('[inert]') && !element.matches(':disabled')
)

const stopTimer = () => {
  if (!timerRunning) return
  durationTimeout.cancel()
  timerRunning = false
  if (active && active.remaining !== null) {
    active.remaining = Math.max(0, active.remaining - (Date.now() - active.startedAt))
  }
}

const pause = (kind: 'hover' | 'focus') => {
  paused[kind] = true
  stopTimer()
}

const resume = (kind: 'hover' | 'focus') => {
  paused[kind] = false
  if (!active || paused.hover || paused.focus || active.remaining === null) return

  active.startedAt = Date.now()
  timerRunning = true
  durationTimeout.scheduleWithDelay(active.remaining)
}

const restoreFocus = (entry: Entry) => {
  if (!root.value?.contains(document.activeElement)) return
  const target = isFocusable(entry.trigger) ? entry.trigger : isFocusable(entry.nextFocus) ? entry.nextFocus : null
  target?.focus()
}

const begin = (entry: Entry) => {
  active = entry
  paused.hover = false
  paused.focus = false
  display.value = { entry, leaving: false }
  announcement.value = entry.options.message
  if (entry.remaining !== null) {
    entry.startedAt = Date.now()
    timerRunning = true
    durationTimeout.scheduleWithDelay(entry.remaining)
  }
}

const finish = (result: SnackbarResult) => {
  const entry = active
  if (!entry) return
  stopTimer()
  active = null
  leaving = entry
  entry.resolve(result)
  display.value = { entry, leaving: true }
  announcement.value = ''
  exitTimeout.schedule(entry)
}

const makeEntry = (options: SnackbarOptions, resolve: Entry['resolve']): Entry => {
  const activeElement = document.activeElement
  const trigger = isHTMLElement(activeElement) ? activeElement : null
  const action = options.action === undefined ? props.renderAction ?? null : options.action
  const duration = action ? null : options.duration === undefined ? DEFAULT_DURATION_MS : options.duration
  if (duration !== null && (!Number.isFinite(duration) || duration < 0)) {
    throw new RangeError('Snackbar duration must be a non-negative finite number or null')
  }
  return {
    options,
    action,
    resolve,
    trigger,
    nextFocus: getNextFocusable(trigger),
    remaining: duration,
    startedAt: 0,
  }
}

const show: SnackbarHostMethods['show'] = options => new Promise(resolve => {
  if (disposed) {
    resolve('disposed')
    return
  }

  const entry = makeEntry(options, resolve)
  if (active || leaving) queue.push(entry)
  else begin(entry)
})

const replace: SnackbarHostMethods['replace'] = options => new Promise(resolve => {
  if (disposed) {
    resolve('disposed')
    return
  }

  const previous = active ?? leaving
  if (previous) restoreFocus(previous)

  const entry = makeEntry(options, resolve)
  stopTimer()
  exitTimeout.cancel()
  leaving = null
  active?.resolve('replaced')
  begin(entry)
})

const clear = () => {
  queue.splice(0).forEach(entry => entry.resolve('cleared'))
  finish('cleared')
}

const focus = () => {
  if (!active) return
  root.value?.querySelector<HTMLElement>(SNACKBAR_CONTROLS_SELECTOR)?.focus()
}

const onFocusOut = (event: FocusEvent) => {
  if (!isElement(event.relatedTarget) || !root.value?.contains(event.relatedTarget)) resume('focus')
}

const onKeyDown = (event: KeyboardEvent) => {
  if (!event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.key.toLowerCase() !== 'g' || !active) return
  if (!root.value?.querySelector(SNACKBAR_CONTROLS_SELECTOR)) return

  event.preventDefault()
  focus()
}

const closable = computed(() => display.value?.entry.options.closable
  ?? Boolean(display.value?.entry.action || display.value?.entry.remaining === null))

onMounted(() => document.addEventListener('keydown', onKeyDown))
onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeyDown)
  disposed = true
  stopTimer()
  exitTimeout.cancel()
  active?.resolve('disposed')
  queue.splice(0).forEach(entry => entry.resolve('disposed'))
  active = null
  leaving = null
})

defineExpose({ show, replace, dismiss: () => finish('dismiss'), clear, focus } satisfies SnackbarHostMethods)
</script>
