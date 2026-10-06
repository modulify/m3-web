<template>
    <Teleport to="body">
        <Transition name="m3-transition-fade" @after-leave="transitioning = false">
            <div
                v-show="modalExpanded"
                ref="scrim"
                :style="appearanceBase === 'bar' ? { display: 'none' } : undefined"
                class="m3-scrim"
                @click="emit('update:expanded', false)"
            />
        </Transition>

        <div
            ref="modalDialog"
            :role="modalActive ? 'dialog' : undefined"
            :aria-modal="modalActive ? 'true' : undefined"
            :aria-label="modalActive ? getModalLabel() : undefined"
            tabindex="-1"
        >
            <nav
                ref="navigation"
                v-bind="$attrs"
                :aria-hidden="navAriaHidden"
                :inert="navInert"
                :class="{
                    ['m3-navigation']: true,
                    ['m3-navigation_' + appearanceActual]: true,
                    ['m3-navigation_bar-vertical']: appearanceActual === 'bar' && barLayout === 'vertical',
                    ['m3-navigation_' + alignment]: true,
                    ['m3-navigation_modal']: modalActive,
                    ['m3-navigation_hide-collapsed']: appearanceBase === 'rail' && hideWhenCollapsed,
                    ['m3-navigation_rail-leaving']: railLeaving,
                    ['m3-navigation_rail-hidden']: railHidden && !railLeaving,
                }"
            >
                <div v-if="'top' in $slots" class="m3-navigation__top">
                    <slot name="top" />
                </div>

                <div v-if="'header' in $slots" class="m3-navigation__header">
                    <slot name="header" />
                </div>

                <div class="m3-navigation__body">
                    <M3NavigationSection>
                        <template v-if="'subheader' in $slots" #header>
                            <slot name="subheader" />
                        </template>

                        <slot />
                    </M3NavigationSection>

                    <slot name="sections" />
                </div>
            </nav>
        </div>
    </Teleport>
</template>

<script lang="ts" setup>
import type {
  Appearance,
  BarLayout,
} from '@modulify/m3-foundation/types/components/navigation'
import type { PropType } from 'vue'
import type {
  RailExpandedMode,
} from '@modulify/m3-foundation/types/components/navigation'

import { activateModalFocus } from '@modulify/m3-foundation/lib/modal'
import {
  computed,
  ref,
  useAttrs,
  watch,
} from 'vue'

import { useBreakpoint } from '@/composables/breakpoint'

import M3NavigationSection from './M3NavigationSection.vue'

import { provideM3NavigationAppearance } from './injections'

const props = defineProps({
  appearance: {
    type: String as PropType<Appearance>,
    default: 'auto',
  },

  barLayout: {
    type: String as PropType<BarLayout>,
    default: 'auto',
  },

  railExpandedMode: {
    type: String as PropType<RailExpandedMode>,
    default: 'auto',
  },

  hideWhenCollapsed: {
    type: Boolean,
    default: false,
  },

  /** Works with appearances 'auto' & 'rail' */
  alignment: {
    type: String as PropType<'top' | 'middle' | 'bottom'>,
    default: 'top',
  },

  expanded: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits([
  'update:expanded',
])

const attrs = useAttrs()
const breakpoint = useBreakpoint()

const appearanceBase = computed(() => props.appearance === 'auto'
  ? breakpoint.value.ge('large') ? 'rail-expanded' : breakpoint.value.ge('expanded') ? 'rail' : 'bar'
  : props.appearance)
const railExpanded = computed(() => appearanceBase.value === 'rail' && props.expanded)
const railHidden = computed(() => appearanceBase.value === 'rail' && props.hideWhenCollapsed && !props.expanded)
const navAriaHidden = computed(() => railHidden.value
  ? 'true'
  : attrs['aria-hidden'] === true || attrs['aria-hidden'] === 'true' ? 'true' : attrs['aria-hidden'] === false || attrs['aria-hidden'] === 'false' ? 'false' : undefined)
const navInert = computed(() => railHidden.value || attrs.inert === true || attrs.inert === '' || attrs.inert === 'true' ? true : undefined)
const modalExpanded = computed(() => (appearanceBase.value === 'drawer' && props.expanded)
  || (railExpanded.value && (props.railExpandedMode === 'modal' || (props.railExpandedMode === 'auto' && !breakpoint.value.ge('large')))))
const transitioning = ref(modalExpanded.value)
const railLeaving = computed(() => railHidden.value && transitioning.value)
const appearanceActual = computed(() => railExpanded.value || railLeaving.value
  ? 'rail-expanded'
  : appearanceBase.value)

const modalDialog = ref<HTMLElement | null>(null)
const modalActive = computed(() => (appearanceBase.value === 'drawer' || appearanceBase.value === 'rail') && (modalExpanded.value || transitioning.value))

const scrim = ref<HTMLElement | null>(null)
const navigation = ref<HTMLElement | null>(null)

provideM3NavigationAppearance(() => appearanceActual.value)

watch(modalExpanded, expanded => {
  if (expanded) {
    transitioning.value = true
  }
})

watch([appearanceBase, () => props.expanded], ([appearance, expanded], previous) => {
  if (appearance !== 'rail' && appearance !== 'drawer'
    || (previous && previous[0] !== appearance && !modalExpanded.value)) transitioning.value = false
  if (appearance === 'bar' && expanded) emit('update:expanded', false)
}, { immediate: true })

const getModalLabel = () => typeof attrs['aria-label'] === 'string' ? attrs['aria-label'] : 'Navigation'

watch([modalDialog, modalActive], ([dialog, active], _, onCleanup) => {
  if (!dialog || !active) return

  onCleanup(activateModalFocus({
    dialog,
    exempt: () => [scrim.value],
    onEscape: () => emit('update:expanded', false),
  }))
}, { immediate: true, flush: 'post' })

watch([navigation, appearanceActual], ([element, appearance], _, onCleanup) => {
  if (!element || appearance !== 'bar' || typeof ResizeObserver === 'undefined') {
    return
  }

  const observer = new ResizeObserver(() => {
    document.documentElement.style.setProperty('--m3-navigation-bar-measured-height', `${element.getBoundingClientRect().height}px`)
  })
  observer.observe(element)

  onCleanup(() => {
    observer.disconnect()
    document.documentElement.style.removeProperty('--m3-navigation-bar-measured-height')
  })
}, { immediate: true, flush: 'post' })
</script>
