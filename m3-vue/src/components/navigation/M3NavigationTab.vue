<template>
    <div
        :id="id"
        :class="{
            ['m3-navigation-tab']: true,
            ['m3-navigation-tab_in-' + appearance]: true,
            ['m3-navigation-tab_labelled']: 'label' in $slots || label.length > 0,
            ['m3-navigation-tab_active']: active,
        }"
        v-bind="{
            ...('aria-label' in $attrs ? {} : { 'aria-labelledby': labelId }),
            ...$attrs,
        }"
        role="tab"
    >
        <M3Link
            ref="button"
            :aria-labelledby="labelId"
            :href="href"
            class="m3-navigation-tab__button"
            @click="onClick"
        >
            <M3Ripple :owner="ref(buttonElement)" centered />

            <span class="m3-navigation-tab__state">
                <span class="m3-navigation-tab__icon">
                    <slot />
                </span>

                <span
                    v-if="('label' in $slots || label.length > 0)"
                    :id="labelIdForDrawer"
                    :aria-hidden="inDrawer ? 'false' : 'true'"
                    class="m3-navigation-tab__label"
                >
                    <slot name="label">{{ label }}</slot>
                </span>

                <span
                    v-if="'badge' in $slots"
                    :aria-hidden="inDrawer ? 'false' : 'true'"
                    class="m3-navigation-tab__badge-label"
                    role="status"
                >
                    <slot name="badge" />
                </span>
            </span>
        </M3Link>

        <div
            v-if="('label' in $slots || label.length > 0)"
            :id="labelIdForRail"
            :aria-hidden="inDrawer ? 'true' : 'false'"
            class="m3-navigation-tab__label"
        >
            <slot name="label">
                {{ label }}
            </slot>
        </div>

        <M3Badge
            v-if="'badge' in $slots || badged"
            :aria-hidden="inDrawer ? 'true' : 'false'"
            :class="{
                'm3-navigation-tab__badge': true,
                'm3-navigation-tab__badge_labelled': 'badge' in $slots,
            }"
        >
            <slot name="badge" />
        </M3Badge>
    </div>
</template>

<script lang="ts" setup>
import type { Ref } from 'vue'
import type { Appearance } from '@modulify/m3-foundation/types/components/navigation'

import { M3Badge } from '@/components/badge'
import { M3Link } from '@/components/link'
import { M3Ripple } from '@/components/ripple'

import { M3NavigationAppearance } from './injections'

import {
  computed,
  inject,
  ref,
} from 'vue'

import makeId from '@/utils/id'

import { provideM3IconAppearance } from '@/components/icon/injections'
import { useBreakpoint } from '@/composables/breakpoint'

const props = defineProps({
  id: {
    type: String,
    default: () => makeId('m3-navigation-item'),
  },

  href: {
    type: String,
    default: undefined,
  },

  label: {
    type: String,
    default: '',
  },

  active: {
    type: Boolean,
    default: false,
  },

  badged: {
    type: Boolean,
    default: false,
  },

  /** Disables default click event handler on button element, useful for programmatic navigation. */
  prevent: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['navigate'])

const appearance = inject<Ref<Appearance>>(M3NavigationAppearance, ref('auto'))
const breakpoint = useBreakpoint()
const button = ref<(typeof M3Link) | null>(null)
const buttonElement = computed(() => button.value?.el())

const inDrawer = computed(() => breakpoint.value.ge('large') || appearance.value === 'drawer')

const labelIdForDrawer = computed(() => props.id + '-label-for-drawer')
const labelIdForRail = computed(() => props.id + '-label-for-rail')
const labelId = computed(() => inDrawer.value ? labelIdForDrawer.value : labelIdForRail.value)

provideM3IconAppearance(() => props.active ? 'filled' : 'outlined')

defineExpose({
  focus: () => button.value?.focus(),
  blur: () => button.value?.blur(),
})

const onClick = (event: MouseEvent) => {
  if (props.prevent) {
    event.preventDefault()
  }

  emit('navigate')
}
</script>