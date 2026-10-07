<template>
    <div
        :id="rootId"
        v-bind="$attrs"
        :class="{ 'm3-search': true, 'm3-search_open': open }"
    >
        <div ref="bar" class="m3-search__bar">
            <div v-if="'leading' in $slots" class="m3-search__leading">
                <slot name="leading" />
            </div>
            <button
                :aria-label="accessibleName"
                :aria-expanded="open"
                :aria-controls="open ? viewId : undefined"
                type="button"
                class="m3-search__trigger"
                aria-haspopup="dialog"
                @click="emit('update:open', true)"
            >
                <span v-if="!('leading' in $slots)" class="m3-search__trigger-icon">
                    <M3Icon name="search" aria-hidden="true" />
                </span>
                <span
                    :class="{
                        'm3-search__trigger-text': true,
                        'm3-search__trigger-text_filled': query.length > 0,
                    }"
                >{{ query || displayHint }}</span>
            </button>
            <div v-if="'trailing' in $slots" class="m3-search__trailing">
                <slot name="trailing" />
            </div>
        </div>
    </div>

    <Teleport to="body">
        <Transition :duration="SEARCH_TRANSITION_MS" name="m3-search">
            <div v-if="open" class="m3-search__overlay">
                <div
                    v-if="resolvedLayout === 'docked'"
                    ref="scrim"
                    class="m3-search__scrim"
                    @click="close"
                />
                <div
                    :id="viewId"
                    ref="dialog"
                    :style="viewStyle"
                    :class="{
                        'm3-search__view': true,
                        ['m3-search__view_' + appearance]: true,
                        ['m3-search__view_' + resolvedLayout]: true,
                    }"
                    :aria-label="label"
                    role="dialog"
                    aria-modal="true"
                    tabindex="-1"
                >
                    <form role="search" class="m3-search__header" @submit.prevent="submit">
                        <M3IconButton :aria-label="backLabel" @click="close">
                            <M3Icon name="arrow_back" />
                        </M3IconButton>
                        <input
                            ref="input"
                            :value="query"
                            :placeholder="displayHint"
                            :aria-label="accessibleName"
                            :aria-controls="resultsId"
                            type="search"
                            class="m3-search__input"
                            @input="onInput"
                            @keydown="onInputKeyDown"
                        />
                        <div class="m3-search__actions">
                            <M3IconButton v-if="query" :aria-label="clearLabel" @click="clear">
                                <M3Icon name="close" />
                            </M3IconButton>
                            <slot name="actions" />
                        </div>
                    </form>
                    <div
                        :id="resultsId"
                        ref="results"
                        class="m3-search__results"
                        tabindex="-1"
                        @keydown="onResultsKeyDown"
                    >
                        <slot name="results" v-bind="resultsContext">
                            <slot />
                        </slot>
                    </div>
                    <div class="m3-search__status" role="status" aria-live="polite">
                        {{ status }}
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script lang="ts" setup>
import type { M3SearchMethods } from './types'
import type { PropType } from 'vue'
import type {
  SearchAnchorRect,
  SearchAppearance,
  SearchDockedPosition,
  SearchLayout,
} from '@modulify/m3-foundation/types/components/search'
import type { SearchResultsContext } from './types'
import type { SearchViewport } from '@modulify/m3-foundation/types/components/search'
import type { VNode } from 'vue'

import { activateModalFocus } from '@modulify/m3-foundation/lib/modal'
import { computed } from 'vue'
import { durations } from '@modulify/m3-foundation/lib/motion'
import { getSearchDockedPosition } from '@modulify/m3-foundation/lib/search'
import { getSearchRevealOrigin } from '@modulify/m3-foundation/lib/search'
import { ref } from 'vue'
import { resolveSearchLayout } from '@modulify/m3-foundation/lib/search'
import { watch } from 'vue'

import { M3Icon } from '@/components/icon'
import { M3IconButton } from '@/components/icon-button'

import { useBreakpoint } from '@/composables/breakpoint'
import { useId } from '@/composables/id'

defineOptions({ inheritAttrs: false })

const SEARCH_TRANSITION_MS = durations.medium2

const props = defineProps({
  id: {
    type: String,
    default: undefined,
  },
  query: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  open: {
    type: Boolean,
    required: true,
  },
  hint: {
    type: String,
    default: undefined,
  },
  backLabel: {
    type: String,
    default: 'Back',
  },
  clearLabel: {
    type: String,
    default: 'Clear search',
  },
  appearance: {
    type: String as PropType<SearchAppearance>,
    default: 'contained',
  },
  layout: {
    type: String as PropType<SearchLayout>,
    default: 'auto',
  },
})

