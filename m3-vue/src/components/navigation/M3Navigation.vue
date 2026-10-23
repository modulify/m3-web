<template>
    <Teleport v-if="layerReady" :to="layerHost">
        <Transition name="m3-transition-fade" @after-leave="transitioning = false">
            <div
                v-show="modalExpanded"
                :style="isBarAppearance(appearanceBase) ? { display: 'none' } : undefined"
                class="m3-scrim"
                @click="emit('update:expanded', false)"
            />
        </Transition>

        <div
            ref="modalDialog"
            :role="modalActive ? 'dialog' : undefined"
            :aria-modal="modalActive ? 'true' : undefined"
            :aria-label="modalActive ? modalLabel : undefined"
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
                    ['m3-navigation_bar']: isBarAppearance(appearanceActual),
                    ['m3-navigation_' + alignment]: true,
                    ['m3-navigation_modal']: view.modal,
                    ['m3-navigation_hide-collapsed']: appearanceBase === 'rail' && collapse === 'hidden',
                    ['m3-navigation_rail-leaving']: railLeaving,
                    ['m3-navigation_rail-hidden']: view.hidden,
                }"
            >
                <div v-if="'top' in $slots" class="m3-navigation__top">
                    <slot :view="view" name="top" />
                </div>

                <div v-if="'header' in $slots" class="m3-navigation__header">
                    <slot :view="view" name="header" />
                </div>

                <div class="m3-navigation__body">
                    <M3NavigationSection>
                        <template v-if="'subheader' in $slots" #header>
                            <slot :view="view" name="subheader" />
                        </template>

                        <slot :view="view" />
                    </M3NavigationSection>

                    <slot :view="view" name="sections" />
                </div>
            </nav>
        </div>
    </Teleport>
</template>

<script lang="ts" setup>
import type {
  Appearance,
  AutoAppearance,
  NavigationView,
} from '@modulify/m3-foundation/types/components/navigation'
import type { PropType } from 'vue'
import type { RailCollapse } from '@modulify/m3-foundation/types/components/navigation'
import type {
  RailExpandedMode,
} from '@modulify/m3-foundation/types/components/navigation'
import type { VNode } from 'vue'

import { activateModalFocus } from '@modulify/m3-foundation/lib/modal'
import { computed } from 'vue'
import {
  isBarAppearance,
  isExpandableAppearance,
  isExpandedRail,
  isHiddenRail,
  isModalExpansion,
} from '@modulify/m3-foundation/lib/navigation'
import { ref } from 'vue'
import { resolveNavigationAppearance } from '@modulify/m3-foundation/lib/navigation'
import { useAttrs, watch } from 'vue'

import { useBreakpoint } from '@/composables/breakpoint'
import { useLayerHost } from '@/composables/layers'

import M3NavigationSection from './M3NavigationSection.vue'

import { provideM3NavigationAppearance } from './injections'

const props = defineProps({
  appearance: {
    type: String as PropType<Appearance>,
    default: 'auto',
  },

  appearances: {
    type: Array as unknown as PropType<readonly [AutoAppearance, ...AutoAppearance[]]>,
    default: undefined,
  },

  expansion: {
    type: String as PropType<RailExpandedMode>,
    default: 'auto',
  },

  collapse: {
    type: String as PropType<RailCollapse>,
    default: 'rail',
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

defineSlots<{
  default?: (props: { view: NavigationView }) => VNode[]
  top?: (props: { view: NavigationView }) => VNode[]
  header?: (props: { view: NavigationView }) => VNode[]
  subheader?: (props: { view: NavigationView }) => VNode[]
  sections?: (props: { view: NavigationView }) => VNode[]
}>()

const attrs = useAttrs()
const breakpoint = useBreakpoint()

const appearanceBase = computed(() => props.appearance === 'auto'
  ? resolveNavigationAppearance(breakpoint.value.name, props.appearances)
  : props.appearance)
const transitioning = ref(isModalExpansion(appearanceBase.value, props.expanded, props.expansion, breakpoint.value.ge('large')))

const appearanceActual = computed(() => isExpandedRail(appearanceBase.value, props.expanded)
  || isHiddenRail(appearanceBase.value, props.expanded, props.collapse) && transitioning.value
  ? 'rail-expanded'
  : appearanceBase.value)

const modalDialog = ref<HTMLElement | null>(null)
const modalExpanded = computed(() => isModalExpansion(appearanceBase.value, props.expanded, props.expansion, breakpoint.value.ge('large')))
const modalActive = computed(() => isExpandableAppearance(appearanceBase.value)
  && (isModalExpansion(appearanceBase.value, props.expanded, props.expansion, breakpoint.value.ge('large')) || transitioning.value))
const modalLabel = computed(() => typeof attrs['aria-label'] === 'string' ? attrs['aria-label'] : 'Navigation')

const { host: layerHost, ready: layerReady } = useLayerHost(() => modalActive.value)

const railHidden = computed(() => isHiddenRail(appearanceBase.value, props.expanded, props.collapse))
const railLeaving = computed(() => isHiddenRail(appearanceBase.value, props.expanded, props.collapse) && transitioning.value)

const view = computed<NavigationView>(() => ({
  appearance: appearanceActual.value,
  modal: modalActive.value,
  hidden: railHidden.value && !railLeaving.value,
}))

const navAriaHidden = computed(() => isHiddenRail(appearanceBase.value, props.expanded, props.collapse)
  ? 'true'
  : attrs['aria-hidden'] === true || attrs['aria-hidden'] === 'true' ? 'true' : attrs['aria-hidden'] === false || attrs['aria-hidden'] === 'false' ? 'false' : undefined)
const navInert = computed(() => isHiddenRail(appearanceBase.value, props.expanded, props.collapse)
  || attrs.inert === true || attrs.inert === '' || attrs.inert === 'true' ? true : undefined)

const navigation = ref<HTMLElement | null>(null)

provideM3NavigationAppearance(() => appearanceActual.value)

watch(modalExpanded, expanded => {
  if (expanded) {
    transitioning.value = true
  }
})

watch([appearanceBase, () => props.expanded], ([appearance, expanded], previous) => {
  if (!isExpandableAppearance(appearance)
    || (previous && previous[0] !== appearance && !modalExpanded.value)) transitioning.value = false
  if (isBarAppearance(appearance) && expanded) emit('update:expanded', false)
}, { immediate: true })

watch([modalDialog, modalActive, layerReady], ([dialog, active, ready], _, onCleanup) => {
  if (!dialog || !active || !ready || !layerHost) return

  onCleanup(activateModalFocus({
    dialog,
    layer: layerHost,
    onEscape: () => emit('update:expanded', false),
  }))
}, { immediate: true, flush: 'post' })

watch([navigation, appearanceActual], ([element, appearance], _, onCleanup) => {
  if (!element || !isBarAppearance(appearance) || typeof ResizeObserver === 'undefined') {
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
