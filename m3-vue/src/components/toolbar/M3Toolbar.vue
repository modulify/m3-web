<template>
    <div
        ref="root"
        :aria-label="label"
        :aria-orientation="vertical ? 'vertical' : 'horizontal'"
        :class="{
            'm3-toolbar': true,
            ['m3-toolbar_' + variant]: true,
            ['m3-toolbar_' + color]: true,
            'm3-toolbar_vertical': vertical,
            'm3-toolbar_side-start': vertical && side === 'start',
            'm3-toolbar_hidden': hidden,
            'm3-toolbar_collapsed': collapsed,
        }"
        role="toolbar"
        v-bind="$attrs"
        @focusin="scrollActive = false"
        @keydown="onKeyDown"
    >
        <div :inert="collapsed" class="m3-toolbar__container">
            <div ref="actionGroup" class="m3-toolbar__actions">
                <span
                    v-for="action in shown"
                    :key="action.id"
                    class="m3-toolbar__action"
                >
                    <M3IconButton
                        :aria-label="action.label"
                        :aria-pressed="action.selected"
                        :appearance="action.selected ? 'tonal' : 'standard'"
                        :disabled="action.disabled"
                        @click="action.onClick"
                    >
                        <M3Icon :name="action.icon" />
                    </M3IconButton>
                </span>

                <div ref="custom" class="m3-toolbar__custom">
                    <slot />
                </div>

                <span v-if="excess.length" class="m3-toolbar__action">
                    <M3IconButton
                        ref="overflowButton"
                        :aria-label="overflowLabel"
                        :aria-expanded="menuOpen"
                        aria-haspopup="menu"
                    >
                        <M3Icon name="more_vert" />
                    </M3IconButton>
                </span>
            </div>
        </div>

        <div v-if="hasFab" class="m3-toolbar__fab">
            <slot name="fab" />
        </div>

        <M3Menu
            v-if="excess.length"
            :target="() => overflowButton?.el ?? null"
            :shown="menuOpen"
            class="m3-toolbar__menu"
            @update:shown="menuOpen = $event"
        >
            <M3MenuItem
                v-for="action in excess"
                :key="action.id"
                :selected="action.selected"
                :disabled="action.disabled"
                @click="activateOverflow(action)"
            >
                <template #leading>
                    <M3Icon :name="action.icon" />
                </template>
                {{ action.label }}
            </M3MenuItem>
        </M3Menu>
    </div>
</template>

<script lang="ts" setup>
import type { ElementReference } from '@modulify/m3-foundation/types/dom'
import type { PropType } from 'vue'
import type {
  ToolbarAction,
  ToolbarColor,
  ToolbarOrientation,
  ToolbarScroll,
  ToolbarSide,
  ToolbarVariant,
} from '@modulify/m3-foundation/types/components/toolbar'

import { computed } from 'vue'
import {
  getToolbarScrollState,
  getToolbarVisibleCount,
} from '@modulify/m3-foundation/lib/toolbar'
import {
  onMounted,
  ref,
  useSlots,
  watch,
} from 'vue'

import { M3Icon } from '@/components/icon'
import { M3IconButton } from '@/components/icon-button'
import { M3Menu, M3MenuItem } from '@/components/menu'

import { useResizeObserver } from '@/composables/observer'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  label: { type: String, required: true },
  variant: { type: String as PropType<ToolbarVariant>, default: 'docked' },
  orientation: { type: String as PropType<ToolbarOrientation>, default: 'horizontal' },
  color: { type: String as PropType<ToolbarColor>, default: 'standard' },
  side: { type: String as PropType<ToolbarSide>, default: 'end' },
  scroll: { type: String as PropType<ToolbarScroll>, default: 'pinned' },
  scrollTarget: { type: Object as PropType<HTMLElement | Window | null>, default: null },
  actions: { type: Array as PropType<ToolbarAction[]>, default: (): ToolbarAction[] => [] },
  overflowLabel: { type: String, default: 'More actions' },
})