const emit = defineEmits<{
  'update:query': [query: string];
  'update:open': [open: boolean];
  submit: [query: string];
}>()

defineSlots<{
  default?: () => VNode[];
  leading?: () => VNode[];
  trailing?: () => VNode[];
  actions?: () => VNode[];
  results?: (context: SearchResultsContext) => VNode[];
}>()

const bar = ref<HTMLElement | null>(null)
const dialog = ref<HTMLElement | null>(null)
const input = ref<HTMLInputElement | null>(null)
const results = ref<HTMLElement | null>(null)
const scrim = ref<HTMLElement | null>(null)
const position = ref<SearchDockedPosition>({ left: 12, top: 12, width: 360 })
const anchor = ref<SearchAnchorRect>({ left: 12, top: 12, width: 360 })
const viewport = ref<SearchViewport>({ width: 384, height: 640 })

const breakpoint = useBreakpoint()
const rootId = useId('m3-search', computed(() => props.id))
const viewId = computed(() => rootId.value + '-view')
const resultsId = computed(() => rootId.value + '-results')
const resolvedLayout = computed(() => resolveSearchLayout(props.layout, breakpoint.value.name))
const displayHint = computed(() => props.hint ?? props.label)
const accessibleName = computed(() => displayHint.value === props.label ? props.label : `${displayHint.value} ${props.label}`)
const origin = computed(() => getSearchRevealOrigin(anchor.value, viewport.value, position.value, resolvedLayout.value))
const viewStyle = computed(() => ({
  '--m3-search-docked-left': `${position.value.left}px`,
  '--m3-search-docked-top': `${position.value.top}px`,
  '--m3-search-docked-width': `${position.value.width}px`,
  '--m3-search-origin-left': `${origin.value.left}px`,
  '--m3-search-origin-right': `${origin.value.right}px`,
  '--m3-search-origin-offset-y': `${origin.value.offsetY}px`,
}))

const close = () => emit('update:open', false)
const submit = () => {
  emit('submit', props.query)
  results.value?.focus()
}
const clear = () => {
  emit('update:query', '')
  input.value?.focus()
}
const onInput = (event: Event) => emit('update:query', (event.target as HTMLInputElement).value)
const resultsContext = computed<SearchResultsContext>(() => ({ query: props.query, close, submit }))

const resultSelector = 'a[href], button:not(:disabled), [tabindex="0"]'
const focusResult = (last: boolean) => {
  const items = results.value?.querySelectorAll<HTMLElement>(resultSelector)
  const target = last ? items?.[items.length - 1] : items?.[0]
  target?.focus()
}
const onInputKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault()
    focusResult(event.key === 'ArrowUp')
  }
}
const onResultsKeyDown = (event: KeyboardEvent) => {
  if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
  const items = [...(results.value?.querySelectorAll<HTMLElement>(resultSelector) ?? [])]
  const current = items.indexOf(event.target as HTMLElement)
  const next = event.key === 'ArrowDown'
    ? items[Math.min(current + 1, items.length - 1)]
    : items[Math.max(current - 1, 0)]
  if (next) {
    event.preventDefault()
    next.focus()
  }
}

defineExpose<M3SearchMethods>({
  open: () => emit('update:open', true),
  close,
  focus: () => props.open ? input.value?.focus() : bar.value?.querySelector('button')?.focus(),
})

watch([() => props.open, resolvedLayout, bar], ([open, layout], _, onCleanup) => {
  if (!open || !bar.value) return

  const update = () => {
    if (!bar.value) return
    const rect = bar.value.getBoundingClientRect()
    const nextViewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    }
    anchor.value = { left: rect.left, top: rect.top, width: rect.width }
    viewport.value = nextViewport
    if (layout === 'docked') position.value = getSearchDockedPosition(rect, nextViewport)
  }
  const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(update)
  observer?.observe(bar.value)
  window.addEventListener('resize', update)
  window.addEventListener('scroll', update, true)
  update()

  onCleanup(() => {
    observer?.disconnect()
    window.removeEventListener('resize', update)
    window.removeEventListener('scroll', update, true)
  })
}, { immediate: true, flush: 'post' })

watch([() => props.open, dialog], ([open, element], _, onCleanup) => {
  if (!open || !element) return
  onCleanup(activateModalFocus({
    dialog: element,
    exempt: () => [scrim.value],
    onEscape: close,
  }))
  input.value?.focus()
}, { immediate: true, flush: 'post' })
</script>
