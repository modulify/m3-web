<template>
    <Teleport to="body">
        <Transition name="m3-transition-fade">
            <div
                v-show="expanded"
                class="m3-scrim"
                @click="emit('update:expanded', false)"
            />
        </Transition>

        <nav
            :class="{
                ['m3-navigation']: true,
                ['m3-navigation_' + appearanceActual]: true,
                ['m3-navigation_' + alignment]: true,
                ['m3-navigation_modal']: expanded || transitioning,
            }"
            v-bind="$attrs"
            @transitionend="expanded ? null : transitioning = false"
        >
            <div v-if="'top' in $slots" class="m3-navigation__top">
                <slot name="top" />
            </div>

            <div v-if="'header' in $slots" class="m3-navigation__header">
                <slot name="header" />
            </div>

            <M3NavigationSection>
                <template v-if="'subheader' in $slots" #header>
                    <slot name="subheader" />
                </template>

                <slot />
            </M3NavigationSection>

            <slot name="sections" />
        </nav>
    </Teleport>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'
import type { Appearance } from '@modulify/m3-foundation/types/components/navigation'

import M3NavigationSection from './M3NavigationSection.vue'

import {
  computed,
  ref,
  watch,
} from 'vue'
import { provideM3NavigationAppearance } from './injections'
import { useBreakpoint } from '@/composables/breakpoint'

const props = defineProps({
  appearance: {
    type: String as PropType<Appearance>,
    default: 'auto',
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

const appearanceActual = computed(() => props.expanded ? 'drawer' : props.appearance)
const breakpoint = useBreakpoint()
const transitioning = ref(props.expanded)

provideM3NavigationAppearance(() => appearanceActual.value)

watch(() => props.expanded, () => {
  if (props.expanded) {
    transitioning.value = true
  }
})

watch(() => breakpoint.value, () => {
  if (props.appearance === 'auto' && breakpoint.value.ge('large')) {
    emit('update:expanded', false)
    transitioning.value = false
  }
})
</script>