const slots = useSlots()
const root = ref<HTMLDivElement | null>(null)
const actionGroup = ref<HTMLDivElement | null>(null)
const custom = ref<HTMLDivElement | null>(null)
const overflowButton = ref<InstanceType<typeof M3IconButton> | null>(null)
const visibleCount = ref(props.actions.length)
const scrollActive = ref(false)
const menuOpen = ref(false)

const vertical = computed(() => props.variant === 'floating' && props.orientation === 'vertical')
const hasFab = computed(() => props.variant === 'floating' && 'fab' in slots)
const collapsed = computed(() => props.scroll === 'collapse' && scrollActive.value && hasFab.value)
const hidden = computed(() => props.scroll === 'hide' && scrollActive.value)
const shown = computed(() => props.actions.slice(0, visibleCount.value))
const excess = computed(() => props.actions.slice(visibleCount.value))

defineExpose({
  get el () { return root.value },
} satisfies ElementReference<HTMLDivElement>)

const updateMeasurements = () => {
  const parent = root.value?.parentElement
  if (!parent) return
  const axis = vertical.value ? Math.min(parent.clientHeight || window.innerHeight, window.innerHeight) : parent.clientWidth || window.innerWidth
  const outer = props.variant === 'docked' ? 0 : vertical.value ? 48 : 32
  const padding = props.variant === 'docked' ? 32 : 16
  const customSize = vertical.value
    ? Math.max(custom.value?.scrollHeight ?? 0, custom.value?.offsetHeight ?? 0)
    : Math.max(custom.value?.scrollWidth ?? 0, custom.value?.offsetWidth ?? 0)
  const fabSize = hasFab.value ? 64 : 0
  visibleCount.value = getToolbarVisibleCount(axis - outer - padding, props.actions.length, customSize + fabSize)
  if (props.variant === 'floating' && actionGroup.value) {
    const size = (vertical.value ? actionGroup.value.scrollHeight : actionGroup.value.scrollWidth) + padding
    root.value?.style.setProperty('--m3-toolbar-expanded-size', `${size}px`)
  }
}

const observer = useResizeObserver(() => [root.value?.parentElement ?? null, custom.value], updateMeasurements)

onMounted(() => {
  observer.observe()
  updateMeasurements()
})

watch(() => [props.actions, props.variant, props.orientation], updateMeasurements, { deep: true, flush: 'post' })
watch(visibleCount, updateMeasurements, { flush: 'post' })
watch(excess, value => { if (!value.length) menuOpen.value = false })

watch(() => [props.scroll, props.scrollTarget] as const, (_, __, onCleanup) => {
  if (typeof window === 'undefined') return
  const target = props.scrollTarget ?? window
  const position = () => target === window ? window.scrollY : (target as HTMLElement).scrollTop
  const controller = new AbortController()
  let previous = position()

  const update = () => {
    const current = position()
    scrollActive.value = root.value?.contains(document.activeElement)
      ? false
      : getToolbarScrollState(previous, current, scrollActive.value, props.scroll)
    previous = current
  }

  update()
  target.addEventListener('scroll', update, { passive: true, signal: controller.signal })
  onCleanup(() => controller.abort('Toolbar scroll listener disposed'))
}, { immediate: true })

const activateOverflow = (action: ToolbarAction) => {
  if (!action.disabled) action.onClick()
  menuOpen.value = false
}

const onKeyDown = (event: KeyboardEvent) => {
  const target = event.target as HTMLElement
  if (target.matches('input, textarea, select, [contenteditable="true"]')) return

  const first = vertical.value ? 'ArrowUp' : 'ArrowLeft'
  const last = vertical.value ? 'ArrowDown' : 'ArrowRight'
  if (![first, last, 'Home', 'End'].includes(event.key)) return

  const controls = [...(root.value?.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], input:not(:disabled)') ?? [])]
  const index = controls.indexOf(document.activeElement as HTMLElement)
  if (index === -1 || controls.length === 0) return

  const rtl = !vertical.value && getComputedStyle(root.value!).direction === 'rtl'
  const direction = event.key === first ? -1 : 1
  const next = event.key === 'Home' ? 0 : event.key === 'End' ? controls.length - 1
    : (index + direction * (rtl ? -1 : 1) + controls.length) % controls.length
  controls[next]?.focus()
  event.preventDefault()
}
</script>
